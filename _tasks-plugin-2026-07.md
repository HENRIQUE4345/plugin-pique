# _tasks — Plugin Pique da equipe

**Outcome:** o plugin-pique instalável pela equipe, com os rituais amarrados às ferramentas por contrato explícito (fonte → ritual → artefato) e o ClickUp acessado por 6 tools em vez de 17.
**Iniciado:** 2026-07-28
**Status:** em-execucao
**Proximo passo:** C.0 — os 3 consertos mecanicos (ANTES da migracao de qui 30/07); depois B.0 enxugada
**Tags:** plugin-pique, rituais, clickup, mcp, equipe, afiar

---

## Contexto

Três documentos já decidiram o que fazer; este ledger só põe em sequência executável e guarda o
estado entre chats.

- **`_auditoria-skills.md`** (27/07) — triagem dos 125 itens com uso medido. Fechou o escopo em
  **11 comandos + 4 MCPs + telemetria**, deixou **4 furos** abertos e cravou o próximo passo:
  o grafo de contratos.
- **`_arquitetura-plugin.md`** (27/07) — o MCP como API da metodologia: 6 tools, 11 decisões,
  fases 0-5, 11 spikes de API.
- **`MEU-CEREBRO/conhecimento/produtividade/_tasks-afiar-sistema-trabalho.md`** — **Bloco 3**
  (consolidação do plugin) e **Bloco 6** (veículo de acesso da equipe). O roteiro canônico diz
  que os dois mexem nos mesmos arquivos e podem virar um bloco só — aqui são as fases C e E.

**Ordem cravada no trilho da semana (27/07–02/08), que este ledger respeita:** *migra o trilho
primeiro, empacota o plugin depois* — empacotar antes ensinaria a equipe a manter um `TAREFAS.md`
local, justo o que está sendo morto. Por isso `iniciar` e `inbox` só entram depois da migração
de quinta (`86ajqemrm`).

**Por que o grafo vem antes dos spikes:** ele é leitura pura dos 11 comandos e pode mudar o que
a Fase 1 do MCP precisa entregar. Fazer os spikes antes é arriscar desenhar tool pra contrato
que vai mudar.

---

## Como usar este arquivo

> **Para o agente:** este é o único doc que precisa ser lido pra retomar em chat novo. Ao
> terminar qualquer task: marcar o checkbox, atualizar o **Proximo passo** no cabeçalho e
> escrever 1 linha no **Historico de chats**. Se descobrir algo que contradiz este ledger,
> corrigir aqui na hora — **este arquivo vence os docs antigos.**
>
> **Regra dura:** nunca marcar `[x]` sem ter conferido na fonte. Doc não é prova.

**Estado:** `[ ]` pendente · `[~]` em andamento · `[x]` concluída · `[-]` bloqueada · `[!]` descartada
**Quem faz:** 🤖 o agente executa · 👤 só o Henrique (decisão, UI, conversa com pessoa) · ⏳ depende de terceiro

---

## Fase A — Grafo de contratos dos rituais

> O próximo passo acordado na auditoria. Não é fluxograma de passos internos (~90 nós ilegíveis),
> é fluxo de dados: **FONTE** (ClickUp, Calendar, TAREFAS.md, DIARIO, cérebro, Slack) → **RITUAL**
> → **ARTEFATO** (HOJE, SEMANA, diário, task, sessão, pauta) → vira fonte do próximo ritual.
> Revela artefato órfão (escrito e não lido), fonte fantasma (lida e não produzida), loop aberto
> e fonte divergente.

#### `[x]` A.1 🤖 — Tabela factual dos 11 comandos — **fechada em 28/07**
- Virou o **mapa de contratos**: `MEU-CEREBRO/conhecimento/produtividade/mapa-contratos-sistema-trabalho.md`
  (Tabela A com ~22 peças — escopo ampliado pra tudo que produz/consome contexto, incluindo as
  7 reuniões e a captura)

