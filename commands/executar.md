---
description: Executa a proxima task pendente de um roadmap _tasks-*.md ativo no cerebro. Descobre, carrega contexto, entra em plan mode, atualiza ledger ao final.
model: sonnet
---

Executa a proxima task pendente de um roadmap `_tasks-*.md` ativo no cerebro. Execute este fluxo EXATAMENTE, sem pular etapas.

**Filosofia do command:**

Em projetos nao-triviais que duram mais de 1 sessao, o Henrique mantem ledgers persistentes `_tasks-{escopo}-{data}.md` dentro da pasta do projeto/area (memoria `feedback_tasks_md_padrao`). Cada ledger e o roadmap de execucao — sequencia logica de A→B que sobrevive entre chats. O `/pique:executar` e a porta de entrada de todo chat de execucao: descobre o que ta ativo, oferece a proxima task, carrega contexto critico, entra em plan mode, executa com aprovacao, atualiza o ledger no fim.

Por que isso existe: sem esse command, todo chat comeca do zero — o Henrique tem que lembrar onde parou, abrir o `_tasks.md` na mao, escolher a task, recarregar contexto. Esse ritual pertence a uma skill, nao a memoria humana.

## Pre-requisitos

- O cerebro vive em `c:/Users/Henrique Carvalho/Documents/PROGRAMAS/MEU-CEREBRO/`
- Submodule `pique/` esta dentro do cerebro
- Ledgers seguem o padrao da memoria `feedback_tasks_md_padrao` (cabecalho com Outcome/Status/Proximo passo + tasks com `[ ]/[~]/[x]/[-]/[!]`)

## Regras criticas (leia antes de comecar)

- **Auditar antes de mexer:** todo `_tasks.md` referenciado, todo arquivo critico — Read antes de planejar (regra global "Auditar Estado Real Antes de Reorganizar" do CLAUDE.md)
- **Plan mode obrigatorio:** nenhuma edicao de arquivo de codigo/projeto antes do `ExitPlanMode` aprovado pelo usuario na Fase 3
- **Modo consultivo se ambiguo:** se a task do `_tasks.md` esta vaga, ou um arquivo critico nao existe mais, ou o estado real diverge do que a task assume — parar e perguntar, nao adivinhar
- **ClickUp via agent:** se a task envolve ClickUp, delegar pro agent `gestor-clickup` no plan, NAO chamar `mcp__pique-clickup__*` direto (memoria `feedback_clickup_gotchas`)
- **Edicao do ledger so com aprovacao:** Fase 7 mostra o diff antes de qualquer Edit no `_tasks.md`
- **NAO chamar `/pique:encerrar` automaticamente:** sugerir no output final, mas o usuario decide

---

## Fase 0 — Descoberta (automatico, NAO pergunte nada)

### 0.1 Glob

Rode Glob com o pattern:
```
c:/Users/Henrique Carvalho/Documents/PROGRAMAS/MEU-CEREBRO/**/_tasks-*.md
```

O glob ja cobre `projetos/`, `areas/`, `conhecimento/`, `sessoes/` E o submodule `pique/` automaticamente.

### 0.2 Parsear cabecalho de cada match

Pra cada arquivo encontrado, leia as primeiras ~30 linhas e extraia:

- `**Outcome:**` — texto da linha
- `**Status:**` — `em-execucao` | `pausado` | `concluido`
- `**Proximo passo:**` — texto (geralmente ID + titulo curto, ex: `T1.1 — Refatorar /social-triagem`)
- `**Iniciado:**` — opcional, pra ordenar por antiguidade quando ha varios

### 0.3 Filtrar e classificar

- **Ativos:** `Status: em-execucao` — entram no menu da Fase 1
- **Pausados** e **concluidos:** so contagem (mostrar no rodape do menu, sem listar)

Se algum arquivo nao tiver cabecalho parseavel (formato fora do padrao), reportar como **malformado** e ainda assim listar pra Henrique decidir.

---

## Fase 1 — Apresentar menu

Tres caminhos baseados na contagem de ativos.

