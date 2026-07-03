#!/usr/bin/env python3
"""
commit-cerebro.py — commit (e push opcional) seletivo multi-repo do cerebro Henrique.

Classifica os arquivos tocados na sessao por repo (submodule pique / super-repo MEU-CEREBRO /
paralelos da allowlist), faz stage SELETIVO (nunca `git add -A`), commita na ordem
paralelos -> pique -> super (com o ponteiro `M pique` capturado explicitamente), e — so com
--push — pusheia pique ANTES do super (se o pique nao subir, o super NAO sobe, pra nao gravar
um ponteiro que o remoto nao tem). Nunca resolve conflito: em rejeite non-fast-forward tenta
`pull --rebase`; se der conflito, `rebase --abort` e reporta.

O DOCUMENTO JSON no stdout E o produto. Push rejeitado / rebase abortado / repo bloqueado
saem com exit 0 e um skip_reason no relatorio — o LLM do /encerrar ramifica pelo JSON.

Uso:
  python commit-cerebro.py --session-id <uuid> --message "<msg>" [--files '<json array>'] \
     [--message-for '<json obj repo->msg>'] [--push] [--dry-run] [--cerebro <path>]
  echo '<json array>' | python commit-cerebro.py --session-id <uuid> --message "<msg>" --files -

Exit codes:
  0 ok (inclusive com skip_reason/unclaimed/blocked — o report esta no stdout)
  2 argumentos invalidos
  3 --files / --message-for invalido (JSON malformado ou tipo errado)
  4 estado invalido irrecuperavel (cerebro nao e repo git; super em detached HEAD)
  6 manifest da sessao ausente E sem --files (nada pra fazer)
  7 erro de IO ao apendar evento no manifest
"""
import argparse
import fnmatch
import io
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from subprocess import CompletedProcess

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
else:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

# ---------------------------------------------------------------------------
# config
# ---------------------------------------------------------------------------

DEFAULT_CEREBRO = r"C:\Users\Henrique Carvalho\Documents\PROGRAMAS\MEU-CEREBRO"
PROGRAMAS_ROOT = r"C:\Users\Henrique Carvalho\Documents\PROGRAMAS"
SUBMODULE_NAME = "pique"

# Paralelos que valem commit autonomo. Casados por basename do toplevel E parent==PROGRAMAS_ROOT.
PARALLEL_ALLOWLIST = {
    "plugin-pique", "plugin-social-media", "plugin-whatsapp",
    "pique-apresentacoes", "pique-consultoria-hub", "yabadoo-brain", "marco-brain",
}
# Push (e commit) so em repo cujo owner do origin seja confiavel. Terceiro/sem-origin -> outside (so reporta).
TRUSTED_OWNERS = {"HENRIQUE4345"}

# Shared-by-design: append-only editado por multiplas sessoes. Nao commitar se colidir com sessao-irma ativa.
SHARED_BASENAMES = {"_mapa.md", "TAREFAS.md", "TASKS.md", "log-do-feito.md", "CLAUDE.md", "melhorias-plugin.md"}
SHARED_RELPATHS = {"pique/infra/melhorias-plugin.md"}
SHARED_GLOBS = {"_tasks-*.md", "_pendencias-*.md"}

GIT_TIMEOUT = 15
NET_TIMEOUT = 90
LOCK_RETRIES = 3
LOCK_DELAY = 0.5
COMMIT_ORDER = ("parallel", "submodule", "super")

ACTIVE_DIR = os.path.expanduser(os.path.join("~", ".claude", "telemetria", "active"))
SESSIONS_DIR = os.path.expanduser(os.path.join("~", ".claude", "telemetria", "sessions"))

# ---------------------------------------------------------------------------
# helpers de saida (molde dos irmaos)
# ---------------------------------------------------------------------------


def emit(doc, code=0):
    print(json.dumps(doc, ensure_ascii=False))
    sys.exit(code)


def err(code, message, **extra):
    doc = {"ok": False, "error": message}
    doc.update(extra)
    emit(doc, code)


def warn(warnings, message):
    warnings.append(message)


def now_utc():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def normp(path):
    """Normaliza pra comparacao case-insensitive: normpath + forward slash + lower, sem barra final."""
    if not path:
        return ""
    p = os.path.normpath(path).replace("\\", "/").rstrip("/")
    return p.lower()


