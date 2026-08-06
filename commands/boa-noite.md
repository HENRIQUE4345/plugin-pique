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
- Leia `diarios/YYYY-MM-DD.md` (hoje, pela data do sistema).
- Extraia: tasks planejadas, reunioes, blockers do inicio do dia.
- **Se o arquivo NAO existir:** antes de assumir "sem check-in", cheque a hora real (BRT) e o `## HOJE` do `TAREFAS.md`. Se for madrugada (ritual rodando logo apos meia-noite) **e** o `## HOJE` ainda estiver carimbado `<!-- hoje: montado <data de ontem> -->` (nunca virou `consolidado`), o dia que precisa ser fechado e **ontem**, nao hoje — leia `diarios/<ontem>.md` em vez de criar um arquivo vazio pra hoje. Isso e o padrao normal quando uma sessao de trabalho atravessa a meia-noite sem pausa (ja aconteceu varias vezes — ver `log-do-feito.md`, rows "Boa-noite" que fecham no dia anterior ao do timestamp real). Sinalize a decisao pro Henrique em 1 frase no topo do review; nao pergunte antes de agir. Se realmente nao ha check-in nem de hoje nem de ontem, ai sim segue pra Fase 2 e pergunta.

### 1.2 ClickUp — Estado atual do board

Faca DUAS buscas em paralelo:

**Busca 1 — Tasks ativas:**
- ⚠ **NAO filtre por status `"Hoje"` — esse status NAO EXISTE mais** (confirmado 03/08: "Hoje"/"Essa semana" viraram **views por `due_date`**, nao status reais). Filtrar por ele retorna 0 **por definicao**, e o zero mente: parece "dia limpo" quando ha task vencendo hoje em "A fazer".
- **Filtro certo:** `due_date` = hoje (`due_date_gt` = ontem, `due_date_lt` = amanha), **sem** filtro de status (o `include_closed: false` default ja tira Finalizado/Cancelado). Opcionalmente somar as em `"Fazendo"` — esse status e real.
- Filtrar por assignee do usuario, em TODOS os Spaces ativos
- Peca ao `gestor-clickup` o filtro por data **de primeira** — nao gaste uma rodada inteira de agent pra descobrir que o status nao existe.

**Busca 2 — Tasks concluidas HOJE:**
- ⚠ **Limitacao confirmada (03/07):** `list_tasks`/`clickup_filter_tasks` NAO tem parametro `date_done_from`/`date_done_to` e nao retorna campo de conclusao (so `due_date`/`start_date`/`due_relative`). Data de conclusao (`date_done`/`date_closed`, epoch) so existe via `get_task` **individual** — inviavel em lote (pode significar 100+ chamadas pra achar 0-3 tasks concluidas hoje).
- **Default:** NAO rode o sweep exaustivo de `get_task`. O ClickUp e majoritariamente gestao da EQUIPE (a Carol gere) — o trabalho do proprio Henrique raramente vira task la; a fonte de verdade do que ele fez e telemetria + commits + log-do-feito (Fases 1.4-1.6). Use so a Busca 1 (ativas) pra saber o que esta parado/em andamento.
- **Se o Henrique pedir explicitamente** a varredura completa (quer saber com certeza o que fechou hoje no board), ai sim rode `get_task` tasks a tasks — mas avise antes o custo (N chamadas).
- Cruze a Busca 1 com telemetria/commits/log pra identificar o que ficou parado — nao dependa do ClickUp pra saber o que "finalizou hoje".

Busque em TODOS os Spaces ativos. ⚠️ **IDs abaixo conferidos ao vivo em 04/08** contra `plugin-pique/CLAUDE.md` (fonte canonica) — a reorg de 26/06 tinha 6 Spaces com esses nomes/IDs, mas eles **morreram** numa reorg posterior pra 5 Spaces. IDs mortos devolvem 200 com zero tasks, **sem erro** — usar os antigos da um falso "dia limpo" quando na verdade ha task pendente:
- Casa (901313888640)
- Produto (901313890018)
- Clientes (901313890061)
- Studio (901313890136)
- Crescimento (901313888670)

Se a busca com esses IDs voltar 100% vazia em TODOS os Spaces, desconfie — confira contra `plugin-pique/CLAUDE.md` antes de reportar "nada pendente" (pode ter havido reorg de novo).

**Ao consolidar:** cruzar as duas buscas e identificar TODAS as tasks que foram finalizadas hoje (comparar timestamps), as que estao em andamento, e as que ficaram paradas.

### 1.3 Google Calendar — HOJE + amanha

**Amanha:** liste eventos de AMANHA (todos os calendarios do usuario — IDs em plugin-pique.local.md + CLAUDE.md do plugin). Alimenta o bloco "Amanha" do review.

**Hoje:** liste tambem os eventos de HOJE (timeMin=hoje 00:00, timeMax=hoje 23:59) numa call extra, com `condenseEventDetails: false` (precisa dos attendees). Pra cada reuniao de hoje, guardar em `reunioes_hoje[]`: `{summary, start, attendees}`. Serve de contexto do que rolou no dia (quem esteve em que reuniao) — entra na narrativa do review, nao vira fila de processamento. Barato: 1 call.

