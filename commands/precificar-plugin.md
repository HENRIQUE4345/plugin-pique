---
description: Precifica a IMPLEMENTACAO de um plugin (conjunto de cards de uma area) pra um cliente Pique que ja passou pela consultoria. Aplica o playbook `precificar-plugin.md` com 3 lentes obrigatorias (custo Pique + valor cliente + payback) e matematica aberta. Gera 2 outputs: doc completo no hub `pique-consultoria-hub` + Bloco 7 calibrado no dossie consolidado da area no cerebro Pique. Detecta overlap entre plugins (sucessao de cards, MVPs ja pagos). Execute este fluxo EXATAMENTE, sem pular etapas.
---

Orquestra precificacao replicavel de um plugin (area + N cards) ja desenhado no Catalogo de Solucoes. Destila o que foi aprendido rodando manualmente 3 vezes (Plugin Financeiro Beco 24/04, Plugin Compras Beco 24/04, Plugin Gestao Lojas Beco 26/04). Execute este fluxo EXATAMENTE, sem pular etapas.

Esta skill **complementa** `/pique:revisar-area` (que GERA o dossie consolidado com Bloco 7 preliminar) — `precificar-plugin` substitui esse Bloco 7 preliminar pela versao calibrada e cria o doc completo no hub pra apresentacao comercial.

## Ferramentas

- **Exploracao do cerebro Pique e do hub consultoria**: delegar aos Explore agents (Sonnet, paralelos)
- **Exploracao do ClickUp** (cards do Catalogo): delegar ao agent `gestor-clickup` (Sonnet) — Explore agents NAO tem acesso ao MCP `pique-clickup`
- **Leitura direta de arquivos criticos**: Read (playbook fonte, dossies-referencia ja precificados, JSONs individuais do hub)
- **Geracao dos 2 outputs**: Write (doc novo no hub) + Edit (Bloco 7 do dossie no cerebro)
- **TODAS as operacoes ClickUp de escrita** (atualizar custom fields, comentarios, dependencias): delegar ao `gestor-clickup` — SO NA FASE 8 e SO COM AUTORIZACAO EXPLICITA
- **Modelo desta skill**: Opus (orquestracao + sintese aritmetica). Agents delegados usam Sonnet.

> **IMPORTANTE**: Se o MCP `pique-clickup` estiver desativado, avise: "MCP pique-clickup desativado. Ative em VS Code → MCP Servers → pique-clickup → Enable. Depois me chame de novo." NAO tente continuar sem ClickUp.

## Configuracao e fontes de regras

- **Playbook fonte (teoria de fundo)**: `pique/playbooks/precificar-plugin.md` — 7 fases, gabarito dos 5 blocos, formulas. Esta skill EXECUTA o que o playbook explica
- **Catalogo de Solucoes**: list `901326825973` (folder Beco — Consultoria, Space Pique Digital). Se cliente outro, perguntar em Fase 0
- **Hub consultoria**: `pique-consultoria-hub/clientes/<cliente>/` — JSONs individuais, consolidados, dossies do cliente
- **Dossies-referencia ja precificados** (formato gabarito):
  - `pique-consultoria-hub/clientes/beco/solucoes/2026-04-24-precificacao-plugin-financeiro.md` (~580 linhas)
  - `pique-consultoria-hub/clientes/beco/solucoes/2026-04-24-precificacao-plugin-compras.md`
  - `pique-consultoria-hub/clientes/beco/solucoes/2026-04-26-precificacao-plugin-gestao-lojas.md`
- **Bloco 7 calibrado de referencia (versao condensada no dossie)**:
  - `pique/clientes/beco/entregas/dossie-financeiro-06-consolidado-onda1.md` (Bloco 7 ~88 linhas)
  - `pique/clientes/beco/entregas/dossie-compras-01-consolidado.md` (Bloco 7 ~110 linhas)
  - `pique/clientes/beco/entregas/dossie-gestao-lojas-01-consolidado.md` (Bloco 7 ~120 linhas)
- **Custo-hora Arthur (custo Pique)**: `pique/financeiro/resumo-financeiro.md` (atual: R$ 25/h base 160h)
- **Tabela de salarios ja triangulada (Beco)**: secao "Premissas e fontes" do `2026-04-24-precificacao-plugin-financeiro.md`. Reusar pessoas que ja aparecem la, adicionar novas com flag ⚠ estimado

**Antes de comecar a Fase 1, leia obrigatoriamente:**
1. `pique/playbooks/precificar-plugin.md` (playbook fonte — teoria das 7 fases e gabarito de 5 blocos)
2. **Pelo menos 1** dos 3 dossies-referencia ja precificados (Financeiro recomendado por ser o primeiro e gabarito-canonico)

---

## Regras duras (checklist aplicado em cada fase)

