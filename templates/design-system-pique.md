# Design System Pique — Referencia Completa

## CSS Variables

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

## Tipografia
- Font: `'Inter', system-ui, -apple-system, sans-serif`
- Import: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');`

## Favicon (inline SVG da Pique — sempre incluir)
```html
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 235.99 172.75'%3E%3Cpath fill='%23efa54d' d='M234.6,80.05l-32.87,33.11c-23.99-21.31-129.22-14.61-102.2,11.92,10.02,11.27,4.11,23.22-11.34,36.28-5.81,4.91-12.65,8.54-20.06,10.26-27.14,6.3-49-13.36-11.28-69.82C109.2,23.49,11.17,59.86,0,64.2,31.82,41.48,68.21,27.32,111.8,25.62c11.85.28,14.2,3.96,7.99,17.11,16.61-11.05,1.25-28.37,22.88-42.72,4.89,7.05,8.79,14.36,28.8,20.74,26.37,4.28,38,18.14,42.63,27.38,6.54,14.61,3.03,13.65,18.05,21.27,3.71,1.88,5.13,7.42,2.44,10.66Z'/%3E%3C/svg%3E">
```

## Logo SVG da Pique (hero — sempre na capa)
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 206.77 97.74" style="width: clamp(120px, 18vw, 200px); height: auto;">
  <path fill="var(--accent)" d="M.04,8.81c-.32-1,1.2-1.89,2.21.15,2.68,5.36,6.48,10.43,11.67,13.55,4.78,2.87,10.43,4.53,15.87,5.61,12.11,2.4,24.19.63,36.01-2.46,9.84-2.57,19.24-6.44,28.47-10.66,6.14-2.81,12.18-5.93,18.59-8.12,1.37-.48,2.77-.92,4.2-1.15,18.9-5.05,27.79,6.84,25.19,15.95-3.54,12.03-12.34,20.32-28.61,35.07,24.11,6.72,38.95,16.43,50.01,27.35-31.01-16.37-51.7-22.54-72.72-21.42,3.87-4.27,7.52-8.9,10.14-14.06,1.61-3.16,3.03-6.81,2.77-10.43-.55-7.66-8.51-7.5-14.31-6.99-12.77,1.13-25.52,2.33-38.36,2.17-7.77-.1-15.63-.42-23.21-2.26-6.68-1.59-13.32-4.35-18.52-8.92C2.59,15.49.09,8.91.04,8.81Z"/>
  <path fill="var(--accent)" d="M121.45,59.66c.25.11,10.62-18.01,11.66-19.64,4.05-6.37,8.49-12.48,13.68-17.98,8.48-9,20.48-16.84,33.28-16.54,2.55.06,3.05.85,1.72,3.67,3.57-2.37.27-6.09,4.91-9.18.96,1.39,1.74,2.82,5.17,4.1.6.22,1.22.37,1.84.5,5.08,1.06,7.39,3.84,8.33,5.73,1.4,3.14.65,2.93,3.88,4.57.8.4,1.16,1.64.52,2.29l-7.06,7.11c-5.16-4.58-27.76-3.14-21.95,2.56,7.85,8.83-29.78,19.59-46.5,36.76,0,0-9.48-3.97-9.48-3.97Z"/>
  <path fill="var(--accent)" d="M124.91,70.76c-7.35,7.69-11.87,15.45-16.52,26.98,3.23-11.75,6.25-20.2,10.28-29.08l6.23,2.11Z"/>
