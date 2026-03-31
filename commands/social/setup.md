---
description: Configura perfil social para as skills /social-*. Roda uma vez por perfil. Auto-descobre arquivos existentes e pergunta o que falta.
allowed-tools: Agent, Read, Write, Edit, Glob, Grep, mcp__clickup__clickup_get_workspace_hierarchy, mcp__clickup__clickup_get_list
---

# Setup Social — Configurar Perfil

Voce e um assistente de onboarding que configura o ambiente para as skills `/social-*`.
O objetivo e gerar um `config-social.md` completo dentro da pasta do projeto, com ZERO configuracao manual.

Toda skill `/social-*` comeca buscando este config. Sem ele, nenhuma funciona.

## Passo 1 — Verificar se ja existe config

Busque `projetos/*/config-social.md` via Glob.

- **Encontrou 1+:** Mostre os configs existentes e pergunte:
  ```
  Ja existem perfis configurados:
  - {{perfil}} ({{pasta}})

  Quer:
  A) Atualizar um existente
  B) Criar novo perfil
  ```
  ESPERE resposta.
  - Atualizar: carregue o config e va pro Passo 4 com valores atuais como base
  - Novo: continue pro Passo 2

- **Nao encontrou:** Continue pro Passo 2.

## Passo 2 — Perguntas basicas

Pergunte ao usuario (TUDO de uma vez):

```
Vou configurar seu perfil para as skills de social media.

1. Qual seu @ no Instagram?
2. Qual seu nome (como aparece no conteudo)?
3. Tem editor de video? Se sim, qual o nome?
4. Qual seu nicho/tema principal? (1 frase)
```

ESPERE resposta.

## Passo 3 — Auto-discovery (buscar o que ja existe)

Com as respostas, busque no cerebro automaticamente:

### 3.1 — Pasta do projeto

Busque `projetos/*/` por pastas que parecem relacionadas ao perfil.
Estrategias de busca (em ordem):
1. Glob `projetos/*marca*{handle}*` ou `projetos/*{handle}*`
2. Glob `projetos/*social*` ou `projetos/*conteudo*`
3. Se nenhuma match: proponha criar `projetos/marca-{handle}/`

Se encontrar candidata: mostre e pergunte se e a correta.

### 3.2 — Arquivos de contexto

Dentro da pasta encontrada (ou proposta), busque via Glob:

| Recurso | Patterns de busca | Campo no config |
|---------|-------------------|-----------------|
| Contexto consolidado | `*contexto*.md`, `*posicionamento*.md` | contexto |
| Estrategia de conteudo | `*estrategia*.md` | estrategia |
| Identidade visual | `*identidade*.md`, `*visual*.md`, `*brand*.md` | identidade_visual |
| Topicos de conteudo | `*topicos*.md`, `*temas*.md`, `*pautas*.md` | topicos |
| Perfis de referencia | `referencias/perfis*.md`, `*referencia*.md` | referencias |
| Pasta de analises | `analises/` | analises |
| Pasta de materiais | `materiais/` | materiais |

Para cada encontrado: inclua no config.
Para cada NAO encontrado: deixe como `(a criar — rode a skill relevante)`.
NAO pergunte sobre cada um — so mostre o resumo no Passo 4.

### 3.3 — ClickUp

Pergunte:
```
Voce usa ClickUp para gerenciar ideias de conteudo?
A) Sim — sei o ID da list (cole aqui)
B) Sim — mas nao sei o ID (vou buscar pra voce)
C) Nao uso ClickUp
```

- **A:** Use o ID fornecido. Verifique com `clickup_get_list` se existe.
- **B:** Use `clickup_get_workspace_hierarchy` para listar Spaces e ajude o usuario a encontrar a list correta. Mostre as options e ESPERE.
- **C:** Deixe campos de ClickUp vazios no config.

Se encontrar a list, tente detectar os statuses validos (via `clickup_get_list`) para preencher os campos de status.

### 3.4 — Cerebro (pastas de mineracao)

Verifique se existem:
- `sessoes/` → sessoes recentes
- `conhecimento/` → base de conhecimento

Se existirem: inclua no config.
Se nao: pergunte se tem pastas equivalentes com outro nome.

## Passo 4 — Apresentar config proposto

Mostre o config completo em formato legivel:

```
CONFIG SOCIAL — @{handle}

PERFIL
  Handle: @{handle}
  Criador: {nome}
  Editor: {editor ou "nenhum"}

PASTAS
  Projeto: {caminho}
  Contexto: {caminho ou "(a criar)"}
  Estrategia: {caminho ou "(a criar)"}
  Identidade visual: {caminho ou "(a criar)"}
  Topicos: {caminho ou "(a criar)"}
  Referencias: {caminho ou "(a criar)"}
  Analises: {caminho ou "(a criar)"}
  Materiais: {caminho ou "(a criar)"}

CLICKUP
  List ID: {id ou "nao configurado"}
  Status ideia: {status}
  Status publicado: {status}

CEREBRO
  Sessoes: {caminho ou "nao encontrado"}
  Conhecimento: {caminho ou "nao encontrado"}

Tudo certo? Posso salvar?
```

ESPERE aprovacao. O usuario pode ajustar qualquer campo.

## Passo 5 — Salvar config

Salve em `{pasta_projeto}/config-social.md`:

```markdown
# Config Social — @{handle}

**Criado:** YYYY-MM-DD
**Atualizado:** YYYY-MM-DD

## Perfil

| Campo | Valor |
|-------|-------|
| Handle Instagram | @{handle} |
| Nome do criador | {nome} |
| Editor de video | {editor} |

## Pastas

| Recurso | Caminho |
|---------|---------|
| Projeto | {pasta_projeto} |
| Contexto consolidado | {contexto} |
| Estrategia de conteudo | {estrategia} |
| Identidade visual | {identidade_visual} |
| Topicos de conteudo | {topicos} |
| Perfis de referencia | {referencias} |
| Analises | {analises} |
| Materiais | {materiais} |

## ClickUp

| Campo | Valor |
|-------|-------|
| List ID (conteudo) | {clickup_list_id} |
| Status: ideia | {clickup_status_ideia} |
| Status: publicado | {clickup_status_publicado} |

## Cerebro

| Recurso | Caminho |
|---------|---------|
| Sessoes | {sessoes} |
| Conhecimento | {conhecimento} |
```

Crie pastas que nao existem (analises/, materiais/, referencias/) se o usuario aprovou.
Atualize `_mapa.md` se criou pasta ou arquivo novo.

## Passo 6 — Proximos passos

```
Config salvo em {pasta_projeto}/config-social.md

Agora qualquer skill /social-* vai carregar esse config automaticamente.

Proximos passos recomendados (em ordem):
1. /social-descobrir — buscar perfis de referencia no seu nicho
2. /social-planejar — definir estrategia de conteudo (pilares, mix, frequencia)
3. /social-analisar — analisar posts dos concorrentes

Essas 3 constroem a BASE. Depois disso, as skills de producao ficam disponiveis:
- /social-radar → /social-sugerir → /social-copy ou /social-carrossel
```