### Default consultivo
- [ ] NAO escrever doc nem editar dossie sem checkpoint do usuario
- [ ] NAO atualizar custom fields ClickUp na Fase 8 sem autorizacao explicita
- [ ] Max 3-5 perguntas cirurgicas por turno (memory `feedback_perguntas_cirurgicas`)
- [ ] Pre-preencher respostas com contexto real em vez de perguntas abertas (memory `feedback_respostas_preenchidas`)

### Descoberta antes de calcular
- [ ] Auditar estado REAL do ClickUp + cerebro + hub ANTES de propor precificacao (CLAUDE.md global)
- [ ] Buscar TODAS as precificacoes anteriores do mesmo cliente (pra ver salarios ja confirmados, custo-hora Arthur, padroes de tiers)
- [ ] Buscar cards do Catalogo da area com `gestor-clickup` filtrando por Area=X
- [ ] Buscar JSONs individuais das pessoas-chave da area no hub `pique-consultoria-hub/clientes/<cliente>/individuais/`

### Salarios e numeros (regra dura — memory `feedback_nao_inventar_numeros`)
- [ ] **Reusar salarios ja triangulados** em precificacao anterior (Carol R$ 22/h, Nayara R$ 31/h confirmados; Felipe R$ 75/h, gerentes R$ 31/h estimados — Beco)
- [ ] **Pessoas novas da area**: estimar com flag ⚠ explicito + linha em "Pendencias e validacoes" pra Felipe/cliente confirmar
- [ ] **NUNCA inventar volume/horas** sem fonte. Se nao ha cronometragem, marcar **estimativa, validar com cronometro X**
- [ ] **Custo-hora Arthur — duplo**: usar **R$ 25/h cliente (base 160h)** pra calcular economia que entra na lente 2 (consistencia entre plugins na apresentacao comercial) + **R$ 40/h margem interna (base 100h capacidade comercial)** pra calcular margem Pique na lente 1. Conforme `pique/clientes/beco/CLAUDE.md` confirmado 21/04/2026. Documentar ambos no doc final
- [ ] Multiplicador encargos: CLT 1,4× / Pro-labore 1,2× / PJ 1,0× (consistente com playbook)
- [ ] **Auditar homonimos na lista de pessoas**: nome igual em pessoa diferente (ex: Maria DP/SL ≠ Maria CIPAC do Financeiro) NAO e overlap. Cruzar nome × papel × setor × loja com precificacoes anteriores antes de assumir mesma pessoa

### Detector de overlap entre plugins (regra critica — esta skill nasceu de 1 caso real)
- [ ] **Antes de calcular economia**, perguntar: "Algum card desse plugin sucede ou overlap-a com card de outro plugin ja precificado?"
- [ ] Caso de referencia: F2 Plugin Gestao Lojas sucede Card 2 Plugin Financeiro (decisao 20/04 Beco). Quebra R$ 31K + tempo Carol MIGRAM entre plugins, NAO somam
- [ ] Marcar overlap **explicitamente** no Consolidado por pessoa (coluna "Origem" com flag MIGRA/NOVO)
- [ ] Soma combinada de plugins multiplos = soma honesta sem dupla contagem

### Aritmetica (regra dura — esta skill nasceu de 4 erros reais + 2 da rodada RH 26/04)
- [ ] **Toda soma do consolidado por pessoa**: validar manualmente uma 2a vez antes de fechar
- [ ] **Sumario executivo**: bater com totais do consolidado por pessoa (mesmo numero em 2 lugares)
- [ ] **Tiers de pacote**: ROI ano 1 = Economia − (Impl + 12 × Recorrencia). Validar
- [ ] **Payback**: Impl ÷ Economia × 12. Validar
- [ ] **Ganho liquido ano N**: (Economia × N) − Impl − (Recorrencia × 12 × N). Validar
- [ ] **Veredito do Bloco 5 (Card) = soma SO das linhas do Bloco 2 sem flag (potencial)**. Linhas com flag `(potencial, NAO no total conservador)` NAO entram no veredito do card — vao pra secao "Captura potencial" da Fase 5. Conferir literalmente as flags antes de fechar o veredito (regra introduzida apos erro RH/Card 3 — somou R$5K reter quem deveria sair como conservador, deveria ser potencial)
- [ ] **% concentracao por pessoa**: calcular SO apos fechar a soma do consolidado da Fase 5. NAO apresentar concentracao baseada em estimativa visual antes (regra introduzida apos erro RH — apresentei "89% Ana" antes da soma; numero real era 65%)

### Tres lentes obrigatorias
- [ ] **Lente 1 — custo interno Pique**: horas Arthur × R$ 25/h + overhead Marco/Henrique. Margem minima 2-3×
- [ ] **Lente 2 — valor gerado pro cliente**: economia conservadora (tempo + dinheiro direto). Captura de margem fica como "potencial adicional", NAO no total
- [ ] **Lente 3 — payback ao cliente**: Premium/Standard/Agressivo (descontos 0/20/30%). Standard como ancora; Agressivo no bolso