### Caso A — zero ledgers ativos

Saida:
```
Nenhum roadmap ativo agora.

- Pausados: N
- Concluidos: M
- Malformados: K (se houver)

Quer iniciar um novo roadmap? Use o template em feedback_tasks_md_padrao
ou abra um chat de planejamento.
```

ENCERRA o command. Nao seguir pra Fase 2.

### Caso B — exatamente 1 ledger ativo

Vai direto pra esse ledger. Mostra o cabecalho:
```
Roadmap ativo: [pasta-do-projeto] / [nome-do-arquivo]

**Outcome:** [...]
**Proximo passo (no topo):** [T*.* — titulo curto]

Pausados: N | Concluidos: M

Vou seguir o "Proximo passo" do topo, ou voce quer escolher outra task pendente desse arquivo?
```

ESPERE resposta.

- Se "segue" / "ok" / "vai" → Fase 2 com a task indicada no `Proximo passo`
- Se "outra" / "deixa eu ver" → leia o `_tasks.md` inteiro, extraia TODAS as tasks com `[ ]` (pendentes) na ordem do arquivo, apresente como lista numerada com `T*.* — titulo`. Espere o usuario escolher por numero ou ID. Depois Fase 2.

### Caso C — 2+ ledgers ativos

Saida:
```
Roadmaps ativos:

1. [pasta] / nome-do-arquivo → T*.* [titulo curto do proximo passo]
   Outcome: [1 linha]

2. [pasta] / nome-do-arquivo → T*.* [titulo curto do proximo passo]
   Outcome: [1 linha]

3. ...

Pausados: N | Concluidos: M

Qual rodar? (numero ou nome curto)
```

ESPERE resposta. Apos escolha do ledger, mesma sub-pergunta do Caso B (proximo passo do topo ou outra task pendente).

---

## Fase 2 — Carregar contexto da task selecionada

### 2.1 Ler o ledger inteiro

Read no `_tasks-*.md` selecionado (sem limit). Localize o bloco da task escolhida pelo header `#### [ ] T*.* — [titulo]`.

### 2.2 Extrair os bullets da task

Tasks no padrao tem bullets como:
- `**Arquivo:** ...` ou `**Arquivo novo:** ...`
- `**Estado atual:** ...`
- `**O que fazer:** ...`
- `**Criterio de pronto:** ...`
- `**Reusa padroes de:** ...`
- `**Multi-perfil:** ...` (quando aplicavel)
- `**Validacao:** ...`

Capture todos os que existirem. Se a task tem subitens (1., 2., 3.), capture na ordem.

### 2.3 Identificar arquivos criticos

Combine:
- Caminhos mencionados nos bullets `**Arquivo:**`, `**Arquivo novo:**`, `**Reusa padroes de:**` da task
- Entradas relevantes da secao `## Arquivos criticos referenciados` no fim do ledger (filtrar so as relacionadas a fase atual)
- Princípios `P1/P2/P3...` da secao `## Principios arquiteturais` se existir — eles aplicam a TODAS as fases

### 2.4 Auditar estado real

Aplica regra global do CLAUDE.md ("Auditar Estado Real Antes de Reorganizar"):

- Read em CADA arquivo critico que sera tocado (se for grande, ler so a parte relevante)
- Se a task envolve ClickUp: NAO chamar MCP direto agora — anotar mentalmente quais operacoes ClickUp vao acontecer pra colocar no plan da Fase 3
- Se a task pede pra **criar** arquivo novo e ele JA EXISTE: parar, mostrar pro Henrique, perguntar se foi criado fora do fluxo ou se e algo de outra coisa
- Se a task pede pra **editar** arquivo que NAO EXISTE: parar, perguntar se foi renomeado/movido

### 2.5 Apresentar briefing

