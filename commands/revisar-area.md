---
description: Revisa + consolida tasks de uma area ja desenhada de um cliente. Cruza cards do Catalogo de Solucoes com dossies/analises do cerebro + auditoria recente + MVPs finalizados. Discute iterativamente, movimenta tasks (comentarios, status), e gera dossie consolidado interno que serve pra reuniao interna H+M e depois pra apresentacao comercial. Complementar ao `/pique:desenhar-area` (aquele MONTA, este REVISA). Execute este fluxo EXATAMENTE, sem pular etapas.
---

Orquestra revisao profunda de uma area ja desenhada: cruza o que o Arthur (ou outro responsavel tecnico) montou no Catalogo com todo o contexto acumulado no cerebro + auditorias externas + MVPs finalizados, discute iterativamente com o Henrique, movimenta as tasks conforme decisoes emergem, e gera um dossie consolidado interno. Replica o fluxo que produziu o dossie-financeiro-06 do Beco (20/04/2026). Execute este fluxo EXATAMENTE, sem pular etapas.

## Ferramentas

- **Exploracao do cerebro, ClickUp, repos paralelos**: delegar aos Explore agents (Sonnet, paralelos)
- **TODAS as operacoes ClickUp de escrita** (comentarios, mudanca de status, update de campos): delegar ao agent `gestor-clickup`
- **Leitura direta de arquivos criticos**: Read (dossies da area, auditoria, CLAUDE.md do cliente)
- **Geracao do dossie**: Write (arquivo final no cerebro)
- **Modelo desta skill**: Opus (orquestracao + sintese final). Agents delegados usam Sonnet.

> **IMPORTANTE**: Se o MCP `pique-clickup` estiver desativado, avise: "MCP pique-clickup desativado. Ative em VS Code → MCP Servers → pique-clickup → Enable. Depois me chame de novo." NAO tente continuar sem ClickUp.

## Configuracao e fontes de regras

- **Catalogo de Solucoes**: list `901326825973` (folder Beco - Consultoria, Space Pique Digital) — **por enquanto unica list-destino**. Se o cliente for outro, perguntar ao usuario em Fase 0
- **Lists MVP / Solucoes**: verificar no ClickUp do cliente qual list hospeda MVPs finalizados (tipicamente list `MVP` no mesmo folder)
- **Estrutura do dossie consolidado**: 10 blocos fixos (ver Fase 4). Conteudo varia por area; estrutura nao
- **Lente do Bloco 6**: variavel por area. Definir junto com usuario na Fase 2
- **Regras globais Pique**: `pique/CLAUDE.md` (convencao de arquivos, statuses, verbos de task)

**Antes de comecar a Fase 1, leia obrigatoriamente:** o dossie-template de referencia do financeiro (`pique/clientes/beco/entregas/dossie-financeiro-06-consolidado-onda1.md`). E a fonte viva de como a estrutura de 10 blocos se materializa.

---

## Regras duras (checklist aplicado em cada fase)

### Default consultivo
- [ ] NAO editar arquivo nem criar task sem pedido explicito do usuario
- [ ] Max 3-5 perguntas cirurgicas por turno (nao survey longo). Memory `feedback_perguntas_cirurgicas`
- [ ] Pre-preencher respostas com contexto real em vez de perguntas abertas. Memory `feedback_respostas_preenchidas`
- [ ] Discutir antes de gerar entregaveis densos. Memory `feedback_discutir_antes_gerar`

### Descoberta antes de agir
- [ ] Auditar estado REAL do cerebro + ClickUp antes de propor (CLAUDE.md global). Memory `auditar-estado-real`
- [ ] Buscar **TODOS** os cards da area, inclusive em lists MVP/Solucoes (nao so Catalogo) — MVPs ja finalizados mudam a leitura da precificacao
- [ ] Buscar auditorias externas (repo `pique-consultoria-hub` + Drive do cliente) — podem ja ter cruzamento feito de oportunidades vs cards
- [ ] Validar numeros citados — comentarios do Arthur/tecnico podem ter flag de "sem lastro"; captar e repassar ao usuario

