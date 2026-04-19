---
description: Ritual de review semanal PESSOAL. Cada socio roda o seu. Output principal = "Levar pro fechamento" (ponte pro /pique:fechamento-semana).
---

Ritual de review semanal **pessoal**. Execute este fluxo EXATAMENTE, sem pular etapas.

Este ritual e o IRMAO do `/pique:fechamento-semana`. Primeiro cada socio roda o SEU review (este command); depois os dois juntos rodam o fechamento de empresa. Tudo aqui e do usuario atual — nada do outro socio aparece.

## Ferramentas

- **Operacoes ClickUp** (buscar tasks do usuario): delegar ao agent `gestor-clickup`
- **Google Calendar**: chamar diretamente (connector leve)

> **IMPORTANTE**: Se as tools do ClickUp nao estiverem disponiveis (agent gestor-clickup falhar), avise o usuario: "ClickUp MCP esta desativado. Ative em: VS Code → MCP Servers → clickup → Enable. Depois me chame de novo." NAO tente continuar sem ClickUp — pare e espere.

## Configuracao

Antes de iniciar, leia `plugin-pique.local.md` na raiz do projeto para obter:
- **Usuario atual:** `user_name` (user_id ClickUp: `user_clickup_id`)
- **Diarios pessoal:** `diarios_path`
- **Calendarios:** `calendarios.*`
- **Areas pessoais:** campo opcional `areas_pessoais` (lista, ex: `["saude", "financas", "estudos"]`). Se nao existir, pular Fase 1.8.

Se o arquivo nao existir, pergunte o `user_name` e crie usando o template.

**Normalizacao do user_name pra nome de arquivo:** lowercase, sem sobrenome, sem acento. Ex: "Henrique Carvalho" -> `henrique`. "Marco" -> `marco`.

- **Quando:** Sexta, 16h. Apos este ritual, rodar `/pique:fechamento-semana` com o outro socio as 17h.
- **Sessao de planejamento da semana:** buscar `sessoes/*-planejamento-semanal*.md` mais recente
- **Review pessoal anterior:** buscar `sessoes/*-review-semanal-<user_name>.md` mais recente

---

## Fase 1: Reconhecimento (paralelo, NAO pergunte nada ainda)

Execute TUDO em paralelo. Tudo filtrado pelo usuario atual.

### 1.1 Sessao do planejamento da semana

Busque `sessoes/*-planejamento-semanal*.md` mais recente. Extraia APENAS o que e do usuario atual (tasks dele, decisoes que ele tomou, blockers dele).

Se nao existir: "Sem planejamento registrado esta semana — vou comparar direto com o ClickUp."

### 1.2 ClickUp — Foto completa da semana (SO do usuario)

Delegar ao `gestor-clickup` com filtro por assignee = `user_clickup_id`. Buscar em TODOS os Spaces ativos:

- Pique Digital (901313561086)
- Conteudo (901313561098)
- Yabadoo (901313567191)
- Beto Carvalho (901313567164)
- Pessoal (901313561154)

| O que buscar | Por que |
|---|---|
| Tasks "Finalizado" (ultimos 7 dias) | O que foi feito |
| Tasks "Hoje" ou "Fazendo" | O que ficou em andamento |
| Tasks "Essa semana" | O que foi definido mas nao puxado |
| Tasks criadas essa semana | O que surgiu no meio |

### 1.3 Diarios dos ultimos 5 dias uteis

Leia `diarios/YYYY-MM-DD.md` dos 5 dias uteis da semana (path: `diarios_path` do local.md).

Extraia:
- Blockers recorrentes
- Tasks extras que surgiram
- Padroes (ex: "3 dias travou no mesmo tema", "nenhum check-out")
- Notas relevantes

### 1.4 Google Calendar — semana que passou

Liste eventos de SEGUNDA ate HOJE dos calendarios do usuario (ver `calendarios.*` no local.md). Identifique:
- Reunioes que aconteceram
- Reunioes canceladas/remarcadas

### 1.5 Telemetria pessoal da semana

Leia `~/.claude/telemetria/chats.jsonl` + `~/.claude/telemetria/chats-enriquecidos.jsonl` dos ultimos 7 dias.

Regras de parsing em `/pique:tempo` secao "Como ler" (slug cwd, pareamento start/end, wall time).

