Gera apresentacoes HTML no padrao visual da Pique. Execute este fluxo EXATAMENTE, sem pular etapas.

Argumento opcional: descricao curta do contexto (ex: "reuniao quinzenal Daniel sobre Beto Carvalho" ou "pitch pra novo cliente")

---

## Fase 1: Entender o que precisa

Se o usuario passou argumento, use como ponto de partida. Senao, pergunte:

1. **Qual o contexto?** (reuniao com quem, sobre o que, pitch pra quem, retrospectiva de que)
2. **Qual o objetivo?** (alinhar, apresentar, vender, onboarding, extrair contexto)
3. **Publico?** (interno Pique, cliente, parceiro, time novo)

Classifique automaticamente o tipo:

| Tipo | Exemplo | Caracteristica |
|------|---------|----------------|
| `reuniao-recorrente` | Quinzenal Daniel/Beto | Status + updates + prioridades + definicoes |
| `entrega` | Resultado financeiro pro Filipe | O que fizemos + descobertas + o que corrigimos + o que depende do cliente |
| `alinhamento` | Reuniao pontual pra decidir algo | Contexto + opcoes + decisoes necessarias + proximos passos |
| `onboarding` | Novo membro do time | Historia + visao + estrutura + cultura + pedido |
| `pitch` | Apresentar pra prospect | Problema + solucao + resultados + proposta |
| `retrospectiva` | Review mensal/trimestral | Numeros + conquistas + aprendizados + proximo ciclo |
| `custom` | Qualquer outro | Estrutura livre |

ESPERE confirmacao do tipo e contexto antes de continuar.

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
- Busque em `sessoes/` e `inbox/contextos/` por arquivos relacionados.

### 2.4 Google Calendar (quando relevante)
- Se e uma reuniao, confirme data/hora/participantes.

---

## Fase 3: Estruturar a narrativa

Apresente a estrutura proposta em formato visual:

```
## Estrutura da Apresentacao: [Titulo]

**Tipo:** [tipo identificado]
**Para:** [publico]
**Data:** [data]

### Capitulos:

1. **[Titulo Capa]** — [subtitulo]
2. **[Capitulo 1]** — [o que cobre / 1 frase]
3. **[Capitulo 2]** — [o que cobre / 1 frase]
...
N. **[Capitulo Final]** — [fechamento]

### Componentes visuais planejados:
- Secao X: stats-grid (3 cards com numeros)
- Secao Y: roadmap-v2 (fases com metas)
- Secao Z: status-list (checklist visual)
...

### Dados que vou usar:
- [lista dos dados coletados que entram na apresentacao]

### Dados que FALTAM (preciso do usuario):
- [lista do que preciso que o usuario forneça]
```

### Esqueletos narrativos por tipo (ponto de partida — adapte ao contexto)

**entrega:**
1. Capa → 2. O que fizemos (timeline) → 3. Base de dados/evidencias → 4. Descobertas/resultados → 5. O que ja corrigimos → 6. O que depende do cliente → 7. Proximos passos

**alinhamento:**
1. Capa → 2. Contexto/situacao atual → 3. Opcoes na mesa → 4. Pros e contras → 5. Recomendacao → 6. Decisoes necessarias → 7. Proximos passos

**reuniao-recorrente:**
1. Capa → 2. Status das entregas → 3. Progresso vs planejado → 4. Bloqueios → 5. Prioridades → 6. Definicoes necessarias

**onboarding:**
1. Capa → 2. Quem somos → 3. O que fazemos → 4. Como fazemos → 5. Estrutura/ferramentas → 6. Cultura → 7. O que esperamos de voce

**pitch:**
1. Capa → 2. O problema → 3. A solucao → 4. Resultados/cases → 5. Como funciona → 6. Proposta → 7. Proximo passo

**retrospectiva:**
1. Capa → 2. Numeros do periodo → 3. Conquistas → 4. O que nao funcionou → 5. Aprendizados → 6. Proximo ciclo

ESPERE o usuario revisar, editar e aprovar a estrutura.
Se o usuario pedir mudancas, ajuste e apresente de novo.
Se faltam dados, pergunte AGORA — nao durante a geracao.

---

## Fase 4: Gerar o HTML

Gere o arquivo HTML completo seguindo o design system da Pique descrito abaixo.

### Destino do arquivo
- Apresentacoes da Pique: `pique/materiais/apresentacoes/YYYY-MM-DD-apresentacao-[contexto].html`
- Apresentacoes pessoais: `sessoes/YYYY-MM-DD-apresentacao-[contexto].html`
- Se for update de apresentacao existente: sobrescreve o arquivo anterior.

