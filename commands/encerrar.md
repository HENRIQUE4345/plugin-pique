---
description: Encerramento de conversa. Processa tudo que foi discutido e distribui para os lugares certos no cerebro e ferramentas. Execute este fluxo EXATAMENTE, sem pular etapas.
model: sonnet
---

Encerramento de conversa. Processa tudo que foi discutido e distribui para os lugares certos no cerebro e ferramentas. Execute este fluxo EXATAMENTE, sem pular etapas.

## Ferramentas

Esta skill NAO executa nenhuma acao externa que mexa com outra pessoa. Tudo que ela faz e local e reversivel por git — MENOS o `git push`, que agora e automatico dentro do commit (com abort-em-conflito, nunca resolve sozinho). Por isso ela roda sozinha ate o fim, SEM pedir "posso executar?".

A **cauda mecanica** (deteccao multi-repo, commit+push, telemetria, appends nos 3 logs) foi movida pra 4 scripts Python permanentes em `${CLAUDE_PLUGIN_ROOT}/scripts/`. Voce so fornece o JULGAMENTO (o que salvar, onde, como classificar, a mensagem de commit); o script faz a parte deterministica e devolve 1 JSON no stdout — voce ramifica por ele.

Acoes externas (task no ClickUp, evento no Calendar) viram so REGISTRO na lista "Ficou em aberto" do resumo final — quando o Henrique precisar, ele pede na hora.

> **ClickUp fora do fluxo (decisao 2026-06-16):** NAO cria nem propoe task. So lista a acao pra o Henrique nao perder o fio. Quando precisar, ele pede — ai use `/plugin-pique:planejar-tasks` ou o agent `gestor-clickup`.
> **Calendar fora do fluxo (decisao 2026-06-29):** NAO cria evento. Compromisso/reuniao que aparecer vira so registro na lista "Ficou em aberto". Quando precisar, ele pede na hora.

## Quando usar

- Ao final de qualquer conversa que teve conteudo acionavel
- Apos brainstorm, analise, discussao, planejamento, transcricao, duvida resolvida
- Quando o usuario disser "encerra", "fecha", "salva tudo", ou quando a conversa naturalmente chegar ao fim

---

## Contrato dos scripts (ler uma vez, vale pro fluxo todo)

Todos os 4 scripts vivem em `${CLAUDE_PLUGIN_ROOT}/scripts/`, emitem **1 linha JSON no stdout** (o produto — voce ramifica por ela, NAO pelo exit code) e nunca abortam a sessao. Chamada padrao via Bash: `python "${CLAUDE_PLUGIN_ROOT}/scripts/<nome>.py" ...`.

- **`--payload`**: passe o JSON inline entre **aspas simples** (`--payload '{"tema":"..."}'`). Se o conteudo tiver aspas simples (apostrofo), monte o JSON num arquivo com o Write tool e passe `--payload - < arquivo.json`.
- **`--session-id`**: obrigatorio em `commit-cerebro`, `telemetria-append` e (recomendado) `append-log`. Pegue na **Fase 0**.
- **Status que sao SUCESSO, nao erro:** `dedup_skip`, `merged`, `created`, `noop`, `dry_run`. Se vier um desses, NAO repita a chamada.
- Se `${CLAUDE_PLUGIN_ROOT}/scripts/` nao existir → **modo degradado** (ver secao final "Fallback").

---

## Fase 0: descobrir o session_id (primeiro de tudo)

Seu `session_id` foi injetado no contexto no inicio desta conversa pelo hook de abertura, na linha:

```
[telemetria] session_id=<uuid>
```

Ache essa linha e guarde o uuid — ele entra em todas as chamadas de script. Se a conversa passou por compact/resume, a linha pode ter reaparecido; qualquer ocorrencia serve (o id nao muda na mesma sessao).

**Fallback (nao achou a linha — sessao antiga ou hook nao instalado):**
```
python "${CLAUDE_PLUGIN_ROOT}/scripts/session-info.py" list-active --cwd "<cwd atual>"
```
Cruze o `last_files`/`started` das sessoes vivas com os arquivos que ESTA conversa tocou pra identificar a sua. Em ultimo caso, opere em modo degradado (secao final).