### 1.4 Chats enriquecidos de hoje (telemetria destilada)

Le `~/.claude/telemetria/chats-enriquecidos.jsonl` (cada linha = 1 chat encerrado via `/pique:encerrar`).

Filtrar entradas cujo `ts` caia em "hoje" BRT (janela: `<hoje>T03:00:00Z` ate `<amanha>T03:00:00Z`).

Pra cada entrada, capturar: `tema`, `resumo`, `projeto`, `categoria`, `wall_seconds`, `commits`, `arquivos_tocados` (so quantos), `tags`.

**Use isso pra:** reconstruir o que foi DECIDIDO/PRODUZIDO no dia em chats que viraram artefato real. E a fonte mais rica do "o que aconteceu" — supera ClickUp quando voce esqueceu de mover tasks.

Limitacao: so captura chats encerrados formalmente. Chat aberto/abandonado nao aparece. Sem problema — vira sinal pra encerrar mais.

### 1.5 Commits do dia (repos PROGRAMAS)

⚠️ **Achado 05-06/08: `--since="00:00"` sozinho e ERRADO nesta maquina e mente sem avisar.** O shell (Git Bash) nao tem tzdata — `date`/`git log` tratam tudo como se fosse UTC, entao `--since="00:00"` pega desde meia-noite **UTC**, que e **21:00 BRT do dia anterior**. Resultado pratico: um dia inteiro de commits (manha/tarde/inicio da noite em BRT) fica **fora da janela** e o log parece "quase sem commits" quando na real teve 15-20. Nao ha erro nem aviso — e um falso "dia limpo" silencioso, igual aos IDs de Space mortos do ClickUp (ver 1.2).

**Fix: usar a mesma janela BRT explicita da Fase 1.4** (hoje 03:00Z ate amanha 03:00Z — equivale a 00:00–23:59 BRT), em vez de `--since="00:00"`:

```bash
git -C "<repo>" log --since="<hoje> 03:00:00" --until="<amanha> 03:00:00" --oneline --no-merges
```

(`<hoje>`/`<amanha>` em `YYYY-MM-DD`; como o shell trata local=UTC, "03:00:00" sem sufixo bate exatamente com a virada BRT.) Se rodar numa maquina com tzdata de verdade (ex: `TZ=America/Sao_Paulo` funcionando), o equivalente e `--since="<hoje> 00:00:00" --until="<hoje> 23:59:59"` com o `TZ` setado — mas **confira primeiro** (`date` deveria devolver `-03` no fuso, nao `GMT`/`UTC`) antes de trocar a formula, senao volta a mentir do jeito oposto.

Repos relevantes (auto-detectar via `Get-ChildItem -Directory | Where-Object { Test-Path .git }`, mas priorizar): MEU-CEREBRO, pique (submodule), plugin-pique, plugin-social-media, plugin-pique-news, pique-consultoria-hub, pique-decks-react, yabadoo-brain, marco-brain, remotion-iairique, docs-pique-hosting.

Agrupar commits por repo. Limitar output a 20 linhas por repo (mais que isso = dia outlier, mencionar mas nao listar tudo).

**Use isso pra:** captar trabalho code-heavy ou de manutencao do cerebro que NUNCA virou task (commit no MEU-CEREBRO de ajuste de mapa, bump de submodule, fix em plugin).

**git status (nao so log):** nos MESMOS repos, rodar tambem `git -C "<repo>" status --short` pra flagar **trabalho nao-commitado** (modificado/novo mas ainda fora de commit). E uma ponta que escapa — sinaliza no review ("repo X com N arquivos sujos — commitar?") pra nao perder.

### 1.6 Ler o log do feito de hoje + o HOJE + o SEMANA do trilho

1. Read `conhecimento/produtividade/log-do-feito.md`. Capture as linhas cuja Data = hoje (DD/MM) — sao as tarefas ja fechadas pelo `/encerrar` com modo + P/E + duracao.
2. Read `TAREFAS.md` (raiz do cerebro), secao `## HOJE`. Capture o estado de cada item: `[x]` (feito), `[~]` (iniciado e nao fechado), `[ ]` (nem comecou).
3. Read a secao `## SEMANA` do MESMO `TAREFAS.md`. Capture o estado atual de cada foco: `[ ]`/`[~]`/`[x]` + o titulo-nucleo + o **sufixo de progresso existente** (`_(↻ DD/MM: ...)_`, se houver). Serve pro passo 3.5 da Fase 5.2b (devolver progresso pro SEMANA).

**Use isso pra:** (a) montar o **Balanco de modos** na Fase 2; (b) saber o que precisa de backfill/devolucao na Fase 5.2b; (c) cruzar o feito de hoje com os focos do SEMANA (passo 3.5 da 5.2b). Cruze com a telemetria (1.4) e commits (1.5): item `[x]` no HOJE mas ausente do log = feito sem `/encerrar`, vai precisar de backfill.