#### `[x]` A.2 🤖 — Grafo mermaid em cima da tabela — **fechada em 28/07**
- Vista 1 do mapa de contratos (+ Vista 2 schema de entidades + Vista 3 por executor)

#### `[x]` A.3 🤖 — Lista de furos — **fechada em 28/07**
- **15 furos** catalogados e tipados no mapa (órfão · fantasma · loop aberto · divergente), cada
  um com prova na fonte. O padrão: o ciclo do dia fecha; o que atravessa pessoas não

#### `[x]` A.4 👤 — Conferir os furos e decidir o que conserta — **fechada em 28/07 (noite)**
- Brainstorm de arquitetura (chat da noite) decidiu o alvo: **§Alvo do mapa de contratos** —
  4 martelos (barramento card-canônico · contrato do Slack · `pre-reuniao` único com presets,
  roteador ancorado no Calendar · vigias em 2 fases) + lei "nenhum artefato sem leitor
  declarado" + 4 famílias de peças + coluna alvo das 7 reuniões
- Consertos imediatos viraram **C.0**; células 1–4 do mapa decididas, célula 5 (granularidade
  do marco) segue aberta

---

## Fase B — Decisões que destravam (👤)

> Nenhuma dá pra decidir por código. Cada uma trava pelo menos uma task da fase C ou D.

#### `[ ]` B.0 👤 — Rodar a sessão de rumo — **ENXUGADA em 28/07 (noite)**
> O brainstorm de arquitetura já decidiu: barramento (card = cópia canônica), consolidador
> (`pre-reuniao` único com presets, roteador Calendar), famílias de peças e vigias em 2 fases —
> ver §Alvo do mapa de contratos. **Sobra pra B.0 (nenhum destes foi tocado pelo brainstorm):**
> a fronteira entre ledgers · **B.1** (4 comandos em limbo) · **B.2** (segue ⏳ bloqueada pela
> migração de qui — não cai da lista, só não decide antes dela) · **B.3** (cada membro precisa
> de cérebro?) · **B.4** (medição por pessoa/cliente) · **B.5** (telemetria local/agregada).
> **B.6** segue à parte, com o card `86ajp5064`.

Prompt pronto em `_prompt-sessao-rumo.md` — cola no chat novo. Cobre B.1–B.6 de uma vez, mais
duas coisas que não são só decisão B: **a fronteira entre este ledger e o
`_tasks-afiar-sistema-trabalho.md`** do cérebro (proposta: o que a equipe instala vive aqui, como
o Henrique trabalha vive lá — Blocos 3 e 6 viram stub apontando pra cá, Bloco 4 racha em dois) e
**duas discordâncias entre docs que só se resolvem decidindo**: Bloco 2 (28/06, funde
review-semanal+planejamento-semanal e preserva o `fechamento-semana`) contradiz a auditoria
(27/07, mantém os dois separados e exclui o `fechamento-semana`, 0 usos em 8 semanas); e o Bloco 4
pede "dashboard honesto" pro comando `dashboard`, que a auditoria marcou excluir.
- Depende de: nada — é a porta de entrada
- Trava: B.1–B.6 (abaixo), e por tabela C.2 e E.4

#### `[ ]` B.1 👤 — Os 4 comandos em limbo
`continuar` · `modelo` · `news` · `aprender` estão marcados `[x] manter` na triagem item a item
do Grupo 1, mas **não aparecem na lista dos 11**. Entram (viram 15) ou saem?
- Trava: C.1 (não dá pra excluir sem saber quem fica)

#### `[ ]` B.2 👤 — De onde `iniciar` e `inbox` leem depois da migração
Furo 1 da auditoria. Os dois dependem do `TAREFAS.md` e do `inbox/DIARIO.md` locais. Se o trilho
migra pro ClickUp na quinta (`86ajqemrm`), eles precisam ler do ClickUp.
- Trava: C.2 e C.3 · ⏳ depende da migração de quinta