---

## Fase 1: Varredura da conversa (automatico, NAO pergunte nada)

### 1.0 Regra dura: consultar `_mapa.md` ANTES de grep/glob
Antes de qualquer grep/glob procurando arquivo existente no cerebro, leia `_mapa.md` primeiro. Ele indexa tudo por tema/pasta e resolve 90% das buscas em 1 leitura. Vale nas secoes 1.2 e 1.5 (que cruzam com o mapa) e em qualquer varredura.

### 1.0b Mapa do que sera commitado (substitui a varredura manual multi-repo)

Antes era varredura manual de `git status` em cwd + submodule + 7 repos paralelos. Agora **um dry-run** te da o mapa completo:

```
python "${CLAUDE_PLUGIN_ROOT}/scripts/commit-cerebro.py" --session-id <sid> --message "dry" --dry-run
```

O JSON traz, por repo (`submodule` pique / `super` MEU-CEREBRO / `parallel` plugin-pique etc / `outside`):
- `claimed` — arquivos que ESTA sessao tocou nesse repo (do manifest de touches dos hooks).
- `shared_blocked[]` — compartilhados (`_mapa.md`, `TAREFAS.md`, `melhorias-plugin.md`, `log-do-feito.md`, `_tasks-*.md`...) que uma **sessao-irma viva** tambem tocou → o script NAO vai comitar (conservador). Cada um traz as `sessions` que colidem.
- `unclaimed_dirty[]` — arquivos sujos no repo que NINGUEM reivindicou (nem os touches, nem `--files`). **Julgue cada um:** e desta conversa (o hook perdeu por algum motivo)? → some na lista de `--files` do commit real. NAO e seu (outra sessao)? → deixe, o script nao toca.
- `outside[]` — arquivos/repos fora da allowlist (ex: repo de terceiro, sem origin) → so reportados, nunca comitados.

Sessoes-irmas vivas voce tambem ve com `session-info.py list-active`. Guarde esse mapa: ele alimenta a decisao de `--files` na Fase 3.7 e os avisos da Fase 4.

> **Nota /inbox:** se o `/inbox` rodou em paralelo, arquivos de `inbox/contextos/` podem ter sido movidos pra `sessoes/`. O dry-run mostra as renomeacoes em `unclaimed_dirty` (com `renamed_from`). Garanta que suas edicoes seguiram o arquivo e que LINKS pra ele (em outros docs) apontam pro novo path. NAO arraste os moves do /inbox pro seu commit — eles nao sao desta conversa.

### 1.1 Decisoes tomadas
Qualquer "vamos fazer X", "nao vamos fazer Y", "decidimos que Z". Inclua o MOTIVO se mencionado.

### 1.2 Informacao nova
Fatos, contextos, dados que nao existiam antes no cerebro. Cruze com `_mapa.md` — ja existe arquivo sobre esse tema?

### 1.3 Acoes identificadas (so registro — NAO cria task)
Acoes concretas que apareceram. Liste pra o Henrique nao perder o fio — mas NAO crie nem proponha task. Pra cada uma: o que (verbo no infinitivo), quem (Henrique/Marco/outro), prazo (se mencionado). Quem decide o que vira task e o Henrique. Vai pra "Ficou em aberto" (Fase 4).

### 1.4 Eventos / compromissos (so registro — NAO cria evento)
Reunioes, prazos, datas. Liste — mas NAO crie evento. Vai pra "Ficou em aberto" (Fase 4).

### 1.5 Atualizacoes em arquivos existentes
Algo discutido muda ou complementa um arquivo que ja existe? Cruze com `_mapa.md`.

### 1.6 Conteudo de sessao
A conversa em si tem valor como registro? (brainstorm, reuniao, download mental, analise)

### 1.7 Feedback ou preferencias do usuario — **regra-alavanca**
O usuario corrigiu algo, pediu pra mudar abordagem, ou expressou preferencia sobre como trabalhar?

