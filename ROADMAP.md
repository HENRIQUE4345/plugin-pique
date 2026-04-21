# Roadmap — Plugin Pique

**Criado:** 2026-04-01
**Atualizado:** 2026-04-20
**Status:** ativo

Plugin de gestao interna da Pique Digital. Cada melhoria aqui e tambem uma feature futura do Yabadoo Business.

## Conexao Plugin Pique → Yabadoo

| Melhoria no Plugin | Equivalente no Yabadoo |
|---------------------|------------------------|
| Roadmap no bom-dia/boa-noite | "Objetivo do mes" no Yabadoo Business |
| Pilula de conhecimento | Proatividade do Yabadoo (scheduler) |
| Chat guiado por task | "Modo Foco" do Yabadoo |
| Prep de reuniao | Feature do Yabadoo Business |
| Auto-avaliacao com self-edit | Learning Machine do Yabadoo |
| Stand-up no ClickUp | Historico de rituais auditavel |
| Evolution API (WhatsApp auto) | Multi-canal nativo do Yabadoo |

Cada uso do plugin = teste real do produto. Cada case da Pique = case vendavel.

---

## Estado atual (v1.15.0)

- 24 commands | 1 agent | 3 skills | 3 hooks | 1 MCP custom (pique-clickup-mcp)
- Bom-dia e boa-noite rodam todo dia (Henrique, Marco, Gabriel)
- ClickUp como fonte de verdade
- Multi-usuario via plugin-pique.local.md
- Auto-avaliacao estruturada em todos os commands (mas sem self-edit real)
- 18/04: adicionado `desenhar-individual` (Onda 2.5) — mapeamento individual de pessoa de cliente em 4 rodadas com proveniencia rastreavel
- 20/04: absorvido `plugin-pique-news` como `/plugin-pique:news` (Onda 2.6) — briefing diario posta no canal ClickUp via tool `post_chat_message` do MCP (v0.3.0)

---

## Onda 1 — Ajustes rapidos (abril semana 1)

Mudancas em commands existentes. Sem commands novos. Impacto alto, esforco baixo.

### 1.1 Roadmap nos rituais diarios
**Onde:** bom-dia.md, boa-noite.md
**O que:**
- Bom-dia (Fase 2 — briefing): adicionar `**Meta do mes:** [MIT da fase atual do roadmap]`
- Boa-noite (Fase 2 — review): adicionar `**Progresso no roadmap:** [o que hoje aproximou/afastou da meta]`
- Claude le `roadmap-metas-2026.md` (ou equivalente definido no local.md) e puxa o MIT automaticamente
**Por que:** Henrique esquece a meta 2 dias depois de definir. Precisa aparecer todo dia sem esforco.
**Esforco:** 30 min
**Status:** a fazer

### 1.2 Padronizar ClickUp via agent
**Onde:** bom-dia.md (e qualquer outro command que chame ClickUp direto)
**O que:** Todas as operacoes ClickUp passam pelo agent `gestor-clickup`. Nenhum command chama MCP direto.
**Por que:** O agent enforcea regras (verbo, assignee, descricao, limites). Chamada direta pula as regras.
**Esforco:** 1h
**Status:** a fazer

### 1.3 Detalhamento como oferta (nao fase)
**Onde:** bom-dia.md (Fase 4)
**O que:**
- Remover Fase 4 como bloco separado obrigatorio
- No final da Fase 3 (proposta confirmada), perguntar: "Quer detalhar alguma task agora? Se nao, posso detalhar com base no que sei e voce valida."
- Se sim: detalha interativamente
- Se nao: Claude gera detalhamento sozinho com contexto do cerebro/ClickUp e salva na task
- Se ignora: pula sem culpa
**Por que:** Fase 4 nunca e executada. E valiosa mas pesada. Transformar em oferta inteligente.
**Esforco:** 30 min
**Status:** a fazer

### 1.4 Roadmap no planejamento e review semanal
**Onde:** planejamento-semanal.md, review-semanal.md
**O que:**
- Planejamento: filtrar tasks da semana por "contribui pra meta do mes?"
- Review: comparar semana vs MIT da fase. Scorecard real.
**Por que:** Sem isso, semanas passam sem medir progresso contra o roadmap.
**Esforco:** 1h
**Status:** a fazer

---

## Onda 2 — Commands novos (abril semana 2-3)

Funcionalidades novas que conectam gaps no workflow.

### 2.1 `/pique:executar` — Chat guiado por task
**O que:** Recebe ID de task (ou seleciona da lista "Hoje"). Fluxo:
1. Le a task do ClickUp (descricao, contexto, criterio de pronto)
2. Le arquivos relacionados no cerebro
3. Pergunta contexto: "Onde parou? O que precisa pensar? Qual o primeiro passo?"
4. Atualiza descricao com o detalhamento (resolve o gap da Fase 4 do bom-dia)
5. Guia passo a passo durante a execucao
6. Ao final: marca como Finalizado, pergunta se quer puxar a proxima
**Por que:** O detalhamento de task que nunca acontece no bom-dia acontece naturalmente aqui — na hora de comecar.
**Conexao Yabadoo:** "Modo Foco"
**Esforco:** 2-3h
**Status:** a fazer