> **Principio da varredura:** as fontes 1.1–1.6 sao **lentes que se sobrepoem, nao somam**. O mesmo trabalho aparece em 3-4 delas (uma sessao de codigo = chat enriquecido + commit + linha de log + task ClickUp). O boa-noite **cruza e deduplica na narrativa**, mas **nunca soma os relogios num numero unico** (ver Fase 5.4). A fonte 1.7 (TRANSCRIB) e **sinal de "tem coisa pra documentar"**, nao tempo — entra no review e na proposta, nunca vira 4a lente de relogio.
>
> **WhatsApp NAO entra no boa-noite** (cortado 16/07 — pedido do Henrique desde 09/07): poluia o fechamento com ruido de caixa de entrada. Cobranca de mensagem e trabalho do `/plugin-whatsapp:triage`, sob demanda.

### 1.7 Timeline do dia (TRANSCRIB) — atras da flag `transcrib_conectado`

**O que e.** TRANSCRIB (`C:\Users\Henrique Carvalho\Documents\PROGRAMAS\TRANSCRIB`, app "YabaDoo") e a fonte-mestra de contexto bruto do dia (mais rica que o `DIARIO.md`) — o Henrique fala por audio o tempo todo; o app guarda sessoes (reuniao/Plaud/gravacao), notas rapidas e notas Plaud em `captura.db` (`%LOCALAPPDATA%\YabaDoo`). Conceito: `conhecimento/produtividade/transcrib-fonte-mestra-do-dia.md`.

**Gate:** checar a flag `transcrib_conectado` em `plugin-pique.local.md`.

**Se ausente/`false` (estado ATUAL — a flag so liga depois que o Henrique validar o app v2.1.0 ao vivo / E2E):** imprimir 1 linha e seguir — **nao ler, nao quebrar, nao perguntar**:
`> TRANSCRIB: nao conectado (flag off) — timeline do dia vem do diario + telemetria. (slot reservado)`

**MAS — mesmo com flag off, checar exports MANUAIS.** O Henrique pode exportar os `.md` na mao pra `inbox/yabadoo-desktop/` (ponte ate a integracao ligar). Dar um `ls inbox/yabadoo-desktop/*.md` (barato). Se houver arquivos, **classificar cada um** (grep em `pique/sessoes/` + `sessoes/` por data+slug) e guardar `transcrib_manual[]` pra apresentar na Fase 2:
- **destilado** (ja tem ata/doc) → redundante → marcar pra excluir (5.2c)
- **nao-destilado** (sessao/nota sem ata) → candidato a documentar (5.2c)
- **bruto-clipboard / pessoal-trivial** → frio pro `/inbox` ou descarte
NAO processar aqui — so detectar (radar) e sinalizar: "N exports manuais no inbox/yabadoo-desktop/ — documentar agora ou deixar pro /inbox?".

**Se `true` (futuro) — DETECTAR a fila, NAO reimplementar o export.** O app ja encapsula a destilacao em `processor.exportar_dia_no_cerebro()` (escreve os `.md` do dia em `inbox/yabadoo-desktop/` e **so entao** chama `marcar_exportadas()` — dois-passos atomico e idempotente, ja no codigo). O boa-noite e RADAR: aqui ele so **detecta a fila** — ler a contagem de `notas_manager.nao_exportadas()` (quantas pendentes; quantas sao `nota`/`sessao` vs bruto) — e guarda pra apresentar na Fase 2. A leitura/escrita pesada e DELEGADA ao Export na Fase 5.2c. **O bruto-do-dia (clips de clipboard) NAO entra na destilacao** (decisao do Henrique): so notas+sessoes contam pro review/diario; o bruto fica como arquivo frio no inbox pro `/inbox` garimpar depois.