### Checkpoints obrigatorios (NUNCA pular)
- [ ] Pausar apos Fase 1 (Auditoria) — usuario valida tabela de cards + lista de pessoas + decisoes de overlap
- [ ] Pausar apos Fase 4.1 (gabarito aplicado no Card 1) — usuario valida formato antes da skill aplicar nos demais
- [ ] Pausar apos Fase 7.1 (verificacao aritmetica) — usuario aprova totais
- [ ] Pausar apos Fase 7.3 (geracao dos 2 outputs) — usuario le e pede correcoes pontuais
- [ ] Pausar antes da Fase 8 ClickUp — autorizacao explicita pra atualizar custom fields

---

## Fase 0: Input

Antes de comecar, defina com o usuario:

1. **Qual cliente?** Default: `beco`. Se outro, validar `pique/clientes/<cliente>/` existe + perguntar list-destino do Catalogo
2. **Qual area?** (financeiro, gestao-lojas, compras, marketing, rh, supervisao). Filtro Area dos cards no Catalogo
3. **Onda?** Auto-detectar olhando `pique/clientes/<cliente>/CLAUDE.md` ou _mapa.md (Beco: Onda 1 = Financeiro; Onda 2 = Compras + Gestao Lojas; etc). **Confirmar com usuario** antes de seguir
4. **Cards conhecidos?** Usuario pode passar IDs, ou skill descobre na Fase 1

Se algum desses 4 itens estiver ambiguo, perguntar (max 2-3 perguntas cirurgicas).

### Detector de natureza-do-plugin (regra introduzida apos Marketing/Beco 27/04)

**Antes de disparar as buscas paralelas da Fase 1**, fazer uma busca rapida ao gestor-clickup pra contar quantos cards-filhos existem hoje no Catalogo pra esta area:

```
Quantos cards no Catalogo de Solucoes (list 901326825973) tem custom field Area=<area>?
Retornar so a contagem + lista de IDs/nomes (sem campos R$).
```

**Tres cenarios:**

- **N ≥ 3 cards-filhos** → fluxo padrao. Cada card-filho vira 1 secao no doc final com 5 blocos.
- **1-2 card-mae unico** (caso Marketing/Beco) → **NAO assumir fluxo padrao**. Apresentar 3 caminhos ao usuario:
  - **A) Cards virtuais**: explodir os componentes do dossie consolidado em N cards virtuais (gabarito 5-blocos cada). Ofereceer no final criar os cards-filhos reais no ClickUp.
  - **B) Precificacao light**: 1 card unico no doc com sumario + tiers + 1 paragrafo por componente. ~150 linhas em vez de ~500.
  - **C) Pular**: marcar area como "aguarda explosao em cards" e parar.
- **0 cards** → bloquear: pedir pra rodar `/pique:desenhar-area` ou `/pique:revisar-area` antes.

A skill **NAO TEM** caminho default pra <3 cards. Forcar a decisao do usuario na Fase 0.

---

## Fase 1: Auditoria paralela do estado real

**Objetivo:** mapear TUDO que ja existe antes de inventar numero. Tres buscas em **paralelo** (1 turno, ganha tempo).

### 1.1 Disparar 3 buscas simultaneas

**Busca A — ClickUp (delegar ao `gestor-clickup`)**
```
Listar todos os cards da list Catalogo de Solucoes do <cliente> filtrando Area=<area>.
Pra cada card, retornar: ID, Nome, Status, Esforco, Impacto, Modelo, Tipo, Usuario-chave,
Horas impl., Preco venda, Valor recorrencia, Economia R$/ano, Economia nao monetaria.
Tambem listar dependencias declaradas (waiting_on/blocking).
```

**Busca B — Cerebro Pique (delegar a Explore agent — quick)**
```
Buscar em pique/clientes/<cliente>/:
- Dossie consolidado da area (entregas/dossie-<area>-NN-consolidado.md)
- Desenho do plugin (solucoes/plugin-<area>-desenho.md)
- Briefing das tasks (solucoes/plugin-<area>-tasks-briefing.md)
- CLAUDE.md (contrato, equipe, decisoes-base)
Reportar: paths existentes + 1 paragrafo de resumo de cada
```

**Busca C — Hub consultoria (delegar a Explore agent — quick)**
```
Buscar em pique-consultoria-hub/clientes/<cliente>/individuais/:
- JSONs das pessoas que aparecem como Usuario-chave nos cards (nomes da Busca A — passar lista)
- Consolidados se houver (consolidados/<area>.md)
Reportar: pessoa x papel x salario (se mencionado) x dores principais
```

### 1.2 Buscar precificacoes anteriores do mesmo cliente

Em paralelo com A/B/C ou logo depois:
```
Listar pique-consultoria-hub/clientes/<cliente>/solucoes/YYYY-MM-DD-precificacao-plugin-*.md
```

Se houver: ler tabela de salarios + custo-hora Arthur + padroes de tier ja usados. Reusar.

