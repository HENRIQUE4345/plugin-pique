---
description: Processamento pos-reuniao. Recebe transcricao de reuniao e extrai tudo que e acionavel. Execute este fluxo EXATAMENTE, sem pular etapas.
---

Processamento pos-reuniao. Recebe transcricao de reuniao e extrai tudo que e acionavel. Execute este fluxo EXATAMENTE, sem pular etapas.

## Ferramentas

- **Operacoes ClickUp** (criar tasks): delegar ao agent `gestor-clickup`
- **Google Calendar** (criar eventos, buscar reunioes): chamar diretamente (connector leve)
- **Gmail** (buscar anotacoes Gemini): chamar diretamente (connector leve)

> **IMPORTANTE**: Se as tools do ClickUp nao estiverem disponiveis (agent gestor-clickup falhar), avise o usuario: "ClickUp MCP esta desativado. Ative em: VS Code → MCP Servers → clickup → Enable. Depois me chame de novo." NAO tente continuar sem ClickUp — pare e espere.

## Quando usar

- Apos qualquer reuniao gravada (cliente, interna, prospect, parceiro)
- Quando o usuario colar transcricao de audio/video
- Funciona pra reunioes presenciais (transcricao do celular) e online (Meet/Zoom)

---

## Fase 0: Modo de entrada

Se o usuario JA colou uma transcricao junto com o comando, pule direto pra Fase 1.

Caso contrario, pergunte:

```
Como quer enviar a reuniao?

1. **Automatico** — busco na agenda do Google e puxo as anotacoes do Gemini
2. **Manual** — voce cola a transcricao aqui
3. **Lote** — voce aponta uma PASTA (ex: inbox/yabadoo-desktop/) e eu processo todas as transcricoes de uma vez

Qual?
```

### Se modo automatico:

#### 0.1 Listar reunioes recentes

Busque eventos dos ultimos 7 dias no calendario Pique Agenda (ID em CLAUDE.md do plugin) com `condenseEventDetails: false`.

Filtre apenas eventos que tenham attachment com `title: "Anotações do Gemini"` (mimeType `application/vnd.google-apps.document`).

Apresente lista numerada:

```
Reunioes com anotacoes do Gemini (ultimos 7 dias):

1. [24/03 09:00] Reuniao Edith — Marco
2. [24/03 10:30] Reuniao Karine — Marco
3. [24/03 13:00] Reuniao Projeto Beto — Henrique, Daniel, Beto
4. [30/03 09:30] Reuniao Arthur — Arthur
...

Qual reuniao? (numero ou "todas")
```

Incluir data, hora, nome do evento e participantes (extrair dos attendees).

#### 0.2 Buscar conteudo das anotacoes (Drive-first)

Apos o usuario escolher, tente buscar o conteudo nesta ordem:

**Tentativa 1 — Google Drive (preferida):**
Pegue o `fileId` do attachment do evento (`title: "Anotações do Gemini"`) e leia direto via `mcp__claude_ai_Google_Drive__read_file_content`. Drive-first e mais direto: zero copy-paste manual, funciona mesmo quando o email do Gemini foi pra outro participante e captura reunioes nao agendadas (basta o doc existir).

**Tentativa 2 — Gmail (fallback):**
Se o Drive nao retornar conteudo (sem permissao, attachment removido), busque email de `from:gemini-notes@google.com` com o nome da reuniao no subject (`gmail_search_messages`). Leia body com `gmail_read_message`.

**Tentativa 3 — Fallback manual:**
Se nada funcionar, mostre o link do Google Doc:

```
Nao consegui ler a anotacao automatica. O doc esta aqui: [link do Google Doc]
Abre, copia o conteudo e cola aqui que eu processo.
```

#### 0.3 Preencher contexto automaticamente