# ---------------------------------------------------------------------------
# wrapper git (nunca levanta)
# ---------------------------------------------------------------------------


def git(args, cwd, timeout=GIT_TIMEOUT):
    try:
        return subprocess.run(
            ["git"] + args, cwd=cwd, capture_output=True, text=True, timeout=timeout,
        )
    except (subprocess.TimeoutExpired, FileNotFoundError, OSError) as e:
        return CompletedProcess(["git"] + args, -1, "", str(e))


def git_out(args, cwd, timeout=GIT_TIMEOUT):
    proc = git(args, cwd, timeout)
    if proc.returncode == 0:
        return proc.stdout.strip()
    return None


def git_toplevel(path):
    return git_out(["rev-parse", "--show-toplevel"], path)


def git_superproject(path):
    # vazio (string "") exceto DENTRO de um submodule, onde devolve o toplevel do super.
    out = git_out(["rev-parse", "--show-superproject-working-tree"], path)
    return out or None


def git_branch(path):
    return git_out(["rev-parse", "--abbrev-ref", "HEAD"], path)


def parse_owner(url):
    if not url:
        return None
    u = re.sub(r"\.git/?$", "", url.strip())
    m = re.search(r"[:/]([^/:]+)/([^/]+)$", u)
    return m.group(1) if m else None


# ---------------------------------------------------------------------------
# manifest da sessao
# ---------------------------------------------------------------------------


def read_jsonl(path):
    out = []
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    out.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    except OSError:
        pass
    return out


def resolve_manifest(session_id):
    active = os.path.join(ACTIVE_DIR, f"{session_id}.jsonl")
    if os.path.isfile(active):
        return active, True
    if os.path.isdir(SESSIONS_DIR):
        try:
            for month in os.listdir(SESSIONS_DIR):
                cand = os.path.join(SESSIONS_DIR, month, f"{session_id}.jsonl")
                if os.path.isfile(cand):
                    return cand, False
        except OSError:
            pass
    return None, False


def collect_files(events, files_arg):
    """Uniao (touches do manifest) + --files, dedup case-insensitive preservando ordem."""
    out = []
    seen = set()
    for e in events:
        if e.get("event") == "touch" and e.get("file"):
            f = e["file"]
            k = normp(f)
            if k and k not in seen:
                seen.add(k)
                out.append(f)
    for f in files_arg:
        if not isinstance(f, str) or not f.strip():
            continue
        k = normp(f)
        if k and k not in seen:
            seen.add(k)
            out.append(f)
    return out


# ---------------------------------------------------------------------------
# classificacao por repo
# ---------------------------------------------------------------------------


def new_repowork(path, role):
    return {
        "path": path.replace("\\", "/"),
        "name": os.path.basename(path.replace("\\", "/").rstrip("/")),
        "role": role,
        "branch": None,
        "has_origin": False,
        "remote_owner": None,
        "unpushed": False,
        "claimed": [],
        "staged": [],
        "shared_blocked": [],
        "unclaimed_dirty": [],
        "committed": None,
        "pushed": False,
        "skip_reason": None,
        "warnings": [],
    }


def relpath_to_repo(f, top):
    try:
        rel = os.path.relpath(f, top)  # ntpath: case-insensitive, tolerante a barras
        return rel.replace("\\", "/")
    except ValueError:
        return os.path.basename(f)


def classify_files(files, cerebro_root, warnings):
    cerebro_norm = normp(cerebro_root)
    programas_norm = normp(PROGRAMAS_ROOT)
    repos = {}          # key = normp(toplevel) -> RepoWork
    outside_files = []  # arquivos que nao caem em repo commitavel

    for f in files:
        d = os.path.dirname(f)
        if not d or not os.path.isdir(d):
            d = f if os.path.isdir(f) else os.path.dirname(f)
        top = git_toplevel(d) if d else None
        if not top:
            outside_files.append({"file": f.replace("\\", "/"), "reason": "not_in_git"})
            continue
        top_norm = normp(top)

        superproj = git_superproject(d)
        if superproj and normp(superproj) == cerebro_norm:
            role = "submodule"
        elif top_norm == cerebro_norm:
            role = "super"
        else:
            base = os.path.basename(top.replace("\\", "/").rstrip("/"))
            parent = normp(os.path.dirname(top.replace("\\", "/").rstrip("/")))
            if base in PARALLEL_ALLOWLIST and parent == programas_norm:
                role = "parallel"
            else:
                role = "outside"

        rw = repos.get(top_norm)
        if rw is None:
            rw = new_repowork(top, role)
            if role == "outside":
                rw["skip_reason"] = "not_in_allowlist"
            repos[top_norm] = rw
        rw["claimed"].append(relpath_to_repo(f, top))

    return repos, outside_files


