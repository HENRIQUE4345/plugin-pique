# Auditoria de Skills / Comandos / Agents — Triagem

**Criado:** 2026-07-27
**Atualizado:** 2026-07-27 17:31 — triagem do Henrique aplicada, escopo do plugin fechado
**Status:** ativo — triagem feita, execução não começou
**Objetivo:** decidir o que MANTER, EXCLUIR ou MESCLAR antes de formalizar o plugin-pique pra equipe usar.

---

# ✅ ESCOPO FECHADO — plugin-pique da equipe (27/07)

Decidido pelo Henrique ao final da sessão de auditoria. **É isto que o plugin vai ser.**

**11 comandos:**
`bom-dia` · `boa-noite` · `planejamento-semanal` · `review-semanal` · `iniciar` · `encerrar` · `sincronizar` · `pos-reuniao` · `inbox` · `apresentacao` · **`pre-reuniao`** (criar — gera a pauta)

**4 MCPs:** Google Workspace · ClickUp · docs-pique · Slack

**+ camada de telemetria/logs enriquecidos** — pra dar à equipe o trilho de rodar, responder e saber o que precisa ser feito.

## ⚠️ 4 furos neste escopo (achados na auditoria, não resolvidos)

**1. Conflito de ordem com o trilho da semana.** O `SEMANA (27/07–02/08)` crava:
> *"os 2 Afiar (nº5/nº6) são a mesma obra em série: **migra o trilho primeiro, empacota o plugin depois** — empacotar antes ensinaria a equipe a manter um `TAREFAS.md` local, justo o que está sendo morto."*

Mas `iniciar` e `inbox` — dois dos 11 escolhidos — **dependem justamente do `TAREFAS.md` e do `inbox/DIARIO.md` locais.** Se o trilho migra pro ClickUp na quinta (item nº5, tarefa `86ajqemrm`), o `iniciar` precisa ler do ClickUp, não do `.md`. **Decidir isso antes de codar o `iniciar`.**

**2. Cada membro precisa de um cérebro?** `iniciar` e `inbox` pressupõem que a pessoa tenha a estrutura (TAREFAS.md, inbox/DIARIO.md, 5 pastas). O Marco tem (`marco-brain`). Carol/Arthur/Gabriel — não verificado. Se a resposta for sim, falta um 12º comando de `setup` — **e ele já existe**: `metodo-pique:setup` (83l, instancia cérebro novo do molde). É porta pra dentro, não código novo.

**3. `pre-reuniao` já está planejado desde abril.** ROADMAP item **2.2 `/pique:prep-reuniao`**, e na tabela Plugin↔Yabadoo como *"Prep de reunião → Feature do Yabadoo Business"*. Além disso, `extensao-estrategica` e `painel-review` (ambos marcados pra excluir) **já tinham a mecânica de coleta multi-fonte → pauta**. Extrair deles antes de escrever do zero.

**4. A triagem por item quebrou elos.** O `review-semanal` (mantido) tem como output declarado *"Levar pro fechamento"* — ponte explícita pro `fechamento-semana`, que foi **excluído**. Ficou com saída apontando pro vazio. Mesmo padrão: a skill `rituais-pique` ainda anuncia a `extensao-estrategica` (excluída) como ritual quinzenal ativo.

## Estado real dos 4 MCPs escolhidos

| MCP | Identidade por pessoa | Instala noutra máquina? |
|---|---|---|
| **ClickUp** | ✅ **já resolvido** — `role.ts` com token + role (owner/editor/viewer) por usuário | ❌ `dist/` gitignorado + path absoluto |
| **Slack** | ⚠️ OAuth — hoje age como Henrique, mas **cada um faz o seu login** | ✅ HTTP puro. **O mais fácil dos 4** |
| **Google Workspace** | ⚠️ `USER_GOOGLE_EMAIL: contato@pique.digital` fixo no config | ⚠️ `uvx` ok, mas credentials dir é path do H |
| **docs-pique** | ❌ token único compartilhado, sem noção de usuário | ❌ path absoluto pro `docs-pique-hosting` |

**Critério que economiza trabalho — *"importa quem fez?"*:** ClickUp sim (assignee/comentário), Slack sim (autor), Calendar sim (dono do evento), **docs-pique não** (HTML publicado é da empresa). Esse último pode ficar com conta de serviço.

## Onde já estava escrito (ler ANTES de executar)

Boa parte disto já existia — a auditoria redescobriu:

