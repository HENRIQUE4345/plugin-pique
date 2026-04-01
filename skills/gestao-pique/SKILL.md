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

## Regras de gestao

Todas as regras de criacao de tasks, workflow de status, membros, Spaces e limites de capacidade estao em `${CLAUDE_PLUGIN_ROOT}/CLAUDE.md`. Consulte-o para aplicar as regras corretamente.

Resumo rapido:
- Tasks: verbo infinitivo + assignee + due_date + prioridade + descricao estruturada
- Escopo: 1-4h por task. Maior = dividir.
- Limite anti-TDAH: max 2-3 tasks/dia, 6-7/semana por pessoa
- Task empurrada 2+ vezes = bloqueio cronico
- Calendar > ClickUp (reunioes definem teto do dia)

## Comandos disponiveis

- `/plugin-pique:bom-dia` — stand-up matinal (puxa tasks do dia)
- `/plugin-pique:boa-noite` — fechamento (marca completas, registra pendentes)
- `/plugin-pique:checkup` — auditoria completa de um Space
- `/plugin-pique:planejar-tasks` — criar tasks com processo iterativo
- `/plugin-pique:planejamento-semanal` — planejamento de segunda
- `/plugin-pique:review-semanal` — review de sexta

## Agent dedicado

Para operacoes no ClickUp, delegar ao agent `gestor-clickup` que tem:
- MCP ClickUp scoped (nao carrega globalmente)
- Todas as regras embutidas
- IDs de Spaces e membros via CLAUDE.md
