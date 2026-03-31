Ritual de stand-up da manha. Execute este fluxo EXATAMENTE, sem pular etapas.

## Configuracao

Antes de iniciar, leia `plugin-pique.local.md` na raiz do projeto para obter:
- **Usuario atual:** `user_name` (user_id ClickUp: `user_clickup_id`)
- **Diarios pessoal:** `diarios_path` do frontmatter
- **Calendarios:** `calendarios.primary`, `calendarios.pique`, `calendarios.pessoal`

Se o arquivo nao existir, pergunte o nome do usuario e crie usando o template.

---

## Fase 0: Contexto do dia anterior (automatico)

Antes de qualquer coisa, busque o diario de ontem:

1. Leia `{diarios_path}/YYYY-MM-DD.md` do dia anterior (calcule a data).
2. Se existir, extraia:
   - O que foi feito (secao Check-out)
   - O que ficou pendente
   - Blockers
   - Notas pra hoje
3. Se NAO existir, pule — vai precisar pedir contexto manual na Fase 2.

**Futuro (cerebro-pique):** ler tambem `diarios/marco/YYYY-MM-DD.md` pra saber o que o time fez.

---

## Fase 1: Reconhecimento (automatico, NAO pergunte nada ainda)

Execute TUDO em paralelo:

### 1.1 Google Calendar — HOJE + proximos 3 dias

Liste eventos de HOJE e dos PROXIMOS 3 DIAS:
- Use gcal_list_events com timeMin=hoje 00:00 e timeMax=hoje+3 dias 23:59.
- Cheque TODOS os calendarios do usuario (ler IDs de `plugin-pique.local.md` e CLAUDE.md do plugin).
- Classifique:
  - **HOJE:** reunioes que ocupam bloco de tempo
  - **AMANHA/PROXIMOS:** reunioes que precisam de PREP hoje
- **Calcule TEMPO LIVRE de hoje:**
  - Horas disponiveis = horas do dia (assumir 8h uteis, ou perguntar se comecou tarde) - reunioes de hoje - 1h buffer (contexto switching, imprevistos)
  - Esse numero e o TETO de estimativas que cabem no dia

IDs dos calendarios: consultar `plugin-pique.local.md` (usuario atual) + CLAUDE.md do plugin (calendarios compartilhados e de outros membros).

### 1.2 ClickUp — Foto do board

Consulte `pique/infra/clickup-setup.md` para IDs dos Spaces.

Busque tasks nos seguintes estados (use clickup_search):

| O que buscar | Por que |
|---|---|
| Tasks com status "Hoje" | Sobrou de ontem? Ficou em andamento? |
| Tasks com status "Fazendo" | Algo em progresso? |
| Tasks com status "Essa semana" | Pool disponivel pra puxar |
| Tasks atrasadas (due_date < hoje) | Divida acumulada |
| Tasks com start_date = hoje | Precisam comecar hoje (multi-dia) |
| Tasks com status "Finalizado" recentes (ultimos 2 dias) | O que foi feito |

Busque em TODOS os Spaces ativos:
- Pique Digital (901313561086)
- Conteudo (901313561098)
- Yabadoo (901313567191)
- Beto Carvalho (901313567164)
- Pessoal (901313561154)

### 1.3 Inbox rapido

- Leia `inbox/DIARIO.md` — tem algo registrado que afeta o dia?
- NAO processe o inbox, apenas escaneie por itens urgentes ou contexto relevante.

---

## Fase 2: Briefing + Extracao de contexto

Apresente um resumo CURTO e visual:

```
## Bom dia! Aqui esta o cenario:

**Ontem (do diario):**
- [resumo do que foi feito / pendencias]
- (ou: sem diario de ontem — preciso de contexto)

**Agenda de hoje:**
- [HH:MM] Evento 1
- [HH:MM] Evento 2
- (ou: sem reunioes hoje)

**Proximos dias (prep necessario):**
- [AMANHA HH:MM] Evento X — precisa preparar?
- [DATA HH:MM] Evento Y
- (ou: proximos 3 dias livres)

**Ficou pra hoje (status Hoje/Fazendo):**
- Task 1 (status)
- (ou: board limpo)

**Pool da semana (Essa semana):**
- Task 1 [Space]
- Task 2 [Space]

**Inbox:** [nada relevante / resumo de 1 linha]
```

Depois pergunte (MAXIMO 3 perguntas, diretas):

1. Mudou alguma prioridade ou surgiu algo novo?
2. Ta travado em alguma coisa?
3. (Se tiver reuniao amanha/proximos dias) Precisa preparar algo pra [reuniao X]?

Se NAO tinha diario de ontem, adicione:
4. Resumo rapido do que rolou ontem?

ESPERE a resposta antes de continuar.

---

## Fase 3: Proposta do dia

### 3.0 Calcular orcamento do dia

Antes de propor tasks, calcule:
- **Tempo livre** (da Fase 1.1): horas do dia - reunioes - 1h buffer
- Esse e o teto. NAO proponha tasks que somem mais que isso.

### 3.1 Coletar TUDO que o usuario mencionou

Antes de propor, listar TUDO que o usuario falou na conversa:
- Tasks que quer fazer hoje
- Tasks que quer criar pra depois
- Coisas que quer delegar
- Qualquer outro item mencionado

Incluir TODOS na proposta — separando o que e pra hoje vs o que e pra criar como task futura. NAO omitir nada que o usuario falou.

### 3.2 Selecionar tasks — ordem de prioridade

Montar a lista candidata nesta ordem (de cima pra baixo):