def enrich_repo(rw):
    path = rw["path"]
    branch = git_branch(path)
    rw["branch"] = branch  # "HEAD" se detached

    origin = git_out(["remote", "get-url", "origin"], path)
    rw["has_origin"] = bool(origin)
    rw["remote_owner"] = parse_owner(origin) if origin else None

    rw["unpushed"] = current_unpushed(path) > 0

    # Rebaixa paralelo de terceiro / sem-origin pra outside (so reporta, nunca commita/pusha).
    if rw["role"] == "parallel" and rw["remote_owner"] not in TRUSTED_OWNERS:
        rw["role"] = "outside"
        rw["skip_reason"] = "third_party_remote" if rw["has_origin"] else "no_origin"

    # Detached HEAD em submodule/paralelo -> nao commita (commit em detached vira lixo).
    if rw["role"] in ("submodule", "parallel") and branch == "HEAD":
        rw["skip_reason"] = "detached_head"


def current_unpushed(path):
    """Nº de commits locais nao presentes no upstream. -1 se nao ha upstream configurado."""
    out = git_out(["rev-list", "--count", "@{u}..HEAD"], path)
    if out is None:
        return -1  # sem upstream (ou HEAD unborn)
    try:
        return int(out)
    except ValueError:
        return -1


# ---------------------------------------------------------------------------
# guarda de compartilhados + unclaimed dirty
# ---------------------------------------------------------------------------


def is_shared(relpath):
    base = os.path.basename(relpath)
    if base in SHARED_BASENAMES:
        return "shared_basename"
    rp = relpath.replace("\\", "/").lower()
    for s in SHARED_RELPATHS:
        sl = s.lower()
        if rp == sl or rp.endswith("/" + sl):
            return "shared_relpath"
    for g in SHARED_GLOBS:
        if fnmatch.fnmatch(base, g):
            return "shared_glob"
    return None


def list_active_manifests():
    if not os.path.isdir(ACTIVE_DIR):
        return []
    out = []
    for name in os.listdir(ACTIVE_DIR):
        if name.endswith(".jsonl"):
            out.append((name[: -len(".jsonl")], os.path.join(ACTIVE_DIR, name)))
    return out


def other_active_sessions_touching(abs_file, my_session_id):
    """session_ids != o meu, vivos em active/, com um touch do mesmo arquivo (case-insensitive)."""
    target = normp(abs_file)
    hits = []
    for sid, path in list_active_manifests():
        if sid == my_session_id:
            continue
        for e in read_jsonl(path):
            if e.get("event") == "touch" and e.get("file") and normp(e["file"]) == target:
                hits.append(sid)
                break
    return hits


def touched_by_append_log_here(abs_file, my_events):
    target = normp(abs_file)
    for e in my_events:
        if (e.get("event") == "touch" and e.get("tool") == "script:append-log"
                and e.get("file") and normp(e["file"]) == target):
            return True
    return False


def guard_shared(rw, my_session_id, my_events):
    """Remove de claimed os shared que colidem com sessao-irma ativa. Conservador: na duvida, bloqueia."""
    kept = []
    for rel in rw["claimed"]:
        if not is_shared(rel):
            kept.append(rel)
            continue
        abs_file = os.path.join(rw["path"], rel)
        others = other_active_sessions_touching(abs_file, my_session_id)
        if others:
            rw["shared_blocked"].append({
                "file": rel,
                "reason": "shared_dirty_other_session",
                "sessions": others,
                "appended_here": touched_by_append_log_here(abs_file, my_events),
            })
        else:
            kept.append(rel)  # sem irma ativa -> seguro (inclui o caso append-log desta sessao)
    rw["claimed"] = kept


