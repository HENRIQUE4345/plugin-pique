---
description: Gera apresentacoes no padrao Pique (casca sidebar + capitulos HTML fragment) no projeto pique-apresentacoes. Execute este fluxo EXATAMENTE, sem pular etapas.
---

Gera apresentacoes no padrao visual da Pique. Cada apresentacao = 1 `manifest.json` + capa opcional + N capitulos em HTML fragment, renderizados pela casca `pique-apresentacoes/_template/`. Deploy em `docs.pique.digital/apresentacoes/{slug}/`.

Argumento opcional: descricao curta do contexto (ex: "reuniao quinzenal Daniel sobre Beto Carvalho" ou "pitch pra novo cliente").

**Projeto destino:** `c:/Users/Henrique Carvalho/Documents/PROGRAMAS/pique-apresentacoes/`

**Contratos (ler antes de gerar):**
- Manifest: `pique-apresentacoes/docs/arquitetura/contrato-manifest.md`
- Capitulo/capa: `pique-apresentacoes/docs/arquitetura/contrato-capitulo.md`
- Biblioteca de componentes: `pique-apresentacoes/docs/arquitetura/biblioteca-componentes.md`

---

## Fase 1: Entender o que precisa

Se o usuario passou argumento, use como ponto de partida. Senao, pergunte:

1. **Qual o contexto?** (reuniao com quem, sobre o que, pitch pra quem, retrospectiva de que)
2. **Qual o objetivo?** (alinhar, apresentar, vender, onboarding, extrair contexto)
3. **Publico?** (interno Pique, cliente, parceiro, time novo)

Classifique o tipo:

| Tipo | Exemplo | Caracteristica | Capa? |
|------|---------|----------------|-------|
| `reuniao-recorrente` | Quinzenal Daniel/Beto | Status + updates + prioridades + definicoes | Opcional (default NAO) |
| `entrega` | Resultado financeiro pro Filipe | O que fizemos + descobertas + o que corrigimos | Opcional (default SIM) |
| `alinhamento` | Reuniao pontual pra decidir algo | Contexto + opcoes + decisoes + proximos passos | Opcional (default NAO) |
| `onboarding` | Novo membro do time | Historia + visao + estrutura + cultura + pedido | SIM |
| `pitch` | Apresentar pra prospect | Problema + solucao + resultados + proposta | SIM |
| `retrospectiva` | Review mensal/trimestral | Numeros + conquistas + aprendizados + proximo ciclo | SIM |
| `custom` | Qualquer outro | Estrutura livre | Perguntar |

ESPERE confirmacao do tipo e do contexto antes de continuar.

---

## Fase 2: Coletar contexto (automatico)

Com base no tipo, busque informacoes em paralelo:

### 2.1 Cerebro
- Consulte `_mapa.md` para encontrar arquivos relevantes ao tema.
- Leia os arquivos identificados (projetos, sessoes, areas).
- Priorize: ultimo estado das coisas, decisoes recentes, numeros atuais.

### 2.2 ClickUp (quando relevante)
Consulte `pique/infra/clickup-setup.md` para IDs.

| Tipo | O que buscar |
|------|-------------|
| reuniao-recorrente | Tasks do Space relevante (status, progresso, bloqueios) |
| entrega | Tasks finalizadas do projeto, dados de resultado |
| alinhamento | Tasks relacionadas ao tema da decisao |
| retrospectiva | Tasks finalizadas no periodo, metricas |
| pitch | Nada (contexto vem do cerebro/usuario) |
| onboarding | Estrutura geral dos Spaces |

### 2.3 Sessoes anteriores
- Se existe sessao ou apresentacao anterior sobre o mesmo tema, leia para continuidade.
- Apresentacoes anteriores migradas moram em `pique-apresentacoes/apresentacoes/{slug}/`.

### 2.4 Google Calendar (quando relevante)
- Se e uma reuniao, confirme data/hora/participantes.

---

## Fase 3: Estruturar a narrativa

### 3.1 Proposta de estrutura

Apresente ao usuario:

```
## Estrutura da Apresentacao: [Titulo]

**Tipo:** [tipo identificado]
**Slug:** [slug sugerido — kebab-case curto, ex: pitch-thiago, retro-q1-2026]
**Para:** [publico]
**Data:** [YYYY-MM-DD]
**Capa:** [sim | nao]  ← conforme tabela da Fase 1

### Capitulos:

1. **[Titulo do cap]** — [o que cobre em 1 frase]
2. **[Titulo]** — [1 frase]
...
N. **[Titulo final]** — [fechamento]

### Componentes visuais planejados por capitulo:
- Capitulo X: stats-grid + timeline (dados: numeros do projeto)
- Capitulo Y: eco-diagram (pique > yababuss > motor)
- Capitulo Z: roadmap com phase-cards
...

### Dados que vou usar:
- [lista dos dados coletados que entram na apresentacao]

### Dados que FALTAM (preciso do usuario):
- [lista]
```