Pra CADA feedback, aplique o **discriminador**:
- **(ii) Passo de uma skill/ritual** — descreve COMO um ritual/skill deve se comportar (ex: "no boa-noite puxe X primeiro", "no encerrar nao faca Z"). → **edita o `.md` da skill** (repo-fonte) + bump + reload. NAO vira memoria passiva. Aplica na Fase 3.4 e lista no resumo.
- **(i) Calibracao de comportamento meu** — regra geral de como respondo/calibro/evito vies, sem nomear passo de skill (tom, quando perguntar, nao concordar reflexo). → memoria do agente. Salva na Fase 3.4.

**Teste:** "da pra apontar QUAL `.md` e QUAL passo mudaria?" Sim → skill (ii). Nao → memoria (i). Em duvida, prefira (ii).

### 1.8 Item do trilho trabalhado?
Esta sessao trabalhou um item do `## HOJE` do `TAREFAS.md` (raiz do cerebro)?
- Read o `## HOJE`. Item `[~]` (iniciado por `/iniciar`) ou `[ ]` que casa com o tema → item a **fechar** (planejada = **P**).
- Trabalho substantivo que NAO estava no HOJE (apareceu no dia) → **eventualidade** (**E**), tambem loga.
- Conversa puramente operacional (1-2 acoes simples) → nao loga, pula 3.3b.

---

## Fase 2: Decisoes de encerramento (interno — NAO pergunte, NAO mostre plano, NAO espere)

NAO existe checkpoint. Resolva as decisoes abaixo SOZINHO, com default seguro, e va DIRETO pra Fase 3. O que ficou decidido aparece no resumo da Fase 4 — depois de feito, nao como pedido de aprovacao.

- **Sessao:** salva se foi brainstorm / reuniao / download mental / analise longa. NAO salva se foi operacional curto. Sem perguntar.
- **Criar vs atualizar:** NAO crie arquivo novo se ja existe um sobre o tema — atualize (cruze com `_mapa.md`).
- **Em duvida se vale salvar:** teste "isso eu descubro lendo o cerebro/codigo depois?". Sim → descarta. Nao, e e duravel → salva. NAO jogue a duvida pro Henrique.
- **Split em 2+ notas:** se cobriu 2+ temas separados E a nota unica passaria de ~100 linhas, salve N notas menores. Default e 1 nota.
- **Brainstorm estrategico vs execucao:** se DESENHOU arquitetura nova, as acoes sao HIPOTESES FUTURAS — registre enxuto (1-2) em "Ficou em aberto", nao despeje 5+ itens que viram ruido.
- **Acoes / compromissos:** SO registro em "Ficou em aberto". Nunca task no ClickUp nem evento no Calendar.
- **Compartilhados bloqueados / unclaimed (1.0b):** siga o mapa do dry-run — o script ja protege os shared com sessao-irma; voce so julga os `unclaimed_dirty`.
- **Pausa por correcoes recorrentes:** se houve 2+ ciclos de correcao no MESMO artefato, salve o contexto MAS sinalize no topo do resumo: "⚠ N ciclos de correcao em [artefato] — merece aprofundar numa proxima sessao."
- **Ja executado durante a conversa:** se outra skill (ex: `/pique:bom-dia`) ja salvou algo, NAO duplique. Sinalize: "Ja executado durante a conversa — nada pendente."

Va direto pra Fase 3.

---

## Fase 3: Execucao

Execute na ordem. **Regra de ouro da ordem:** TODO write (conteudo, logs, insight, auto-avaliacao, memory, skill) acontece ANTES do commit (3.7), pra entrar no mesmo commit. O commit vem depois de tudo escrito; a telemetria (3.8) vem depois do commit (pra capturar os SHAs). Nao pergunte aprovacao — as decisoes ja foram tomadas na Fase 2.

### 3.1 Atualizar arquivos existentes
Edite conforme a Fase 2. Mantenha formato e template padrao do cerebro.