def git_status_entries(path):
    """[(xy, new_path, old_path|None)] com core.quotepath=false pra nao escapar acentos.

    Usa git() cru (NAO git_out): git_out faz strip() no output inteiro, o que come o espaco
    lider da coluna X na PRIMEIRA linha e desalinha line[3:]. splitlines preserva cada linha.
    """
    proc = git(["-c", "core.quotepath=false", "status", "--porcelain"], path)
    entries = []
    if proc.returncode != 0 or not proc.stdout:
        return entries
    for line in proc.stdout.splitlines():
        if len(line) < 4:
            continue
        xy = line[:2]
        rest = line[3:]
        if " -> " in rest:
            old, new = rest.split(" -> ", 1)
            entries.append((xy, new.strip(), old.strip()))
        else:
            entries.append((xy, rest, None))
    return entries


def detect_unclaimed_dirty(rw):
    claimed_norm = {normp(os.path.join(rw["path"], c)) for c in rw["claimed"]}
    blocked_norm = {normp(os.path.join(rw["path"], b["file"])) for b in rw["shared_blocked"]}
    # o bump do ponteiro do submodule (pique) e reivindicado pelo super quando ha submodule commitado — trata fora
    for xy, new_path, old_path in git_status_entries(rw["path"]):
        abs_new = normp(os.path.join(rw["path"], new_path))
        if abs_new in claimed_norm or abs_new in blocked_norm:
            continue
        if rw["role"] == "super" and new_path.replace("\\", "/").rstrip("/") == SUBMODULE_NAME:
            continue  # ponteiro do submodule tratado no stage do super
        entry = {"path": new_path.replace("\\", "/"), "xy": xy}
        if old_path is not None:
            entry["renamed_from"] = old_path.replace("\\", "/")
            rw["unclaimed_dirty"].append({"path": old_path.replace("\\", "/"), "xy": xy, "rename_of": new_path})
        rw["unclaimed_dirty"].append(entry)


# ---------------------------------------------------------------------------
# stage / commit / push
# ---------------------------------------------------------------------------


def wait_index_lock(path):
    """True se o repo esta livre; False se o index.lock persiste apos os retries (nunca deleta)."""
    locks = [
        os.path.join(path, ".git", "index.lock"),
        os.path.join(path, ".git", "modules", SUBMODULE_NAME, "index.lock"),
    ]
    for _ in range(LOCK_RETRIES):
        if not any(os.path.exists(l) for l in locks):
            return True
        time.sleep(LOCK_DELAY)
    return not any(os.path.exists(l) for l in locks)


def dirty_rel_set(path):
    return {normp(os.path.join(path, e[1])) for e in git_status_entries(path)}


def wants_pique_bump(rw, submodule_rw):
    """O super so reivindica o ponteiro `pique` se ESTA sessao commitou (ou vai commitar) o submodule."""
    return rw["role"] == "super" and submodule_rw is not None and bool(submodule_rw["committed"])


def compute_staged_preview(rw, submodule_rw):
    dirty = dirty_rel_set(rw["path"])
    staged = [c for c in rw["claimed"] if normp(os.path.join(rw["path"], c)) in dirty]
    if wants_pique_bump(rw, submodule_rw):
        if any(e[1].replace("\\", "/").rstrip("/") == SUBMODULE_NAME for e in git_status_entries(rw["path"])):
            staged.append(SUBMODULE_NAME)
    return staged


def stage_selective(rw, submodule_rw):
    paths = list(rw["claimed"])
    if wants_pique_bump(rw, submodule_rw):
        paths.append(SUBMODULE_NAME)
    if not paths:
        rw["staged"] = []
        return
    proc = git(["add", "--"] + paths, rw["path"])
    if proc.returncode != 0:
        rw["warnings"].append(f"git add falhou: {proc.stderr.strip()[:200]}")
    staged = git_out(["diff", "--cached", "--name-only"], rw["path"])
    rw["staged"] = [s for s in (staged.split("\n") if staged else []) if s.strip()]


def commit_repo(rw, message):
    if not rw["staged"]:
        rw["skip_reason"] = rw["skip_reason"] or "nothing_staged"
        return
    proc = git(["commit", "-m", message], rw["path"])
    if proc.returncode != 0:
        rw["skip_reason"] = "commit_failed"
        rw["warnings"].append(f"git commit falhou: {proc.stderr.strip()[:200]}")
        return
    rw["committed"] = git_out(["rev-parse", "--short", "HEAD"], rw["path"])


