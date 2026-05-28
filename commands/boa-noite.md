---
description: Ritual de fechamento do dia. Execute este fluxo EXATAMENTE, sem pular etapas.
model: sonnet
---

Ritual de fechamento do dia. Execute este fluxo EXATAMENTE, sem pular etapas.

## Ferramentas

- **Operacoes ClickUp** (buscar tasks, atualizar status): delegar ao agent `gestor-clickup`
- **Google Calendar**: chamar diretamente (connector leve)

> **IMPORTANTE**: Se as tools do ClickUp nao estiverem disponiveis (agent gestor-clickup falhar), avise o usuario: "ClickUp MCP esta desativado. Ative em: VS Code → MCP Servers → clickup → Enable. Depois me chame de novo." NAO tente continuar sem ClickUp — pare e espere.

## Configuracao

Antes de iniciar, leia `plugin-pique.local.md` na raiz do projeto para obter:
- **Usuario atual:** `user_name` (user_id ClickUp: `user_clickup_id`)
- **Diarios pessoal:** `diarios_path` do frontmatter
- **Calendarios:** `calendarios.primary`, `calendarios.pique`, `calendarios.pessoal`

Se o arquivo nao existir, pergunte o nome do usuario e crie usando o template.

---

## Fase 1: Reconhecimento (automatico, NAO pergunte nada ainda)

Execute TUDO em paralelo:

### 1.1 Ler check-in de hoje
- Leia `diarios/YYYY-MM-DD.md` (hoje).
- Extraia: tasks planejadas, reunioes, blockers do inicio do dia.
- **Se o arquivo NAO existir:** nao trave. Siga pra Fase 2 e pergunte o que foi planejado junto com as outras perguntas.

### 1.2 ClickUp — Estado atual do board

Faca DUAS buscas em paralelo:

**Busca 1 — Tasks ativas:**
- Tasks com status "Hoje" ou "Fazendo" (o que ficou pendente/em andamento)
- Filtrar por assignee do usuario, em TODOS os Spaces ativos

**Busca 2 — Tasks concluidas HOJE:**
- Use `clickup_filter_tasks` com `date_done_from = hoje 00:00` e `date_done_to = hoje 23:59` + `include_closed: true`.
- Filtrar por assignee do usuario, em TODOS os Spaces ativos.
- Esse filtro e EXATO por data de conclusao — evita puxar tasks fechadas em outros dias que aparecem em `updated_at desc`.
- Cruze com a Busca 1 pra identificar tasks que finalizaram hoje, as que continuam em andamento e as paradas.

Busque em TODOS os Spaces ativos:
- Pique Digital (901313561086)
- Conteudo (901313561098)
- Yabadoo (901313567191)
- Beto Carvalho (901313567164)
- Pessoal (901313561154)

**Ao consolidar:** cruzar as duas buscas e identificar TODAS as tasks que foram finalizadas hoje (comparar timestamps), as que estao em andamento, e as que ficaram paradas.

### 1.3 Google Calendar — Amanha
Liste eventos de AMANHA (todos os calendarios do usuario — IDs em plugin-pique.local.md + CLAUDE.md do plugin).

### 1.4 Chats enriquecidos de hoje (telemetria destilada)

Le `~/.claude/telemetria/chats-enriquecidos.jsonl` (cada linha = 1 chat encerrado via `/pique:encerrar`).

Filtrar entradas cujo `ts` caia em "hoje" BRT (janela: `<hoje>T03:00:00Z` ate `<amanha>T03:00:00Z`).

Pra cada entrada, capturar: `tema`, `resumo`, `projeto`, `categoria`, `wall_seconds`, `commits`, `arquivos_tocados` (so quantos), `tags`.

**Use isso pra:** reconstruir o que foi DECIDIDO/PRODUZIDO no dia em chats que viraram artefato real. E a fonte mais rica do "o que aconteceu" — supera ClickUp quando voce esqueceu de mover tasks.

