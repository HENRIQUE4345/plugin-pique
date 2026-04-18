---
description: Dashboard HTML visual do tempo no Claude Code. Tempo por area do cerebro + insights acionaveis. Le chats-enriquecidos.jsonl e chats.jsonl. Regenera e abre no browser.
argument-hint: "[opcional: hoje | semana | mes — default: mes (30d)]"
---

Dashboard visual do tempo no Claude Code. Periodo pedido: **$ARGUMENTS** (vazio = mes = 30d).

Gera HTML em `~/.claude/telemetria/dashboard.html` e abre no browser. Cards de resumo + insights acionaveis + barra por area + chats em aberto + tabela historico buscavel. V1 minimalista — so dado dos chats enriquecidos. HTML sobrescreve a cada rodada.

## Quando usar

- Quando o usuario pede: "dashboard", "painel de tempo", "me mostra como to gastando tempo"
- Ritual semanal / diario (pode ser chamado dentro de `/pique:review-semanal` ou `/pique:boa-noite` no futuro)
- Conferencia rapida: "em qual area do cerebro meu tempo ta indo?"

## Principios

- **Acao > descricao.** Insight sem acao possivel = cortar.
- **Sobrescreve, nao arquiva.** Arquivo unico. Se quiser o "de ontem", dado bruto ja ta nos JSONL.
- **Falha silenciosa.** Se JSONL vazio, HTML mostra estado vazio mas abre.

---

## Fase 1: Determinar periodo

Parse `$ARGUMENTS`:

| Argumento | dias_back |
|-----------|-----------|
| `hoje` | 1 |
| `semana` | 7 |
| `mes` ou vazio | 30 |

Se vier algo fora disso, tratar como `mes` (default) e avisar 1 linha no output terminal.

---

## Fase 2: Gerar agregacao + HTML (Bash + Python inline)

Rode o script abaixo UMA vez. Ele faz 3 coisas:

1. Le `~/.claude/telemetria/chats-enriquecidos.jsonl` e `~/.claude/telemetria/chats.jsonl`
2. Agrega (cards, areas, cobertura, chats em aberto, rajadas, tabela)
3. Gera `~/.claude/telemetria/dashboard.html` com `<!-- INSIGHTS_PLACEHOLDER -->` como marcador onde os insights vao ser injetados
4. Imprime JSON de agregacao no stdout (voce vai ler pra escrever os insights)

Substitua `__PERIODO__` abaixo pelo valor decidido na Fase 1 (`hoje`, `semana` ou `mes`).

