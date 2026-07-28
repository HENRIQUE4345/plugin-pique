# Arquitetura do plugin-pique — desenho da metodologia

**Criado:** 2026-07-27
**Status:** desenho fechado, implementação não começou
**Irmão:** `_auditoria-skills.md` (a triagem dos 125 itens e o escopo dos 11 comandos)
**Objetivo:** cravar como o plugin, o ClickUp v2, o Calendar e o Slack se amarram — sem ponta solta — antes de escrever qualquer linha de código.

> **Como este doc nasceu.** Sessão de Afiar de 27/07, modo consultivo. Duas investigações multi-agente contra a fonte real (API do ClickUp, API do Slack, código do MCP, 11 comandos, cérebro): 18 agentes, ~2,6M tokens. Tudo marcado como **verificado** foi lido na fonte; tudo marcado como **spike** ainda não foi.

---

## 1. O quadro — onde mora o quê

| Camada | Mora em | Regra de 1 frase |
|---|---|---|
| **Tarefa** | ClickUp | Tem dono e prazo. É compromisso com outra pessoa. |
| **Compromisso** | Google Calendar | Tem horário. |
| **Caderno de trabalho** | `TAREFAS.md` local | Detalhe e rascunho pessoal, sem estado. Descartável. |
| **Pulso** | Slack | O que aconteceu e o porquê da trava. Não é lista de tarefa. |
| **Acúmulo** | (a decidir) | Melhorias e insights — ninguém lê no dia, várias pessoas escrevem. |

O `TAREFAS.md` **para de ser trilho**. Mantém uma única função mecânica: o carimbo de sessão `(iniciada: HH:MM)`, que alimenta a duração no `log-do-feito.md`. Espaço de trabalho pessoal comporta relógio de sessão; só a *lista* migra pro board.

---

## 2. As 10 decisões

**1. O board é o trilho; o `.md` é caderno.**
Alternativas descartadas: ClickUp puro (todo rascunho vira card formal — o atrito que o trilho existia pra evitar) e híbrido com `## SEMANA` local (mantém a duplicidade que se quer matar).
Consequência mecânica: 4 coisas viviam no `## HOJE` — duração, P/E, WIP e idempotência do rito. Duração fica no `.md`; as outras três passam pro board (ver decisão 9) ou pra estado local.

**2. Posse da bola no lugar das 4 lentes.**
`DECIDIR`, `SUPERVISIONAR` e `FAZER` não eram lentes — eram status do board lidos de um `.md`. Com o board como fonte, o agrupamento vem de graça e é universal: quem não tem nada num grupo não vê o grupo, sem config por papel.

Ordem fixa, por alavanca:
1. **Travada em mim** — card de outro com `Espera decisão de` = eu. Primeiro porque destrava gente.
2. **Está comigo** — minhas tarefas, prazo + foco da semana.
3. **Está com outro** — `aguardando terceiro`.
4. **Fio solto** — apareceu em conversa e nunca virou card. Único que não sai do board.

**3. O MCP próprio vira a API da metodologia.**
Não morre e não fica CRUD. O connector oficial não substitui: ele também não lê custom field em lote, não cria tag e não lê Goal — tem mais tools, não as tools certas. E o `role.ts` do próprio já filtra superfície por papel, o que o oficial não faz.

**4. A fronteira: estrutura no código, metodologia em config, cadência em markdown.**
A metodologia mudou 4 vezes desde 26/06 e uma delas foi hoje. Enum de vocabulário em TypeScript é o bug do `append-log.py` — que rejeita `[Dirigir]` com exit 3 enquanto o modo está em 4 linhas vivas do `TAREFAS.md` e 7 do `log-do-feito.md`.

**5. A tag `semana-NN` fica como mecanismo de commit.**
Motivo decisivo: o payload da API devolve `tags[]` de graça. Duas regras novas, que hoje não estão escritas em lugar nenhum:
- Placar **sempre** cruza tag **E** `due_date` na janela — a recorrência do ClickUp copia a tag pro card da semana seguinte (verificado: 5 cards da semana 32 nasceram com `semana-31`).
- Card de ritual recorrente **não recebe** tag de semana. Ele é rito, não commit.

