#!/usr/bin/env python3
"""
append-log.py — apenda entrada em um dos 3 logs acumulativos do cerebro Henrique.

Uso:
  python append-log.py <insights|feito|melhorias> --payload '<json>' [--session-id <uuid>] [--cerebro <path>] [--vocabulario <path>] [--dry-run]
  echo '<json>' | python append-log.py <insights|feito|melhorias> --payload - [--session-id <uuid>] [--cerebro <path>] [--dry-run]

Vocabulario (modos do feito, P/E, categorias de insight e para onde cada uma roteia) vive em
config/vocabulario.json, NAO aqui. Adicionar modo ou categoria e editar JSON, nao codigo.

Exit codes:
  0 ok
  2 argumentos invalidos
  3 payload invalido (JSON malformado ou campos faltando)
  4 vocabulario.json ausente, malformado ou incompleto
  5 (reservado)
  6 arquivo/ancora alvo nao encontrada (LLM precisa criar o arquivo antes)
  7 erro de IO inesperado
"""
import argparse
import io
import json
import os
import re
import sys
from datetime import datetime, timezone

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
else:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

DEFAULT_CEREBRO = r"C:\Users\Henrique Carvalho\Documents\PROGRAMAS\MEU-CEREBRO"

MESES_PT = {
    "01": "jan", "02": "fev", "03": "mar", "04": "abr",
    "05": "mai", "06": "jun", "07": "jul", "08": "ago",
    "09": "set", "10": "out", "11": "nov", "12": "dez",
}

DEFAULT_VOCABULARIO = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..", "config", "vocabulario.json"
)


def emit(doc, code):
    print(json.dumps(doc, ensure_ascii=False))
    sys.exit(code)


def err(code, message, **extra):
    doc = {"ok": False, "error": message}
    doc.update(extra)
    emit(doc, code)


def load_vocabulario(path):
    path = os.path.normpath(path)
    if not os.path.isfile(path):
        err(4, f"vocabulario nao encontrado: {path}")
    try:
        with open(path, "r", encoding="utf-8") as f:
            vocab = json.load(f)
    except json.JSONDecodeError as e:
        err(4, f"vocabulario nao e JSON valido ({path}): {e}")
    except OSError as e:
        err(4, f"erro lendo vocabulario ({path}): {e}")

    modos = vocab.get("feito", {}).get("modos")
    pe = vocab.get("feito", {}).get("pe")
    categorias = vocab.get("insights", {}).get("categorias")
    if not isinstance(modos, list) or not modos:
        err(4, f"vocabulario sem 'feito.modos' (lista nao-vazia): {path}")
    if not isinstance(pe, list) or not pe:
        err(4, f"vocabulario sem 'feito.pe' (lista nao-vazia): {path}")
    if not isinstance(categorias, dict) or not categorias:
        err(4, f"vocabulario sem 'insights.categorias' (objeto categoria->destino): {path}")

    return {"modos": modos, "pe": pe, "categorias": categorias, "_path": path}


def read_payload(args):
    if args.payload is None:
        err(2, "faltou --payload")
    raw = args.payload
    if raw == "-":
        raw = sys.stdin.read()
    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        err(3, f"payload nao e JSON valido: {e}")


def now_local_str(fmt):
    return datetime.now().strftime(fmt)


def touch_manifest(session_id, cerebro_root, target_file, dry_run):
    if not session_id:
        return
    manifest_dir = os.path.expanduser(os.path.join("~", ".claude", "telemetria", "active"))
    manifest_path = os.path.join(manifest_dir, f"{session_id}.jsonl")
    entry = {
        "event": "touch",
        "ts": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "tool": "script:append-log",
        "file": target_file,
    }
    if dry_run:
        return
    try:
        os.makedirs(manifest_dir, exist_ok=True)
        with open(manifest_path, "a", encoding="utf-8", newline="\n") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except OSError:
        pass


# ---------------------------------------------------------------------------
# insights
# ---------------------------------------------------------------------------

