---
description: Ritual de stand-up da manha. Execute este fluxo EXATAMENTE, sem pular etapas.
model: sonnet
---

Ritual de stand-up da manha. Execute este fluxo EXATAMENTE, sem pular etapas.

**Filosofia do ritual (coach hibrido — sistema sugere, humano confirma):**

O bom-dia nao e so um planejador de execucao — e um **coach**. Alem de montar o dia, ele passa **4 lentes na ordem fixa `DECIDIR → SUPERVISIONAR/COBRAR → LEMBRAR → FAZER`** (detalhe na Fase 2). A ordem reflete onde o Henrique e gargalo (decisao, supervisao) — nao onde ja e forte (execucao). Por dias seguidos o ritual so trazia a lente FAZER; as camadas de **decidir**, **cobrar quem ele delegou** e **lembrar o que ele mesmo prometeu** ficavam pro "depois" que nao vinha. As 4 lentes corrigem isso — sem fonte nova, so lendo o que ja existe (trilho, `_delegacao-equipe.md`, atas, diarios/log).

Esta skill **monta o HOJE do trilho** (`TAREFAS.md`). Para a lente FAZER, os candidatos saem de 3 fontes nesta ordem de autoridade — a pessoa so **CONFIRMA ou AJUSTA** em 30 segundos:

1. **Agenda (Calendar)** = esqueleto e TETO de tempo. Define quantas horas sobram. Nao e fonte de itens, e restricao.
2. **SEMANA do `TAREFAS.md`** = ESPINHA da lente FAZER. Os candidatos de execucao saem daqui (ja vem etiquetados por modo Pensar/Produzir/Afiar). Selecionar os que cabem no teto, ordenar por execucao.
3. **ClickUp** = OVERLAY, **so leitura**: prazo duro (atrasadas/vence-hoje via due_date) + cobranca (aguardando terceiro). NAO e a fonte do dia.
4. **Chat** = o que o Henrique mencionar ao vivo entra como ad-hoc.

Mas o **foco do dia pode nascer de outra lente** — uma decisao madura (`[Pensar]`) ou um "Eu travo eles" (destravar alguem) as vezes vale mais que mais uma tarefa de execucao (ver Fase 3.2).

**READ-ONLY de manha:** o bom-dia NAO move status, NAO muta due_date por conta propria, NAO cria task. A unica escrita ClickUp permitida e condicional e confirmada (Fase 5.1). Tudo que ele escreve e no lado do Henrique: `## HOJE` do trilho + check-in no diario + stand-up no Slack `#standup` (pos-OK, Fase 5.2).

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

⚠️ **RECONFERIR O DIA ISOLADO ANTES DE CRAVAR O TETO (obrigatorio).** A busca da janela larga (ontem→hoje+4) **ja devolveu horario ERRADO** de evento de hoje — em 22/07/2026 ela retornou "REC: YABA 15:30-16:30" quando o evento real era **11:00-12:00** (o Henrique flagrou com print; a releitura isolada do dia devolveu o certo). Provavel instancia errada de evento recorrente ou movido. Portanto: **depois** das 3 janelas, refaca UMA busca so de hoje (`timeMin=hoje 00:00`, `timeMax=hoje 23:59`) em cada calendario e use **essa** leitura pros horarios de hoje. Divergiu entre as duas? A do dia isolado vence — e **sinalize a divergencia no briefing**, nao corrija em silencio.

**Calcule TEMPO LIVRE de hoje:**
- Horas disponiveis = 8h uteis - reunioes de hoje - 1h buffer (contexto switching, imprevistos)
- Esse numero e o TETO de estimativas que cabem no dia
- **Nao trate o dia como um bloco unico:** reuniao no MEIO da manha/tarde parte a janela em pedacos curtos. Liste as janelas reais (ex: 09:15-11:00 · 12:00-14:00 · 15:30-18:00) antes de propor — item de 2h nao cabe em duas janelas de 1h. Evento **presencial** custa deslocamento/setup que nao aparece na duracao do evento; desconte.

### 1.2 ClickUp — overlay de prazo + cobranca (SO LEITURA)

> ClickUp NAO e a fonte do dia — isso e o SEMANA do trilho (Fase 1.4). Aqui ele entra so como **overlay**: prazo duro que pode forcar um item, e cobranca. **Reorg 26/06:** "Essa semana"/"Hoje" NAO existem mais como status — NAO filtrar por eles, so por due_date + status atuais (a fazer / fazendo / aguardando terceiro / finalizado).