```bash
python << 'PYEOF'
import json, re, os
from datetime import datetime, timezone, timedelta
from collections import defaultdict

PERIODO = "__PERIODO__"
BRT = timezone(timedelta(hours=-3))
HOME = os.path.expanduser("~")
CHATS = os.path.join(HOME, ".claude", "telemetria", "chats.jsonl")
ENR = os.path.join(HOME, ".claude", "telemetria", "chats-enriquecidos.jsonl")
OUT = os.path.join(HOME, ".claude", "telemetria", "dashboard.html")

dias = {"hoje":1, "semana":7, "mes":30}.get(PERIODO, 30)
agora_utc = datetime.now(timezone.utc)
agora_brt = agora_utc.astimezone(BRT)
corte_utc = agora_utc - timedelta(days=dias)

# -- Le enriquecidos do periodo --
# chats-enriquecidos.jsonl tem bug conhecido: campos cwd com `\U`, `\H` etc nao-escapados
# (gerado pelo /pique:encerrar pre-fix). Fallback: sanitizar backslashes invalidos antes do json.loads.
# Evita regex (heredoc Bash corrompe \\ duplo) — usa varredura manual.
BS = chr(92)
VALID_ESC = '"/bfnrtu' + BS

def _fix_escapes(s):
    out = []
    i = 0
    n = len(s)
    while i < n:
        c = s[i]
        if c == BS and i+1 < n and s[i+1] not in VALID_ESC:
            out.append(BS); out.append(BS); i += 1
        else:
            out.append(c); i += 1
    return ''.join(out)

def parse_json_tolerant(line):
    try:
        return json.loads(line)
    except json.JSONDecodeError:
        try:
            return json.loads(_fix_escapes(line))
        except Exception:
            return None

enriquecidos = []
try:
    with open(ENR, encoding="utf-8", errors="replace") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            o = parse_json_tolerant(line)
            if not o or "ts" not in o:
                continue
            try:
                ts = datetime.fromisoformat(o["ts"].replace("Z","+00:00"))
            except Exception:
                continue
            if ts < corte_utc:
                continue
            o["_ts"] = ts
            o["_ts_brt"] = ts.astimezone(BRT)
            enriquecidos.append(o)
except FileNotFoundError:
    pass

# -- Le chats.jsonl (cobertura + em aberto + rajadas) --
starts = {}
ends = {}
starts_raw = []
try:
    with open(CHATS, encoding="utf-8", errors="replace") as f:
        for line in f:
            ev = re.search(r'"event":"([^"]+)"', line)
            ts_m = re.search(r'"ts":"([^"]+)"', line)
            sid_m = re.search(r'"session_id":"([^"]+)"', line)
            cwd_m = re.search(r'"cwd":"([^"]+)"', line)
            if not (ev and ts_m and sid_m):
                continue
            try:
                ts = datetime.fromisoformat(ts_m.group(1).replace("Z","+00:00"))
            except Exception:
                continue
            sid = sid_m.group(1)
            cwd = cwd_m.group(1) if cwd_m else ""
            if ev.group(1) == "start":
                starts[sid] = (ts, cwd)
                starts_raw.append((ts, sid, cwd))
            elif ev.group(1) == "end":
                ends[sid] = (ts, cwd)
except FileNotFoundError:
    pass

# -- Cobertura: enriquecidos / chats longos (>5min) no periodo --
longos = set()
for sid, (st, _) in starts.items():
    if st < corte_utc or sid not in ends:
        continue
    if (ends[sid][0] - st).total_seconds() >= 300:
        longos.add(sid)
enr_sids = {o["session_id"] for o in enriquecidos}
cobertura = (len(enr_sids & longos) / len(longos) * 100) if longos else 0

# -- Chats em aberto (start sem end, ignora <12h) --
em_aberto = []
for sid, (st, cwd) in starts.items():
    if sid in ends:
        continue
    idade_h = (agora_utc - st).total_seconds() / 3600
    if idade_h < 12:
        continue
    proj = os.path.basename(cwd.rstrip("/\\"))
    em_aberto.append({
        "sid": sid[:8],
        "sid_full": sid,
        "projeto": proj,
        "idade_dias": round(idade_h/24, 1),
        "start_brt": st.astimezone(BRT).strftime("%d/%m %H:%M"),
    })
em_aberto.sort(key=lambda x: -x["idade_dias"])

# -- Rajadas (>=3 starts no mesmo segundo + mesmo cwd) --
rajadas = defaultdict(list)
for ts, sid, cwd in starts_raw:
    if ts < corte_utc:
        continue
    rajadas[(ts.strftime("%Y-%m-%dT%H:%M:%S"), cwd)].append(sid)
rajadas_n = sum(1 for v in rajadas.values() if len(v) >= 3)

# -- Agregacao por AREA (primeiro dir top-level) --
por_area = defaultdict(lambda: {"seg": 0.0, "chats": 0})
for o in enriquecidos:
    wall = o.get("wall_seconds") or 0
    dirs = o.get("diretorios") or []
    tops = set()
    for d in dirs:
        parts = d.strip("/\\").split("/")
        if parts and parts[0]:
            tops.add(parts[0])
    if not tops:
        tops = {"(sem area)"}
    share = wall / len(tops)
    for t in tops:
        por_area[t]["seg"] += share
        por_area[t]["chats"] += 1
areas = sorted(
    [{"area": k, "horas": round(v["seg"]/3600, 2), "chats": v["chats"]} for k, v in por_area.items()],
    key=lambda x: -x["horas"]
)

# -- Cards (hoje/semana/mes) --
def tot(n):
    c = agora_utc - timedelta(days=n)
    seg = sum(o.get("wall_seconds",0) for o in enriquecidos if o["_ts"] >= c)
    chats = sum(1 for o in enriquecidos if o["_ts"] >= c)
    return round(seg/3600,1), chats

corte_hoje = agora_brt.replace(hour=0,minute=0,second=0,microsecond=0).astimezone(timezone.utc)
h_hoje = round(sum(o.get("wall_seconds",0) for o in enriquecidos if o["_ts"] >= corte_hoje)/3600, 1)
n_hoje = sum(1 for o in enriquecidos if o["_ts"] >= corte_hoje)
h_sem, n_sem = tot(7)
h_mes, n_mes = tot(30)

# -- Tabela (50 ultimos do periodo) --
tabela = []
for o in sorted(enriquecidos, key=lambda x: -x["_ts"].timestamp())[:50]:
    dirs = o.get("diretorios") or []
    area = "-"
    if dirs:
        p = dirs[0].strip("/\\").split("/")
        area = p[0] if p and p[0] else "-"
    tabela.append({
        "data": o["_ts_brt"].strftime("%d/%m %H:%M"),
        "area": area,
        "tema": o.get("tema","-"),
        "min": round(o.get("wall_seconds",0)/60),
        "cat": o.get("categoria","-"),
        "modelos": ", ".join(m.replace("claude-","") for m in (o.get("modelos") or [])),
    })

# -- Pre-insights pra Claude --
agregacao = {
    "periodo": PERIODO if PERIODO in ("hoje","semana","mes") else "mes",
    "dias": dias,
    "gerado_em_brt": agora_brt.strftime("%Y-%m-%d %H:%M"),
    "cards": {
        "hoje": {"horas": h_hoje, "chats": n_hoje},
        "semana": {"horas": h_sem, "chats": n_sem},
        "mes": {"horas": h_mes, "chats": n_mes},
    },
    "areas_top": areas[:5],
    "cobertura_pct": round(cobertura, 1),
    "chats_em_aberto": em_aberto[:10],
    "rajadas_ide": rajadas_n,
    "maiores_chats": sorted(
        [{"tema": t["tema"], "min": t["min"], "data": t["data"], "area": t["area"]} for t in tabela],
        key=lambda x: -x["min"]
    )[:5],
    "total_enriquecidos": len(enriquecidos),
    "total_longos": len(longos),
}
print("===AGREGACAO===")
print(json.dumps(agregacao, ensure_ascii=False, indent=2))
print("===FIM===")

# -- Gerar HTML --
labels = json.dumps([a["area"] for a in areas], ensure_ascii=False)
valores = json.dumps([a["horas"] for a in areas])

trs = "\n".join(
    '<tr><td>{}</td><td>{}</td><td>{}</td><td>{}m</td><td><span class="cat cat-{}">{}</span></td><td>{}</td></tr>'.format(
        t["data"], t["area"], t["tema"].replace("<","&lt;").replace(">","&gt;"),
        t["min"], t["cat"], t["cat"], t["modelos"]
    ) for t in tabela
)

aberto_lis = "\n".join(
    '<li><code>{}</code> — {} — aberta ha <b>{}d</b> (inicio {})</li>'.format(
        a["sid"], a["projeto"], a["idade_dias"], a["start_brt"]
    ) for a in em_aberto[:10]
) or '<li><em>Nenhum chat em aberto ha mais de 12h.</em></li>'

badges_warn_cls = "warn" if cobertura < 40 else ""

HTML = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Dashboard Telemetria Claude</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,"Segoe UI",Roboto,sans-serif;background:#0d1117;color:#e6edf3;padding:24px;line-height:1.5;max-width:1200px;margin:0 auto}
h1{font-size:22px;font-weight:600}
.subtitle{color:#7d8590;font-size:13px;margin:4px 0 24px}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px}
.card{background:#161b22;border:1px solid #30363d;border-radius:6px;padding:16px}
.card-label{color:#7d8590;font-size:11px;text-transform:uppercase;letter-spacing:.5px}
.card-value{font-size:28px;font-weight:600;color:#ff8c42;margin:4px 0}
.card-sub{color:#7d8590;font-size:12px}
section{background:#161b22;border:1px solid #30363d;border-radius:6px;padding:16px;margin-bottom:16px}
section h2{font-size:14px;font-weight:600;margin-bottom:12px;color:#e6edf3}
#insights-list{list-style:none}
#insights-list li{padding:10px 0;border-bottom:1px solid #21262d;font-size:13px;padding-left:4px}
#insights-list li:last-child{border-bottom:none}
#insights-list li::before{content:"▸ ";color:#ff8c42;font-weight:bold}
canvas{max-height:320px}
table{width:100%;border-collapse:collapse;font-size:12px}
th,td{text-align:left;padding:6px 8px;border-bottom:1px solid #21262d;vertical-align:top}
th{color:#7d8590;font-weight:500;text-transform:uppercase;font-size:10px;letter-spacing:.5px}
input[type=search]{background:#0d1117;border:1px solid #30363d;color:#e6edf3;padding:6px 10px;border-radius:4px;width:320px;margin-bottom:12px;font-size:13px}
.cat{display:inline-block;padding:1px 8px;border-radius:3px;font-size:10px;font-weight:600}
.cat-A{background:#1f6feb33;color:#58a6ff}
.cat-B{background:#bf8e1433;color:#ffb84d}
.cat-C{background:#8957e533;color:#bc8cff}
.cat--{background:#21262d;color:#7d8590}
.badges{display:flex;gap:8px;flex-wrap:wrap;font-size:11px;color:#7d8590;margin-top:24px;padding-top:16px;border-top:1px solid #21262d}
.badge{background:#21262d;padding:4px 10px;border-radius:10px}
.badge.warn{background:#b548371a;color:#f85149}
code{background:#21262d;padding:1px 6px;border-radius:3px;font-size:11px;font-family:"SF Mono",Consolas,monospace}
ul.aberto{list-style:none}
ul.aberto li{padding:8px 0;font-size:12px;border-bottom:1px solid #21262d}
ul.aberto li:last-child{border-bottom:none}
</style>
</head>
<body>
<h1>Telemetria Claude Code</h1>
<div class="subtitle">Periodo: <b>__PERIODO_LABEL__</b> (ultimos __DIAS__ dias) &middot; Gerado em __GERADO__</div>

<div class="cards">
  <div class="card"><div class="card-label">Hoje</div><div class="card-value">__H_HOJE__h</div><div class="card-sub">__N_HOJE__ chats encerrados</div></div>
  <div class="card"><div class="card-label">Ultimos 7 dias</div><div class="card-value">__H_SEM__h</div><div class="card-sub">__N_SEM__ chats</div></div>
  <div class="card"><div class="card-label">Ultimos 30 dias</div><div class="card-value">__H_MES__h</div><div class="card-sub">__N_MES__ chats</div></div>
</div>

<section>
  <h2>Insights</h2>
  <ul id="insights-list"><!-- INSIGHTS_PLACEHOLDER --></ul>
</section>

<section>
  <h2>Tempo por area (diretorio top-level, ultimos __DIAS__ dias)</h2>
  <canvas id="bar-areas"></canvas>
</section>

<section>
  <h2>Chats em aberto (>12h sem end)</h2>
  <ul class="aberto">__ABERTO_LIS__</ul>
</section>

<section>
  <h2>Historico (__N_TABELA__ chats enriquecidos)</h2>
  <input type="search" id="search" placeholder="Buscar por tema, area, modelo...">
  <table id="historico">
    <thead><tr><th>Data</th><th>Area</th><th>Tema</th><th>Dur.</th><th>Cat</th><th>Modelos</th></tr></thead>
    <tbody>__TRS__</tbody>
  </table>
</section>

<div class="badges">
  <span class="badge __WARN__">Cobertura enriquecida: __COBERTURA__%</span>
  <span class="badge">__N_ABERTO__ em aberto</span>
  <span class="badge">__N_RAJADAS__ rajadas IDE</span>
  <span class="badge">__N_ENR__ enriquecidos no periodo</span>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
<script>
new Chart(document.getElementById('bar-areas'), {
  type: 'bar',
  data: { labels: __LABELS__, datasets: [{ label: 'Horas', data: __VALORES__, backgroundColor: '#ff8c42' }] },
  options: {
    indexAxis: 'y',
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: '#21262d' }, ticks: { color: '#7d8590' } },
      y: { grid: { color: '#21262d' }, ticks: { color: '#e6edf3' } }
    }
  }
});
document.getElementById('search').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('#historico tbody tr').forEach(tr => {
    tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});
</script>
</body>
</html>
"""

replacements = {
    "__PERIODO_LABEL__": agregacao["periodo"],
    "__DIAS__": str(dias),
    "__GERADO__": agregacao["gerado_em_brt"] + " BRT",
    "__H_HOJE__": str(h_hoje),
    "__N_HOJE__": str(n_hoje),
    "__H_SEM__": str(h_sem),
    "__N_SEM__": str(n_sem),
    "__H_MES__": str(h_mes),
    "__N_MES__": str(n_mes),
    "__ABERTO_LIS__": aberto_lis,
    "__N_TABELA__": str(len(tabela)),
    "__TRS__": trs,
    "__WARN__": badges_warn_cls,
    "__COBERTURA__": str(round(cobertura,1)),
    "__N_ABERTO__": str(len(em_aberto)),
    "__N_RAJADAS__": str(rajadas_n),
    "__N_ENR__": str(len(enriquecidos)),
    "__LABELS__": labels,
    "__VALORES__": valores,
}
for k, v in replacements.items():
    HTML = HTML.replace(k, v)

with open(OUT, "w", encoding="utf-8") as f:
    f.write(HTML)

print("===HTML===")
print(OUT)
PYEOF
```