def is_worktree_clean(path):
    return not git_status_entries(path)


def pull_rebase(rw):
    """(ok, conflict). Falha do pull -> tenta abort e reporta conflito (nome generico)."""
    proc = git(["pull", "--rebase", "origin", rw["branch"]], rw["path"], NET_TIMEOUT)
    if proc.returncode == 0:
        return True, False
    git(["rebase", "--abort"], rw["path"])  # best-effort; inofensivo se nao ha rebase em curso
    rw["warnings"].append(f"pull --rebase falhou: {proc.stderr.strip()[:200]}")
    return False, True


def push_repo(rw):
    if rw["skip_reason"]:
        return
    if rw["branch"] == "HEAD":
        rw["skip_reason"] = "detached_head"
        return
    if not rw["has_origin"]:
        rw["skip_reason"] = "no_origin"
        return
    if rw["remote_owner"] not in TRUSTED_OWNERS:
        rw["skip_reason"] = "third_party_remote"
        return
    if current_unpushed(rw["path"]) < 0:
        rw["skip_reason"] = "no_upstream"  # nunca faz --set-upstream automatico
        return

    proc = git(["push", "origin", rw["branch"]], rw["path"], NET_TIMEOUT)
    if proc.returncode == 0:
        rw["pushed"] = True
        return

    stderr = (proc.stderr or "")
    rejected = any(t in stderr.lower() for t in ("rejected", "non-fast-forward", "fetch first"))
    if not rejected:
        rw["skip_reason"] = "push_failed"
        rw["warnings"].append(f"git push falhou: {stderr.strip()[:200]}")
        return

    if not is_worktree_clean(rw["path"]):
        rw["skip_reason"] = "rejected_dirty_worktree"
        return

    ok, conflict = pull_rebase(rw)
    if conflict or not ok:
        rw["skip_reason"] = "rebase_conflict"
        return
    proc2 = git(["push", "origin", rw["branch"]], rw["path"], NET_TIMEOUT)
    if proc2.returncode == 0:
        rw["pushed"] = True
    else:
        rw["skip_reason"] = "push_failed"
        rw["warnings"].append(f"git push (pos-rebase) falhou: {(proc2.stderr or '').strip()[:200]}")


# ---------------------------------------------------------------------------
# manifest event + orquestracao
# ---------------------------------------------------------------------------


def order_repos(repos):
    buckets = {r: [] for r in COMMIT_ORDER}
    for rw in repos.values():
        if rw["role"] in buckets:
            buckets[rw["role"]].append(rw)
    ordered = []
    for r in COMMIT_ORDER:
        ordered.extend(buckets[r])
    return ordered


