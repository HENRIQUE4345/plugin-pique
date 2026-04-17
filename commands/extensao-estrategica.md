---
description: Prepara dashboard estrategico quinzenal. Coleta dados de 7 fontes, analisa, faz perguntas cirurgicas, gera HTML dashboard com blocos = pauta da reuniao. Execute este fluxo EXATAMENTE, sem pular etapas.
---

Prepara a **Extensao Estrategica quinzenal** — reuniao de +1h apos a review semanal, a cada 2 sextas. Pergunta central: "Estamos no caminho certo?"

Argumento opcional: data da reuniao (ex: "17/04") ou "agora" pra gerar com dados de hoje.

---

## Ferramentas

- **Operacoes ClickUp** (buscar tasks): delegar ao agent `gestor-clickup`
- **Google Calendar**: chamar diretamente (connector leve)
- **Arquivos do cerebro**: Read/Grep direto

> **IMPORTANTE**: Se as tools do ClickUp nao estiverem disponiveis (agent gestor-clickup falhar), avise o usuario: "ClickUp MCP esta desativado. Ative em: VS Code → MCP Servers → clickup → Enable. Depois me chame de novo." NAO tente continuar sem ClickUp — pare e espere.

## Configuracao

Antes de iniciar, leia `plugin-pique.local.md` na raiz do projeto para obter:
- **Usuario atual:** `user_name` (user_id ClickUp: `user_clickup_id`)
- **Calendarios:** `calendarios.*`

Se o arquivo nao existir, pergunte o `user_name` e crie usando o template.

---

## Fase 0: Pre-requisitos

1. Buscar review semanal mais recente: `sessoes/*-review-semanal-*.md`
2. Buscar extensao estrategica anterior: `sessoes/*-extensao-estrategica*.md`
3. Se existir extensao anterior, extrair: decisoes tomadas e follow-ups pendentes.

---

## Fase 1: Coleta massiva (paralelo, NAO pergunte nada ainda)

Execute TUDO em paralelo. Objetivo: ter dados crus pra montar os 8 blocos.

### 1.1 Roadmaps ativos

Leia os roadmaps que existirem (nao falhe se algum nao existir):
- `pique/estrategia/roadmap.md`
- `pique/produto-yabadoo/roadmap-metas-2026.md`
- `pique/produto-yabadoo/roadmap-tecnico-8-semanas.md`
- `projetos/marca-iairique/estrategia/roadmap-social-media.md`
- `pique/processos/roadmap-implementacao-beco.md`

Extraia: metas do mes atual, KRs esperados, fase atual de cada frente, deadlines proximas.

### 1.2 ClickUp — Foto completa (TODO o time, TODOS os Spaces)

Delegar ao `gestor-clickup`. Buscar em TODOS os Spaces ativos:
- Pique Digital (901313561086)
- Studio (901313561098)
- Yabadoo (901313567191)
- Beto Carvalho (901313567164)
- Pessoal (901313561154)

| O que buscar | Filtro | Por que |
|---|---|---|
| Tasks "Finalizado" (ultimos 14 dias) | Todos assignees | O que foi entregue |
| Tasks atrasadas (due_date < hoje, status != Finalizado) | Todos assignees | Red flags |
| Tasks "Fazendo" ou "Hoje" | Todos assignees | O que ta em andamento |
| Tasks "Essa semana" | Todos assignees | O que foi planejado |
| Tasks criadas nos ultimos 14 dias | Todos assignees | O que surgiu |

Agrupar resultados por: Space, depois por assignee.

### 1.3 Google Calendar — ultimos 14 dias + proximos 14 dias

Listar eventos em DOIS periodos nos calendarios Pique Agenda, Henrique e Marco:
- **Passado:** 14 dias atras ate hoje — reunioes realizadas, cancelamentos
- **Futuro:** hoje ate +14 dias — proximas reunioes, deadlines, compromissos

### 1.4 Financeiro

Ler (se existirem):
- `pique/financeiro/resumo-financeiro.md` — snapshot atual
- `pique/financeiro/cenarios-financeiros.md` — cenarios projetados
- `pique/financeiro/extracao-custos-reais-jan-mar-2026.md` — base de custos

Extrair: receita, custo fixo, margem, colchao, runway, contas a receber, pipeline.

### 1.5 Sessoes recentes (14 dias)

Listar e ler sessoes em `sessoes/` e `pique/sessoes/` dos ultimos 14 dias.