### 1.2.1 Detector de inconsistencia entre precificacoes anteriores (regra introduzida apos Sup/Beco 27/04)

**Cruzar nomes de pessoas entre as precificacoes anteriores do mesmo cliente.** Se o mesmo nome aparece com **valores diferentes de salario/custo-hora** em plugins distintos, flagar **inconsistencia** antes de avancar pra Fase 2.

**Caso de referencia:** Edith aparecia em Compras (24/04) com R$ 6.000 CLT (R$ 52/h) e em RH (26/04) com R$ 10.000 CLT (R$ 88/h) — diferenca de 70%. Sup precisava de UM valor consistente (Edith aparece pesado em 4 dos 6 cards).

**Output esperado da deteccao:**

```
### Inconsistencias detectadas entre precificacoes anteriores

| Pessoa | Plugin A (data) | Plugin B (data) | Diferenca | Acao sugerida |
|---|---|---|---|---|
| Edith | Compras R$ 52/h (24/04) | RH R$ 88/h (26/04) | 70% | Adotar meio-termo R$ 70/h, flagar pra retroajustar |

Como tratar (PERGUNTA AO USUARIO):
- (a) Adotar valor de plugin mais recente (assumir que precificacao anterior estava errada)
- (b) Adotar valor de plugin mais antigo (assumir que precificacao recente estava errada)
- (c) Meio-termo conservador (adotar valor central + flagar pra retroajustar ambos quando cliente confirmar)
- (d) Outro valor especifico
```

Default sugerido: **(c) meio-termo** + flag explicito em "Pendencias" pra retroajustar plugins anteriores quando cliente confirmar valor real. Nunca silenciar a inconsistencia.

### 1.3 Apresentar tabela consolidada

Output da Fase 1:

```
## Auditoria — Plugin <Area> <Cliente>

### Cards no Catalogo (N cards)
| Card | Nome | Status | Esforco | Modelo | Preco | Recorr | Horas | Eco | Usuario-chave |

### Pessoas envolvidas (N pessoas)
| Pessoa | Papel | Salario conhecido? | Confirmado/estimado | Aparece em cards |

### Dossies e desenhos no cerebro
- [path] — [resumo 1 linha]

### Precificacoes anteriores deste cliente
- [data] [plugin] — [tier ancora + economia ano 1]

### Decisoes de overlap entre plugins (PERGUNTA AO USUARIO)
- Algum card desse plugin sucede / overlap-a com card de outro plugin?
  - Caso de referencia: F2 Gestao Lojas Beco sucede Card 2 Financeiro (quebra R$31K migra)
  - Default seguro: marcar overlap explicito, valor MIGRA quando o novo entra em producao
```

**PARE e espere confirmacao do usuario sobre overlap.**

---

## Fase 2: Base de custos

**Objetivo:** custo-hora de cada pessoa envolvida + custo-hora Arthur.

### 2.1 Tabela de salarios

Reusar pessoas que ja aparecem em precificacao anterior do mesmo cliente.
Adicionar pessoas novas com flag ⚠ estimado.

**Multiplicadores fixos:**

| Regime | Multiplicador | Inclui |
|---|---|---|
| CLT | **1,4×** | INSS patronal + FGTS + ferias + 13º |
| Pro-labore | **1,2×** | So INSS do teto |
| PJ | **1,0×** | Valor cheio |

**Base:** 160h produtivas/mes.

**Custo-hora = `salario × multiplicador ÷ 160`**

### 2.2 Custo-hora Arthur

Ler `pique/financeiro/resumo-financeiro.md`. Hoje: **R$ 4.000/mes ÷ 160h = R$ 25/h**.
Se mudou, atualizar referencia. Flagar pro usuario se valor diferente do esperado.

### 2.3 Apresentar tabela completa

Output da Fase 2:

```
## Base de custos — Plugin <Area> <Cliente>

| Pessoa | Papel | Salario | Regime | Multiplicador | Custo-hora | Confianca |
|---|---|---|---|---|---|---|
| ... | ... | R$ X | CLT/Prolab/PJ | 1,Y× | R$ Z/h | ✅ confirmado / ⚠ estimado |
| Arthur | Dev Pique | R$ 4.000 | PJ | 1,0× | **R$ 25/h** | ✅ confirmado |
```

Pessoas estimadas viram pendencias da Fase 8.

---

## Fase 3: Decidir tratamento de overlap (se houver)

Se a Fase 1 identificou overlap entre plugins:

### Opcoes

| Opcao | Quando usar | Como tratar |
|---|---|---|
| **Migracao total** (default recomendado) | Cards de plugins diferentes resolvem o mesmo eixo em fases (MVP rapido → arquitetura final) | Valor MIGRA inteiro pro plugin novo quando entra em producao. Marcar overlap explicito. Soma combinada de 2 plugins NAO duplica |
| **Delta marginal** | Cards convivem em producao permanente, novo so adiciona melhoria | Conta so o ganho INCREMENTAL sobre o card existente |
| **Sem overlap** | Cards atacam dores diferentes ou pessoas diferentes | Soma livre |