Limitacao: so captura chats encerrados formalmente. Chat aberto/abandonado nao aparece. Sem problema — vira sinal pra encerrar mais.

### 1.5 Commits do dia (repos PROGRAMAS)

Rodar em paralelo nos repos ativos da pasta `C:\Users\Henrique Carvalho\Documents\PROGRAMAS\` que tem `.git/`:

```bash
git -C "<repo>" log --since="00:00" --oneline --no-merges
```

Repos relevantes (auto-detectar via `Get-ChildItem -Directory | Where-Object { Test-Path .git }`, mas priorizar): MEU-CEREBRO, pique (submodule), plugin-pique, plugin-social-media, plugin-pique-news, pique-consultoria-hub, pique-decks-react, yabadoo-brain, marco-brain, remotion-iairique, docs-pique-hosting.

Agrupar commits por repo. Limitar output a 20 linhas por repo (mais que isso = dia outlier, mencionar mas nao listar tudo).

**Use isso pra:** captar trabalho code-heavy ou de manutencao do cerebro que NUNCA virou task (commit no MEU-CEREBRO de ajuste de mapa, bump de submodule, fix em plugin).

---

## Fase 2: Review do dia

Apresente um resumo cruzando TODAS as fontes (check-in, ClickUp, chats enriquecidos, commits). Quando ClickUp diverge das outras fontes, SINALIZE — provavelmente esqueceu de mover task.

**FILTRO OBRIGATORIO — apenas profissional.** Cortar tudo que e pessoal: academia, conta de luz, familia, saude pessoal, lazer, compras domesticas, etc. Itens pessoais nao entram no review nem no diario do boa-noite. Se o usuario quiser registrar pessoal, ele faz separadamente em outro lugar.

**ESTRUTURA OBRIGATORIA — 3 blocos separados**, mesmo que algum esteja vazio (escrever "Nenhum" em vez de omitir):

```
## Fechamento do dia (apenas profissional):

**Planejado feito** (estava no check-in e fez):
- [item] ✓ [fonte: ClickUp / chat / commit]

**Planejado nao feito** (estava no check-in mas nao fez):
- [item] [motivo curto: "empurrado pra amanha" / "mudou prioridade" / "nao deu tempo"]

**Feito sem estar no plano** (apareceu no dia e fez):
- [tema] [fonte] — resumo curto

**Em andamento / pendente:**
- Task X — Ainda em "Hoje" (nao terminou)
- Task Y — "Fazendo" (em andamento)

**Divergencias entre fontes** (so se houver):
- Trabalhou em X (chat + commit) mas nao tem task — registrar retroativo?
- Task Y ainda em "Hoje" mas chat indica que fechou — mover pra Finalizado?