#### `[ ]` B.3 👤 — Cada membro precisa de um cérebro?
Furo 2. `iniciar` e `inbox` pressupõem a estrutura (TAREFAS.md, inbox/DIARIO.md, 5 pastas). Marco
tem (`marco-brain`); Carol, Arthur e Gabriel — **não verificado**. Se sim, falta um 12º comando de
setup — e ele já existe: `metodo-pique:setup` (83l). É porta pra dentro, não código novo.

#### `[ ]` B.4 👤 — Medir por pessoa ou por cliente?
Bloco 6.1 do roteiro canônico — a que ainda pode mudar o desenho todo do acesso da equipe.
Junto: (b) como a equipe usa as APIs hoje (se é tudo n8n no VPS, o problema encolhe) e (c) quanto
custa/mês somado (se ~R$150, gateway é over-engineering).
- Trava: E.2 em diante

#### `[ ]` B.5 👤 — Telemetria: local ou agregada?
Os logs ficam locais (privado) ou agregam pro Henrique ver o time? Se agregam, **vira medição de
pessoa — precisa ser combinado com eles, não descoberto depois.**
- Trava: C.7

#### `[ ]` B.6 👤 — Formato da reunião de segunda
A Fase 5 do MCP (placar da semana) só começa depois desse martelo.
- Trava: D.6

---

## Fase C — Consolidação do plugin (Bloco 3 + auditoria)

#### `[ ]` C.0 🤖 — Os 3 consertos mecânicos — **cravado 28/07: fazer ANTES da migração de qui**
- Space IDs mortos + status "Essa semana"/"Hoje" inexistentes nos 2 rituais semanais (furo 5)
- Matar a mensagem de WhatsApp do `planejamento-semanal` (furo 6 — canal morto desde 16/07)
- Matar a "Fase 4 PAUSA — Reunião" do `planejamento-semanal` (furo 7 — é o que travou a Carol;
  a v2 cravou solo)
- ~1-2h, zero decisão, 3 skills voltam a funcionar. A migração de qui muda o **trilho**
  (`TAREFAS.md`), não os Spaces que esses comandos leem — não é retrabalho

#### `[ ]` C.1 🤖 — Criar `pre-reuniao` **antes** de excluir o que ele herda
⚠️ Ordem importa: `extensao-estrategica` e `painel-review` (ambos marcados excluir) **já têm a
mecânica de coleta multi-fonte → pauta**. Extrair antes de apagar (furo 3 da auditoria). O item
está planejado desde abril (ROADMAP 2.2) e aparece na tabela Plugin↔Yabadoo como *"Prep de
reunião → Feature do Yabadoo Business"*.
- Regra da casa que ele tem que cumprir: pauta escrita com blocos + tempo, teto de 45min,
  termina com "quais foram as decisões" e "quem faz o que até quando"
- **Desenho cravado 28/07 (noite), §Alvo do mapa de contratos:** UMA peça com **preset por
  rito** (gatilho de separação: passo novo racha, fonte nova não), **roteador ancorado no
  Calendar** — evento = chave primária (série recorrente → preset · avulsa → prep genérico com
  contexto das pessoas · sem evento → cria). Puxa atas passadas + ficha DISC (gente de dentro)
  + arquivo de cliente (gente de fora); contexto de pessoa vai pro condutor, não pra pauta
  circulante. Ordem dos presets: "segunda" (Carol, furo 11) → "1:1" (Marco, furo 2/DISC) →
  "fechamento"
- **Par casado:** no mesmo movimento o `pos-reuniao` ganha contrato novo — backlink evento↔ata
  no Calendar + cabeçalho estruturado na ata (`evento_id` · participantes · decisões · ações
  com `card_id`). Detalhe no §Alvo