### Esqueletos por tipo (ponto de partida — adapte)

- **pitch:** capa -> problema -> solucao -> resultados -> como funciona -> proposta -> proximo passo
- **entrega:** capa -> o que fizemos -> evidencias -> descobertas -> o que corrigimos -> o que depende -> proximos passos
- **alinhamento:** contexto -> opcoes -> pros/contras -> recomendacao -> decisoes necessarias
- **reuniao-recorrente:** status das entregas -> progresso -> bloqueios -> prioridades -> definicoes
- **onboarding:** capa -> quem somos -> o que fazemos -> como fazemos -> estrutura -> cultura -> o que esperamos
- **retrospectiva:** capa -> numeros -> conquistas -> o que nao funcionou -> aprendizados -> proximo ciclo

ESPERE o usuario aprovar. Se pedir mudancas, ajuste e reapresente. Se faltam dados, pergunte AGORA — nao durante a geracao.

---

## Fase 4: Gerar os arquivos

### 4.1 Criar a pasta do deck

Path base: `c:/Users/Henrique Carvalho/Documents/PROGRAMAS/pique-apresentacoes/apresentacoes/{slug}/`

Criar:
- `apresentacoes/{slug}/manifest.json`
- `apresentacoes/{slug}/capa.html` (se tipo pedir capa)
- `apresentacoes/{slug}/capitulos/NN-slug-capitulo.html` (1 arquivo por capitulo, NN = ordem 01, 02, ...)
- `apresentacoes/{slug}/capitulos/NN-slug-capitulo.js` (opcional, so quando capitulo tem logica nao-trivial: fluxograma interativo, tabs dinamicas, animacao custom com dados)

### 4.2 Escrever `manifest.json`

Seguir `docs/arquitetura/contrato-manifest.md`. Campos minimos:

```json
{
  "$schema": "../../_template/schema/manifest.schema.json",
  "meta": {
    "titulo": "...",
    "slug": "...",
    "tipo": "...",
    "data": "YYYY-MM-DD",
    "publico": "..."
  },
  "capa": { "html": "capa.html" },
  "capitulos": [
    { "slug": "...", "titulo": "...", "numero": "01", "html": "capitulos/01-slug.html" }
  ]
}
```

Se NAO tem capa, omitir o campo `capa`.

### 4.3 Escrever `capa.html` (se aplicavel)

Fragment fullscreen. Obrigatorio ter um elemento `[data-enter]` pra transicao pro deck. Minimo:

```html
<style>
  .capa-content { max-width: 720px; margin: 0 auto; padding: 3rem 2rem; text-align: center; }
  .capa-content .hero-title { font-size: clamp(2.5rem, 7vw, 4.5rem); font-weight: 900; line-height: 1.05; margin-bottom: 1.5rem; opacity: 0; animation: fadeUp 0.8s 0.3s forwards; }
  /* ...demais estilos do hero com fadeUp staggerado... */
</style>

<div class="capa-content">
  <div class="hero-logo"><!-- SVG Pique inline --></div>
  <p class="hero-pretitle">[CONTEXTO] &middot; [CLIENTE]</p>
  <h1 class="hero-title">[Frase forte]<br><span class="gradient-text">[ponto]</span></h1>
  <p class="hero-subtitle">[Subtitulo em 1-2 linhas]</p>
  <p class="hero-meta">Pique Digital &middot; [DD de MES, YYYY]</p>
  <div class="enter-wrap">
    <button type="button" class="deck-enter-btn" data-enter>
      <span>Comecar</span>
    </button>
  </div>
</div>
```

Referencia completa: `pique-apresentacoes/apresentacoes/pitch-thiago/capa.html`.

### 4.4 Escrever os capitulos

Cada capitulo = 1 fragment HTML. Seguir `docs/arquitetura/contrato-capitulo.md`:

- **Sem** `<html>`, `<head>`, `<body>`.
- `<style>` inline no topo com classes prefixadas com `.cap-{slug}` pra nao vazar.
- Usar ingredientes da biblioteca quando fizer sentido (`docs/arquitetura/biblioteca-componentes.md`): `.glass`, `.stats-grid`, `.timeline`, `.reveal`, `.gradient-text`, `.section-label`, etc.
- Inventar HTML custom quando a narrativa pedir algo unico.
- Tamanho tipico: 30-150 linhas por capitulo.

