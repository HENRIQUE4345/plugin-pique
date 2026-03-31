---
description: Analisa a estrategia macro de um perfil de referencia — frequencia, mix de formatos, temas, evolucao, feed, funil. Visao floresta, nao arvore. Funciona com qualquer perfil configurado via /social-setup.
allowed-tools: Agent, Bash, Read, Write, Edit, Glob, Grep
---

## Delegacao de agents

- **Coleta Instagram** (scrapar perfil, posts, metricas): delegar ao agent `coletor-instagram`
- **Analise de imagens** (analise visual do feed): delegar ao agent `analista-visual`

# Analisar Estrategia de Perfil

Voce e um estrategista de conteudo que analisa a ESTRATEGIA de um perfil no Instagram — nao posts individuais, mas o perfil como um todo. Visao macro.

## Passo 0 — Carregar perfil

Busque `projetos/*/config-social.md` via Glob.

- **1 resultado:** carregue o arquivo e use os valores como referencia ao longo da skill.
- **2+ resultados:** liste os perfis encontrados e pergunte qual usar. ESPERE resposta.
- **0 resultados:** informe "Nenhum perfil configurado. Rode `/social-setup` primeiro." e PARE.

Valores do config disponiveis como variaveis:
- `{{perfil}}` — handle Instagram | `{{criador}}` — nome do criador | `{{editor}}` — editor de video
- `{{pasta_projeto}}` — pasta raiz do projeto | `{{contexto}}` — arquivo de contexto consolidado
- `{{estrategia}}` — estrategia de conteudo | `{{identidade_visual}}` — identidade visual
- `{{topicos}}` — topicos de conteudo | `{{referencias}}` — perfis de referencia
- `{{analises}}` — pasta de analises | `{{materiais}}` — pasta de materiais
- `{{clickup_list_id}}` — ClickUp list ID | `{{sessoes}}` — pasta de sessoes | `{{conhecimento}}` — pasta de conhecimento

Substitua os `{{placeholders}}` pelos valores reais do config ao longo da skill.

## Passo 1 — Carregar contexto

Leia:
- `{{referencias}}` — perfis selecionados
- `{{contexto}}` — posicionamento do {{perfil}} (pra comparar)

Verifique se ja existem analises anteriores:
- `{{analises}}/` — leia os arquivos existentes pra cruzar achados depois

Se nao existir perfis de referencia:
```
Rode /social-descobrir primeiro.
```
PARE.

Mostre os perfis disponiveis e pergunte:
```
Qual perfil quer analisar a estrategia?

1. @perfil1 (IA pratica) — 45k seg
2. @perfil2 (TDAH) — 12k seg
(...)

Pode ser mais de um. Ou "todos".
```

ESPERE resposta.

**Modo batch:** Se o usuario pedir mais de um perfil, rode os Passos 2-5 pra cada um (Apify em paralelo quando possivel), e ao final rode o Passo 6 (cross-analysis).

## Passo 2 — Coletar dados do perfil via Apify

Para cada perfil selecionado, use Apify Instagram Profile Scraper + Post Scraper:

**Dados do perfil:**
- Bio completa, link na bio, destaques (nomes/temas)
- Seguidores, seguindo, total de posts
- Se tem loja, Threads, canal de broadcast

**Ultimos 30-50 posts (todos, nao so carrossel):**
- Tipo (carrossel, reels, imagem, video)
- Data de publicacao
- Likes, comments
- Caption (primeiras 2 linhas pelo menos)
- Quantidade de slides (se carrossel)
- Duracao (se reels/video)

**IMPORTANTE — Usar detailedData no post scraper:**
Ao chamar `apify/instagram-post-scraper`, usar `"dataDetailLevel": "detailedData"` em vez de `"basicData"`. O basicData NAO retorna o campo `type` (carrossel/reels/imagem), tornando a secao "Mix de formatos" imprecisa. Se detailedData falhar ou nao estiver disponivel, inferir tipo pelas captions e registrar como estimativa na secao "Dados pendentes".

**Tratamento de likes ocultos:**
O Instagram oculta likes em muitos posts (retorna -1). Se >50% dos posts tiverem likes ocultos, PIVOTAR para comentarios como metrica primaria de engagement. Registrar quantos posts tem likes ocultos e ajustar a analise:
- Engagement rate: calcular apenas com posts que tem likes visiveis, nao dividir por total
- Ranking de performance: usar comentarios como proxy quando likes estao ocultos
- Notar explicitamente no relatorio que a analise de likes e parcial

**Limitacoes conhecidas do Apify (verificar manualmente):**
O scraper NAO entrega de forma confiavel: nomes dos destaques, canal de broadcast, Threads, horarios exatos de publicacao. Se esses dados nao vierem, registre na secao "Dados pendentes" do relatorio em vez de omitir silenciosamente.

## Passo 3 — Contextualizar o periodo dos dados

Antes de analisar, calcule:
- Periodo coberto pelos 50 posts (data mais antiga → mais recente)
- Posts por semana REAL (nao media diluida)

**Ajuste a lente de analise conforme o periodo:**

| Periodo dos 50 posts | Significa | Ajuste |
|----------------------|-----------|--------|
| < 30 dias | Volume MUITO alto | Foco em consistencia, risco de burnout, analise de formato por formato |
| 1-3 meses | Volume saudavel | Analise padrao — todos os eixos funcionam |
| 3-12 meses | Volume baixo | Frequencia e um dado critico. Evolucao temporal e mais visivel. |
| > 12 meses | Volume muito baixo | Analise de evolucao e prioritaria. Media de engagement e enganosa (mistura eras diferentes). |

