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

**git status (nao so log):** nos MESMOS repos, rodar tambem `git -C "<repo>" status --short` pra flagar **trabalho nao-commitado** (modificado/novo mas ainda fora de commit). E uma ponta que escapa — sinaliza no review ("repo X com N arquivos sujos — commitar?") pra nao perder.

### 1.6 Ler o log do feito de hoje + o HOJE do trilho

1. Read `conhecimento/produtividade/log-do-feito.md`. Capture as linhas cuja Data = hoje (DD/MM) — sao as tarefas ja fechadas pelo `/encerrar` com modo + P/E + duracao.
2. Read `TAREFAS.md` (raiz do cerebro), secao `## HOJE`. Capture o estado de cada item: `[x]` (feito), `[~]` (iniciado e nao fechado), `[ ]` (nem comecou).

**Use isso pra:** (a) montar o **Balanco de modos** na Fase 2; (b) saber o que precisa de backfill/devolucao na Fase 5.2b. Cruze com a telemetria (1.4) e commits (1.5): item `[x]` no HOJE mas ausente do log = feito sem `/encerrar`, vai precisar de backfill.

> **Principio da varredura:** as fontes 1.1–1.7 sao **lentes que se sobrepoem, nao somam**. O mesmo trabalho aparece em 3-4 delas (uma sessao de codigo = chat enriquecido + commit + linha de log + task ClickUp). O boa-noite **cruza e deduplica na narrativa**, mas **nunca soma os relogios num numero unico** (ver Fase 5.4).

### 1.7 Timeline do dia (TRANSCRIB) — [STUB, integracao futura]

**Status: NAO CONECTADO.** TRANSCRIB (`C:\Users\Henrique Carvalho\Documents\PROGRAMAS\TRANSCRIB`, app "YabaDoo") e a fonte-mestra de contexto bruto do dia (mais rica que o `DIARIO.md`) — o Henrique fala por audio o tempo todo; o app guarda todas as sessoes (Meet/Plaud/gravacao direta), notas rapidas e notas Plaud. Conceito completo: `conhecimento/produtividade/transcrib-fonte-mestra-do-dia.md`.

**Comportamento HOJE:** checar a flag `transcrib_conectado` em `plugin-pique.local.md`. Se ausente/`false` (ou se `TRANSCRIB/historico.json` nao existir), imprimir 1 linha e seguir — **nao ler, nao quebrar, nao perguntar**:
`> TRANSCRIB: nao conectado ainda — timeline do dia vem do diario + telemetria. (slot reservado)`

**Comportamento FUTURO (quando `transcrib_conectado: true`):**
1. **Puxar o dia** (leitura direta de JSON — sem servidor): `historico.json` (registros com `timestamp` de hoje), `notas.json` (notas nao-consolidadas/nao-exportadas, ordenar por `criada_em`), `.txt` de transcricoes (abrir `utf-8-sig`).
2. **Montar a TIMELINE** do dia (ordenar por hora real) e **cruzar** com as fontes 1.1–1.6.
3. **3 outputs** — rotear cada item: **(O1) COMPROMISSO → Calendar** (subtipo compromisso/reuniao com data) · **(O2) ATUALIZA o cerebro** (insight/ideia/decisao → nota, cruzando `_mapa.md`) · **(O3) → INBOX** (bruto/ambiguo → linha `[HH:MM] [TRANSCRIB] [AUDIO]` no `inbox/DIARIO.md`). **Dedup (N8):** se o momento ja esta no DIARIO por outro canal (±5min), ENRIQUECER a nota existente, nao criar linha nova.
4. Zerar a fila → Fase 5.2c.

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

**Balanco de modos** (lente do TRILHO — so o que passou por /iniciar→/encerrar, do log da Fase 1.6):
- Pensar: [n] · [Xmin] | Produzir: [n] · [Xmin] | Afiar: [n] · [Xmin]
- Planejado vs eventualidade: [nP] planejadas (P) / [nE] ad-hoc (E)
- Parciais (iniciados, nao fechados): [n] · [Xmin logado] — devolvidos pro radar (ver 5.2b)
- Cobertura do trilho: o log cobriu ~[X]% do dia; ~[Y]% rodou FORA do trilho (chats sem /iniciar, micro-operacao) — a telemetria ve como atividade (cat. A/B/C) mas SEM modo confiavel. Nao inventar modo pra esse pedaco.
- (so CONSTATAR — sem julgar. % e aproximacao: `Y ≈ max(0,(wall_telemetria − min_trilho)/wall_telemetria)`, e wall-clock infla com janela paralela. Se o log esta vazio mas houve trabalho: "dia rodou sem /iniciar→/encerrar — log nao capturou".)

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
2. Os itens que ficaram — voltam pro radar (continuam no SEMANA / vao pro RESTO) ou ficam no HOJE pra amanha? _(se ficam pra amanha, o boa-noite NAO limpa esses; ver 5.2b)_
3. Alguma nota ou contexto importante pra amanha? _(prep pra reuniao de amanha entra como "Notas pra amanha" no diario — o bom-dia oferece como candidato do HOJE)_

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

**ClickUp — Atualizacoes (minimo):**
- Task X (concluida) → mover pra "Finalizado"
- (incompletas NAO mudam status aqui — o trilho/HOJE cuida disso na 5.2b)

**Trilho (TAREFAS.md) — consolidacao:**
- [resumo do que vai pro log + o que volta pro radar — preview da 5.2b]

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
```

### 5.2b Consolidar trilho → log (camada Log do feito)

Fecha o ciclo do dia no `TAREFAS.md` + `log-do-feito.md`. **Re-Read o `## HOJE` AGORA** (pode ter mudado durante o review — outra janela).

