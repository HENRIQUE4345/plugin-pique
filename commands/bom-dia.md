---
description: Ritual de stand-up da manha. Execute este fluxo EXATAMENTE, sem pular etapas.
model: sonnet
---

Ritual de stand-up da manha. Execute este fluxo EXATAMENTE, sem pular etapas.

**Filosofia do ritual (hibrido — sistema sugere, humano confirma):**

Esta skill faz **SELECAO AUTOMATICA** das tasks do dia baseada em regras (atrasadas + due hoje + dependencias + capacidade). A pessoa so **CONFIRMA ou AJUSTA** em 30 segundos. Nao e decisao diaria pesada — e validacao rapida.

Por que hibrido: 100% automatico ignora capacidade mental do dia (cansaco, reuniao surpresa). 100% manual cria fadiga cognitiva diaria. O ponto doce e: sistema filtra o obvio, humano decide o contexto.

**Contexto obrigatorio:** antes de rodar, considere o documento de fundamentos `conhecimento/produtividade/clickup-fundamentos-pique.md` — contem os 3 tipos de trabalho, pipelines, policies e limites (max 5 tasks/dia por pessoa).

## Ferramentas

- **ClickUp**: delegar ao agent `gestor-clickup` (operacoes via `pique-clickup-mcp`). NUNCA chamar `mcp__pique-clickup__*` direto — o hook bloqueia e pede delegacao.
- **Google Calendar**: usar `mcp__claude_ai_Google_Calendar__*` diretamente

> **IMPORTANTE**: Se o agent `gestor-clickup` nao conseguir operar (ex: `pique-clickup-mcp` desativado), avise o usuario: "pique-clickup-mcp esta desativado. Ative em: VS Code → MCP Servers → pique-clickup → Enable. Depois me chame de novo." NAO tente continuar sem ClickUp — pare e espere.

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

### 1.1 Google Calendar — ONTEM + HOJE + proximos dias

Busque eventos em 3 janelas:
- **Ontem** (timeMin=ontem 00:00, timeMax=ontem 23:59) — contexto do que rolou, complementa diario ausente
- **Hoje** (timeMin=hoje 00:00, timeMax=hoje 23:59) — bloqueia tempo, define teto real do dia
- **Proximos dias** (timeMin=amanha 00:00, timeMax=hoje+4 dias 23:59) — o que precisa de prep

Cheque TODOS os calendarios do usuario (ler IDs de `plugin-pique.local.md` e CLAUDE.md do plugin).

**Filtro no calendario Pique Agenda (compartilhado):** incluir evento apenas se o email do usuario atual (`calendarios.primary` em `plugin-pique.local.md`) esta em `attendees`. Eventos no Pique Agenda **sem attendees** NAO sao default "compromisso seu" — sao eventos publicos. Liste-os em uma secao separada "Publico/a confirmar quem participa" no briefing e NAO desconte do tempo livre. NAO listar reuniao do outro socio como compromisso seu.

**Calcule TEMPO LIVRE de hoje:**
- Horas disponiveis = 8h uteis - reunioes de hoje - 1h buffer (contexto switching, imprevistos)
- Esse numero e o TETO de estimativas que cabem no dia

### 1.2 ClickUp — Foto do board

Consulte `pique/infra/clickup-setup.md` para IDs dos Spaces.

Busque sempre com `assignees: [user_clickup_id]` (usuario que esta rodando a skill — nunca buscar tasks do time).

Use `list_tasks` com os seguintes filtros em TODOS os Spaces ativos (Pique Digital 901313561086, Conteudo 901313561098, Yabadoo 901313567191, Beto Carvalho 901313567164, Pessoal 901313561154):

| O que buscar | Filtro | Detalhe retornado |
|---|---|---|
| Concluidas ontem | due_date = ontem + include_closed=true | Titulo — o que foi entregue |
| **Atrasadas** | **due_date < hoje AND status NOT IN (finalizado, descartada)** | **Completo: titulo + descricao + comentarios** |
| Vencendo hoje | due_date = hoje | Completo: titulo + descricao + comentarios |
| Vencendo essa semana | due_date entre amanha e fim da semana | So titulo — pool disponivel |

**Atrasadas e separado de "ideias em status `planejado`" no Studio (que sao backlog, nao compromisso firme).** Tasks com due_date no passado e status ativo sao compromissos vencidos — entram primeiro na proposta da Fase 3.

Para "vencendo hoje" E "atrasadas": apos buscar com list_tasks, chame `get_task` em cada task retornada para puxar descricao e comentarios completos. Listar por nome e inferir escopo gera descricao errada — sempre puxar `get_task` antes de descrever escopo no briefing.

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