### 2.2 `/pique:prep-reuniao` — Preparacao automatica
**O que:** Fluxo:
1. Le Calendar de amanha (ou data especifica)
2. Pra cada reuniao com participantes:
   - Identifica os participantes (cruza com membros do CLAUDE.md)
   - Busca tasks relacionadas no ClickUp (por assignee, por Space)
   - Busca ultimo encontro/sessao com essa pessoa no cerebro
   - Busca decisoes pendentes
3. Monta pauta com blocos + tempo estimado (regra: max 45min)
4. Apresenta pro usuario aprovar
5. Salva pauta como descricao do evento no Calendar
**Por que:** Reuniao sem pauta = Henrique divaga 2h. Com pauta automatica = 30 min e decisoes claras.
**Conexao Yabadoo:** Feature Yabadoo Business
**Esforco:** 2-3h
**Status:** a fazer

### 2.3 Pilula de conhecimento no `/pique:encerrar`
**Onde:** encerrar.md (nova fase final)
**O que:** Apos tudo processado, o Claude cruza:
- O que foi discutido na conversa
- Roadmap + MIT da fase
- Tasks paradas / atrasadas / padrao de bloqueio
- Alertas da skill rituais-pique (ex: "Marco sem iniciativa 2+ semanas")
Gera 1 insight curto e acionavel. Nao e conselho generico — e dado cruzado.
**Exemplos:**
- "4 tasks do Yabadoo paradas ha 5 dias. Meta do mes = beta com 4 testers."
- "Voce nao rodou /prep-reuniao pra amanha e tem reuniao com Arthur."
- "Essa semana voce focou 80% em Beco e 20% em Yabadoo. O roadmap pede o inverso."
**Por que:** Mentor automatico que mantem na rota sem sermao.
**Conexao Yabadoo:** Proatividade (scheduler)
**Esforco:** 1-2h
**Status:** a fazer

---

## Onda 2.5 — Mapeamento individual (abril semana 3)

### 2.5.1 `/pique:desenhar-individual` — Mapear pessoa de cliente
**O que:** Skill que mapeia uma pessoa individual de cliente (ex: Edith do Beco) em 4 rodadas:
1. Triangulacao factual de 4-6 fontes (cerebro Pique + CEREBRO-BETO + repos paralelos), SEM interpretar
2. Sintese com proveniencia explicita (campos Classe C cruzando 2+ fontes, com taxonomia fixa de 10 tipos: triangulado, espelho-invertido, comparativo, diagnostico, spof, evolucao-temporal, gap-governanca, tendencia-recente, testemunho-bruto, alinhamento)
3. Classificacao campo a campo (A ancorado / B extraido / C sintese) + destino (hub-publico / interno / tbd-q1)
4. Geracao do MD canonico em `pique-consultoria-hub/clientes/<cliente>/individuais/<pessoa>-consolidado-v2.md` em formato **template-friendly** (listas de items, NAO campos top-level personalizados)

Inclui checkpoint critico de leitura conjunta com cliente entre Rodada 1 e Rodada 2 (que originou a F5 da Edith em 18/04).

**Por que:** Beco tem 12+ pessoas-chave a mapear (Felipe, Karine, Jezi, Rosa, Ze...). Repetir manualmente o processo Edith pra cada uma = horas. Skill empacota o roteiro com proveniencia rastreavel — cada afirmacao etiquetada (camada brutal sai etiquetada, nao censurada).

**Conexao Yabadoo:** Modulo "Gestao de Pessoas" YabaBuss (hipotese futura — primeiro cliente confirma)

**Pre-requisito:** caso piloto Edith ja rodado e gabarito v2 em `pique-consultoria-hub/clientes/beco/individuais/edith-consolidado-v2.md` (ref de formato)

**Esforco:** ja implementado (3h sessao 18/04 — destilacao manual do metodo + criacao da skill)

**Status:** feito 2026-04-18

---

## Onda 2.6 — Briefing de noticias absorvido (abril semana 3)

### 2.6.1 `/plugin-pique:news` — Briefing diario no canal ClickUp
**O que:** Absorcao do plugin-pique-news isolado (v1.0.0) como command nativo do plugin-pique. Scrape 5 camadas via Apify → cruzamento com cerebro (roadmap, pipeline, catalogo, yabadoo, topicos-conteudo) → HTML em docs.pique.digital → teaser no canal ClickUp `1301zr-3373` (workspace Pique, 36702200).

**Mudancas vs v1.0.0:**
- Destino: WhatsApp (Evolution API) → Canal ClickUp via tool `post_chat_message` (nova, API v3)
- MCP: `pique-whatsapp` custom (descartado) → `pique-clickup` existente (+1 tool)
- Formatacao teaser: WhatsApp (`*bold*`) → ClickUp markdown (`**bold**`, bullets `-`)
- Backup local Drive removido — 100% docs.pique.digital
- Namespace: `/pique-news:news` → `/plugin-pique:news`