**Guarda de re-execucao (N6):** se a 1a linha do HOJE ja e `<!-- hoje: consolidado AAAA-MM-DD -->` com data = hoje, o boa-noite ja fechou hoje. Perguntar: *"ja fechei hoje — quer so revisar, ou re-consolidar?"* Nao re-tocar log/trilho sem confirmar.

1. **Backfill do log (idempotente):** pra cada `[x]` do `## HOJE`, antes de anexar **grep no `log-do-feito.md` de hoje por (DD/MM + titulo)** — se ja existe, pular (nao duplicar). Senao anexar (tempos best-effort da 1.4/1.5 + modo + **P**, formato do `/encerrar` 3.4b).
2. **Reconciliar `[~]` orfaos (iniciados sem /encerrar) — B1:** pra cada `[~]` com `(iniciada: HH:MM)` que NAO virou `[x]`:
   - **(a) Logar parcial:** `| DD/MM | titulo (parcial) | HH:MM–HH:MM | Nmin | Modo | P |` — inicio = o `(iniciada:)`; fim = ultimo rastro real (commit/edit da 1.5 ou last_ts de chat da 1.4); sem rastro → `Nmin = ?` + `(parcial — fim incerto)`.
   - **(b) Devolver:** `[~]`→`[ ]` **removendo o sufixo `(iniciada:)`** (o tempo ja foi pro log; manter calcularia duracao errada amanha). Esta no SEMANA → sobrevive la; ad-hoc → `## RESTO` como `[ ]`.
   - **(c) Sinalizar** no review: "N itens ficaram pela metade — devolvidos pro radar, tempo parcial logado."
3. **Outros `[ ]` (nunca comecaram):** do SEMANA → sobrevivem la (so saem do HOJE); ad-hoc fora do SEMANA → `## RESTO`. Seguir a Fase 2.2 (se "fica pra amanha", manter no HOJE).
4. **Limpar e carimbar o HOJE:** resetar pro placeholder COM o carimbo de estado:
   ```
   ## HOJE
   <!-- hoje: consolidado AAAA-MM-DD -->
   _(vazio — rodar /bom-dia)_
   ```
   (`consolidado` distingue "boa-noite fechou" de "nunca montado" — o gate do bom-dia Fase 0.2 le isso.) **Excecao:** se ficou item "pra amanha" no HOJE, ele NAO esta limpo → **nao** carimbar `consolidado`.
5. **Regra de mes do log (N5):** a secao e `## YYYY-MM` da **data de inicio** do item (coluna Data), nao do relogio do ritual. Usar o **dia BRT sendo fechado** (janela `T03:00Z`, igual telemetria) — apos meia-noite fecha o dia anterior, nao o civil. **Grep se `## YYYY-MM` ja existe** antes de criar (idempotente) e dar append.
6. **Commit do cerebro:** diario + TAREFAS.md + log-do-feito.md em 1 commit `cerebro: boa-noite YYYY-MM-DD` (submodule `pique/` separado se tocado). Sem push.

### 5.2c Zerar o TRANSCRIB (marcar processado) — [STUB, futuro]

**HOJE: no-op** (TRANSCRIB nao conectado — ver 1.7).

**FUTURO:** depois que a timeline (1.7) virou os 3 outputs E o cerebro/Calendar foram escritos, marcar processado pra "zerar a fila" (espelha "inbox sempre termina vazio"):
- **Dois-passos, nunca invertido** (risco alto de nota orfa): (1) confirmar que o conteudo foi pro destino; (2) so entao `marcar_consolidadas(ids)` + `marcar_exportadas(ids)` (metodos ja existem em `storage.py`).
- **Sempre** `marcar_exportadas` no fim — audio nao-exportado e apagado pela limpeza automatica do app.
- Audit-trail: registrar 1 evento `origem="boa-noite"` no historico do TRANSCRIB.

### 5.3 Mensagem WhatsApp — JA FOI GERADA na Fase 2.1

A mensagem WhatsApp ja saiu imediatamente apos o review (Fase 2.1) — usuario ja copiou e mandou. NAO regerar aqui. Se por algum motivo nao foi gerada antes (skip incorreto), gerar agora seguindo o formato da Fase 2.1.

### 5.4 Bloco telemetria do dia

Gere 4-6 linhas factuais sobre o uso de Claude Code hoje. **Regra critica:** zero interpretacao, zero sugestao de corte, zero "voce passou muito tempo em X". SO numeros.

Leia `~/.claude/telemetria/chats.jsonl`, filtre eventos `start`/`end` cujo `ts` caia em "hoje" BRT (UTC-03, hoje BRT comeca 03:00Z do dia civil). Pareie por `session_id`. Para cada sessao com `start` mas sem `end`, use `Date.now()` como fim (sessao ativa).

Para enriquecer cada sessao, use `Grep` pontual (NUNCA `Read` integral — estoura contexto em dias pesados) em `~/.claude/projects/<slug-cwd>/<sessionId>.jsonl`:
- `grep -m1 '"message":{"model"'` — captura modelo usado
- `grep -m1 '"type":"user"'` — captura primeiro prompt

Regras completas de parsing (slug cwd, wall time, primeiro prompt, modelos) em `/pique:tempo` secao "Como ler". Siga elas.

Formato do bloco — **3 lentes** que medem coisas diferentes e **NAO somam entre si** (adicionar apos a mensagem WhatsApp, antes do Encerrar):

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