### 3.2 Criar arquivos novos
Use o template padrao do CLAUDE.md. Atualize `_mapa.md` com a nova entrada.
> `_mapa.md` usa **forward slash** (`/`) sempre nos paths. Antes de montar um `old_string` pra editar, grep o trecho no arquivo real — nao copie o separador `\` do output do Read.

### 3.3 Salvar sessao
Se a Fase 2 decidiu salvar, crie o arquivo de sessao com template padrao (contexto, conteudo, decisoes, relacionados).

### 3.3b Fechar item do trilho + log-do-feito (se Fase 1.8 detectou)

**Fechar no `TAREFAS.md` (`## HOJE`):** item trabalhado `[~]`/`[ ]` → `[x]`. Capture a hora local de fim `HH:MM` (`powershell -NoProfile -Command "Get-Date -Format HH:mm"`). Se a linha tinha `(iniciada: HH:MM)`: calcule duracao e substitua o sufixo por `(HH:MM → HH:MM · Nmin)`. Sem carimbo: melhor-esforco pro inicio ou so o fim.

**Anexar a linha no log** via script (resolve a fragilidade de ancora — nao edite o md na mao):
```
python "${CLAUDE_PLUGIN_ROOT}/scripts/append-log.py" feito --session-id <sid> \
  --payload '{"data":"DD/MM","mes":"YYYY-MM","tarefa":"titulo curto","inicio_fim":"HH:MM–HH:MM","dur":"Nmin","modo":"Pensar|Produzir|Afiar|Dirigir","pe":"P|E"}'
```
- `mes` = mes da **data de INICIO** do item (chat que vira o dia loga no mes do inicio). O script acha/cria a secao `## YYYY-MM` e faz dedup por (data, tarefa).
- `modo` = etiqueta do item; `pe` = **P** se estava no HOJE, **E** se foi eventualidade.
- Os valores aceitos de `modo`/`pe` vivem em `config/vocabulario.json` — `exit 3` com "esperado um de [...]" lista os atuais. Modo novo se adiciona la, nao no `.py`.
- `dedup_skip` = ja logado, segue.

**Item nao-feito** (parou no meio): deixa `[~]` no HOJE. Nao loga incompleto.

### 3.4 Salvar memory / ajustar skill (regra-alavanca, Fase 1.7)
- **Feedback (i) comportamento meu:** salve na memoria do agente (auto-memory + linha no `MEMORY.md`).
- **Feedback (ii) passo de skill:** NAO salva memoria — faca o **Edit no `.md`-fonte** (repo do plugin) conforme 1.7, faca o **bump** no `.claude-plugin/plugin.json` e registre na Fase 4 os comandos `/plugin marketplace update` + `/reload-plugins`. O commit desse repo sai no 3.7 (o script classifica plugin-pique como paralelo).

### 3.5 Insight de uso IA (sempre — mas so escreve se houver evidencia CONCRETA)

Detecte UM padrao de COMO a conversa foi conduzida (nao o conteudo). Evidencia concreta de: prompt repetido 2+ vezes; transformacao manual que MCP/skill ja resolveria; correcao por falta de contexto pre-carregavel; handoff manual automatizavel; dor recorrente.

**Regra dura:** so gere se houver evidencia EVIDENCIADA nesta conversa. Sem padrao claro = nao escreva nada. NAO invente. Nao repita insight ja registrado em chat recente.

Se identificar algo, mostre ao usuario:
```
[INSIGHT DE USO IA]
**Padrao:** [1 frase — o que aconteceu]
**Sugestao:** [1 frase concreta — skill X, agent Y, MCP Z, mudanca de processo]
**Categoria:** [automacao | skill | agent | contexto | workflow]
```
E anexe via script (ele **roteia pelo categoria**, pelo mapa em `config/vocabulario.json` — skill/agent/automacao vao pro doc compartilhado H+M `insights-operacao-pique.md`; contexto/workflow vao pro `insights-uso-ia.md` local):
```
python "${CLAUDE_PLUGIN_ROOT}/scripts/append-log.py" insights --session-id <sid> \
  --payload '{"tema":"tema curto","padrao":"1 frase","acao":"1 frase concreta","categoria":"skill|agent|automacao|contexto|workflow"}'
```
`dedup_skip` = ja registrado, segue. `exit 6`/`ancora nao encontrada` = o doc alvo nao existe ainda; crie-o com o cabecalho padrao (incluindo a secao `## Entradas`) e repita.