**6. Os 8 Goals são congelados, não mortos.**
O Goal já não era fonte da verdade — ele lê `task_ids` de marcos. Para de alimentar, não deleta (é irreversível e o baseline do Painel B depende dele). O plugin nunca lê nem promete ler Goal; o farol é calculado dos marcos. Decide matar em 30/09, com evidência.
O painel visual será um **Dashboard do ClickUp** — UI, montado à mão uma vez.

**7. Indicadores: calcula o contável, pergunta só o julgamento.**
Dos 3 indicadores do M1, dois saem do board:

| Indicador | Fonte |
|---|---|
| Rituais rodando com dono ≠ H — ≥80% | Status das subtasks em Rituais & Reuniões |
| Desbloqueios que passam pelo H → ~0 | Cards com `Espera decisão de` = Henrique |
| Recaídas: H cobrou Carol/Gabriel direto | Julgamento — e provavelmente do Marco, não do próprio Henrique |

Indicador nutrido à mão apodrece pior que donut errado: precisa de dono nomeado e carimbo de "atualizado em".

**8. Leitura chamada direto pelo ritual; `gestor-clickup` aposentado por etapas.**
O agent nasceu guardião das regras quando elas só existiam em prosa. Com a validação dentro de `criar_cards`, ele vira intermediário que recebe dado estruturado e devolve texto. Dois freios em código ocupam o lugar dele: a validação na tool e o `confirmar` obrigatório.
**Ordem importa:** a *leitura* sai do agent já na Fase 1 (não há risco em ler direto). A *escrita* só sai na Fase 2, quando `escrever_cards` e `criar_cards` já validam — aposentar antes deixa sem os dois.

**9. O `/iniciar` move o card — exceto na Rumo.**
Presença no board, não relógio. O WIP passa a ser contável de fora e a Carol enxerga sem perguntar.
Marco fica de fora: `ativo` na Rumo significa "em curso neste trimestre", não "estou nisso agora" — mover a cada toque vira ruído.
Se a escrita falhar, carimba no `.md` e segue com um aviso de uma linha. O ritual nunca trava por causa de rede.

**10. Comentário lido só no que vira cobrança.**
Com o `Bloqueado por` excluído em 27/07, a trava externa virou comentário — 1 chamada por card, e há 22 em `aguardando terceiro` no workspace. A leitura da manhã usa status + dias parado; o comentário é lido só nos 1–3 cards que entram na linha "Cobrar" do stand-up.

**11. São 4 modos, e `[Dirigir]` ganhou definição.**
Estava em uso desde 10/07 sem uma linha escrita em lugar nenhum — 7 no `log-do-feito`, 2 no trilho de hoje — enquanto o `append-log.py` o rejeitava com exit 3.

> **`[Dirigir]`** — trabalho cujo output é **outra pessoa seguindo sem você**. Encontro que crava direção, ou pacote que passa o bastão. Termina quando o outro tem o que precisa, não quando você entendeu.

Os quatro se separam pelo **destino**: sua cabeça (Pensar) · o cliente (Produzir) · a ferramenta (Afiar) · o time (Dirigir).
Teste: *"quem sai daqui sabendo o que fazer?"* Se a resposta é "eu", não é Dirigir.
Fronteira com Pensar: se a outra pessoa precisava estar lá pro trabalho acontecer, é Dirigir.
**`Cobrar` não é modo** — é mensagem, não bloco. Fica como seção do trilho.

Dirigir é o modo que serve o **M1 · Descentralizar**: medir quanto do tempo é Dirigir mede o M1 direto, o que nenhum donut faz hoje.
Escrito em 27/07 nos três lugares onde os modos vivem: `~/.claude/CLAUDE.md`, `processo-trabalho-diario.md` e a legenda do `TAREFAS.md`. O `plugin-metodo-pique` **não** recebe — lá os modos são parametrizáveis por desenho, e Dirigir é exemplo do Henrique, não default.

---

## 3. As 6 tools