### Regras de geracao

1. **ARQUIVO UNICO** — todo CSS inline no `<style>`, todo JS no final antes de `</body>`. Zero dependencias externas (exceto Google Fonts Inter e Chart.js se tiver graficos).
2. **Cada capitulo = 1 `<section>` full-height** com `min-height: 100vh`.
3. **Toda secao tem** `.section-inner` com `max-width: 960px`.
4. **Classe `.reveal`** em todo elemento que deve animar ao scroll.
5. **Capa sempre** com hero-logo SVG da Pique + hero-title + hero-subtitle + hero-meta + scroll-indicator.
6. **Ultimo capitulo** sempre fecha com frase de impacto + gradient-text + rodape "Pique — [Mes] [Ano]".
7. **Conteudo e narrativa, nao bullet points** — use componentes visuais pra transmitir informacao, nao listas brutas.
8. **Adapte os componentes ao conteudo** — nao force um componente onde nao faz sentido.

---

## Design System Pique — Referencia Completa

### CSS Variables

```css
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-card: rgba(255, 255, 255, 0.03);
  --border-card: rgba(255, 255, 255, 0.07);
  --accent: #E89430;
  --accent-bright: #F0A840;
  --accent-green: #34d399;
  --accent-orange: #E89430;
  --accent-red: #f87171;
  --accent-blue: #60a5fa;
  --text-primary: #f5f0eb;
  --text-secondary: #a09080;
  --text-muted: #6b5e52;
  --gradient-1: linear-gradient(135deg, #E89430 0%, #D07020 100%);
  --gradient-2: linear-gradient(135deg, #F0A840 0%, #E07828 100%);
  --gradient-hero: linear-gradient(135deg, #0a0a0a 0%, #1a1208 40%, #0a0a0a 100%);
}
```

### Tipografia
- Font: `'Inter', system-ui, -apple-system, sans-serif`
- Import: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');`

### Favicon (inline SVG da Pique — sempre incluir)
```html
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 235.99 172.75'%3E%3Cpath fill='%23efa54d' d='M234.6,80.05l-32.87,33.11c-23.99-21.31-129.22-14.61-102.2,11.92,10.02,11.27,4.11,23.22-11.34,36.28-5.81,4.91-12.65,8.54-20.06,10.26-27.14,6.3-49-13.36-11.28-69.82C109.2,23.49,11.17,59.86,0,64.2,31.82,41.48,68.21,27.32,111.8,25.62c11.85.28,14.2,3.96,7.99,17.11,16.61-11.05,1.25-28.37,22.88-42.72,4.89,7.05,8.79,14.36,28.8,20.74,26.37,4.28,38,18.14,42.63,27.38,6.54,14.61,3.03,13.65,18.05,21.27,3.71,1.88,5.13,7.42,2.44,10.66Z'/%3E%3C/svg%3E">
```

### Logo SVG da Pique (hero — sempre na capa)
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 206.77 97.74" style="width: clamp(120px, 18vw, 200px); height: auto;">
  <path fill="var(--accent)" d="M.04,8.81c-.32-1,1.2-1.89,2.21.15,2.68,5.36,6.48,10.43,11.67,13.55,4.78,2.87,10.43,4.53,15.87,5.61,12.11,2.4,24.19.63,36.01-2.46,9.84-2.57,19.24-6.44,28.47-10.66,6.14-2.81,12.18-5.93,18.59-8.12,1.37-.48,2.77-.92,4.2-1.15,18.9-5.05,27.79,6.84,25.19,15.95-3.54,12.03-12.34,20.32-28.61,35.07,24.11,6.72,38.95,16.43,50.01,27.35-31.01-16.37-51.7-22.54-72.72-21.42,3.87-4.27,7.52-8.9,10.14-14.06,1.61-3.16,3.03-6.81,2.77-10.43-.55-7.66-8.51-7.5-14.31-6.99-12.77,1.13-25.52,2.33-38.36,2.17-7.77-.1-15.63-.42-23.21-2.26-6.68-1.59-13.32-4.35-18.52-8.92C2.59,15.49.09,8.91.04,8.81Z"/>
  <path fill="var(--accent)" d="M121.45,59.66c.25.11,10.62-18.01,11.66-19.64,4.05-6.37,8.49-12.48,13.68-17.98,8.48-9,20.48-16.84,33.28-16.54,2.55.06,3.05.85,1.72,3.67,3.57-2.37.27-6.09,4.91-9.18.96,1.39,1.74,2.82,5.17,4.1.6.22,1.22.37,1.84.5,5.08,1.06,7.39,3.84,8.33,5.73,1.4,3.14.65,2.93,3.88,4.57.8.4,1.16,1.64.52,2.29l-7.06,7.11c-5.16-4.58-27.76-3.14-21.95,2.56,7.85,8.83-29.78,19.59-46.5,36.76,0,0-9.48-3.97-9.48-3.97Z"/>
  <path fill="var(--accent)" d="M124.91,70.76c-7.35,7.69-11.87,15.45-16.52,26.98,3.23-11.75,6.25-20.2,10.28-29.08l6.23,2.11Z"/>