**NAO hardcode Space ID aqui** — a reorg move Space e os IDs mortos retornam vazio **em silencio** (mascara falta de dado em vez de avisar). Peca ao `gestor-clickup` pra comecar por `clickup_get_workspace_hierarchy`, listar os Spaces que existem HOJE, e so entao buscar. Cruze com `pique/infra/clickup-setup.md` / `clickup-mapa-real-*.md` se precisar.

> **Foto de 10/08/2026 (referencia, nao filtro — reconfira sempre com `get_hierarchy`):** **5 Spaces vivos** — **Casa** `901313888640` · **Produto** `901313890018` · **Clientes** `901313890061` · **Studio** `901313890136` · **Crescimento** `901313888670`. **MORTOS (nao usar):** `901313561086` (Pique Digital) · `901313561098` · `901313567191` · `901313567164` · `901313561154` · `901313869198` · `901313872609` · `901313872623`. _(A foto de 22/07 listava 10 Spaces — os antigos sairam de vez na virada pra estrutura nova.)_

Busque sempre com `assignees: [user_clickup_id]` (nunca tasks do time), em TODOS os Spaces ativos, `status NOT IN (finalizado, descartada)`:

| O que buscar | Filtro | Uso |
|---|---|---|
| **Atrasadas** | `due_date < hoje` | prazo duro — pode forcar entrada no dia |
| **Vence hoje** | `due_date = hoje` | prazo duro — pode forcar entrada no dia |
| **Aguardando terceiro** | `status = "aguardando terceiro"` | cobranca — cruza com `## AGUARDANDO` do trilho |

Para **atrasadas** e **vence hoje** (sao poucas): apos `list_tasks`, chame `get_task` em cada uma pra puxar descricao+comentarios (inferir escopo pelo nome gera briefing errado). Nao buscar "vencendo essa semana" como pool — esse mecanismo morreu na reorg; a selecao do dia vem do SEMANA do trilho (Fase 1.4). Pessoal nao usa due_date (so prioridade) — normal nao retornar nada de prazo la.

### 1.3 Inbox rapido

- Leia `inbox/DIARIO.md` — tem algo registrado que afeta o dia?
- NAO processe o inbox, apenas escaneie por itens urgentes ou contexto relevante.

### 1.4 Trilho (`TAREFAS.md`) — espinha do dia + as 4 lentes

Read no `TAREFAS.md` (raiz do cerebro). Capture as secoes que alimentam as 4 lentes (Fase 2):
- `## SEMANA` — os itens com etiqueta de modo e estado (`[ ]`/`[~]`/`[x]`). **Fonte primaria da lente FAZER** (e da proposta). **Pule os `[x]`; priorize os `[~]`** (ver Fase 3.2).
- `## DECISÕES` — as decisoes `[Pensar]` que so o Henrique bate. **Fonte da lente DECIDIR.** Capture cada decisao + ha quanto tempo esta parada (se o item tiver data) + o que ela trava.
- `## AGUARDANDO` — o que o Henrique espera dos outros. **Fonte da lente SUPERVISIONAR (bloco "Eles me devem")** — cruza com a cobranca da Fase 1.2 e com o `_delegacao-equipe.md` (Fase 1.5) → visao unica de cobranca.

Se o `## SEMANA` estiver vazio ou com data de semana antiga (ex: segunda antes do `/planejamento-semanal`): avise *"SEMANA nao montada/desatualizada — rode /planejamento-semanal primeiro, ou me diga o foco da semana."* Sem espinha, o dia so tem o prazo duro do ClickUp + o que voce mencionar.

### 1.5 Delegacao + atas recentes (lentes SUPERVISIONAR e LEMBRAR)

Duas fontes que o bom-dia ignorava — sao o que faltava pra ele virar coach:

1. **`pique/operacao/_delegacao-equipe.md`** (ledger de delegacao por pessoa — Arthur, Carolina, Marco, etc). Read inteiro. Capture, por pessoa:
   - Itens marcados `[TRAVADO]` ou cujo texto diz que **dependem do Henrique** (ex: "espera o Henrique fazer o download mental", "aguarda o Henrique enviar os insumos") → alimentam o bloco **"Eu travo eles"** da lente SUPERVISIONAR (resolver primeiro — destrava varias pessoas).
   - Itens `[ ]` que o Henrique cobra dos outros → bloco **"Eles me devem"** (cruzar com `## AGUARDANDO` e com ClickUp "aguardando terceiro" da Fase 1.2; **nao duplicar** — visao unica de cobranca).
   - Marcacoes `[novo]`/`[confirmar]`: contexto, nao acao. Nao inflar.