**17 → 6.** Nenhuma tool com nome de rito. Nenhum enum de vocabulário em TypeScript.

Todo retorno de leitura carrega:

```
assercao: { fonte:'api'|'cache', idade_s, escopo_solicitado, escopo_resolvido,
            ids_mortos:[], ids_desconhecidos:[], truncado:bool, paginas_lidas:N, avisos:[] }
```

Isso existe por causa dos **três silêncios mortais** (verificados): Space arquivado, assignee inexistente e status com acento errado (`espera decisao` sem cedilha) devolvem **200 + zero tasks, sem erro**. Só `list_id` morto grita (404). Vazio sem `assercao` é indistinguível de ID morto.

### 3.1 `estrutura`
`estrutura({ escopo?: 'resumo'|'listas'|'membros'|'campos'|'tags'|'tudo', forcar?, incluir_arquivados? })`

Spaces, listas, statuses com `type`, membros, campos (workspace **e** lista), tags. `escopo:'resumo'` devolve ~8 linhas; os outros abrem o bloco pedido.
Cold ~51 chamadas com concorrência 4; hot 0 (disco, TTL 12h).
**Papel:** viewer. **Mata:** o `defaults.ts` inteiro exceto `WORKSPACE_ID`.

### 3.2 `consultar_cards`
`consultar_cards({ preset?, membro?, list_ids?, space_ids?, statuses?, tags?, campos?, due_de?, due_ate?, fechado_de?, fechado_ate?, nome_regex?, incluir_fechados?, subtasks? = true, arvore_por_parent?, detalhe?: 'resumo'|'completo', max_resultados? })`

`preset` é **string validada em runtime** contra `metodologia.json`, nunca union type. Preset preenche filtros; parâmetro explícito sobrescreve.
Retorno plano: `cards[]` com `posse` e `motivo_posse` por card — **não** agrupado. A ordem dos grupos tem zero semana de uso real; petrificar render no payload é o pior lugar da fronteira.
**1 a 3 chamadas.** **Papel:** viewer. **Donos:** bom-dia, boa-noite, planejamento, review, encerrar.

Regras duras: `statuses[]` é sensível a acento e caixa — resolver pelo `nome_wire` do cache, nunca aceitar string do agente. Dropdown volta como `orderindex` e a 1ª opção vale **0** — testar `!== undefined`, nunca truthiness (foi o bug dos 15 cards `Cliente=Beco`). Filtrar sempre os 4 `BASELINE_*`.

### 3.3 `escrever_cards`
`escrever_cards({ confirmar: 'previsualizar'|'aplicar' (obrigatório), operacoes: [{ task_id, status?, tags_add?, campos?, comentario?, reabrir? }] })`

Alias de status resolvido contra os statuses reais **daquela lista**; alias ambíguo ou desconhecido = **recusa** com a lista dos válidos. Adivinhar status é como card some.
Falha parcial nunca aborta o lote. Idempotente: 2ª execução vira `noop`.
Sem `tags_rem` — `count(tags semana-*)` é o contador de empurrões; limpar destrói o sinal.
**Papel:** editor. **Donos:** boa-noite (o ato central da v2), iniciar, review, planejamento, pos-reuniao.

### 3.4 `criar_cards`
`criar_cards({ confirmar (obrigatório), list_id (obrigatório, explícito), cards: [...], checar_duplicata? = true })`

Campos obrigatórios vêm de `obrigatorios_para_criar` no JSON — **não** de regra em TypeScript, porque a decisão "tudo × só com dono/prazo × híbrido" está aberta.
Card nascido aqui **não recebe tag de semana**: captura de quarta não é commit de segunda.
A tool não conhece rota — `rotas` mora no JSON, resolvida por nome + space contra o cache (o que evita o gotcha das duas listas "Rotina do Cliente" homônimas).
**Papel:** editor. **Donos:** encerrar (fio solto), pos-reuniao, planejamento.

### 3.5 `garantir_tag`
`garantir_tag({ nome, spaces? = 5 vivos })`

Idempotente por construção. O `POST` devolve 200 com corpo vazio — validar exige re-GET.
**Papel:** editor. **Dono:** planejamento-semanal.