def append_commit_event(manifest_path, processed):
    entry = {
        "event": "commit",
        "ts": now_utc(),
        "tool": "script:commit-cerebro",
        "repos": [
            {"path": rw["name"], "sha": rw["committed"], "pushed": rw["pushed"]}
            for rw in processed if rw["committed"]
        ],
    }
    with open(manifest_path, "a", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def parse_json_arg(raw, label, want):
    if raw is None:
        return want()
    if raw == "-":
        raw = sys.stdin.read()
    try:
        val = json.loads(raw)
    except json.JSONDecodeError as e:
        err(3, f"{label} nao e JSON valido: {e}")
    if not isinstance(val, want):
        err(3, f"{label} deve ser {want.__name__}")
    return val


def main():
    parser = argparse.ArgumentParser(add_help=True)
    parser.add_argument("--session-id", required=True)
    parser.add_argument("--message", required=True)
    parser.add_argument("--files", default=None)
    parser.add_argument("--message-for", default=None)
    parser.add_argument("--push", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--cerebro", default=None)
    args = parser.parse_args()

    if not args.message.strip():
        err(2, "--message vazio")

    cerebro_root = args.cerebro or os.environ.get("CEREBRO_ROOT") or DEFAULT_CEREBRO
    if not os.path.isdir(cerebro_root):
        err(2, f"cerebro root nao existe: {cerebro_root}")
    top = git_toplevel(cerebro_root)
    if not top or normp(top) != normp(cerebro_root):
        err(4, f"cerebro root nao e a raiz de um repo git: {cerebro_root}")

    files_arg = parse_json_arg(args.files, "--files", list)
    message_for = parse_json_arg(args.message_for, "--message-for", dict)

    manifest_path, _active = resolve_manifest(args.session_id)
    if manifest_path is None and not files_arg:
        err(6, f"manifest ausente pra sessao {args.session_id} e sem --files")
    events = read_jsonl(manifest_path) if manifest_path else []

    files = collect_files(events, files_arg)

    warnings = []
    repos, outside_files = classify_files(files, cerebro_root, warnings)

    # Caso submodule-only (edita so docs do pique/): nenhum arquivo do super-repo
    # foi tocado, entao classify_files nao criou o RepoWork "super". Mas commitar o
    # submodule muda o gitlink -> o super PRECISA bumpar o ponteiro, senao fica com
    # 'M pique' pendente (a sujeira que a obra elimina). Cria o super so pro bump.
    has_submodule = any(rw["role"] == "submodule" for rw in repos.values())
    has_super = any(rw["role"] == "super" for rw in repos.values())
    if has_submodule and not has_super:
        cerebro_top = git_toplevel(cerebro_root)
        if cerebro_top:
            repos[normp(cerebro_top)] = new_repowork(cerebro_top, "super")

    for rw in repos.values():
        enrich_repo(rw)

    super_rw = next((rw for rw in repos.values() if rw["role"] == "super"), None)
    if super_rw and super_rw["branch"] == "HEAD":
        err(4, "super-repo em detached HEAD — abortando (bump de ponteiro inseguro)")

    submodule_rw = next((rw for rw in repos.values() if rw["role"] == "submodule"), None)

    for rw in repos.values():
        if rw["role"] in ("submodule", "super", "parallel"):
            guard_shared(rw, args.session_id, events)
            detect_unclaimed_dirty(rw)

    ordered = order_repos(repos)

    for rw in ordered:
        if rw["skip_reason"]:  # ja rebaixado (detached etc) na enriquecimento
            continue
        if not wait_index_lock(rw["path"]):
            rw["skip_reason"] = "git_locked"
            continue
        if args.dry_run:
            rw["staged"] = compute_staged_preview(rw, submodule_rw)
            if rw["staged"]:
                rw["committed"] = "<dry>"  # simula pra o gate/preview do super
            continue
        stage_selective(rw, submodule_rw)
        commit_repo(rw, message_for.get(rw["name"]) or args.message)

    if args.push and not args.dry_run:
        for rw in ordered:
            if rw["skip_reason"] or (rw["committed"] is None and not rw["unpushed"]):
                continue
            if rw["role"] == "super" and submodule_rw is not None:
                sub_on_remote = submodule_rw["pushed"] or current_unpushed(submodule_rw["path"]) == 0
                if not sub_on_remote:
                    rw["skip_reason"] = "skipped_submodule_unpushed"
                    continue
            push_repo(rw)

    processed = [rw for rw in ordered]
    committed_any = any(rw["committed"] and rw["committed"] != "<dry>" for rw in processed)
    staged_any = any(rw["staged"] for rw in processed)
    problems = (
        any(rw["skip_reason"] for rw in processed)
        or any(rw["shared_blocked"] for rw in processed)
        or any(rw["unclaimed_dirty"] for rw in processed)
        or bool(outside_files)
        or any(rw["role"] == "outside" for rw in repos.values())
    )
    pushed_all = (not args.push) or all(rw["pushed"] for rw in processed if rw["committed"] and rw["committed"] != "<dry>")

    if args.dry_run:
        status = "dry_run"
    elif not committed_any and not staged_any:
        status = "noop"
    elif committed_any and not problems:
        status = "committed"
    elif committed_any:
        status = "partial"
    else:
        status = "blocked"

    result = {
        "ok": True,
        "status": status,
        "clean": bool(committed_any and not problems and pushed_all) if not args.dry_run else False,
        "pushed": bool(args.push),
        "repos": processed,
        "outside": [rw for rw in repos.values() if rw["role"] == "outside"] + outside_files,
        "warnings": warnings,
    }

    if committed_any and not args.dry_run and manifest_path:
        try:
            append_commit_event(manifest_path, processed)
        except OSError as e:
            result["warnings"].append(f"falha apendando evento commit no manifest: {e}")
            emit(result, 7)

    emit(result, 0)


if __name__ == "__main__":
    main()
