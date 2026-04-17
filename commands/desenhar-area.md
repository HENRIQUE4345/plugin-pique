---
description: Analisa uma area (financeiro, produto, marketing, rh, gestao-lojas, supervisao) de um cliente Pique, descobre o que ja existe no cerebro, identifica problema raiz, discute iterativamente e empacota em plugin YabaBuss no Catalogo de Solucoes. Detecta maturidade da area e pula etapas quando ja ha material desenhado. Execute este fluxo EXATAMENTE, sem pular etapas.
---

Orquestra analise profunda de uma area de cliente + desenho de solucoes no padrao YabaBuss + criacao dos cards no Catalogo de Solucoes do ClickUp. Replica o fluxo consultivo que gerou o Plugin Produto do Beco (12/04/2026) e adapta pra areas com maturidade variavel. Execute este fluxo EXATAMENTE, sem pular etapas.

## Ferramentas

- **Exploracao do cerebro e ClickUp**: delegar aos Explore agents (Sonnet, paralelos)
- **TODAS as operacoes ClickUp de escrita**: delegar ao agent `gestor-clickup`
- **Leitura direta de arquivos criticos**: Read (narrativa-yababuss.md, catalogo-kanban-modelo.md, dossies do cliente)
- **Modelo desta skill**: Opus (orquestracao). Agents delegados usam Sonnet.

> **IMPORTANTE**: Se o MCP `pique-clickup` estiver desativado, avise: "MCP pique-clickup desativado. Ative em VS Code → MCP Servers → pique-clickup → Enable. Depois me chame de novo." NAO tente continuar sem ClickUp.

## Configuracao e fontes de regras