Extrair:
- Decisoes tomadas (buscar: "decisao", "decidimos", "ficou definido")
- Insights estrategicos
- Mudancas de rumo
- Brainstorms relevantes

### 1.6 Diarios recentes (10 dias uteis)

Ler `diarios/YYYY-MM-DD.md` dos ultimos 10 dias uteis.

Extrair:
- Blockers recorrentes (mesmo tema aparece 2+ vezes)
- Padroes ("3 dias travou no mesmo tema", "nenhum check-out")
- Aprendizados (buscar: "aprendi", "descobri", "percebi", "ficou claro")
- Energia/ritmo geral

### 1.7 Extensao anterior — follow-up

Se encontrou na Fase 0, comparar:
- Decisoes que foram tomadas — foram executadas?
- Follow-ups pendentes — resolvidos?
- Red flags anteriores — melhoraram ou pioraram?

---

## Fase 2: Analise e montagem dos 8 blocos

Com os dados crus, montar o conteudo de cada bloco. Cada bloco tem uma **pergunta central** que guia a analise.

### Bloco 1: Panorama da Quinzena — "Como estamos?"

Montar:
- **5 metricas macro:** tasks finalizadas (total), velocidade (tasks/semana media), taxa de execucao (planejado vs feito), reunioes realizadas (14d), receita do mes
- **Semaforo rapido** (7 lentes, 1 linha cada):

| Lente | Regra verde | Regra amarelo | Regra vermelho |
|-------|------------|--------------|----------------|
| Roadmap | Entregas no prazo | Atrasado 1 semana | Atrasado 2+ semanas ou parado |
| Financeiro | Margem positiva + colchao >2 meses | Margem positiva mas colchao <2 meses | Deficit ou colchao <1 mes |
| Alinhamento | >70% tasks em areas prioritarias | 50-70% | <50% ou frente critica parada |
| Capacidade | Distribuicao equilibrada | Uma pessoa com 2x mais que outra | Alguem sem tasks ou alguem com 3x |
| Conteudo | Publicacoes no ritmo planejado | 1-2 atrasadas | Sem publicacao em 2+ semanas |
| Comercial | Prospects ativos + pipeline | Poucos prospects | Zero prospects, pipeline seco |
| Red flags | Nenhum critico | 1-2 alertas | 3+ alertas ou 1 critico grave |

### Bloco 2: Roadmap vs Realidade — "Estamos onde deveriamos estar?"

Montar:
- Para cada frente (Consultoria, Studio, Yabadoo, @iairique, Beto): marco planejado vs status real
- Classificar: no prazo / atrasado / concluido / nao iniciado
- **Insight:** onde o gap e maior e o que explica o desvio (cruzar com diarios/sessoes)

### Bloco 3: Financeiro — "Quanto tempo temos?"

Montar:
- Numeros macro: receita, custo fixo, margem, colchao, runway em meses
- Contas a receber pendentes
- Pipeline comercial (valor em negociacao)
- Comparativo mes anterior vs atual (se dados disponiveis)
- **Insight:** cenario otimista vs pessimista

### Bloco 4: Entregas por Frente — "O que saiu?"

Montar para cada frente (Pique, Studio, Yabadoo, Beto):
- Tasks finalizadas (lista com nomes)
- Tasks em andamento
- Destaque ou conquista principal
- **Insight:** qual frente rendeu mais vs qual ficou parada

### Bloco 5: Capacidade & Tempo — "Estamos usando bem o tempo?"

Montar:
- Tasks por pessoa (Henrique, Marco, Arthur, Gabriel): finalizadas, em andamento, atrasadas
- Reunioes realizadas (total, por pessoa)
- Carga por Space (onde cada pessoa mais atuou)
- **Insight:** quem ta sobrecarregado, ratio reuniao/execucao

### Bloco 6: Red Flags & Alertas — "O que ta queimando?"

Montar:
- Tasks atrasadas cronicas (>7d overdue) — lista com nome, assignee, dias atrasado
- Decisoes adiadas mais de 1 reuniao
- Padroes repetidos nos diarios
- Bloqueios que dependem de terceiro
- Indicadores de alerta do rituais-pique (audios pararam, review cancelada, etc.)
- **Insight:** cada red flag com sugestao concreta de acao

### Bloco 7: Decisoes da Reuniao — "O que precisamos decidir AGORA?"

Montar:
- Decisoes pendentes extraidas de sessoes, reviews, diarios
- Para cada uma: contexto (1-2 linhas), opcoes (se aplicavel), recomendacao baseada em dados
- Decisoes do follow-up da extensao anterior que nao foram resolvidas