Depois de rodar, voce tera:
- JSON de agregacao impresso entre `===AGREGACAO===` e `===FIM===`
- Arquivo salvo no path impresso apos `===HTML===`
- HTML contem o marcador literal `<!-- INSIGHTS_PLACEHOLDER -->` onde os `<li>`s vao entrar

---

## Fase 3: Escrever insights acionaveis

Leia o JSON de agregacao (campo `agregacao` entre os marcadores) e redija **3 a 5 bullets em PT-BR**. Cada bullet vira `<li>texto</li>`.

### Regras (importante)

- **Acao > descricao.** Cada bullet deve ou (a) apontar chat/area especifica pra mexer, (b) indicar padrao operacional detectavel, (c) alertar sobre estado do sistema.
- **Use numeros concretos.** "3 chats em aberto" > "varios chats pendentes".
- **Cite ID ou nome** quando for sobre uma coisa especifica. Sessao: `<code>34a5aac3</code>`.
- Nao repita o que os cards ja mostram ("voce tem X horas" = redundante com o card).
- Nao faca juizo de valor ("voce ta gastando muito"). Nem sugira pausas, "cuidado com X", ou qualquer sermao.

### Inputs que devem gerar insight (quando presentes)

| Condicao | Modelo de insight |
|----------|-------------------|
| `chats_em_aberto` tem >=1 item com idade>3d | `Chat <code>abc12345</code> em <b>projeto</b> aberto ha Nd — considere encerrar ou investigar` |
| `cobertura_pct` < 40% | `Cobertura enriquecida em X% — dashboard cego em (100-X)% dos chats. Rode <code>/pique:encerrar</code> mais` |
| 1 area concentra >50% do tempo do periodo | `Area <b>X</b> consumiu Yh (Z% do periodo) — top 3 temas: ...` (cite temas reais da `maiores_chats`) |
| `rajadas_ide` > 5 no periodo | `N rajadas de start detectadas (VS Code restaurando janelas) — inflam contagem de "chats abertos"` |
| `maiores_chats[0].min` > 180 | `Maior chat do periodo: "<tema>" com Xh em <area>` (so descreve se >3h) |
| Area aparece em `areas_top` mas `areas_top[0].chats == 1` | `Area <b>X</b> aparece mas com 1 chat so — possivel experimento unico, nao padrao` |
| Cards `semana.horas > mes.horas / 4 * 1.5` | `Ritmo da semana (Xh/7d) esta 50% acima da media mensal` |

