---
description: Ritual de planejamento semanal. Execute este fluxo EXATAMENTE, sem pular etapas.
---

Ritual de planejamento semanal. Execute este fluxo EXATAMENTE, sem pular etapas.

## Delegacao de agents

- **Operacoes ClickUp** (buscar tasks, criar tasks, atualizar status): delegar ao agent `gestor-clickup`
- **Google Calendar**: chamar diretamente (connector leve)

Este ritual tem 2 tempos: ANTES da reuniao (reconhecimento) e DEPOIS (processamento da transcricao). O usuario vai avisar quando muda de tempo.

## Configuracao

Antes de iniciar, leia `plugin-pique.local.md` na raiz do projeto para obter identidade do usuario.
Consultar CLAUDE.md do plugin para IDs de todos os membros, Spaces e calendarios.

- **Usuarios:** consultar tabela de Membros no CLAUDE.md do plugin
- **Quando:** Segunda, 9:00-10:00
- **Diarios:** `{diarios_path}` do usuario atual (ler de plugin-pique.local.md)
- **Sessao anterior:** buscar `sessoes/*-planejamento-semanal*.md` mais recente

---

## TEMPO 1: PRE-REUNIAO

### Fase 1: Reconhecimento (automatico, NAO pergunte nada ainda)

Execute TUDO em paralelo:

#### 1.1 Sessao anterior

Busque o planejamento semanal mais recente em `sessoes/*-planejamento-semanal*.md`.
Se existir, extraia:
- O que foi definido como prioridade
- Decisoes tomadas
- Tasks criadas
- Notas ou contexto relevante

#### 1.2 ClickUp — Foto completa do board

Consulte `pique/infra/clickup-setup.md` para IDs dos Spaces.

Busque em TODOS os Spaces ativos:
- Pique Digital (901313561086)
- Conteudo (901313561098)
- Yabadoo (901313567191)
- Beto Carvalho (901313567164)
- Pessoal (901313561154)

| O que buscar | Por que |
|---|---|
| Tasks com status "Finalizado" (ultimos 7 dias) | Review: o que foi feito na semana |
| Tasks com status "Hoje" ou "Fazendo" | Ficou pendurado? Nao terminou? |
| Tasks com status "Essa semana" | O que tinha sido definido e nao puxou pra Hoje? |
| Tasks com status "A fazer" | Pool disponivel pra puxar essa semana |

#### 1.3 Google Calendar — Semana inteira

Liste eventos de HOJE ate DOMINGO (todos os calendarios — IDs em plugin-pique.local.md + CLAUDE.md do plugin).

Classifique:
- **Reunioes que consomem bloco:** identificar quanto tempo "produtivo" sobra na semana
- **Reunioes que precisam de prep:** marcar se alguma precisa de preparacao

#### 1.4 Diarios da semana

Leia os diarios dos ultimos 5 dias uteis (`diarios/YYYY-MM-DD.md`).
Extraia:
- Blockers recorrentes
- Tasks extras que surgiram (nao planejadas)
- Notas pra essa semana
- Padroes (ex: "todos os dias travou em X")

#### 1.5 Indicadores de alerta

Cheque rapidamente:
- Audios diarios pararam 3+ dias? (comunicacao quebrou)
- Conteudo parou 2+ semanas? (flywheel travou)
- Planilha financeira desatualizada 2+ semanas?

---

### Fase 2: Briefing

Apresente o reconhecimento neste formato:

```
## Planejamento Semanal — [DD/MM a DD/MM]

### Semana passada — Review rapido

**Definido no ultimo planejamento:**
- [task 1] — Finalizado / Nao feito / Em andamento
- [task 2] — ...

**Feito (nao planejado):**
- [tasks que apareceram e foram feitas]

**Ficou pendurado:**
- [tasks em Hoje/Fazendo/Essa semana que nao foram finalizadas]

**Numeros:** [X] finalizadas | [Y] criadas | [Z] pendentes

---

### Essa semana — Cenario

**Agenda:**
| Dia | Eventos | Tempo produtivo estimado |
|-----|---------|------------------------|
| Seg | [eventos] | [Xh] |
| Ter | [eventos] | [Xh] |
| ... | ... | ... |

**Tempo produtivo total estimado:** ~[X]h (considerando reunioes)

**Pool disponivel (A fazer):**
- [tasks por Space, com prioridade se identificavel]

**Blockers / Alertas:**
- [blockers identificados nos diarios]
- [alertas dos indicadores]

**Contexto do planejamento anterior:**
- [decisoes ou notas relevantes]
```

Depois pergunte (MAXIMO 3 perguntas, diretas):

1. Mudou alguma prioridade desde sexta? Surgiu algo novo?
2. Tem alguma entrega com prazo critico essa semana?
3. (Se tiver reuniao que precisa prep) Precisa preparar algo pra [reuniao X]?

ESPERE a resposta antes de continuar.

---

### Fase 3: Proposta de prioridades

Com base no reconhecimento + respostas:

1. Proponha **3-5 tasks por pessoa** para a semana (maximo 8 total entre os dois).
2. Para cada task, justifique em 1 frase (prazo, dependencia, momentum).
3. Distribua entre Henrique e Marco conforme papeis:
   - **Henrique:** estrategia, arquitetura, specs, conteudo @iairique, financeiro
   - **Marco:** operacao, campo, clientes, prospeccao, conteudo proprio
4. Reserve tempo pra reunioes (brainstorm quarta, review sexta).
5. Sinalize se alguma task precisa de prep antes de uma reuniao.

Formato:

```
## Proposta da semana:

### Henrique (3-5 tasks)
1. **[Task]** — [justificativa] [Space]
2. **[Task]** — [justificativa] [Space]
3. **[Task]** — [justificativa] [Space]

### Marco (3-5 tasks)
1. **[Task]** — [justificativa] [Space]
2. **[Task]** — [justificativa] [Space]
3. **[Task]** — [justificativa] [Space]

### Timeline da semana:
[distribuicao visual dos blocos]

Quer trocar, adicionar ou remover alguma?
```

ESPERE confirmacao antes de continuar.

---

### Fase 4: PAUSA — Reuniao

Diga:

> "Proposta pronta. Agora voces fazem a reuniao. Gravem o audio.
> Quando terminar, cola a transcricao aqui que eu processo."

**NAO faca mais nada ate o usuario voltar com a transcricao ou dizer que terminou.**

---

## TEMPO 2: POS-REUNIAO

### Fase 5: Processar transcricao

Quando o usuario colar a transcricao:

1. **Cruze com o Tempo 1.** Identifique o que e NOVO vs o que ja estava no reconhecimento.
2. **Extraia:**
   - Tasks confirmadas (que ja estavam na proposta)
   - Tasks novas (que surgiram na conversa)
   - Tasks removidas/adiadas (que estavam na proposta mas foram cortadas)
   - Decisoes tomadas (qualquer "vamos fazer X" ou "nao vamos fazer Y")
   - Compromissos de agenda (reunioes marcadas, prazos combinados)
   - Informacoes novas (contexto que nao existia antes)
   - Blockers ou riscos mencionados
3. **NAO repita** o que ja estava no reconhecimento. Foque no delta.

Apresente:

```
## Resultado da reuniao:

### Confirmado (ja estava na proposta):
- [task] → Henrique, prazo [data]
- [task] → Marco, prazo [data]

### Novo (surgiu na reuniao):
- [task] → [quem], [prazo]
- [decisao] — [contexto]

### Removido/Adiado:
- [task] — [motivo]

### Agendar:
- [evento] — [dia, horario, participantes]

### Contexto novo (pra registrar):
- [informacao relevante]

Posso executar?
```

ESPERE confirmacao antes de executar.

---

### Fase 6: Execucao

Apos confirmacao:

#### 6.1 ClickUp
- Mover tasks confirmadas para status **"Essa semana"**
- Criar tasks novas seguindo as regras do CLAUDE.md (verbo, responsavel, prazo, descricao)
- Se alguma task foi removida/adiada, perguntar: volta pra "A fazer" ou fica?

#### 6.2 Google Calendar
- Se houver eventos novos pra agendar, criar no calendario Pique Agenda
- Se alguma reuniao precisa de prep, criar lembrete ou task de prep

#### 6.3 Salvar sessao no cerebro

Crie `sessoes/YYYY-MM-DD-HHMM-planejamento-semanal.md` com:

```markdown
# Sessao — Planejamento Semanal [DD/MM a DD/MM]

**Criado:** YYYY-MM-DD HH:MM
**Status:** ativo
**Tags:** sessao, pique-digital, planejamento

## Contexto
Planejamento semanal de segunda-feira. Henrique + Marco.

## Semana anterior — Review
- [resumo do que foi feito / nao feito]

## Prioridades definidas

### Henrique
- [ ] [task 1]
- [ ] [task 2]
- [ ] [task 3]

### Marco
- [ ] [task 1]
- [ ] [task 2]
- [ ] [task 3]

## Decisoes
- [decisao 1]
- [decisao 2]

## Contexto novo
- [informacoes que surgiram na reuniao]

## Blockers / Riscos
- [blockers identificados]

## Agenda da semana
| Dia | Eventos |
|-----|---------|
| Seg | ... |
| Ter | ... |
| ... | ... |

## Relacionado
- Planejamento anterior: [link se existir]
```

#### 6.4 Gerar mensagem do WhatsApp

Gere a mensagem EXATAMENTE neste formato (pronta pra copiar e colar):

```
Planejamento semana [DD/MM-DD/MM]:

Henrique:
- [task 1]
- [task 2]
- [task 3]

Marco:
- [task 1]
- [task 2]
- [task 3]

Reunioes: [lista ou "so as fixas"]
```

#### 6.5 Encerrar

Diga: "Semana planejada. Tasks no ClickUp, sessao salva, mensagem pronta. Bora pro bloco produtivo."

---

## Regras

- A reuniao de segunda e a UNICA onde se define o que entra na semana. Nao ficar adicionando tasks no meio da semana sem justificativa.
- Respeite o limite de 3-5 tasks por pessoa por semana. Menos e melhor que mais (regra anti-TDAH).
- Se o board ta vazio (sem tasks em A fazer), avise e pergunte o que priorizar.
- O Tempo 2 (pos-reuniao) pode acontecer no mesmo chat ou em outro. Se for outro, o usuario precisa dar contexto minimo ("transcricao do planejamento de segunda").
- Se o usuario nao trouxer transcricao e disser "ja terminamos, nao gravou", pule pra Fase 6 usando apenas o que foi confirmado na Fase 3.
- NAO julgue produtividade. TDAH = semanas variam. Registre e siga.
- Comunique-se em portugues brasileiro, direto e sem formalidade.

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. A carga semanal proposta respeitou o limite de 3-5 tasks por pessoa?
2. Dependencias entre tasks foram mapeadas?
3. O insumo da review de sexta foi aproveitado?
4. O Tempo 2 (pos-reuniao) processou corretamente a transcricao?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao, mostre:

```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
Quer que eu aplique essas melhorias na skill? (s/n)
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