- **`conhecimento/produtividade/_tasks-afiar-sistema-trabalho.md`** — **Bloco 3** (auditoria do plugin, de 28/06: fusões `/pique:clickup` e `/pique:mapear`, e a ideia de "plugin-dev separado: org, matar, iniciar, padronizar, sync-tasks, auditoria-talk, review-headless, inc") e **Bloco 6** (veículo de acesso da equipe: `dist/` gitignorado → "parar de ignorar o build", os 3 órfãos de path absoluto, `userConfig sensitive → keychain`, gateway LiteLLM vs Cloudflare). **É o roteiro canônico.**
- **`pique/infra/2026-07-14-acesso-apis-equipe-plugin-pique.md`** — doc completo do acesso da equipe.
- **Desbloqueio já registrado:** o `plugin-whatsapp` **já distribui um MCP Python custom via plugin, funcionando**. Truque = `PYTHONPATH: ${CLAUDE_PLUGIN_ROOT}` no `env` do `.mcp.json` (o campo `cwd` é ignorado). Serve pro `docs-pique`.
- **Fix pendente já anotado:** `resolve_member` do MCP ClickUp não conhece Carol/Camila.

## O que esta auditoria trouxe de novo

- **Uso real medido** (transcripts jun–jul): `encerrar` 111 · `metodo-pique:encerrar` 62 · `inc` 49 · `iniciar` 27 · `boa-noite` 22 · `bom-dia` 19
- **18 dos 26 comandos do plugin têm hardcode do cérebro pessoal** (marcados ACOPLADO abaixo)
- **`config/user-config.example.md` está quebrado** — lista só Henrique e Marco (faltam Carol, Arthur, Gabriel) e os calendar IDs de exemplo (`409d950b`, `88b6ab1c`) **estão mortos** (404, o próprio CLAUDE.md os marca)
- **Telemetria está 100% fora do plugin** — 3 hooks (`SessionStart`/`SessionEnd`/`PostToolUse`) no `settings.json` **global** do Henrique, chamando `~/.claude/hooks/*.sh`. O `hooks/hooks.json` do plugin só tem o hook do gestor-clickup. Portar é mecânico. **Decisão embutida:** logs ficam locais (privado) ou agregam pro Henrique ver o time (vira medição de pessoa — precisa ser combinado com eles, não descoberto depois).
- **`rituais-pique` está desatualizada** — diz que o stand-up é "áudio no WhatsApp Pique — Daily" (hoje é Slack) e lista a extensão estratégica quinzenal (excluída). Não é excluir, é reescrever.

## Próximo passo acordado

Montar o **grafo de contratos dos rituais** — não fluxograma de passos internos (viraria ~90 nós ilegíveis), e sim fluxo de dados com 3 tipos de nó:

```
FONTE (ClickUp, Calendar, TAREFAS.md, DIARIO, cérebro, Slack)
   ↓ lê
RITUAL (bom-dia, iniciar, encerrar, boa-noite…)
   ↓ escreve
ARTEFATO (HOJE, SEMANA, diário, task, sessão, pauta)
   ↓ vira fonte do próximo ritual
```

Revela: artefato órfão (escrito e não lido) · fonte fantasma (lida e não produzida) · loop aberto · fonte divergente.

**Método em 3 passos:** (1) ler os 11 comandos (~3.100 linhas) e extrair de cada um o que lê / o que escreve / o que declara entregar pro próximo → tabela factual; (2) grafo mermaid em cima da tabela; (3) lista de furos.

*Ressalva: o grafo não pega divergência de conteúdo — se dois rituais leem o `TAREFAS.md` com regras diferentes, desenha duas setas iguais. Isso só sai lendo lado a lado, depois que o grafo mostrar onde olhar.*

---

## Como preencher

Marque **um** por item. Onde marcar `mesclar`, escreva com quem.

```
[x] manter   [ ] excluir   [ ] mesclar →________
```

Legenda dos sinais depois do travessão:
- **NNNl** — tamanho em linhas (proxy de manutenção)
- **N usos** — invocações reais nos transcripts de **jun–jul/2026 (~60 dias)**. Só mede a SUA máquina — comando rodado pelo Marco/Carol não aparece aqui. Ausência de número = 0 invocações no período (não significa "nunca usado").
- **ACOPLADO** — tem path/estrutura hardcoded do seu cérebro pessoal (`MEU-CEREBRO`, `TAREFAS.md`, `inbox/DIARIO`). **Não funciona na máquina de outra pessoa sem ajuste.**
- **cita-equipe** — menciona Marco/Carol/Arthur/Gabriel no corpo