### Ao mexer em tasks durante a discussao
- [ ] Antes de mudar status de task, confirmar com o usuario explicitamente. Memory `feedback_clickup_gotchas`
- [ ] Comentarios no ClickUp seguem regra: texto literal aprovado pelo usuario, sem emoji, em PT-BR
- [ ] Se mover task pra outra list/status, auditar com `get_task` apos. Memory `feedback_auditar_pos_update_mcp`

### Geracao do dossie
- [ ] **Estrutura dos 10 blocos e FIXA.** Nao inventar secoes extras.
- [ ] **Bloco 6 (lente estrategica) e variavel** — definido na Fase 2 junto com usuario
- [ ] Numeros no dossie sempre com fonte (dossie X linha Y, card Z custom field W). Se estimativa, marcar "estimativa — validar com fonte"
- [ ] Narrativa do cliente em PT-BR natural, sem jargao tecnico desnecessario
- [ ] Links pras tasks ClickUp sempre formatados como `[86xxx](https://app.clickup.com/t/86xxx)`

### Checkpoints obrigatorios (NUNCA pular)
- [ ] Pausar apos Fase 2 (Mapa) — usuario valida mapa + aprova lente do Bloco 6 + sinaliza decisoes de pre-discussao
- [ ] Discussao iterativa na Fase 3 (loop) — nao gera dossie sem sinal claro
- [ ] Pausar apos Fase 4 (Geracao) — usuario le, lista correcoes, skill aplica
- [ ] Pausar apos Fase 5 (Validacao pos-correcoes) — usuario confirma fechamento
- [ ] Auto-avaliacao SEMPRE no fim, mesmo se tudo correu bem

---

## Fase 0: Input

Antes de comecar, definir com o usuario:

1. **Qual cliente?** Default provavel: `beco`. Se outro, validar que existe `pique/clientes/<cliente>/`.
2. **Qual area?** Opcoes canonicas do Catalogo: `Financeiro`, `Compras`, `Gestao Lojas`, `Supervisao`, `RH`, `Marketing`. Se usuario falar "produto" → mapear pra `Compras`.
3. **Ja foi rodado `/pique:desenhar-area` antes pra essa area?** Se usuario nao sabe, Fase 1 detecta. Se a resposta for "nao, nunca foi desenhada" → abortar com sugestao de rodar `/pique:desenhar-area` primeiro.

Se faltar `cliente` ou `area`, perguntar via AskUserQuestion. Se usuario nao responder em 2 tentativas, abortar.

### Plan mode awareness

Se o usuario ja esta em **plan mode** ao acionar a skill:
- Fase 2 (Mapa) ainda roda — e leitura + apresentacao, permitida em plan
- Fase 3 (Loop iterativo) roda — leitura + conversa permitidas
- Fases 4-6 (Geracao + Validacao + _mapa.md) pedem `ExitPlanMode` e aprovacao do plan antes de executar

---

## Fase 1: Carregamento (Explore paralelos, PARA ao final)

**Objetivo:** carregar TODO o contexto pra o Henrique ter visao completa antes de decidir a lente estrategica.

Lancar **3 Explore agents em paralelo** (Sonnet):

### Agent 1 — Cards da area no ClickUp (TODAS as lists do folder do cliente)

Buscar em 3 lists:
- **Catalogo de Solucoes** (`901326825973` para Beco) — cards em todos os statuses, filtrando `Area = <area>`
- **MVP** — cards ja finalizados da area (fundacao ja construida que muda a leitura da precificacao)
- **Solucoes** (`901326725724` para Beco) — tasks operacionais/followup que referenciam a area

Pra cada card: ID, URL, nome, status, assignees, due, custom fields preenchidos (especialmente Impacto/Esforco/Economia/Preco/Recorrencia/Horas/Modelo/Usuario-chave/Revisao), descricao completa, **todos os comentarios** (literal, com autor e timestamp), subtasks, tags, dependencias.

