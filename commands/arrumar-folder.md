---
description: Reorganiza um Folder do ClickUp em 5 fases (audit, diagnose, plan, execute, validate). Delega execucao ao agent gestor-clickup. Execute este fluxo EXATAMENTE, sem pular etapas.
---

Reorganiza um Folder do ClickUp em 5 fases (audit → diagnose → plan → execute → validate). Delega execucao ao agent `gestor-clickup`. Execute este fluxo EXATAMENTE, sem pular etapas.

## Ferramentas

- **TODAS as operacoes ClickUp**: delegar ao agent `gestor-clickup`
- **Leitura de arquivos do cerebro**: Read direto
- **Validacao visual**: pedir screenshot do Gantt ao usuario

> **IMPORTANTE**: Se as tools do ClickUp nao estiverem disponiveis (agent gestor-clickup falhar), avise: "ClickUp MCP esta desativado. Ative em VS Code → MCP Servers → clickup → Enable. Depois me chame de novo." NAO tente continuar sem ClickUp — pare e espere.

## Configuracao e fontes de regras

- **Workspace ID:** 36702200
- **Setup completo:** `pique/infra/clickup-setup.md` (IDs de Spaces/Folders/Lists, membros, statuses)
- **Fundamentos:** `conhecimento/produtividade/clickup-fundamentos-pique.md` (3 tipos de trabalho, 8 policies, granularidade, pipelines mapeadas)
- **Regras de criacao:** agent `plugin-pique/agents/gestor-clickup.md` (campos obrigatorios, Policy #9, faixas de estimativa)
- **Contexto de cliente (se for Folder de cliente):** `pique/clientes/[cliente].md`

**Antes de comecar a Fase 0, leia obrigatoriamente:** `conhecimento/produtividade/clickup-fundamentos-pique.md` e `pique/infra/clickup-setup.md`. Essas sao as fontes de verdade das regras que o skill aplica.

---

## Regras duras (checklist aplicado em cada fase)

### Pre-flight (antes de qualquer operacao)
- [ ] Estado completo do Folder lido (Lists + tasks + subtasks + dependencias + datas + assignees)
- [ ] D-Day / data ancora confirmado com o usuario (ou marcado como "sem ancora")
- [ ] "Reschedule Dependencies" do ClickUp validado (desligado ou usuario consciente)
- [ ] Membros do Space validados (quem tem acesso, quem nao)
- [ ] Plano-fonte (.md) carregado se existir; senao, sinalizar modo descoberta

### Por task criada/editada
- [ ] Verbo no infinitivo no nome ("Criar...", "Configurar...", "Desenhar...")
- [ ] Estimativa entre 30min e 4h (teste das 4h do fundamentos)
- [ ] time_estimate em MILISSEGUNDOS (validar apos retorno do agent que nao virou 180ms)
- [ ] Assignee valido, com acesso ao Space (sem quebrar na API)
- [ ] Criterio de pronto com checkbox claro
- [ ] Contexto = proposito NO TRABALHO, nao historia operacional do ClickUp
- [ ] Referencias no cerebro checadas (arquivos/pastas existem?)

### Por dependencia criada
- [ ] Task referenciada existe (nao e fantasma apontando pra task arquivada/deletada)
- [ ] Faz sentido no Gantt (data da B <= data da A quando A espera B)
- [ ] Nao cria ciclo (A → B → A)

### Pos-execute
- [ ] Gantt visualizado (screenshot do usuario ou descricao)
- [ ] Datas coerentes com dependencias
- [ ] Zero tasks sem assignee ou sem prazo
- [ ] Zero dependencias fantasma
- [ ] Zero estimativas em ms invalidas (< 60000ms = menos de 1min)

---

## Fase 0: Escopo (perguntar ao usuario)

Antes de comecar, defina com o usuario:

1. **Qual Folder?** (nome ou ID). Se for Folder de cliente, carregar `pique/clientes/[cliente].md` em paralelo.
2. **D-Day / data ancora?** (data final do projeto). Se nao houver, marcar "sem ancora — so coesao interna".
3. **Plano-fonte?** (arquivo .md com visao desejada). Se houver, anexar e usar como referencia cruzada. Se nao, entrar em **modo descoberta** (Fase 2 constroi o plano na hora).
4. **"Reschedule Dependencies" esta desligado no workspace?** Avisar: "Settings → ClickApps → Dependencies → desativar Reschedule Dependencies. Senao, o ClickUp vai empurrar datas automaticamente quando eu mexer nas dependencias e voce vai ver caos." Esperar confirmacao OU aceitar "segue assim mesmo".

Se o usuario nao responder em 1-2 tentativas, assumir: sem plano-fonte, sem ancora, Reschedule ligado (avisar risco).

---

## Fase 1: Audit — leitura completa do Folder (automatico)

Delegar ao agent `gestor-clickup` o seguinte briefing:

> Liste o estado completo e real do Folder `[nome]` (ID `[id]`). Para CADA List dentro, retorne TODAS as tasks (inclusive subtasks, inclusive finalizadas, inclusive tasks fora do plano). Para cada task:
> 1. ID, nome, status
> 2. Assignees (nomes resolvidos)
> 3. Due date convertida via Bash (DD/MM/YYYY + dia da semana)
> 4. Start date (se houver)
> 5. time_estimate (Xh Ym — alertar se < 60000ms que e bug)
> 6. Priority
> 7. Parent task (se for subtask)
> 8. Subtasks (lista de IDs + nomes)
> 9. Dependencias: `depends_on` + `blocks`
> 10. URL da task
>
> Retorne em tabelas organizadas por List, ordenadas por due date. Liste dependencias como setinhas separadamente.

Apos receber, apresentar ao usuario um **resumo estruturado**:

```
## Folder: [nome]
### Estatisticas
- Lists: X
- Tasks abertas: Y | finalizadas: Z
- Subtasks: W
- Dependencias ativas: D (+ F fantasmas apontando pra tasks nao-existentes)

### Lists
1. [Nome da List] — X tasks abertas, Y finalizadas
2. ...
```

---

## Fase 2: Diagnose — cruzamento e perguntas cirurgicas

Cruzar o estado atual com o contexto:

### A. Identificar problemas automaticamente

Marcar cada task com os problemas aplicaveis:
- `SEM DONO` — sem assignee
- `SEM DATA` — sem due
- `SEM ESTIMATIVA` — sem time_estimate
- `ESTIMATIVA BUG` — time_estimate < 60000ms (valor salvo errado)
- `VERBO FRACO` — nome nao comeca com verbo acionavel
- `VENCIDA` — due no passado e status ativo
- `DEPENDENCIA FANTASMA` — depends_on ou blocks aponta pra task inexistente
- `CONTEXTO OPERACIONAL` — descricao do Contexto menciona mesclagem/substituicao/renomeacao de tasks, IDs de outras tasks no texto
- `ASSIGNEE SEM ACESSO` — validar com clickup_get_workspace_members
- `SUBTASK ORFA` — subtask cuja task-mae esta finalizada mas ela nao
- `DATA DESCOLADA` — due incoerente com dependencia (A espera B, mas due de A < due de B)

### B. Identificar tasks fora do plano (se houver plano-fonte)

Se houver plano-fonte (.md), listar:
- Tasks do estado atual que NAO estao no plano → candidatas a deletar ou absorver
- Tasks do plano que NAO estao no estado atual → candidatas a criar
- Tasks que existem mas divergem do plano (nome/assignee/data) → candidatas a editar

### C. Se nao houver plano-fonte: reconhecimento de pipeline

Olhar para o Folder e tentar reconhecer o tipo:
- **Folder de cliente diagnostico** (5 Lists tipo: Entrevistas → Mapeamento → Analise → Solucoes → Apresentacao) — aplicar pipeline do `clickup-fundamentos-pique.md` secao 2.4
- **Folder operacional** (tasks de chamado atomico) — validar se todas passam no "teste do verbo"
- **Folder de conteudo** (ideias, roteiro, producao) — validar pipeline 2.2 do fundamentos
- **Outro** — tratar generico

### D. Apresentar diagnostico + 3-5 perguntas cirurgicas ao usuario

Formato:
```
## Diagnostico do Folder [nome]

**Problemas encontrados (N):**
- [categoria]: X tasks — [exemplos]

**Tasks fora do plano (se houver):** ...
**Tasks faltando do plano:** ...

**Perguntas pra decidir o plano de acao:**
1. [pergunta provocativa 1]
2. [pergunta provocativa 2]
3. [pergunta provocativa 3]
```

**Regra das perguntas:** 3-5 provocativas, nao survey longo (memory `feedback_perguntas_cirurgicas`). Cada uma deve forcar uma decisao que afeta multiplas operacoes no plano.

**PARE e espere respostas.**

---

## Fase 3: Plan — proposta de operacoes em blocos

Com base no diagnostico + respostas do usuario, montar o plano em 4 blocos numerados:

```
## Plano de operacoes — Folder [nome]

### BLOCO 1 — DELETE (N tasks)
1. `ID` "Nome da task" → motivo (1 linha)
2. ...

### BLOCO 2 — EDIT (N tasks)
1. `ID` "Nome" → mudancas (nome/descricao/assignee/due/estimativa)
2. ...

### BLOCO 3 — CREATE (N tasks novas)
1. Nome → dono, due, estimativa, work_type, posicionamento no fluxo
2. ...

### BLOCO 4 — LINK (N dependencias)
1. A (ID) espera B (ID) — motivo
2. ...
```

**Cada operacao tem "por que" de 1 linha.** Sem justificativa = nao executa.

**Apresentar o plano completo ao usuario e perguntar:**
> "Aprovas o plano inteiro? Vou executar em modo hibrido: Bloco 1 (DELETE) pausa antes pra confirmacao explicita porque e irreversivel. Blocos 2, 3, 4 correm em sequencia apos sua aprovacao geral."

**PARE e espere aprovacao.**

---

## Fase 4: Execute — bloco por bloco (modo hibrido)

### Bloco 1 — DELETE (SEMPRE pausa)

1. Relembrar ao usuario a lista de delecao
2. Perguntar: **"Confirma DELETE das N tasks listadas? (sim/nao)"**
3. Se sim → delegar ao `gestor-clickup` pra deletar todas em sequencia
4. Relatar: IDs deletadas, qualquer erro

### Bloco 2 — EDIT

Delegar ao `gestor-clickup` todas as edicoes em sequencia. Briefing explicito por task. Validar retornos:
- time_estimate salvou em ms correto (>= 900000 ms = 15min)
- Assignees aplicados
- Dependencias antigas limpas se nome/escopo mudou

### Bloco 3 — CREATE

Delegar ao `gestor-clickup` com spec completa por task (Policy #9, work_type, estimativa, assignee, due). O agent ja rejeita specs incompletas — confiar nele.

### Bloco 4 — LINK (dependencias)

Delegar criacao das dependencias `waiting_on`. Antes de cada uma, validar que A e B existem (nao foi deletada no bloco 1 por engano).

Apos cada bloco, **relatorio curto:**
```
### Bloco X — RESULTADO
- Sucesso: N
- Erros: N (detalhar)
- Proximo bloco: Y (ou "FIM")
```

---

## Fase 5: Validate — checagem visual + sanity checks

1. **Pedir screenshot do Gantt** do Folder pro usuario:
   > "Me manda um screenshot do Gantt do Folder agora. Vou validar se as datas refletem as dependencias e se nao ha caos visual."

2. Ao receber, validar visualmente:
   - Cadeias de dependencias desenham setinhas coerentes (A antes de B)
   - Nenhuma barra puxando pra frente ou pra tras sem razao
   - D-Day marcado corretamente

3. Rodar sanity checks finais via `gestor-clickup`:
   - Listar novamente o Folder (so tasks abertas) com foco em: data, dependencia, estimativa, assignee
   - Confirmar zero problemas das categorias da Fase 2.A

4. Listar **pendencias humanas** que o skill nao consegue resolver:
   - Config do ClickUp (Reschedule Dependencies, ClickApps)
   - Acesso de membros ao Space
   - Agendamentos externos (Calendar)
   - Delecao manual de Lists (MCP nao tem delete_list)

---

## Fase 6: Encerramento

1. Resumo final em bloco:
```
## Reorganizacao do Folder [nome] — RESUMO

**Delete:** N tasks
**Edit:** N tasks
**Create:** N tasks
**Link:** N dependencias

**Pendencias humanas:**
- [lista]

**Estado final:**
- Tasks abertas: N
- Caminho critico: [descricao curta]
- D-Day: [data]
```

2. Se houver plano-fonte (.md), **atualizar o plano** com o estado final (datas reais, IDs novos, mudancas de escopo). Mover o plano processado pra `inbox/contextos/processados/` ou equivalente.

3. Perguntar: **"Quer arrumar outro Folder ou encerramos?"**

---

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:

1. **Retrabalho:** alguma task foi criada e depois editada ou deletada na mesma sessao? (sinal de plan fraco)
2. **Rejeicao:** o usuario rejeitou alguma proposta do plano? (sinal de diagnostico raso)
3. **Gaps da audit:** apareceu algum problema na Fase 4 que nao foi detectado na Fase 1? (sinal de checklist incompleto)
4. **Gantt pos-execucao:** o visual ficou coerente ou precisou de ajuste extra? (sinal de Fase 3 incompleta)
5. **Bugs do agent:** alguma operacao retornou dado corrompido (time_estimate em ms errado, date com offset, etc)?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [descricao da melhoria 1, com evidencia]
- [descricao da melhoria 2, com evidencia]

Quer que eu ajuste a skill pra prevenir isso proxima vez?
```

2. Se o usuario aprovar, **editar este proprio arquivo** (`${CLAUDE_PLUGIN_ROOT}/commands/arrumar-folder.md`) incorporando as melhorias em:
   - Checklist de regras duras (se for validacao nova)
   - Categorias de problemas da Fase 2.A (se for bug/anti-padrao novo)
   - Fase especifica (se for passo faltando)

3. Anexar tambem em `pique/infra/melhorias-plugin.md`:
```
## YYYY-MM-DD — arrumar-folder [Folder auditado] (usuario)
- [melhoria aplicada no arquivo X, linhas Y]
- [melhoria aplicada no arquivo X, linhas Y]
```

Se nao identificar nada concreto, nao mostre nada. **NAO melhore por melhorar.**