**Total a triar: 125 itens** (98 comandos · 19 skills · 8 agents)

---

# GRUPO 1 — plugin-pique (o alvo da formalização)

26 comandos · 3 skills · 1 agent · 1 MCP próprio. Versão atual **2.3.0**.

## Rituais diários/semanais

- **bom-dia** — Stand-up matinal: cruza Calendar + ClickUp + diário e monta o HOJE. — 466l · 19 usos · ACOPLADO · cita-equipe
  `[x] manter  [ ] excluir  [ ] mesclar →________`

- **boa-noite** — Fechamento do dia: review do que saiu, atualiza diário e ClickUp. — 485l · 22 usos · ACOPLADO · cita-equipe
  `[x] manter  [ ] excluir  [ ] mesclar →________`

- **planejamento-semanal** — Ritual de segunda: gera o SEMANA do trilho a partir do RESTO + ClickUp. — 398l · 4 usos · ACOPLADO · cita-equipe
  `[x] manter  [ ] excluir  [ ] mesclar →________`

- **review-semanal** — Review pessoal de sexta. Output = "Levar pro fechamento". Cada sócio roda o seu. — 318l · 7 usos · ACOPLADO · cita-equipe
  `[x] manter  [ ] excluir  [ ] mesclar →________`

- **fechamento-semana** — Fechamento da empresa, reunião conjunta H+M, pauta + timer 45min. Consome os reviews pessoais. — 309l · **0 usos em 8 semanas** · cita-equipe
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **painel-review** — Painel de review do time (sexta 09:30, Marco conduz). Commitado-vs-entregue + ritmo de stand-up → HTML. — 254l · 1 uso · ACOPLADO · cita-equipe
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **extensao-estrategica** — Dashboard estratégico quinzenal. 7 fontes → perguntas cirúrgicas → HTML que vira pauta. — 412l · 0 usos · cita-equipe
  `[ ] manter  [x] excluir  [ ] mesclar →________`

## Sessão / contexto

- **encerrar** — Encerramento de conversa: distribui o que foi discutido pro cérebro e ferramentas. — 295l · **111 usos (o mais usado)** · ACOPLADO · cita-equipe
  `[x] manter  [ ] excluir  [ ] mesclar →________`

- **executar** — Puxa a próxima task de um `_tasks-*.md` do cérebro, carrega contexto, plan mode, atualiza ledger. — 430l · **0 usos** (perdeu pro `/inc`) · ACOPLADO
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **continuar** — Retoma contexto de sessão Claude Code anterior. Lista candidatos, carrega resumo + arquivos. Read-only. — 172l · 0 usos
  `[x] manter  [ ] excluir  [ ] mesclar →________`

- **modelo** — Recomenda modelo + effort pra uma tarefa. Opina em 3-5 linhas pra calibrar a sessão. — 103l · 3 usos
  `[x] manter  [ ] excluir  [ ] mesclar →________`

- **tempo** — Consulta sob demanda de tempo gasto no Claude Code. Lê telemetria nativa + enriquecida. — 181l · 0 usos · ACOPLADO
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **dashboard** — Dashboard de uso de IA (diagnóstico / padrões / bruto). Lê os jsonl de telemetria. — 168l · 0 usos · ACOPLADO
  `[ ] manter  [x] excluir  [ ] mesclar →________`

## ClickUp / gestão

- **planejar-tasks** — Criação iterativa de tasks no ClickUp seguindo o processo de gestor de projeto. — 236l · 0 usos · ACOPLADO · cita-equipe
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **checkup** — Check-up de gestão do ClickUp. Auditoria completa de um ou mais Spaces. — 175l · 0 usos · cita-equipe
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **arrumar-folder** — Reorganiza um Folder do ClickUp em 5 fases (audit → diagnose → plan → execute → validate). — 313l · 0 usos
  `[ ] manter  [x] excluir  [ ] mesclar →________`

## Cliente / consultoria

- **desenhar-area** — Analisa uma área de cliente, acha o problema raiz e empacota em plugin YabaBuss no Catálogo. — 524l · 0 usos (1 em abr) · ACOPLADO · cita-equipe
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **revisar-area** — Revisa/consolida tasks de área já desenhada. Gera dossiê consolidado interno. (O `desenhar` MONTA, este REVISA.) — 586l · 0 usos · ACOPLADO · cita-equipe
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **desenhar-individual** — Mapeia uma pessoa de cliente em 4 rodadas com proveniência rastreável. — 624l · 0 usos · ACOPLADO · **duplicado no `pique-consultoria-hub`**
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **precificar-plugin** — Precifica implementação de plugin por área. 3 lentes (custo Pique + valor cliente + payback). — 714l (o maior) · 0 usos · cita-equipe
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **pos-reuniao** — Recebe transcrição de reunião e extrai tudo que é acionável. — 479l · 7 usos · ACOPLADO · cita-equipe
  `[x] manter  [ ] excluir  [ ] mesclar →________`