**Atrasadas (due passou, status ativo):**
- Task 1 [Space] (vencida ha N dias)
- (ou: nada atrasado)

**Ficou pra hoje (status Hoje/Fazendo):**
- Task 1 (status)
- (ou: board limpo)

**Pool da semana (Essa semana):**
- Task 1 [Space]
- Task 2 [Space]

**Inbox:** [nada relevante / resumo de 1 linha]
```

**Bloco condicional — quarta-feira:** se hoje for quarta, INCLUA no template do briefing acima (logo apos a linha de Inbox) o bloco abaixo. Em qualquer outro dia da semana, OMITA esse bloco.

```
**Alimentar cerebro (quarta):**
- Lembrete: reservar 30min hoje pra download mental + processar inbox (`/inbox`)
- Por que: quarta e o dia do ritual semanal de alimentar o cerebro — sem isso, /social-maturar e /social-sugerir ficam sem materia-prima fresca pra rodar na proxima terca
- Os 30min entram como bloco proprio na Fase 3 (nao como task ClickUp) — desconte do tempo livre antes de propor tasks
```

Depois pergunte (MAXIMO 3 perguntas, diretas):

1. Mudou alguma prioridade ou surgiu algo novo?
2. Ta travado em alguma coisa?
3. (Se tiver reuniao amanha/proximos dias) Precisa preparar algo pra [reuniao X]?

**Se o stand-up esta rodando depois das 10h** (sinal de que o usuario provavelmente ja avancou no dia), adicione tambem:
- O que voce ja fez hoje antes de rodar o stand-up?

Isso evita propor o que ja esta feito e deixa o orcamento do dia mais realista.

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

### 3.2 Selecionar tasks — ordem de prioridade (selecao automatica)

Montar a lista candidata nesta ordem (de cima pra baixo):

1. **Atrasadas** (due_date < hoje) — divida, entra primeiro
2. **Bloqueando alguem** (outra task depende desta) — destravar o time
3. **Due date = hoje** — vence hoje, nao pode empurrar
4. **Start date = hoje** (task multi-dia) — precisa comecar pra nao atrasar
5. **Pool "Essa semana"** — puxar por prioridade (urgent > high > normal > low)

Para cada task, mostrar a **estimativa de tempo** ao lado.

**Limite: MAX 5 tasks por pessoa.** WIP limit pessoal (alinhado com fundamentos `conhecimento/produtividade/clickup-fundamentos-pique.md`). Se a lista candidata tem mais de 5, selecionar as 5 mais prioritarias e deixar as demais pra Fase 3.4 (nao coube).

### 3.2.1 Verificar dependencias (novo)

Antes de incluir uma task na lista candidata, verificar:
- Ela tem `waiting_on` ativo? Se sim E a dependencia ainda nao foi finalizada, NAO sugerir — esta bloqueada. Sinalizar como "Aguardando X" no briefing.
- Ela e subtask e a task-mae esta em status "Aguardando Terceiro" ou "Bloqueada"? NAO sugerir.

Isso evita a frustracao de sugerir algo que a pessoa nao consegue comecar.

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
3. Delegue ao `gestor-clickup` pra atualizar a descricao da task (ele usa `update_task` com `markdown_description`) incluindo:
   - Contexto / onde parou
   - Passos concretos (checklist)
   - Proximo passo imediato
   - O que precisa de outra pessoa (se aplicavel)

Objetivo: quando abrir a task, saber EXATAMENTE o que fazer sem ter que pensar.

Faca as tasks uma por uma. NAO pergunte todas de uma vez.

ESPERE resposta de cada uma antes de passar pra proxima.

---

## Fase 5: Execucao

### 5.0 Resolver list_id antes de delegar (criacao de tasks)

Se a Fase 3 incluiu **criacao de tasks novas** (nao so update de existentes), antes de delegar ao `gestor-clickup`:

1. Consultar `pique/infra/clickup-mapa-real-*.md` (foto estrutural mais recente) pra resolver o `list_id` correto baseado no contexto da task (cliente, area, tipo).
2. Passar `list_id` **resolvido e explicito** no prompt do agent — nunca pedir "ache pelo nome".
3. Se a list nao existir no mapa ou contexto for ambiguo, perguntar ao usuario antes de criar.

Por que: agent caiu em list errada (Operacional/Geral em vez de Beco — Consultoria/Apresentacao) quando recebeu so o nome.

### 5.1 Atualizar ClickUp
- NAO mova tasks para status "Hoje" — essa dinamica foi descontinuada.
- Unico update necessario: se alguma task selecionada nao tem due_date = hoje, delegue ao `gestor-clickup` pra confirmar `due_date = 2026-XX-XX` (data de hoje).
- Tasks atrasadas que NAO entram no dia: deixar como estao. Nao reagendar automaticamente sem pedir confirmacao.

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

### 5.3b Escrever o trilho de HOJE no TAREFAS.md (camada Trilho)

O `TAREFAS.md` (raiz do cerebro) e o **trilho pessoal de execucao** — o que o Henrique faz. O bom-dia escreve a secao `## HOJE` puxando do `## SEMANA`. O `/iniciar` depois carimba inicio item a item; o `/encerrar` fecha.