### 3.6 `get_task`
`get_task({ task_id, incluir_comentarios?, incluir_subtasks? })`

Zoom-in. Ganhou razão nova: com o `Bloqueado por` excluído, "o que exatamente está travado" só se lê aqui.
**Papel:** viewer.

---

## 4. As 17 tools atuais

| Destino | Tools |
|---|---|
| **Sobrevive** | `get_task` (ganha `incluir_comentarios`) |
| **Renomeia** | `refresh_hierarchy` → `estrutura({forcar:true})` |
| **Vira interna** | `get_hierarchy` · `resolve_member` · `list_tags` |
| **Morre** | `list_tasks` · `update_task` · `add_comment` · `add_tag` · `remove_tag` · `create_task_full` · `move_task` · `delete_task` · `attach_file` · `add_dependency` · `remove_dependency` · `post_chat_message` |

**12 morrem · 3 viram internas · 1 renomeia · 1 sobrevive.** Cada óbito entra no mesmo PR da fase que o absorve — senão nunca acontece.

Notas: `remove_tag` morre de propósito (o contador de empurrões). `attach_file`, `add_dependency` e `remove_dependency` têm zero referência em `commands/`. `post_chat_message` tinha um dono só, o `/news`, que migrou pro Slack em 16/07 — e a skill `fontes-noticias` ainda aponta pro canal ClickUp morto.

**`role.ts` cai de 3 papéis pra 2:** com `delete_task` morto, owner e editor ficam idênticos. `owner` vira alias de `editor`.

---

## 5. A fronteira

**TypeScript** — só forma de API: cliente HTTP com freio no `X-RateLimit-Remaining` antes do 429; paginação em duas estratégias (`last_page` nos endpoints de `/list`, `len<100` nos de `/team`); resolvedor de custom field orderindex ↔ UUID; cache com TTL; avaliador genérico de predicados; bloco `assercao`.

**Proibido em `.ts`:** literal de status, camada, rota, rito, cliente, tipo ou lista (exceto `WORKSPACE_ID`), limiar numérico, cor, e a palavra "aderência".

**Config compartilhada** — `plugin-pique/config/metodologia.json`, versionado no repo do plugin (não no submodule `pique/`, que é do MEU-CEREBRO — o MCP não pode depender do cérebro pessoal de ninguém pra bootar):

```json
{
  "versao": 1,
  "workspace_id": "36702200",
  "listas_ancora": { "rumo": "901327847794", "rituais": "901327847802" },
  "listas_recorrentes": ["901327847802", "901327858752", "901327859343"],
  "listas_sem_presenca": ["901327847794"],
  "desfechos_negativos": ["cancelada", "não atingido", "abandonada", "engavetada"],
  "status_aliases": {
    "concluido": { "por_type": "closed" },
    "abortado":  { "por_type": "done", "exigir_em": "desfechos_negativos" },
    "a_fazer":   { "por_type": "open" },
    "fazendo":   { "nomes": ["fazendo","construindo","produção","gravar","editar","desenvolvendo","ativo","em piloto","revisar","preparar pauta"] },
    "espera_decisao":      { "nomes": ["espera decisão"] },
    "aguardando_terceiro": { "nomes": ["aguardando terceiro"] }
  },
  "campos": {
    "camada": "3f70770c-2bee-4210-807d-2ea65bda53f3",
    "objetivo": "f99dd1b9-ef74-40a2-b061-02b5ec28394e",
    "projeto": "3801a758-5cae-423a-9950-0a1ae2aa94ca",
    "tipo": "d32e9ceb-adde-4209-8341-ea33e37c3cdd",
    "cliente": "f75ba5ad-57dc-4d4a-a216-d389098c8970",
    "espera_decisao_de": "b0063905-1f61-4a54-a22a-75fb317222e5"
  },
  "grupos_posse": [
    { "grupo": "travada_em_mim", "precedencia": 1,
      "quando": [{"campo":"espera_decisao_de","op":"=","valor":"$eu"}, {"dono":"outro"}] },
    { "grupo": "com_outro", "precedencia": 2,
      "quando": [{"dono":"$eu"}, {"status_alias":["aguardando_terceiro","espera_decisao"]}] },
    { "grupo": "comigo", "precedencia": 3, "quando": [{"dono":"$eu"}] }
  ],
  "obrigatorios_para_criar": ["assignees", "due_date"],
  "alias_membros": { "48769703": ["rique","henrique"], "118076232": ["carol","carolina"] }
}
```