Com o evento do Calendar + conteudo do Gemini, preencha automaticamente:
- **Qual reuniao:** nome do evento
- **Quem estava:** attendees do evento
- **Data:** data do evento
- **Proveniencia (registro de segunda-mao):** se o email do Henrique NAO esta nos attendees, marcar `henrique_presente = false`. Isso ativa o modo registro-de-segunda-mao: documenta a reuniao pro acervo Pique, mas (a) poe no header da sessao "Henrique nao presente — registro a partir das anotacoes do Gemini"; (b) **pula o gate de atribuicao de fala** (Fase 3.1b); (c) nao cria task com o Henrique como dono sem ele confirmar. Usado quando o `/boa-noite` delega reuniao que o Henrique nao participou.

Pule a Fase 1 e va direto pra Fase 2.

### Se modo manual:

Siga a Fase 1 normalmente.

### Se modo lote:

Processa N transcricoes de uma pasta de uma vez (ex: exports do TRANSCRIB/Gemini acumulados em `inbox/yabadoo-desktop/`). Rodou a mao em 06/07 com 8 transcricoes, 0 erro — agora e caminho de 1a classe.

#### 0L.1 Inventariar a pasta

Peca (ou receba) o caminho da pasta. `ls` os arquivos de transcricao (`.md`, `.txt`) — **ignore** `.gitkeep`, `desktop.ini`, `PLANO.md`. Liste o que achou:

```
Encontrei N transcricoes em <pasta>:
1. arquivo-1.md
2. arquivo-2.md
...
Vou processar todas em paralelo (1 agente por transcricao). Segue?
```

#### 0L.2 Fan-out — 1 agente por transcricao

Dispare um sub-agente (Workflow/Task) por arquivo, EM PARALELO. Cada agente recebe no prompt: o caminho do arquivo + a instrucao de rodar o **Gate de dedup (Fase 2.1b)** e o **Gate anti-sobreposicao (Fase 3.1c)** contra o cerebro, e devolver um MINI-RELATORIO estruturado (nao executar escrita — so classificar e extrair o delta proposto):

```
Retorne pra cada transcricao:
- arquivo
- classificacao dedup: JA_ANALISADA | PARCIAL | NOVA | RUIDO (+ 1 linha de por que, apontando a sessao existente se houver)
- resumo (2-3 linhas)
- pontos acionaveis (decisoes/tasks/pendencias) — SO o delta que sobrevive ao gate anti-sobreposicao
- sessao-alvo no cerebro (criar novo path OU atualizar existente OU nenhum)
```

O sub-agente NAO cria task, NAO escreve arquivo, NAO mexe em ClickUp — so le, classifica e propoe. A execucao e centralizada depois (Fases 4-5), com aprovacao unica do usuario.

#### 0L.3 Painel consolidado

Junte os mini-relatorios num painel unico, ordenado por classificacao (NOVA/PARCIAL primeiro, JA_ANALISADA/RUIDO no rodape pra transparencia):

```
## Lote pos-reuniao — <pasta> (N transcricoes)

### NOVAS (processar)
| # | Arquivo | Resumo | Acionaveis | Sessao-alvo |
|---|---------|--------|-----------|-------------|
| 1 | ... | ... | 2 decisoes, 1 task | criar sessoes/... |

### PARCIAIS (ja tem doc derivado — anexar so o delta)
| # | Arquivo | Ja existe | Delta a anexar |

### JA_ANALISADAS / RUIDO (nao processar — so registro)
| # | Arquivo | Motivo |
```

Depois do painel, o fluxo converge pra Fase 4 (apresentar acoes propostas consolidadas de TODO o lote) e Fase 5 (executar em bloco). A **Fase 5.6 (limpeza do inbox)** e obrigatoria no fim do lote.

---

## Fase 1: Contexto da reuniao

Pergunte (so o que nao conseguir inferir da transcricao):

1. **Qual reuniao?** (ex: review semanal, reuniao com Beco, call com prospect X)
2. **Quem estava?** (nomes e papeis)
3. **Data?** (se nao for hoje)

Se o usuario ja deu essas informacoes junto com a transcricao, NAO pergunte de novo.

---

## Fase 2: Reconhecimento (automatico, NAO pergunte nada)

Antes de processar a transcricao, busque contexto:

### 2.1 Cerebro

Consulte `_mapa.md` e busque:
- Ja existe arquivo sobre esse cliente/projeto/tema?
- Tem sessao de reuniao anterior com os mesmos participantes?
- Tem decisoes pendentes que podem ter sido resolvidas?

