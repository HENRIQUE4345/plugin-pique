---
description: Analisa posts dos perfis de referencia — carrossel (imagem e video), Reels, estaticos. Claude Vision pra imagem, Gemini pra video. Gera relatorio com padroes. Funciona com qualquer perfil configurado via /social-setup.
allowed-tools: Agent, Bash, Read, Write, Edit, Glob, Grep
---

## Delegacao de agents

- **Coleta Instagram** (scrapar posts, perfis): delegar ao agent `coletor-instagram`
- **Analise de imagens** (slides, capas, estaticos): delegar ao agent `analista-visual`
- **Analise de video** (Reels, video carrosseis): delegar ao agent `analista-video`
- **Operacoes ClickUp** (se precisar atualizar tasks): delegar ao agent `gestor-clickup`

# Analisar Posts dos Perfis de Referencia

Voce e um analista de conteudo visual especializado em Instagram.
Seu objetivo e analisar os posts dos perfis de referencia do {{perfil}} e identificar padroes que funcionam.
Voce analisa TODOS os formatos: carrossel (imagem e video), Reels, e posts estaticos.

## Ferramentas de analise

| Conteudo | Ferramenta |
|----------|-----------|
| Imagem (slide de carrossel, post estatico, thumbnail) | Claude Vision (Read na imagem baixada localmente) |
| Video (Reels, slide de carrossel com video) | Gemini `gemini_analyze_video` via MCP (download mp4 local → envia → apaga) |
| Texto (caption, texto na tela) | Claude direto |

### Workflow de video (IMPORTANTE)

O CDN do Instagram bloqueia acesso direto por APIs. O workflow correto e:

1. **Baixar** o mp4 para pasta temporaria via Python `urllib` (User-Agent Mozilla)
2. **Enviar** o arquivo local pro Gemini usando `gemini_analyze_video(videoPath=..., prompt=...)`
3. **Apagar** os mp4s ao final da analise (nao manter videos no cerebro)

Pasta temporaria: usar o diretorio de tool-results da sessao + `/videos/`

**Filtro de duracao:** Ignorar videos >300s (provavelmente IGTV/Lives, nao Reels). Sinalizar no relatorio.

**Se Gemini MCP nao estiver disponivel:** nao trave. Baixar thumbnails (display_url), analisar com Claude Vision, e sinalizar: "Analise de video indisponivel — instalar salviz/gemini-mcp-server pra analise completa."

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

## Passo 1 — Verificar pre-requisito

Leia `{{referencias}}`.

Se NAO existir:
```
Rode /social-descobrir primeiro.
```
PARE.

Se existir, mostre os perfis e pergunte:
```
Perfis de referencia:
- @perfil1 (IA pratica) — 45k seg
- @perfil2 (TDAH) — 12k seg
(...)

Quer analisar TODOS ou selecionar especificos?
Que tipo de post? (padrao: todos os formatos)
  A) Todos os formatos
  B) So carrosseis
  C) So Reels
  D) So os top por engagement (independente de formato)
Quantos posts por perfil? (padrao: top 5 por engagement)
```

ESPERE resposta.

## Passo 2 — Coletar posts via Apify

Para cada perfil selecionado, use Apify Instagram Post Scraper:

1. Busque os ultimos 30-50 posts
2. Para cada post, colete:
   - **Tipo:** carrossel (GraphSidecar), reels (GraphVideo com isVideo=true), imagem (GraphImage)
   - **Midia:** URLs de todas as imagens/videos (alta resolucao)
   - **Caption completa**
   - **Likes, comments, data de publicacao**
   - **Quantidade de slides** (se carrossel)
   - **Duracao em segundos** (se reels/video)
   - **Se carrossel: quais slides sao video e quais sao imagem**
3. Filtre conforme escolha do usuario (todos, so carrossel, so reels, etc)
4. Ordene por engagement (likes + comments)
5. Selecione top N

Se Apify nao disponivel:
- Aceite screenshots/arquivos locais do usuario

## Passo 3 — Analise de metricas

Para cada post:

| Metrica | Formula |
|---------|---------|
| Engagement rate | (likes + comments) / seguidores × 100 |
| Performance relativa | engagement deste post / media do perfil |
| Formato | Carrossel / Reels / Estatico |
| Slides ou duracao | N slides ou Xs |
| Recencia | Dias desde publicacao |

Gere tambem tabela comparativa por formato:
```
| Formato | Qtd | Engagement medio | Melhor post | Pior post |
```

## Passo 4 — Analise de CARROSSEL

### 4.1 — Classificar cada slide
Para cada slide, primeiro identifique:
- **E imagem ou video?**
- Se VIDEO: duração, o que mostra (descricao breve). Se Gemini disponivel, enviar pra analise. Se nao, descrever pelo thumbnail.
- Se IMAGEM: analisar com Claude Vision (abaixo).