### 3.6 Auto-avaliacao (sempre — mas so escreve se houver melhoria CONCRETA)

Avalie a execucao: (1) a classificacao acertou o que salvar vs descartar? (2) houve duplicacao com algo ja salvo por outra skill? (3) alguma acao relevante ficou de fora? (4) conversa operacional gerou processamento minimo (sem acoes inventadas)?

Se identificar melhorias CONCRETAS e EVIDENCIADAS, mostre:
```
[AUTO-AVALIACAO]
- [melhoria 1]
- [melhoria 2]
```
E anexe via script (preserva o CRLF do `melhorias-plugin.md`, faz merge se ja houver bloco do mesmo dia):
```
python "${CLAUDE_PLUGIN_ROOT}/scripts/append-log.py" melhorias --session-id <sid> \
  --payload '{"data":"YYYY-MM-DD","skill":"encerrar","autor":"usuario","itens":["melhoria 1","melhoria 2"]}'
```
Se nao identificar nada concreto, nao mostre nada. NAO melhore por melhorar.

### 3.7 Commit + push do cerebro e repos paralelos (um script, tudo junto)

Agora que TODOS os writes acima ja aconteceram, feche com um comando so:
```
python "${CLAUDE_PLUGIN_ROOT}/scripts/commit-cerebro.py" --session-id <sid> \
  --message "cerebro: <resumo curto do que mudou>" \
  [--files '["path/extra1.md","path/extra2.md"]'] \
  [--message-for '{"plugin-pique":"vX.Y.Z: <resumo>"}'] \
  --push
```
- O script classifica sozinho (submodule/super/paralelos), faz **stage seletivo** (nunca `git add -A`), commita na ordem paralelos → pique → super (com o bump do ponteiro), e **pusheia** (pique antes do super; se o pique nao sobe, o super nao sobe).
- **`--files`**: os `unclaimed_dirty` que voce julgou serem desta conversa (Fase 1.0b), com path **forward-slash**. Rede extra contra o gap de compact.
- **`--message-for`**: mensagem propria por repo. Use pra plugin-pique quando bumpou versao (`vX.Y.Z: ...`) ou pros hubs (segue o padrao do `git log` do repo). Fallback = `--message`.
- **Ramifique pelo JSON de saida:**
  - `status: committed` + `clean: true` → tudo comitado e pushado. 
  - `status: partial` → comitou mas algo ficou; olhe `skip_reason` de cada repo.
  - `shared_blocked[]` → arquivo compartilhado deixado pra outra sessao fechar (mencione na Fase 4, nao force).
  - `skip_reason`: `rebase_conflict` (pull --rebase deu conflito, abortou — resolva manual depois) · `push_failed`/`no_upstream`/`skipped_submodule_unpushed` (commitou local, push pendente) · `git_locked` (repo travado por outra sessao, tente de novo ou deixe) · `third_party_remote`/`not_in_allowlist` (repo de terceiro, so reportado).
  - Tudo que ficou pendente (push nao concluido, shared bloqueado) → lista na Fase 4.
- Se `status: noop` (nada tocado) → sem commit, segue.

### 3.8 Registrar telemetria enriquecida (depois do commit, pra pegar os SHAs)

```
python "${CLAUDE_PLUGIN_ROOT}/scripts/telemetria-append.py" --session-id <sid> \
  --payload '{"tema":"3-5 palavras","resumo":"1 linha <=120 chars","categoria":"A|B|C","tags":["t1","t2"],"projeto":"MEU-CEREBRO"}'
```
Voce so fornece o julgamento semantico; o script deriva do manifest/transcript/git o resto das 14 chaves (cwd, wall_seconds, modelos, primeiro_prompt, arquivos_tocados, diretorios, commits). Rode **enquanto a sessao esta viva** (o script le o manifest de `active/`).
- `categoria`: **A** = mecanico (operacional, consulta rapida) · **B** = processamento (refactor medio, analise, brainstorm com saida, review) · **C** = estrategico (rumo, arquitetura, planejamento).
- `tags`: 2-4 palavras-chave (reusa a classificacao da Fase 2).
- **Regra critica:** categoria e classificacao subjetiva sua — NAO pergunte ao usuario, NAO mostre no resumo. Metadado silencioso. `status: appended` = ok; falha = warning no JSON, nao bloqueia.

