#!/usr/bin/env python3
"""
telemetria-append.py — deriva e apenda 1 linha no contrato de 14 campos de chats-enriquecidos.jsonl.

Uso:
  python telemetria-append.py --session-id <uuid> --payload '<json>' [--dry-run]
  echo '<json>' | python telemetria-append.py --session-id <uuid> --payload - [--dry-run]

Modo degradado (sem manifest):
  python telemetria-append.py --session-id <uuid> --payload '<json>' --transcript-path <p> --cwd <p> [--dry-run]

Payload (LLM fornece so julgamento semantico):
  {tema, resumo<=120, categoria in {A,B,C}, tags: [...], projeto?}

O script deriva o resto (manifest/transcript/git). Cada derivacao falha isolada -> [] / null + warning,
nunca aborta o append inteiro.

Exit codes:
  0 ok
  2 argumentos invalidos
  3 payload invalido
  4 validacao final do schema (14 chaves) falhou
  7 erro de IO inesperado
"""
import argparse
import io
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
else:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

CATEGORIAS = {"A", "B", "C"}
SCHEMA_KEYS = [
    "ts", "session_id", "cwd", "projeto", "tema", "resumo", "categoria",
    "wall_seconds", "modelos", "primeiro_prompt", "arquivos_tocados",
    "diretorios", "commits", "tags",
]
NON_MODEL_TOKENS = {"<synthetic>"}


def emit(doc, code=0):
    print(json.dumps(doc, ensure_ascii=False))
    sys.exit(code)


def err(code, message, **extra):
    doc = {"ok": False, "error": message}
    doc.update(extra)
    emit(doc, code)


def warn(warnings, message):
    warnings.append(message)


def manifest_path_for(session_id):
    return os.path.expanduser(os.path.join("~", ".claude", "telemetria", "active", f"{session_id}.jsonl"))


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


def load_manifest(session_id, warnings):
    path = manifest_path_for(session_id)
    events = read_jsonl(path)
    if not events:
        warn(warnings, f"manifest vazio ou ausente: {path}")
        return None, events
    return path, events


def derive_from_manifest(events, cwd_hint, warnings):
    cwd = cwd_hint
    transcript_path = None
    try:
        meta = next((e for e in events if e.get("event") in ("meta", "resume") and e.get("cwd")), None)
        if meta:
            cwd = meta.get("cwd") or cwd
            transcript_path = meta.get("transcript_path")
    except Exception as e:
        warn(warnings, f"falha lendo meta do manifest: {e}")

    arquivos = []
    try:
        touches = [e for e in events if e.get("event") == "touch" and e.get("file")]
        seen = set()
        for t in touches:
            f = t["file"]
            rel = relativize(f, cwd) if cwd else f
            if rel not in seen:
                seen.add(rel)
                arquivos.append(rel)
        arquivos = arquivos[:20]
    except Exception as e:
        warn(warnings, f"falha derivando arquivos_tocados: {e}")
        arquivos = []

    diretorios = []
    try:
        seen_dirs = set()
        for a in arquivos:
            d = os.path.dirname(a).replace("\\", "/")
            if d and not d.endswith("/"):
                d += "/"
            if d and d not in seen_dirs:
                seen_dirs.add(d)
                diretorios.append(d)
        diretorios = diretorios[:10]
    except Exception as e:
        warn(warnings, f"falha derivando diretorios: {e}")
        diretorios = []

    return cwd, transcript_path, arquivos, diretorios


def relativize(path, cwd):
    if not path or not cwd:
        return path
    try:
        norm_path = os.path.normpath(path)
        norm_cwd = os.path.normpath(cwd)
        if norm_path.lower().startswith(norm_cwd.lower()):
            rel = norm_path[len(norm_cwd):].lstrip("\\/")
            return rel.replace("\\", "/")
    except Exception:
        pass
    return path.replace("\\", "/")