### Bloco 8: Proximas 2 Semanas — "O que vai acontecer?"

Montar:
- Eventos do Calendar (proximos 14d)
- Tasks com due_date nas proximas 2 semanas
- Deadlines externas (cliente, entrega)
- Prioridades por pessoa
- **Insight:** conflitos de agenda, semanas apertadas, folgas

---

Apresente TODOS os 8 blocos como texto ao usuario. Formato:

```
## Bloco 1: Panorama da Quinzena
[conteudo montado]

## Bloco 2: Roadmap vs Realidade
[conteudo montado]

... (todos os 8)
```

ESPERE o usuario revisar antes de continuar.

---

## Fase 3: Perguntas estrategicas (3-5 perguntas cirurgicas)

Com base nos GAPS encontrados na Fase 2, faca 3-5 perguntas:

- **NAO sao genericas** — sao provocacoes baseadas em dados concretos que voce encontrou
- **NAO sao survey** — sao perguntas que voce so faz porque encontrou algo que nao fecha
- Formato: "[Dado que encontrei]. [Pergunta direta]."

Exemplos do tipo de pergunta esperada:
- "Vi que o Beco tem 4 tasks atrasadas >7d e a receita depende disso. A apresentacao pro cliente aconteceu? Qual foi o resultado?"
- "Arthur tem 8 tasks finalizadas em 14d mas todas no mesmo Space. Isso e intencional ou falta alocacao?"
- "3 sessoes de reorganizacao ClickUp nos ultimos 14 dias. Quanto disso gerou resultado concreto vs meta-trabalho?"

ESPERE as respostas. Incorpore nos blocos relevantes.

---

## Fase 4: Gerar dashboard HTML

Gere um HTML self-contained (single file, zero deps exceto Google Fonts + Chart.js se necessario).

### Estrutura do HTML

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pique — Extensao Estrategica DD/MM/YYYY</title>
  <!-- Favicon Pique inline SVG -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    /* CSS inline — tokens + componentes usados */
  </style>
</head>
<body>
  <div class="container">
    <!-- Header com contexto -->
    <header class="person-header">
      <div class="eyebrow">EXTENSAO ESTRATEGICA</div>
      <h1>Pique Digital</h1>
      <div class="sub">Quinzena DD/MM a DD/MM · Sexta DD/MM/YYYY</div>
    </header>

    <!-- 8 blocos na ordem da pauta -->
    <section class="bloco" data-id="panorama">...</section>
    <section class="bloco" data-id="roadmap">...</section>
    <section class="bloco" data-id="financeiro">...</section>
    <section class="bloco" data-id="entregas">...</section>
    <section class="bloco" data-id="capacidade">...</section>
    <section class="bloco" data-id="redflags">...</section>
    <section class="bloco" data-id="decisoes">...</section>
    <section class="bloco" data-id="proximas">...</section>

    <footer>Pique Digital · Extensao Estrategica · DD/MM/YYYY</footer>
  </div>
  <script>
    /* fadeUp animation via IntersectionObserver */
  </script>