**Nao-duplicar (gate):** antes de criar sessao nova, **grep em `pique/sessoes/` (e `sessoes/`) por (data + slug do titulo)**. Se ja existe sessao OU doc de prep dessa mesma reuniao → **ATUALIZAR o existente, nao criar duplicata** (registra so o delta). Critico quando o `/boa-noite` delega: a reuniao pode ja ter sido documentada manualmente.

### 2.1b Gate de dedup por CONTEUDO (antes de extrair)

O grep por titulo (2.1) e barato mas cego — pega colisao de nome, nao de conteudo. Antes de gastar extracao, classifique a transcricao comparando o **CONTEUDO** (nao o nome do arquivo) contra as sessoes existentes em `pique/sessoes/` **e** `sessoes/`:

| Classe | Criterio | Acao |
|--------|----------|------|
| **JA_ANALISADA** | O conteudo desta transcricao ja foi destilado numa sessao/ata existente (as decisoes, tasks e pendencias ja estao la) | NAO extrair. So registrar "ja processada em [arquivo]". |
| **PARCIAL** | Existe um doc DERIVADO da reuniao (download solo, ata-checklist de prep, resumo) mas ele nao cobre tudo — falta delta | ATUALIZAR o doc existente com o delta que falta. Nao criar sessao nova. |
| **NOVA** | Nao ha sessao com esse conteudo | Processar do zero (Fase 3+). |
| **RUIDO** | Transcricao sem conteudo acionavel (teste de mic, conversa fiada, audio solto) | Descartar. So arquivar o bruto (Fase 5.6). |

**Armadilhas que este gate resolve (nao classificar pelo NOME):**
- Arquivo `*-PAUTA.md` que **ja teve a ata anexada** no proprio arquivo (secao "O que rolou"/"O que foi decidido") = **JA_ANALISADA**, mesmo o nome dizendo "PAUTA". Ler o corpo, nao o titulo.
- **Download solo derivado** (o Henrique reprocessou a reuniao sozinho num chat e salvou) ≠ ata real da reuniao. Se o solo cobre parte do que a transcricao traz, e **PARCIAL** (anexar o delta que o solo nao pegou), nao JA_ANALISADA.

No modo lote, cada sub-agente roda este gate na sua transcricao e devolve a classe no mini-relatorio (Fase 0L.2). No modo single, rode aqui e sinalize a classe antes de seguir pra Fase 3. Se `JA_ANALISADA` ou `RUIDO`, PARE a extracao e reporte — nao gaste Fase 3-4 pra nada.

### 2.2 ClickUp

Consulte `pique/infra/clickup-setup.md` para IDs.

Busque tasks relacionadas ao tema da reuniao:
- Tasks em qualquer status que mencionam o cliente/projeto
- Tasks atribuidas aos participantes da reuniao

### 2.3 Tipo de reuniao

Classifique automaticamente:

| Tipo | Exemplo | Destino no cerebro |
|------|---------|-------------------|
| **Interna fixa** | Planejamento, review, brainstorm conteudo | `sessoes/YYYY-MM-DD-HHMM-[tipo]-[descricao].md` |
| **Cliente** | Reuniao com Beco, Miika, prospect | `sessoes/YYYY-MM-DD-HHMM-reuniao-[cliente].md` + atualizar arquivo do cliente |
| **Parceiro/externo** | Call com Daniel, Arthur, Gabriel | `sessoes/YYYY-MM-DD-HHMM-reuniao-[participante].md` |
| **1:1 com Marco** | Reuniao avulsa H+M | `sessoes/YYYY-MM-DD-HHMM-reuniao-marco.md` |

---

## Fase 3: Processar transcricao

Quando o usuario colar a transcricao:

### 3.0 Descartar ruido pre-reuniao (Meet/celular com microfone aberto)

