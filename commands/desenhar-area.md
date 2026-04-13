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

### Por card (mae ou subtask) a criar
- [ ] Nome comeca com verbo infinitivo (`Desenhar Plugin <Area> — F<N> <Nome>` mae; `Desenhar <Artefato>` subtask)
- [ ] Descricao em markdown com 5 secoes (Contexto / Entrega fim-a-fim OU Mecanica / Usuario / Dependencias / Referencia)
- [ ] Custom fields preenchidos: Area, Tipo, Impacto, Esforco, Onda, Usuario-chave
- [ ] Status inicial = `ideias` (default) ou `investigando` (se ja ha movimento concreto)
- [ ] Esforco P (ate 20h) / M (20-60h) / G (60h+)
- [ ] Referencias no cerebro checadas (arquivos existem?)

### Checkpoints obrigatorios (NUNCA pular)
- [ ] Pausar apos Fase 1 (Descoberta) — usuario valida maturidade
- [ ] Pausar apos Fase 5 (Empacotamento) — usuario aprova tabela
- [ ] Pausar apos Fase 7.1 (cards-mae) — antes de criar subtasks
- [ ] Pausar apos Fase 7.2 (subtasks) — antes de task pessoal
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

Consulta `narrativa-yababuss.md` e o que emergiu do Loop. Decomposicao:

1. **N fases vendaveis** (tipicamente 2-4). Cada fase = 1 card-mae. Criterio de corte: usuario diferente OU mecanica diferente OU dependencia forte.
2. **M componentes tecnicos por fase** (tipicamente 3-6). Cada componente = 1 subtask. Tipo tecnico especifico (Planilha Inteligente, Agente IA, Dashboard, Processo/Workflow, Integracao/API).
3. **Ideias de onda 5** (futuro, nao vender agora) → lista separada pra `roadmap-futuro.md`.

### Apresentar tabela ao usuario

```
## Proposta de empacotamento — Plugin <Area>

### Fases (cards-mae)
| Fase | Nome | Impacto | Esforco | Usuario-chave | Dor que resolve |
|---|---|---|---|---|---|
| F1 | Desenhar Plugin <Area> — F1 <Nome> | Alto | G | [pessoa] | [1 linha] |
| F2 | Desenhar Plugin <Area> — F2 <Nome> | Alto | G | [pessoa] | [1 linha] |
| F3 | Desenhar Plugin <Area> — F3 <Nome> | Medio | M | [pessoa] | [1 linha] |

### Componentes (subtasks por fase)

F1: [lista dos N componentes com tipo tecnico, impacto, esforco, usuario]
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

**Se algum ajuste necessario**, apresentar ao usuario antes de Fase 7. Senao, seguir.

---

## Fase 7: Criacao em checkpoint

### 7.1 Cards-mae (delegar ao gestor-clickup)

Briefing por card-mae (repetir pra cada):
- List: `901326825973`
- Name: conforme tabela Fase 5
- Description: 5 secoes (Contexto, Entrega fim-a-fim, Componentes, Usuario-chave, Dependencias, Referencia)
- Status: `ideias`
- Custom fields: Area=<area>, Tipo=`Processo/Workflow`, Onda=<onda correspondente>, Impacto, Esforco, Usuario-chave
- Obrigatorios MCP: Assignee=Rique, Priority=Low, Due=+14 dias, Estimate=60min, Work type=projeto

**Reportar IDs + URLs. PARA pra usuario validar.**

### 7.2 Subtasks (delegar ao gestor-clickup)

Pra cada subtask: mesmo padrao, com `parent=<id do card-mae>`, Tipo tecnico especifico. Status `ideias` ou `investigando`.

**Reportar IDs + URLs agrupados por mae. PARA pra usuario validar.**

### 7.3 Task pessoal de follow-up (list Solucoes)

- List: `901326725724`
- Name: `Estudar <area> <cliente> e popular cards no catalogo`
- Assignee: Rique
- Due: +5 dias uteis
- Estimate: 240min (4h)
- Priority: Normal
- Work type: projeto
- Description: referencia aos cards-mae criados + link pro plano

---

## Fase 8: Artefatos paralelos

1. **Ideias de onda 5** → adicionar em `pique/produto-yabadoo/roadmap-futuro.md` (criar se nao existe; apendar se existe)
2. **Diagnostico consolidado** → se `pique/clientes/<cliente>/diagnostico/area-<nome>.md` NAO existe, criar consolidando Fases 2-3. Se existe, sugerir atualizacao com novos insights.
3. **Sugerir sincronizar submodule** — nao commitar sozinho: `Lembra de rodar /pique:sincronizar pra enviar os docs pro repo cerebro-pique`.

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

```markdown
## Contexto
[Dor especifica com dado concreto do dossie. 3-5 linhas. Cite file_path.]

## Entrega fim-a-fim
[O que o cliente ve funcionar no dia a dia. 2-4 linhas. Sem jargao tecnico.]

## Componentes (viram subtasks)
- [Nome breve do componente 1]
- [Nome breve do componente 2]
- ...

## Usuario-chave
[Pessoa principal] ([papel]) + [pessoa secundaria] ([papel]).

## Dependencias
- [Pre-requisito tecnico ou de outra fase]
- [Lacuna externa — conversa com X, API de Y]

## Referencia
- `pique/clientes/<cliente>/...`
- `sessoes/YYYY-MM-DD-...`
```

## Apendice — Template de subtask (descricao)

```markdown
## Contexto
[2-3 linhas sobre a dor especifica que este componente resolve]

## Mecanica
[3-5 bullets end-to-end de como o componente funciona]

## Usuario
[Pessoa principal + como ela usa]

## Dependencias
- [Outros componentes (subtasks) que precisa antes]
- [Infra externa]

## Referencia
[Paths do cerebro]
```