</svg>
```

### Estrutura base do HTML

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pique — [Titulo]</title>
[favicon]
[chart.js CDN se necessario]
<style>
  [import Inter]
  [reset: *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }]
  [:root variables]
  [todos os estilos necessarios]
</style>
</head>
<body>

[secoes]

<div style="height: 4rem;"></div>

<script>
[intersection observer para .reveal]
[counter observer se tiver .counter]
[charts se tiver canvas]
</script>
</body>
</html>
```

### Componentes disponiveis

Use APENAS os componentes abaixo. Nao invente novos — combine os existentes de formas criativas.

#### 1. CAPA (obrigatorio em toda apresentacao)
```html
<section id="capa">
  <div class="section-inner">
    <div class="hero-logo" style="opacity:0; animation: fadeUp 0.8s 0.1s forwards; margin-bottom: 2rem;">
      [Logo SVG]
    </div>
    <h1 class="hero-title">[Linha 1]<br><span class="gradient-text">[Destaque]</span></h1>
    <p class="hero-subtitle">[Subtitulo descritivo]</p>
    <div class="hero-pretitle" style="margin-top: 2.5rem; margin-bottom: 0.25rem;">Pique — [Mes Ano]</div>
    <p class="hero-meta" style="margin-top: 0;">[Contexto — Participantes — Data]</p>
  </div>
  <div class="scroll-indicator"><span></span></div>
</section>
```

Hero tem gradient animado (::before com radial-gradient + heroFloat), fade na base (::after), e animations fadeUp escalonadas.

#### 2. SECTION (padrao pra todo capitulo)
```html
<section id="[id]">
  <div class="section-inner">
    <div class="section-label reveal">Capitulo [NN]</div>
    <h2 class="section-title reveal">[Palavra] <span class="gradient-text">[Destaque]</span></h2>
    <p class="section-subtitle reveal" style="margin-bottom: 2.5rem;">[Descricao curta]</p>
    [conteudo com componentes]
  </div>
</section>
```

#### 3. GLASS CARD (container universal)
```html
<div class="glass reveal">
  [conteudo]
</div>
```
Variantes com borda lateral colorida:
```html
<div class="glass reveal" style="border-left: 3px solid var(--accent-green);">
```

#### 4. STATS GRID (numeros em destaque)
```html
<div class="stats-grid">
  <div class="glass stat-card reveal">
    <div class="stat-value"><span class="counter" data-target="[N]" data-suffix="[sufixo]">0</span></div>
    <div class="stat-label">[Label]</div>
  </div>
  [mais cards...]
</div>
```

#### 5. STATUS LIST (checklist visual com icones)
```html
<div class="glass reveal">
  <div class="status-item">
    <div class="status-icon done">✓</div> <!-- done=verde, warn=dourado, miss=vermelho -->
    <div>
      <div style="font-weight:600;">[Titulo]</div>
      <div style="font-size:0.9rem;color:var(--text-secondary);">[Descricao]</div>
    </div>
  </div>
  [mais items...]
</div>
```

#### 6. TIMELINE (historico cronologico)
```html
<div class="timeline">
  <div class="timeline-item">
    <div class="beat-num">Beat [NN]</div>
    <p><strong>[Destaque]</strong> [Descricao]</p>
  </div>
  [mais items...]
</div>
```

#### 7. ECO DIAGRAM (hierarquia visual com setas)
```html
<div class="eco-diagram reveal">
  <div class="eco-box pique">[Titulo]<small>[Subtitulo]</small></div>
  <div class="eco-arrow">↓ [relacao]</div>
  <div class="eco-box yabadoo">[Titulo]<small>[Subtitulo]</small></div>
</div>
```
Classes de cor: `pique` (dourado), `yabadoo` (dourado escuro), `conteudo` (dourado), `sub` (azul), `sub2` (verde).