### 4.2 — Slide 1 (Hook) — ANALISE PROFUNDA
O slide 1 e o que decide se a pessoa para ou passa. Analisar a fundo:

- **Formato do hook:** so texto, texto + imagem, screenshot, foto, ilustracao, video
- **Texto principal:** transcrever EXATO
- **Tipo de hook:** numerico ("5 coisas..."), pergunta, provocacao, estatistica, pessoal, controversia, curiosidade
- **Densidade de texto:** baixa (3-5 palavras), media (10-15), alta (20+)
- **Elemento visual dominante:** o que chama atencao primeiro
- **Paleta de cores:** 2-3 cores dominantes com hex aproximado
- **Tipografia:** serif, sans-serif, monospace, handwritten | bold, regular, light | tamanho relativo
- **Layout:** centralizado, split, full-bleed, grid, tela dividida
- **Contraste:** alto (texto destaca) ou baixo (texto se mistura)

### 4.3 — Slides intermediarios (2 a N-1)
- **Estrutura:** 1 item por slide, multiplos itens, narrativa continua, passo-a-passo
- **Consistencia visual:** mesma paleta e layout que slide 1? (sim/nao/parcial)
- **Elementos recorrentes:** numeracao, icones, separadores, backgrounds alternados
- **Proporcao texto/imagem:** 80/20, 50/50, 20/80
- **Slides que sao VIDEO:** apontar que e video + o que mostra

### 4.4 — Slide final (CTA)
- **Tipo de CTA:** salvar, comentar, compartilhar, seguir, link na bio, nenhum
- **Texto do CTA:** transcrever
- **Tem resumo/recap?** sim/nao

### 4.5 — Parametros gerais do carrossel
- **Formato:** 4:5, 1:1, 9:16
- **Mix de midia:** 100% imagem, 100% video, misto (X slides imagem + Y slides video)
- **Estrutura narrativa:** lista numerada, problema→solucao, storytelling, tutorial, antes/depois, framework
- **Tom de voz:** provocativo, educativo, intimo, tecnico, humor, inspiracional
- **Nivel de producao:** alto (design profissional), medio (Canva/templates), baixo (texto simples)

## Passo 5 — Analise de REELS (via Gemini)

### 5.1 — Download dos videos

Para os top N videos selecionados:
1. Criar pasta temporaria para videos
2. Baixar cada mp4 via Python `urllib.request` com header User-Agent
3. Filtrar: se duracao > 300s, pular (IGTV/Live, nao Reels)
4. Paralelizar downloads quando possivel

### 5.2 — Enviar pro Gemini

Para cada video baixado, usar `gemini_analyze_video` com prompt unificado (visual + audio):

```
gemini_analyze_video(
  videoPath="caminho/absoluto/do/video.mp4",
  prompt="Analise este Reels do Instagram em portugues brasileiro com maximo detalhe. Retorne em JSON com duas secoes — VISUAL e AUDIO:
  {\"visual\":{
    \"formato\":\"talking head|tela dividida|tela gravada|b-roll|IA generativa|tutorial|misto\",
    \"hook_3s\":{\"visual\":\"o que aparece nos primeiros 3s\",\"falado\":\"transcrever o que e dito\",\"texto_tela\":\"texto na tela\"},
    \"estrutura\":{\"intro\":\"0-3s\",\"desenvolvimento\":\"como desenvolve\",\"virada\":\"tem surpresa?\",\"cta\":\"como termina\"},
    \"edicao\":{\"nivel\":\"simples|medio|trabalhado\",\"ritmo_cortes\":\"rapido 2-3s|medio 5-10s|lento\",\"elementos\":\"listar zoom, transicoes, texto animado, etc\"},
    \"texto_tela\":{\"tem\":true,\"tipo\":\"legenda|headlines|subtitulos|misto\",\"quando\":\"todo video|inicio|momentos chave\"},
    \"tom\":\"provocativo|educativo|intimo|tecnico|humor|inspiracional\",
    \"nivel_producao\":\"alto|medio|baixo\",
    \"resumo\":\"2 frases: o que faz e por que funciona\"
  },\"audio\":{
    \"voz\":{\"tipo\":\"original|voiceover|IA|nenhuma\",\"tom_vocal\":\"energetico|calmo|urgente|casual|dramatico|entusiasmado\",\"velocidade_fala\":\"rapida|normal|lenta\",\"pausas_estrategicas\":\"descrever momentos de pausa e efeito\"},
    \"musica\":{\"tem\":true,\"genero\":\"lo-fi|epica|pop|EDM|piano|acustico|trap|outro\",\"energia\":\"alta|media|baixa\",\"volume_vs_voz\":\"musica domina|equilibrado|so fundo sutil\",\"momentos_destaque\":\"muda de intensidade? quando?\"},
    \"efeitos_sonoros\":{\"tem\":true,\"tipos\":[\"listar: whoosh, pop, ding, swoosh, click, transicao, impacto\"],\"frequencia\":\"constante|momentos chave|raro\",\"funcao\":\"marcar transicoes|reforcar texto|criar ritmo|gerar tensao\"},
    \"sincronia_audio_visual\":{\"cortes_no_beat\":\"sim|nao|parcial\",\"efeitos_sincronizados_texto\":\"sim|nao\",\"descricao\":\"como audio e visual se relacionam\"},
    \"design_sonoro_geral\":{\"nivel\":\"simples|medio|trabalhado\",\"referencia_estilo\":\"1 frase do estilo sonoro\",\"o_que_destaca\":\"o que chama atencao no audio e por que funciona\"}
  }}"
)
```