1. **Atrasadas** (due_date < hoje) — divida, entra primeiro
2. **Bloqueando alguem** (outra task depende desta) — destravar o time
3. **Due date = hoje** — vence hoje, nao pode empurrar
4. **Start date = hoje** (task multi-dia) — precisa comecar pra nao atrasar
5. **Pool "Essa semana"** — puxar por prioridade (urgent > high > normal > low)

Para cada task, mostrar a **estimativa de tempo** ao lado.

### 3.3 Montar o dia

1. Somar estimativas das tasks selecionadas ate atingir o tempo livre.
2. Se o total de atrasadas + due hoje ja estoura o tempo livre:
   - Avisar: "Voce tem Xh de tasks obrigatorias pra Yh de tempo livre"
   - Perguntar o que empurrar — NAO decidir sozinho
3. **O que nao couber: reagendar AGORA** (atualizar due_date no ClickUp), nao deixar pra depois.
4. Se a mesma task foi empurrada 2+ vezes, sinalizar como **bloqueio cronico** pra entrar na review semanal.

### 3.4 Formatar proposta

Blocos sao por NOME, nunca por horario fixo (o stand-up nem sempre e de manha):
- Stand-up (esse ritual)
- Bloco 1, Bloco 2, Bloco 3
- Reunioes com horario marcado sao excecao — mostrar horario da reuniao
- Limite duro: 19h (a menos que o usuario diga outro horario)

Formato:
```
## Proposta para hoje: [X]h de trabalho | [Y]h livres

1. **[Task]** (~Zh) — [justificativa curta]
2. **[Task]** (~Zh) — [justificativa curta]
3. **[Task]** (~Zh) — [justificativa curta]
Total estimado: [soma]h

**Blocos:**
- Stand-up
- Bloco 1 — [o que vai fazer]
- Reuniao X (HH:MM)
- Bloco 2 — [o que vai fazer]

**Nao coube hoje (reagendar?):**
- [Task] (~Zh) — sugestao: mover pra [data]

Quer trocar, adicionar ou remover alguma?
```

ESPERE confirmacao antes de executar.

---

## Fase 4: Detalhamento por task (NOVO)

Apos confirmacao das tasks, para CADA task confirmada:

1. Pergunte: "O que precisa ser feito nessa? Onde parou? Qual o proximo passo concreto?"
2. Escute a resposta.
3. Atualize a descricao da task no ClickUp (use clickup_update_task com markdown_description) incluindo:
   - Contexto / onde parou
   - Passos concretos (checklist)
   - Proximo passo imediato
   - O que precisa de outra pessoa (se aplicavel)

Objetivo: quando abrir a task, saber EXATAMENTE o que fazer sem ter que pensar.

Faca as tasks uma por uma. NAO pergunte todas de uma vez.

ESPERE resposta de cada uma antes de passar pra proxima.

---

## Fase 5: Execucao

### 5.1 Atualizar ClickUp
- Mova as tasks confirmadas para status **"Hoje"** (use clickup_update_task com status "Hoje").
- Se alguma task de ontem que ficou em "Hoje" NAO foi escolhida, pergunte: volta pra "Essa semana" ou fica?

### 5.2 Gerar mensagem do WhatsApp
Gere a mensagem EXATAMENTE neste formato (pronta pra copiar e colar):

```
Hoje:
- [task 1]
- [task 2]
- [task 3]
Travado em: [nada / o que for]
```

### 5.3 Salvar check-in no diario

Crie ou atualize `diarios/YYYY-MM-DD.md` com:

```markdown
# Diario — YYYY-MM-DD

## Check-in (bom-dia)
**Horario:** HH:MM
**Tasks planejadas:**
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3
**Reunioes:** [lista ou "nenhuma"]
**Travado em:** [blockers ou "nada"]
**Notas:** [contexto relevante do dia]
```

NAO preencha a secao Check-out — isso e feito pelo `/pique:boa-noite`.

### 5.4 Encerrar
Diga: "Stand-up feito. Mensagem pronta. Bora pro bloco produtivo."

---

## Regras

- NAO faca perguntas desnecessarias. O reconhecimento automatico deve cobrir 80% do contexto.
- Se o board ta vazio (sem tasks em Essa semana), avise e pergunte o que quer focar.
- Respeite o limite de 2-3 tasks/dia. Menos e melhor que mais (regra anti-TDAH).
- A Fase 4 (detalhamento) pode levar mais tempo — isso e esperado e valioso.
- Bloqueio externo (fora do controle) = registra no "Travado em" do standup. So comenta no ClickUp se precisa de acao de outra pessoa.
- **NUNCA proponha tasks que somem mais horas que o tempo livre calculado.** Se nao cabe, mostra o estouro e pergunta o que cortar.
- **Task empurrada 2+ vezes = bloqueio cronico.** Sinalizar e adicionar na pauta da review semanal.
- **Calendar vem primeiro, ClickUp preenche o espaco.** O dia real define o teto, as tasks preenchem.
- Comunique-se em portugues brasileiro, direto e sem formalidade.

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. As tasks propostas cabem no tempo livre calculado?
2. Bloqueios cronicos (2+ empurradas) foram sinalizados?
3. O reconhecimento automatico cobriu o contexto sem perguntas desnecessarias?
4. As reunioes do calendario foram integradas corretamente no planejamento?
5. A proposta final respeitou o limite de 2-3 tasks/dia?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao, mostre:

```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
Quer que eu aplique essas melhorias na skill? (s/n)
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
