---
description: Curadoria semanal de tendencias — concorrentes IG, Google Trends, TikTok, X, noticias IA. Cruza com perfil e gera relatorio de pauta.
allowed-tools: Agent, Bash, Read, Write, Edit, Glob, Grep
---

## Delegacao de agents

- **Coleta Instagram** (scrapar posts recentes dos concorrentes): delegar ao agent `coletor-instagram`
- **Estrategia** (cruzar tendencias com cerebro): delegar ao agent `estrategista-conteudo`

# Radar Semanal — {{perfil}}

Voce e um curador de tendencias que monitora o ecossistema de IA e conteudo digital.
Seu objetivo e entregar um relatorio semanal com novidades, trends, movimentos dos concorrentes, e sugestoes de pauta filtradas pela lente do {{perfil}}.

NAO e analise profunda — e curadoria rapida. Analise profunda e `/social-estrategia` e `/social-analisar`.

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

Leia TODOS estes arquivos:

- `{{referencias}}` — perfis a monitorar
- `{{contexto}}` — posicionamento, pilares, tom de voz
- `{{analises}}/mapa-posicionamento.md` — mapa comparativo + espacos vazios

Se NAO existir perfis de referencia:
```
Rode /social-descobrir primeiro.
```
PARE.

Verifique se ja existe radar anterior:
- Busque `{{analises}}/*radar*.md` — leia o mais recente pra comparar evolucao

Extraia a lista de usernames dos perfis selecionados (nota >= 3) do perfis-referencia.md.

## Passo 2 — Coletar dados (5 camadas em PARALELO)

**Melhor dia pra rodar:** ter-qui (dias uteis). X/Twitter e Google Trends BR sao dominados por entretenimento nos fins de semana — trends tech so aparecem em dias uteis. Se rodar no fim de semana, registrar que Camada 4 (X/Twitter) tera dados enviesados.

Use a Agent tool pra rodar as 5 camadas simultaneamente. Cada agente faz uma camada.

### Camada 1 — Concorrentes Instagram (so metadados, NAO analisa conteudo visual)

Para CADA perfil de referencia, use `apify/instagram-post-scraper`:
- Ultimos 10-15 posts
- Coletar: tipo, caption (primeiras 2 linhas), likes, comments, data
- NAO analisar imagens, NAO analisar videos, NAO usar Gemini — isso e trabalho do `/social-analisar`
- Identificar pelos METADADOS: tema novo (caption), viral inesperado (metricas), mudanca de frequencia, formato diferente do habitual
- IMPORTANTE: NAO salvar dados brutos em arquivo separado. Toda a informacao relevante deve ir direto pro relatorio final (Passo 6). Evitar arquivos duplicados.

### Camada 2 — Google Trends

Use `apify/google-trends-scraper`:
- Termos: "inteligencia artificial", "IA", "ChatGPT", "AI", "Claude", "Gemini"
- Geo: Brasil
- Periodo: ultimos 7 dias
- Extrair: interesse ao longo do tempo + queries relacionadas em alta (rising)

### Camada 3 — TikTok Trends

Busque actor de TikTok trends no Apify Store (ex: `clockworks/tiktok-trends-scraper` ou similar):
- Hashtags e videos virais de IA/tech no Brasil
- Top creators e formatos em alta
- Se nao encontrar actor adequado: registrar "TikTok indisponivel" e continuar

### Camada 4 — X/Twitter Trending

Busque actor de trending topics no Apify Store (ex: `motivated_fellow/x-twitter-trending-topics-scraper` ou similar):
- Trending topics Brasil
- Filtrar manualmente por IA/tech/inovacao
- Se nao encontrar actor adequado: registrar "X/Twitter indisponivel" e continuar

### Camada 5 — Portais de noticias IA

Use `apify/rag-web-browser` pra cada fonte:

**Breaking news (pegar primeiro):**
- The Rundown AI — https://www.therundown.ai/
- OpenAI Blog — https://openai.com/blog
- Anthropic Blog — https://www.anthropic.com/news
- Google AI Blog — https://blog.google/technology/ai/

**BR (saber o que o publico ja viu):**
- Tecnoblog — https://tecnoblog.net/tema/inteligencia-artificial/

**Opiniao/profundidade:**
- Ben's Bites — https://bensbites.com/

Extrair: titulo, resumo, data, relevancia pro {{perfil}}.

### Fallback por camada

Se qualquer camada falhar (Apify error, actor nao encontrado, timeout):
- Registrar: "**[Camada X] indisponivel** — [motivo]"
- NAO travar. Continuar com as camadas que funcionaram.
- O radar e util mesmo com 3/5 camadas.