Transcricao de Meet/celular costuma capturar audio solto ANTES da reuniao comecar (conversa paralela, futebol, WhatsApp). Se o inicio e tematicamente desconexo do titulo/participantes E ha um ponto claro onde a reuniao arranca (saudacoes, entrada de participante remoto, leitura de pauta), **descartar o trecho `[00:00–XX:XX]` e processar so dali**. Sinalizar: "descartei [00:00–XX:XX] como ruido pre-reuniao". Na duvida, manter — nao cortar conteudo de reuniao real.

### 3.1 Cruzar com contexto existente

Para cada informacao na transcricao, classifique:
- **CONFIRMADO** — algo que ja existia no cerebro e foi reafirmado
- **NOVO** — informacao que nao existia
- **MUDOU** — algo que existia mas foi alterado/corrigido
- **CONTRADIZ** — algo que contradiz o que esta no cerebro (sinalizar!)

### 3.1b Confirmar atribuicao de falas ambiguas (gate)

**Trigger:** transcricao multi-speaker SEM speaker labels (celular gravando presencial, microfone ambiente, audio de Meet sem diarizacao) E reuniao com 2+ participantes. **PULAR este gate** se `henrique_presente = false` (modo registro-de-segunda-mao, Fase 0.3): o Henrique nao estava na reuniao, nao ha narrativa dele pra separar de dor de prospect — documentar fiel ao que o Gemini ja rotulou.

Antes de extrair dores/fatos/decisoes, liste 5-10 frases estruturantes da transcricao (as que carregam dor, decisao, ou auto-narrativa) e pergunte ao usuario:

```
Antes de extrair, preciso confirmar quem disse o que. Transcricao sem labels — 
risco de atribuir narrativa do apresentador como se fosse dor do prospect.

Quem disse cada uma?

1. "[frase 1]"
2. "[frase 2]"
3. "[frase 3]"
...

Responda no formato: 1=Henrique, 2=prospect, 3=ambiguo (descartar)
```

**Especialmente critico em pitch comercial** — narrativas do apresentador costumam colar em dores do cliente sem essa validacao. Caso pitch Vitor Padarias: 4 blocos atribuidos errado, usuario corrigiu 3 rodadas.

ESPERE resposta antes de prosseguir pra 3.2.

### 3.1c Gate anti-sobreposicao (cruzar com o estado MAIS RECENTE)

A Fase 3.1 cruza a transcricao com o estado do cerebro no MOMENTO da reuniao. Mas se a reuniao e ANTIGA (comum no modo lote, processando um backlog de transcricoes), uma decisao dela pode ter sido **sobreposta depois** — superada por reuniao posterior, ja virada task no ClickUp, ou ainda em conflito aberto. Anexar o delta cru sem checar isso reintroduz decisao morta.

Antes de cravar cada Decisao/Task/Pendencia (Fase 3.2) como delta valido, cruze com o que veio DEPOIS da data desta transcricao:
- **Sessoes/atas posteriores** em `pique/sessoes/` + `sessoes/` (mesma frente/participantes, data > data da transcricao)
- **Trilho** (`TAREFAS.md`) e `log-do-feito.md` — o item ja foi feito/decidido/movido?
- **ClickUp** (2.2) — a task ja existe? Ja foi criada/fechada?

Para cada item, marque:
- **VALIDO** — ainda de pe, vira delta.
- **SUPERADO** — decisao mais recente sobrepos. NAO anexar como decisao atual; no maximo registrar no historico da sessao "(superado por [fonte] em [data])".
- **JA_EXECUTADO** — ja virou task/entrega. NAO recriar. Se muito, so anotar o ID.
- **CONFLITO_ABERTO** — o tema ainda esta em disputa noutro doc. NAO cravar como decisao — sinalizar o conflito, nao escolher lado.

Exemplos reais (06/07, que motivaram este gate): standup 09:24 superado pelo Sync 14:30 do mesmo dia (SUPERADO); bugs do Gabriel ja pautados E ja virados Tasks ClickUp 479/480/481 (JA_EXECUTADO); "processo por setor" ainda em CONFLITO ABERTO noutro map (CONFLITO_ABERTO — cravar seria erro). Esse gate reduziu "processar 5 atas" pra "2 atas + mover 1 + ZERO task nova". No modo lote e passo OBRIGATORIO de cada sub-agente.

### 3.2 Extrair categorias