2. **Atas de reuniao dos ultimos ~3 dias em `pique/sessoes/`.** As sessoes tem prefixo de data no nome (`YYYY-MM-DD-HHMM-tipo-descricao.md`) — filtre por prefixo de data (hoje e os 2-3 dias anteriores; pule fins de semana se nao houver ata). Pra cada ata recente, Read e extraia:
   - **Tabela/lista de Acoes com dono + prazo** → cruza com a lente SUPERVISIONAR (quem deve o que).
   - **Decisoes novas** que so o Henrique bate e ainda nao estao no `## DECISÕES` do trilho → alimentam a lente DECIDIR.
   - **Acoes com o nome do Henrique** que nao viraram nada (vai cruzar na Fase 2, lente LEMBRAR, contra diario/log/trilho).

   Se nao houver ata nos ultimos 3 dias, seguir sem — normal. NAO processar as atas (isso e do `/pos-reuniao`), so ler o que ja esta extraido.

---

## Fase 2: Briefing + Extracao de contexto (as 4 lentes)

O bom-dia nao e so planejador de execucao — e **coach**. O briefing tem duas partes: (A) o **cenario** (contexto + teto de tempo) e (B) as **4 lentes na ordem fixa** `DECIDIR → SUPERVISIONAR/COBRAR → LEMBRAR → FAZER`. A ordem NAO e acidental: reflete onde o Henrique e gargalo (decisao, supervisao) — nao onde ja e forte (execucao). Por isso DECIDIR vem primeiro e FAZER por ultimo.

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

**Inbox:** [nada relevante / resumo de 1 linha]

---

### 1. DECIDIR — o que so voce bate o martelo `[Pensar]`
- [Decisao] — parada ha [N dias/desde DATA] — trava [frente/pessoa] — (essa da pra bater hoje?)
- (fonte: `## DECISÕES` do trilho + decisoes novas das atas recentes)
- (ou: nada esperando decisao sua)

### 2. SUPERVISIONAR / COBRAR — o que esta na mao de outro
**Eles me devem (cobrar):**
- [quem] — [o que trava] — (ou: nada travando)
**Eu travo eles (resolver primeiro — destrava varias pessoas):**
- [quem espera] — [o que voce deve entregar pra destravar] — (ou: nao estou travando ninguem)
- (fonte: `_delegacao-equipe.md` + `## AGUARDANDO` do trilho + Acoes das atas + "aguardando terceiro" do ClickUp — visao unica, sem duplicar)

### 3. LEMBRAR — o que voce disse que ia fazer e nao fez
- [Acao sua da ata de DD/MM] — sem sinal de que saiu — (fez?)
- [Nota pra amanha do diario de ontem]
- (fonte: acoes com seu nome nas atas recentes cruzadas com diario/log/trilho + "Notas pra amanha")
- (ou: nada solto — constatacao, nao cobranca)

### 4. FAZER — o que sobrou da SEMANA (ja descontando o feito)
- `[Modo]` **Item** — [foco] — (ou: SEMANA nao montada — rodar /planejamento-semanal)
- **Prazo duro (ClickUp — overlay):** Atrasadas: Task [Space] (ha N dias) · Vence hoje: Task [Space] — (ou: nada de prazo)
- (fonte: `## SEMANA` MENOS o feito dos ultimos diarios/log — ver Fase 3.2; overlay de prazo por cima)
```

**Regras das lentes:**
- **Lente vazia = 1 linha "nada aqui hoje".** Nao inventar item pra encher lente (nao investigado ≠ existe; nao inflar carga sem dado).
- **Lente LEMBRAR e constatacao, nao punicao** — "voce disse que ia fazer X, fez?", nunca "voce falhou em X" (linguagem nao-punitiva). Separar pessoal de profissional (ex: CNH e pessoal).
- **Nao duplicar entre lente 2 e ClickUp/AGUARDANDO** — mesma cobranca aparece 1x. Cruzar as 3 fontes antes de listar.
- **Nao cravar decisao/estado de terceiro da memoria** — o que esta no ledger/ata e o que vale; em duvida, listar como "confirmar", nao afirmar.

**Bloco condicional — quarta-feira:** se hoje for quarta, INCLUA no template do briefing acima (logo apos o Inbox, antes da lente DECIDIR) o bloco abaixo. Em qualquer outro dia da semana, OMITA esse bloco.

```
**Alimentar cerebro (quarta):**
- Lembrete: reservar 30min hoje pra download mental + processar inbox (`/inbox`)
- Por que: quarta e o dia do ritual semanal de alimentar o cerebro — sem isso, /social-maturar e /social-sugerir ficam sem materia-prima fresca pra rodar na proxima terca
- Os 30min entram como bloco proprio na Fase 3 (nao como task ClickUp) — desconte do tempo livre antes de propor tasks
```

Depois pergunte (MAXIMO 3 perguntas, diretas — calibradas nas lentes, nao generico):

1. Das decisoes acima (lente DECIDIR), alguma da pra bater hoje — ou mudou prioridade / surgiu algo novo?
2. Ta travado em alguma coisa (ou travando alguem)?
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

### 3.2 Montar os candidatos do dia — puxando das 4 lentes

Os candidatos NAO saem so do `## SEMANA` (lente FAZER). O bom-dia e coach: um item de **DECIDIR** (bloco de `[Pensar]`) ou um "**Eu travo eles**" da lente SUPERVISIONAR pode ser o FOCO do dia — muitas vezes destrava mais valor que mais uma tarefa de execucao. Monte os candidatos cruzando as 4 lentes, nesta ordem:

1. **DECIDIR (lente 1):** decisao madura que da pra bater hoje → candidato `[Pensar]`. Priorizar decisao que **trava frente/pessoa** (custo invisivel) e que ja apodreceu (parada ha varios dias).
2. **Eu travo eles (lente 2):** o que o Henrique deve entregar que destrava outra pessoa (ex: download mental que o Arthur espera pra mexer no painel) → candidato de alta prioridade, porque destrava varios. Etiquetar modo pelo tipo (download/decisao→`[Pensar]`; entrega→`[Produzir]`).
3. **Espinha = itens da SEMANA (lente 4 / FAZER)** (ja com modo) — ordenar por execucao. Base do dia.
   - **PULAR os `[x]`** — item ja fechado nao volta pra proposta (mata o bug de re-propor feito). O boa-noite marca `[x]` no SEMANA via SEMANA-vivo; se ainda nao houver esse sinal, cruzar na marra (ver ponto de cruzamento abaixo).
   - **PRIORIZAR os `[~]`** — item que ja andou vem PRIMEIRO na ordenacao (terminar o que esta em curso antes de abrir frente nova). Depois os `[ ]` nao-tocados.
   - **Cruzar com os ultimos 2-3 diarios ANTES de propor (na marra, ate o SEMANA-vivo estabilizar):** confrontar cada candidato do SEMANA com o feito recente (Check-out dos diarios dos ultimos dias + `log-do-feito.md`) por titulo-nucleo/tema. Se o item ja saiu (mesmo que o SEMANA ainda mostre `[ ]`/`[~]` por atraso do boa-noite), NAO re-propor — riscar/sinalizar como fechado ANTES de montar a proposta. Vale tambem pra itens compostos parcialmente feitos: propor so a cauda que sobrou, nao o item inteiro.
4. **Overlay de prazo duro (ClickUp, Fase 1.2):** atrasada ou vence-hoje que **forca** o dia →
   - se ja casa com um item da SEMANA, **anotar a urgencia** nele (nao duplicar);
   - se NAO esta na SEMANA, **adicionar** como item de prazo (etiquetar modo: execucao→`[Produzir]`, decisao→`[Pensar]`).
5. **LEMBRAR (lente 3):** fio solto (acao sua de ata que nao saiu, "Nota pra amanha") que faz sentido resolver hoje → oferecer como candidato (sugere, nao entra sozinho).
6. **Prep de ontem (B3):** se a Fase 0 trouxe "prep pra hoje/amanha" do diario, **oferecer** como candidato (sugere, nao entra sozinho).
7. **Ad-hoc:** o que o usuario mencionou no chat (Fase 3.1).

> **Micro nao compete por slot numerado.** Acao rapida (~5-15min, sem deep work — mandar mensagem, mover evento no Calendar, aprovar algo) NAO vira item numerado da proposta, mesmo se surgiu de uma das lentes acima. Ela dobra pra dentro do item de foco como sub-bullet `**Micro (fora de bloco):**` (mesmo padrao ja usado no `## SEMANA` do trilho) ou, se nao houver foco unico no dia, junta todas as micro num unico bullet `Micro (fora de bloco)` fora da lista numerada. **Sinal de que errou:** se o usuario disser "isso e so mensagem de 5min" sobre um item que voce numerou, e feedback de que inflacionou o WIP — corrige puxando pra micro, nao defende o numero. (Achado 05/08: Henrique cortou 2 dos 3 itens propostos — "reajuste de agenda" e "mensagem pro Filipe" — porque eram 5-15min cada, e o foco real era 1 so: o trabalho de fundo do dia.)