**Amanha:**
- [HH:MM] Evento 1
- [HH:MM] Evento 2
- (ou: sem compromissos)
```

**Como classificar profissional vs pessoal:**
- Profissional = qualquer coisa relacionada a Pique, Yabadoo, Beto Carvalho, clientes, equipe (Marco/Arthur/Gabriel/Carol/Bruno), produto, codigo, conteudo (@iairique), gestao da empresa, infra Pique, financeiro empresa
- Pessoal = academia, casa, familia, saude pessoal, compras pessoais, lazer, financeiro familia/casa, relacionamentos
- Em duvida: pergunta se conta como profissional. NAO assume.

### 2.1 Mensagem WhatsApp — PRIORIDADE MAXIMA, sai LOGO APOS o review

**REGRA CRITICA:** assim que terminar o review do fechamento (3 blocos + amanha), gerar IMEDIATAMENTE a mensagem WhatsApp pronta pra copiar/colar. Antes de qualquer pergunta, antes da proposta consolidada, antes de executar qualquer coisa. O usuario quer copiar e mandar logo — nao deixar isso em fila.

Formato EXATO (pronto pra copiar):

```
Feito:
- [highlight 1]
- [highlight 2]
- [highlight 3]
- [...]
Fica pra amanha: [task / nada]
```

Regras pra montar a mensagem:
- **So profissional** (mesmo filtro da Fase 2)
- **Destilar pros highlights** (3-7 bullets max — nao listar tudo, escolher o que importa)
- **Linguagem oral, sem jargao** ("plano trimestral fechado", nao "etapa 1+2 do briefing-trimestre-jun-ago")
- **Sem links, sem markdown rico** (vai pra WhatsApp puro)
- **"Fica pra amanha"** = 1 linha curta. Se nao tem nada, escrever "nada"

Apos enviar a mensagem, ENTAO continue pra Fase 2.2.

### 2.2 Perguntas finais do review (MAXIMO 3, diretas)

1. Tem algo que fez hoje que nao ta no ClickUp? (pra registrar)
2. As tasks que ficaram — voltam pra "Essa semana" ou continuam em "Hoje" pra amanha?
3. Alguma nota ou contexto importante pra amanha?

Se NAO tinha check-in, adicione: "Nao achei check-in de hoje. O que foi planejado de manha?" (substitui a pergunta 1)

ESPERE a resposta antes de continuar.

---

## Fase 3: Contexto das tasks

Pergunte TUDO de uma vez (NAO task por task):

"Tem contexto pra adicionar em alguma task? Tipo: onde parou, proximo passo, algo que descobriu. Pode despejar tudo de uma vez que eu organizo."

ESPERE a resposta.

Apos a resposta, organize o que o usuario disse e distribua pra cada task. Se ele nao tiver nada pra adicionar, siga direto.

Para tasks que tiveram contexto, delegue ao `gestor-clickup` pra atualizar a descricao no ClickUp (ele usa `update_task` com `markdown_description`):

- Se **terminou**: registre o que foi feito e o resultado (pra historico).
- Se **nao terminou**: atualize com o estado atual, onde parou, e o proximo passo concreto.
- Se **apareceu algo novo** durante o trabalho (descoberta, decisao, mudanca de rumo): registre tambem.

**Objetivo:** o bom-dia de amanha le o diario + abre a task no ClickUp e tem contexto completo. Zero "o que eu tava fazendo mesmo?".

---

## Fase 4: Proposta consolidada

ANTES de executar qualquer coisa, apresente a proposta completa em UM bloco:

```
## Proposta de fechamento

**ClickUp — Atualizacoes:**
- Task X → mover pra "Finalizado"
- Task Y → manter em "Hoje"
- Task Z → mover pra "Essa semana"

**Diario (diarios/YYYY-MM-DD.md):**
[preview do conteudo completo do diario]

**Mensagem WhatsApp:**
[preview da mensagem]
```

Pergunte: "Ta certo? Mando executar?"

ESPERE aprovacao. Se o usuario pedir ajustes, ajuste e apresente de novo.

---

## Fase 5: Execucao

SO execute apos aprovacao da Fase 4.

### 5.1 Atualizar ClickUp
- Tasks concluidas que ainda nao estao como "Finalizado" → mover para **"Finalizado"**.
- Tasks incompletas: seguir a decisao do usuario (volta pra "Essa semana" ou fica em "Hoje").
- Se o usuario fez algo que nao tinha task, pergunte se quer criar uma task retroativa ou so registrar no diario.
- Se o usuario deu contexto em alguma task (Fase 3), atualizar descricao.

### 5.2 Salvar diario

Crie ou atualize `diarios/YYYY-MM-DD.md`:
- Se o arquivo ja existe (tem check-in): adicione a secao Check-out.
- Se NAO existe: crie com check-in (baseado no que o usuario informou) + check-out.

**Mesma estrutura de 3 blocos da Fase 2 + filtro profissional obrigatorio.** Nada pessoal entra no diario do boa-noite.

```markdown
## Check-out (boa-noite) — apenas profissional
**Horario:** HH:MM

**Planejado feito:**
- [x] [item] — [resumo curto + fonte se relevante]

