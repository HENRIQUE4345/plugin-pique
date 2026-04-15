---
description: Consulta sob demanda de tempo no Claude Code. Le telemetria nativa + enriquecida. Factual, sem sermao.
argument-hint: <pergunta sobre tempo / custo / chats>
---

Consulta de telemetria do Claude Code. Pergunta do usuario: **$ARGUMENTS**

Responda com FATO puro. Zero interpretacao, zero sugestao de corte, zero "cuidado com X". So numeros + contexto minimo.

## Quando usar

Exemplos de pergunta:
- "quanto passei no Yabadoo essa semana?"
- "chat mais longo hoje?"
- "quantas horas no Claude ontem?"
- "custo estimado dessa semana?"
- "conversas tipo A vs C essa semana?"
- "qual projeto consumiu mais tempo no mes?"

## Fontes de dados

| Fonte | Conteudo | Uso |
|-------|----------|-----|
| `~/.claude/telemetria/chats.jsonl` | Eventos `start`/`end` crus (hooks) | Wall time de cada sessao, contagem de chats |
| `~/.claude/telemetria/chats-enriquecidos.jsonl` | Tema, resumo, categoria A/B/C, `arquivos_tocados`, `diretorios`, `commits`, `tags` (gerado por `/pique:encerrar`; campos operacionais a partir do plugin-pique 1.6.0) | Tipos de conversa, temas frequentes, retomada de contexto via `/pique:continuar` |
| `~/.claude/projects/<slug-cwd>/<sessionId>.jsonl` | JSONL nativo (modelo por turno, tokens, timestamps, primeiro prompt) | Tokens, custo, modelos usados, tempo fino |

## Como ler — linguagem de parsing (referencia usada por outros commands)

Esta secao e a descricao canonica. Outros commands (`/pique:boa-noite` bloco telemetria, `/pique:encerrar` enriquecimento, `/pique:review-semanal` fase 1.5) referenciam ESTAS regras.

### Slug de cwd -> pasta-projeto

Caminho `c:\Users\Henrique Carvalho\Documents\PROGRAMAS\MEU-CEREBRO` vira pasta `c--Users-Henrique-Carvalho-Documents-PROGRAMAS-MEU-CEREBRO`:

- `\` e `/` e espaco -> `-`
- `:` -> `--`
- mantem o resto

Sessoes do projeto ficam em `~/.claude/projects/<slug>/*.jsonl`.

### Wall time de uma sessao

1. Primeira escolha: parear `{"event":"start","session_id":"X",...}` com `{"event":"end","session_id":"X",...}` em `chats.jsonl`. `wall_seconds = end.ts - start.ts`.
2. Sem `end` (sessao ativa ou crash): usar o `timestamp` do ultimo evento do `<sessionId>.jsonl` nativo como fim. Se nem isso, usar `Date.now()`.
3. Sem `start` (evento perdido): usar primeiro `timestamp` do JSONL nativo.

### "Hoje" em timezone local (BRT)

Timestamps em `chats.jsonl` sao UTC (`Z`). "Hoje" em BRT (-03:00) comeca as 03:00Z do dia civil. Quando filtrar por data local, converter.

### Primeiro prompt de uma sessao

Primeira linha com `"type":"user"` no `<sessionId>.jsonl` nativo. Pegar `message.content[*].text` (array) — se comecar com `<ide_opened_file>` ou `<command-name>`, usar o proximo bloco de texto. Resumir em 6-8 palavras pro output.

### Modelos usados

Percorrer linhas `"type":"assistant"` do `<sessionId>.jsonl`, coletar `message.model` distintos. Valores tipicos: `claude-opus-4-6`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`.

### Tokens por sessao

Somar `message.usage.input_tokens`, `.output_tokens`, `.cache_creation_input_tokens`, `.cache_read_input_tokens` de cada evento assistant do `<sessionId>.jsonl`.

### "Projeto" a partir do cwd

Ultima componente do path, normalizada: `MEU-CEREBRO`, `plugin-pique`, `plugin-social-media`, etc.

### Categoria A/B/C (de chats-enriquecidos.jsonl)

- **A** = mecanico (tasks operacionais, comandos, consultas rapidas)
- **B** = processamento (refactor medio, analise, brainstorm com saida concreta)
- **C** = estrategico (decisao de rumo, arquitetura, planejamento)

Nem toda sessao tem enriquecimento — so as que passaram por `/pique:encerrar`. Quando consultar distribuicao A/B/C, informar ao usuario o percentual de cobertura (ex: "12 de 18 chats da semana tem enriquecimento").

## Tabela de precos hardcoded (fallback sem ccusage)

Precos por 1M tokens em USD (validar em https://www.anthropic.com/pricing quando houver mudanca). Atualizado 2026-04.

| Modelo | Input | Output | Cache write (5m) | Cache read |
|--------|------:|-------:|-----------------:|-----------:|
| claude-opus-4-6       | 15.00 | 75.00 | 18.75 | 1.50 |
| claude-sonnet-4-6     |  3.00 | 15.00 |  3.75 | 0.30 |
| claude-haiku-4-5      |  1.00 |  5.00 |  1.25 | 0.10 |

Formula: `custo = (input*15 + output*75 + cache_create*18.75 + cache_read*1.50) / 1_000_000` (exemplo Opus).

Quando apresentar custo, incluir linha "fonte: tabela hardcoded 2026-04" OU "fonte: ccusage v<versao>".

## Deteccao ccusage em runtime

Antes de calcular custo, rode `Bash: command -v ccusage` (ou `where ccusage` no Windows puro).

- Se retornar path: delegue a consulta de custo a `ccusage` (ex: `ccusage session <session_id>`). Parse o output dele.
- Se retornar vazio: use tabela hardcoded acima.

Nao instale nada automaticamente. Se o usuario perguntar "como melhorar calculo de custo", sugira `npm i -g ccusage` mas nao execute.

## Tipos de resposta (templates)

### 1. Tempo por projeto em periodo

```
Periodo: [DD/MM a DD/MM] — [N] chats, [Xh]h total wall

Projeto          Horas   %    Chats
MEU-CEREBRO      4h12m   38%  7
plugin-pique     3h05m   28%  5
plugin-social    2h30m   23%  4
docs-pique       1h10m   11%  2

Sem enriquecimento: [N] chats (categoria A/B/C indisponivel)
```

### 2. Chat mais longo

```
Session: a06dee81 ([DD/MM HH:MM])
Duracao: 2h35m (wall)
Projeto: MEU-CEREBRO
Primeiro prompt: "refatorar rituais etapa 2"
Modelos: claude-opus-4-6
Categoria: C (estrategico)
```

### 3. Horas em dia/semana

```
[DD/MM]: 3h42m em [N] chats
Maior: 1h30m (projeto X)
Modelos: opus (3), sonnet (1)
```

### 4. Custo estimado

```
Periodo: [DD/MM a DD/MM]
Total: ~US$ X.XX

Por modelo:
- claude-opus-4-6: US$ X.XX ([M] tokens input + [N] output)
- claude-sonnet-4-6: US$ X.XX ([M] tokens input + [N] output)

Fonte: tabela hardcoded 2026-04 (OU: ccusage vX.Y)
```

## Regras

- Resposta CURTA. Maximo 12-15 linhas no output (nao neste arquivo — no retorno real).
- **Zero interpretacao.** Nao diga "voce passou muito tempo em X". Nao sugira cortar. Nao compare com "media saudavel".
- Se dado faltar: diga "sem dado" e explique por que em 1 linha (ex: "chats-enriquecidos.jsonl vazio — so tem dado apos primeiro `/pique:encerrar` rodado").
- Se o periodo pedido for anterior a `2026-04-04` (criacao dos hooks), avise: "telemetria comecou em 2026-04-04, antes disso so ha JSONL nativo do Claude Code".
- Use `Grep`/`Read` do proprio Claude pra parsing. Nao dependa de `jq` CLI (pode nao estar instalado).
- Datas sempre em formato local BRT.

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. A resposta foi factual, sem interpretacao ou sermao?
2. Quando faltou dado, explicitou "sem dado" com motivo em 1 linha?
3. Quando envolveu custo, indicou a fonte (hardcoded vs ccusage)?
4. Usou as regras de parsing desta secao "Como ler" de forma consistente?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
```

2. Anexe em `pique/infra/melhorias-plugin.md` no formato:
```
## YYYY-MM-DD — tempo (usuario)
- [melhoria 1]
- [melhoria 2]
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