Foco especial em:
- Cards finalizados (MVPs) — sao fundacao que nao entra na precificacao de Onda
- Cards com campos vazios — potenciais gaps
- Cards com comentarios flaggando "sem lastro", "validar", "pendente" — precisam atencao
- Cards com Revisao X = true ja marcado por outro socio — reduzir atrito

### Agent 2 — Material do cliente no cerebro

Buscar em `pique/clientes/<cliente>/`:
- **Dossies** da area (`entregas/dossie-<area>-*.md`)
- **Solucoes** (`solucoes/<N>-<area>-*.md`)
- **Diagnostico** (`diagnostico/financeiro/`, `diagnostico/produto/`, etc)
- **Analises** (`cliente/analise-v2/*.md` se existir)
- **Sessoes** recentes (ultimos 60 dias) com tema da area
- **CLAUDE.md** do cliente (decisoes arquiteturais, restricoes, contratos)
- **_mapa.md** do cliente

Pra cada arquivo: path, titulo, status (ativo/arquivado), 2-3 linhas de resumo, data de criacao/atualizacao.

### Agent 3 — Auditorias externas + repos paralelos

Buscar em:
- **Repo `pique-consultoria-hub`** (`c:/Users/Henrique Carvalho/Documents/PROGRAMAS/pique-consultoria-hub/clientes/<cliente>/docs/auditoria/`) — auditorias cruzadas oportunidade-vs-card feitas recentemente. **Alto valor** pra identificar gaps
- **Drive `G:/Drives compartilhados/Pique Digital/Clientes/<cliente>/`** — apresentacoes, PDFs, planilhas que podem ter contexto novo
- **BRAINSTORM-TEMPLATE/docs/sessoes/** — sessoes de brainstorm nao migradas pro cerebro
- **Repos antigos** no PROGRAMAS/ com docs .md do cliente

Pra cada material relevante: path absoluto + 2-3 linhas do que contem + relevancia pra area.

### Consolidar e PARAR

NAO apresentar ainda. A apresentacao acontece na Fase 2 apos cruzar tudo.

---

## Fase 2: Mapa consolidado (PARA E ESPERA)

**Objetivo:** dar ao usuario visao 360 + capturar decisoes iniciais antes do loop.

Cruzar os 3 agents + construir mapa em 4 partes:

### Parte 1 — Mapa das tasks (tabela)

| # | Task | Status | List | Impacto | Esforco | Preco | Recorr | Horas | Economia/ano | Flag |

Onde Flag marca: campo vazio critico (Economia, Modelo), comentario de "sem lastro", ROI negativo, dependencia travando, etc. Cards em list MVP ja marcados como `fundacao`.

### Parte 2 — Material no cerebro

- [N] dossies existentes: [lista com paths]
- [N] analises: [lista]
- [N] sessoes recentes: [lista com datas]
- Auditorias externas: [paths se houver]

### Parte 3 — Gaps + flags identificados

- Cards com campos vazios (lista com IDs)
- Numeros flagados sem lastro (lista com comentario literal do tecnico)
- Gaps identificados na auditoria externa (se houver)
- MVPs finalizados sem comentario de entrega documentado (alerta de producao)
- Dependencias travando tasks

### Parte 4 — Perguntas cirurgicas (3-5 max)

1. **Lente do Bloco 6** — apresentar 1-2 sugestoes baseadas na area + perguntar ao usuario. Exemplos por area:
   - Financeiro: "pacote vs a la carte + pricing triangulado"
   - Compras: "integracao Supabase vs planilhas + CMV atacavel"
   - Gestao Lojas: "padronizacao vs autonomia loja + SPOF Jezi"
   - Supervisao: "bombeiro Edith vs gestor estrategico"
   - RH: "automatizar vs contratar + criticalidade por papel"
   - Marketing: "producao solo vs time + ROI conteudo"
2. Algum material nao capturado que deve entrar?
3. Alguma decisao ja tomada em chat paralelo que eu preciso absorver?
4. Algum card especifico que eu devo puxar primeiro na discussao?
5. Algum gap da auditoria que eu devo desconsiderar (fora de escopo consciente)?

**Formato da apresentacao:**

```
## Revisao — <cliente> / <area>

### Tasks no ClickUp ([N] total)
[tabela completa]

### Material no cerebro
[lista com paths]

### Gaps + flags
[lista]

### Proxima etapa
Vou entrar em loop de discussao com voce — task por task, decisao por decisao.

Antes, preciso de:
1. [pergunta 1]
2. [pergunta 2]
3. ...
```

**PARE e espere respostas.**

---

## Fase 3: Loop de revisao iterativa (modo default)

Entrar em modo conversa. Cobrir tasks uma por uma (ou em bloco por tema), sempre buscando:

### O que discutir por task

- **Visao do usuario** — o que ele entende da task, o que mudaria, se faz sentido como esta
- **Contexto adicional** — usuario pode ter info nova que nao esta no ClickUp nem no cerebro
- **Como sera vendido** — pacote, avulso, pre-requisito, standalone
- **Correcoes de campos** — preencher campo vazio, corrigir Area/Tipo que esta errado, adicionar Economia/Preco/Recorrencia/Modelo
- **Comentarios a adicionar** — decisoes importantes vao como comentario na task pra Arthur/Marco verem
- **Movimentacao de status** — `revisar` → `preparar pauta` quando task esta fechada; `revisar` → `spec` quando precisa de trabalho tecnico antes

### Regras do loop

- Max 3-5 perguntas cirurgicas por turno
- Pre-preencher respostas com contexto real — nao perguntar o que ja esta no card
- Provocar pontos fracos das ideias do usuario. Memory `feedback_argumentar_nao_concordar`
- Nunca editar task/campo sem aprovacao explicita
- Ao adicionar comentario, colar o texto literal e esperar OK do usuario antes de mandar pro agent

### Operacoes permitidas no loop (via gestor-clickup)

- Adicionar comentario em task
- Atualizar custom fields de task
- Mover status de task
- Criar task nova (se decisao for criar gap identificado)

### Sinais de sair do loop

Usuario sinaliza com: "gera o dossie", "vamos consolidar", "finaliza", "pronto pro dossie", ou equivalente.

Se discussao passar de 30min sem convergencia, oferecer: "quer que eu gere um rascunho do dossie com o que ja discutimos, e a gente itera em cima?". Aceitar so com sim explicito.

---

## Fase 4: Geracao do dossie (PARA E ESPERA)

### Path + numeracao

**Caminho base:** `pique/clientes/<cliente>/entregas/dossie-<area>-<NN>-consolidado<-suffix>.md`

Numeracao:
- Se a area ja tem serie de dossies (ex: dossie-financeiro-01 a 05), continua a numeracao (no Beco financeiro ficou 06)
- Se nao tem serie, comeca em `01`
- Suffix opcional: `-onda1`, `-onda2`, etc — quando fizer sentido amarrar com a estrategia de ondas

### Estrutura fixa — 10 blocos

Usar o dossie-financeiro-06 do Beco como gabarito de comprimento e densidade (~500 linhas max).

```
# Dossie <Area> <Cliente> — Parte <NN>: Consolidado <Contexto>

**Criado:** YYYY-MM-DD
**Status:** ativo
**Tags:** pique-digital, <cliente>, <area>, dossie, consolidado

---

## O Que Voce Vai Ler
[2-3 paragrafos. Proposito interno. Nao repete o que ja existe, cruza com lente nova]

---

## Bloco 1 — Resumo Executivo

### O numero que importa
[numero-chave da area com fontes]

### As N solucoes em 1 frase cada
[tabela sucinta]

### A pergunta central
[a decisao que este dossie suporta]

### Fundacao pronta / status da base arquitetural
[se houver MVPs finalizados, listar aqui com link ClickUp + confirmacao de que estao embutidos na consultoria ou precificados separado]

---

## Bloco 2 — Contexto da Area em N Numeros
[tabela de 5-7 numeros com fonte + leitura curta]

---

## Bloco 3 — Fluxo Atual (ANTES)

### Personagens + dores medidas
[tabela pessoa x funcao x dor x SPOF]

### Caminho dos dados / diagrama ASCII
[texto estruturado ou ASCII simples]

### Custo monetizado
[se mensuravel]

---

## Bloco 4 — Arquitetura Proposta (DEPOIS)
[decisoes arquiteturais + 3 camadas quando aplicavel + o que Pique cuida vs nao cuida]

---

## Bloco 5 — As N Solucoes Sob Lente Unificada

### Tabela-mapa
[todas as tasks com custom fields, fundacao como linha no topo se aplicavel]

### Narrativa curta por solucao
[3-4 linhas por task: dor que resolve, pessoa que libera, onde engancha]

---

## Bloco 6 — Analise estrategica: <Lente definida na Fase 2>

### Argumentos pro <opcao A>
### Argumentos pro <opcao B>
### Recomendacao tentativa
[a lente varia por area: pacote vs a la carte, integrar vs standalone, automatizar vs contratar, etc]

---

## Bloco 7 — Precificacao triangulada
### 7.1 Valores do tecnico (soma crua)
### 7.2 Custo Pique
### 7.3 Valor pro cliente
### 7.4 Custos que o cliente paga direto (licencas externas)
### 7.5 Cenarios de pacote (3 cenarios tipicos: Premium, Standard, Agressivo)
### 7.6 Pricing de tasks standalone (se houver — ex: IAMPA no financeiro)

---

## Bloco 8 — Questoes Abertas + Flags

### Alertas que podem bloquear a Onda
[ex: MVPs sem comentario de entrega, rollout incompleto]

### Numeros flagados pelo tecnico
[literal dos comentarios]

### Campos vazios no ClickUp
[lista]

### Gaps estruturais (pedem decisao antes da apresentacao)
[custo-hora, validar premissa, etc]

---

## Bloco 9 — Pauta da Reuniao Interna H+M

[tabela de 6-7 blocos, total 45min cronometrados]

| Tempo | Bloco | Decisao a sair |

---

## Bloco 10 — Relacionado
### Dossies anteriores
### Analises fonte
### Specs tecnicas
### Contexto base
### Tasks ClickUp — cards da area
### Tasks ClickUp — MVPs fundacionais (se aplicavel)
### Documento-fonte da revisao (auditorias, etc)
### Proximos artefatos
```

### Apos escrever

Contar linhas com `wc -l`. Apresentar ao usuario:

```
Dossie criado em [path]. [N] linhas.

Estrutura: 10 blocos conforme padrao.
Lente aplicada no Bloco 6: [lente escolhida na Fase 2]
MVPs fundacionais incluidos: [lista de IDs com status]

Abra o arquivo e me diga o que precisa ajustar.
```

**PARE e espere correcoes.**

---

## Fase 5: Validacao + correcoes iterativas

Usuario le o dossie e aponta correcoes. Aplicar via **Edit**, nao reescrever inteiro. Regras:

- Cada correcao = 1 Edit
- Manter `replace_all=false` (precisao)
- Se mudanca propagar pra varios blocos, aplicar em ordem e validar consistencia no fim
- Apos aplicar, reportar o que mudou em 1-2 linhas por edit

Se usuario marcar "ok, ta fechado", avancar pra Fase 6.

---

## Fase 6: Atualizar _mapa.md + Encerramento ClickUp

### 6.1 _mapa.md

Adicionar entrada pro dossie novo em `pique/clientes/<cliente>/_mapa.md` secao "Entregas — Dossies":

```
- `entregas/dossie-<area>-NN-consolidado.md` — Parte NN: [descricao 1 linha com data] [ativo]
```

Se a skill gerou tambem um artefato auxiliar (sumario, pauta separada), adicionar tambem.

### 6.2 Movimentacao de tasks final (se decisoes da Fase 3 pediram)

Confirmar com usuario: "Aplico as movimentacoes de status/comentarios que decidimos na discussao?"

Se sim: delegar ao `gestor-clickup` em lote:
- Comentarios aprovados
- Mudancas de status aprovadas
- Atualizacoes de custom field aprovadas

Reportar URLs + IDs + status final de cada task movida.

---

## Fase 7: Encerramento + auto-avaliacao

### Resumo final

```
## Revisao <Area> / <Cliente> — RESUMO

**Tasks revisadas:** [N] cards ([IDs])
**MVPs fundacionais identificados:** [N] ([IDs + status])
**Dossie gerado:** [path + N linhas]
**Lente Bloco 6:** [lente aplicada]
**Comentarios adicionados:** [N]
**Tasks movidas de status:** [N ([de X pra Y])]
**_mapa.md atualizado:** [sim/nao]

**Proximo passo sugerido:**
- [se faltar area: rodar /pique:revisar-area <area-seguinte>]
- [se todas areas prontas: consolidacao cross-area pra reuniao H+M+A]
- [perguntas abertas que precisam entrar na proxima conversa]
```

### Auto-avaliacao (executar sempre ao final)

Avalie a execucao:

1. **Fase 1 pegou tudo?** Usuario precisou apontar material que a skill nao achou (repo paralelo, auditoria externa, MVP em list diferente)? Se sim, expandir escopo de busca na Fase 1
2. **Lente do Bloco 6** ficou clara na Fase 2 ou so apareceu no meio do loop? Se tarde, adicionar mais sugestoes de lente por area
3. **Loop da Fase 3** teve convergencia? Quantos turnos ate usuario pedir o dossie? >15 turnos = sinal de que Fase 2 falhou em extrair decisoes iniciais
4. **Perguntas cirurgicas** foram cirurgicas (3-5) ou viraram survey?
5. **Dossie gerado precisou de correcao grande** (reescrita de bloco inteiro)? Se sim, identificar qual bloco e refinar template
6. **Correcoes foram pontuais ou estruturais?** Pontuais = normal; estruturais = regras/template precisam ajuste
7. **Movimentacao de tasks** quebrou algo no ClickUp (status invalido, campo rejeitado)? Se sim, anotar gotcha
8. **Cruzamento com MVPs finalizados** funcionou? Se skill tratou MVP como "faltando" = falha critica na Fase 1 + 5 (gap Planilha Unificada do Beco foi ponto quase perdido)

Se identificar melhorias CONCRETAS e EVIDENCIADAS:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [descricao da melhoria, com evidencia]
- [descricao da melhoria, com evidencia]

Quer que eu ajuste a skill pra prevenir proxima vez?
```

2. Se aprovado, **editar este proprio arquivo** (`${CLAUDE_PLUGIN_ROOT}/commands/revisar-area.md`) incorporando.

3. Anexar em `pique/infra/melhorias-plugin.md`:
```
## YYYY-MM-DD — revisar-area [cliente]/[area] (usuario)
- [melhoria aplicada em linhas X-Y]
```

Se nao identificar nada concreto, nao mostre nada. **NAO melhore por melhorar.**

---

## Apendice — Template da secao "Bloco 1" do dossie (referencia rapida)

Quando estiver escrevendo o Bloco 1 do dossie, reproduzir esta estrutura:

```markdown
## Bloco 1 — Resumo Executivo

### O numero que importa

**R$XXXK/ano atacavel** (fonte: <dossie>):

| Bucket | Valor/ano |
|--------|-----------|
| [bucket 1] | [valor] |
| [bucket 2] | [valor] |
| **Total** | **~R$XXX K** |

[1-2 linhas de leitura do numero]

### As N solucoes em 1 frase cada

| # | Task | O que faz |
|---|------|-----------|
| 1 | [nome + link ClickUp] | [1 linha] |
| ... |

### A pergunta central

**[A decisao que este dossie suporta].**

A recomendacao tentativa: [1-2 linhas sobre a direcao sugerida + onde detalhar — Bloco 6].

### Fundacao pronta / status da base

[Se houver MVPs finalizados: listar IDs ClickUp + confirmar embutido na consultoria ou precificado separado + ressalva sobre producao/rollout se aplicavel. Senao: omitir esta subsecao.]
```

Nota: template OBRIGATORIO pra Bloco 1. Outros blocos tambem seguem o gabarito do dossie-financeiro-06 do Beco. **Ler esse dossie antes de escrever cada bloco novo.**