**Por que:** Plugin-news isolado era overhead pra 1 skill so. WhatsApp dava trabalho operacional e falhava. Consolidar no plugin-pique (onde vivem rituais bom-dia/boa-noite/encerrar) deixa mais natural integrar com /loop ou /bom-dia.

**Conexao Yabadoo:** Tool `post_chat_message` do MCP vira bloco do Yabadoo — qualquer modulo pode postar em chat ClickUp.

**Esforco:** ~2h (investigacao endpoint API v3 + tool MCP + migracao arquivos + adaptacao do news.md)

**Status:** feito 2026-04-20

---

## Onda 3 — Self-improving real (abril/maio)

A auto-avaliacao que existe hoje vira auto-edicao real.

### 3.1 Auto-avaliacao com self-edit
**Onde:** todos os commands (substituir bloco de auto-avaliacao atual)
**O que:**
1. No final do command, Claude avalia a execucao (como hoje)
2. Se detectar padrao concreto (ex: "usuario pulou Fase 4 pela terceira vez"), propoe um **diff** no proprio .md do command
3. Mostra pro usuario: "Quero mudar isso. Aprova?"
4. Se aprovado: edita o .md + commit automatico
5. Se negado: registra que foi recusado (evita propor de novo)
**Por que:** Appendar num log que ninguem le nao e self-improving. Editar o command e.
**Conexao Yabadoo:** Learning Machine
**Esforco:** 2-3h
**Status:** a fazer

### 3.2 Sincronizar plugin entre maquinas
**Onde:** sincronizar.md (expandir) ou command novo
**O que:**
- O plugin-pique e um repo Git. Cada pessoa commita suas mudancas (inclusive auto-edits).
- O `/pique:sincronizar` atual so sincroniza o cerebro-pique (submodule).
- Expandir pra sincronizar TAMBEM o repo do plugin: pull, resolve conflitos simples, push.
- Ou: criar `/pique:sync-plugin` separado.
**Fluxo pro time:**
- Henrique faz mudancas no plugin → commit → push
- Marco faz pull → tem as mudancas
- Auto-edits de qualquer pessoa geram commit → na proxima sync, todo mundo tem
**Por que:** Hoje cada um tem copia isolada. Melhorias nao propagam.
**Esforco:** 1h
**Status:** a fazer

---

## Onda 4 — Integracao WhatsApp (maio+)

### 4.1 Stand-ups salvos no ClickUp
**Onde:** bom-dia.md, boa-noite.md (Fase 5)
**O que:** Alem de gerar a mensagem pra WhatsApp, salvar como comentario num ClickUp Doc mensal ("Stand-ups Abril 2026").
**Por que:** Historico auditavel. Review semanal puxa stand-ups da semana sem depender de diarios .md.
**Esforco:** 1h
**Status:** a fazer

### 4.2 Evolution API — WhatsApp automatico
**Onde:** MCP novo + bom-dia.md, boa-noite.md
**O que:**
- Integrar Evolution API como MCP server no plugin
- Bom-dia/boa-noite enviam a mensagem direto no grupo WhatsApp
- Elimina o passo de copiar/colar
- Pode tambem PUXAR mensagens do grupo (ver o que o outro mandou)
**Pre-requisito:** Evolution API configurada e funcionando
**Por que:** Reduz friccao. Mas copiar/colar funciona — nao e urgente.
**Conexao Yabadoo:** Multi-canal nativo
**Esforco:** 4-6h
**Status:** futuro

---

## Onda 5 — Expansao (maio+)

### 5.1 `/pique:delegar` — Delegacao por perfil
**O que:** Recebe bloco de trabalho + pessoa. Gera tasks no estilo que a pessoa precisa.
- Marco: direcao clara, contexto de negocio
- Daniel: passos numerados, criterio de pronto com checkbox, prazos curtos
- Gabriel: specs tecnicas de producao
**Por que:** Cada pessoa precisa de tasks diferentes. Hoje e manual.
**Esforco:** 2-3h
**Status:** futuro

### 5.2 `/pique:financeiro` — Controle mensal
**O que:** Fluxo de fechamento financeiro: pro-labore, custos, metricas de clientes, fluxo de caixa.
**Por que:** Hoje e manual e atrasado. Henrique recalculou metricas do Beco inteiro em 31/03.
**Esforco:** 3-4h
**Status:** futuro

### 5.3 `/pique:onboarding` — Nova pessoa
**O que:** Configura ClickUp, cria plugin-pique.local.md, explica rituais, primeiras tasks.
**Por que:** Daniel entrou e foi tudo manual.
**Esforco:** 2h
**Status:** futuro

---

## Como usar este roadmap

1. **Antes de implementar:** leia o item aqui, entenda o "por que" e o fluxo
2. **Ao implementar:** atualize status pra "fazendo" e depois "feito" com data
3. **Ideia nova:** adicione na onda adequada (ou crie onda nova se nao encaixar)
4. **Review semanal:** verificar se algum item deveria subir de prioridade
5. **Conexao Yabadoo:** toda melhoria implementada, registrar como feature validada no roadmap do Yabadoo
