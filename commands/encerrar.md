---
description: Encerramento de conversa. Processa tudo que foi discutido e distribui para os lugares certos no cerebro e ferramentas. Execute este fluxo EXATAMENTE, sem pular etapas.
---

Encerramento de conversa. Processa tudo que foi discutido e distribui para os lugares certos no cerebro e ferramentas. Execute este fluxo EXATAMENTE, sem pular etapas.

## Ferramentas

- **Operacoes ClickUp** (criar tasks, atualizar): delegar ao agent `gestor-clickup`
- **Google Calendar** (criar eventos): chamar diretamente (connector leve)

> **IMPORTANTE**: Se as tools do ClickUp nao estiverem disponiveis (agent gestor-clickup falhar), avise o usuario: "ClickUp MCP esta desativado. Ative em: VS Code → MCP Servers → clickup → Enable. Depois me chame de novo." NAO tente continuar sem ClickUp — pare e espere.

## Quando usar

- Ao final de qualquer conversa que teve conteudo acionavel
- Apos brainstorm, analise, discussao, planejamento, transcricao, duvida resolvida
- Quando o usuario disser "encerra", "fecha", "salva tudo", ou quando a conversa naturalmente chegar ao fim

---

## Regra dura: consultar `_mapa.md` ANTES de grep/glob

Antes de qualquer grep/glob procurando arquivo existente no cerebro, leia `_mapa.md` primeiro. O mapa indexa todos os arquivos por tema/pasta e resolve 90% das buscas em 1 leitura. Regra ja vive no CLAUDE.md do cerebro — esta skill DEVE segui-la na Fase 1 (secoes 1.2 e 1.5 que cruzam com o mapa, e qualquer outra varredura).

---

## Fase 1: Varredura da conversa (automatico, NAO pergunte nada)

### 1.0 Detectar interferencia do /inbox (CRITICO — fazer PRIMEIRO)

Se `/inbox` rodou em paralelo ou antes na mesma sessao, arquivos que voce estava editando podem ter sido MOVIDOS/RENOMEADOS. Detecte antes de qualquer varredura:

1. Rode `git status` no cerebro
2. Se ver arquivos DELETADOS em `inbox/contextos/*.md` E arquivos UNTRACKED em `sessoes/` ou `diarios/` com data de hoje → `/inbox` rodou
3. Para cada arquivo deletado de `inbox/contextos/`, busque a contraparte em `sessoes/` (novo nome segue padrao `YYYY-MM-DD-HHMM-tipo-descricao.md`)
4. **Ajuste referencias:** se voce ja editou um arquivo na conversa que foi movido, garanta que:
   - Suas edicoes foram preservadas (elas seguem o arquivo pro novo lugar)
   - Qualquer LINK pra ele em outros arquivos (CLAUDE.md, clickup-setup.md, outros docs) aponte pro NOVO caminho
   - O plano da Fase 2 use o NOVO caminho, nao o antigo
5. Sinalize no plano: "⚠ /inbox rodou em paralelo — arquivo X foi movido de inbox/contextos/ pra sessoes/"

Nao comite mudancas do `/inbox` junto com as suas — elas sao de outra operacao. Comite APENAS o que esta conversa produziu.

### 1.0b Detectar sessoes Claude paralelas editando arquivos compartilhados (CRITICO — fazer logo apos 1.0)

Outras sessoes Claude rodando simultaneas no mesmo dia podem ter editado **arquivos compartilhados** (indexes, ledgers, logs, docs de acompanhamento) que tambem foram tocados nesta conversa. Comitar cegamente arrasta edits de terceiros sem contexto.

**Arquivos compartilhados tipicos (detectar):**
- Indexes: `_mapa.md` (cerebro ou subpastas), `docs/_mapa.md` (hubs)
- Ledgers de pendencias: `_pendencias-*.md`, `_tasks-*.md`
- Logs de auto-avaliacao: `pique/infra/melhorias-plugin.md`
- Tarefas locais: `TAREFAS.md`, `TASKS.md`
- CLAUDE.md (global ou por pasta)

