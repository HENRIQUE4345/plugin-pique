---
name: gestao-pique
description: "Conhecimento de gestao da Pique Digital: regras de criacao de tasks no ClickUp, template de descricao, workflow de status, limites de capacidade, convencoes de nomenclatura. Auto-invoca quando o usuario mencionar ClickUp, tasks, gestao, sprint, prioridade, planejamento, backlog."
---

# Skill: Gestao Pique Digital

## Quando esta skill e relevante

Esta skill deve ser invocada quando o usuario mencionar:
- ClickUp, task, tarefa, backlog, sprint
- Prioridade, prazo, deadline, estimativa
- Gestao, organizacao, planejamento
- Status, workflow, kanban, board

## Regras de criacao de tasks

Toda task no ClickUp DEVE ter:

1. **Nome**: verbo no infinitivo ("Configurar...", "Criar...", "Revisar...")
2. **Assignee**: pelo menos 1 responsavel
3. **Due date**: prazo obrigatorio
4. **Prioridade**: 1 urgente, 2 alta, 3 normal, 4 baixa
5. **Descricao**: usar `markdown_description` com template:

```markdown
## Contexto
Por que essa task existe.

## O que fazer
Passos concretos, numerados.

## Criterio de pronto
Como saber que esta finalizada.
```

6. **Escopo**: fazivel em 1-4h. Maior = dividir.
7. **Pos-criacao**: time_estimate, start_date, dependencias

## Workflow de status

```
A fazer → Essa semana → Hoje → Fazendo → Feito/Finalizado
```

## Limites de capacidade

- Max 2-3 tasks por pessoa por dia
- Max 6-7 tasks por pessoa por semana
- Task empurrada 2+ vezes = bloqueio cronico
- Calendar > ClickUp (reunioes definem teto do dia)

## Comandos disponiveis

- `/pique:bom-dia` — stand-up matinal (puxa tasks do dia)
- `/pique:boa-noite` — fechamento (marca completas, registra pendentes)
- `/pique:checkup` — auditoria completa de um Space
- `/pique:planejar-tasks` — criar tasks com processo iterativo
- `/pique:planejamento-semanal` — planejamento de segunda
- `/pique:review-semanal` — review de sexta

## Agent dedicado

Para operacoes no ClickUp, delegar ao agent `gestor-clickup` que tem:
- MCP ClickUp scoped (nao carrega globalmente)
- Todas as regras embutidas no system prompt
- IDs de Spaces e membros