**Planejado nao feito:**
- [ ] [item] — [motivo curto: empurrado pra X / mudou prioridade / nao deu tempo]

**Feito sem estar no plano:**
- [tema] — [resumo curto + fonte]

**Em andamento:**
- [task / projeto] — [estado atual]

**Aguardando:**
- [item] — aguardando [quem/o que]

**Blockers:**
- [lista ou "nenhum"]

**Notas pra amanha:**
- [contexto que o bom-dia precisa saber]
- [prep necessario pra reunioes]
- [decisoes pendentes]
```

### 5.3 Mensagem WhatsApp — JA FOI GERADA na Fase 2.1

A mensagem WhatsApp ja saiu imediatamente apos o review (Fase 2.1) — usuario ja copiou e mandou. NAO regerar aqui. Se por algum motivo nao foi gerada antes (skip incorreto), gerar agora seguindo o formato da Fase 2.1.

### 5.4 Bloco telemetria do dia

Gere 4-6 linhas factuais sobre o uso de Claude Code hoje. **Regra critica:** zero interpretacao, zero sugestao de corte, zero "voce passou muito tempo em X". SO numeros.

Leia `~/.claude/telemetria/chats.jsonl`, filtre eventos `start`/`end` cujo `ts` caia em "hoje" BRT (UTC-03, hoje BRT comeca 03:00Z do dia civil). Pareie por `session_id`. Para cada sessao com `start` mas sem `end`, use `Date.now()` como fim (sessao ativa).

Para enriquecer cada sessao, use `Grep` pontual (NUNCA `Read` integral — estoura contexto em dias pesados) em `~/.claude/projects/<slug-cwd>/<sessionId>.jsonl`:
- `grep -m1 '"message":{"model"'` — captura modelo usado
- `grep -m1 '"type":"user"'` — captura primeiro prompt

Regras completas de parsing (slug cwd, wall time, primeiro prompt, modelos) em `/pique:tempo` secao "Como ler". Siga elas.

Formato do bloco (adicionar apos a mensagem WhatsApp, antes do Encerrar):

```
Telemetria hoje:
- [N] chats, [Xh]h total (maior: [Yh]h — [projeto] / "[primeiro prompt resumido 6-8 palavras]")
- Projetos: [A] [%], [B] [%], [C] [%]
- Modelos: opus ([n]), sonnet ([n]), haiku ([n])
- Primeiros prompts: "[...]", "[...]", "[...]"
```

Se nao houver nenhum chat de hoje alem do proprio (ex: primeiro uso do dia e foi direto no boa-noite), escreva linha unica: `Telemetria hoje: so este chat ([Xm]m ate agora).`

Nao comente os numeros. Nao diga se foi muito/pouco. Nao compare com ontem.

### 5.5 Encerrar
Diga: "Dia fechado. Descansa que amanha o /pique:bom-dia puxa esse contexto automatico."

---

## Regras

- NAO julgue o que nao foi feito. TDAH significa que prioridades mudam — registre e siga.
- Se o usuario esqueceu de mover tasks no ClickUp durante o dia, faca agora sem cobrar.
- O diario e a PONTE entre boa-noite e bom-dia. Capriche nas notas pra amanha.
- Se amanha tem reuniao, destaque na secao "Notas pra amanha" o que precisa ser preparado.
- Comunique-se em portugues brasileiro, direto e sem formalidade.
- O fechamento inteiro deve levar no maximo 5-10 minutos.
- SEMPRE apresente a proposta completa e espere aprovacao antes de executar.

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. Capturou tudo que aconteceu no dia ou ficou algo de fora?
2. As notas pra amanha sao uteis o suficiente pro bom-dia funcionar bem?
3. Tasks que nao foram feitas foram registradas sem julgamento?
4. O fechamento levou menos de 10 minutos?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
```

2. Anexe em `pique/infra/melhorias-plugin.md` no formato:
```
## YYYY-MM-DD — boa-noite (usuario)
- [melhoria 1]
- [melhoria 2]
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