- **Catalogo de Solucoes**: list `901326825973` (folder Beco - Diagnostico, Space Pique Digital) — **por enquanto unica list-destino**. Se o cliente for outro, perguntar ao usuario em Fase 0
- **Solucoes (tasks operacionais)**: list `901326725724` (mesma folder)
- **Modelo canonico de card**: `pique/clientes/beco/solucoes/catalogo-kanban-modelo.md`
- **Narrativa YabaBuss**: `pique/produto-yabadoo/narrativa-yababuss.md` (3 camadas, plugins, posicionamento)
- **Roadmap futuro** (onda 5): `pique/produto-yabadoo/roadmap-futuro.md`
- **Regras de criacao ClickUp**: agent `gestor-clickup.md` (verbo infinitivo, 6 campos obrigatorios, Policy #9)

**Antes de comecar a Fase 1, leia obrigatoriamente:** `catalogo-kanban-modelo.md` e `narrativa-yababuss.md`. Sao as fontes de verdade da estrutura e do posicionamento.

---

## Regras duras (checklist aplicado em cada fase)

### Default consultivo
- [ ] NAO editar arquivo nem criar task sem pedido explicito do usuario
- [ ] Max 3-5 perguntas cirurgicas por turno (nao survey longo)
- [ ] Pre-preencher respostas com contexto real em vez de perguntas abertas (memory `feedback_respostas_preenchidas`)
- [ ] Esbocar visualmente (ASCII/tabela) so quando o usuario pedir
- [ ] Discutir antes de gerar entregaveis densos (memory `feedback_discutir_antes_gerar`)

### Descoberta antes de agir
- [ ] Auditar estado REAL do cerebro + ClickUp antes de propor (CLAUDE.md global)
- [ ] Nunca refazer diagnostico se material ja existe — detectar maturidade e pular etapas
- [ ] Buscar cards existentes no Catalogo (filtrar por Area) ANTES de propor criar qualquer coisa
- [ ] Buscar tasks existentes na list Solucoes (filtro por nome "Estudar <area>") ANTES de criar follow-up pessoal

### Dados factuais nunca inventados (regra dura)
- [ ] **Numeros financeiros** (Economia R$, Preco venda, Valor recorrencia, Horas impl): preencher SO com fonte firme citavel. Senao, deixar VAZIO. NUNCA estimar "baseado em plano X de mercado" ou "assumindo Y funcionarios × R$Z/h" — isso vira dado fake no ClickUp e corrompe decisao comercial. Memory: `feedback_nao_inventar_numeros`
- [ ] **Valor de ferramenta externa que o cliente paga** (ex: mLabs, Canva Pro, qualquer SaaS): buscar fonte nos docs do cliente ou perguntar. NAO chutar baseado em tabela publica de mercado
- [ ] **Tempo/carga de pessoa** (ex: "Nayara 600h/ano"): so com fonte no dossie. Estimativas grosseiras devem ser marcadas explicitamente "estimativa — validar com <fonte>"
- [ ] Em **Economia nao monetaria** (texto), evitar numeros soltos sem citacao. Preferir descrever dor qualitativa + remeter a paths do cerebro

### Por card-mae a criar (sem subtasks na ideacao)
- [ ] Nome comeca com verbo **`Desenvolver`** seguido de titulo legivel (ex: `Desenvolver Cadastro Unificado de Produto`). NAO usar prefixo codificado tipo `F1` ou `Plugin X`. Qualquer socio deve ler e entender do que se trata. Origem: memory `feedback_verbo_catalogo_desenvolver` — cards da list Catalogo de Solucoes em folder de consultoria cliente sempre "Desenvolver".
- [ ] Descricao markdown com 5 secoes: **Contexto / O que entrega (componentes inline) / Criterio de pronto / Pre-requisitos / Referencias**. Template completo no Apendice.
- [ ] Custom fields obrigatorios: Area, Tipo, Impacto, Esforco, Onda, Usuario-chave, **Modelo** (enum: Implementacao+Recorrencia / Implementacao unica / SaaS / Custom).
- [ ] Custom fields opcionais (preencher so com fonte firme): **Economia nao monetaria** (texto narrativo — preferir preencher), **Referencia de Contexto** (lista de paths do cerebro relevantes), **Economia R$/ano** / **Horas impl** / **Preco venda** / **Valor recorrencia** (deixar VAZIO se nao tem fonte firme citavel — nao inventar numero), **Revisao <socios>** = false.
- [ ] Status inicial = `ideia` (default) ou `investigando` (ja ha movimento concreto).
- [ ] Esforco P (ate 20h) / M (20-60h) / G (60h+).
- [ ] **Subtasks NAO sao criadas nesta fase.** Componentes tecnicos viram lista narrativa dentro da descricao (secao "O que entrega"). Subtasks so nascem quando a task vira desenvolvimento concreto (pos-aprovacao de spec). Origem: sessao 16/04/2026 — cards F1/F2/F3 iniciais tinham subtasks tecnicas detalhadas que saturaram o catalogo; reorganizacao apagou 3 mae + 12 subtasks e recriou 4 mae sem subs.
- [ ] Referencias no cerebro checadas (arquivos existem?).

### Checkpoints obrigatorios (NUNCA pular)
- [ ] Pausar apos Fase 1 (Descoberta) — usuario valida maturidade + decide sobre cards antigos (se existirem em formato fora do padrao)
- [ ] Pausar apos Fase 5 (Empacotamento) — usuario aprova tabela de fases
- [ ] Pausar apos Fase 6.5 (Docs canonicos no cerebro escritos) — usuario valida conteudo antes das tasks referenciarem
- [ ] Pausar apos Fase 7.1 (cards-mae criados) — usuario valida antes da calibracao iterativa
- [ ] Pausar apos Fase 7.3 (calibracao de custom fields) — usuario marca Revisao <socio>
- [ ] Nunca criar em lote sem confirmacao (memory do chat Compras 12/04)

### Pos-criacao
- [ ] Todas as tasks reportadas com ID + URL
- [ ] Location validada com `get_task` (memory `feedback_clickup_gotchas`: cards caem em list errado se parametro faltar)
- [ ] Custom fields validados um por um (memory: MCP silenciosamente grava default se option nao bate)

---

## Fase 0: Input

Antes de comecar, defina com o usuario:

1. **Qual cliente?** (nome ou ID). Default provavel: `beco`. Se outro, validar que existe `pique/clientes/<cliente>/`.
2. **Qual area?** Opcoes canonicas (schema do Catalogo): `Financeiro`, `Compras`, `Gestao Lojas`, `Supervisao`, `RH`, `Marketing`. Se o usuario falar "produto", mapear pra `Compras` (convencao do catalogo Beco).
3. **Escopo especifico opcional?** Ex: "focar em cobrancas" dentro de Financeiro; "focar em cadastro" dentro de Compras. Se nao tiver, cobre a area toda.
4. **Stakeholder ao lado?** Se sim, ativar modo que gera perguntas cirurgicas pra extrair (3-5 por turno).

Se faltar `cliente` ou `area`, perguntar via AskUserQuestion. Se usuario nao responder em 2 tentativas, abortar com aviso claro.

### Plan mode awareness

Se o usuario ja esta em **plan mode** quando acionar a skill:
- Fase 5 (Empacotamento) emite o rascunho no plan file (via Write/Edit) em vez de tabela texto na conversa
- Fase 6.5 e Fase 7 NAO executam ate `ExitPlanMode` ser chamado e o plan ser aprovado
- Discussao iterativa da Fase 4 continua livre (leitura + conversa sao permitidas em plan mode)
- Apos aprovacao do plan, retomar direto na Fase 6 (Validacao schema)

---

## Fase 1: Descoberta do existente (PARA E ESPERA)

**Objetivo:** detectar maturidade da area pra decidir se as Fases 2-3 rodam ou se pula pra Fase 5.

Lancar **ate 3 Explore agents em paralelo** (Sonnet):

### Agent 1 — Material do cliente no cerebro
Buscar em `pique/clientes/<cliente>/` por:
- Dossies relacionados a area (ex: `entregas/dossie-financeiro-*.md`, `entregas/dossie-produto-*.md`)
- Solucoes ja mapeadas (`solucoes/` e subpastas)
- Sessoes recentes (ultimos 60 dias) com tema da area
- Diagnostico consolidado da area se existir (`diagnostico/area-<nome>.md`)
- Processos/mapeamento pessoa-por-pessoa se existir

**OBRIGATORIO — Auditar orfaos fora do cerebro:** ler `pique/clientes/<cliente>/_mapa.md` e procurar por "[pendente migracao]", "[no Drive]", "nao migrado", "repo antigo" ou similar. Se houver mencao OU se o diagnostico esperado da area nao existe, buscar em TRES lugares:

1. **Drive:** `G:/Drives compartilhados/Pique Digital/Pique Digital/Clientes/<cliente>/diagnostico/` e subpastas relacionadas a area
2. **Repos paralelos em `C:/Users/Henrique Carvalho/Documents/PROGRAMAS/`** (ex: `BRAINSTORM-TEMPLATE/docs/sessoes/`, repos de projetos antigos do cliente, FLUXOS, qualquer pasta que contenha docs .md do cliente). Usar Glob + Grep com keyword da area + nome do cliente
3. Pastas `inbox/contextos/` ou `arquivo/` no cerebro pessoal (MEU-CEREBRO)

Material que o cerebro diz faltar pode estar la e muda maturidade de Media→Alta. Listar TODOS os arquivos encontrados no output do agent com paths absolutos.

Origens da regra:
- Sessao 13/04/2026 gestao-lojas/beco — entrevistas Ellen/Marcilene/gerentes estavam no Drive, nao migradas
- Sessao 17/04/2026 marketing/beco — 4 brainstorms com SWOT completa e mapeamento de 13 atividades de marketing estavam em `BRAINSTORM-TEMPLATE/docs/sessoes/`, nao migrados. Diagnostico "Alta maturidade" so emergiu apos o usuario apontar o repo paralelo — skill tinha avaliado "Media" sem essa busca

### Agent 2 — Cards existentes no Catalogo
Listar tasks da list `901326825973` filtrando pelo custom field `Area = <area>`. Para cada card: nome, status, ID, URL. Tambem checar se ha cards-mae ja no formato `Desenhar Plugin <area> — F<N>...` (sinal de que area ja foi empacotada antes).

### Agent 3 — Referencia canonica YabaBuss (Read direto, nao agent)
Ler `pique/produto-yabadoo/narrativa-yababuss.md` e `pique/clientes/<cliente>/solucoes/catalogo-kanban-modelo.md`. Esses sao fonte de verdade.

### Consolidar e detectar maturidade

| Maturidade | Criterio | Caminho |
|---|---|---|
| **Alta** | Dossie completo + solucoes mapeadas + >=3 cards ja no catalogo | Pula Fases 2-3. Vai direto pra Fase 4 rapida ou Fase 5 |
| **Media** | Dossie parcial OU solucoes sem cards no catalogo OU >=1 card mas sem empacotamento YabaBuss | Fases 2-3 focadas em gaps |
| **Baixa** | Sem dossie OU material disperso sem consolidacao | Fases 2-3 completas |
| **Inexistente** | Nada no cerebro | ABORTAR — alertar que precisa coletar contexto primeiro (visita/entrevista) |

### Sub-caminho obrigatorio: cards antigos fora do padrao atual

Se detectar cards no catalogo com **formato antigo** (qualquer um):
- Prefixo `Desenhar Plugin <Area> — F<N>` (padrao antigo) em folder de consultoria cliente
- Tem subtasks tecnicas criadas na ideacao (novo padrao e zero subtasks na mae)
- Campo `Modelo` vazio quando schema tem (significa criado antes da regra atual)
- Descricao nao tem "Criterio de pronto" como secao

**Ativar cleanup antes da Fase 7:**

1. **Dumpar conteudo integral** das tasks antigas (nome + descricao + custom fields + subtasks + IDs) em `pique/clientes/<cliente>/arquivo/catalogo-cleanup-YYYY-MM-DD.md` como backup — NUNCA deletar sem backup
2. **Apresentar ao usuario** tabela "apagar X, recriar Y" com justificativa (o que mudou no padrao, por que compensa recriar em vez de editar)
3. **Esperar aprovacao explicita**
4. **Deletar** via `gestor-clickup` (primeiro subtasks, depois mae) apos aprovacao
5. Seguir fluxo normal Fase 7 depois

Origem da regra: sessao 16/04/2026 Beco/Compras — 3 cards F1/F2/F3 criados em 12/04 com subtasks tecnicas foram apagados (15 tasks total) e recriados em modelo enxuto sem subtasks. Se tivesse backup automatico teria sido mais seguro.

### Apresentar ao usuario e PARAR

Formato:
```
## Descoberta — <cliente> / <area>

### Material no cerebro
- [N] dossies: [nomes]
- [N] solucoes mapeadas: [nomes]
- [N] sessoes recentes: [datas + titulos curtos]
- Diagnostico consolidado da area: [sim/nao]

### Cards ja no catalogo (Area=<area>)
- [N] cards total
- [nome] ([status]) [URL]
- ...
- Ja empacotado em plugin YabaBuss? [sim/nao]

### Maturidade estimada: [Alta / Media / Baixa / Inexistente]

### Caminho sugerido
[Fases que a skill vai rodar e quais vai pular, com justificativa]

### Perguntas
1. Concorda com a avaliacao de maturidade?
2. Ha algum material nao capturado que voce lembra?
3. Quer executar o caminho sugerido ou ajustar?
```

**PARE e espere resposta.**

---

## Fase 2: Leitura profunda (se maturidade < Alta)

Lancar Explore agents paralelos (max 3) pra ler o material identificado na Fase 1. Pra cada agent, briefing claro do foco.

**Exemplo de briefing:**
> Leia os dossies X, Y, Z do cliente <cliente>. Me entregue em ate 500 palavras: (1) mapa de pessoas da area <area> com papel + dores + SPOF; (2) fluxo atual ponta-a-ponta; (3) dados numericos concretos citados; (4) contradicoes ou lacunas. Cite file_path:linha sempre que possivel. Portugues BR.

**Consolidar output dos agents em:**
- Mapa de pessoas (tabela: nome, papel, SPOF, dores, sistemas)
- Fluxo atual (diagrama ASCII ou texto estruturado)
- Dados concretos (tabela: metrica, valor, fonte)
- Contradicoes/lacunas (lista bullet)

**Apresentar ao usuario e PARAR pra validar/corrigir.**

---

## Fase 3: Problema raiz (se Fase 2 rodou)

Baseado em Fase 2, identificar:

1. **Gargalo unico** — se pudesse destravar uma coisa, qual seria? Evitar sintoma, ir pra raiz.
2. **Incentivos que sustentam o caos** — por que o problema persiste? Quem nao paga pela dor?
3. **Conexao com outras areas** — como essa area alimenta/recebe caos de outras (financeiro, operacional)
4. **Lacunas nao mapeadas** — o que precisa nova visita/entrevista

**Apresentar ao usuario e PARAR pra confirmar/desafiar.**

---

## Fase 4: Loop consultivo (modo default)

Entrar em modo conversa iterativa. Regras:

- Max 3-5 perguntas cirurgicas por turno
- Pre-preencher respostas com contexto real (nao perguntas abertas)
- Esbocar ASCII/tabela **so quando o usuario pedir**
- Modo stakeholder-ao-lado: se ativado em Fase 0, gerar perguntas pra extrair do terceiro
- Provocar pontos fracos das ideias do usuario (nao concordar automaticamente)
- Nunca editar arquivo nem criar task nesta fase

### Como sair do loop

Usuario sinaliza com: "empacotar", "vamos criar os cards", "bora pro catalogo", "pronto", "finaliza", ou equivalente.

Se o usuario fica em discussao >30min sem convergir, oferecer: "quer que eu arrisque um rascunho do empacotamento pra gente debater em cima?". Aceitar so com sim explicito.

---

## Fase 5: Empacotamento em plugin YabaBuss (PARA E ESPERA)

Consulta `narrativa-yababuss.md` e o que emergiu do Loop.

### Passo 1 — Identificar tipologia (OBRIGATORIO antes de decompor)

Antes de decompor em cards, decidir QUAL DOS DOIS PADROES se aplica:

| Tipologia | Criterio | Padrao de card |
|---|---|---|
| **Area multi-solucao** | Entregas independentes, adotaveis em isolamento (ex: Planilha Rateio vs Dashboard DRE — nao dependem uma da outra pra gerar valor) | 1 card por entrega. N cards-mae na area |
| **Plugin integrado** | Tudo acoplado tecnicamente; nao faz sentido vender parte sem o resto (ex: Plugin Marketing = setup + motor de slots + producao + agendamento. Sem o motor, producao nao tem o que consumir) | 1 card-mae so pra todo o plugin. Componentes tecnicos viram lista narrativa inline |

Precedentes do Catalogo Beco:
- **Area multi-solucao:** Financeiro (Planilha 1 Lancamentos + Planilha 2 Rateio + Planilha 3 Agenda + Planilha 4 Conferencia + Dashboard DRE + Conciliacao Bancaria = 6 cards independentes)
- **Plugin integrado:** Plugin Base Operacional Lojas (80h, 1 card com 4 componentes inline); Plugin Marketing Beco (5 componentes inline, 1 card)

Se duvida: perguntar ao usuario explicitamente "e area multi-solucao ou plugin integrado?" — o framing muda o empacotamento inteiro. Origem: sessao 17/04/2026 marketing/beco — proposta inicial foi 5 cards-mae; usuario corrigiu pra 1 card (plugin integrado). Teria sido evitado com esse check.

### Passo 2a — Se multi-solucao: N fases vendaveis

1. **N fases vendaveis** (tipicamente 2-4). Cada fase = 1 card-mae. Criterio de corte: usuario diferente OU mecanica diferente OU dependencia forte
2. **M componentes tecnicos por fase** viram **lista narrativa dentro de "O que entrega"**, NUNCA subtasks na ideacao. Tipo tecnico especifico (Planilha Inteligente, Agente IA, Dashboard, Processo/Workflow, Integracao/API)

### Passo 2b — Se plugin integrado: 1 card so

1. **1 card-mae** com nome que comunica o todo (ex: `Desenvolver Plugin Marketing Beco`)
2. **Componentes** (setup, motor, producao, etc) viram lista narrativa dentro de "O que entrega" — NAO viram cards separados nem subtasks
3. Auto-check de densidade tecnica ainda se aplica pra garantir que pelo menos 1 componente e Base/Integracao/Agente/Dashboard

### Passo 3 — Onda 5

**Ideias de onda 5** (futuro, nao vender agora) → lista separada pra `roadmap-futuro.md`.

### Auto-check de densidade tecnica (OBRIGATORIO antes de apresentar)

Antes de escrever a tabela de proposta, validar INTERNAMENTE:

- [ ] **Cada fase tem pelo menos 1 componente tecnico duro** (Base Supabase / Integracao/API / Agente IA / Dashboard / Planilha Inteligente). Fase 100% Processo/Workflow NAO e plugin YabaBuss — e pre-requisito operacional. Se detectar, consolidar os Processos em 1-2 subtasks e injetar componente tecnico (ex: "Schema Operacional Supabase" pra modelar os eventos que a fase produz).
- [ ] **Plugin tem pelo menos 1 Base de Dados** (Supabase) em alguma fase. Todo plugin YabaBuss ja empacotado (Financeiro F1, Produto F1) abre com Base Master. Se o novo plugin nao tem, perguntar: onde o dado que ele gera vai morar?
- [ ] **Mix por fase nao repete >=3x o mesmo Tipo.** 4 Processo/Workflow em sequencia = red flag.

Se algum check falhar, reestruturar ANTES de apresentar ao usuario. Mencionar o check na apresentacao ("verifiquei densidade tecnica — cada fase tem Base/Integracao/Agente/Dashboard"). Origem da regra: sessao 13/04/2026 gestao-lojas/beco — proposta inicial tinha F1 100% processo e foi rejeitada apos criar cards, causando rollback.

### Apresentar tabela ao usuario

```
## Proposta de empacotamento — Plugin <Area>

### Fases (cards-mae — nome legivel, verbo Desenvolver)
| Fase | Nome legivel | Impacto | Esforco | Usuario-chave | Modelo | Dor que resolve |
|---|---|---|---|---|---|---|
| F1 | Desenvolver <Nome 1> | Alto | G | [pessoa] | Implementacao+Recorrencia | [1 linha] |
| F2 | Desenvolver <Nome 2> | Alto | G | [pessoa] | Implementacao+Recorrencia | [1 linha] |
| F3 | Desenvolver <Nome 3> | Medio | M | [pessoa] | Implementacao+Recorrencia | [1 linha] |

### Componentes narrativos por fase (inline na descricao — NAO viram subtasks)
F1: [lista dos N componentes com tipo tecnico, 1 linha cada]
F2: ...
F3: ...

### Dependencias
F1 pre-req de F2 e F3. F2 alimenta F3. [ajustar conforme caso]

### Ideias de onda 5 (nao entram no catalogo)
- [item 1]
- [item 2]
```

**PARE pra aprovacao ou ajuste.**

Se aprovado: segue pra Fase 6. Se ajustes: aplica e re-apresenta.

---

## Fase 6: Validacao de schema ClickUp (executa direto)

Delegar ao `gestor-clickup` inspecionar o destino:

> Inspecione a list `901326825973` (Catalogo de Solucoes). Retorne: (1) custom fields existentes + options de cada um; (2) cards ja criados com Area=<area>; (3) cards duplicados potenciais pro empacotamento que vamos criar (nome similar); (4) work_types validos.

**Validar contra a proposta:**
- Todos os options usados existem? (Area, Tipo, Onda, Impacto, Esforco)
- Ha duplicata de nome? Se sim, alertar pro usuario.
- Nomes respeitam verbo infinitivo? (validacao MCP)

**Se algum ajuste necessario**, apresentar ao usuario antes de Fase 6.5. Senao, seguir.

---

## Fase 6.5: Consolidar docs canonicos no cerebro (ANTES das tasks)

Ordem critica: docs no cerebro **primeiro**, tasks do ClickUp **depois**. Razao: as tasks vao apontar pros docs no campo Referencia de Contexto. Se criar tasks antes, as referencias ficam quebradas ou precisam ser refeitas.

### Doc 1 — Desenho consolidado
**Caminho:** `pique/clientes/<cliente>/solucoes/plugin-<area>-desenho.md`

Conteudo (fonte da verdade tecnica):
- Contexto + problema raiz
- Virada conceitual da area (decisoes arquiteturais que sairam do Loop)
- Arquitetura de dados (tabelas Supabase, campos, FKs) quando aplicavel
- Ferramentas (1 secao por componente — estacao, portal, planilha, dashboard, etc)
- Processo declarado (cadencia diaria/semanal/quinzenal/mensal + papeis ativo/passivo)
- Sequencia de implementacao em fases + criterio de pronto por fase
- Timeline pra dado ficar util (marcos 30/60/90/180/365d) quando aplicavel
- Estrategia de legado (se houver sistema antigo a conviver)
- Gaps resolvidos vs abertos
- Referencia cruzada (sessoes, diagnostico, narrativa)

### Doc 2 — Briefing das tasks
**Caminho:** `pique/clientes/<cliente>/solucoes/plugin-<area>-tasks-briefing.md`

Conteudo (1 secao por task-mae que vai ser criada):
- Por que existe (dor especifica em 2-3 frases, com dado)
- O que entrega (1 paragrafo)
- Numeros de impacto (economia nao monetaria firme + economia R$/ano se houver fonte)
- Componentes (lista curta)
- Ler antes de mexer (lista de 3-5 paths especificos)

### Atualizar `_mapa.md`

Adicionar entradas pros 2 docs novos em `pique/clientes/<cliente>/_mapa.md` secao Solucoes.

### Escrever e PARAR

Apresentar ao usuario: "Escrevi doc de desenho X linhas + briefing Y linhas. Confirma o conteudo antes das tasks apontarem pra eles?" Pausar.

---

## Fase 7: Criacao em checkpoint

### 7.1 Cards-mae (delegar ao gestor-clickup)

Briefing por card-mae (repetir pra cada):
- List: `901326825973` (confirmar na Fase 0)
- Name: **`Desenvolver <titulo legivel>`** (nome legivel, SEM prefixo codificado F1/Plugin)
- Description: 5 secoes do Apendice (Contexto / O que entrega + componentes inline / Criterio de pronto / Pre-requisitos / Referencias apontando pros docs da Fase 6.5)
- Status: `ideia`
- Custom fields obrigatorios: Area, Tipo, Onda, Impacto, Esforco, Usuario-chave, **Modelo** (enum)
- Custom fields opcionais: deixar vazio nesta fase (vai popular na 7.3)
- Obrigatorios MCP: Assignee=Rique, Priority=Low, Due=+14 dias, Estimate=60min, Work type=projeto
- **SEM SUBTASKS**

**Reportar IDs + URLs. PARE pra usuario validar.**

### 7.2 Task pessoal de follow-up (list Solucoes)

**ANTES de criar, verificar duplicata** via `gestor-clickup`:
- Listar tasks da list Solucoes (`901326725724`) filtrando por nome contendo "Estudar <area>" + "<cliente>"
- **Se existir:** NAO criar nova. Enriquecer a existente via `update_task`: substituir descricao pelo conteudo novo, ajustar due/estimate se escopo mudou, adicionar dependencia `blocking` → cards-mae criados na 7.1
- **Se nao existir:** criar nova com os parametros abaixo

Parametros da task (criar ou atualizar):
- List: `901326725724`
- Name: `Estudar <area> <cliente> e popular cards no catalogo`
- Assignee: Rique
- Due: +5 dias uteis
- Estimate: 240min (4h)
- Priority: Normal
- Work type: projeto
- Description: 3 secoes padrao Pique (Contexto / O que fazer / Criterio de pronto), referenciando cards-mae criados
- **Dependencia:** blocking → cada card-mae criado na 7.1

Origem da regra: sessao 17/04/2026 marketing/beco — skill tentou criar duplicata da task `86agxeuje` "Estudar Marketing Beco" que ja existia desde 14/04. `gestor-clickup` detectou e parou; checagem deveria ter sido preventiva na skill, nao reativa no agent.

### 7.3 Calibracao iterativa de custom fields (pos-criacao)

Apos as tasks-mae no ar, entrar em ciclo de calibracao. Apresentar cada task pro usuario e discutir o que preencher em cada campo opcional:

**Texto narrativo (preencher quase sempre):**
- **Economia nao monetaria:** texto curto com dor eliminada + SPOF resolvido + destravamento de outras fases. Fonte: Fase 3 + diagnostico canonico
- **Referencia de Contexto:** lista de paths do cerebro (porta de entrada + desenho + diagnostico + dados de apoio + sessoes). Formato: agrupado por categoria (PORTA DE ENTRADA, DIAGNOSTICO, DESENHO, DADOS, etc)

**Numerico (so preencher com fonte firme):**
- **Economia R$/ano:** preencher SO se tem fonte citavel de dado (ex: "600h Nayara × R$60/h = R$36K" citando dossie linha X). Senao, VAZIO + anotar pendencia no briefing
- **Horas impl:** preencher SO se stack + integracao + escopo estao definidos. Senao, VAZIO + anotar faixa estimada no briefing
- **Preco venda / Valor recorrencia:** tipicamente vazio ate pos-apresentacao/calibracao comercial com Marco

**Decisao do usuario (perguntar):**
- **Modelo:** apresentar as 4 opcoes (Implementacao+Recorrencia / Implementacao unica / SaaS / Custom) com leitura do Claude pra cada task, usuario decide

**Revisao:**
- Apos calibracao de cada task, usuario marca `Revisao <seu nome> = true`. Outros socios marcam quando revisarem.

Regra de ouro: **numero sem fonte firme = vazio com pendencia registrada.** Nunca inventar pra preencher campo.

---

## Fase 8: Artefatos paralelos

1. **Ideias de onda 5** → adicionar em `pique/produto-yabadoo/roadmap-futuro.md` (criar se nao existe; apendar se existe)
2. **Sugerir sincronizar submodule** — nao commitar sozinho: `Lembra de rodar /pique:sincronizar pra enviar os docs pro repo cerebro-pique`.

Nota: "diagnostico consolidado" ja foi pra Fase 6.5 como `solucoes/plugin-<area>-desenho.md` — nao recriar na Fase 8.

---

## Fase 9: Encerramento + auto-avaliacao

### Resumo final

```
## Plugin <Area> do <Cliente> — RESUMO

**Maturidade detectada:** [alta/media/baixa]
**Fases rodadas:** [lista]
**Cards-mae criados:** [N] ([URLs])
**Subtasks criadas:** [N]
**Task pessoal:** [URL]
**Docs atualizados/criados:** [lista]

**Perguntas abertas pra proximo passo:**
1. [pergunta cirurgica 1]
2. [pergunta cirurgica 2]
3. [pergunta cirurgica 3]
```

### Auto-avaliacao (executar sempre ao final)

Avalie a execucao:

1. **Deteccao de maturidade acertou?** O usuario corrigiu pra mais ou menos? (sinal de criterio fraco)
2. **Loop consultivo teve convergencia?** Quantos turnos ate empacotar? >10 turnos = fase 4 mal calibrada
3. **Perguntas cirurgicas** foram cirurgicas (3-5) ou viraram survey?
4. **Fase 6 pegou problema de schema?** (sinal de validacao funcionando) ou passou tudo direto (sinal de que pode eliminar passo)?
5. **Criacao 7.1/7.2/7.3** teve rollback/delete? (sinal de plan fraco em Fase 5)
6. **Cards criados consistentes com narrativa YabaBuss?** Alguma duplicata ou conflito com cards ja existentes?

Se identificar melhorias CONCRETAS e EVIDENCIADAS:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [descricao da melhoria, com evidencia]
- [descricao da melhoria, com evidencia]

Quer que eu ajuste a skill pra prevenir proxima vez?
```

2. Se aprovado, **editar este proprio arquivo** (`${CLAUDE_PLUGIN_ROOT}/commands/desenhar-area.md`) incorporando.

3. Anexar em `pique/infra/melhorias-plugin.md`:
```
## YYYY-MM-DD — desenhar-area [cliente]/[area] (usuario)
- [melhoria aplicada em linhas X-Y]
```

Se nao identificar nada concreto, nao mostre nada. **NAO melhore por melhorar.**

---

## Apendice — Template de card-mae (descricao)

Modelo padrao novo (supersedes 6-secoes antigo). Bate com o template global do CLAUDE.md Pique pra tasks ClickUp. Componentes tecnicos viram **lista narrativa dentro de "O que entrega"**, nao secao propria e NUNCA subtasks.

```markdown
## Contexto
[Dor especifica com dado concreto do dossie. 2-4 linhas. Cite file_path ou origem do dado.]

## O que entrega
[O que o cliente ve funcionar no dia a dia. 1-2 paragrafos, sem jargao tecnico.]

Componentes (viram tarefas tecnicas na hora de desenvolver, nao agora):
- [Componente 1 com 1 linha do que e]
- [Componente 2]
- [Componente 3]
- ...

## Criterio de pronto
[Como saber que a task esta finalizada. 1-3 frases objetivas com verbo no presente ("Lisley cadastra 1x", "Dashboard mostra margem real", etc). Nao e checklist tecnico — e resultado operacional.]

## Pre-requisitos
- [Outras tasks/fases que precisam estar rodando antes]
- [Dependencias externas — resposta de X, acordo de Y, decisao de Z]
- [Dados que precisam ter sido acumulados (ex: "F2 rodando ha 30d")]

## Referencias
Plano completo: pique/clientes/<cliente>/solucoes/plugin-<area>-desenho.md
Briefing desta task: pique/clientes/<cliente>/solucoes/plugin-<area>-tasks-briefing.md
Diagnostico: pique/clientes/<cliente>/diagnostico/...
Sessoes: pique/clientes/<cliente>/sessoes/YYYY-MM-DD-...
```

Nota: este e o template OBRIGATORIO. Nao improvisar secoes diferentes. Se o caso pede algo fora, adicionar apos "Referencias" como secao extra — nunca substituir as 5 centrais.