Saida:
```
## Task: T*.* — [titulo completo]

**Roadmap:** [nome do ledger]
**Fase:** [nome da fase no ledger, ex: "Fase 1 — Maturacao (o gap critico)"]

**O que fazer:** [resumo de 2-3 linhas — sintetize os bullets, nao copie cru]

**Arquivos que serao tocados:**
- caminho1 — [estado atual em 1 linha]
- caminho2 — [estado atual em 1 linha]

**Criterio de pronto:** [transcrito do _tasks.md]

**Princípios herdados do roadmap:**
- P1: [...]
- P2: [...]

**Operacoes ClickUp previstas:** [se houver — descrever em 1-2 linhas, sera delegado ao gestor-clickup]

Pronto pra entrar em plan mode com esse escopo. Vou chamar EnterPlanMode.
```

NAO espere confirmacao verbal aqui — siga direto pra Fase 3 chamando `EnterPlanMode`.

---

## Fase 3 — Plan mode

Chame `EnterPlanMode`. Dentro do plan mode, monte o plano com:

1. **Passos concretos** (max 5-7) pra cumprir o criterio de pronto da task. Cada passo deve ser executavel sem ambiguidade.
2. **Arquivos exatos** a editar/criar, com caminhos absolutos
3. **Operacoes ClickUp/MCP** necessarias, com agente delegado (`gestor-clickup` por padrao)
4. **Verificacao end-to-end** — como validar que a task ficou pronta de verdade (rodar a skill nova, conferir Read no arquivo:linha, etc — espelhe o `**Criterio de pronto:**` da task)
5. **Riscos/decisoes pendentes** — qualquer coisa que ainda esta vaga e pode derrapar a execucao

Chame `ExitPlanMode` e ESPERE aprovacao explicita do usuario antes de qualquer edicao.

---

## Fase 4 — Marcar task como em andamento

Apos plano aprovado, faca UMA edicao no `_tasks-*.md` antes de comecar a executar:

1. Trocar o checkbox da task escolhida: `#### [ ] T*.*` → `#### [~] T*.*`
2. Se essa task era a do `**Proximo passo:**` no topo, atualize a linha pra refletir `[~]` (ex: `**Proximo passo:** T1.1 — Refatorar /social-triagem (em andamento)`)

Edicao minima, reversivel. Sinaliza pra qualquer chat paralelo que algo ta acontecendo nessa task.

NAO commitar agora — o ledger so vira commit junto com o resto do trabalho da task no fim.

---

## Fase 5 — Execucao

Execute o plano aprovado seguindo o fluxo normal do Claude Code com as ferramentas disponiveis.

Respeite SEMPRE:

- Princípios `P1/P2/P3...` do roadmap (se existirem na secao `## Principios arquiteturais` do ledger)
- Memorias relevantes do contexto. As que mais aparecem em execucao de tasks de plugin/cerebro:
  - `feedback_editar_plugin_no_repo` — editar plugin SEMPRE no repo fonte (`C:\...\PROGRAMAS\plugin-*\`), nunca em marketplace cache
  - `feedback_clickup_gotchas` — ClickUp via `gestor-clickup`, plano Pro, custom fields no update
  - `feedback_self_improving_skills` — toda skill termina com auto-avaliacao
- Regra global de modo consultivo: se durante a execucao surgir ambiguidade real (nao apenas friccao), pare e pergunte

---

## Fase 6 — Validacao

Antes de marcar a task como concluida, valide contra o `**Criterio de pronto:**` original da task:

- **Se pede "rodar a skill nova de verdade":** rodar (ou, se nao for possivel rodar nesse chat, listar como pendencia de validacao manual no output da Fase 8)
- **Se pede "Read no arquivo:linha confere o trecho":** fazer o Read e mostrar o trecho conferido
- **Se pede comportamento end-to-end mais complexo:** rodar a sequencia minima viavel e reportar resultado

**Se a validacao FALHAR:** NAO marque `[x]`. Decida entre:
- `[-]` (bloqueada) — algo externo trava (ex: ClickUp MCP off, permissao, dependencia humana)
- volta pra `[~]` (em andamento) — falta trabalho ainda, vai continuar em outro chat

Em ambos os casos, relate claramente o que ficou faltando.

---

## Fase 7 — Atualizar o ledger (com aprovacao)

Proponha um diff em ATE 4 partes do `_tasks-*.md`:

### 7.1 Status da task

- `[~]` → `[x]` se concluida
- `[~]` → `[-]` se bloqueada
- `[~]` → `[ ]` se decidiu nao fazer e quer voltar pra pendente
- `[~]` → `[!]` se decidiu skippar de vez

### 7.2 Proximo passo (no topo)

Atualize a linha `**Proximo passo:**` pra apontar pra primeira task pendente `[ ]` apos a que acabou de fechar (ordem do arquivo). Se nao houver mais tasks pendentes, escreva: `**Proximo passo:** _(roadmap completo — verificar se vira `concluido`)_`.

### 7.3 Entrada nova em `## Historico de chats`

Adicionar no FINAL da lista, no formato ja usado no ledger atual:
```
- **YYYY-MM-DD** — chat T*.* ([fase X completa | parcial]). [1-2 linhas do que aconteceu, decisoes nao obvias, arquivos chave]. [pendencias se houver, marcar com **precisa ...**]. Proxima sessao: T*.*.
```

A data e a de hoje. Use o formato exato (negrito na data, travessao, T-id no comeco).

### 7.4 Aprendizados (opcional)

Se a execucao gerou aprendizado nao obvio (algo que vale pra outras tasks do mesmo roadmap, nao um detalhe tatico), proponha adicionar em `## Aprendizados`. Se a secao tiver `_(vazio — preencher conforme rodar as tasks)_`, substitua pela primeira entrada.

### 7.5 Apresentar diff e pedir aprovacao

Mostre o diff completo das 3-4 partes:
```
## Diff proposto pro ledger

**[caminho do _tasks.md]**

1. Status da task T*.*: `[~]` → `[x]`

2. Proximo passo (linha N do topo):
   - Antes: **Proximo passo:** T*.* (em andamento)
   - Depois: **Proximo passo:** T*.* — [titulo]

3. Historico de chats (nova entrada):
   `- **YYYY-MM-DD** — chat T*.* (fase X completa). [...]`

4. Aprendizados (opcional): [...]

Aplica o diff?
```

ESPERE aprovacao. Se Henrique editar o texto do historico/aprendizados, aceitar. So entao rodar Edit no arquivo.

---

## Fase 8 — Encerramento

Output final:

```
## /pique:executar — concluido

**Roadmap:** [nome curto]
**Task:** T*.* — [titulo] → [novo status]
**Proximo passo do roadmap agora:** T*.*

**Pendencias deste chat:**
- [se houver, ex: "rodar a skill nova num chat fresh pra validar end-to-end"]
- [ou "nenhuma"]

**Sugestao:** rode `/pique:encerrar` se quiser distribuir contexto extra do chat (decisoes nao registradas, sessoes, novas tasks ClickUp, eventos calendar, feedback pra memoria).
```

NAO chamar `/pique:encerrar` automaticamente — o usuario decide.

---

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:

1. A descoberta da Fase 0 achou todos os ledgers ativos? Algum falso negativo (arquivo `_tasks-*` nao reconhecido por formato fora do padrao)?
2. O parsing do cabecalho extraiu Outcome/Status/Proximo passo corretamente em todos?
3. A auditoria de estado real (Fase 2.4) evitou alguma surpresa que quebraria a execucao?
4. O plan mode foi rico o suficiente pra executar sem ajustes a mao no meio do caminho?
5. O diff final do `_tasks.md` (Fase 7) ficou consistente com o estilo do arquivo (negrito, travessao, ordem)?
6. A task realmente cumpriu o `**Criterio de pronto:**` original, ou foi marcada `[x]` por benevolencia?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
```

2. Anexe em `pique/infra/melhorias-plugin.md` no formato:
```
## YYYY-MM-DD — executar (usuario)
- [melhoria 1]
- [melhoria 2]
```

Se nao identificar nada concreto, nao mostre nada. NAO melhore por melhorar (memoria `feedback_self_improving_skills`).