> **Cobrar (bloco "Eles me devem" da lente 2) NAO vira task de execucao do Henrique** — vira linha na mensagem de stand-up / lembrete de cobranca, nao candidato do dia. Nunca criar task pra terceiro (gerar mensagem pro Henrique enviar).

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

**Micro (fora de bloco, ~Nmin):** [acao rapida 1] · [acao rapida 2] — nao entram na lista numerada

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

### 5.2 Mensagem de stand-up (Slack `#standup`)

Gere a mensagem EXATAMENTE neste formato:

```
Hoje:
- [task 1]
- [task 2]
- [task 3]
Travado em: [nada / o que for]
Cobrar: [quem — o que / ou omitir a linha se nao houver]
```

A linha **Cobrar** vem do bloco "Eles me devem" da lente SUPERVISIONAR (Fase 2) — a cobranca nao vira task do Henrique, vira lembrete pra ele acionar a pessoa. Se nao houver cobranca do dia, OMITA a linha (nao deixar "Cobrar: nada"). Corpo em **1a pessoa**; 3a pessoa so pra citar terceiros. Texto puro, sem links/markdown rico.

**Envio (regra revista 15/07 — direto, SEM draft; testado no `#standup` em 15/07):**
1. Mostrar a mensagem no chat e perguntar: "Mando pro #standup?"
2. Apos o **OK explicito do Henrique**, enviar DIRETO via `slack_send_message` no canal **`#standup` (`C0BGNGDMHC7`)** — NAO usar `slack_send_message_draft` (o draft virou passo burocratico: o Henrique acabou de revisar a proposta do dia no chat). Se existir um `draft_id` de rascunho anterior, passa-lo no envio pra limpar o rascunho junto.
3. **Excecao — conteudo sensivel** (numero de dinheiro, nome em cobranca dura, assunto de socio): destacar o trecho sensivel ao mostrar a mensagem e so enviar apos OK mesmo assim.
4. **Fallback — Slack indisponivel nesta sessao** (o MCP `slack` e HTTP+OAuth no user scope — `https://mcp.slack.com/mcp` — e o token expira/desloga; quando isso acontece as tools `slack_*` somem da sessao): NAO travar. Entregar a mensagem como texto pro Henrique colar no `#standup`, sinalizar 1 linha ("Slack des-autenticado — cola manual e reautentique via `/mcp`") e seguir o ritual.

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
   - Se ja existe no `## SEMANA`, herde a etiqueta de modo dele (`` `[Pensar]` `` / `` `[Produzir]` `` / `` `[Afiar]` ``) **e MANTENHA o titulo-nucleo identico ao do SEMANA** (mesmo **Titulo curto** em negrito). Esse titulo e a **ancora do match de volta** — o boa-noite cruza o feito de hoje com o SEMANA por titulo-nucleo; se voce reescrever o titulo aqui, o SEMANA-vivo perde o item e o feito nao reflete. So a linha de "1 linha do que fazer" pode ser especifica do dia.
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
5. **Nao duplica** ClickUp/stand-up: a proposta e a msg seguem pra consciencia de prazo/equipe; o HOJE e o trilho pessoal. Os MESMOS itens de execucao aparecem nos dois — aqui etiquetados por modo.
6. Edit minimo: so a secao `## HOJE`. Nao mexer em SEMANA/AGUARDANDO/DECISOES/FRENTES/RESTO.

### 5.4 Encerrar
Diga: "Stand-up feito. HOJE montado no trilho (N itens). Mensagem no #standup [enviada / aguardando OK / cola manual]. Rode `/iniciar` pra carimbar o 1o item e carregar o modo."

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
7. As 4 lentes apareceram na ordem fixa (DECIDIR → SUPERVISIONAR → LEMBRAR → FAZER), cada uma com fonte real (nao lente inventada pra encher)?
8. Nenhum item `[x]` do SEMANA foi re-proposto, e o feito dos ultimos diarios/log foi cruzado antes de propor (nada entregue voltou como candidato)?
9. A cobranca (lente 2) apareceu como cobranca — msg pro Henrique acionar — e NAO virou task de execucao dele nem task criada pra terceiro?

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