#### 8. ECO LABELS (grid de cards com icone)
```html
<div class="eco-labels reveal">
  <div class="glass eco-label-card">
    <div class="icon">[emoji]</div>
    <h4>[Titulo]</h4>
    <p>[Descricao]</p>
  </div>
  [mais cards...]
</div>
```

#### 9. ROADMAP V2 (fases com colunas de metas)
```html
<div class="roadmap-v2">
  <div class="glass phase-card reveal">
    <div class="phase-top">
      <div class="phase-icon" style="background: rgba(232, 148, 48, 0.15);"><span>[emoji]</span></div>
      <div class="phase-info">
        <div class="phase-title">[Titulo] <span class="phase-badge now">[Badge]</span></div>
        <div class="phase-desc">[Descricao curta]</div>
      </div>
    </div>
    <div class="phase-goals">
      <div class="goal-col">
        <div class="goal-cat selling">[Categoria]</div>
        <ul>
          <li><strong>[Item]</strong></li>
          <li><span class="metric green">[Metrica]</span></li>
        </ul>
      </div>
      [mais colunas...]
    </div>
  </div>
  [mais fases...]
</div>
```
Phase badges: `now` (dourado), `next` (azul), `future` (verde), `critical` (vermelho), `intense` (laranja), `harvest` (verde), `consolidation` (azul).
Goal categories: `selling` (verde), `content` (laranja), `partnership` (azul), `prospecting` (dourado), `finance` (verde), `product` (dourado), `team` (azul).
Metrics: `green`, `orange`, `blue`, `red`.

#### 10. GOLDEN RULE (grid de papeis lado a lado)
```html
<div class="golden-rule reveal">
  <div class="golden-rule-item">
    <div class="who">[Nome]</div>
    <div class="what">[Responsabilidade]</div>
  </div>
  [mais items...]
</div>
```

#### 11. RITUALS LIST (grid de rituais)
```html
<div class="rituals-list">
  <div class="glass ritual-item reveal">
    <div class="freq">[Frequencia]</div>
    <h4>[Nome]</h4>
    <p>[Descricao]</p>
  </div>
  [mais items...]
</div>
```

#### 12. QUESTION CARDS (grid de perguntas)
```html
<div class="q-grid">
  <div class="glass q-card reveal">
    <span class="q-num">[NN]</span>
    <div>
      <div class="q-text">[Pergunta]</div>
      <div class="q-why">[Motivo]</div>
    </div>
  </div>
  [mais cards...]
</div>
```

#### 13. REWARD GRID (cards numerados)
```html
<div class="reward-grid">
  <div class="glass reward-card reveal">
    <div class="number">[NN]</div>
    <h4>[Titulo]</h4>
    <p>[Descricao]</p>
  </div>
  [mais cards...]
</div>
```

#### 14. ASK CARD (destaque central com numero grande)
```html
<div class="ask-card glass reveal">
  <div class="ask-number">[N]</div>
  <div class="ask-unit">[unidade]</div>
  <p>[texto]</p>
</div>
```

#### 15. TREE (hierarquia visual — arvore de folders)
```html
<div class="glass reveal">
  <ul class="tree">
    <li>
      <span class="tree-item" style="border-color: var(--accent);"><strong>[Root]</strong></span>
      <ul>
        <li><span class="tree-item">[Child]</span>
          <ul>
            <li><span class="tree-item">[Leaf]</span></li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</div>
```

#### 16. GROWTH GRID (cards de crescimento por pessoa)
```html
<div class="growth-grid">
  <div class="glass growth-card reveal">
    <div class="name">[Nome]</div>
    <div class="role">[Papel]</div>
    <ul class="growth-steps">
      <li><span class="period">[Quando]</span><span class="value">[Valor]</span></li>
    </ul>
  </div>
</div>
```

#### 17. ROLES GRID (cards de papeis com emoji)
```html
<div class="roles-grid">
  <div class="glass role-card reveal">
    <div class="emoji">[emoji grande]</div>
    <div class="name">[Nome]</div>
    <div class="title">[Titulo]</div>
    <div class="desc">[Descricao]</div>
  </div>
</div>
```

#### 18. PERSONAL MESSAGES (mensagens pessoais)
```html
<div class="personal-messages">
  <div class="glass personal-msg reveal">
    <div class="to">Para o [Nome]</div>
    <ul>
      <li>[Mensagem]</li>
    </ul>
  </div>
</div>
```