**Filtre por cwds do usuario**: todos os `cwd` cujo path contenha `Henrique Carvalho` (ou equivalente do user_name do local.md). Na pratica hoje = todos os chats da maquina do Henrique. Se o Marco rodar daqui uma vez, filtrar pelo home dele.

Agregue:
- Horas totais na semana (wall)
- Distribuicao por projeto (ultima componente do cwd)
- N de chats total
- Distribuicao A/B/C (se `chats-enriquecidos.jsonl` tem dado)
- Chat mais longo da semana (+ projeto + primeiro prompt)

Se `chats-enriquecidos.jsonl` nao existir ou estiver vazio, informar: "telemetria enriquecida indisponivel — so horas brutas, categorias A/B/C nao disponiveis ainda".

### 1.6 Conteudo publicado na semana

Delegar ao `gestor-clickup`: tasks no Space Conteudo (901313561098) com assignee = `user_clickup_id` e status "Finalizado" nos ultimos 7 dias.

Liste titulos + tipo (artigo, carrossel, video, etc).

Se nenhum: "Nenhum conteudo publicado esta semana".

### 1.7 Aprendizados da semana

Leia os diarios de 1.3 buscando padroes textuais: "aprendi", "descobri", "entendi", "ficou claro que", "percebi", "notei que".

Extraia frases contextualizadas (3-5 itens maximo). Nada de inventar — so o que esta escrito.

### 1.8 Areas pessoais (opcional)

Se `areas_pessoais` existir no local.md, buscar menções nos diarios de cada area listada. Extrair 1-2 linhas por area sobre o que foi registrado.

Se `areas_pessoais` nao existir: pular sem avisar. Se existir mas sem menção: "Area X — sem registros esta semana".

### 1.9 Review pessoal anterior — follow-up

Busque `sessoes/*-review-semanal-<user_name>.md` mais recente (semana passada). Extraia:
- Decisoes que estavam no "Levar pro fechamento" anterior — foram executadas?
- Pendencias pessoais — resolvidas?

### 1.10 Insights de uso IA da semana

Leia `conhecimento/produtividade/insights-uso-ia.md` (se existir). Filtre entradas dos ultimos 7 dias pelo header `### YYYY-MM-DD HH:MM`.

Agrupe por Categoria (automacao/skill/agent/contexto/workflow). Destaque padroes RECORRENTES — mesma **Acao sugerida** (ou muito similar) aparece em 2+ chats na semana. Ignore insights unicos da semana (ficam acumulando pra virar recorrentes em semanas futuras).

Regra de apresentacao: so liste o que e recorrente. Insight unico na semana NAO entra no placar — o valor esta no padrao, nao no evento.

Se o arquivo nao existir ou estiver vazio: "Sem insights de uso registrados esta semana" e pule este bloco.

---

## Fase 2: Placar pessoal

Apresente neste formato (UMA tabela, SO do usuario atual):

```
## Review Semanal — <user_name> — [DD/MM a DD/MM]

### Placar
**Planejado na segunda:** [X] tasks
**Finalizado:** [N]
**Em andamento:** [N]
**Nao iniciado:** [N]
**Extras (nao planejado):** [N]
**Taxa de execucao:** [%]

### Tasks da semana

| Task | Status | Planejado? | Notas |
|------|--------|-----------|-------|
| [Task A] | Finalizado | Sim | — |
| [Task B] | Fazendo | Sim | Travou terca (motivo) |
| [Task C] | Essa semana | Sim | Nao iniciado |
| [Task D] | Finalizado | Nao | Surgiu quarta |

### Tempo no Claude Code esta semana
- Total: [Xh]h em [N] chats
- Por projeto: MEU-CEREBRO [X%], plugin-pique [Y%], ...
- Chat mais longo: [Xh]h — "[primeiro prompt resumido]"
- Tipos (A/B/C): A [X%], B [Y%], C [Z%] — cobertura: [M de N] chats enriquecidos

### Padroes de uso IA (semana)
- [padrao recorrente 1] — aparece em [N] chats, acao sugerida: [X] ([categoria])
- [padrao recorrente 2] — aparece em [N] chats, acao sugerida: [Y] ([categoria])
(ou: "Nada recorrente esta semana")

### Conteudo publicado
- [titulo 1] ([tipo])
- [titulo 2] ([tipo])
(ou: "Nenhum esta semana")

### Aprendizados da semana
- [aprendizado 1 — diario DD/MM]
- [aprendizado 2 — diario DD/MM]

### Areas pessoais (se aplicavel)
- [area 1]: [o que apareceu]
- [area 2]: [o que apareceu]

### Blockers / padroes pessoais
- [blocker recorrente]
- [padrao nos diarios]

### Alertas
- Stand-ups: [X/5 check-in, Y/5 check-out]

### Review anterior — follow-up
- [decisao que levei pro fechamento passado] — [executada / nao]
```