Se nenhum padrao dispara: escreva 3 bullets factuais a partir do dado geral (top area + maior chat + cobertura).

### Formato esperado (sua saida)

Retorne soh os `<li>`s concatenados (sem `<ul>` envolta, so os items). Exemplo:

```
<li>Chat <code>34a5aac3</code> em <b>pique-consultoria-hub</b> aberto ha 4.2d — considere encerrar manualmente.</li>
<li>Area <b>pique/</b> concentrou 18.3h (62% do mes) — maior chat "apresentacao yababuss beco" com 2h5m.</li>
<li>Cobertura enriquecida em 24% — 76% dos chats sem tema/area. Rode <code>/pique:encerrar</code> mais.</li>
```

---

## Fase 4: Injetar insights no HTML

Use a ferramenta `Edit` para substituir o marcador no arquivo gerado:

- **Arquivo:** `C:\Users\Henrique Carvalho\.claude\telemetria\dashboard.html`
- **old_string:** `<!-- INSIGHTS_PLACEHOLDER -->`
- **new_string:** (os `<li>`s concatenados gerados na Fase 3)

---

## Fase 5: Abrir no browser

```bash
python -c "import os; os.startfile(os.path.expanduser('~/.claude/telemetria/dashboard.html'))"
```

Se falhar (raro), printe o caminho e siga.

