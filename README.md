# Plugin Pique Digital

Workflows completos da Pique Digital para Claude Code e Claude Desktop.

## O que inclui

### Commands (invocados com `/`)

**Rituais Pique:**
- `/pique:bom-dia` — Stand-up matinal (Calendar + ClickUp + diario)
- `/pique:boa-noite` — Fechamento do dia
- `/pique:planejamento-semanal` — Planejamento de segunda
- `/pique:review-semanal` — Review de sexta
- `/pique:pos-reuniao` — Processa transcricao de reuniao
- `/pique:encerrar` — Fecha conversa e distribui pro cerebro/ClickUp
- `/pique:checkup` — Auditoria ClickUp
- `/pique:apresentacao` — Gerador de apresentacao HTML
- `/pique:sincronizar` — Sync Git do cerebro compartilhado
- `/pique:planejar-tasks` — Planejamento iterativo de tasks

**Social Media:**
- `/social:setup` — Configura perfil (1x por perfil)
- `/social:descobrir` — Descobre perfis de referencia
- `/social:analisar` — Analisa posts de referencia
- `/social:estrategia` — Estrategia macro de perfil
- `/social:planejar` — Desenha estrategia de conteudo
- `/social:copy` — Gera headlines + legendas
- `/social:carrossel` — Producao completa de carrossel
- `/social:sugerir` — Cardapio semanal/mensal
- `/social:triagem` — Organiza backlog de ideias
- `/social:radar` — Curadoria de tendencias

**Outros:**
- `/inbox` — Processamento do inbox do cerebro
- `/livro` — Processamento de capitulo de livro

### Agents (executores isolados)

| Agent | Funcao | MCP |
|-------|--------|-----|
| gestor-clickup | CRUD de tasks com regras | ClickUp |
| coletor-instagram | Scraping de perfis/posts | Apify |
| analista-visual | Analise de imagens | Claude Vision |
| analista-video | Analise de video | Gemini |
| estrategista-conteudo | Estrategia de conteudo | — |

## Instalacao

### 1. Pre-requisitos

- Claude Code CLI ou Claude Desktop
- Node.js (para MCPs via npx)
- Conta ClickUp com API token
- (Opcional) Conta Apify para social skills

### 2. Configurar variaveis de ambiente

```bash
# Adicionar ao seu shell profile (.bashrc, .zshrc, etc.)
export PIQUE_CLICKUP_API_KEY="pk_SUA_API_KEY"
export PIQUE_CLICKUP_TEAM_ID="36702200"
export PIQUE_APIFY_TOKEN="apify_api_SEU_TOKEN"  # so se usar social skills
```

### 3. Instalar o plugin

```bash
# Via pasta local (desenvolvimento)
claude --plugin-dir /caminho/para/plugin-pique

# Via marketplace (quando publicado)
# claude plugin add plugin-pique@pique-digital
```

### 4. Configurar identidade

Crie `plugin-pique.local.md` na raiz do projeto onde usa o plugin:

```yaml
---
user_name: Seu Nome
user_clickup_id: "000000"
diarios_path: diarios/
calendarios:
  primary: seu-email@pique.digital
  pique: 409d950b...@group.calendar.google.com
  pessoal: SEU_ID@group.calendar.google.com
---
```

### 5. Testar

```bash
# Verificar se o plugin carregou
/pique:bom-dia
```

## Desenvolvimento

```bash
# Testar localmente
claude --plugin-dir ./plugin-pique

# Validar estrutura
claude plugin validate ./plugin-pique
```
