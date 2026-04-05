---
description: Fechamento semanal da empresa. Reuniao conjunta Henrique+Marco. Pauta escrita + timer 45min. Consome os reviews pessoais. Execute EXATAMENTE.
---

Fechamento semanal da Pique Digital. Reuniao conjunta, formato pauta + timer. Execute este fluxo EXATAMENTE, sem pular etapas.

Este ritual e o IRMAO do `/pique:review-semanal` (pessoal). Primeiro cada socio roda o review pessoal dele; depois os dois juntos rodam este fechamento. Telemetria individual NAO entra aqui — e empresa.

## Ferramentas

- **Operacoes ClickUp** (buscar tasks do time todo, criar tasks, atualizar): delegar ao agent `gestor-clickup`
- **Google Calendar**: chamar diretamente (connector leve)

> **IMPORTANTE**: Se as tools do ClickUp nao estiverem disponiveis (agent gestor-clickup falhar), avise o usuario: "ClickUp MCP esta desativado. Ative em: VS Code → MCP Servers → clickup → Enable. Depois me chame de novo." NAO tente continuar sem ClickUp — pare e espere.

## Configuracao

- **Quando:** Sexta, apos os 2 reviews pessoais terem rodado (geralmente 17h, depois das 16h de review individual)
- **Quem:** Henrique + Marco juntos na mesma sala/call
- **Formato:** Reuniao com pauta escrita + timer 45min (memoria: reunioes sempre com pauta + timer)
- Consultar `CLAUDE.md` do plugin para IDs de Spaces, Folders e calendarios.

---

## Fase 0: Pre-requisito — carregar reviews pessoais

Busque as sessoes de review pessoal mais recentes em `sessoes/`:

- `sessoes/YYYY-MM-DD-*-review-semanal-henrique.md`
- `sessoes/YYYY-MM-DD-*-review-semanal-marco.md`

Ambas devem ser da MESMA semana (ou seja, datadas desta sexta ou quinta). Se faltar uma:

- **Falta Henrique:** "Review pessoal do Henrique nao encontrado esta semana. Roda `/pique:review-semanal` antes de continuar. Parando aqui."
- **Falta Marco:** "Review pessoal do Marco nao encontrado esta semana. Ele precisa rodar `/pique:review-semanal` antes. Parando aqui."

NAO prossiga sem os dois reviews. Eles sao a MATERIA-PRIMA da Fase 2.

Extraia de cada review a secao "Levar pro fechamento" (e a ponte que o review-semanal prepara — destaques, bloqueios, decisoes a propor, proxima semana).

---

## Fase 1: Coleta automatica — escopo EMPRESA (paralelo, NAO pergunte nada)

Execute TUDO em paralelo. Filtro obrigatorio: empresa, nao pessoal. Nada de `Space Pessoal`, nada de diarios individuais, nada de telemetria de tempo no Claude.

### 1.1 ClickUp — tasks do time todo (sem filtro por assignee)

Delegar ao agent `gestor-clickup`. Buscar em TODOS os Spaces da empresa:

- Pique Digital (901313561086)
- Conteudo (901313561098)
- Yabadoo (901313567191)
- Beto Carvalho (901313567164)

NAO incluir Space Pessoal (901313561154) — esse e individual.

| O que buscar | Agrupar por |
|---|---|
| Tasks "Finalizado" (ultimos 7 dias) | Space + assignee |
| Tasks "Hoje" ou "Fazendo" | Assignee |
| Tasks "Essa semana" nao puxadas | Assignee |
| Tasks criadas na semana | Space |
| Tasks `waiting_on` (dependencias abertas) | Quem bloqueia quem |

### 1.2 Status projetos Pique por cliente/produto

Cruze as tasks da 1.1 com a estrutura de Folders. Monte um sumario tipo:

```
Beto: X tasks finalizadas, Y em andamento, Z atrasadas
Miika: ...
AtendeAI: ...
Yabadoo: ...
Studio: ...
```