**Deteccao:**
1. Apos `git status`, separe arquivos em 2 grupos:
   - **Exclusivos desta conversa** — arquivos que SO esta conversa tocou (gabaritos novos, docs novos, edits pontuais que voce fez)
   - **Compartilhados com mudancas externas** — arquivos que voce editou MAS cujo conteudo atual tem linhas adicionadas por outra sessao (ex: `_pendencias-individuais.md` com tasks 14-21 Marcella + 28-33 Ellen + 22-27 Rosa, quando sua conversa so adicionou Rosa)
2. Sinal pratico: se `git diff <arquivo>` mostra hunks que voce nao reconhece como suas, compartilhado.
3. Confirmacao extra: sistem-reminders do tipo "File has been modified since read" durante a conversa sao sinal forte de edicao concorrente.

**Decisao de commit:**
- **Exclusivos** — commit normal, arquivo por arquivo ou agrupado por tema
- **Compartilhados** — 2 opcoes, apresentar ao usuario no plano:
  - (a) Comitar seletivamente via `git add -p` (interativo) isolando so as suas hunks
  - (b) Deixar pra commit em lote quando as outras sessoes encerrarem (default mais seguro)

Sinalize no plano: "⚠ N sessoes Claude paralelas detectadas — X arquivos compartilhados tem edits de terceiros. Proponho commit apenas dos exclusivos: [lista]. Compartilhados ficam pendentes: [lista]."

**Evidencia do caso Rosa/19-04:** 3 sessoes simultaneas (`/plugin-pique:desenhar-individual marcella beco`, `/plugin-pique:desenhar-individual ellen beco`, `/plugin-pique:desenhar-individual rosa beco`) co-editaram `_pendencias-individuais.md` + `melhorias-plugin.md`. Detectei ad-hoc via `git status` em 4 repos + sistem-reminders de "File has been modified". Split seguro: commit dos exclusivos (gabarito rosa + edit plugin), compartilhados pendentes.

### 1.1 Decisoes tomadas
Qualquer "vamos fazer X", "nao vamos fazer Y", "decidimos que Z".
Inclua o MOTIVO se mencionado.

### 1.2 Informacao nova
Fatos, contextos, dados que nao existiam antes no cerebro.
Cruze com `_mapa.md` — ja existe arquivo sobre esse tema?

### 1.3 Tasks identificadas
Acoes concretas que precisam ser feitas. Para cada uma identifique:
- O que (verbo no infinitivo)
- Quem (Henrique, Marco, outro)
- Prazo (se mencionado)
- Prioridade (se mencionavel pelo contexto)

### 1.4 Eventos / compromissos
Reunioes agendadas, prazos combinados, datas mencionadas.

### 1.5 Atualizacoes em arquivos existentes
Algo que foi discutido muda ou complementa um arquivo que ja existe no cerebro?
Cruze com `_mapa.md`.

### 1.6 Conteudo de sessao
A conversa em si tem valor como registro? (brainstorm, reuniao, download mental, analise)

### 1.7 Feedback ou preferencias do usuario
O usuario corrigiu algo, pediu pra mudar abordagem, ou expressou preferencia sobre como trabalhar?

---

## Fase 2: Plano de encerramento

Apresente o plano neste formato:

```
## Encerramento — [titulo curto da conversa]

### Cerebro — Atualizar
- [arquivo] — [o que muda / o que adiciona]
- [arquivo] — [o que muda]

### Cerebro — Criar
- [novo-arquivo.md] em [pasta/] — [descricao curta]

### ClickUp — Tasks
- [Task com verbo] → [responsavel] | [prazo se tem] | [Space]
- [Task com verbo] → [responsavel] | [prazo se tem] | [Space]

### Calendar — Eventos
- [Evento] — [data, horario, participantes]

### Sessao
- Salvar como `sessoes/YYYY-MM-DD-HHMM-[tipo]-[descricao].md`? [Sim/Nao e por que]

### Memory (preferencias Claude)
- [regra ou feedback a salvar na memoria do agente]

### Nada a fazer
- [itens da conversa que NAO precisam de acao — listar brevemente pra transparencia]

Posso executar?
```

