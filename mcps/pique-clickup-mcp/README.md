# pique-clickup-mcp

MCP custom da Pique Digital pra ClickUp. Substitui o MCP oficial com 11 tools enxutas, operacoes compostas, cache de hierarquia e suporte multi-usuario via role.

## Por que existe

O MCP oficial expoe 58 tools, e o plugin-pique usa so um punhado. As demais carregam ~40k tokens de schema em toda conversa. Alem disso o oficial tem gotchas conhecidos (markdown literal `\n`, `time_estimate` so no update, etc) que o agent `gestor-clickup` precisa contornar manualmente.

Este MCP resolve tudo isso em codigo deterministico.

## Setup

```bash
cd mcps/pique-clickup-mcp
npm install
npm run build
```

## Uso (stdio local)

Adicionar ao `.mcp.json` do plugin-pique:

```json
{
  "mcpServers": {
    "pique-clickup": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcps/pique-clickup-mcp/dist/server.js"],
      "env": {
        "CLICKUP_TOKEN": "${CLICKUP_TOKEN}",
        "PIQUE_CLICKUP_ROLE": "${PIQUE_CLICKUP_ROLE:-editor}"
      }
    }
  }
}
```

## Variaveis de ambiente

| Var | Obrigatoria | Default | Descricao |
|---|---|---|---|
| `CLICKUP_TOKEN` | sim | — | Token API pessoal do ClickUp (`pk_...`) |
| `PIQUE_CLICKUP_ROLE` | nao | `editor` | `owner`, `editor` ou `viewer` |

## Roles

| Role | Tools disponiveis |
|---|---|
| `owner` | Alias de `editor` — sem `delete_task`, nao ha mais o que separar |
| `editor` (default) | Todas as 11 |
| `viewer` | So leitura: `get_task`, `list_tasks`, `list_tags`, `get_hierarchy`, `refresh_hierarchy`, `resolve_member` |

## Tools

1. `create_task_full` — Cria task completa (create + update + validacoes em 1 chamada)
2. `update_task` — Atualiza qualquer campo
3. `get_task` — Le task com datas formatadas e assignees resolvidos
4. `list_tasks` — Filtra tasks por list/folder/space/assignee/status/data
5. `add_comment` — Adiciona comentario
6. `add_tag` / `remove_tag` — Gerencia tags da task
7. `list_tags` — Tags do space
8. `get_hierarchy` — Hierarquia workspace (cacheada)
9. `refresh_hierarchy` — Forca refresh do cache
10. `resolve_member` — Nome → ClickUp ID

**Aposentadas em 2026-07-27:** `move_task`, `delete_task`, `attach_file`, `add_dependency`,
`remove_dependency`, `post_chat_message`. As tres primeiras tinham zero referencia em
`commands/`; `post_chat_message` tinha um dono so, o `/news`, que migrou pro Slack em 16/07.

## Cache

Hierarquia completa do workspace e cacheada em `~/.cache/pique-clickup-mcp/hierarchy.json` com TTL de 1 hora. Refresh manual via `refresh_hierarchy`.

## Validacoes embutidas (no MCP, nao no agent)

- Nome com verbo no infinitivo
- Descricao com 3 secoes obrigatorias (Contexto, O que fazer, Criterio de pronto)
- Time estimate ≤ 4h (rejeita projetos disfarcados)
- Coerencia work_type ↔ list_id
- Policies por pessoa (Gabriel/Daniel)
- Gatilhos proibidos no Contexto (mesclagem, substituicao, etc)
- Sanidade de datas (start ≤ due, ano corrente)

## Desenvolvimento

```bash
npm run dev       # rodar com tsx (sem build)
npm run typecheck # so checar tipos
npm run build     # build pra dist/
```