**Config pessoal** — `plugin-pique.local.md`, gitignored: só identidade (`user_name`, `user_clickup_id`, `clickup_role`, `slack_user_id`, `calendarios.*`, `diarios_path`, `cerebro_root`). **Nada de metodologia** — se cada um tiver a sua definição de posse da bola, o placar do time deixa de fechar.

**Markdown** (`commands/*.md`) — cadência, ordem dos grupos, quantas perguntas e quando parar, tom, o que renderizar, o corte das exceções, a redação do delta do review, o texto do stand-up, o cruzamento com Calendar, o Slack, o relógio de sessão, telemetria e commits.

**Base de dados** — Supabase `pique-interno` (`oxetorqfxcnlhollwswt`, sa-east-1). Verificado em 27/07: **40 migrations**, RLS ligado, dois domínios vivos — `conteudo` (23 tabelas, a esteira @iairique) e `financeiro` (11 tabelas). O terceiro schema, `operacao`, nasce limpo:

| Tabela | Vem de | Leitor |
|---|---|---|
| `melhorias` | `melhorias-plugin.md` — 24 escritores, 197KB, **zero leitores**, conflito de merge já com 2 pessoas | **bloco de Afiar quinzenal** |
| `insights` | `insights-uso-ia.md` + `insights-operacao-pique.md`, com coluna de escopo | review de sexta |
| `sessoes` | `chats-enriquecidos.jsonl` — 1 linha por chat encerrado | agregação entre as 5 máquinas |
| `indicadores` | não existe hoje | o Dashboard do ClickUp; nutrido no fechamento |

**Duas regras de desenho:**

1. **A base nunca entra no caminho quente.** Nenhum ritual lê acúmulo no fluxo do dia. Se o Supabase cair, o bom-dia roda igual.
2. **Append local sempre, sync em lote depois** — o mesmo padrão que o `chats-enriquecidos.jsonl` já usa. O `/encerrar`, que roda 111 vezes em 60 dias, nunca toca rede.

⚠️ O bloco de Afiar quinzenal **precisa existir no Calendar**. Hoje o Afiar aparece como bloco de quinta no SEMANA, não como recorrência. Sem o evento, `melhorias` só troca o formato do cemitério.

**Log-do-feito — recomendação, não decisão (o Henrique está pensando): vai pra base, mas depois da Fase 2.** Não por markdown ser ruim — porque **o board virando trilho muda o que o log precisa guardar.** Hoje ele guarda tarefa + duração + modo + P/E como texto solto; depois pode guardar `task_id` e derivar tarefa, projeto, objetivo e cliente por join. Migrar antes congela o schema errado. Ganho colateral: o `append-log.py` inteiro morre — ele existe por causa da fragilidade de âncora em markdown (insere após o primeiro `---`, hardcoda `\r\n`, valida enum). Pré-requisito: consertar o enum de modos primeiro, senão migra dado já corrompido.

**Hook** — o matcher atual enumera 10 nomes literais e **nenhuma tool nova casaria**, além de não pegar `mcp__claude_ai_clickup__clickup_update_task`. Vira padrão:

```
"matcher": "mcp__.*clickup__.*(criar|escrever|garantir|create|update|delete|add|remove|move|post|send)_"
```

---

## 6. Fases