> **1.8 — REMOVIDA (22/07/2026).** Era a deteccao de gravacoes numa pasta unica do Drive
> (`Meet Recordings\`). A empresa saiu da gravacao centralizada: **cada um grava a propria
> reuniao** e ainda **nao ha destino definido** pro material. Sem pasta unica, nao ha o que
> varrer — o radar de reuniao sai do boa-noite inteiro (preview da 2.2, plano da 3, execucao
> da 5.2d). O que sobra do assunto: as reunioes do dia aparecem como **contexto** via Calendar
> (1.3), sem virar fila de processamento. Quando o destino novo for definido, esta secao volta
> apontando pra ele.

---

## Fase 2: Review do dia

Apresente um resumo cruzando TODAS as fontes (check-in, ClickUp, chats enriquecidos, commits). Quando ClickUp diverge das outras fontes, SINALIZE — provavelmente esqueceu de mover task.

**FILTRO OBRIGATORIO — apenas profissional.** Cortar tudo que e pessoal: academia, conta de luz, familia, saude pessoal, lazer, compras domesticas, etc. Itens pessoais nao entram no review nem no diario do boa-noite. Se o usuario quiser registrar pessoal, ele faz separadamente em outro lugar.

**ESTRUTURA OBRIGATORIA — 3 blocos separados**, mesmo que algum esteja vazio (escrever "Nenhum" em vez de omitir).

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

**Balanco de modos** (lente do TRILHO — so o que passou por /iniciar→/encerrar, do log da Fase 1.6):
- Pensar: [n] · [Xmin] | Produzir: [n] · [Xmin] | Afiar: [n] · [Xmin]
- Planejado vs eventualidade: [nP] planejadas (P) / [nE] ad-hoc (E)
- Parciais (iniciados, nao fechados): [n] · [Xmin logado] — devolvidos pro radar (ver 5.2b)
- Cobertura do trilho: o log cobriu ~[X]% do dia; ~[Y]% rodou FORA do trilho (chats sem /iniciar, micro-operacao) — a telemetria ve como atividade (cat. A/B/C) mas SEM modo confiavel. Nao inventar modo pra esse pedaco.
- (so CONSTATAR — sem julgar. % e aproximacao: `Y ≈ max(0,(wall_telemetria − min_trilho)/wall_telemetria)`, e wall-clock infla com janela paralela. Se o log esta vazio mas houve trabalho: "dia rodou sem /iniciar→/encerrar — log nao capturou".)

**Leitura do dia** (constatacao factual — NAO e nota, NAO compara com ontem):
- [1 frase: forma do dia = mix de modos + tipo gestao/producao/afiar] · [1 frase: aderencia = planejado vs eventualidade] · [1 frase: o que materializou = commits/entregas + deep-work de produto sim/nao] · [se aplicavel: "nada travou por voce" / o que travou e por que]
- Regras CRAVADAS deste bloco: **constatacao, nao julgamento; sem "voce devia"; NAO comparar com ontem** (comparacao temporal so no /review-semanal, que tem serie); **wall-clock NAO entra** (usa modos + P/E + commits — sinais honestos). **Deep-work de produto = binario**, pela ORIGEM dos commits (repo de PRODUTO — yabadoo-brain, TRANSCRIB, painel Beco, etc. — vs so cerebro/gestao/doc; se so cerebro → "deep-work de produto: zero hoje").

**Amanha:**
- [HH:MM] Evento 1
- [HH:MM] Evento 2
- (ou: sem compromissos)

**Inbox (acumulado):**
- [N] contextos em `inbox/contextos/` + [M] linhas novas no `inbox/DIARIO.md` — rodar /inbox agora ou deixar pro ritual de quarta? _(NAO disparo sozinho — /inbox pausa pra voce revisar o PLANO.md)_
- (ou: inbox limpo)
```

**Como classificar profissional vs pessoal:**
- Profissional = qualquer coisa relacionada a Pique, Yabadoo, Beto Carvalho, clientes, equipe (Marco/Arthur/Gabriel/Carol/Bruno), produto, codigo, conteudo (@iairique), gestao da empresa, infra Pique, financeiro empresa
- Pessoal = academia, casa, familia, saude pessoal, compras pessoais, lazer, financeiro familia/casa, relacionamentos
- Em duvida: pergunta se conta como profissional. NAO assume.

### 2.1 Mensagem de stand-up (Slack `#standup`) — PRIORIDADE MAXIMA, sai LOGO APOS o review

**REGRA CRITICA:** assim que terminar o review do fechamento (3 blocos + amanha), gerar IMEDIATAMENTE a mensagem de stand-up e mostrar no chat. Antes de qualquer pergunta, antes da proposta consolidada, antes de executar qualquer coisa.

Formato EXATO:

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
- **Excluir Afiar de ferramenta interna/pessoal de IA** (scripts do proprio Claude Code, ajustes de skill/plugin, automacao do fluxo de trabalho) — mesmo sendo Afiar profissional legitimo e mesmo que va pro diario/log normalmente, e "solto" pra quem le o canal (Marco/equipe): nao e o que a empresa precisa saber no check-in diario. Regra pratica: se o item so importa pro proprio Henrique operar melhor a IA, fica de fora.
- **Destilar pros highlights** (3-7 bullets max — nao listar tudo, escolher o que importa)
- **Linguagem oral, sem jargao** ("plano trimestral fechado", nao "etapa 1+2 do briefing-trimestre-jun-ago")
- **Corpo em 1a pessoa** ("fechei", "mandei"); 3a pessoa so pra citar terceiros
- **Sem links, sem markdown rico** (texto puro)
- **"Fica pra amanha"** = 1 linha curta. Se nao tem nada, escrever "nada"

**Envio (regra revista 15/07 — direto, SEM draft):**
1. Mostrar a mensagem no chat e perguntar: "Mando pro #standup?"
2. Apos o **OK explicito do Henrique**, enviar DIRETO via `slack_send_message` no canal **`#standup` (`C0BGNGDMHC7`)** — NAO usar `slack_send_message_draft` (o draft virou passo burocratico: o Henrique ja revisou o dia inteiro no chat). Se existir um `draft_id` de rascunho anterior, passa-lo no envio pra limpar o rascunho junto.
3. **Excecao — conteudo sensivel** (numero de dinheiro, nome em cobranca dura, assunto de socio): destacar o trecho sensivel ao mostrar a mensagem e so enviar apos OK mesmo assim.
4. **Fallback — Slack indisponivel nesta sessao** (o MCP `slack` e HTTP+OAuth no user scope — `https://mcp.slack.com/mcp` — e o token expira/desloga; quando isso acontece as tools `slack_*` somem da sessao): NAO travar. Entregar a mensagem como texto pro Henrique colar no `#standup`, sinalizar 1 linha ("Slack des-autenticado — cola manual e reautentique via `/mcp` numa sessao interativa") e seguir o ritual.

Apos o envio (ou o fallback), ENTAO continue pra Fase 2.2.

### 2.2 Perguntas finais do review (MAXIMO 3, diretas)

1. Tem algo que fez hoje que nao ta no ClickUp? (pra registrar)
2. Os itens que ficaram — voltam pro radar (continuam no SEMANA / vao pro RESTO) ou ficam no HOJE pra amanha? _(se ficam pra amanha, o boa-noite NAO limpa esses; ver 5.2b)_
3. Alguma nota ou contexto importante pra amanha? _(prep pra reuniao de amanha entra como "Notas pra amanha" no diario — o bom-dia oferece como candidato do HOJE)_

Se NAO tinha check-in, adicione: "Nao achei check-in de hoje. O que foi planejado de manha?" (substitui a pergunta 1)

ESPERE a resposta antes de continuar.

> ⚠️ **SALVE O DIARIO ANTES DE PERGUNTAR — nao deixe o dia refem da resposta.**
> **Evidenciado 2x** (24/07 e 03/08): o ritual entrega o review, envia a stand-up, faz as 3 perguntas
> **e morre ali** — o Henrique nao volta, e as Fases 3-5 nunca rodam. Resultado: o dia inteiro de
> varredura (telemetria + commits + Calendar + ClickUp) evapora, o `diarios/YYYY-MM-DD.md` **nao
> existe**, e o bom-dia do dia seguinte acorda sem ponte.
>
> **Regra:** logo apos mostrar as 3 perguntas, **escreva ja** o `diarios/YYYY-MM-DD.md` com o
> check-out do que voce JA sabe (os 3 blocos + amanha + leitura do dia), marcando no fim:
> `**Ritual incompleto:** aguardando as 3 respostas — trilho NAO consolidado.`
> Quando as respostas chegarem, a Fase 5.2 **atualiza** esse arquivo (nao cria outro) e a 5.2b
> consolida o trilho. Se nao chegarem, o dia ja esta salvo.
>
> O que **continua** dependendo da resposta (nao antecipar): consolidar o `## HOJE`, marcar `[x]`,
> limpar/carimbar o trilho, mexer no ClickUp. Marcar item como feito sem confirmacao viola
> "validar fonte real, nao derivar da memoria".

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

**ClickUp — Atualizacoes (minimo):**
- Task X (concluida) → mover pra "Finalizado"
- (incompletas NAO mudam status aqui — o trilho/HOJE cuida disso na 5.2b)

**Trilho (TAREFAS.md) — consolidacao:**
- [resumo do que vai pro log + o que volta pro radar — preview da 5.2b]

**TRANSCRIB (so se flag transcrib_conectado on):**
- [N] notas/sessoes pendentes → disparar o Export do app → zerar a fila

**Diario (diarios/YYYY-MM-DD.md):**
[preview do conteudo completo do diario]

**Stand-up (#standup):**
[ja enviada na 2.1 / pendente de OK / fallback cola-manual]
```

> As secoes **Reunioes** e **TRANSCRIB** so aparecem se houver itens (omitir se vazias).

Pergunte: "Ta certo? Mando executar?"

ESPERE aprovacao. Se o usuario pedir ajustes, ajuste e apresente de novo.

---

## Fase 5: Execucao

SO execute apos aprovacao da Fase 4.

### 5.1 Atualizar ClickUp (minimo)
- Tasks concluidas que ainda nao estao como "Finalizado" → mover para **"Finalizado"**.
- Tasks incompletas: NAO mexer no status ClickUp ("Essa semana"/"Hoje" nao existem mais). O que ficou pendente e tratado no trilho (HOJE) pela Fase 5.2b, nao no ClickUp.
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

**Leitura do dia:**
- [forma · aderencia · materializou + deep-work de produto sim/nao · travou?]
```

> O campo **Leitura do dia** e o mesmo texto mostrado na Fase 2 (bloco "Leitura do dia"). A escrita dele no diario e feita na sub-fase 5.4b (nao aqui) — aqui so fica documentado no template. Regras: factual, sem comparacao temporal, sem cobranca, sem wall-clock.

### 5.2b Consolidar trilho → log (camada Log do feito)

Fecha o ciclo do dia no `TAREFAS.md` + `log-do-feito.md`. **Re-Read o `## HOJE` AGORA** (pode ter mudado durante o review — outra janela).

**Guarda de re-execucao (N6):** se a 1a linha do HOJE ja e `<!-- hoje: consolidado AAAA-MM-DD -->` com data = hoje, o boa-noite ja fechou hoje. Perguntar: *"ja fechei hoje — quer so revisar, ou re-consolidar?"* Nao re-tocar log/trilho sem confirmar.

1. **Backfill do log (idempotente):** pra cada `[x]` do `## HOJE`, antes de anexar **grep no `log-do-feito.md` de hoje por (DD/MM + titulo)** — se ja existe, pular (nao duplicar). Senao anexar (tempos best-effort da 1.4/1.5 + modo + **P**, formato do `/encerrar` 3.4b).
2. **Reconciliar `[~]` orfaos (iniciados sem /encerrar) — B1:** pra cada `[~]` com `(iniciada: HH:MM)` que NAO virou `[x]`:
   - **(a) Logar parcial:** `| DD/MM | titulo (parcial) | HH:MM–HH:MM | Nmin | Modo | P |` — inicio = o `(iniciada:)`; fim = ultimo rastro real (commit/edit da 1.5 ou last_ts de chat da 1.4); sem rastro → `Nmin = ?` + `(parcial — fim incerto)`.
   - **(b) Devolver:** `[~]`→`[ ]` **removendo o sufixo `(iniciada:)`** (o tempo ja foi pro log; manter calcularia duracao errada amanha). Esta no SEMANA → sobrevive la; ad-hoc → `## RESTO` como `[ ]`.
   - **(c) Sinalizar** no review: "N itens ficaram pela metade — devolvidos pro radar, tempo parcial logado."
3. **Outros `[ ]` (nunca comecaram):** do SEMANA → sobrevivem la (so saem do HOJE); ad-hoc fora do SEMANA → `## RESTO`. Seguir a Fase 2.2 (se "fica pra amanha", manter no HOJE).
3.5. **Refletir progresso no SEMANA (devolver o feito pro trilho vivo):** roda AGORA — com o `## HOJE` ainda populado (antes do passo 4 limpar) — pra devolver o progresso do dia aos focos macro do `## SEMANA`. NAO confundir com a "Leitura do dia" (Fase 2): aquilo e texto de review; isto MARCA estado no SEMANA.
   - **(a) Re-Read o `## SEMANA`** (pode ter mudado desde a 1.6 — outra janela).
   - **(b) Cruzar por titulo-nucleo/tema:** pra cada foco do SEMANA, procurar rastro no **feito de hoje** = itens `[x]`/`[~]` do `## HOJE` + linhas do `log-do-feito.md` com Data=hoje. O bom-dia mantem o mesmo titulo-nucleo ao puxar do SEMANA pro HOJE → o match de volta e direto.
   - **(c) Aplicar estado MONOTONICO** (so avanca `[ ]`→`[~]`→`[x]`, nunca regride; a regeneracao de segunda e novo ciclo, nao regressao):
     - progrediu e estava `[ ]` → `[~]`;
     - **`[x]` so pela heuristica CONSERVADORA de conclusao:** o item do HOJE mapeado fechou (`[x]`) **E** o texto do foco do SEMANA nao tem cauda pendente obvia (ex.: "garantir 1a entrega no painel" ainda aberta → fica `[~]`). **Qualquer ambiguidade → `[~]`. NUNCA adivinhar `[x]`.**
     - sem progresso → **nao toca** o item.
   - **(d) Escrever/sobrescrever o sufixo** `_(↻ DD/MM: <=8 palavras do que saiu>)_` (italico) SO no foco que avancou. Sobrescreve o sufixo da noite anterior (nao acumula). Removido na regeneracao de segunda (pelo /planejamento-semanal).
   - **(e) Nao mapeou com confianca → NAO marca** (deixa como esta) e acumula pro balanco. Regra: validar fonte, nao inventar.
   - **(f) Reportar no review (§2):** "SEMANA: N focos andando, M fechados, K sem mapear".
   - **(g) Edit MINIMO — so `## HOJE` + `## SEMANA`.** NAO tocar AGUARDANDO/DECISOES/FRENTES/RESTO. Preservar a ordem fisica (`## HOJE` vem ANTES de `## SEMANA` no TAREFAS.md — nao reordenar).
4. **Limpar e carimbar o HOJE:** resetar pro placeholder COM o carimbo de estado:
   ```
   ## HOJE
   <!-- hoje: consolidado AAAA-MM-DD -->
   _(vazio — rodar /bom-dia)_
   ```
   (`consolidado` distingue "boa-noite fechou" de "nunca montado" — o gate do bom-dia Fase 0.2 le isso.) **Excecao:** se ficou item "pra amanha" no HOJE, ele NAO esta limpo → **nao** carimbar `consolidado`.
5. **Regra de mes do log (N5):** a secao e `## YYYY-MM` da **data de inicio** do item (coluna Data), nao do relogio do ritual. Usar o **dia BRT sendo fechado** (janela `T03:00Z`, igual telemetria) — apos meia-noite fecha o dia anterior, nao o civil. **Grep se `## YYYY-MM` ja existe** antes de criar (idempotente) e dar append.
6. **Commit do cerebro:** diario + TAREFAS.md + log-do-feito.md em 1 commit `cerebro: boa-noite YYYY-MM-DD` (submodule `pique/` separado se tocado). Sem push. O TAREFAS.md agora tambem carrega a mudanca do `## SEMANA` (passo 3.5) alem do `## HOJE`.

> **Decisao de design (SEMANA-vivo):** a marcacao de progresso no `## SEMANA` fica **centralizada aqui no boa-noite** (passo 3.5) — o `/encerrar` NAO muda. Razao: /encerrar roda varias vezes ao dia (1 por item); deixar o SEMANA pra ele espalharia a responsabilidade e arriscaria sobrescritas concorrentes do sufixo `_(↻ ...)_`. O boa-noite consolida tudo 1x no fim do dia. Nao reabrir isso.

### 5.2c Zerar o TRANSCRIB (delegar o Export) — atras da flag

**Se flag `transcrib_conectado` off (estado ATUAL):** o Export automatico e no-op (nao ha app pra disparar). **MAS se a 1.7 detectou `transcrib_manual[]`** (exports feitos a mao) E o Henrique aprovou tratar na 2.2, aplicar a **regra de limpeza do desktop** — **dois-passos sempre** (destino escrito ANTES de apagar o bruto):
- **destilado** (ja tem ata) → **excluir o bruto** (a ata ja e o destino; nao deixar redundante acumulando no inbox).
- **nao-destilado destilavel** (sessao/nota) → **documentar** (ata em `pique/sessoes/`, aplicando sensibilidade — **Nivel B** se tocar salario/fiscal/feedback-de-pessoa/familia) → **so entao excluir** o bruto. Se e sensivel e o escopo do que entra nao esta claro, **segurar o bruto e perguntar** (nunca apagar sensivel sem confirmar).
- **bruto-clipboard cru / pessoal-trivial** → frio pro `/inbox` OU descartar (pessoal fora do escopo profissional).
- **Resíduo do Henrique** de qualquer sessao documentada aqui → rotear pro `TAREFAS.md` igual `/pos-reuniao` §5.3b (decisao→DECISOES, acao→SEMANA/RESTO, espera→AGUARDANDO; filtro anti-cemiterio).

Se a flag esta off E **nao ha** export manual: 1 linha e seguir (ver 1.7). Nao tentar ler/escrever nada.

**Se on (futuro) — DELEGAR ao app, NAO escrever/marcar a mao.** O metodo `processor.exportar_dia_no_cerebro()` ja faz o dois-passos atomico (escreve os `.md` do dia em `inbox/yabadoo-desktop/` E **so entao** `marcar_exportadas()`; idempotente). O boa-noite:
1. **Dispara o Export** (via a forma que o app expoe — o "como" tecnico fica no doc do repo TRANSCRIB, nao aqui).
2. **Le o retorno** `{ok, exportadas, sessoes}`. Se `ok`: do que foi exportado, LER so **notas-rapidas + sessoes** pra destilar no review/diario — **o bruto-do-dia NAO entra** (decisao do Henrique). Sinalizar "N notas + M sessoes no inbox/yabadoo-desktop/".
3. Se `!ok`: NAO marcar nada (o metodo ja garante — nota pendente segue na fila). Sinalizar a falha e seguir.
- **NUNCA** inverter os dois-passos a mao (marcar antes de escrever = nota orfa + audio apagado pela auto-limpeza). O metodo do app ja e a ordem certa — o radar so delega.
- **O1 (Compromisso → Calendar) NAO e coberto pelo Export** (que faz so cerebro+inbox): compromisso com data/hora detectado na timeline continua sendo roteado pelo boa-noite/inbox depois. Nao tratar o Export como se fizesse os 3 outputs.

> **5.2d — REMOVIDA (22/07/2026).** Era o par da 1.8: documentar a reuniao detectada e so
> entao arquivar o material na pasta do Drive. Some junto com a fonte. Reuniao gravada hoje
> vira sessao pelo caminho manual: `/pos-reuniao` com a transcricao em maos (modo Manual ou
> Lote).

### 5.3 Stand-up no Slack — JA FOI TRATADA na Fase 2.1

A mensagem de stand-up ja saiu imediatamente apos o review (Fase 2.1) — enviada no `#standup` apos o OK, ou entregue como texto no fallback. NAO regerar aqui. Se por algum motivo nao foi gerada antes (skip incorreto), gerar agora seguindo o formato + regra de envio da Fase 2.1.

### 5.4 Bloco telemetria do dia

Gere 4-6 linhas factuais sobre o uso de Claude Code hoje. **Regra critica:** zero interpretacao, zero sugestao de corte, zero "voce passou muito tempo em X". SO numeros.

Leia `~/.claude/telemetria/chats.jsonl`, filtre eventos `start`/`end` cujo `ts` caia em "hoje" BRT (UTC-03, hoje BRT comeca 03:00Z do dia civil). Pareie por `session_id`. Para cada sessao com `start` mas sem `end`, use `Date.now()` como fim (sessao ativa).

Para enriquecer cada sessao, use `Grep` pontual (NUNCA `Read` integral — estoura contexto em dias pesados) em `~/.claude/projects/<slug-cwd>/<sessionId>.jsonl`:
- `grep -m1 '"message":{"model"'` — captura modelo usado
- `grep -m1 '"type":"user"'` — captura primeiro prompt

Regras completas de parsing (slug cwd, wall time, primeiro prompt, modelos) em `/pique:tempo` secao "Como ler". Siga elas.

Formato do bloco — **3 lentes** que medem coisas diferentes e **NAO somam entre si** (adicionar apos a mensagem de stand-up, antes do Encerrar):

```
As 3 lentes do dia (medem coisas diferentes — NAO somar entre si):

Lente 1 — TRILHO (intencao/modo): [Xh] logados · Pensar/Produzir/Afiar [.../.../...]
  → o tempo que voce decidiu gastar, por modo. So pega trabalho com /iniciar→/encerrar.

Lente 2 — TELEMETRIA (presenca/wall-clock): [N] chats · [Xh] wall total
  (maior: [Yh] — [projeto] / "[1o prompt 6-8 palavras]") · projetos: [A%] [B%] [C%] · modelos: opus[n] sonnet[n]
  → quanto tempo de janela aberta. INFLA com janelas paralelas — nao e tempo focado.

Lente 3 — COMMITS (output/prova): [N] commits em [M] repos ([repo:n], [repo:n])
  + [K] repos com trabalho nao-commitado (sujo — ver 1.5)
  → o que materializou. Sem tempo — e evidencia de entrega.
```

Se nao houver nenhum chat de hoje alem do proprio: `Telemetria hoje: so este chat ([Xm]m ate agora).`

**Regra critica:** zero interpretacao, zero soma, zero "voce passou muito tempo em X". As 3 lentes ficam abertas, divergentes, honestas — cada uma mente sozinha, por isso ficam lado a lado. A reconciliacao real (dedup cross-lente) e trabalho futuro (Bloco 4) — nao force aqui. Nao compare com ontem.

### 5.4b Persistir a Leitura do dia no diario

Faz um `Edit` no `diarios/YYYY-MM-DD.md` (o mesmo do 5.2) adicionando o campo **"Leitura do dia"** ao FIM do check-out — o MESMO texto mostrado no bloco "Leitura do dia" da Fase 2. E o passo que forma a serie que o `/review-semanal` colhe depois (ele ja le os diarios da semana na §1.3).

```markdown
**Leitura do dia:**
- [forma · aderencia · materializou + deep-work de produto sim/nao · travou?]
```

- **Idempotente:** se o campo `**Leitura do dia:**` ja existe no check-out (re-consolidacao — ver guarda N6 da 5.2b), **sobrescrever** o valor, NAO duplicar o campo.
- Mesmas regras cravadas: constatacao factual, sem comparacao temporal, sem cobranca, sem wall-clock.
- Vai no mesmo commit do cerebro (5.2b passo 6) — nao e commit separado.

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
- O boa-noite e RADAR: DETECTA tudo (Fase 1, barato) e DELEGA o processamento pesado aos comandos donos (TRANSCRIB→Export do app; transcricao em maos→/pos-reuniao). NAO processa reuniao/inbox/sessao inline — isso quebra o tempo e duplica os comandos donos.
- WhatsApp NAO faz parte do boa-noite (cortado 16/07) — cobranca de mensagem e do `/plugin-whatsapp:triage`, sob demanda.
- O envio da stand-up no `#standup` e DIRETO (`slack_send_message`) mas SEMPRE apos OK explicito do Henrique no chat. Nunca enviar sem mostrar antes.
- O TRANSCRIB e DOIS-PASSOS: escrever o destino PRIMEIRO, marcar/arquivar SO depois. Nunca inverter (perde rastro / apaga audio).

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. Capturou tudo que aconteceu no dia ou ficou algo de fora?
2. As notas pra amanha sao uteis o suficiente pro bom-dia funcionar bem?
3. Tasks que nao foram feitas foram registradas sem julgamento?
4. O fechamento levou menos de 10 minutos? (a deteccao dos 4 pontos e barata; se estourou, foi processamento pesado que devia ter sido delegado/opt-in)
5. A stand-up foi mostrada no chat ANTES do envio, e so foi pro `#standup` apos o OK explicito (ou caiu no fallback cola-manual sem travar)?

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