---

## Fase 6: Output no terminal (curto)

Responda com no maximo 3 linhas:

```
Dashboard atualizado em ~/.claude/telemetria/dashboard.html
Periodo: <label> · <N> chats enriquecidos · cobertura <X>%
Aberto no browser.
```

Nao repita os insights no terminal — eles ja estao na tela.

---

## Regras gerais

- **Sem perguntas intermediarias.** O fluxo e automatico: roda Python, le agregacao, escreve insights, edita HTML, abre browser. Voce so pergunta se `$ARGUMENTS` for algo ambiguo fora de `hoje`/`semana`/`mes`.
- **Nao edite campos do HTML alem do `INSIGHTS_PLACEHOLDER`.** Todo resto e gerado pelo Python.
- **Datas sempre em BRT no output.** Dados internos sao UTC, mas apresentacao e BRT.
- **Python tem zero dependencia externa.** Soh stdlib. Chart.js carrega via CDN no browser.

## Auto-avaliacao (executar sempre ao final)

Avalie com base em:
1. Os insights foram acionaveis (apontam algo concreto pra mexer) ou soh descrevem numeros?
2. O `INSIGHTS_PLACEHOLDER` foi substituido corretamente (sem restar marcador literal no HTML)?
3. O browser abriu automaticamente?
4. O numero de linhas de output terminal ficou <=3?

Se identificou melhoria CONCRETA, mostre:

```
[AUTO-AVALIACAO]
- [melhoria 1]
- [melhoria 2]
```

E anexe em `pique/infra/melhorias-plugin.md`:
```
## YYYY-MM-DD — dashboard (usuario)
- [melhoria 1]
```

Se nada concreto, nao mostre nada.