**Regras do plano:**
- Se uma secao esta vazia, escreva "Nenhum" — NAO omita a secao
- Tasks seguem as regras do CLAUDE.md (verbo, responsavel, prazo, descricao)
- NAO crie arquivo novo se ja existe um sobre o tema — atualize o existente
- NAO salve sessao se a conversa foi curta/operacional (ex: "cria task X", "muda status Y")
- Sessao so faz sentido pra brainstorms, reunioes, downloads mentais, analises longas
- **Split em 2+ notas quando conversa cobre temas distintos:** se a conversa cobriu 2+ temas claramente separados (ex: fluxo de trabalho + permissoes ClickUp) E a nota unica estimada passaria de ~100 linhas, proponha 2 (ou N) notas menores no plano em vez de 1 doc denso. Cada nota deve ter tema coerente, nome de arquivo distinto. Alinha com regra dos 150 linhas do CLAUDE.md do cerebro e facilita referencia futura. O usuario decide — se preferir manter 1 nota, respeite.
- **Brainstorm estrategico vs execucao de sprint:** se a conversa DESENHOU arquitetura nova (definindo projeto/plugin/area, nao fechando sprint), tasks sao HIPOTESES FUTURAS, nao commits imediatos. Comece propondo 1-2 tasks essenciais e PERGUNTE antes de expandir. Evita poluir o ClickUp com 5+ tasks que viram backlog morto.
- **Confirmar corte de escopo:** se o usuario cortar tasks explicitamente no plano ("so essa task", "corta essas X"), CONFIRME se Calendar e outros outputs tambem saem do escopo — nao presuma. Pergunta direta: "Corto Calendar/sessao/cerebro junto, ou mantenho?".

ESPERE o usuario revisar e aprovar antes de continuar.

---

## Fase 3: Execucao

Apos aprovacao, execute na ordem:

### 3.1 Atualizar arquivos existentes
- Edite os arquivos conforme o plano
- Mantenha o formato e template padrao do cerebro

### 3.2 Criar arquivos novos
- Use o template padrao do CLAUDE.md
- Atualize `_mapa.md` com a nova entrada

### 3.3 ClickUp
- Crie tasks seguindo as regras do CLAUDE.md
- Consulte `pique/infra/clickup-setup.md` para IDs
- Status inicial: "A fazer" (a menos que o contexto indique outro)

### 3.4 Google Calendar
- Crie eventos no calendario Pique Agenda (a menos que seja pessoal)
- Adicione participantes como convidados
- Inclua pauta/contexto na descricao

### 3.5 Salvar sessao
- Se aprovado no plano, crie o arquivo de sessao com template padrao
- Inclua: contexto, conteudo principal, decisoes, relacionados

### 3.6 Salvar memory
- Se houve feedback ou preferencia, salve na memoria do agente

### 3.7 Commit do cerebro
- Verifique se ha mudancas pendentes no git (arquivos modificados ou novos)
- Se houver, faca commit com mensagem descritiva: `cerebro: [resumo curto do que mudou]`
- Inclua TODOS os arquivos alterados/criados nesta conversa
- Se nao houver mudancas pendentes, pule este passo

### 3.8 Registrar telemetria enriquecida

Registra 1 linha JSONL com metadata desta conversa em `~/.claude/telemetria/chats-enriquecidos.jsonl`. E o que alimenta `/pique:tempo` e a fase 1.5 do `/pique:review-semanal`.

