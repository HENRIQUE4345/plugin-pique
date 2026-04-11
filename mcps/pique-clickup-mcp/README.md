# pique-clickup-mcp

MCP custom da Pique Digital pra ClickUp. Substitui o MCP oficial com 12 tools enxutas, defaults embutidos, operacoes compostas, cache de hierarquia e suporte multi-usuario via role.

## Por que existe

O MCP oficial expoe 58 tools, mas o plugin-pique usa so 17. As 41 restantes carregam ~40k tokens de schema em toda conversa. Alem disso o oficial tem gotchas conhecidos (markdown literal `\n`, `time_estimate` so no update, sem `move_task` v3, etc) que o agent `gestor-clickup` precisa contornar manualmente.

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
| `owner` (Henrique) | Todas as 12 |
| `editor` (Marco, Arthur, Gabriel) | Todas exceto `delete_task` |
| `viewer` | So leitura: `get_task`, `list_tasks`, `get_hierarchy`, `resolve_member` |

## Tools

1. `create_task_full` — Cria task completa (1 chamada = create + update + dependencies + attach)
2. `update_task` — Atualiza qualquer campo
3. `move_task` — Move task entre lists (API v3)
4. `delete_task` — Deleta task (so owner)
5. `get_task` — Le task com datas formatadas e assignees resolvidos
6. `list_tasks` — Filtra tasks por list/folder/space/assignee/status/data
7. `add_comment` — Adiciona comentario
8. `attach_file` — Anexa arquivo (base64)
9. `add_dependency` / `remove_dependency` — Gerencia dependencias
10. `get_hierarchy` — Hierarquia workspace (cacheada)
11. `refresh_hierarchy` — Forca refresh do cache
12. `resolve_member` — Nome → ClickUp ID

## Cache

Hierarquia completa do workspace e cacheada em `~/.cache/pique-clickup-mcp/hierarchy.json` com TTL de 1 hora. Invalidacao automatica apos `move_task`/`delete_task`. Refresh manual via `refresh_hierarchy`.

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