</body>
</html>
```

### Design system (copiar inline)

Usar os tokens e componentes do design Pique. Cores e variaveis:

```css
:root {
  --bg-primary: #0a0a0a;
  --bg-card: rgba(255, 255, 255, 0.03);
  --bg-card-hover: rgba(255, 255, 255, 0.05);
  --border-card: rgba(255, 255, 255, 0.07);
  --border-card-hover: rgba(232, 148, 48, 0.3);
  --accent: #E89430;
  --accent-bright: #F0A840;
  --accent-dim: rgba(232, 148, 48, 0.15);
  --text-primary: #f5f0eb;
  --text-secondary: #a09080;
  --text-muted: #605040;
  --danger: #e74c3c;
  --warning: #f39c12;
  --info: #3498db;
  --success: #2ecc71;
  --gradient-1: linear-gradient(135deg, #E89430 0%, #D07020 100%);
}
```

### Componentes a usar por bloco

| Bloco | Componentes |
|-------|-------------|
| 1 Panorama | `.stats-grid` + `.stat-card` (5 KPIs) + `.status-item` + `.status-icon` (semaforo 7 lentes) |
| 2 Roadmap | `.timeline` + `.timeline-item` + `.pill` (status por frente) + `.sub-block` (insights) |
| 3 Financeiro | `.stats-grid` (receita/custo/margem/runway) + `table.data` (detalhes) |
| 4 Entregas | `.sub-block` por frente + listas + `.pill` (status) |
| 5 Capacidade | `table.data` (pessoas x metricas) + `.sub-block` (insights) |
| 6 Red Flags | `table.data` com `.pill` severidade (`.pill-critica`, `.pill-alta`, `.pill-media`) + `blockquote` (sugestoes) |
| 7 Decisoes | `.sub-block` numerados (1 por decisao) com contexto + opcoes + recomendacao |
| 8 Proximas | Timeline 2 colunas (semana 1 / semana 2) + lista datas criticas |

### Regras do HTML

1. **Single file, zero deps** (exceto Google Fonts)
2. **Funciona em file://** — nada de servidor
3. **Blocos empilhados** — NAO e scroll de pagina inteira (sem min-height: 100vh)
4. **Container max-width: 1100px** centrado
5. **Cada bloco** com `.bloco-header` (numero + titulo) + `.bloco-content`
6. **fadeUp animation** nos blocos via IntersectionObserver
7. **Responsive** em 768px (grids colapsam pra 1 coluna)
8. **Favicon Pique** inline SVG
9. Copiar APENAS os estilos dos componentes usados — nao copiar o CSS inteiro do hub

### Destino do arquivo

`pique/materiais/apresentacoes/YYYY-MM-DD-extensao-estrategica.html`

Se for update da mesma data: sobrescreve.

---

## Fase 5: Pos-geracao

1. Salve o HTML no destino.
2. Informe o caminho do arquivo.
3. Pergunte: "Quer que eu abra no navegador pra revisar?"
4. Se o usuario pedir ajustes, edite o HTML diretamente (nao regenere tudo).

---

## Fase 6: Salvar sessao + auto-avaliacao

Crie `sessoes/YYYY-MM-DD-HHMM-extensao-estrategica.md`:

```markdown
# Sessao — Extensao Estrategica DD/MM a DD/MM

**Criado:** YYYY-MM-DD HH:MM
**Status:** ativo
**Tags:** sessao, extensao-estrategica, quinzenal, pique-digital

## Contexto
Extensao estrategica quinzenal. Participantes: Henrique + Marco.

## Semaforo
[tabela das 7 lentes com status]

## Principais insights
[top 3-5 insights da analise]

## Decisoes tomadas
[preencher pos-reuniao — ou "pendente: reuniao ainda nao aconteceu"]

## Follow-up pra proxima quinzena
[lista de follow-ups]

## Relacionado
- Dashboard: [caminho do HTML]
- Review semanal: [caminho se existir]
- Extensao anterior: [caminho se existir]
```

### Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. As 7 fontes de dados foram coletadas sem gaps criticos?
2. O semaforo reflete os dados reais (nao foi suavizado nem dramatizado)?
3. As perguntas estrategicas foram baseadas em gaps concretos (nao genericas)?
4. O HTML abre corretamente no navegador (file://)?
5. O layout e dashboard com blocos (nao scroll-based)?
6. Os 8 blocos cobrem a pauta da reuniao (mapa-reunioes.md secao 3b)?

Se identificar melhorias CONCRETAS e EVIDENCIADAS:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [melhoria 1]
- [melhoria 2]
```

2. Anexe em `pique/infra/melhorias-plugin.md` no formato:
```
## YYYY-MM-DD — extensao-estrategica (usuario)
- [melhoria 1]
- [melhoria 2]
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.

---

## Regras

- **E uma reuniao de EMPRESA.** Dados de todo o time, todos os Spaces. Nao filtrar por usuario.
- **Insights sao obrigatorios.** Cada bloco tem pelo menos 1 insight com sugestao concreta.
- **Perguntas sao cirurgicas.** 3-5 perguntas baseadas em gaps encontrados, nao survey generico.
- **Dashboard, nao apresentacao.** Blocos empilhados, tudo visivel, sem scroll de pagina inteira.
- **Dados faltando = informar, nao inventar.** Se financeiro ta desatualizado, dizer "dados de DD/MM, pode estar defasado".
- **Decisoes anteriores = cobrar.** Se a extensao anterior teve decisoes, o Bloco 7 DEVE ter follow-up.
- **NAO execute ClickUp writes.** Esta skill so LE dados. Tasks e decisoes sao registrados pos-reuniao via `/pique:pos-reuniao` ou `/pique:encerrar`.
- Comunique-se em portugues brasileiro, direto e sem formalidade.