**Passo 1 — localizar JSONL da sessao atual:**
- Derive o slug do `cwd` atual (regras em `/pique:tempo` secao "Como ler": `\`, `/`, espaco -> `-`; `:` -> `--`).
- Rode `ls -t ~/.claude/projects/<slug>/*.jsonl | head -1` pra pegar o arquivo mais recente (e a sessao em andamento).
- Se a pasta-projeto nao existir ou estiver vazia: **PULE silencioso, nao quebre o encerrar.** Primeiro uso do cwd nunca teve JSONL antes de hoje.

**Passo 2 — extrair dados do JSONL nativo** (usar `Grep`, nao `Read` integral):
- `session_id`: do nome do arquivo ou do campo `sessionId` de qualquer linha
- `first_ts`: `timestamp` da primeira linha com `"type":"user"`
- `last_ts`: `timestamp` da ultima linha do arquivo
- `modelos`: `message.model` distintos de linhas `"type":"assistant"`
- `primeiro_prompt`: primeira ocorrencia de `message.content[*].text` no primeiro `"type":"user"` (pular `<ide_opened_file>` e `<command-name>` se houver, pegar o texto real)
- `wall_seconds`: `last_ts - first_ts` em segundos. Aceitar que subestima 2-5s (o proprio encerrar ainda nao escreveu a linha final).

**Passo 2.5 — extrair contexto operacional da sessao** (alimenta `/pique:continuar`):

- `arquivos_tocados`: `Grep` no `<sessionId>.jsonl` por `"name":"Edit"`, `"name":"Write"`, `"name":"NotebookEdit"`. Extrair `input.file_path` de cada match. Normalizar pra path relativo ao `cwd` (strip prefixo). Dedup. Maximo 20 (truncar silencioso).
- `diretorios`: dirname distinto dos `arquivos_tocados`. Dedup. Maximo 10.
- `commits`: se `cwd` e repo git, rode `git -C "<cwd>" log --since="<first_ts>" --pretty=%h`. Pegue ate 10 SHAs curtos. Se `git` falhar ou nao for repo, `[]`.
- `tags`: 2-4 palavras-chave curtas sobre o tema (reusa a classificacao da Fase 3). Ex: `["telemetria","comando","continuar"]`.

Falha silenciosa em qualquer um: o campo vai como `[]`. Nao bloqueia o encerrar.

**Passo 3 — Claude classifica (sem perguntar ao usuario):**
Claude tem TODO o contexto da conversa que acabou de encerrar. Classifique direto:
- `tema`: 3-5 palavras descrevendo do que a conversa tratou
- `resumo`: 1 linha <= 120 caracteres
- `categoria`: uma das 3 letras
  - **A** = mecanico (tasks operacionais, comandos, consultas rapidas)
  - **B** = processamento (refactor medio, analise, brainstorm com saida concreta, reviews)
  - **C** = estrategico (decisao de rumo, arquitetura, planejamento, mudanca de produto)
- `projeto`: ultima componente do `cwd` normalizada (ex: `MEU-CEREBRO`, `plugin-pique`)

**Passo 4 — escrever 1 linha JSONL append em `~/.claude/telemetria/chats-enriquecidos.jsonl`:**

Schema:
```json
{"ts":"<ISO UTC fim>","session_id":"<uuid>","cwd":"<cwd>","projeto":"<nome>","tema":"...","resumo":"...","categoria":"B","wall_seconds":1234,"modelos":["claude-opus-4-6"],"primeiro_prompt":"...","arquivos_tocados":["projetos/x.md","pique/infra/y.md"],"diretorios":["projetos/","pique/infra/"],"commits":["a1b2c3d"],"tags":["telemetria","comando"]}
```

Campos `arquivos_tocados`, `diretorios`, `commits`, `tags` foram introduzidos no plugin-pique 1.6.0. Entradas anteriores nao tem esses campos — leitores devem tratar como `[]` quando ausente.

**Como escrever a linha (obrigatorio via Python, NAO via `echo`):**

Montar a linha JSON com `python -c "import json, io; io.open(path, 'a', encoding='utf-8').write(json.dumps(obj, ensure_ascii=False) + chr(10))"` usando um dict Python com os campos. `json.dumps` escapa backslashes do `cwd` Windows corretamente (`c:\Users\...` vira `"c:\\Users\\..."`). Echo manual quebra porque aspas simples do Bash preservam o texto cru, e `cwd` com 1 barra invertida vira JSON invalido pelo parser estrito (precedente: 86% das linhas legadas falham `json.loads` — parser tolerante em `/pique:dashboard` cobre as antigas, mas entradas novas DEVEM ser validas).

**Gotcha:** nao usar heredoc `python << 'PYEOF'` com regex contendo `\\` — Git Bash Windows engole uma das barras. Usar `python -c "..."` com aspas duplas externas e aspas simples internas (ou vice-versa), OU escrever script temp em `/tmp/` e chamar `python /tmp/script.py`.

Se o append falhar (permissao, disco), silenciar — nao bloqueia o encerrar. Apos escrever, validar `python -c "import json; json.loads(open(path).readlines()[-1])"` — se falhar, logar warning e seguir.

**Regra critica:** categoria e classificacao subjetiva do proprio Claude. Nao pergunte ao usuario, nao mostre no resumo final da Fase 4. E metadado silencioso pra analise posterior.

---

## Fase 4: Confirmacao final

Apresente resumo do que foi feito:

```
## Encerrado

**Cerebro:**
- Atualizado: [lista]
- Criado: [lista]

**ClickUp:** [X tasks criadas]
**Calendar:** [X eventos criados]
**Sessao:** [salva/nao necessario]
**Git:** [commit feito / nada pendente]

Tudo atualizado. Pode fechar esse chat.
```

---

## Fase 5: Insight de uso IA (executar sempre ao final)

Objetivo: detectar UM padrao de uso desta conversa que o Henrique poderia melhorar no workflow com IA. Nao e sobre o CONTEUDO da conversa — e sobre COMO a conversa foi conduzida.

Analise a conversa buscando evidencia concreta de:
- Prompt ou pedido repetido 2+ vezes (candidato a skill/template/agent)
- Tempo gasto em transformacao manual que MCP/agent/skill ja existente resolveria
- Correcao de abordagem por falta de contexto que poderia ser pre-carregado (MCP, CLAUDE.md, memoria)
- Handoff manual entre 2 ferramentas que poderia ser automatizado
- Tarefa repetitiva que provavelmente reaparece em outros chats (dor recorrente)

**Regra dura:** so gere insight se houver evidencia CONCRETA e EVIDENCIADA nesta conversa. Sem padrao claro = nao escreva nada, nao mostre nada, nao toque no doc. NAO invente pra preencher. Ruido mata o doc acumulativo.

Sinais que NAO contam (evita generico):
- "Voce poderia usar mais /comando X" — sem justificativa de volume ou dor real
- "Vale criar um agent pra isso" — sem evidencia de repeticao
- Reflexao filosofica sobre produtividade
- Insight que ja foi registrado em chat recente (checar ultimas entradas do doc antes de escrever)

Se identificar algo evidenciado:

1. Mostre ao usuario:
```
[INSIGHT DE USO IA]
**Padrao:** [1 frase — o que aconteceu nesta conversa]
**Sugestao:** [1 frase concreta — skill X, agent Y, MCP Z, shortcut, mudanca de processo]
**Categoria:** [automacao | skill | agent | contexto | workflow]
```

2. Anexe em `conhecimento/produtividade/insights-uso-ia.md` neste formato (no final do arquivo, apos `## Entradas`):
```
### YYYY-MM-DD HH:MM — [tema curto da conversa]
**Padrao observado:** [1 frase]
**Acao sugerida:** [1 frase concreta]
**Categoria:** [uma das 5]
```

Se o arquivo nao existe ainda, crie com cabecalho padrao do cerebro (template em CLAUDE.md do cerebro) e adicione a entrada inicial.

Categorias:
- **automacao** — script, cron, RemoteTrigger
- **skill** — novo command Claude Code (ou melhoria de skill existente)
- **agent** — sub-Claude especializado
- **contexto** — MCP, pre-load no CLAUDE.md, memoria persistente
- **workflow** — mudanca de processo (sem codigo novo)

---

## Regras

- NAO execute nada sem aprovacao do plano (Fase 2).
- Se a conversa foi puramente operacional (ex: "muda status da task"), o plano vai ser minimo — e ta certo. Nao invente acoes desnecessarias.
- Se a conversa ja executou tudo durante o fluxo (ex: usou `/pique:bom-dia` que ja salva diario), sinalize no plano: "Ja executado durante a conversa — nada pendente."
- Quando em duvida se algo deve ser salvo, inclua no plano com "[?] — vale salvar?" pra o usuario decidir.
- NAO duplique informacao. Se algo ja foi salvo por outra skill na mesma conversa, nao salve de novo.
- Comunique-se em portugues brasileiro, direto e sem formalidade.

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. O plano classificou corretamente o que salvar vs descartar?
2. Houve duplicacao com algo ja salvo por outra skill na conversa?
3. Alguma acao relevante da conversa ficou de fora do plano?
4. Conversas puramente operacionais geraram plano minimo (sem acoes inventadas)?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
```

2. Anexe em `pique/infra/melhorias-plugin.md` no formato:
```
## YYYY-MM-DD — encerrar (usuario)
- [melhoria 1]
- [melhoria 2]
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
