---
description: Ritual de stand-up da manha. Execute este fluxo EXATAMENTE, sem pular etapas.
model: sonnet
---

Ritual de stand-up da manha. Execute este fluxo EXATAMENTE, sem pular etapas.

**Filosofia do ritual (hibrido — sistema sugere, humano confirma):**

Esta skill **monta o HOJE do trilho** (`TAREFAS.md`) a partir de 3 fontes, nesta ordem de autoridade — a pessoa so **CONFIRMA ou AJUSTA** em 30 segundos:

1. **Agenda (Calendar)** = esqueleto e TETO de tempo. Define quantas horas sobram. Nao e fonte de itens, e restricao.
2. **SEMANA do `TAREFAS.md`** = ESPINHA. Os candidatos do dia saem daqui (ja vem etiquetados por modo Pensar/Produzir/Afiar). Selecionar os que cabem no teto, ordenar por execucao.
3. **ClickUp** = OVERLAY, **so leitura**: prazo duro (atrasadas/vence-hoje via due_date) + cobranca (aguardando terceiro). NAO e a fonte do dia.
4. **Chat** = o que o Henrique mencionar ao vivo entra como ad-hoc.

**READ-ONLY de manha:** o bom-dia NAO move status, NAO muta due_date por conta propria, NAO cria task. A unica escrita ClickUp permitida e condicional e confirmada (Fase 5.1). Tudo que ele escreve e no lado do Henrique: `## HOJE` do trilho + check-in no diario + msg WhatsApp.

Por que hibrido: 100% automatico ignora capacidade mental do dia (cansaco, reuniao surpresa). 100% manual cria fadiga cognitiva diaria. O ponto doce e: sistema filtra o obvio, humano decide o contexto.

**Contexto obrigatorio:** antes de rodar, considere `conhecimento/produtividade/clickup-fundamentos-pique.md`. **Reorg ClickUp 26/06 (frente=Space): "Essa semana" e "Hoje" deixaram de existir como status — viraram views por due_date. NAO filtrar por esses status.** Limite: max 5 tasks/dia.

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

## Fase 0: Contexto do dia anterior + gate do HOJE (automatico)

### 0.1 Diario de ontem
1. Leia `{diarios_path}/YYYY-MM-DD.md` do dia anterior (calcule a data).
2. Se existir, extraia: o que foi feito (Check-out), o que ficou pendente, blockers, **"Notas pra amanha"** (vira candidato de prep na Fase 3.2 — B3, sugere, nao entra sozinho).
3. Se NAO existir, pule — vai pedir contexto manual na Fase 2.

### 0.2 Gate do HOJE (consolidar antes de montar — B2/N3)

Read o `## HOJE` do `TAREFAS.md` e olhe a linha de carimbo `<!-- hoje: ... -->`:
- `<!-- hoje: consolidado AAAA-MM-DD -->` → o boa-noite ja fechou. Segue limpo (vai montar por cima do placeholder).
- `<!-- hoje: montado AAAA-MM-DD -->` com **data != hoje** → o boa-noite foi pulado. **Rodar mini-consolidacao** antes de montar.
- **ausente** mas ha linhas `[ ]`/`[~]`/`[x]` no HOJE → HOJE escrito a mao / orfao. **Rodar mini-consolidacao** (nao confiar que esta limpo).
- ausente e HOJE vazio/placeholder → primeiro uso, segue normal.

**Mini-consolidacao** (mesma rotina do boa-noite Fase 5.2b — reusar, nao reinventar): pra cada `[x]` carimbado nao-logado → backfill no `log-do-feito.md`; pra cada `[~]` orfao → logar parcial + devolver pra `[ ]` sem carimbo; itens nao-feitos que nao estao no SEMANA → `## RESTO`; limpar o HOJE. Avisar em 1 linha: *"HOJE de DD/MM nao foi fechado pelo boa-noite — consolidei N itens pro log antes de montar."*

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

### 1.2 ClickUp — overlay de prazo + cobranca (SO LEITURA)

> ClickUp NAO e a fonte do dia — isso e o SEMANA do trilho (Fase 1.4). Aqui ele entra so como **overlay**: prazo duro que pode forcar um item, e cobranca. **Reorg 26/06:** "Essa semana"/"Hoje" NAO existem mais como status — NAO filtrar por eles, so por due_date + status atuais (a fazer / fazendo / aguardando terceiro / finalizado).