</svg>
```

## Estrutura base do HTML

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

## Modos de apresentacao

Antes de montar a apresentacao, escolha o modo de navegacao:

### Modo narrativo vertical (default)

Scroll vertical full-height, 1 section = 1 capitulo, consumo linear. E o default pra apresentacoes estrategicas, decks de reuniao, relatorios, retrospectivas. Usa os componentes 1-20 normalmente.

### Modo playbook/tabs (navegacao horizontal nao-linear)

Ideal pra playbooks, onboarding, tutoriais, catalogos — conteudo que o leitor acessa por secao especifica, nao linearmente. Cada "capitulo" vira uma tab.

Estrutura minima (substitui `<section>` sequenciais):

```html
<nav class="tab-nav" role="tablist" aria-label="Playbook">
  <button class="tab-btn" role="tab" aria-selected="true" data-tab="tab-1">Introducao</button>
  <button class="tab-btn" role="tab" aria-selected="false" data-tab="tab-2">Processo</button>
  <button class="tab-btn" role="tab" aria-selected="false" data-tab="tab-3">Exemplos</button>
</nav>

<section class="tab-panel" id="tab-1" role="tabpanel" aria-hidden="false">
  <div class="section-inner">[conteudo com componentes]</div>
</section>
<section class="tab-panel" id="tab-2" role="tabpanel" aria-hidden="true">
  <div class="section-inner">[conteudo]</div>
</section>
```

CSS minimo:

```css
.tab-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-card);
  overflow-x: auto;
}
.tab-btn {
  background: transparent;
  border: 1px solid var(--border-card);
  color: var(--text-secondary);
  padding: 0.6rem 1.4rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.tab-btn[aria-selected="true"] {
  background: var(--gradient-1);
  color: #0a0a0a;
  border-color: transparent;
  font-weight: 600;
}
.tab-panel[aria-hidden="true"] { display: none; }
.tab-panel[aria-hidden="false"] { display: block; animation: fadeUp 0.4s ease both; }
```

JS minimo (juntar com o obrigatorio no final):

```javascript
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.setAttribute('aria-selected', b === btn));
    document.querySelectorAll('.tab-panel').forEach(p => p.setAttribute('aria-hidden', p.id !== target));
    history.replaceState(null, '', '#' + target);
  });
});
// Deep-link: se URL tem #tab-X, abre direto
if (location.hash) {
  const btn = document.querySelector(`.tab-btn[data-tab="${location.hash.slice(1)}"]`);
  if (btn) btn.click();
}
```

No modo tabs: capa continua obrigatoria (fora da nav) + ultimo panel pode ter o fechamento padrao. Scroll-indicator (bolinha animada da capa) vira desnecessario — remova.

## Componentes disponiveis

Use APENAS os componentes abaixo. Nao invente novos — combine os existentes de formas criativas.

### 1. CAPA (obrigatorio em toda apresentacao)
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

### 2. SECTION (padrao pra todo capitulo)
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

### 3. GLASS CARD (container universal)
```html
<div class="glass reveal">
  [conteudo]
</div>
```
Variantes com borda lateral colorida:
```html
<div class="glass reveal" style="border-left: 3px solid var(--accent-green);">
```

### 4. STATS GRID (numeros em destaque)
```html
<div class="stats-grid">
  <div class="glass stat-card reveal">
    <div class="stat-value"><span class="counter" data-target="[N]" data-suffix="[sufixo]">0</span></div>
    <div class="stat-label">[Label]</div>
  </div>
  [mais cards...]
</div>
```

### 5. STATUS LIST (checklist visual com icones)
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

### 6. TIMELINE (historico cronologico)
```html
<div class="timeline">
  <div class="timeline-item">
    <div class="beat-num">Beat [NN]</div>
    <p><strong>[Destaque]</strong> [Descricao]</p>
  </div>
  [mais items...]
</div>
```

### 7. ECO DIAGRAM (hierarquia visual com setas)
```html
<div class="eco-diagram reveal">
  <div class="eco-box pique">[Titulo]<small>[Subtitulo]</small></div>
  <div class="eco-arrow">↓ [relacao]</div>
  <div class="eco-box yabadoo">[Titulo]<small>[Subtitulo]</small></div>