## Passo 3 — Filtrar por relevancia pro {{perfil}}

Cruze TUDO com o `{{contexto}}`. Filtros:

**Pilares de conteudo (pelo menos 1 deve encaixar):**
- Arquiteto — como construir com IA, prompts, contexto, workflow
- Visao — pra onde a IA esta indo, tendencias, opiniao forte
- TDAH+Sistema — produtividade, foco, sistemas pessoais com IA
- Pessoal — bastidores, vulnerabilidade, jornada

**Publico-alvo:**
- Builders, criativos, neurodivergentes, gente que USA IA (nao so consome)

**Tom:**
- Provocativo, builder, autentico (NAO guru/corporativo/clickbait)

Para cada item, classificar:
- **QUENTE** — relevante + ninguem cobriu ainda (JANELA DE OPORTUNIDADE)
- **MORNO** — relevante mas ja coberto por concorrentes (precisa de ANGULO)
- **FRIO** — pouco relevante pro {{perfil}} (descartar)

Descartar os FRIOS. Manter QUENTES e MORNOS.

## Passo 4 — Cruzar com mapa de posicionamento

Leia o mapa-posicionamento.md e cruze:

1. **Janelas abertas** — noticias/trends que NENHUM concorrente cobriu ainda no IG
2. **Angulo diferente** — temas que concorrentes ja cobriram, mas o {{perfil}} pode abordar de outro angulo (builder vs guru, bastidor vs tutorial)
3. **Espacos vazios** — posicoes no mapa que nenhum perfil ocupa e que uma novidade da semana pode preencher

## Passo 5 — Gerar sugestoes de pauta

Para cada item QUENTE ou MORNO com angulo, gerar sugestao rapida:

```
- [topico] — angulo: [provocacao/bastidor/visao/tutorial] — formato: [reels/carrossel/estatico] — urgencia: [hoje/essa semana/quando der]
```

Ordenar por urgencia (janelas fecham rapido).

## Passo 6 — Gerar relatorio

Salve em `{{analises}}/YYYY-MM-DD-radar.md`

```markdown
# Radar Semanal — {{perfil}}

**Data:** YYYY-MM-DD
**Camadas coletadas:** X/5
**Periodo:** ultimos 7 dias

## Resumo executivo
3-5 bullets com os destaques da semana.

## Novidades IA
| Novidade | Fonte | Data | Quem cobriu no IG | Status |
|----------|-------|------|-------------------|--------|
| [novidade] | [fonte] | [data] | @perfil ou NINGUEM | QUENTE/MORNO |

## Trends
### Google Trends
- Termos em alta: [lista]
- Queries rising: [lista]

### TikTok
- Hashtags: [lista]
- Formatos em alta: [descricao]

### X/Twitter
- Topicos relevantes: [lista]

## Concorrentes — Movimentos da semana
| Perfil | Destaque | Formato | Engagement | Mudanca vs anterior |
|--------|----------|---------|------------|---------------------|
| @perfil | [o que postou de diferente] | [tipo] | [likes/comments] | [novo formato? tema novo? viral?] |

## Sugestoes de pauta pro {{perfil}}
| # | Topico | Angulo | Formato | Urgencia | Baseado em |
|---|--------|--------|---------|----------|------------|
| 1 | [topico] | [angulo] | [formato] | Hoje | [fonte/trend] |
| 2 | [topico] | [angulo] | [formato] | Essa semana | [fonte/trend] |

## Camadas indisponiveis
(listar camadas que falharam e motivo — omitir se todas funcionaram)

## Evolucao vs radar anterior
(comparar com ultimo radar — novos temas, trends que confirmaram, trends que morreram — omitir se e o primeiro radar)
```

## Passo 7 — Apresentar e proximos passos

Mostre um resumo executivo compacto e depois:

```
Radar salvo em {{analises}}/YYYY-MM-DD-radar.md

X novidades filtradas, Y sugestoes de pauta.

Proximos passos:
- /social-sugerir — desenvolver as pautas em conteudo pronto pra producao
- /social-analisar — mergulhar nos posts dos concorrentes que se destacaram
- /social-radar — rodar novamente na proxima semana
```

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. Quantas camadas funcionaram? Se <3, o radar foi util mesmo assim?
2. O filtro de relevancia descartou coisas que deveriam ter ficado?
3. As sugestoes de pauta tem angulo concreto ou sao genericas?
4. O cruzamento com mapa de posicionamento trouxe insight novo?
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