def do_insights(payload, cerebro_root, vocab, dry_run):
    required = ["tema", "padrao", "acao", "categoria"]
    missing = [k for k in required if not payload.get(k)]
    if missing:
        err(3, f"payload insights faltando campos: {missing}")
    categorias = vocab["categorias"]
    if payload["categoria"] not in categorias:
        err(3, f"categoria invalida: {payload['categoria']!r} (esperado um de {sorted(categorias)})")

    # o roteamento categoria -> doc mora no vocabulario.json, junto do enum que o valida
    target = os.path.join(cerebro_root, *categorias[payload["categoria"]].split("/"))
    if not os.path.isfile(target):
        err(6, f"arquivo alvo nao existe: {target}")

    with open(target, "r", encoding="utf-8") as f:
        text = f.read()

    if "## Entradas" not in text:
        err(6, f"ancora '## Entradas' nao encontrada em {os.path.basename(target)}")

    ts = payload.get("ts") or now_local_str("%Y-%m-%d %H:%M")
    tema = payload["tema"].strip()
    header = f"### {ts} — {tema}"

    if header in text:
        emit({"ok": True, "status": "dedup_skip", "file": target, "header": header}, 0)

    bloco = (
        f"{header}\n"
        f"**Padrao observado:** {payload['padrao'].strip()}\n"
        f"**Acao sugerida:** {payload['acao'].strip()}\n"
        f"**Categoria:** {payload['categoria']}\n"
    )

    new_text = text.rstrip("\n") + "\n\n" + bloco

    if dry_run:
        emit({"ok": True, "status": "dry_run", "file": target, "header": header, "preview": bloco}, 0)

    with open(target, "w", encoding="utf-8", newline="\n") as f:
        f.write(new_text)

    return target, header


# ---------------------------------------------------------------------------
# feito
# ---------------------------------------------------------------------------

def do_feito(payload, cerebro_root, vocab, dry_run):
    required = ["data", "mes", "tarefa", "inicio_fim", "dur", "modo", "pe"]
    missing = [k for k in required if not payload.get(k)]
    if missing:
        err(3, f"payload feito faltando campos: {missing}")
    if payload["modo"] not in vocab["modos"]:
        err(3, f"modo invalido: {payload['modo']!r} (esperado um de {sorted(vocab['modos'])})")
    if payload["pe"] not in vocab["pe"]:
        err(3, f"pe invalido: {payload['pe']!r} (esperado um de {sorted(vocab['pe'])})")
    if not re.match(r"^\d{4}-\d{2}$", payload["mes"]):
        err(3, f"mes invalido: {payload['mes']!r} (esperado YYYY-MM)")

    target = os.path.join(cerebro_root, "conhecimento", "produtividade", "log-do-feito.md")
    if not os.path.isfile(target):
        err(6, f"arquivo alvo nao existe: {target}")

    with open(target, "r", encoding="utf-8") as f:
        text = f.read()

    data = payload["data"].strip()
    tarefa = payload["tarefa"].strip()
    linha = f"| {data} | {tarefa} | {payload['inicio_fim']} | {payload['dur']} | {payload['modo']} | {payload['pe']} |"

    dedup_key_re = re.compile(
        r"^\|\s*" + re.escape(data) + r"\s*\|\s*" + re.escape(tarefa) + r"\s*\|", re.MULTILINE
    )
    if dedup_key_re.search(text):
        emit({"ok": True, "status": "dedup_skip", "file": target, "data": data, "tarefa": tarefa}, 0)

    secao_header = f"## {payload['mes']}"
    tabela_header = "| Data | Tarefa | Inicio–Fim | Dur | Modo | P/E |"
    tabela_sep = "|------|--------|-----------|-----|------|-----|"

    lines = text.split("\n")
    secao_idx = None
    for i, l in enumerate(lines):
        if l.strip() == secao_header:
            secao_idx = i
            break

    if secao_idx is None:
        # cria nova secao de mes no topo (logo apos o '---' de abertura, ou apos o header do doc)
        insert_at = None
        for i, l in enumerate(lines):
            if l.strip() == "---":
                insert_at = i + 1
                break
        if insert_at is None:
            insert_at = len(lines)
        novo_bloco = ["", secao_header, "", tabela_header, tabela_sep, linha, ""]
        lines = lines[:insert_at] + novo_bloco + lines[insert_at:]
    else:
        # encontra fim da tabela da secao (proxima linha vazia ou proximo '## ' ou EOF)
        j = secao_idx + 1
        # pula ate achar a linha de separador da tabela (|---|) — se nao achar, cria a tabela
        header_idx = None
        for k in range(j, min(j + 5, len(lines))):
            if lines[k].strip().startswith("| Data"):
                header_idx = k
                break
        if header_idx is None:
            # secao existe mas sem tabela ainda
            insert_at = secao_idx + 1
            while insert_at < len(lines) and lines[insert_at].strip() == "":
                insert_at += 1
            novo_bloco = [tabela_header, tabela_sep, linha]
            lines = lines[:insert_at] + novo_bloco + lines[insert_at:]
        else:
            sep_idx = header_idx + 1
            table_end = sep_idx + 1
            while table_end < len(lines) and lines[table_end].strip().startswith("|"):
                table_end += 1
            lines = lines[:table_end] + [linha] + lines[table_end:]

    new_text = "\n".join(lines)

    if dry_run:
        emit({"ok": True, "status": "dry_run", "file": target, "linha": linha}, 0)

    with open(target, "w", encoding="utf-8", newline="\n") as f:
        f.write(new_text)

    return target, linha