def derive_from_transcript(transcript_path, warnings):
    result = {
        "first_ts": None, "last_ts": None, "wall_seconds": None,
        "modelos": [], "primeiro_prompt": None,
    }
    if not transcript_path or not os.path.isfile(transcript_path):
        warn(warnings, f"transcript nao encontrado: {transcript_path}")
        return result

    first_ts = None
    last_ts = None
    modelos = []
    primeiro_prompt = None

    try:
        with open(transcript_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                except json.JSONDecodeError:
                    continue

                if obj.get("isSidechain"):
                    continue

                ts = obj.get("timestamp")
                obj_type = obj.get("type")

                if ts and obj_type in ("user", "assistant"):
                    if first_ts is None:
                        first_ts = ts
                    last_ts = ts

                if obj_type == "assistant":
                    model = obj.get("message", {}).get("model")
                    if model and model not in NON_MODEL_TOKENS and model not in modelos:
                        modelos.append(model)

                if obj_type == "user" and primeiro_prompt is None:
                    content = obj.get("message", {}).get("content")
                    texts = []
                    if isinstance(content, str):
                        texts.append(content)
                    elif isinstance(content, list):
                        for block in content:
                            if isinstance(block, dict) and block.get("type") == "text":
                                texts.append(block.get("text", ""))
                    # texto real do usuario vence; se o turno so tem tags (ex: sessao
                    # aberta direto com um slash-command puro), cai no nome do comando
                    # extraido de <command-name> em vez de pular o turno e perder o inicio.
                    real = None
                    cmd = None
                    for t in texts:
                        stripped = t.strip()
                        if not stripped:
                            continue
                        if stripped.startswith("<"):
                            if cmd is None:
                                m = re.search(r"<command-name>\s*(.*?)\s*</command-name>", stripped, re.DOTALL)
                                if m and m.group(1).strip():
                                    cmd = m.group(1).strip()
                            continue
                        real = stripped
                        break
                    if real is not None:
                        primeiro_prompt = real[:200]
                    elif cmd is not None:
                        primeiro_prompt = cmd[:200]
    except OSError as e:
        warn(warnings, f"erro lendo transcript: {e}")
        return result

    result["first_ts"] = first_ts
    result["last_ts"] = last_ts
    result["modelos"] = modelos
    result["primeiro_prompt"] = primeiro_prompt

    if first_ts and last_ts:
        try:
            t1 = parse_iso(first_ts)
            t2 = parse_iso(last_ts)
            result["wall_seconds"] = max(0, int((t2 - t1).total_seconds()))
        except Exception as e:
            warn(warnings, f"falha calculando wall_seconds: {e}")

    return result


def parse_iso(ts):
    ts = ts.replace("Z", "+00:00")
    return datetime.fromisoformat(ts)


def derive_commits(cwd, first_ts, warnings):
    if not cwd or not first_ts or not os.path.isdir(cwd):
        return []
    try:
        # mantem o 'Z' (marcador UTC) — sem ele, git interpreta --since como horario
        # LOCAL do sistema, deslocando o filtro pelo offset do fuso (bug real: commits
        # feitos ate ~3h depois do first_ts real ficavam excluidos em UTC-3).
        since = first_ts.split(".")[0]
        if not since.endswith("Z"):
            since += "Z"
        proc = subprocess.run(
            ["git", "log", f"--since={since}", "--pretty=%h"],
            cwd=cwd, capture_output=True, text=True, timeout=5,
        )
        if proc.returncode != 0:
            warn(warnings, f"git log falhou: {proc.stderr.strip()[:200]}")
            return []
        commits = [l.strip() for l in proc.stdout.splitlines() if l.strip()]
        return commits[:10]
    except Exception as e:
        warn(warnings, f"falha derivando commits: {e}")
        return []


def derive_projeto(cwd):
    if not cwd:
        return None
    return os.path.basename(os.path.normpath(cwd))


def validate_payload(payload):
    required = ["tema", "resumo", "categoria", "tags"]
    missing = [k for k in required if k not in payload]
    if missing:
        err(3, f"payload faltando campos: {missing}")
    if payload["categoria"] not in CATEGORIAS:
        err(3, f"categoria invalida: {payload['categoria']!r} (esperado A, B ou C)")
    if not isinstance(payload["tags"], list):
        err(3, "tags deve ser lista")
    if len(payload["resumo"]) > 120:
        payload["resumo"] = payload["resumo"][:120]


def enriquecidos_path():
    return os.path.expanduser(os.path.join("~", ".claude", "telemetria", "chats-enriquecidos.jsonl"))


def touch_manifest(session_id, dry_run):
    if not session_id or dry_run:
        return
    path = manifest_path_for(session_id)
    entry = {"event": "telemetria", "ts": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")}
    try:
        with open(path, "a", encoding="utf-8", newline="\n") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except OSError:
        pass


def main():
    parser = argparse.ArgumentParser(add_help=True)
    parser.add_argument("--session-id", required=True)
    parser.add_argument("--payload", default=None)
    parser.add_argument("--transcript-path", default=None)
    parser.add_argument("--cwd", default=None)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if args.payload is None:
        err(2, "faltou --payload")
    raw = args.payload
    if raw == "-":
        raw = sys.stdin.read()
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as e:
        err(3, f"payload nao e JSON valido: {e}")

    if not isinstance(payload, dict):
        err(3, "payload deve ser objeto JSON")

    validate_payload(payload)

    warnings = []
    manifest_path, events = load_manifest(args.session_id, warnings)

    cwd_hint = args.cwd
    transcript_path = args.transcript_path

    if events:
        cwd, tp, arquivos, diretorios = derive_from_manifest(events, cwd_hint, warnings)
        cwd_hint = cwd or cwd_hint
        transcript_path = transcript_path or tp
    else:
        arquivos, diretorios = [], []
        if not transcript_path or not cwd_hint:
            warn(warnings, "modo degradado sem manifest requer --transcript-path e --cwd; derivacoes limitadas")

    transcript_data = derive_from_transcript(transcript_path, warnings)

    commits = derive_commits(cwd_hint, transcript_data["first_ts"], warnings)
    projeto = payload.get("projeto") or derive_projeto(cwd_hint)

    ts = transcript_data["last_ts"] or datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    row = {
        "ts": ts,
        "session_id": args.session_id,
        "cwd": cwd_hint,
        "projeto": projeto,
        "tema": payload["tema"],
        "resumo": payload["resumo"],
        "categoria": payload["categoria"],
        "wall_seconds": transcript_data["wall_seconds"],
        "modelos": transcript_data["modelos"],
        "primeiro_prompt": transcript_data["primeiro_prompt"],
        "arquivos_tocados": arquivos,
        "diretorios": diretorios,
        "commits": commits,
        "tags": payload["tags"],
    }

    missing_keys = [k for k in SCHEMA_KEYS if k not in row]
    if missing_keys:
        err(4, f"schema incompleto, faltando: {missing_keys}")

    line = json.dumps(row, ensure_ascii=False)
    try:
        json.loads(line)
    except json.JSONDecodeError as e:
        err(4, f"linha gerada nao e JSON valido: {e}")

    if args.dry_run:
        emit({"ok": True, "status": "dry_run", "row": row, "warnings": warnings})

    target = enriquecidos_path()
    try:
        os.makedirs(os.path.dirname(target), exist_ok=True)
        with open(target, "a", encoding="utf-8", newline="\n") as f:
            f.write(line + "\n")
    except OSError as e:
        err(7, f"erro de IO ao apendar: {e}")

    touch_manifest(args.session_id, args.dry_run)

    emit({"ok": True, "status": "appended", "file": target, "row": row, "warnings": warnings})


if __name__ == "__main__":
    main()
