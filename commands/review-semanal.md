---
description: Ritual de review semanal. Execute este fluxo EXATAMENTE, sem pular etapas.
---

Ritual de review semanal. Execute este fluxo EXATAMENTE, sem pular etapas.

## Delegacao de agents

- **Operacoes ClickUp** (buscar tasks, criar tasks, atualizar status): delegar ao agent `gestor-clickup`
- **Google Calendar**: chamar diretamente (connector leve)

Este ritual tem 2 tempos: ANTES da reuniao (reconhecimento) e DEPOIS (processamento da transcricao). O usuario vai avisar quando muda de tempo.

## Configuracao

Antes de iniciar, leia `plugin-pique.local.md` na raiz do projeto para obter identidade do usuario.
Consultar CLAUDE.md do plugin para IDs de todos os membros, Spaces e calendarios.

- **Usuarios:** consultar tabela de Membros no CLAUDE.md do plugin
- **Quando:** Sexta, primeiro horario
- **Prep Marco:** pauta (feito/travou/metricas) ate quinta a noite ou sexta de manha
- **Prep Henrique:** planilha financeira atualizada ate sexta de manha
- **Sessao anterior:** buscar `sessoes/*-review-semanal*.md` mais recente
- **Planejamento da semana:** buscar `sessoes/*-planejamento-semanal*.md` mais recente

---

## TEMPO 1: PRE-REUNIAO

### Fase 1: Reconhecimento (automatico, NAO pergunte nada ainda)

Execute TUDO em paralelo:

#### 1.1 Sessao do planejamento de segunda

Busque `sessoes/*-planejamento-semanal*.md` mais recente.
Extraia:
- Tasks definidas por pessoa (Henrique e Marco)
- Decisoes tomadas
- Blockers identificados
- Contexto/notas relevantes

Se NAO existir sessao de planejamento dessa semana, sinalize: "Sem planejamento registrado essa semana — vou comparar direto com o ClickUp."

#### 1.2 ClickUp — Foto completa da semana

Consulte `pique/infra/clickup-setup.md` para IDs.

Busque em TODOS os Spaces ativos:
- Pique Digital (901313561086)
- Conteudo (901313561098)
- Yabadoo (901313567191)
- Beto Carvalho (901313567164)
- Pessoal (901313561154)

| O que buscar | Por que |
|---|---|
| Tasks com status "Finalizado" (ultimos 7 dias) | O que foi feito |
| Tasks com status "Hoje" ou "Fazendo" | O que ficou em andamento |
| Tasks com status "Essa semana" | O que foi definido mas nao foi puxado |
| Tasks criadas essa semana (qualquer status) | O que surgiu no meio do caminho |

#### 1.3 Diarios da semana

Leia os diarios dos ultimos 5 dias uteis (`diarios/YYYY-MM-DD.md`).
Extraia:
- Blockers recorrentes
- Tasks extras que surgiram (nao planejadas)
- Padroes (ex: "3 dias travou no mesmo tema", "nenhum check-out registrado")
- Notas relevantes

#### 1.4 Google Calendar — Semana que passou

Liste eventos de SEGUNDA ate HOJE (todos os calendarios — IDs em plugin-pique.local.md + CLAUDE.md do plugin).

Identifique:
- Reunioes que aconteceram (consumiram tempo produtivo)
- Reunioes que NAO aconteceram (canceladas/remarcadas)

#### 1.5 Checagem de alertas

- Planilha financeira (`pique/financeiro/resumo-financeiro.md`): foi atualizada essa semana?
- Stand-ups: quantos dias tiveram check-in e check-out nos diarios?
- Conteudo: houve progresso em tasks do Space Conteudo?

#### 1.6 Review anterior

Busque `sessoes/*-review-semanal*.md` mais recente (semana passada).
Extraia:
- Decisoes que foram tomadas — foram executadas?
- Ajustes propostos — foram implementados?
- Pendencias que ficaram — foram resolvidas?

---

### Fase 2: Placar da semana

Apresente neste formato:

```
## Review Semanal — [DD/MM a DD/MM]

### Placar

**Planejado na segunda:** [X] tasks ([Y] Henrique, [Z] Marco)
**Finalizado:** [N]
**Em andamento:** [N]
**Nao iniciado:** [N]
**Extras (nao planejado):** [N]
**Taxa de execucao:** [%] (finalizado / planejado)

---

### Henrique — Semana

| Task | Status | Planejado? | Notas |
|------|--------|-----------|-------|
| [Task A] | Finalizado | Sim | — |
| [Task B] | Fazendo | Sim | Travou terca (motivo do diario) |
| [Task C] | Essa semana | Sim | Nao iniciado |
| [Task G] | Finalizado | Nao | Surgiu quarta |

### Marco — Semana

| Task | Status | Planejado? | Notas |
|------|--------|-----------|-------|
| [Task D] | Finalizado | Sim | — |
| [Task E] | Finalizado | Sim | — |
| [Task F] | Removido | Sim | [motivo se identificavel] |

---

### Reunioes da semana
- [SEG] Planejamento semanal (H+M)
- [QUA] Brainstorm conteudo (H+M+G)
- [QUI] Call com [cliente] (Marco)
- Tempo em reunioes: ~[X]h

### Blockers / Padroes
- [blocker recorrente se houver]
- [padrao identificado nos diarios]

### Alertas
- Financeiro: [atualizado / NAO atualizado essa semana]
- Stand-ups: [X/5 dias com check-in, Y/5 com check-out]
- Conteudo: [progresso / parado]

### Review anterior — Follow-up
- [Decisao X da semana passada] — [executada / nao executada]
- [Pendencia Y] — [resolvida / ainda pendente]
```

Depois pergunte (MAXIMO 3 perguntas, diretas):

1. Faltou algo que voces fizeram essa semana e nao ta no ClickUp?
2. Tem decisao pendente que precisa resolver nessa reuniao?
3. (Se taxa de execucao < 50%) O que atrapalhou? Muita demanda nao planejada ou prioridades mudaram?

ESPERE a resposta antes de continuar.

---

### Fase 3: Pre-selecao proxima semana

Com base no review:

1. Liste tasks que ficaram pendentes (candidatas a voltar na segunda).
2. Liste tasks do pool "A fazer" que fazem sentido como proximas.
3. Sinalize se alguma task esta atrasada (prazo passou).
4. NAO defina prioridades — isso e trabalho do planejamento de segunda. Apenas prepare o terreno.

```
### Insumos pro planejamento de segunda:

**Carrega da semana (ficou pendente):**
- [task] — [contexto de onde parou]

**Pool disponivel:**
- [task] [Space] — [prioridade se identificavel]

**Atrasadas (prazo passou):**
- [task] — venceu [data]

**Decisoes pra segunda:**
- [questao que precisa ser decidida]
```

ESPERE confirmacao antes de continuar.

---

### Fase 4: PAUSA — Reuniao

Diga:

> "Placar pronto. Agora voces fazem o review. Gravem o audio.
> Quando terminar, cola a transcricao aqui que eu processo."

Se for sexta QUINZENAL (a cada 2 sextas), lembre:

> "Essa sexta tem a extensao estrategica (+1h). Apos o review operacional, entrem nas questoes estrategicas: roadmap, oportunidades, decisoes de negocio."

**NAO faca mais nada ate o usuario voltar com a transcricao ou dizer que terminou.**

---

## TEMPO 2: POS-REUNIAO

### Fase 5: Processar transcricao

Quando o usuario colar a transcricao:

1. **Cruze com o Tempo 1.** Identifique o que e NOVO vs o que ja estava no placar.
2. **Extraia:**
   - Decisoes tomadas (qualquer "vamos fazer X" ou "nao vamos fazer Y")
   - Tasks novas que surgiram
   - Tasks que foram oficialmente canceladas/adiadas
   - Ajustes em processos ou estrategia
   - Compromissos de agenda (reunioes marcadas, prazos combinados)
   - Contexto novo (informacao que nao existia antes)
   - Questoes estrategicas discutidas (se extensao quinzenal)
   - Feedbacks entre Henrique e Marco
3. **NAO repita** o que ja estava no placar. Foque no delta.

Apresente:

```
## Resultado do review:

### Decisoes tomadas
1. [Decisao] — Motivo: [por que]

### Tasks — Acoes
- Criar: [task] → [quem], [prazo]
- Mover pra Finalizado: [task] (confirmado na reuniao)
- Cancelar/Adiar: [task] — [motivo]
- Atualizar: [task] — [novo contexto]

### Compromissos agendados
- [evento] — [dia, horario, quem]

### Estrategia (se extensao quinzenal)
- [questao discutida] — [conclusao]
- [ajuste no roadmap] — [o que muda]

### Insumos pro planejamento de segunda
- [prioridade definida na reuniao]
- [contexto que o planejamento precisa saber]

Posso executar?
```

ESPERE confirmacao antes de executar.

---

### Fase 6: Execucao

Apos confirmacao:

#### 6.1 ClickUp
- Mover tasks confirmadas como finalizadas para **"Finalizado"**
- Criar tasks novas seguindo as regras do CLAUDE.md
- Atualizar descricao de tasks que ganharam contexto novo
- Tasks canceladas: perguntar se volta pra "A fazer" ou remove

#### 6.2 Google Calendar
- Se foram agendados novos compromissos, criar no calendario Pique Agenda
- Adicionar participantes como convidados

#### 6.3 Salvar sessao no cerebro

Crie `sessoes/YYYY-MM-DD-HHMM-review-semanal.md` com:

```markdown
# Sessao — Review Semanal [DD/MM a DD/MM]

**Criado:** YYYY-MM-DD HH:MM
**Status:** ativo
**Tags:** sessao, pique-digital, review

## Contexto
Review semanal de sexta-feira. Henrique + Marco.

## Placar da semana
- Planejado: [X] | Finalizado: [Y] | Taxa: [Z%]
- Extras: [N]

### Henrique
- [x] [task finalizada]
- [ ] [task nao feita] — [motivo]

### Marco
- [x] [task finalizada]
- [ ] [task nao feita] — [motivo]

## Decisoes
- [decisao 1] — Motivo: [por que]
- [decisao 2] — Motivo: [por que]

## Estrategia (se quinzenal)
- [questao] — [conclusao]

## Insumos pro planejamento de segunda
- [prioridade definida]
- [tasks que voltam]
- [contexto relevante]

## Alertas / Padroes
- [blocker recorrente]
- [padrao identificado]

## Relacionado
- Planejamento da semana: [link sessao de segunda]
- Review anterior: [link se existir]
```

#### 6.4 Atualizar arquivos do cerebro
- Se houve decisoes que afetam arquivos existentes (estrategia, roadmap, processos), atualize
- Se houve ajustes em processos, atualize o arquivo do processo

#### 6.5 Atualizar _mapa.md
Se criou arquivo novo, adicione ao mapa.

#### 6.6 Encerrar

Diga: "Semana revisada. Sessao salva, ClickUp atualizado. O planejamento de segunda vai puxar esses insumos automaticamente. Bom fim de semana."

---

## Regras

- NAO julgue a taxa de execucao. TDAH = semanas variam. 40% pode ter sido uma semana com muita demanda nao planejada. Registre e siga.
- O placar e FACTUAL — numeros, nao opiniao. O agente mostra, os humanos interpretam.
- Se o Marco nao preparou a pauta (feito/travou/metricas), sinalize mas NAO cobre. O review acontece de qualquer forma com os dados do ClickUp + diarios.
- A extensao estrategica quinzenal e OPCIONAL — se voces nao quiserem fazer, pulem. O agente so lembra.
- O review de sexta alimenta o planejamento de segunda. Capriche nos "Insumos pro planejamento" — e a ponte entre os dois rituais.
- Se o usuario nao trouxer transcricao e disser "ja terminamos, nao gravou", pule pra Fase 6 usando as respostas da Fase 2.
- Comunique-se em portugues brasileiro, direto e sem formalidade.

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. O placar foi factual (numeros) ou escorregou pra opiniao?
2. Os insumos pro planejamento de segunda sao uteis e especificos?
3. A extensao estrategica quinzenal foi oferecida quando aplicavel?
4. Dados do ClickUp + diarios foram suficientes ou ficaram gaps?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao, mostre:

```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
Quer que eu aplique essas melhorias na skill? (s/n)
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