**Fase 0 — consertos sem decisão (meio dia)**
1. Corrigir o contexto envenenado: `CLAUDE.md` do plugin (6 Spaces mortos → 5 vivos, workflow de status inexistente, calendar IDs 404) e a skill `rituais-pique` (auto-invoca em 8 palavras e injeta a cadência v1 inteira: WhatsApp, brainstorm de quarta, gravação obrigatória).
2. `dist/` sai do `.gitignore`; build commitado.
3. Declarar o MCP no `.mcp.json` do plugin com `${CLAUDE_PLUGIN_ROOT}` + `userConfig` — tira o token `pk_` em texto puro do `~/.claude.json`.
4. Apagar `SPACES`/`SPACE_NAMES`/`MEMBERS`/folder IDs do `defaults.ts` (some junto o fantasma `daniel 284658609` e a policy que ele guardava).
5. Trocar o matcher do hook.
6. **Consertar o `append-log.py`** — `MODOS_FEITO`, `CATEGORIAS_INSIGHT` e `PE_FEITO` saem do `.py` e viram `vocabulario.json`. É o precedente: se o enum que rejeita `[Dirigir]` continuar lá, a fronteira é decoração.
7. Matar os 6 óbitos que não dependem de nada: `post_chat_message`, `attach_file`, `add_dependency`, `remove_dependency`, `delete_task`, `move_task`. Junto, corrigir a skill `fontes-noticias`, que ainda aponta o teaser pro canal ClickUp aposentado.

**Fase 1 — `estrutura` + `consultar_cards` sem preset**
Menor incremento com valor real: o bom-dia passa a rodar em 2 chamadas / ~1,2s contra 60–90 hoje.
*Pronto quando:* o bom-dia roda ponta a ponta sem `gestor-clickup` e sem nenhum Space ID em markdown.

**Fase 2 — `metodologia.json` + presets + posse + `escrever_cards`**
Entrega o ato central da v2: o boa-noite move o card.
*Pronto quando:* dá pra mudar a definição de "travada em mim" editando JSON, sem `npm run build`.

**Fase 3 — `garantir_tag` + presets da semana + `subtask_ritual`**
Segunda de manhã fecha sozinha. A subtask do rito é achada por chave composta (assignee + due na janela + `parent != null`), com o nome só como desempate — o card usa travessão e diz "Henrique" enquanto o assignee é "Rique".

**Fase 4 — `criar_cards`**
Destrava o `/encerrar`, que hoje detecta ação em 111 sessões e joga fora.

**Fase 5 — placar da semana**
Só depois do martelo sobre o formato da reunião de segunda.

---

## 7. Spikes — testar antes de assumir

Bloqueiam a Fase 1:
1. O filtro de dropdown em `GET /team/{id}/task` aceita UUID da opção ou orderindex? Rodar as duas formas para `Camada=Tarefa`.
2. O operador `IS NOT NULL` funciona em campo tipo `users`? Esperado: 7 cards em `Espera decisão de`.
3. Os valores distintos de `status.type` nas 20 listas são exatamente `{open, custom, done, closed}`? Um 5º valor quebra os aliases.
4. `/team/{id}/task` tem mesmo zero `last_page`? Errar aqui é perder card em silêncio.
5. `X-RateLimit-Limit`: 100 ou 1000/min?

Bloqueiam a Fase 2:
6. `GET /list/901327858749/field` devolve o campo `Setor` (9 opções, escopo de lista)? Ele virou o gate as-is → to-be em 22/07.
7. Qual o shape para escrever campo tipo `users`?
8. `date_done_gt`/`date_done_lt` respeita janela em ms UTC calculada de São Paulo? Errar o fuso faz o boa-noite das 23h perder o dia.

Bloqueiam a Fase 3:
9. `POST /space/{id}/tag` cria de verdade — e funciona com token de **editor**, não só de owner?
10. `POST /task/{id}/tag/semana-32` falha se a tag não existir no Space?
11. A chave composta devolve exatamente 1 subtask por pessoa/rito nas semanas 31 e 32? Se der 2+, `max_resultados:1` tem que virar erro, não pegar o primeiro.

**Já confirmado, não é spike:** `time_in_status` devolve histórico vazio neste workspace — `dias_no_status` não existe, e `dias_sem_toque` (de `date_updated`, de graça no payload) é o substituto honesto.

---

## 8. Aberto