Confirmar com usuario qual opcao aplicar.

---

## Fase 4: Aplicar gabarito card a card

**Disciplina:**

1. Comecar pelo card **mais simbolico** ou **maior valor** (ex: F2 do Gestao Lojas — mais alto valor monetario; Card 1 do Financeiro — Nayara SPOF emocional)
2. Aplicar os **5 blocos** completos (ver Apendice — Gabarito dos 5 Blocos)

### 4.1 Card 1 — Aplicar gabarito completo

Preencher os 5 blocos com numeros + fontes. Estilo do gabarito-canonico (Plugin Financeiro Card 1 — Rateio).

**PARE apos Card 1.** Apresentar ao usuario:

```
Card 1 (<nome>) — gabarito aplicado.

Bloco 1 (Dor hoje): [N campos preenchidos]
Bloco 2 (Formula): [linhas de tempo + dinheiro direto + retrabalho]
Bloco 3 (Nao-mensuravel): [N bullets]
Bloco 4 (Pressupostos): [N premissas com confianca]
Bloco 5 (Veredito): R$ X impl + R$ Y/mes + R$ Z economia ano 1, payback W meses

Quer ajustar formato antes de aplicar nos outros N cards?
```

**Espera OK do usuario** antes de seguir.

### 4.2 Cards restantes

Aplicar mesmo gabarito condensado nos cards restantes. Para cada:
- Bloco 1: 1 tabela de 4-6 linhas
- Bloco 2: formulas com `numero × custo-hora = R$/ano` + fonte de cada numero
- Bloco 3: 3-5 bullets nao-mensuraveis
- Bloco 4: tabela de 3-4 pressupostos com confianca
- Bloco 5: veredito de 5 linhas

Para card que **MIGRA** de outro plugin: prefixo `**⚠ Sucessao:** este card sucede [Card X Plugin Y]. MVP rapido entra primeiro via [plugin antigo]; este migra fluxo quando [pre-requisito] pronto.`

Para card de **fundacao** (sem economia direta — caso F1 Gestao Lojas): Bloco 2 = vazio, valor mora todo no Bloco 3 (nao-mensuravel) + listar dependencias.

---

## Fase 5: Consolidado por pessoa (mata overlap)

**Objetivo:** somar card por card dobra contagem (Carol em 4 cards). Visao por pessoa torna honesta.

### 5.1 Tabela tempo recuperado

```
| Pessoa | Atividade eliminada/reduzida | h/ano | Custo-hora | R$/ano | Card | Origem |
```

**Coluna Origem (CRITICA):** marcar `⚠ MIGRA do <Plugin X> Card Y` ou `NOVO` (se valor so existe neste plugin).

Subtotalizar por pessoa.

### 5.2 Tabela dinheiro direto evitado

```
| Linha | R$/ano | Card | Origem |
```

(Mesma logica de Origem.)

### 5.3 Captura de margem (potencial — NAO no total conservador)

```
| Item | R$/ano potencial | Captura realista | Card |
```

So se aplica. Marcar **opcional, nao incluido no total**.

### 5.4 Total final

```
ECONOMIA Onda <N> Core (cards do pacote core):  R$ X/ano  (com R$ Y MIGRADO de <Plugin Z>)
ECONOMIA Onda <N> Core + standalones:           R$ X+Y/ano

NOVO valor que SO o Plugin <Area> captura
(que nao existe em outros plugins precificados): R$ Q/ano
```

Adicionar **paragrafo explicativo** de como ler na apresentacao:
- "Se cliente compra so este plugin: captura R$ X"
- "Se compra os N plugins: soma honesta = R$ Y, NAO R$ Z (que dobraria os R$ K que migram)"

---

## Fase 6: Tiers + ancoragens

### 6.1 Tres tiers padrao (ajustar se cliente especifico exigir)

| Tier | Desconto | Quando |
|---|---|---|
| **Premium** | 0% | Cliente fecha sem pechinchar |
| **Standard** ⭐ | **20%** | Ancora da apresentacao |
| **Agressivo** | 30% | No bolso pra fechamento |

Para cada tier, calcular: Impl, Recorr, Total ano 1, Economia ano 1, ROI ano 1, Payback (meses).

### 6.2 Recorrencia bundle

Soma das individuais arredondada pra numero limpo (R$ 1.450 → R$ 1.500). Meta: **≤ 1% do faturamento anual** do cliente.

### 6.3 Tres ancoragens obrigatorias

1. **Comparacao humana** — "menos que contratar X pessoa por Y meses"
2. **% faturamento** — "Z% do faturamento, devolve W% em produtividade"
3. **Acumulado N anos** — "em M meses recupera R$ X liquidos"

### 6.4 Frase matadora

1 linha que concentra tudo. Padrao:
> "O pacote custa **{N} dias de faturamento**. Recupera **{M} horas de equipe por ano** e **{X qualitativo unico}**. Paga em **{Y} dias**. Essa e a conta."