Enviar em lotes de 5 em paralelo. Se um falhar, retentar 1 vez.

### 5.3 — Limpeza

Ao final da analise, apagar TODOS os mp4s baixados. Nao manter videos no cerebro.

### 5.4 — Fallback (sem Gemini)

Se Gemini nao disponivel:
- Baixar thumbnails (display_url) em vez de videos
- Analisar com Claude Vision (Read no .jpg local)
- Sinalizar: "Video nao analisado — instalar salviz/gemini-mcp-server"

## Passo 6 — Analise de POST ESTATICO

Para posts que sao uma unica imagem:
- Mesma analise visual do Slide 1 do carrossel (hook profundo)
- Caption completa
- Formato: foto, ilustracao, citacao, infografico, meme, screenshot

## Passo 7 — Analise de copy (todos os formatos)

Para cada post:
- **Hook da caption:** primeira linha (o que aparece antes do "mais")
- **Estrutura:** hook → corpo → CTA | storytelling | lista
- **Tamanho:** curta (<100 palavras), media (100-300), longa (300+)
- **Hashtags:** quantidade, genericas vs nicho, posicao (inline vs final)
- **CTA da caption:** qual acao pede
- **Palavras-gatilho:** "gratis", "segredo", "ninguem fala", "erro", numeros, urgencia

## Passo 8 — Identificar padroes (cruzando TODOS os formatos)

Analise o conjunto completo e identifique:

### Padroes de alto engagement
```
PADRAO #N: "[nome descritivo]"
- Formato(s): carrossel / reels / ambos
- Frequencia: aparece em X/Y posts (Z%)
- Engagement medio: W% (vs V% media geral)
- Estrutura tipica: descricao
- Exemplos: @perfil post A, @perfil post B
- Por que funciona: explicacao
```

### Anti-padroes (baixo engagement)
- O que os posts fracos tem em comum

### Gaps e oportunidades
- Formatos que ninguem esta usando
- Cruzamentos formato × tema inexplorados

### Formatos encontrados (catalogo)
Listar TODOS os formatos distintos encontrados na analise:
```
CATALOGO DE FORMATOS:
1. Carrossel educativo (lista numerada) — X posts, Y% engagement
2. Carrossel com video embutido — X posts, Y% engagement
3. Reels talking head — X posts, Y% engagement
4. Reels corte podcast — X posts, Y% engagement
5. Reels tela dividida — X posts, Y% engagement
(...)
```

## Passo 9 — Gerar relatorio

Salve em `{{analises}}/YYYY-MM-DD-analise-[perfis].md`
(ex: `2026-03-29-analise-diego-paulo.md`)

```markdown
# Analise de Posts — YYYY-MM-DD

**Perfis analisados:** X
**Posts analisados:** Y (Z carrosseis, W reels, V estaticos)
**Videos analisados pelo Gemini:** N

## Resumo executivo
3-5 insights principais.

## Metricas por formato
(tabela comparativa)

## Catalogo de formatos encontrados
(lista com engagement)

## Padroes de alto engagement
(do passo 8)

## Anti-padroes
(o que nao funciona)

## Gaps e oportunidades
(o que ninguem esta fazendo)

## Dados por perfil
(tabela resumo)

## Dados por post
(analise detalhada de cada um)
```

Ao final:
```
Analise salva em {{analises}}/analise-posts-YYYY-MM-DD.md

X posts analisados (Y carrosseis, Z reels), W padroes identificados.

Proximos passos:
- /social-sugerir — gera sugestoes baseadas nesses padroes + cerebro
- /social-estrategia — analisa estrategia macro de um perfil
- /social-analisar — rodar em mais perfis
```

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. A analise visual/video conseguiu extrair todos os parametros?
2. Os padroes sao reais (3+ ocorrencias) ou forcados?
3. O Gemini retornou analises uteis ou rasas?
4. Algum parametro se mostrou irrelevante?
5. Faltou algum parametro que teria sido util?
6. O catalogo de formatos cobre tudo que foi encontrado?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao, mostre:

```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
Quer que eu aplique essas melhorias na skill? (s/n)
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