| Categoria | O que extrair |
|-----------|--------------|
| **Decisoes** | "Vamos fazer X", "Nao vamos Y", "Decidimos Z". Incluir MOTIVO. |
| **Tasks** | Acoes concretas com dono. Verbo no infinitivo. |
| **Informacao** | Fatos, dados, contextos novos. |
| **Compromissos** | Prazos, reunioes agendadas, entregas combinadas. |
| **Dores/problemas** | Problemas mencionados (especialmente de clientes). |
| **Ideias** | Sugestoes, brainstorms, possibilidades levantadas. |
| **Pendencias** | Coisas que ficaram em aberto, precisam de resposta, aguardam alguem. |

### 3.3 NAO extrair

- Conversa fiada, cumprimentos, transicoes
- Repeticoes (mesmo ponto dito de formas diferentes)
- O que ja e sabido e foi apenas mencionado de passagem

---

## Fase 4: Apresentar resultado

```
## Pos-reuniao — [Titulo da reuniao]
**Data:** YYYY-MM-DD
**Participantes:** [nomes]
**Tipo:** [interna/cliente/parceiro]
**Duracao estimada:** [do tamanho da transcricao]

---

### Decisoes tomadas
1. [Decisao] — Motivo: [por que]
2. [Decisao] — Motivo: [por que]

### Tasks identificadas
| Task | Responsavel | Prazo | Space/Projeto |
|------|-------------|-------|---------------|
| [Verbo + acao] | [quem] | [quando] | [onde] |

### Informacao nova
- [fato/dado novo] — atualizar [arquivo] no cerebro
- [contexto novo] — criar/atualizar [onde]

### Compromissos agendados
- [evento] — [data, horario, quem]

### Dores/problemas identificados
- [dor] — de quem: [cliente/interno]

### Ideias (nao decidido, pra considerar)
- [ideia]

### Pendencias (ficou em aberto)
- [pendencia] — aguardando [quem/o que]

### Contradiz algo existente [?]
- [se houver] — arquivo [X] diz Y, mas na reuniao disseram Z

---

### Acoes propostas

**Cerebro:**
- Atualizar: [arquivo] — [o que muda]
- Criar: [novo-arquivo.md] em [pasta/] — sessao da reuniao

**ClickUp:**
- Criar task: [lista de tasks]
- Atualizar task: [tasks existentes que precisam de update]

**Calendar:**
- Criar evento: [se aplicavel]

**Trilho pessoal do Henrique (`TAREFAS.md`):**
- [resíduo que exige DECISÃO/AÇÃO dele] → [§DECISÕES / SEMANA / RESTO / AGUARDANDO]
- (ou: "Nenhum — nada que dependa só do Henrique")

Posso executar?
```

**Se alguma secao estiver vazia, escreva "Nenhum" — NAO omita.**

**Regras especiais ao montar tasks na Fase 4:**

- **Task pra executor autonomo (Gabriel/Marco/Arthur fazem sozinhos) precisa SECAO DE REFERENCIA.** Descricao generica nao passa. Incluir explicitamente o que a pessoa faz pra ela conseguir destrinchar:
  - Gabriel = `iairique`, `Yabadoo`, `operacional`/edicao
  - Marco = `pique B2B`, `gestao-pessoas`, `clientes (Beco/etc)`
  - Arthur = `engenharia`, `infra/tooling`, `automacoes`
  - Mencionar tambem o plugin-pique correspondente (`/pique:planejar-tasks` ou `/pique:planejamento-semanal`).

- **Nome mal transcrito = flag `[?]` antes de inferir.** Quando um nome na transcricao nao bate com nenhuma entidade conhecida (ex: "Emargo", "Yamadu", "Marmo" que aparentam ser "Yabadoo"), NAO inferir silenciosamente. Sinalizar com `[?]` na proposta:
  ```
  Task: "Validar perfil [?] (transcricao: 'Yamadu' — bater com Yabadoo?)"
  ```
  Confirmar com o usuario antes de criar a task. Nao assumir que o transcrito e canonico so porque aparece escrito.