</div>
```
Classes de cor: `pique` (dourado), `yabadoo` (dourado escuro), `conteudo` (dourado), `sub` (azul), `sub2` (verde).

### 8. ECO LABELS (grid de cards com icone)
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

### 9. ROADMAP V2 (fases com colunas de metas)
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

### 10. GOLDEN RULE (grid de papeis lado a lado)
```html
<div class="golden-rule reveal">
  <div class="golden-rule-item">
    <div class="who">[Nome]</div>
    <div class="what">[Responsabilidade]</div>
  </div>
  [mais items...]
</div>
```

### 11. RITUALS LIST (grid de rituais)
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

### 12. QUESTION CARDS (grid de perguntas)
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

### 13. REWARD GRID (cards numerados)
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

### 14. ASK CARD (destaque central com numero grande)
```html
<div class="ask-card glass reveal">
  <div class="ask-number">[N]</div>
  <div class="ask-unit">[unidade]</div>
  <p>[texto]</p>
</div>
```

### 15. TREE (hierarquia visual — arvore de folders)
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

### 16. GROWTH GRID (cards de crescimento por pessoa)
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

### 17. ROLES GRID (cards de papeis com emoji)
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

### 18. PERSONAL MESSAGES (mensagens pessoais)
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

### 19. CHART (graficos com Chart.js)
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

### 20. CULTURE (quote + values — para secoes de cultura)
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

### 21. FLOW STEPPER (passos sequenciais com reveal + keyboard nav)

Util em playbooks, onboarding, tutoriais e qualquer fluxo linear de processo. Bolinhas progressivas no topo + 1 passo visivel por vez + botoes Anterior/Proximo + setas teclado.

HTML:
```html
<div class="flow-stepper reveal" data-step="1">
  <div class="stepper-dots" role="tablist">
    <button class="stepper-dot active" data-step="1" aria-label="Passo 1"></button>
    <button class="stepper-dot" data-step="2" aria-label="Passo 2"></button>
    <button class="stepper-dot" data-step="3" aria-label="Passo 3"></button>
  </div>

  <div class="stepper-body">
    <div class="stepper-panel active" data-panel="1">
      <div class="stepper-num">01</div>
      <h3>[Titulo do passo]</h3>
      <p>[Descricao]</p>
    </div>
    <div class="stepper-panel" data-panel="2">
      <div class="stepper-num">02</div>
      <h3>[Titulo]</h3>
      <p>[Descricao]</p>
    </div>
    <div class="stepper-panel" data-panel="3">
      <div class="stepper-num">03</div>
      <h3>[Titulo]</h3>
      <p>[Descricao]</p>
    </div>
  </div>

  <div class="stepper-controls">
    <button class="stepper-prev" aria-label="Passo anterior">← Anterior</button>
    <span class="stepper-count"><span class="current">1</span> / <span class="total">3</span></span>
    <button class="stepper-next" aria-label="Proximo passo">Proximo →</button>
  </div>