## Produção / conteúdo

- **apresentacao** — Gera apresentação no padrão Pique (casca sidebar + capítulos HTML) no `pique-apresentacoes`. — 326l · 2 usos · ACOPLADO · **1 de 4 sistemas de apresentação**
  `[x] manter  [ ] excluir  [ ] mesclar →________`

- **news** — Briefing diário de notícias: scrapa portais, cruza com cérebro, gera HTML e posta no Slack. — 334l · 1 uso · ACOPLADO · cita-equipe
  `[x] manter  [ ] excluir  [ ] mesclar →________`

- **aprender** — Curador de vídeos YouTube PT-BR: busca, lê transcrição, cruza com suas lacunas, entrega 1 vídeo. — 418l · 0 usos · cita-equipe
  `[x] manter  [ ] excluir  [ ] mesclar →________`

## Infra do cérebro

- **auditoria-cerebro** — Auditoria estrutural do MEU-CEREBRO em 8 eixos. Relatório → lotes atômicos → execução aprovada. — 436l · 0 usos · ACOPLADO
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **sincronizar** — Sync Git do cérebro: submodule `pique` + super-repo `MEU-CEREBRO`, na ordem certa. — 53l · 7 usos · ACOPLADO · cita-equipe
  `[x] manter  [ ] excluir  [ ] mesclar →________`

## Skills do plugin-pique (conhecimento auto-invocado, não comandos)

- **gestao-pique** — Regras de task no ClickUp, template de descrição, workflow de status, limites de capacidade. — 41l
  `[ ] manter  [ ] excluir  [x] mesclar →________ ajustar a nova versao do clickup`

- **rituais-pique** — Cadência diária/semanal/mensal, formato de stand-up, regras de reunião, indicadores de alerta. — 76l
  `[ ] manter  [ ] excluir  [x] mesclar →________ nao entendi o que faz`

- **fontes-noticias** — Fontes, categorias e critérios de relevância do briefing Pique News. — 111l
  `[ ] manter  [ ] excluir  [x] mesclar →________ nao entenbdi`

## Agent

- **gestor-clickup** — Executor isolado de CRUD no ClickUp com as regras embutidas. Um hook obriga a delegar pra ele. — 214l
  `[ ] manter  [ ] excluir  [x] mesclar →________ajustar a nova versao do clickup`

---

# GRUPO 2 — Comandos globais soltos (`~/.claude/commands`)

**14 comandos que não pertencem a nenhum plugin.** Ninguém da equipe tem acesso a eles — moram só na sua máquina. Aqui está o `/inc`, seu 3º comando mais usado.

- **inc** — Executa a próxima task pendente de `_tasks-*.md` / `TASKS.md` / `TODO.md` do projeto atual. Diz-se "versão genérica do `/pique:executar`". — 573l · **49 usos**
  `[x] manter  [ ] excluir  [ ] mesclar →________`

- **iniciar** — Ritual do dia: puxa o próximo item do HOJE, carimba início, carrega o modo (Pensar/Produzir/Afiar). Par do `/encerrar`. — 69l · **27 usos** · duplicado no metodo-pique
  `[ ] manter  [ ] excluir  [x] mesclar →________`

- **q** — Consulta rápida de dúvida operacional no meio do chat (já existe tarefa? devo encerrar? trocar modelo?). Resposta curta em formato fixo. — 118l · 3 usos
  `[ ] manter  [ ] excluir  [x] mesclar →________ aparentemente mesma coisa que modelo`

- **ctx** — Salvar contexto da conversa. — 148l · 1 uso
  `[x] manter  [ ] excluir  [ ] mesclar →________`

- **subir** — Sobe os servidores do projeto em janelas de terminal separadas. — 18l · 5 usos
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **matar** — Mata processos de backend (Python) e frontend (Node) rodando. — 8l · 0 usos
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **d** — Decide POR você e executa direto, sem pedir confirmação. Comunica em 2-3 linhas. — 64l · 0 usos
  `[x] manter  [ ] excluir  [ ] mesclar →________`

