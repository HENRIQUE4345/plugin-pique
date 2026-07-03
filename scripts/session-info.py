#!/usr/bin/env python3
"""
session-info.py — consulta o estado das sessoes Claude Code ativas (manifests em ~/.claude/telemetria/active/).

Uso:
  python session-info.py list-active [--cwd <path>] [--max-age-min 30]
  python session-info.py whoami --nonce <str>

Exit codes:
  0 ok
  2 argumentos invalidos
  3 nonce nao encontrado em nenhum manifest
  4 nonce ambiguo (encontrado em 2+ manifests)
"""
import argparse
import io
import json
import os
import sys
import time

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
else:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

ACTIVE_DIR = os.path.expanduser(os.path.join("~", ".claude", "telemetria", "active"))


def emit(doc, code=0):
    print(json.dumps(doc, ensure_ascii=False))
    sys.exit(code)


def read_manifest_lines(path):
    lines = []
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    lines.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    except OSError:
        pass
    return lines


def list_manifests():
    if not os.path.isdir(ACTIVE_DIR):
        return []
    out = []
    for name in os.listdir(ACTIVE_DIR):
        if name.endswith(".jsonl"):
            out.append((name[:-len(".jsonl")], os.path.join(ACTIVE_DIR, name)))
    return out


def cmd_list_active(args):
    now = time.time()
    max_age_sec = args.max_age_min * 60
    sessions = []

    for session_id, path in list_manifests():
        events = read_manifest_lines(path)
        if not events:
            continue

        meta = next((e for e in events if e.get("event") in ("meta", "resume")), None)
        cwd = meta.get("cwd") if meta else None
        started = meta.get("ts") if meta else None

        touches = [e for e in events if e.get("event") == "touch"]
        last_touch_ts = touches[-1]["ts"] if touches else started
        last_files = [t.get("file") for t in touches[-3:] if t.get("file")]

        if args.cwd and cwd != args.cwd:
            continue

        try:
            mtime = os.path.getmtime(path)
            age_sec = now - mtime
        except OSError:
            age_sec = None

        is_stale = age_sec is not None and age_sec > max_age_sec

        sessions.append({
            "session_id": session_id,
            "cwd": cwd,
            "started": started,
            "last_touch_ts": last_touch_ts,
            "last_files": last_files,
            "is_stale": is_stale,
        })

    emit({"ok": True, "sessions": sessions})


def cmd_whoami(args):
    matches = []
    for session_id, path in list_manifests():
        events = read_manifest_lines(path)
        for e in events:
            if e.get("nonce") == args.nonce:
                matches.append(session_id)
                break

    if not matches:
        emit({"ok": False, "error": "nonce nao encontrado", "nonce": args.nonce}, 3)
    if len(matches) > 1:
        emit({"ok": False, "error": "nonce ambiguo", "nonce": args.nonce, "matches": matches}, 4)

    emit({"ok": True, "session_id": matches[0]})


def main():
    parser = argparse.ArgumentParser(add_help=True)
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_list = sub.add_parser("list-active")
    p_list.add_argument("--cwd", default=None)
    p_list.add_argument("--max-age-min", type=int, default=30)

    p_whoami = sub.add_parser("whoami")
    p_whoami.add_argument("--nonce", required=True)

    args = parser.parse_args()

    if args.cmd == "list-active":
        cmd_list_active(args)
    elif args.cmd == "whoami":
        cmd_whoami(args)


if __name__ == "__main__":
    main()