</div>
```

CSS:
```css
.flow-stepper { max-width: 720px; margin: 0 auto; }
.stepper-dots { display: flex; gap: 0.6rem; justify-content: center; margin-bottom: 2.5rem; }
.stepper-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--border-card); border: none; padding: 0; cursor: pointer;
  transition: all 0.3s;
}
.stepper-dot.active { background: var(--accent); transform: scale(1.4); }
.stepper-dot.done { background: var(--accent-green); }
.stepper-panel { display: none; text-align: center; }
.stepper-panel.active { display: block; animation: fadeUp 0.4s ease both; }
.stepper-num {
  font-size: 4rem; font-weight: 900; color: var(--accent);
  opacity: 0.3; margin-bottom: 0.5rem; letter-spacing: -0.05em;
}
.stepper-panel h3 { font-size: 1.8rem; margin-bottom: 1rem; }
.stepper-panel p { color: var(--text-secondary); font-size: 1.1rem; line-height: 1.6; }
.stepper-controls {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 2.5rem; gap: 1rem;
}
.stepper-prev, .stepper-next {
  background: transparent; border: 1px solid var(--border-card);
  color: var(--text-primary); padding: 0.6rem 1.2rem; border-radius: 999px;
  cursor: pointer; font-size: 0.9rem; transition: all 0.2s;
}
.stepper-prev:hover, .stepper-next:hover { border-color: var(--accent); color: var(--accent); }
.stepper-prev:disabled, .stepper-next:disabled { opacity: 0.3; cursor: not-allowed; }
.stepper-count { color: var(--text-muted); font-size: 0.85rem; letter-spacing: 0.1em; }
```

JS (juntar com o obrigatorio):
```javascript
document.querySelectorAll('.flow-stepper').forEach(stepper => {
  const panels = stepper.querySelectorAll('.stepper-panel');
  const dots = stepper.querySelectorAll('.stepper-dot');
  const prev = stepper.querySelector('.stepper-prev');
  const next = stepper.querySelector('.stepper-next');
  const current = stepper.querySelector('.stepper-count .current');
  const total = panels.length;
  let idx = 0;

  function go(i) {
    idx = Math.max(0, Math.min(total - 1, i));
    panels.forEach((p, n) => p.classList.toggle('active', n === idx));
    dots.forEach((d, n) => {
      d.classList.toggle('active', n === idx);
      d.classList.toggle('done', n < idx);
    });
    current.textContent = idx + 1;
    prev.disabled = idx === 0;
    next.disabled = idx === total - 1;
  }

  prev.addEventListener('click', () => go(idx - 1));
  next.addEventListener('click', () => go(idx + 1));
  dots.forEach((d, n) => d.addEventListener('click', () => go(n)));

  stepper.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); }
  });
  stepper.setAttribute('tabindex', '0');

  go(0);
});
```

Quando usar: fluxos de 3-7 passos. Mais que isso, quebrar em multiplos steppers ou usar TIMELINE (#6). Menos que 3, usar GLASS CARD (#3) com numeracao simples.

## JavaScript obrigatorio (sempre incluir)

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

## CSS obrigatorio (sempre incluir)

Fonte de verdade dos estilos: `pique/materiais/design-system-pique.css`

Ao gerar o HTML, copie APENAS os estilos dos componentes que voce usar desse arquivo. NAO invente CSS novo. Se precisar de algo que nao existe, combine os estilos existentes com inline styles.

## Fechamento padrao (obrigatorio)

Toda apresentacao termina com:
```html
<div style="text-align: center; margin-top: 4rem;" class="reveal">
  <p style="font-size: 0.8rem; color: var(--text-muted); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.5rem;">Pique — [Mes] [Ano]</p>
  <p style="font-size: 1.6rem; font-weight: 800;">[Frase de impacto] <span class="gradient-text">[destaque]</span>.</p>
</div>
```

## Regras gerais

1. **ARQUIVO UNICO** — todo CSS inline no `<style>`, todo JS no final antes de `</body>`. Zero dependencias externas (exceto Google Fonts Inter e Chart.js se tiver graficos).
2. **Cada capitulo = 1 `<section>` full-height** com `min-height: 100vh`.
3. **Toda secao tem** `.section-inner` com `max-width: 960px`.
4. **Classe `.reveal`** em todo elemento que deve animar ao scroll.
5. **Capa sempre** com hero-logo SVG da Pique + hero-title + hero-subtitle + hero-meta + scroll-indicator.
6. **Ultimo capitulo** sempre fecha com frase de impacto + gradient-text + rodape "Pique — [Mes] [Ano]".
7. **Conteudo e narrativa, nao bullet points** — use componentes visuais pra transmitir informacao, nao listas brutas.
8. **Adapte os componentes ao conteudo** — nao force um componente onde nao faz sentido.
9. **Responsive**: sempre incluir media query pra 768px.
10. **NAO use imagens externas**. Tudo SVG inline ou emoji.
