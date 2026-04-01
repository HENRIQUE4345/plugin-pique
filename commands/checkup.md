---
description: Check-up de gestao do ClickUp. Auditoria completa de um ou mais Spaces. Execute este fluxo EXATAMENTE, sem pular etapas.
---

Check-up de gestao do ClickUp. Auditoria completa de um ou mais Spaces. Execute este fluxo EXATAMENTE, sem pular etapas.

## Ferramentas

- **TODAS as operacoes ClickUp**: delegar ao agent `gestor-clickup`

> **IMPORTANTE**: Se as tools do ClickUp nao estiverem disponiveis (agent gestor-clickup falhar), avise o usuario: "ClickUp MCP esta desativado. Ative em: VS Code → MCP Servers → clickup → Enable. Depois me chame de novo." NAO tente continuar sem ClickUp — pare e espere.

## Configuracao

- **Workspace ID:** 36702200
- **Spaces profissionais:** Pique Digital (901313561086), Conteudo (901313691844), Studio (901313561098), Yabadoo (901313567191), Beto Carvalho (901313567164)
- **Setup completo:** `pique/infra/clickup-setup.md`
- **Manual ClickUp:** Doc 1301zr-1153 (fonte de verdade das regras)
- **Contexto do processo:** `pique/processos/internos/checkup-gestao.md`
- **Canal de comunicacao:** PIQUE (7-36702200-8)

---

## Fase 0: Escopo (pergunte ao usuario)

Antes de comecar, defina:

1. **Qual Space auditar?** (um especifico ou todos)
2. **Qual foco?** Opcoes:
   - `completo` — auditoria full (limpeza + datas + dependencias + capacidade)
   - `rapido` — so verificar atrasadas, sem dono, sem data
   - `capacidade` — analisar carga por pessoa na semana/mes
   - `rituais` — validar se bom-dia/semanal/review estao funcionando

Se o usuario nao especificar, assuma `completo` no Space que ele indicar.

---

## Fase 1: Coleta de dados (automatico)

Execute em paralelo:

1. **Tasks finalizadas** do Space (include_closed=true, status Finalizado/Entregue)
2. **Tasks abertas** do Space (todos os status exceto Finalizado)
3. **Membros do workspace** (clickup_get_workspace_members)

Calcule:
- Total de tasks (abertas vs finalizadas)
- Dias usando ClickUp (desde primeira task criada)
- Velocidade por pessoa (finalizadas / dias)
- Tasks abertas por pessoa

---

## Fase 2: Analise por Folder (apresente ao usuario)

Para cada Folder do Space, apresente as tasks abertas numa tabela:

| # | Task | Assignee | Due | Status | Problemas |

Marque na coluna "Problemas" qualquer um desses:
- `SEM DONO` — sem assignee
- `SEM DATA` — sem due date
- `SEM VERBO` — nome nao comeca com verbo
- `VENCIDA` — due date ja passou
- `EMPILHADA` — mesmo due date que 3+ tasks da mesma pessoa
- `SEM START` — sem start date (Gantt nao funciona)
- `HORARIO NO NOME` — nome contem horario (deveria ser Calendar)
- `SUBTASK DESNECESSARIA` — subtask que deveria ser checklist

---

## Fase 3: Discussao por bloco (interativo)

Para cada Folder com problemas:

1. Apresente os problemas encontrados
2. Proponha sequencia logica (o que depende do que)
3. Proponha datas redistribuidas respeitando:
   - Max 6-7 tasks por pessoa por semana
   - Start date + due date em toda task
   - Dependencias entre tasks sequenciais
4. **PARE e espere aprovacao** antes de aplicar

Regras:
- Nunca aplique correcoes sem aprovacao
- Agrupe correcoes por Folder (nao misture)
- Mostre a cadeia de dependencias em formato visual (ASCII)
- Se o Folder estiver limpo, diga "Nada pra corrigir" e siga pro proximo

---

## Fase 4: Aplicacao (apos aprovacao)

Para cada bloco aprovado:

1. Atualizar datas (start_date + due_date)
2. Criar dependencias (waiting_on)
3. Renomear tasks com problemas de nome
4. Reassignar se discutido
5. Deletar tasks aprovadas pra remocao
6. Criar tasks novas se necessario (sempre com template de descricao)

---

## Fase 5: Analise de capacidade (opcional, se foco=completo ou capacidade)

Apos todos os Folders:

1. Calcule tasks por pessoa por semana (proximas 4 semanas)
2. Apresente tabela:

| Semana | Henrique | Marco | Arthur | Daniel |
|--------|----------|-------|--------|--------|
| 24-28/03 | X tasks | Y tasks | — | Z tasks |

3. Marque semanas com mais de 7 tasks por pessoa como SOBRECARREGADA
4. Proponha redistribuicao se necessario

---

## Fase 6: Validacao de rituais (opcional, se foco=rituais)

Verifique:

1. **Bom-dia:** tasks estao sendo puxadas pra "Hoje" diariamente?
   - Quantas tasks ficam em "Hoje" sem ser finalizadas no dia?
2. **Planejamento semanal:** tasks estao sendo puxadas pra "Essa semana" nas segundas?
   - A carga por pessoa respeita o teto de 6-7?
3. **Review semanal:** tasks atrasadas estao sendo tratadas nas sextas?
   - Quantas tasks vencem na semana e nao sao finalizadas?

Apresente diagnostico e sugestoes de melhoria.

---

## Fase 7: Resumo e encerramento

1. Apresente resumo do que foi feito:
   - Tasks corrigidas, criadas, deletadas, finalizadas
   - Dependencias criadas
   - Problemas pendentes

2. Se houve mudancas significativas em regras/processo:
   - Atualize o Doc Manual ClickUp (1301zr-1153)
   - Mande mensagem no canal PIQUE

3. Pergunte: "Quer auditar outro Space ou encerramos?"

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. A auditoria encontrou problemas reais ou so ruido?
2. As sugestoes de correcao eram acionaveis e especificas?
3. Alguma regra do clickup-setup.md nao foi verificada?
4. O usuario rejeitou muitas sugestoes? (indica calibragem errada)

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
```

2. Anexe em `pique/infra/melhorias-plugin.md` no formato:
```
## YYYY-MM-DD — checkup (usuario)
- [melhoria 1]
- [melhoria 2]
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