#### `[ ]` C.2 🤖 — Excluir os comandos triados como fora
`fechamento-semana` · `painel-review` · `extensao-estrategica` · `executar` · `tempo` ·
`dashboard` · `planejar-tasks` · `checkup` · `arrumar-folder` · `desenhar-area` · `revisar-area` ·
`desenhar-individual` · `precificar-plugin` · `auditoria-cerebro`
- Depende de B.1 (os 4 em limbo) e de C.1 (extrair antes)
- `executar` sai porque perdeu pro `/inc` (0 usos contra 49) — o `/inc` fica onde está, global
- Excluir do plugin ≠ apagar do mundo: o que for consultoria (`desenhar-*`, `revisar-area`,
  `precificar-plugin`) tem destino no `pique-consultoria-hub`, decidir no momento

#### `[ ]` C.3 🤖 — Portar `iniciar` pro plugin
Hoje é comando global (`~/.claude/commands`), 27 usos. Ninguém da equipe tem acesso.
- Depende de B.2

#### `[ ]` C.4 🤖 — Portar `inbox` pro plugin
Hoje vive no `plugin-whatsapp`.
- Depende de B.2

#### `[ ]` C.5 🤖 — Reescrever as 3 skills
- `rituais-pique` — **feito em 28/07** (commit `b975954`): a v1 anunciava stand-up por áudio no
  WhatsApp e a extensão estratégica quinzenal, ambos mortos
- `gestao-pique` — ajustar pra estrutura nova do ClickUp (5 Spaces, escada de status morta)
- `fontes-noticias` — canal ClickUp → Slack **feito em 28/07** (commit `726f8a5`); resta conferir
  o resto do conteúdo

#### `[ ]` C.6 🤖 — Consertar `config/user-config.example.md`
Lista só Henrique e Marco (faltam Carol, Arthur, Gabriel) e os calendar IDs de exemplo
(`409d950b`, `88b6ab1c`) estão **mortos (404)** — o próprio CLAUDE.md já os marca.

#### `[ ]` C.7 🤖 — Portar a telemetria pro plugin
Hoje está 100% fora: 3 hooks (`SessionStart`/`SessionEnd`/`PostToolUse`) no `settings.json`
**global** do Henrique, chamando `~/.claude/hooks/*.sh`. O `hooks/hooks.json` do plugin só tem o
hook do gestor-clickup. Portar é mecânico.
- Depende de B.5

#### `[ ]` C.8 🤖 — Consertar o agent `gestor-clickup` pra estrutura nova
Marcado "mesclar → ajustar a nova versão do clickup" na triagem. Parte já foi em 28/07 (tools
mortas, escada de status, `add_tag`/`remove_tag`) — resta a varredura completa.

---

## Fase D — MCP: da API do ClickUp pra API da metodologia

> Detalhe de cada tool e as 11 decisões estão em `_arquitetura-plugin.md`. Aqui só a sequência.

#### `[x]` D.0 🤖 — Fase 0: consertos sem decisão — **fechada em 28/07**
- `[x]` CLAUDE.md e skill `rituais-pique` desenvenenados (`b975954`)
- `[x]` vocabulário do log → `config/vocabulario.json`; `Dirigir` era rejeitado (`b20a194`)
- `[x]` 6 tools mortas + `SPACES`/`FOLDERS`/`POLICIES`/fantasma Daniel (`726f8a5`)
- `[x]` `.mcp.json` com `${CLAUDE_PLUGIN_ROOT}` + `userConfig` sensitive, `dist/` commitado,
  matcher do hook por verbo de escrita (`592b24b`)
- `[x]` helpers v3 órfãos do client (`3fd5bec`)

#### `[ ]` D.1 👤 — Fechar o loop do empacotamento
O que a Fase 0 não pôde fazer sozinha, porque mexe na config pessoal:
- bump de versão no `.claude-plugin/plugin.json` (está em 2.3.0)
- `/plugin marketplace update` + re-enable — **o `userConfig` só é perguntado no enable**, é aí
  que o token vai pro keychain
- confirmar no `claude mcp list`: `plugin:plugin-pique:pique-clickup ✓ Connected`, 11 tools
- só então remover a entrada `pique-clickup` do `~/.claude.json` (hoje tem o token `pk_` em texto
  puro, path absoluto da máquina do Henrique e `role: owner`)