### 6.5 Detector de standalone defendavel (regra introduzida apos Sup/Beco 27/04)

Apos calcular tiers do pacote, **rodar teste isolado em cada card-filho:**

```
Para cada card N do plugin:
  Payback isolado (meses) = Impl_N ÷ Eco_ano1_N × 12
  Se Payback isolado < 6 meses → CANDIDATO STANDALONE DEFENDAVEL
```

**Por que importa:** quando cliente recusa pacote completo, oferecer entry pack avulso e melhor que perder venda inteira. Mas so faz sentido com cards que **se sustentam isoladamente** — vender card com payback isolado de 12+ meses como standalone derruba narrativa.

**Output esperado:**

```
### Standalone defendavel (fallback comercial)

Cards com payback isolado < 6 meses (defendaveis pra entry pack):
| Card | Impl | Recorr | Eco ano 1 | Payback isolado |
|---|---|---|---|---|
| Card 1 Dashboard Edith | R$ 7.500 | R$ 600 | R$ 33.600 | 2,7 m ⭐ |

Cards 2-6 nao sustentam standalone (paybacks 6-25m). Valor mora no pacote.

Narrativa de fallback:
"Se voces nao quiserem o pacote completo, o Card 1 sozinho ja paga em 2,7 meses
so com o tempo da [pessoa] liberado. Os outros N cards multiplicam o efeito
mas dependem da plataforma do Card 1."
```

**Caso de referencia:** Plugin Sup/Beco — Card 1 Dashboard Edith ficou com payback isolado 2,7m enquanto pacote completo Standard ficou em 5,3m. Card 1 virou fallback comercial natural; cards 2-6 nao sustentam isolado.

Se **nenhum card** passa no teste (todos com payback isolado > 6m), explicitar na Fase 6:
> "Plugin nao tem standalone defendavel — vendido so como pacote integral. Negociacao comercial e tudo-ou-nada."

---

## Fase 7: Verificacao + geracao dos 2 outputs

### 7.1 Verificacao aritmetica (CHECKPOINT)

Antes de escrever doc:

```
## Verificacao aritmetica

✓ Soma do consolidado por pessoa: R$ X
✓ Total Core (cards do pacote): R$ Y (bate com sumario executivo)
✓ Total Core + standalones: R$ Z (bate com sumario)
✓ Tier Standard ROI ano 1: Economia R$ E − (Impl R$ I + 12 × Recorr R$ R) = R$ ROI
✓ Tier Standard Payback: R$ I ÷ R$ E × 12 = M meses
✓ Acumulado 5 anos: (R$ E × 5) − R$ I − (R$ R × 60) = R$ Liquido
✓ Migracao explicita: R$ K migram de [Plugin X] (NAO somam)
```

Se algum numero nao bater, **PARAR** e refazer. Nao gerar doc com aritmetica errada.

Apresentar a verificacao ao usuario antes de escrever os 2 outputs.

### 7.2 Geracao dos 2 outputs

**Output 1 (NOVO):** `pique-consultoria-hub/clientes/<cliente>/solucoes/YYYY-MM-DD-precificacao-plugin-<area>.md`

Estrutura completa (~500 linhas, padrao Financeiro/Compras/Gestao Lojas):
1. Cabecalho (criado, cliente, status, tags)
2. Contexto (1 paragrafo)
3. Sumario executivo (tabela)
4. Premissas e fontes (salarios + outras)
5. Gabarito de formula (5 blocos por solucao)
6. Os N cards do plugin com 5 blocos cada
7. Consolidado por pessoa (matematica sem overlap)
8. Custo Pique (lente 1)
9. Custos que cliente paga direto
10. Tiers de pacote (lente 3)
11. Ancoragens + frase matadora
12. Historico de decisoes
13. Pendencias e validacoes
14. Proximos passos
15. Relacionado (cerebro + hub + ClickUp)

**Output 2 (EDIT):** `pique/clientes/<cliente>/entregas/dossie-<area>-NN-consolidado.md`

Substituir o **Bloco 7 preliminar** (criado pela skill `/pique:revisar-area`) pela versao calibrada **condensada** (~110 linhas).

Se o dossie nao tem Bloco 7 (skill `revisar-area` nao rodou ou versao antiga), perguntar antes de inserir.

Estrutura condensada (Bloco 7):
- 7.1 Salarios usados (tabela)
- 7.2 Custo Pique (lente 1)
- 7.3 Valor pro cliente (lente 2 — economia conservadora + indireta)
- 7.4 Custos que cliente paga direto
- 7.5 Tres cenarios de pacote (lente 3)
- 7.6 Standalone(s) se houver
- 7.7 Sucessoes/overlaps com outros plugins
- (link pro doc completo no hub)

Manter Blocos 8, 9, 10 do dossie **intactos**.

### 7.3 Checkpoint pos-geracao