- **conselho** — Conselheiro sênior. — 62l · 0 usos
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **menu** — Lista suas skills disponíveis. — 47l · 0 usos
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **padronizar** — Padroniza um projeto pro template estruturado. — 398l · 0 usos
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **org** — Organiza a pasta raiz do projeto. — 34l · 0 usos
  `[x] manter  [ ] excluir  [ ] mesclar →________`

- **sync-tasks** — Sincroniza o TASKS.md com o trabalho realmente realizado. — 84l · 0 usos
  `[x] manter  [ ] excluir  [ ] mesclar →________`

- **auditoria-talk** — Auditoria de documentação. — 100l · 0 usos
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **review-headless** — Review do headless. — 80l · 0 usos
  `[ ] manter  [x] excluir  [ ] mesclar →________`

---

# GRUPO 3 — Comandos do MEU-CEREBRO (`.claude/commands`)

5 comandos presos no cérebro pessoal. Só rodam lá dentro.

- **inbox** — Processa o inbox completo, gera `PLANO.md` pra revisão, executa após confirmação, deixa o inbox vazio. — 229l · 4 usos · **existe em 4 cópias**
  `[ ] manter  [ ] excluir  [x] mesclar →________ dentro do plugin pique`

- **raiox** — Raio-X de Perfil (HTML 4 abas) a partir de transcrição de entrevista. — 313l · 3 usos · **duplicado no `plugin-raiox`**
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **analisar-ponto** — Análise visual de um ponto físico do mapeamento de loja Beco → inventário estruturado. — 642l · 0 usos
  `[ ] manter  [x] excluir  [ ] mesclar →________`

- **ficha-disc** — Gera ficha DISC de membro da equipe no padrão das fichas existentes. — 177l · 0 usos
  `[x] manter  [ ] excluir  [ ] mesclar →________`

- **livro** — Processamento de capítulo de livro: resumo + insights pessoais. — 54l · 0 usos
  `[x] manter  [ ] excluir  [ ] mesclar →________`

---

# GRUPO 4 — plugin-social-media

14 comandos · 1 skill · 4 agents. **Nenhum invocado em jun–jul** (2 em abril). O `pique-marketing` reimplementou parte disso.

- **setup** — Configura um perfil social pras skills `/social-*`. Roda 1× por perfil. — 232l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **descobrir** — Descobre perfis de referência no Instagram via curadoria web, iterativo. — 234l · **sobrepõe `pique-marketing:descobrir-referencia`**
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **analisar** — Analisa posts de referência (carrossel, Reels, estáticos). Vision + Gemini → relatório de padrões. — 334l · **sobrepõe `pique-marketing:analisar-referencia`**
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **estrategia** — Estratégia macro de um perfil: frequência, mix, temas, evolução, funil. Visão floresta. — 281l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **planejar** — Desenha a estratégia de conteúdo (ecossistema, pilares, flywheel, mix). V1 do zero, depois review mensal. — 474l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **pesquisar** — Pesquisa externa temática: coleta multiplataforma, padrões HIT/FLOP, ângulos virgens com lastro. — 348l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **radar** — Curadoria semanal de tendências (IG, Google Trends, TikTok, X, notícias IA) → relatório de pauta. — 259l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **sugerir** — Cardápio mensal de conteúdo: radar + cérebro + análises → ângulos criativos. — **1168l (o maior de todos)**
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **triagem** — Curadoria negativa de pepitas no ClickUp: descarta, mescla duplicatas, classifica pilar. — 230l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **maturar** — Curadoria positiva: cruza pepita com cérebro e promove pra `Visão`. Ponte triagem → sugerir. — 364l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **copy** — Headlines + legendas a partir de transcrição de vídeo, com justificativa técnica. — 308l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **carrossel** — Carrossel completo: conteúdo + HTML renderizável + caption, pronto pra postar. — 271l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **cortes** — Transcrição Whisper → melhores cortes com pilar/hook/nota + XML (XMEML) pro Premiere. Ponte pro Gabriel. — 877l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **revisar** — Review pré-publicação de vídeo e carrossel. Quality gate antes de postar. — 453l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- *(skill)* **analise-carrossel** — Conhecimento de análise de carrossel/conteúdo Instagram: parâmetros visuais, métricas, padrões. — 63l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- *(agent)* **coletor-instagram** — Scraping de perfis/posts/Reels via Apify. — 73l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- *(agent)* **analista-visual** — Análise de imagem via Claude Vision (design, layout, tipografia, cores). — 64l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- *(agent)* **analista-video** — Análise de vídeo via Gemini. — 72l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- *(agent)* **estrategista-conteudo** — Cruza dados de análise com o cérebro pra gerar sugestões de pauta. — 111l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`

---

# GRUPO 5 — plugin-metodo-pique

6 comandos · 2 skills. É a versão genérica (pro seu pai, Filipe, terceiros). **Você disse pra deixar de fora agora** — mas 2 itens aqui competem com o plugin-pique HOJE e precisam de decisão.

- **encerrar** — Encerramento de conversa, versão genérica (distribui pro "seu cérebro", sem Pique). — 153l · **62 usos** · ⚠️ **compete com `plugin-pique:encerrar` (111 usos)**
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **modelo** — Recomenda modelo + effort. — 90l · 1 uso · ⚠️ **cópia de `plugin-pique:modelo`**
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **iniciar** — Ritual do dia, versão genérica. — 73l · ⚠️ **cópia do `/iniciar` global**
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **inbox** — Processa inbox genérico (DIARIO + REVISAO + contextos) → PLANO.md → executa. — 78l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **cascata** — Constrói a cascata estratégica da empresa, do propósito ao objetivo de setor. Multi-sessão. — 128l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **setup** — Onboarding de cérebro novo: pergunta, instancia o molde, personaliza, não deixa lixo. — 83l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- *(skill)* **cascata** — As 8 camadas do propósito à tarefa, regra de ouro (número por último), 3 testes de indicador. — 133l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- *(skill)* **metodo** — Modos Pensar/Produzir/Afiar, trilho TAREFAS.md, ciclo do dia e da semana, cérebro em 5 pastas. — 83l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`