- conferir de passagem: o `installed_plugins.json` registra o plugin como **1.31.0** apontando pra
  um diretório de cache que não existe

#### `[ ]` D.2 🤖 — Os 5 spikes que bloqueiam a Fase 1
1. filtro de dropdown em `GET /team/{id}/task` aceita UUID da opção ou orderindex? (testar as duas
   formas pra `Camada=Tarefa`)
2. `IS NOT NULL` funciona em campo tipo `users`? — esperado: 7 cards em `Espera decisão de`
3. os valores distintos de `status.type` nas listas são exatamente `{open, custom, done, closed}`?
   um 5º valor quebra os aliases
4. `/team/{id}/task` tem mesmo zero `last_page`? errar aqui é perder card em silêncio
5. `X-RateLimit-Limit`: 100 ou 1000/min?
- Critério de pronto: cada resposta anotada com o payload real que provou

#### `[ ]` D.3 🤖 — `estrutura` + `consultar_cards` sem preset
Pronto quando: o bom-dia roda ponta a ponta sem `gestor-clickup` e sem nenhum Space ID em markdown
(hoje são 60–90 chamadas; passa a 2 / ~1,2s).

#### `[ ]` D.4 🤖 — `metodologia.json` + presets + posse + `escrever_cards`
Pronto quando: dá pra mudar a definição de "travada em mim" editando JSON, sem `npm run build`.
- Spikes 6-8 da arquitetura bloqueiam esta fase

#### `[ ]` D.5 🤖 — `garantir_tag` + presets da semana + `subtask_ritual`
- Spikes 9-11 bloqueiam

#### `[ ]` D.6 🤖 — `criar_cards`
Destrava o `/encerrar`, que hoje detecta ação em 111 sessões e joga fora.
- Confirmado 28/07 (noite) como a materialização do martelo 1 do §Alvo (card = cópia canônica
  de ação/estado): peça que detecta ação e não cria card é furo por definição.

#### `[-]` D.7 — Placar da semana
Bloqueada por B.6 (formato da reunião de segunda).

---

## Fase E — Acesso da equipe (Bloco 6)

> Tese: o plugin distribui a ferramenta · o gateway guarda a chave e mede o gasto · o `userConfig`
> (`sensitive: true` → keychain) é o parafuso entre os dois. **Armadilha:** chave real dentro do
> plugin = distribuir a credencial da Pique pra 6 laptops (rotação não propaga, métrica zero,
> offboarding impossível).
> Doc completo: `pique/infra/2026-07-14-acesso-apis-equipe-plugin-pique.md`.

#### `[ ]` E.1 🤖 — Google Workspace: tirar o e-mail fixo
`USER_GOOGLE_EMAIL: contato@pique.digital` está fixo no config, e o credentials dir é path do
Henrique.

#### `[ ]` E.2 🤖 — docs-pique: path absoluto + token compartilhado
O único dos 4 MCPs onde **não importa quem fez** (HTML publicado é da empresa) — pode ficar com
conta de serviço. O truque do path já está resolvido no `plugin-whatsapp`: `PYTHONPATH:
${CLAUDE_PLUGIN_ROOT}` no `env` do `.mcp.json` (o campo `cwd` é ignorado pelo runtime).

#### `[ ]` E.3 ⏳ — Slack: cada um faz o próprio login
HTTP puro, o mais fácil dos 4. Hoje o MCP age como Henrique.

#### `[ ]` E.4 🤖 — Empacotar o Grupo 1 de MCPs públicos
Perplexity, Supabase, Stripe, Hostinger: pacotes npm públicos, só declarar no `.mcp.json` com a
chave vindo de `${user_config.*}`. O `apify` já está lá e funciona — serve de gabarito.
- Depende de B.4

---

## Backlog (fora da sequência)

Sobreviveu à triagem do `ROADMAP.md` (registro completo em `ROADMAP-ARCHIVE.md`):