Se nao houver movimento em algum cliente, destaque: "Miika: sem movimento esta semana".

### 1.3 Google Calendar — semana que passou + proxima semana

Liste eventos dos calendarios de EMPRESA:
- Pique Agenda (409d950b004a4b8e6eebb6c649945d5308c83b26c58415d738e4e93ef1a1c83c@group.calendar.google.com)
- Agendas pessoais do Henrique e Marco **apenas para identificar conflitos com empresa** (nao pra listar eventos privados)

Identifique:
- Reunioes da empresa na semana que passou
- Reunioes da empresa marcadas pra proxima semana
- Conflitos de agenda entre H e M

### 1.4 Decisoes da semana — dos 2 reviews pessoais

Extraia dos arquivos carregados na Fase 0 a lista de "decisoes de empresa que quero propor" de cada um. E a interseccao/uniao do que cada socio leva.

### 1.5 Bloqueios entre pessoas

Combine 2 fontes:
- Tasks ClickUp com dependencia `waiting_on` cruzando entre Henrique e Marco (task do H esperando algo do M, ou vice-versa)
- Secao "Bloqueios que dependem do outro socio" dos 2 reviews pessoais

---

## Fase 2: Pauta escrita com timer 45min

Apresente a pauta consolidada ANTES da reuniao. Timer e sagrado — 45min total, dividido em 6 blocos. Este e o deliverable principal da Fase 2.

```
## Fechamento Semana [DD/MM a DD/MM] — Pique Digital

**Participantes:** Henrique + Marco
**Timer: 45min total**
**Pauta escrita (nao improvisar):**

---

### [5min] Status projetos
- Beto: [sumario da 1.2]
- Miika: [sumario]
- AtendeAI: [sumario]
- Yabadoo: [sumario]
- Studio: [sumario]

---

### [10min] O que cada um trouxe do review pessoal
- **Henrique:** [destaques da secao "Levar pro fechamento" do review dele]
- **Marco:** [destaques da secao "Levar pro fechamento" do review dele]

---

### [10min] Bloqueios entre pessoas
- [bloqueio 1] — depende de [quem], resolve como?
- [bloqueio 2] — ...

(Se nenhum: "Sem bloqueios cruzados esta semana")

---

### [10min] Decisoes pendentes da empresa
- [decisao 1 proposta pelo H / M] — contexto: [...]
- [decisao 2] — ...

---

### [5min] Proxima semana — Calendar + compromissos
- [evento 1] — SEG HH:MM — quem
- [evento 2] — ...
- Reunioes ja marcadas: [lista]

---

### [5min] Wrap — acoes pos-reuniao
- Quem faz o que apos a reuniao
- Proximo fechamento: [DD/MM] sexta
```

Apresente e diga:

> "Pauta pronta. 45min no timer. Quando começar a reuniao, avisem. Eu espero a transcricao no fim."

---

## Fase 3: PAUSA — Reuniao

Diga:

> "Começa o timer. Gravem o audio. Quando terminar, cola a transcricao aqui que eu processo e executo."

**NAO faca mais nada ate o usuario voltar com a transcricao.**

Se a reuniao aconteceu sem gravacao, aceitar. O usuario pode resumir oralmente via texto e voce processa.

---

## Fase 4: Processar transcricao (pos-reuniao)

Quando o usuario colar a transcricao:

1. **Cruze com a pauta da Fase 2.** Identifique o DELTA (o que e novo vs o que ja estava na pauta).
2. **NAO duplique** coisas que ja estao nos reviews pessoais. Foque no que EMERGIU da conversa entre os dois.
3. **Extraia:**
   - Decisoes DE EMPRESA tomadas na reuniao (cada "vamos fazer X" com motivo)
   - Tasks novas pro TIME (com responsavel, prazo, prioridade)
   - Compromissos de agenda novos (reunioes marcadas)
   - Ajustes em processos/estrategia da empresa
   - Contexto novo sobre clientes (Beto, Miika, AtendeAI, Yabadoo, Studio)

Apresente:

```
## Resultado do fechamento:

### Decisoes de empresa
1. [decisao] — Motivo: [por que] — Dono: [H/M/ambos]

### Tasks novas (time)
- Criar: [task] → [quem], [prazo], [Space/Folder]
- Cancelar/adiar: [task] — [motivo]

### Compromissos agendados
- [evento] — [dia, horario, participantes]

### Ajustes em processo/estrategia
- [ajuste] — [o que muda]

Posso executar?
```

ESPERE confirmacao antes de executar.

---

## Fase 5: Execucao

Apos aprovacao:

### 5.1 ClickUp
- Criar tasks novas de empresa conforme a pauta + transcricao
- Delegar TUDO ao agent `gestor-clickup` (specs completas: verbo, assignee, prazo, prioridade, markdown_description com Contexto/O que fazer/Criterio de pronto)
- Atualizar status de tasks mencionadas como fechadas na reuniao

### 5.2 Google Calendar
- Criar eventos no calendario Pique Agenda pra novos compromissos
- Adicionar Henrique + Marco como convidados (outros participantes se mencionados)
- Incluir pauta/contexto na descricao do evento

### 5.3 Salvar sessao

Crie `sessoes/YYYY-MM-DD-HHMM-fechamento-semana.md` (**SEM sufixo de user — e da empresa**):

```markdown
# Sessao — Fechamento Semana [DD/MM a DD/MM]

**Criado:** YYYY-MM-DD HH:MM
**Status:** ativo
**Tags:** sessao, pique-digital, fechamento-semana, empresa

## Contexto
Fechamento semanal da Pique Digital. Henrique + Marco. Reuniao conjunta com pauta + timer.

## Reviews pessoais (inputs)
- [link review-semanal-henrique.md]
- [link review-semanal-marco.md]

## Pauta (45min)
[conteudo da Fase 2 compacto]

## Decisoes da reuniao
- [decisao 1] — Motivo: [por que]
- [decisao 2] — Motivo: [por que]

## Tasks criadas
- [task] → [quem, prazo]

## Compromissos agendados
- [evento]

## Ajustes em processo/estrategia
- [ajuste]

## Proximo fechamento
[DD/MM] sexta.
```

### 5.4 Atualizar _mapa.md
Adicione entrada da nova sessao.

### 5.5 Encerrar
Diga: "Semana fechada. Sessao salva em `sessoes/`, ClickUp atualizado, Calendar atualizado. Bom fim de semana."

---

## Regras

- **Empresa, nao pessoal.** Tasks pessoais, diarios individuais, conteudo individual, telemetria de tempo no Claude — TUDO isso fica fora. Esses dados ja foram processados nos reviews individuais.
- **Pauta escrita + timer SEM EXCEÇÃO.** Reuniao sem pauta vira conversa sem fim. Memoria: reunioes com pauta e timer.
- **45min e o teto.** Se extrapolar, marca continuação e para.
- **Sem sermao, sem julgamento.** Se a semana foi ruim, registra e segue. TDAH = variacao.
- **Nao duplique com os reviews pessoais.** O delta da reuniao e o que a conversa entre os dois produziu — nao o que cada um ja sabia sozinho.
- **Bloqueios entre pessoas e prioridade**: se tem bloqueio nao resolvido, a reuniao nao termina sem definir proximo passo.
- Comunique-se em portugues brasileiro, direto e sem formalidade.

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. A pauta foi factual e fechada em 45min ou extrapolou?
2. Os 2 reviews pessoais foram efetivamente consumidos (Fase 0/1.4/1.5) ou ignorados?
3. Houve duplicacao com conteudo ja presente nos reviews individuais?
4. Bloqueios entre pessoas foram abordados com resolucao concreta?
5. Telemetria individual vazou pra ca (se sim, retirar)?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
```

2. Anexe em `pique/infra/melhorias-plugin.md` no formato:
```
## YYYY-MM-DD — fechamento-semana (usuario)
- [melhoria 1]
- [melhoria 2]
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