- **Resolver o dono antes de cravar assignee (`resolve_member`).** Antes de propor o assignee de cada task, rodar `resolve_member` no dono designado. Se NAO resolver (membro novo / guest sem acesso — ex: alguem que comecou essa semana), NAO atribuir silenciosamente: gerar task de onboarding "Adicionar [nome] ao ClickUp" + marcar o assignee como temporario (ex: Marco) na proposta, sinalizando. Conecta com a regra do guest sem acesso a list.

ESPERE o usuario revisar e aprovar antes de continuar.

---

## Fase 5: Execucao

Apos aprovacao:

### 5.1 Salvar sessao no cerebro

Crie `sessoes/YYYY-MM-DD-HHMM-[tipo]-[descricao].md` com template padrao:

```markdown
# Sessao — [Titulo da reuniao]

**Criado:** YYYY-MM-DD HH:MM
**Status:** ativo
**Tags:** sessao, [tags relevantes]

## Contexto
[Tipo de reuniao], [participantes], [motivacao].

## Decisoes
- [decisao 1] — Motivo: [por que]
- [decisao 2] — Motivo: [por que]

## Tasks criadas
- [ ] [task 1] → [responsavel]
- [ ] [task 2] → [responsavel]

## Informacao nova
- [o que foi aprendido/descoberto]

## Pendencias
- [o que ficou em aberto]

## Relacionado
- [links para arquivos atualizados]
- [link para sessao anterior se existir]
```

### 5.2 Atualizar arquivos existentes

- Se a reuniao e sobre um cliente, atualize o arquivo do cliente (ex: `pique/clientes/beco.md`)
- Se gerou decisoes que afetam estrategia, atualize o arquivo relevante
- Se contradiz algo, corrija e registre a mudanca

### 5.3 ClickUp

- Crie tasks seguindo as regras do CLAUDE.md
- Se alguma task existente foi resolvida na reuniao, proponha mover para "Finalizado"
- Se alguma task existente ganhou contexto novo, atualize a descricao

### 5.3b Rotear resíduo do Henrique pro trilho pessoal

O ClickUp (5.3) recebe as entregas da EQUIPE (a Carol gere). O que sobra que depende **do Henrique** — decisão que só ele toma, ação dele, ou espera de terceiro — NÃO vive no ClickUp; vive no `TAREFAS.md` (trilho pessoal, raiz do cerebro). Sem este passo, a decisão fica presa na ata e se perde (era o gap: a reunião virava ata + tasks de equipe, mas nada alimentava o trilho dele).

Das **Decisões** + **Pendências** (Fase 3.2), separe o **resíduo do Henrique** e roteie cada um pro lugar certo, apontando a ata como fonte:
- **Decisão que só ele toma** → `## DECISÕES`
- **Ação dele com prazo** → `## SEMANA` (se é desta semana) ou `## RESTO`
- **Ele esperando terceiro** → `## AGUARDANDO`

**Filtro anti-cemitério (crítico):** só entra o que exige **ação/decisão dele**. Informação, entrega de equipe (já foi pro ClickUp em 5.3) e o que já foi resolvido **NÃO viram item** — ficam só na ata. Se a reunião gerou muitas decisões dele, consolide num **item-âncora único** apontando pra ata (não espalhe 10 linhas — o próprio Henrique rejeita "lotar de tarefa, senão vira cemitério"). **Não duplicar** com o ClickUp (equipe) nem com o `AGUARDANDO` existente.

### 5.4 Google Calendar

- Se foram agendados compromissos, crie no calendario Pique Agenda
- Adicione participantes como convidados
- Inclua pauta/contexto na descricao do evento

### 5.5 Atualizar _mapa.md

Se criou arquivo novo, adicione ao mapa.

### 5.6 Limpeza do inbox (pos-processamento)

Obrigatoria quando as transcricoes vieram de uma pasta de inbox (modo lote, ou single a partir de um export do inbox). O inbox e area de transito — nao deve acumular brutos ja processados. NAO apagar os brutos: **arquivar**, seguindo o padrao ja existente de junho.