1. Read no `TAREFAS.md`. Localize `## SEMANA` e `## HOJE`.
2. Pra cada item confirmado na proposta do dia (Fase 3.4), **mapeie ao modo**:
   - Se o item ja existe no `## SEMANA`, herde a etiqueta de modo dele (`` `[Pensar]` `` / `` `[Produzir]` `` / `` `[Afiar]` ``).
   - Se for prazo de ClickUp que nao esta no SEMANA, infira: execucao/entrega → `[Produzir]`; decisao/mapeamento → `[Pensar]`; ferramenta/skill/automacao → `[Afiar]`.
3. Substitua o placeholder `_(vazio — rodar /bom-dia)_` (ou o HOJE anterior) por:
   ```
   - [ ] `[Modo]` **Titulo curto** — 1 linha do que fazer  ← começa aqui
   - [ ] `[Modo]` **Titulo curto** — 1 linha do que fazer
   ```
   - **Ordenados por execucao** (mesma ordem da proposta confirmada).
   - **So o 1o item** leva ` ← começa aqui`.
   - **Sem carimbo de tempo** — `(iniciada: HH:MM)` e responsabilidade do `/iniciar`.
4. **Nao duplica** o ClickUp/WhatsApp: a proposta (Fase 3) e a mensagem (5.2) seguem pra consciencia de prazo/equipe; o HOJE e o trilho pessoal. Cobranca da equipe continua no `## AGUARDANDO`/ClickUp. Os MESMOS itens de execucao do Henrique aparecem nos dois lugares — aqui etiquetados por modo.
5. Edit minimo: so a secao `## HOJE`. Nao mexer em SEMANA/AGUARDANDO/DECISOES/FRENTES/RESTO.

### 5.4 Encerrar
Diga: "Stand-up feito. HOJE montado no trilho (N itens). Mensagem pronta. Rode `/iniciar` pra carimbar o 1o item e carregar o modo."

---

## Regras

- NAO faca perguntas desnecessarias. O reconhecimento automatico deve cobrir 80% do contexto.
- Se o board ta vazio (sem tasks em Essa semana), avise e pergunte o que quer focar.
- Respeite o limite de **max 5 tasks/dia por pessoa** (WIP limit pessoal dos fundamentos). Idealmente 3. Menos e melhor que mais.
- A Fase 4 (detalhamento) pode levar mais tempo — isso e esperado e valioso.
- Bloqueio externo (fora do controle) = registra no "Travado em" do standup. So comenta no ClickUp se precisa de acao de outra pessoa.
- **NUNCA proponha tasks que somem mais horas que o tempo livre calculado.** Se nao cabe, mostra o estouro e pergunta o que cortar.
- **Estouro consciente = registrar e seguir, nao argumentar 2x.** Quando user decide estourar (>5 tasks/dia OU horas > tempo livre) ciente do trade-off, registrar no diario e seguir. Nao repetir o aviso.
- **Task empurrada 2+ vezes = bloqueio cronico.** Sinalizar e adicionar na pauta da review semanal.
- **Calendar vem primeiro, ClickUp preenche o espaco.** O dia real define o teto, as tasks preenchem.
- Comunique-se em portugues brasileiro, direto e sem formalidade.

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. As tasks propostas cabem no tempo livre calculado?
2. Bloqueios cronicos (2+ empurradas) foram sinalizados?
3. O reconhecimento automatico cobriu o contexto sem perguntas desnecessarias?
4. As reunioes do calendario foram integradas corretamente no planejamento?
5. A proposta final respeitou o limite de max 5 tasks/dia?
6. Dependencias bloqueadas foram filtradas antes de sugerir?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
```

2. Anexe em `pique/infra/melhorias-plugin.md` no formato:
```
## YYYY-MM-DD — bom-dia (usuario)
- [melhoria 1]
- [melhoria 2]
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