1. **Escopo do trilho → ClickUp** — tudo × só o que tem dono/prazo × híbrido. Bloco de quinta 30/07, tarefa `86ajqemrm`, aberto desde 22/07. Vira o valor de `obrigatorios_para_criar`, então não bloqueia construir.
2. **Formato da reunião de segunda** — expositiva (Carol, 21/07 14h) × arbitragem de exceções (redesenho solo, 21/07 21h). Card `86ajp5064` em `espera decisão` desde 24/07. Bloqueia só a Fase 5. Agora há uma rodada real de dado pra decidir.
3. **Telemetria: agrega ou não?** A tabela `sessoes` torna possível — mas agregar entre pessoas vira medição de pessoa, e isso precisa ser **combinado com a equipe, não descoberto depois**. Os dois únicos leitores agregados que existiam (`dashboard`, `tempo`) foram excluídos na triagem, então hoje seria coleta sem leitor. Portar os hooks se justifica pelo uso local de qualquer forma.
4. **`log-do-feito` vai pra base?** Recomendação: sim, depois da Fase 2 (ver §5). Henrique pensando — e não bloqueia nada, porque o arquivo continua funcionando como está.
5. **A recorrência quinzenal do bloco de Afiar** — precisa nascer no Calendar pra `melhorias` ter leitor de verdade.
5. **Onde cai o áudio da reunião** — a gravação centralizada foi cortada e o `pos-reuniao` está sem entrada. Encaixe possível: o `pre-reuniao` cria o Doc de 3 guias por cópia do modelo e deixa a guia 3 como slot da transcrição.

---

## 9. Achados que mudam premissas

**A API devolve tudo.** `GET /team/{id}/task` traz `custom_fields`, `parent`, `top_level_parent`, `date_done` — e aceita `custom_fields` como filtro. A limitação é do **connector**, não da API, e o MCP próprio nunca teve: ele descarta os campos no `formatTask` ([tool.ts:106](mcps/pique-clickup-mcp/src/tool.ts#L106)). A cascata inteira da Rumo sai em 1 chamada, 70 cards, ~1s.

**São 7 membros, não 6.** Marcella `43145213` trabalha e é guest, junto com Camila `216069419`. `resolve_member` não pode filtrar guest — e hoje nem conhece a Carol.

**O Slack é mão única.** 83 mensagens em 14 dias no `#standup`, **zero threads e zero reações**. Das 18 mensagens do Henrique, todas de 17/07 em diante trazem o rodapé "O envio foi feito usando Claude Pique" — Arthur, Carol, Gabriel e Marco **digitam à mão, 2× por dia**. O plugin hoje serve 1 de 5 pessoas.

**Leitura incremental do Slack funciona.** `oldest` é exclusivo e aceita Unix timestamp — watermark por canal resolve "só o que é novo", com piso de 7 dias e teto de 100 sem paginar. E `response_format: detailed` é obrigatório: `concise` não devolve o `Message TS` nem o `user_id`, e sem eles o mecanismo morre.

**Cinco dialetos de stand-up.** Bullets Unicode, dashes, checkbox markdown, mensagem inteira em bloco de código, e "Travada em:" no feminino. Parser rígido quebra em 3 das 5 pessoas.

**O `#pique-news` está vazio.** Duas mensagens, ambas de entrada no canal. A migração v2.2.1 nunca produziu output real — e Marco, Arthur e Gabriel nem estão no canal.

---

## Relacionado

- `_auditoria-skills.md` — a triagem dos 125 itens e o escopo dos 11 comandos
- `MEU-CEREBRO/pique/estrategia/_tasks-estrutura-clickup-v2.md` — o ledger da migração v2
- `MEU-CEREBRO/pique/processos/cadencia-rituais-v2.md` — a tabela mestre dos ritos
- `MEU-CEREBRO/pique/infra/clickup-setup.md` — fonte de IDs (o `CLAUDE.md` deve apontar pra cá)
- `MEU-CEREBRO/pique/infra/slack-setup.md` — os 12 canais, IDs conferidos
- `MEU-CEREBRO/conhecimento/produtividade/_tasks-afiar-sistema-trabalho.md` — Blocos 3 e 6