Apresentar:
```
## Precificacao Plugin <Area> <Cliente> — gerada

**Doc no hub:** [path] (~N linhas)
**Bloco 7 do dossie:** atualizado em [path]

Verificacao final:
- Sumario executivo bate em ambos os docs: ✓
- Overlap explicito: ✓ ou N/A
- Pendencias listadas: N
- Salarios estimados flagados: N

Le os 2 docs e me diga o que ajustar.
```

**PARE.** Aplicar correcoes via Edit (1 por vez, replace_all=false).

---

## Fase 8: Encerramento + ClickUp + auto-avaliacao

### 8.1 Resumo final

```
## Precificacao Plugin <Area> <Cliente> — RESUMO

**Cards precificados:** N ([IDs])
**Pacote Core:** [Tier ancora] R$ X impl + R$ Y/mes
**Standalone(s):** [se houver]
**Economia conservadora ano 1:** R$ Z
**Payback:** M meses
**Doc no hub:** [path]
**Bloco 7 do dossie:** atualizado

**Pendencias pre-apresentacao:**
- [N items: salarios a validar, cronometragens, decisoes pendentes]

**Proximo passo sugerido:**
- Reuniao H+M com pauta do Bloco 9 do dossie
- [se ha mais areas a precificar: rodar /pique:precificar-plugin <cliente> <proxima area>]
- [se todos plugins prontos: gerar apresentacao HTML pra cliente]
```

### 8.2 Oferta de atualizar custom fields no ClickUp

**OFERTA, nao executa automatico:**
```
Posso atualizar os custom fields dos N cards no ClickUp com:
- Preco venda (do Tier Standard)
- Valor recorrencia (do Tier Standard)
- Economia R$/ano (do Card Veredito)
- Horas impl (estimativa Arthur)

E adicionar comentario com link pro doc do hub.

Quer que eu aplique? (sim / nao / so alguns)
```

Se sim: delegar ao `gestor-clickup` em lote, validar com `get_task` apos cada update (memory `feedback_auditar_pos_update_mcp`).

Se ha **sucessao** com card de outro plugin (ex: F2 sucede Card 2 Financeiro): oferecer adicionar comentario no card antigo registrando a sucessao.

### 8.3 Auto-avaliacao (executar sempre ao final)

Avalie a execucao:

1. **Fase 1 pegou tudo?** Usuario apontou material que skill nao achou? Se sim, expandir buscas
2. **Salarios reusados** ou skill perguntou de novo o que ja estava em precificacao anterior?
3. **Detector de overlap** funcionou? Skill identificou sucessao espontaneamente, ou usuario teve que apontar?
4. **Aritmetica** bateu na primeira? Quantos erros de soma a skill cometeu? (esta skill nasceu de 4 erros reais — meta = 0)
5. **Checkpoint pos-Card 1** foi util ou usuario queria mais cards de uma vez?
6. **Tiers padrao** (Premium/Standard/Agressivo) caberam ou cliente exigiu tier customizado?
7. **Doc do hub e Bloco 7 do dossie** ficaram consistentes (mesmo numero em 2 lugares)?
8. **Custom fields ClickUp na Fase 8** — usuario aceitou auto ou pediu pra fazer manual?

Se identificar melhorias CONCRETAS e EVIDENCIADAS:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [descricao da melhoria, com evidencia]
- [descricao da melhoria, com evidencia]

Quer que eu ajuste a skill pra prevenir proxima vez?
```

2. Se aprovado, **editar este proprio arquivo** (`${CLAUDE_PLUGIN_ROOT}/commands/precificar-plugin.md`) incorporando.

3. Anexar em `pique/infra/melhorias-plugin.md`:
```
## YYYY-MM-DD — precificar-plugin <cliente>/<area> (usuario)
- [melhoria aplicada em linhas X-Y]
```

Se nao identificar nada concreto, nao mostre nada. **NAO melhore por melhorar.**

---

## Apendice — Gabarito dos 5 Blocos por Card (template copiavel)

```markdown
### Card N — {Nome da Solucao}