- **Detalhamento como oferta** — a Fase 4 do `bom-dia` ainda é bloco separado (`bom-dia.md:313`)
  e o próprio roadmap admitia que nunca é executada
- **Pílula de conhecimento no `/encerrar`** — 1 insight cruzado (roadmap + tasks paradas + alertas
  de ritual) no fim do ritual mais usado do plugin
- **Self-edit de verdade** — hoje só existe o `melhorias-plugin.md`, que é literalmente o
  *"appendar num log que ninguém lê"* que o item criticava. Virar diff proposto no `.md` do
  comando, com aprovação
- **Sync do plugin entre máquinas** — o `/sincronizar` cobre `pique` + `MEU-CEREBRO`, **não** o
  repo do plugin. Sem isso, melhoria de um não propaga pros outros
- **`/pique:delegar`** — se voltar, nasce de novo: os perfis eram "Marco / Daniel / Gabriel" e o
  Daniel foi removido em 28/07. Puxaria as fichas DISC/Gallup de `areas/equipe/`
- **`/pique:onboarding`** — Carol e Camila entraram sem isso

---

## Aprendizados

- **28/07** — a lista dos 11 comandos e as marcações `[x] manter` item a item da auditoria
  divergem em 4 (`continuar`, `modelo`, `news`, `aprender`). Triagem por lista e triagem por item
  precisam ser conferidas uma contra a outra, senão o escopo tem dois donos.
- **28/07** — o `dist/` gitignorado e o path absoluto no `.mcp.json` já estavam escritos como
  bloqueio no Bloco 6 desde 14/07. Ler o roteiro canônico antes de auditar economiza a auditoria.
- **28/07** — os campos que o `/inc` e o `/pique:executar` parseiam (`Outcome`, `Status`,
  `Proximo passo`, `Historico de chats`) são match **literal sem acento**. Escrever "Próximo
  passo" faz o comando cair no fallback e adivinhar a próxima task pelo primeiro `[ ]` do corpo —
  mesma classe de silêncio do status com cedilha no ClickUp. Cabeçalho sem acento, corpo normal.

---

## Historico de chats

- **2026-07-28** — Fase 0 do MCP fechada (6 itens, 4 commits). Auditoria do `ROADMAP.md` e criação
  deste ledger. Decidido: grafo de contratos antes dos spikes.
- **2026-07-28 (tarde)** — Cruzei este ledger com `_auditoria-skills.md` e `_tasks-afiar-sistema-trabalho.md`
  (cérebro) e achei sobreposição real: dois ledgers descrevendo o mesmo trabalho, e dois pontos
  onde os docs se contradizem (Bloco 2 vs auditoria; Bloco 4 vs exclusão do `dashboard`). Em vez
  de decidir sozinho, virou prompt de sessão dedicada — `_prompt-sessao-rumo.md` — e task **B.0**.
  Proximo passo do cabeçalho movido de A.1 pra B.0: a fronteira entre os ledgers muda o que a
  fase C executa, não faz sentido gastar o grafo de contratos antes disso.
- **2026-07-28 (noite)** — Brainstorm de arquitetura dos rituais (chat): 4 martelos (card =
  cópia canônica · Slack só sinal · `pre-reuniao` único com presets/roteador Calendar · vigias
  em 2 fases) + lei "sem leitor declarado" + 4 famílias (planejadores/consolidadores/
  processadores/vigias) → tudo no **§Alvo do mapa de contratos**. Fase A fechada (A.1–A.4).
  Células 1–4 do mapa decididas; célula 5 aberta. Criada **C.0** (3 consertos antes de qui).
  B.0 enxugada (sobra fronteira + B.1 + B.4 + B.5). Futuro registrado: `planejamento-mensal`
  (spec sai do fechamento de sex 31/07 na mão) e `planejamento-trimestral` (set/2026). Nota de
  rumo: reunião = fatia vertical nº1 do YabaBuss; promover a 2º tenant quando a versão-skill
  provar.