---

# GRUPO 6 — plugin-whatsapp

- **triage** — Triage diária (v1 read-only): lê não-lidas, resolve nomes, transcreve áudios, classifica, propõe respostas. — 162l · 1 uso
  `[ ] manter  [x] excluir  [ ] mesclar →________`
- **inbox** — Verifica mensagens não respondidas e apresenta resumo. — 58l · 0 usos
  `[ ] manter  [x] excluir  [ ] mesclar →________`
- *(skill)* **whatsapp-context** — Evolution API, formato de JID, formatação de mensagem, gotchas reais. — 57l
  `[ ] manter  [x] excluir  [ ] mesclar →________`

---

# GRUPO 7 — plugin-raiox

- **raiox** — Raio-X de Perfil (HTML 4 abas) com dado real scrapeado do Instagram via Apify. — 259l · **duplicado no MEU-CEREBRO**
  `[ ] manter  [x] excluir  [ ] mesclar →________`
- *(skill)* **raiox** — O que é a ferramenta, pré-requisitos, as 4 abas, travas anti-número-inventado. — 46l
  `[ ] manter  [x] excluir  [ ] mesclar →________`

---

# GRUPO 8 — plugin-beto

Sem comandos e sem skills — só `templates/` (design system, layouts) e `scripts/generate-pptx.js`. **É um 4º sistema de apresentação.**

- **plugin-beto (repo inteiro)** — Gerador de PPTX + design system do Beto.
  `[ ] manter  [x] excluir  [ ] mesclar →________`

---

# GRUPO 9 — Comandos presos em repos de projeto

**30 comandos** espalhados por 11 repos. Nenhum é instalável — só funcionam com o Claude Code aberto naquela pasta.

## pique-marketing (7) — sobrepõe o plugin-social-media

- **produzir** — Roteiro de Reel @iairique data-driven, 3 portas de entrada, fecha loop de teste. — 434l · **12 usos**
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **semana** — Ritual semanal do banco @iairique em 2 metades (manutenção + decisão). Enfileira peças. — 410l · 2 usos
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **analisar-referencia** — Posts de perfil de referência → Apify → Gemini → classifica → grava no Supabase. — 284l · 1 uso · sobrepõe `social:analisar`
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **analisar-carrossel** — Irmão do anterior, só carrosséis (type=Sidecar). — 272l · sobrepõe `social:analisar`
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **descobrir-referencia** — Descobre perfis novos via curadoria web, grava aprovados no Supabase. — 184l · sobrepõe `social:descobrir`
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **consolidar** — Destila vídeos de uma conta num consolidado auditável (insumo do `/produzir`). — 266l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **importar-news** — Importa briefing Pique News do docs-pique pro Supabase, destila ganchos @iairique. — 187l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`

## pique-decks-react (7) — 3º sistema de apresentação

- **novo-ato** — Scaffold de ato novo num cliente (cena + bolinhas + app.jsx + index.html + data.js). — 66l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **lapidar** — Ciclo curto de polimento visual, loop até `/validar-padroes` 100%. — 52l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **validar-padroes** — Checklist binário: 7 padrões globais + 5 operações canônicas + paleta + tipografia. — 55l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **gravar-e-analisar** — Grava run da apresentação (ffmpeg) e manda pro Gemini. Substitui o Win+G manual. — 157l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **analise-animacao** — Sobe vídeo pro Gemini com prompt de direção de arte → report por fase + top 5 ajustes. — 65l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **encerrar-sessao** — Fecha conversa Pique-style: TASKS.md, memory writes, melhorias-plugin.md, commit. — 91l · ⚠️ **3ª variante de "encerrar"**
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **import-bundle** — **JÁ MARCADO DEPRECATED em 2026-05-06** no próprio arquivo. Importava bundle do Claude Design. — 92l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`