Consulte `pique/infra/clickup-setup.md` para IDs dos Spaces. Busque sempre com `assignees: [user_clickup_id]` (nunca tasks do time), em TODOS os Spaces ativos (Pique Digital 901313561086, Pique Studio 901313561098, Yabadoo 901313567191, Beto Carvalho 901313567164, Pessoal 901313561154), `status NOT IN (finalizado, descartada)`:

| O que buscar | Filtro | Uso |
|---|---|---|
| **Atrasadas** | `due_date < hoje` | prazo duro — pode forcar entrada no dia |
| **Vence hoje** | `due_date = hoje` | prazo duro — pode forcar entrada no dia |
| **Aguardando terceiro** | `status = "aguardando terceiro"` | cobranca — cruza com `## AGUARDANDO` do trilho |

Para **atrasadas** e **vence hoje** (sao poucas): apos `list_tasks`, chame `get_task` em cada uma pra puxar descricao+comentarios (inferir escopo pelo nome gera briefing errado). Nao buscar "vencendo essa semana" como pool — esse mecanismo morreu na reorg; a selecao do dia vem do SEMANA do trilho (Fase 1.4). Pessoal nao usa due_date (so prioridade) — normal nao retornar nada de prazo la.

### 1.3 Inbox rapido

- Leia `inbox/DIARIO.md` — tem algo registrado que afeta o dia?
- NAO processe o inbox, apenas escaneie por itens urgentes ou contexto relevante.

### 1.4 SEMANA do trilho (a espinha do dia)

Read no `TAREFAS.md` (raiz do cerebro). Capture:
- `## SEMANA` — os itens `[ ]` com etiqueta de modo. **Esta e a fonte primaria dos candidatos do dia.**
- `## AGUARDANDO` — o que o Henrique espera dos outros (cruza com a cobranca da Fase 1.2 → visao unica de cobranca).

Se o `## SEMANA` estiver vazio ou com data de semana antiga (ex: segunda antes do `/planejamento-semanal`): avise *"SEMANA nao montada/desatualizada — rode /planejamento-semanal primeiro, ou me diga o foco da semana."* Sem espinha, o dia so tem o prazo duro do ClickUp + o que voce mencionar.

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

**SEMANA do trilho (espinha do dia):**
- `[Modo]` Item 1 — [foco da semana]
- `[Modo]` Item 2
- (ou: SEMANA nao montada — rodar /planejamento-semanal)

**Prazo duro (ClickUp — overlay):**
- Atrasadas: Task 1 [Space] (vencida ha N dias) — (ou: nada atrasado)
- Vence hoje: Task 2 [Space] — (ou: nada vence hoje)

**Cobranca (aguardando terceiro + AGUARDANDO do trilho):**
- [quem] — [o que trava] — (ou: nada travando)

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

### 3.2 Montar os candidatos do dia — SEMANA = espinha, ClickUp = overlay

A fonte dos candidatos e o `## SEMANA` do trilho (Fase 1.4), NAO o ClickUp. Ordem:

1. **Espinha = itens da SEMANA** (`[ ]`, ja com modo) — ordenar por execucao (a ordem em que faz sentido fazer hoje). Esta e a base do dia.
2. **Overlay de prazo duro (ClickUp, Fase 1.2):** atrasada ou vence-hoje que **forca** o dia →
   - se ja casa com um item da SEMANA, **anotar a urgencia** nele (nao duplicar);
   - se NAO esta na SEMANA, **adicionar** como item de prazo (etiquetar modo: execucao→`[Produzir]`, decisao→`[Pensar]`).
3. **Prep de ontem (B3):** se a Fase 0 trouxe "prep pra hoje/amanha" do diario, **oferecer** como candidato (sugere, nao entra sozinho).
4. **Ad-hoc:** o que o usuario mencionou no chat (Fase 3.1).

Mostrar a **estimativa de tempo** ao lado de cada um. **Filtrar bloqueados** (Fase 3.2.1).

**Limite: MAX 5 tasks por pessoa** (WIP pessoal). Se passa de 5, selecionar as 5 que mais cabem no teto + prazo, deixar o resto pra Fase 3.4 (nao coube). **Item puro de trilho (sem task ClickUp) e normal e maioria** — nao precisa existir no ClickUp pra entrar no dia.

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
3. **O que nao couber:** sinalizar pra reagendar (NAO mutar due_date sozinho — bom-dia e read-only de manha). Listar em "nao coube" e perguntar se quer mover; so atualiza ClickUp se confirmar (Fase 5.1).
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

### 5.1 ClickUp — CONDICIONAL (read-only por padrao)