# ---------------------------------------------------------------------------
# melhorias
# ---------------------------------------------------------------------------

def do_melhorias(payload, cerebro_root, dry_run):
    required = ["data", "skill", "itens"]
    missing = [k for k in required if not payload.get(k)]
    if missing:
        err(3, f"payload melhorias faltando campos: {missing}")
    if not isinstance(payload["itens"], list) or not payload["itens"]:
        err(3, "itens deve ser lista nao-vazia")

    autor = payload.get("autor", "usuario")
    target = os.path.join(cerebro_root, "pique", "infra", "melhorias-plugin.md")
    if not os.path.isfile(target):
        err(6, f"arquivo alvo nao existe: {target}")

    with open(target, "rb") as f:
        raw = f.read()
    text = raw.decode("utf-8")

    header = f"## {payload['data']} — {payload['skill']} ({autor})"

    lines = text.split("\r\n")

    idx = None
    for i, l in enumerate(lines):
        if l.strip() == header:
            idx = i
            break

    novos_bullets = [f"- {item}" for item in payload["itens"]]

    if idx is not None:
        # bloco do mesmo dia+skill+autor ja existe: apenda so bullets novos ao final do bloco
        j = idx + 1
        existentes = set()
        while j < len(lines) and lines[j].strip().startswith("-"):
            existentes.add(lines[j].strip())
            j += 1
        a_inserir = [b for b in novos_bullets if b.strip() not in existentes]
        if not a_inserir:
            emit({"ok": True, "status": "dedup_skip", "file": target, "header": header}, 0)
        lines = lines[:j] + a_inserir + lines[j:]
        status = "merged"
    else:
        # insere bloco novo no topo, apos o primeiro '---'
        insert_at = None
        for i, l in enumerate(lines):
            if l.strip() == "---":
                insert_at = i + 1
                break
        if insert_at is None:
            err(6, "ancora '---' nao encontrada em melhorias-plugin.md")
        bloco = ["", header] + novos_bullets
        lines = lines[:insert_at] + bloco + lines[insert_at:]
        status = "created"

    new_text = "\r\n".join(lines)

    if dry_run:
        emit({"ok": True, "status": "dry_run", "file": target, "header": header, "bloco_status": status}, 0)

    with open(target, "wb") as f:
        f.write(new_text.encode("utf-8"))

    return target, header, status


def main():
    parser = argparse.ArgumentParser(add_help=True)
    parser.add_argument("tipo", choices=["insights", "feito", "melhorias"])
    parser.add_argument("--payload", default=None)
    parser.add_argument("--session-id", default=None)
    parser.add_argument("--cerebro", default=None)
    parser.add_argument("--vocabulario", default=None)
    parser.add_argument("--dry-run", action="store_true")

    try:
        args = parser.parse_args()
    except SystemExit:
        raise

    cerebro_root = args.cerebro or os.environ.get("CEREBRO_ROOT") or DEFAULT_CEREBRO
    if not os.path.isdir(cerebro_root):
        err(2, f"cerebro root nao existe: {cerebro_root}")

    payload = read_payload(args)
    if not isinstance(payload, dict):
        err(3, "payload deve ser um objeto JSON")

    vocab = None
    if args.tipo in ("insights", "feito"):
        vocab = load_vocabulario(
            args.vocabulario or os.environ.get("PIQUE_VOCABULARIO") or DEFAULT_VOCABULARIO
        )

    try:
        if args.tipo == "insights":
            target, header = do_insights(payload, cerebro_root, vocab, args.dry_run)
            result = {"ok": True, "status": "appended", "file": target, "header": header}
        elif args.tipo == "feito":
            target, linha = do_feito(payload, cerebro_root, vocab, args.dry_run)
            result = {"ok": True, "status": "appended", "file": target, "linha": linha}
        else:
            target, header, status = do_melhorias(payload, cerebro_root, args.dry_run)
            result = {"ok": True, "status": status, "file": target, "header": header}
    except OSError as e:
        err(7, f"erro de IO: {e}")
        return

    touch_manifest(args.session_id, cerebro_root, result["file"], args.dry_run)
    emit(result, 0)


if __name__ == "__main__":
    main()