## marco-brain (6) — cérebro do Marco, não seu

- **espelho-diagnostico** — Analisa reunião de diagnóstico do Marco: auto-avaliação primeiro, depois análise fria e pontos cegos. — 282l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **prospectar** — ICP e prospecção. — 228l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **cold-prospect** — Abordagem fria. — 138l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **maquiavel** — Modo de análise política/estratégica. — 250l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **standup** — Stand-up do Marco. — 88l · ⚠️ **concorre com `plugin-pique:bom-dia`**
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **inbox** — Processamento de inbox. — 71l · ⚠️ **3ª cópia do inbox**
  `[ ] manter  [ ] excluir  [ ] mesclar →________`

## pique-consultoria-hub (3)

- **desenhar-individual** — Gera JSON de indivíduo a partir de entrevista direta. Regra dura: só entrevista, sem análise externa. — 349l · ⚠️ **duplicado no plugin-pique (624l)**
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **revisar-individual** — Cruza validação do Marco com o JSON v1 existente. End-to-end sem gates. — 401l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **revisar-setor** — Cruza JSON de setor com os individuais validados. 4 buckets + gate humano antes de aplicar. — 540l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`

## Avulsos (7)

- **APRESENTAÇÕES PIQUE / apresentacao** — Gera apresentação a partir de contextos no `inbox/`. — 86l · ⚠️ **2º sistema de apresentação**
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **lar-lucrativo / financeiro** — Financeiro pessoal: processa fatura e classifica. — 594l · **5 usos**
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **yababuss / fechar** — Relatório de fechamento de task: danger-first, anti-teatro, evidência colada. — 87l · ⚠️ **4ª variante de "encerrar"**
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **beco-sortimento / reclassificar-foto** — Reclassifica brincos de uma foto no schema v2.1, grava e valida no app. — 111l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **CEREBRO-BETO / inbox** — Inbox do cérebro do Beto. — 71l · ⚠️ **4ª cópia do inbox**
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **ATENDEAI / test-bot** — Modo de teste e análise do bot. — 391l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **pizzas / arquiteto-habbo** — Arquiteto de quartos Habbo (Pique Hotel): topologia → planta → heightmap → wired → SQL. — 159l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`

---

# GRUPO 10 — Skills presas em repos

10 skills que só existem dentro de um projeto.

## pique-decks-react (3)

- **fluxo-apresentacao** — Roteiro mestre pra criar apresentação narrativa Pique do zero. — 137l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **narrativa-bolinhas** — Vocabulário visual Pique: esfera-âncora, 5 operações canônicas, 7 padrões de coreografia. — 59l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **workflow-decks** — O ciclo Code × Gemini do projeto (gravar, lapidar, regressão visual). — 43l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`

## yabadoo-brain (6)

- **check** — Gate pré-commit completo (lint + format + type-check + testes), detecta o que mudou. — 235l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **commit** — Agrupa changes em commits semânticos na convenção do projeto, roda lint/format. — 214l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **close** — Ritual FECHAR de task: marca, arquiva, roda `/check`, atualiza CLAUDE.md, invoca `/commit`. — 136l · ⚠️ **5ª variante de "encerrar"**
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **task** — Cria entrada bem-formada no TASKS.md depois de verificar o código real. — 110l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **revisao** — Revisão recorrente da base (semanal/mensal): CI, advisors, dívida, custo → abre tasks. — 110l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **reindex-cerebro** — Indexa o cérebro de um usuário Yabadoo no Knowledge + Grafo (dry-run → confirma → executa). — 197l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`

## Avulsas (2)