Depois pergunte (MAXIMO 3 perguntas, diretas):

1. Faltou algo que voce fez essa semana e nao ta no ClickUp?
2. (Se taxa < 50%) O que atrapalhou?
3. Algum aprendizado grande que o diario nao capturou?

ESPERE a resposta antes de continuar.

---

## Fase 3: Levar pro fechamento

Este e o **deliverable principal** deste ritual. E a ponte pro `/pique:fechamento-semana` que voce vai rodar as 17h com o outro socio.

Com base em TUDO da Fase 1 + respostas da Fase 2, monte:

```
### Levar pro fechamento (sexta [DD/MM]):

**Destaques da semana (o que quero compartilhar):**
- [destaque 1]
- [destaque 2]

**Bloqueios que dependem do outro socio:**
- [bloqueio 1] — o que preciso que [outro socio] faça
- (ou: "Nenhum")

**Decisoes de empresa que quero propor:**
- [decisao 1] — contexto: [por que]
- [decisao 2] — contexto: [por que]
- (ou: "Nenhuma")

**Proxima semana — meus compromissos:**
- [compromisso 1 — dia, hora]
- [compromisso 2]
```

**Regra:** se alguma secao esta vazia, escreva "Nenhum(a)" explicitamente. Nao omita secao — o fechamento espera as 4.

ESPERE confirmacao do usuario antes de salvar.

---

## Fase 4: Salvar sessao

Crie `sessoes/YYYY-MM-DD-HHMM-review-semanal-<user_name>.md`:

```markdown
# Sessao — Review Semanal <user_name> [DD/MM a DD/MM]

**Criado:** YYYY-MM-DD HH:MM
**Status:** ativo
**Tags:** sessao, review, <user_name>

## Contexto
Review semanal pessoal. Usuario: <user_name>.

## Placar
[conteudo completo da Fase 2]

## Aprendizados
[da Fase 1.7]

## Levar pro fechamento
[conteudo completo da Fase 3 — este e o bloco que o /pique:fechamento-semana vai ler]

## Relacionado
- Planejamento semanal: [link sessao de segunda]
- Review anterior: [link se existir]
```

**NAO** execute ClickUp ou Calendar neste ritual — esses sao jobs do `/pique:fechamento-semana` (tasks do time) e do `/pique:encerrar` (atualizacoes gerais).

**NAO** atualize `_mapa.md` individual — o encerrar faz isso no final da conversa.

Diga: "Review pessoal salvo. Agora rode `/pique:fechamento-semana` as 17h com o outro socio — ele vai puxar este arquivo."

---

## Regras

- **Tudo e do usuario atual.** Nada do outro socio aparece. Zero menção a "o que ele fez".
- **Output principal e a secao 'Levar pro fechamento'.** E a ponte pro `/pique:fechamento-semana`. Caprichar aqui.
- O placar e FACTUAL — numeros, nao opiniao.
- **NAO julgue a taxa de execucao.** TDAH = variacao. 40% pode ter sido uma semana com muita demanda nao planejada. Registra e segue.
- **Nao processa transcricao.** Isso e do `/pique:fechamento-semana` (que e quem tem reuniao).
- **Telemetria individual so aparece aqui** (e no boa-noite diario). Nunca no fechamento.
- Se o usuario nao tem `areas_pessoais` no local.md, pule 1.8 silencioso.
- Comunique-se em portugues brasileiro, direto e sem formalidade.

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. Tudo foi filtrado pelo usuario atual? Apareceu algo do outro socio por engano?
2. A secao "Levar pro fechamento" esta especifica e acionavel pro `/pique:fechamento-semana`?
3. Telemetria pessoal (1.5) foi apresentada sem sermao e sem interpretacao?
4. Dados do ClickUp + diarios + telemetria foram suficientes ou ficaram gaps?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
```

2. Anexe em `pique/infra/melhorias-plugin.md` no formato:
```
## YYYY-MM-DD — review-semanal (usuario)
- [melhoria 1]
- [melhoria 2]
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
