---
description: Dashboard de uso de IA com diagnostico, tempo real, heatmap e gantt. 3 camadas (Diagnostico topo / Padroes meio / Bruto fundo). Le chats-enriquecidos.jsonl, chats.jsonl, session_*.jsonl em streaming, insights-uso-ia.md.
argument-hint: "[opcional: hoje | semana | mes — default: mes (30d)]"
---

Dashboard de uso de IA. Periodo pedido: **$ARGUMENTS** (vazio = mes = 30d).

Gera HTML em `~/.claude/telemetria/dashboard.html`. Casca Pique (sidebar 260px + accent #E89430). HTML sobrescreve a cada rodada.

## Quando usar

- "dashboard", "painel de tempo", "uso de IA", "onde minha energia ta indo"
- Ritual semanal/diario (chamavel dentro de `/pique:review-semanal` ou `/pique:boa-noite`)

## Principios v3

- **Diagnostico > dado.** A camada principal sao 3-5 teses escritas pelo subagente cego. Numeros sao prova, nao protagonista.
- **Tempo real, nao somado.** Mostra bruto (janela aberta), ativo (gaps <10min), pausa (gaps >30min). Le session_*.jsonl em streaming.
- **Material proprio.** Insights destilados vem de `conhecimento/produtividade/insights-uso-ia.md` (alimentado pelo `/pique:encerrar`).
- **3 camadas**: Diagnostico (60% peso) / Padroes (30%) / Bruto recolhivel (10%).

---

## Fase 1: Determinar periodo

Parse `$ARGUMENTS`:

| Argumento | Valor passado |
|-----------|---------------|
| `hoje` | hoje |
| `semana` | semana |
| `mes` ou vazio | mes |

---

## Fase 2: Rodar o gerador

```bash
python "C:\Users\Henrique Carvalho\.claude\telemetria\_dashboard_gen.py" <periodo>
```

O script faz:
1. Parse chats-enriquecidos.jsonl + chats.jsonl
2. Index dos session_*.jsonl em `~/.claude/projects/`
3. Pra cada chat enriquecido: extrai timestamps do session file via streaming bytewise (regex em bytes), calcula bruto/ativo/pausas
4. Agrega heatmap 7×24, gantt das ultimas 24h, clusters de insights, skills nao implementadas
5. Escreve HTML com **placeholder `<!-- __DIAGNOSTICO__ -->`** na Camada 1
6. Imprime resumo no terminal (entre `===AGREGACAO===` e `===FIM===`)

**NAO abre o browser ainda** — o browser abre so depois da Fase 3.

---

## Fase 3: Dispatch subagente cego pras teses (CRITICA)

Use a ferramenta Agent com `subagent_type=Explore`. O prompt **nao deve carregar a conversa anterior** — o subagente le SO o agregado + o md de insights, escreve as teses "no escuro". Isso e anti-vies.

Prompt do subagente:

```
Tarefa: ler o agregado abaixo + o doc de insights, e ESCREVER de 3 a 5 teses sobre o uso de IA do usuario. Cada tese vira um card HTML.

CONTEXTO (voce nao conhece o usuario, nao viu a conversa anterior. Le APENAS isto):

1. Doc de insights destilados: C:\Users\Henrique Carvalho\Documents\PROGRAMAS\MEU-CEREBRO\conhecimento\produtividade\insights-uso-ia.md
   Le tudo. Sao padroes ja capturados pelo proprio usuario via /pique:encerrar.

2. Resumo do agregado (vem do terminal apos rodar `python _dashboard_gen.py`, formato JSON entre ===AGREGACAO=== e ===FIM===):
   <COLE AQUI O JSON DO TERMINAL>

REGRAS DAS TESES:

- Cada tese tem 4 partes: Padrao / Evidencia / Raiz / Acao.
- Padrao: 1 frase descritiva. Exemplo: "Voce sugere automacoes em chats diferentes e nunca implementa."
- Evidencia: numeros concretos, datas, sids, contagens. Cite EXATAMENTE o que viu no agregado ou no md. Ex: "4 insights categoria=skill nas datas 19/04, 24/04, 28/04, 12/05 sugerem `/social-auditar-tasks`."
- Raiz: hipotese curta do POR QUE acontece. NAO certeza, hipotese. Ex: "Voce pula pra proxima sessao em vez de fechar a skill antes."
- Acao: O QUE FAZER. Concreto. Ex: "Bloco de 1h amanha de manha pra criar a skill."

PRIORIZE TESES DE:
- Skills sugeridas multiplas vezes mas nao implementadas (campo `skills_nao_implementadas` no agregado — verifica se faz sentido caso a caso, pode ter falso positivo).
- Discrepancias bruto vs ativo (campo `discrepantes_top` ou totais — bruto/ativo > 2 = janela aberta sem uso).
- Recorrencia de mesma categoria em curto prazo (campo `por_categoria`).
- Insights conectados (padroes similares em datas proximas — voce LE o md e percebe).

EVITE:
- "Voce ta indo bem" (juizo de valor sem acao).
- Recortar numero do agregado sem virar tese ("voce trabalhou Xh esta semana" — isso ja ta nos cards).
- Repetir o que o card de tempo real ja diz (o card ja mostra bruto vs ativo, voce pode REFERENCIAR mas precisa transcender).
- Generalizacao sem evidencia rastreavel.

FORMATO DE SAIDA (apenas isto, nada antes nem depois):

<div class="tese">
  <div class="tese-head">
    <span class="tese-num">01</span>
    <span class="tese-cat">CATEGORIA</span>
    <span class="tese-rec">RECORRENCIA: Nx</span>
  </div>
  <div class="tese-padrao">PADRAO EM 1 FRASE.</div>
  <div class="tese-row"><div class="tese-key">Evidencia</div><div class="tese-val">FATO COM NUMEROS / DATAS / SIDS.</div></div>
  <div class="tese-row"><div class="tese-key">Raiz</div><div class="tese-val">HIPOTESE CURTA.</div></div>
  <div class="tese-row acao"><div class="tese-key">Acao</div><div class="tese-val">O QUE FAZER, CONCRETO.</div></div>
</div>

Categorias possiveis (escolha 1 por tese):
- automacao | skill | agent | contexto | workflow | tempo

Numere 01, 02, 03... ate 05 max.

RETORNE: APENAS os <div class="tese">...</div> concatenados. Sem prosa antes, sem fechamento. Eu vou colar diretamente num HTML.
```

Apos receber a saida do subagente, use **Edit** pra substituir o placeholder no HTML:

- Arquivo: `C:\Users\Henrique Carvalho\.claude\telemetria\dashboard.html`
- old_string: `<!-- __DIAGNOSTICO__ -->`
- new_string: (HTML retornado pelo subagente)

---

## Fase 4: Abrir no browser

```bash
python -c "import os; os.startfile(os.path.expanduser('~/.claude/telemetria/dashboard.html'))"
```

---

## Fase 5: Output no terminal (curto)

3 linhas no maximo:

```
Dashboard v3 atualizado.
Diagnostico: N teses · Tempo real: Xh bruto / Yh ativo · Cobertura Z%
Aberto no browser.
```

---

## Regras gerais

- **Sem perguntas intermediarias.** Fluxo automatico: Python → subagente → Edit → browser.
- **Nao edite o HTML alem do placeholder DIAGNOSTICO.** Resto e responsabilidade do Python/template.
- **Subagente CEGO**: o prompt nao referencia nada da conversa atual. Anti-vies.
- **Datas em BRT.**
- **Sem dependencia externa Python.** Stdlib so. Chart.js via CDN.

## Auto-avaliacao (executar sempre ao final)

1. Python rodou (saida `===HTML===`)?
2. Subagente retornou pelo menos 3 teses no formato `<div class="tese">`?
3. Edit no placeholder funcionou (sem restar `<!-- __DIAGNOSTICO__ -->` no HTML)?
4. Browser abriu?
5. As teses citam evidencia rastreavel (sid, data, categoria), nao so prosa?

Se identificou melhoria CONCRETA:

```
[AUTO-AVALIACAO]
- [melhoria]
```

E anexe em `pique/infra/melhorias-plugin.md`:
```
## YYYY-MM-DD — dashboard (v3)
- [melhoria]
```