#### 19. CHART (graficos com Chart.js)
Incluir `<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>` no head.
```html
<div class="chart-container reveal">
  <canvas id="[chartId]"></canvas>
</div>
```
Cores padrao dos graficos:
```js
const chartColors = {
  revenue: 'rgba(232, 148, 48, 1)',
  revenueBg: 'rgba(232, 148, 48, 0.15)',
  costs: 'rgba(248, 113, 113, 0.8)',
  costsBg: 'rgba(248, 113, 113, 0.08)',
  margin: 'rgba(52, 211, 153, 1)',
  marginBg: 'rgba(52, 211, 153, 0.15)',
  grid: 'rgba(255, 255, 255, 0.05)',
  text: 'rgba(160, 144, 128, 1)',
};
```

#### 20. CULTURE (quote + values — para secoes de cultura)
```html
<div class="culture-quote reveal">"[Frase]"</div>
<p class="culture-subquote reveal">[Subfrase]</p>
<div class="values-grid">
  <div class="glass value-card reveal">
    <div class="icon">[emoji]</div>
    <h4>[Valor]</h4>
    <p>[Descricao]</p>
  </div>
</div>
```

### JavaScript obrigatorio (sempre incluir)

```javascript
// Intersection Observer — reveal animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .timeline-item').forEach(el => observer.observe(el));

// Counter Animation (se tiver .counter)
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = 1500;
      const start = performance.now();
      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current.toLocaleString('pt-BR') + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));
```

### CSS obrigatorio (sempre incluir)

Fonte de verdade dos estilos: `pique/materiais/design-system-pique.css`

Ao gerar o HTML, copie APENAS os estilos dos componentes que voce usar desse arquivo. NAO invente CSS novo. Se precisar de algo que nao existe, combine os estilos existentes com inline styles.

### Fechamento padrao (obrigatorio)

Toda apresentacao termina com:
```html
<div style="text-align: center; margin-top: 4rem;" class="reveal">
  <p style="font-size: 0.8rem; color: var(--text-muted); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.5rem;">Pique — [Mes] [Ano]</p>
  <p style="font-size: 1.6rem; font-weight: 800;">[Frase de impacto] <span class="gradient-text">[destaque]</span>.</p>
</div>
```

---

## Fase 5: Pos-geracao

1. Salve o HTML no destino correto.
2. Informe o caminho do arquivo.
3. Pergunte: "Quer que eu abra no navegador pra voce revisar?"
4. Se o usuario pedir ajustes, edite o HTML diretamente (nao regenere tudo).

### 5.1 Distribuicao (oferecer proativamente)

Apos o HTML estar pronto, pergunte:

**Drive:** "Quer que eu copie pro Drive compartilhado?"
- Destino padrao: `G:\Drives compartilhados\Pique Digital\Pique Digital\Clientes\[cliente]\Entregas\`
- Se nao souber o cliente, consultar `CLAUDE.md` do Drive pra encontrar a pasta correta.

**Calendar:** "Quer que eu crie o evento no Google Calendar?"
- Se sim, perguntar: horario, duracao, emails dos participantes.
- Criar no calendario Pique Agenda com pauta + link do Drive na descricao.
- Adicionar participantes como convidados + gerar link do Meet.

**Compartilhamento:** O HTML funciona 100% abrindo local no navegador (file://). Pra compartilhar online, opcoes:
- Netlify Drop (mais rapido, sem conta)
- VPS da Pique
- Repo publico no GitHub com Pages

---

## Regras

- O HTML tem que funcionar abrindo direto no navegador (file://). Zero dependencias de servidor.
- NAO use imagens externas. Tudo SVG inline ou emoji.
- PRIORIZE narrativa sobre quantidade. 5 capitulos bem feitos > 12 capitulos rasos.
- Para reunioes recorrentes: compare com a apresentacao anterior quando existir (progresso, mudancas).
- O usuario pode passar contexto bruto (transcricao, notas, bullets) — a skill organiza em narrativa.
- Se faltar informacao critica, pergunte antes de gerar. Nao invente dados.
- Responsive: sempre incluir o media query pra 768px.
- Comunique-se em portugues brasileiro, direto e sem formalidade.

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. A narrativa ficou clara e fluida ou virou lista de bullets?
2. O HTML abriu corretamente no navegador (file://)?
3. O usuario pediu muitos ajustes? (indica gap no entendimento do briefing)
4. O design seguiu o padrao visual da Pique?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao, mostre:

```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
Quer que eu aplique essas melhorias na skill? (s/n)
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