1. **Arquivar os brutos** em `arquivo/sessoes-brutas/YYYY-MM/` (mes da reuniao). `mv`, nao `cp` — mover, nao copiar. Vale pra TODAS as classes do gate de dedup (2.1b), incluindo `RUIDO` e `JA_ANALISADA`: o bruto sai do inbox mas fica preservado no arquivo. Criar a pasta do mes se nao existir.
2. **Corrigir os links que apontavam pros brutos movidos.** Antes de mover, `grep` pelos nomes dos brutos nos docs do cerebro (sessoes que referenciam a transcricao, `_mapa.md`, etc). Todo doc que linkava `inbox/<pasta>/<bruto>` precisa ser reapontado pro novo path `arquivo/sessoes-brutas/YYYY-MM/<bruto>` — senao a referencia quebra silenciosamente (aconteceu em 06/07 ao mover um brainstorm que 3 docs — 1242/hipotese/visao — referenciavam).
3. **Grep de sanidade no fim.** Confirme que a pasta de origem (ex: `inbox/yabadoo-desktop/`) nao tem mais transcricao pendente (`ls` deve sobrar so `.gitkeep`/`desktop.ini`) E que nenhum doc do cerebro ainda aponta pro path antigo dos brutos (`grep -r "inbox/<pasta>/" pique/ sessoes/` deve vir vazio pros arquivos movidos). Reporte o resultado do grep.

---

## Fase 6: Resumo final

```
## Processado

**Sessao:** sessoes/YYYY-MM-DD-HHMM-[tipo]-[descricao].md
**Cerebro atualizado:** [lista de arquivos]
**ClickUp:** [X tasks criadas, Y atualizadas]
**Calendar:** [X eventos / nenhum]

Reuniao processada. Nada ficou pra tras.
```

**No modo lote,** acrescente a contagem por classe do gate de dedup e a limpeza:

```
## Lote processado — N transcricoes

**Classificacao:** [A NOVAS · B PARCIAIS · C JA_ANALISADAS · D RUIDO]
**Sessoes criadas:** [lista]
**Sessoes atualizadas (delta):** [lista]
**ClickUp:** [X tasks criadas, Y atualizadas]
**Limpeza inbox:** [N brutos arquivados em arquivo/sessoes-brutas/YYYY-MM/ · L links reapontados · grep de sanidade: OK/pendencias]

Lote processado. Inbox limpo, nada ficou pra tras.
```

---

## Regras

- NAO execute nada sem aprovacao (Fase 4).
- Se a reuniao ja foi parcialmente processada por outra skill (ex: planejamento semanal), sinalize e NAO duplique.
- Foque no DELTA — o que e novo. Nao repita o que o cerebro ja sabe.
- Tasks sempre com verbo no infinitivo, responsavel e prazo (regras do CLAUDE.md).
- Se a transcricao for confusa ou incompleta, sinalize os trechos que nao conseguiu interpretar com [?].
- Se a reuniao menciona algo que nao esta mapeado no cerebro (novo cliente, novo projeto), sinalize e proponha onde criar.
- NAO julgue o conteudo da reuniao. Extraia, organize, proponha.
- Comunique-se em portugues brasileiro, direto e sem formalidade.

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. Extraiu tudo que era acionavel da transcricao?
2. Tasks geradas ficaram claras o suficiente pra executar sem perguntar?
3. Focou no delta (novidades) ou repetiu o que o cerebro ja sabia?
4. Trechos confusos foram sinalizados com [?]?
5. O gate de dedup (2.1b) classificou por CONTEUDO, nao pelo nome do arquivo (pegou `-PAUTA.md` com ata anexada, distinguiu download solo de ata real)?
6. O gate anti-sobreposicao (3.1c) cruzou com o estado POSTERIOR — nenhuma decisao SUPERADA/JA_EXECUTADA/CONFLITO_ABERTO foi cravada como delta atual?
7. (Modo lote) A limpeza do inbox (5.6) rodou: brutos arquivados sem apagar, links reapontados, grep de sanidade limpo?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
```

2. Anexe em `pique/infra/melhorias-plugin.md` no formato:
```
## YYYY-MM-DD — pos-reuniao (usuario)
- [melhoria 1]
- [melhoria 2]
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