- **yababuss / grill-me** — Entrevista você sem dó sobre um plano até resolver cada ramo da árvore de decisão. — 10l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **~/.claude/skills / interpretar** — Transforma transcrição de áudio bruta em prompt técnico estruturado, sem executar. — global, sem plugin
  `[ ] manter  [ ] excluir  [ ] mesclar →________`

---

# GRUPO 11 — Agents fora dos plugins

- **yabadoo-brain / yabadoo-reviewer** — Review com a lente específica do Yabadoo (multi-tenant, Agno First, async, secrets). — 100l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **yababuss / revisor** — Revisor adversarial de diff contra as regras universais do YabaBuss. Recebe só o artefato. — 71l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`
- **yaba-device / yaba-svg-artist** — Reestrutura o SVG mestre do Yaba (polvo da marca) em partes animáveis. — 90l
  `[ ] manter  [ ] excluir  [ ] mesclar →________`

---

# GRUPO 12 — Terceiros (fora da triagem)

Não são seus, não precisam de decisão. Listados só pra fechar a conta:

**Plugins oficiais instalados (15):** frontend-design, superpowers, skill-creator, security-guidance, claude-code-setup, supabase, agent-sdk-dev, chrome-devtools-mcp, huggingface-skills, mcp-server-dev, playwright, claude-md-management, commit-commands, vercel, plugin-dev, context7, playground.

**Skills de terceiros linkadas em `~/.claude/skills` (18):** brandkit, copywriting, design-taste-frontend, find-skills, full-output-enforcement, gpt-taste, graphify, gsap-performance, high-end-visual-design, image-to-code, imagegen-frontend-mobile, imagegen-frontend-web, industrial-brutalist-ui, landing-page-copywriter, minimalist-ui, redesign-existing-projects, slidev, stitch-design-taste.

**Skills de repo clonado:** `twenty/.cursor/skills` (6), `yabadoo-brain/.agents` (shadcn, supabase-postgres), `yababuss/.agents` (supabase ×2), `remotion-iairique/.agents` (remotion-best-practices).

---

# Anexo — Conflitos que precisam de decisão explícita

Estes não se resolvem item a item, precisam de uma escolha sua:

| # | Conflito | Itens envolvidos | Dado |
|---|----------|------------------|------|
| 1 | **"Encerrar" existe 5×** | `plugin-pique:encerrar` · `metodo-pique:encerrar` · `decks:encerrar-sessao` · `yabadoo:close` · `yababuss:fechar` | 111 + 62 usos nos dois primeiros |
| 2 | **"Próxima task" existe 3×** | `/inc` · `/iniciar` · `plugin-pique:executar` | 49 + 27 + 0 |
| 3 | **Apresentação existe 4×** | `plugin-pique:apresentacao` · `APRESENTAÇÕES PIQUE` · `pique-decks-react` (7cmd+3skill) · `plugin-beto` | — |
| 4 | **Inbox existe 4×** | MEU-CEREBRO · CEREBRO-BETO · marco-brain · metodo-pique | — |
| 5 | **Social existe 2×** | `plugin-social-media` (14cmd) · `pique-marketing` (7cmd) | marketing tem uso, social não |
| 6 | **desenhar-individual existe 2×** | plugin-pique (624l) · pique-consultoria-hub (349l) | — |
| 7 | **modelo existe 2×** | plugin-pique · metodo-pique | 3 + 1 |

---

# Anexo — Bloqueios técnicos (independem da triagem)

Achados na auditoria. Nenhum é resolvido escolhendo manter/excluir:

1. **`dist/` do `pique-clickup-mcp` não está versionado** — quem clonar o plugin não tem o `server.js` buildado. O MCP não instala.
2. **Path absoluto** — o MCP aponta pra `C:/Users/Henrique Carvalho/Documents/PROGRAMAS/plugin-pique/...`. Não funciona em outra máquina.
3. **`config/user-config.example.md` desatualizado** — lista só Henrique e Marco (faltam Carol, Arthur, Gabriel), e os calendar IDs de exemplo (`409d950b`, `88b6ab1c`) estão **mortos** — o próprio CLAUDE.md os marca como 404.
4. **18 dos 26 comandos do plugin-pique têm hardcode do cérebro pessoal** — marcados como ACOPLADO acima.
5. **O MCP ClickUp já é multi-usuário por design** (`CLICKUP_TOKEN` + `PIQUE_CLICKUP_ROLE` owner/editor/viewer). O problema não é o código, é a distribuição — itens 1 a 3.