**PRIORIZE narrativa sobre quantidade.** 5 capitulos bem feitos > 12 rasos.

**Componentes reusaveis JS** (declarar em `capitulo.js` + `<script src>` relativo):
- Fluxogramas: `../../../_template/js/fluxograma-svg.js` (funcao `PiqueHub.fluxogramaSvg.render`)
- Teia/funil: `../../../_template/js/teia-funil-svg.js`
- Hub circular: `../../../_template/js/plugin-hub-svg.js`

### 4.5 Autocheck antes de sair da Fase 4

- [ ] `manifest.json` valida contra schema (campos obrigatorios presentes)
- [ ] Todo `capitulos[].html` aponta pra arquivo que existe
- [ ] Nenhum fragment tem `<!DOCTYPE>`, `<html>`, `<head>`, `<body>`
- [ ] CSS inline nos fragments tem prefix `.cap-{slug}` (ou `.capa-content` na capa)
- [ ] Se tem `[data-enter]` na capa, ele funciona (texto claro, classe `.deck-enter-btn`)

---

## Fase 5: Preview e deploy

### 5.1 Preview local

Avise o usuario:

```
Rodando local:
  cd c:/Users/Henrique Carvalho/Documents/PROGRAMAS/pique-apresentacoes
  python -m http.server 8080

Abrir:
  http://localhost:8080/_template/pages/index.html?deck={slug}
```

Pergunte: "Quer que eu suba o server e abra no navegador?" Se sim, rode `python -m http.server 8080 &` e oriente a URL.

### 5.2 Deploy em docs.pique.digital

Pergunte: "Quer que eu faca upload pra `docs.pique.digital/apresentacoes/{slug}/`?"

Se sim, usar MCP `docs-pique__upload_page` pra subir os arquivos (casca + pasta do deck). Upload cobre:
- `_template/` completo (css, js, pages, schema, assets) — pode reutilizar uploads anteriores se ja subido
- `apresentacoes/{slug}/` completo (manifest + capa + capitulos + assets opcionais)

Retornar URL final: `https://docs.pique.digital/apresentacoes/{slug}/` (a casca resolve `_template/pages/index.html?deck={slug}` automaticamente via index.html redirect — se nao existir redirect, usar URL completa).

### 5.3 Distribuicao (oferecer proativamente)

**Drive:** "Quer que eu copie link/PDF export pro Drive compartilhado?"
- Destino: `G:/Drives compartilhados/Pique Digital/Pique Digital/Clientes/[cliente]/Entregas/`

**Calendar:** "Quer que eu crie o evento no Google Calendar?"
- Criar no Pique Agenda com link do deck na descricao.
- Adicionar participantes + Meet.

---

## Regras

- O HTML **nao funciona mais por `file://`** — a casca depende de fetch. Sempre servir (localhost ou docs.pique.digital).
- **Modos narrativo/playbook descontinuados** — a casca-sidebar cobre ambos nativamente. Capitulo pode ter scroll interno longo (narrativo) ou ser compacto (playbook).
- Para reunioes recorrentes: comparar com apresentacao anterior no mesmo slug quando existir (progresso, mudancas). Se o slug ja existe em `apresentacoes/`, perguntar: "Atualizar [slug] existente ou criar novo?"
- O usuario pode passar contexto bruto (transcricao, notas, bullets) — a skill organiza em narrativa.
- Se faltar informacao critica, pergunte antes de gerar. Nao invente dados.
- Comunique-se em portugues brasileiro, direto e sem formalidade.

## Auto-avaliacao (executar sempre ao final)

Avalie:
1. A narrativa ficou clara ou virou lista de bullets?
2. A casca carregou OK no navegador? (usuario confirmou preview)
3. O usuario pediu muitos ajustes? (gap no briefing)
4. Algum padrao novo apareceu em 2+ capitulos desse deck e deveria virar componente reusavel da biblioteca?

Se identificar melhorias CONCRETAS e EVIDENCIADAS:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [melhoria 1]
- [melhoria 2]
```

2. Anexe em `pique/infra/melhorias-plugin.md` no formato:
```
## YYYY-MM-DD — apresentacao (usuario)
- [melhoria 1]
- [melhoria 2]
```

Se promover componente novo pra biblioteca, tambem atualizar `pique-apresentacoes/docs/arquitetura/biblioteca-componentes.md`.

Se nao identificar nada concreto, nao mostre nada. NAO melhore por melhorar.