---

## Fase 4: Confirmacao final (o fim — sem pergunta)

Apresente o resumo do que FOI feito, montado a partir dos JSONs dos scripts. Termina aqui — NAO faca pergunta, NAO peca confirmacao.

```
## Encerrado
[⚠ avisos do topo, se houver: /inbox em paralelo, sessoes-irmas, ciclos de correcao]

**Salvei:**
- Cerebro — atualizado: [lista] | criado: [lista]
- Sessao: [salva como ... / nao necessario]
- Memory: [regra salva / ajuste de skill aplicado / nada]
- Git: [committed+pushed em <repos> / commitado local (push pendente: <motivo>) / nada]
- Compartilhados deixados pra outra sessao: [lista / nenhum]

**Ficou em aberto** (eu nao crio — voce pede quando precisar):
- Tasks: [acao → quem | prazo]  (ou "nenhuma")
- Compromissos: [evento → data, participantes]  (ou "nenhum")

**Pendencias manuais:** [so o que o script NAO resolveu]
- Push pendente em <repo>: <skip_reason> — [ex: rode `git pull --rebase` e re-tente]  (ou "nenhuma — push automatico concluido")
- Plugin bumpado: rodar `/plugin marketplace update <marketplace>` + `/reload-plugins`

Tudo guardado. Pode fechar o chat.
```

Se uma secao nao tem nada, escreva "nenhum"/"nada" — nao omita (transparencia).

### 4.1 Bloco de retomada (condicional — SO se houver continuacao real)

Se esta sessao deixou trabalho claramente em aberto — um ledger `_tasks-*.md` com tarefas pendentes, uma proxima fase nomeada, ou trabalho declarado incompleto — emita ao final um bloco colavel pra abrir o proximo chat ja com contexto:

```
## Retomando — <tema>
**Objetivo:** [1 frase]
**Estado:** [onde parou]
**Paths canonicos:** [arquivos/ledger a abrir]
**Proxima acao:** [o primeiro passo concreto]
```

Condicional, NUNCA "sempre". Conversa fechada/resolvida nao gera bloco.

---

## Regras

- **Execute direto apos a Fase 2** — sem mostrar plano, sem pedir aprovacao.
- Conversa puramente operacional → processamento minimo, e ta certo. Nao invente acoes.
- Conversa que ja executou tudo no fluxo (ex: `/pique:bom-dia`) → "Ja executado durante a conversa — nada pendente."
- Em duvida se algo vale salvar → teste "isso eu descubro lendo o cerebro/codigo depois?". NAO jogue a duvida pro Henrique.
- NAO duplique. Se ja foi salvo por outra skill na conversa, nao salve de novo.
- Comunique-se em portugues brasileiro, direto e sem formalidade.

## Fallback (scripts ou hooks ausentes — ex: maquina do Marco sem burn-in)

Se `${CLAUDE_PLUGIN_ROOT}/scripts/commit-cerebro.py` nao existir, ou nao houver `[telemetria] session_id=` no contexto (hooks nao instalados):

- **Commit/push:** faca na mao — `git status` no cerebro + submodule `pique/` + repos paralelos de `Documents/PROGRAMAS/`; stage SELETIVO do que ESTA conversa tocou (nunca `git add -A`); commit `cerebro: ...`; push pique antes do super. Nao arraste arquivo de outra sessao.
- **Telemetria/logs:** os scripts aceitam `--transcript-path <p> --cwd <p>` (telemetria) e rodam sem `--session-id` (append-log) — ou, sem Python, edite os 3 logs na mao seguindo o formato de cada um (`log-do-feito.md` tabela por mes; `insights-*` bloco apos `## Entradas`; `melhorias-plugin.md` bloco CRLF apos o `---`).
- Registre na Fase 4 que rodou em modo degradado, pra o Henrique instalar os scripts/hooks nessa maquina.