bom-dia **nao muta ClickUp por padrao**. Itens puros de trilho (sem task ClickUp) nao tocam ClickUp — vivem so no TAREFAS.md.

**Unica escrita permitida, e SO se o usuario confirmou:** item que TEM task ClickUp e ele pediu pra reagendar (Fase 3.3) → delegar ao `gestor-clickup` pra ajustar `due_date`. Sem confirmacao explicita, nao mexe.
- NAO mover status, NAO mover pra "Hoje" (status morto), NAO criar task de manha.
- Atrasadas/vencendo que ficam de fora: deixar como estao.

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

1. **Re-Read o `## HOJE` AGORA** (nao confiar no Read da Fase 1.4 — pode ter minutos de idade; outra janela pode ter mexido). Localize `## SEMANA` e `## HOJE`.
2. **Proteger trabalho de janela paralela (N2) — antes de reescrever:**
   - Se o HOJE tem item `[x]` com carimbo de duracao `(HH:MM → HH:MM · Nmin)` que ainda NAO esta no `log-do-feito.md` de hoje → **fazer o backfill dessa linha pro log ANTES** (mesma rotina do boa-noite 5.2b). Nunca descartar um `[x]` carimbado sem logar.
   - Se o HOJE tem item `[~]` com `(iniciada:)` → **sessao viva em outra janela. Preservar** (nao sobrescrever). Em duvida, preservar e avisar.
   - So substituir: placeholder, `[ ]` nao-tocados, e itens ja logados.
3. Pra cada item confirmado na proposta (Fase 3.4), **mapeie ao modo**:
   - Se ja existe no `## SEMANA`, herde a etiqueta de modo dele (`` `[Pensar]` `` / `` `[Produzir]` `` / `` `[Afiar]` ``).
   - Se for prazo de ClickUp fora do SEMANA, infira: execucao→`[Produzir]`; decisao→`[Pensar]`; ferramenta→`[Afiar]`.
4. Escreva a secao `## HOJE` com o **carimbo de estado** na 1a linha (logo apos `## HOJE`):
   ```
   ## HOJE
   <!-- hoje: montado AAAA-MM-DD -->
   - [ ] `[Modo]` **Titulo curto** — 1 linha do que fazer  ← começa aqui
   - [ ] `[Modo]` **Titulo curto** — 1 linha do que fazer
   ```
   - `AAAA-MM-DD` = data de hoje (o gate da Fase 0 le esse carimbo).
   - **Ordenados por execucao**; **so o 1o** leva ` ← começa aqui`; **sem** `(iniciada:)` (isso e do `/iniciar`).
5. **Nao duplica** ClickUp/WhatsApp: a proposta e a msg seguem pra consciencia de prazo/equipe; o HOJE e o trilho pessoal. Os MESMOS itens de execucao aparecem nos dois — aqui etiquetados por modo.
6. Edit minimo: so a secao `## HOJE`. Nao mexer em SEMANA/AGUARDANDO/DECISOES/FRENTES/RESTO.

### 5.4 Encerrar
Diga: "Stand-up feito. HOJE montado no trilho (N itens). Mensagem pronta. Rode `/iniciar` pra carimbar o 1o item e carregar o modo."

---

## Regras

- NAO faca perguntas desnecessarias. O reconhecimento automatico deve cobrir 80% do contexto.
- Se o `## SEMANA` do trilho esta vazio, avise (rodar /planejamento-semanal) e pergunte o que quer focar.
- Respeite o limite de **max 5 tasks/dia por pessoa** (WIP limit pessoal dos fundamentos). Idealmente 3. Menos e melhor que mais.
- A Fase 4 (detalhamento) pode levar mais tempo — isso e esperado e valioso.
- Bloqueio externo (fora do controle) = registra no "Travado em" do standup. So comenta no ClickUp se precisa de acao de outra pessoa.
- **NUNCA proponha tasks que somem mais horas que o tempo livre calculado.** Se nao cabe, mostra o estouro e pergunta o que cortar.
- **Estouro consciente = registrar e seguir, nao argumentar 2x.** Quando user decide estourar (>5 tasks/dia OU horas > tempo livre) ciente do trade-off, registrar no diario e seguir. Nao repetir o aviso.
- **Task empurrada 2+ vezes = bloqueio cronico.** Sinalizar e adicionar na pauta da review semanal.
- **Calendar primeiro, SEMANA do trilho preenche o espaco.** A agenda define o teto; os itens da SEMANA (espinha) preenchem; ClickUp so anota prazo duro por cima.
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