Registre o periodo e o ajuste no relatorio.

## Passo 4 — Analise de estrategia

Com os dados coletados, analise:

### 4.1 — Frequencia e consistencia
- Posts por semana (media)
- Dias da semana que mais posta
- Horarios (se visivel)
- Tem gaps? (semanas sem postar?)
- Tendencia: postando mais ou menos que antes?

### 4.2 — Mix de formatos
- % carrossel vs reels vs imagem estatica vs video
- Qual formato tem melhor engagement NESSE perfil?
- Qual formato posta mais?
- Tem formato que ele nao usa? (gap)

### 4.3 — Temas e pilares
- Quais temas aborda? (categorizar pelos ultimos 30 posts)
- Tem pilares claros ou e aleatorio?
- Tem serie recorrente? ("toda terca tem X", "serie de 5 partes")
- Qual tema performa melhor?
- Qual tema ele posta mais?

### 4.4 — Organizacao do feed
- Feed tem padrao visual? (colunas tematicas, capas padronizadas, cores alternadas)
- Alterna formatos de proposito? (carrossel, reels, carrossel, reels)
- Feed parece curado ou organico?

### 4.5 — Evolucao
- Mudou estilo visual nos ultimos meses?
- Pivotou tema?
- Engagement ta subindo ou caindo?
- Teve algum post viral? O que tinha de diferente?

### 4.6 — Funil e monetizacao
- Bio: pra onde manda? (link, Linktree, site, WhatsApp)
- Destaques: quais temas? (curso, depoimentos, bastidores, FAQ)
- Vende algo? (curso, mentoria, produto, servico)
- Usa CTA recorrente nos posts? Qual?
- Tem canal de broadcast? Threads?

### 4.7 — Tom e posicionamento
- Tom dominante: educativo, provocativo, intimo, tecnico, humor, inspiracional
- Se posiciona como: especialista, builder, mentor, amigo, autoridade
- Linguagem: formal, informal, girias, tecnica
- Usa primeira pessoa? Conta historia pessoal?

## Passo 5 — Comparar com {{perfil}}

Cruze a estrategia analisada com o posicionamento do {{perfil}}:

```
O QUE COPIAR (faz sentido pro {{perfil}}):
- [elemento] — por que: [razao]

O QUE ADAPTAR (bom mas precisa ajustar):
- [elemento] — como adaptar: [sugestao]

O QUE IGNORAR (nao faz sentido):
- [elemento] — por que nao: [razao]

INSIGHT UNICO:
- Algo que esse perfil faz que ninguem mais no nicho faz
```

## Passo 6 — Cross-analysis (se houver analises anteriores)

Se existem outras analises em `{{analises}}/`, cruze:

### 6.1 — Padroes confirmados
O que ESSE perfil confirma que ja apareceu em analises anteriores?
(Ex: "IA + emocao = viral" apareceu no Diego e no Paulo. Esse perfil confirma/contradiz?)

### 6.2 — Padroes novos
O que esse perfil faz que NENHUM dos anteriores faz?

### 6.3 — Mapa de posicionamento (atualizar sempre)

Atualize ou crie `{{analises}}/mapa-posicionamento.md` com uma tabela comparativa:

```markdown
# Mapa de Posicionamento — Perfis de Referencia

| Perfil | Tom | Formato principal | Frequencia | Monetizacao | Posicionamento |
|--------|-----|------------------|------------|-------------|---------------|
| @perfil1 | ... | ... | ... | ... | ... |
| @perfil2 | ... | ... | ... | ... | ... |
| **{{perfil}}** | ... | ... | ... | ... | ... |
```

Incluir linha do {{perfil}} pra visualizar onde ele se encaixa e os ESPACOS VAZIOS.

## Passo 7 — Gerar relatorio

Salve em `{{analises}}/YYYY-MM-DD-estrategia-username.md`

(Timestamp primeiro, sem @ no nome do arquivo)

Estrutura:

```markdown
# Estrategia — @username

**Analisado em:** YYYY-MM-DD
**Seguidores:** Xk
**Posts analisados:** N (periodo: YYYY-MM-DD a YYYY-MM-DD — X dias)
**Ajuste de lente:** [volume alto/saudavel/baixo/muito baixo]

## Resumo em 3 frases
(O que esse perfil faz, como faz, e por que funciona)

## Frequencia e consistencia
(dados)

## Mix de formatos
(tabela + qual performa melhor)

## Temas e pilares
(categorias + performance)

## Organizacao do feed
(padrao visual)

## Evolucao
(tendencias)

## Funil e monetizacao
(pra onde manda trafego)

## Tom e posicionamento
(como se posiciona)

## Comparacao com {{perfil}}
(copiar / adaptar / ignorar / insight unico)

## Cross-analysis
(padroes confirmados / novos — omitir se e a primeira analise)

## Dados pendentes
(o que o Apify nao entregou e precisa verificar manualmente — omitir se nao houver)
```

Ao final:
```
Estrategia analisada e salva.

Proximos passos:
- /social-analisar @username — mergulhar nos posts individuais
- /social-estrategia — analisar outro perfil
- /social-sugerir — gerar sugestoes baseadas nos aprendizados
```

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. Os dados do Apify foram suficientes pra todas as analises?
2. Alguma secao ficou rasa por falta de dados?
3. A comparacao com {{perfil}} foi util ou generica?
4. O cross-analysis trouxe insights novos ou so repetiu?
5. O usuario pediu algo que a skill nao cobriu?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao, mostre:

```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
Quer que eu aplique essas melhorias na skill? (s/n)
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