**ClickUp:** [{ID}](https://app.clickup.com/t/{ID})
{**⚠ Sucessao:** este card sucede [Card X Plugin Y]. MVP rapido entra primeiro via [...]; este migra fluxo quando [...] pronto.   ← so se aplica}

#### 1. Dor hoje

| Campo | Hoje |
|---|---|
| Quem sofre | {pessoa(s)} |
| Quem define as regras | {se aplica} |
| Processo | {1 frase do que faz hoje} |
| Volume mensurado | {numero + fonte} |
| Frequencia | {vezes por periodo} |
| SPOF | {sim/nao — quem} |

#### 2. Formula da economia

**Linha de tempo — {atividade} ({pessoa}):**
\```
{h/ano} × R$ {custo-hora} = R$ {valor}/ano
\```

**Linha de dinheiro direto (se aplica):**
\```
{perda/evento} × {eventos/ano} × {% captura} = R$ {valor}/ano
\```

**Linha de retrabalho evitado (se aplica):**
\```
{horas retrabalho} × R$ {custo-hora} = R$ {valor}/ano
\```

\```
TOTAL MENSURAVEL: R$ {soma}/ano
\```

{**⚠ Esses N numeros MIGRAM do Card X do Plugin Y.** Quando este card entra em producao, valor migra de plugin — nao soma duas vezes.   ← so se MIGRA}

#### 3. Nao-mensuravel

- **{ganho 1}** — {por que importa}
- **{ganho 2}** — {por que importa}
- **{ganho 3}** — {por que importa}

#### 4. Pressupostos

| Pressuposto | Valor | Confianca | Como validar |
|---|---|---|---|
| {variavel} | {X} | Alta/Media/Baixa | {acao pra validar} |

**Faixa:** pessimista R$ {A}/ano · estimado R$ {B}/ano · otimista R$ {C}/ano

#### 5. Veredito

| | |
|---|---|
| Preco implementacao | R$ {X} |
| Recorrencia/mes | R$ {Y} |
| Economia ano 1 | R$ {Z} |
| Payback | {N} meses |
| Horas Arthur | {H}h |
| Bloqueada por | {pre-req se houver} |
| Standalone | {sim/nao} |
```

---

## Apendice — Plugin estrategico vs quick-win (regra introduzida apos Marketing/Beco 27/04)

Nem todo plugin paga em ano 1 no conservador. Os 4 plugins iniciais (Financeiro/Compras/Gestao Lojas/RH) sao **quick-win** — payback < 4 meses, economia direta clara. Marketing foi o primeiro **plugin estrategico** — payback conservador 11,5m, ROI ano 1 −R$ 16.661, valor real em escala/sucessao/SPOFs eliminados.

### Detector automatico — gatilhos de plugin estrategico

Apos fechar o Bloco 5 do consolidado (Fase 5.4 — Total final), aplicar 2 testes:

1. **Tier Standard payback conservador > 8 meses** OU
2. **Economia conservadora < 2× preco implementacao**

Se qualquer dos 2 dispara, este e plugin estrategico. NAO esconder. NAO inflar economia conservadora pra mascarar.

### Como precificar plugin estrategico (sem venda-no-escuro)

1. **Cabecalho do doc:** marcar **"Status: ativo — plugin estrategico, NAO entra como pacote-ancora <data apresentacao>"**
2. **Sumario executivo:** linha explicita "ROI ano 1 conservador NEGATIVO (−R$ X) — assumido honestamente. Valor mora em [escala / sucessao / SPOFs / trilha]"
3. **Posicionamento:** "roadmap <mes futuro>" em vez de pacote-ancora. Documentar pre-requisitos cliente (workshops, decisoes pendentes)
4. **Tier-ancora com narrativa dupla:** apresentar payback conservador E payback com captura potencial (mesmo numero, 2 leituras)
5. **Frase matadora:** explicitar "esse plugin nao e o quick-win — e o **escalavel**"
6. **Captura potencial:** sucessao de pessoa-chave (R$ X salario/ano × 30%) entra aqui, NAO no conservador
7. **Acumulado 5 anos:** mostrar 2 numeros (conservador + com captura). Plugin estrategico tipicamente paga em 2-3 anos no conservador

### Quando plugin estrategico vira venda

- Cliente ja comprou pelo menos 1 plugin quick-win do mesmo fornecedor (relacionamento de confianca estabelecido)
- Pre-requisitos cliente concluidos (workshops, decisoes pendentes)
- Sucessao de pessoa-chave concretizada ou ja anunciada (transforma "potencial" em "conservador" honesto)
- Visao multi-ano (cliente entende "ano 1 deficit, ano 5 +R$ 174K liquidos")

### Exemplo-referencia
Plugin Marketing/Beco (2026-04-27): payback conservador 11,5m / com captura sucessao Rafael 6,2m. Posicionado como roadmap junho, NAO ancora 04/05. Doc completo: `pique-consultoria-hub/clientes/beco/solucoes/2026-04-27-precificacao-plugin-marketing.md`

---

## Apendice — Formulas uteis

```
Custo-hora CLT:        salario × 1,4 ÷ 160
Custo-hora Pro-labore: salario × 1,2 ÷ 160
Custo-hora PJ:         salario × 1,0 ÷ 160

Economia linha de tempo: h/semana × 52 × custo-hora = R$/ano
Payback (meses):         Impl ÷ Economia × 12
Ganho liquido N anos:    (Economia × N) − Impl − (Recorrencia × 12 × N)
ROI ano 1:               Economia − (Impl + 12 × Recorrencia)

Lente 1 (custo Pique):   horas Arthur × R$ 25/h × multiplicador margem (min 2-3×)
Lente 2 (valor cliente): economia conservadora (NAO incluir captura potencial)
Lente 3 (payback):       Impl ÷ Economia < 12 meses pra defender
```
