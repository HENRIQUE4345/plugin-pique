# Plugin: Pique Digital

Workflows da Pique Digital. Gestao, rituais, conteudo, automacoes de time.

COMUNIQUE-SE SEMPRE EM PORTUGUES BRASIL.

## Identificacao do usuario

Ler `plugin-pique.local.md` na raiz do projeto para identificar o usuario atual.
Se nao existir, perguntar o nome e criar usando o template em `config/user-config.example.md`.

Campos disponiveis no frontmatter:
- `user_name` — nome do usuario
- `user_clickup_id` — ID no ClickUp
- `diarios_path` — caminho dos diarios pessoais
- `calendarios.primary` — email principal
- `calendarios.pique` — ID calendario Pique (compartilhado)
- `calendarios.pessoal` — ID calendario pessoal

## Regras da empresa

1. Lingua: portugues brasileiro, direto, sem formalidade.
2. Tasks no ClickUp SEMPRE com: verbo no infinitivo, assignee, due_date, descricao (## Contexto / ## O que fazer / ## Criterio de pronto), prioridade.
3. Limite anti-TDAH: max 2-3 tasks/dia, max 5-7 tasks/semana por pessoa.
4. Calendar > ClickUp: o dia real define o teto, tasks preenchem o espaco.
5. Task empurrada 2+ vezes = bloqueio cronico (sinalizar na review).
6. Nunca julgar produtividade. TDAH = semanas variam. Registrar e seguir.
7. Cerebro compartilhado: `pique/` vive DENTRO do MEU-CEREBRO (submodule Git), nao dentro deste
   plugin. Sincronizar com /plugin-pique:sincronizar. Nao assumir que o path `pique/` existe aqui.
8. Fonte de IDs: **este arquivo** e o canonico para o plugin (Spaces, listas, agendas, membros).
   Detalhe que nao cabe aqui (folders, custom fields, gotchas de API, historico) vive em
   `MEU-CEREBRO/pique/infra/clickup-setup.md` — mas o plugin nunca depende dele para funcionar.
   Quando `config/metodologia.json` existir (Fase 2 da arquitetura), ele assume os IDs.
9. Acoes destrutivas (deletar, sobrescrever): NUNCA sem aprovacao explicita.
10. Dados do Apify consomem creditos: nunca scrapar mesmo perfil duas vezes na mesma sessao.

## Membros

Verificado na fonte em 2026-07-27.

| Nome | ClickUp ID | Papel |
|------|-----------|-------|
| Henrique | 48769703 | Estrategia, arquitetura, specs, conteudo @iairique, financeiro |
| Marco | 112131560 | Operacao, campo, clientes, prospeccao, conteudo proprio, conduz os 1:1 |
| Arthur | 82127620 | Produto e tecnico (Painel Beco, Cadastro de Produtos, Rollout Microvix) |
| Carol | 118076232 | Dona do board vivo, conduz a reuniao de segunda, processos Beco |
| Gabriel | 96799130 | Conteudo e producao (Captacao & Conteudo, Yabadoo) |
| Marcella | 43145213 | Guest — conteudo proprio, setores Beco |
| Camila | 216069419 | Guest |

⚠️ **O nome falado nao e o nome cadastrado.** Henrique = "Rique" · Carol = "Carolina Abreu" ·
Arthur = "Arthur Gustavo". Lookup por nome nao e fuzzy e devolve `null` sem erro — se falhar,
listar os membros do workspace e casar pela tabela acima. `resolve_member` do MCP proprio nao
conhece Carol nem Camila (bug conhecido).

## ClickUp — Workspace

- **Workspace ID:** 36702200
- **Plano:** Business (3 members pagos + guests). Workspace Beco e separado: 31031707.

### Spaces e listas

Verificado ao vivo em 2026-07-27. Sao **5 Spaces** — os antigos (Pique Digital, Conteudo, Yabadoo,
Beto Carvalho, Pessoal, Marketing, Demandas Internas, Comercial) estao **mortos**, e ID morto
devolve **200 com zero tasks, sem erro**.

| Space | ID | Listas (ID) |
|-------|----|----|
| **Casa** | 901313888640 | Rumo: Objetivos & Projetos & Marcos `901327847794` · Rituais & Reunioes `901327847802` · Processos & Documentacao `901327847807` — Financeiro: Rotina Financeira `901327847830` · Cobranca & NF `901327847847` · Juridico & Contratos `901327847863` — solta: Ferramentas & Acessos `901327847866` |
| **Produto** | 901313890018 | Catalogo & Roadmap `901327858325` · Catalogo de Solucoes `901327858533` · Bugs & Divida Tecnica `901327858527` · Pesquisa & Spikes `901327858634` · Pricing & Packaging `901327858530` |
| **Clientes** | 901313890061 | Diagnostico & Desenho `901327858749` · Entregas `901327858750` · Rotina do Cliente `901327858752` |
| **Studio** | 901313890136 | Producao `901327859321` · Operacional `901327998045` · Rotina do Cliente `901327859343` |
| **Crescimento** | 901313888670 | Maquina de Vender `901327847876` · Captacao & Conteudo `901327859048` |

⚠️ **Existem duas listas "Rotina do Cliente"** (Clientes `901327858752` e Studio `901327859343`).
Resolver sempre por nome **+ Space**, nunca so pelo nome.

Ancoras da metodologia: a cascata objetivo → projeto → marco mora na **Rumo** (`901327847794`);
os cards de rito moram em **Rituais & Reunioes** (`901327847802`). Reuniao de cliente mora no
Space do cliente, nao na lista interna.

### Status

**A escada `A fazer → Essa semana → Hoje → Fazendo → Feito` esta MORTA.** "Essa semana" e "Hoje"
viraram views com filtro de due date — nunca criar nem buscar task nesses status.

Espinha comum a **10 das 19 listas** (WF-OPERACIONAL) — todas as do Financeiro, Processos &
Documentacao, Ferramentas & Acessos, Bugs & Divida, Pricing, Operacional do Studio e as duas
Rotina do Cliente:

```
a fazer → fazendo → aguardando terceiro → espera decisão · cancelada · finalizado
```

As outras 9 tem funil proprio. Todas lidas na fonte em 2026-07-27 (`…` = os dois passos da espinha,
`aguardando terceiro → espera decisão`; depois do `·` vem o terminal negativo e o positivo):

| Lista | Sequencia |
|---|---|
| Objetivos & Projetos & Marcos (Rumo) | proposto → ativo → em risco → … · não atingido · atingido |
| Rituais & Reunioes | a fazer → preparar pauta → realizada → processar → … · cancelada · finalizado |
| Catalogo & Roadmap | ideia → investigando → spec → desenvolvendo → revisar → … · descartada · finalizado |
| Catalogo de Solucoes | ideia → revisar → preparar pauta → gate interno → apresentar ao cliente → … · descartada · vendida |
| Diagnostico & Desenho | a agendar → agendado → entrevistado → as-is escrito → as-is validado → to-be escrito → to-be validado → … · não aplicável · complete |
| Entregas (Clientes) | a fazer → construindo → a agendar → agendado → em piloto → … · abandonada · adotado |
| Pesquisa & Spikes | a fazer → fazendo → apresentar → … · arquivada · finalizado |
| Maquina de Vender · Captacao & Conteudo | a fazer → fazendo → revisar → … · cancelada · entregue |
| **Producao (Studio)** | gravar → organizado → editar → aguardando terceiro → agendar → agendado → espera decisão · engavetada · **publicado** |

⚠️ **Producao e a excecao que quebra o padrao:** e a unica lista onde `aguardando terceiro` nao vem
depois do trabalho, e a unica cujo terminal positivo e `publicado` (nao `finalizado`). E onde vive o
pipeline de conteudo do Gabriel. Contar entrega de conteudo por `finalizado` devolve zero.

⚠️ **Status e sensivel a acento e caixa.** `espera decisao` sem cedilha devolve zero cards **sem
erro**. Escrever sempre `espera decisão`, `não atingido`, `Rituais & Reuniões`. Na duvida, ler o
nome exato da lista antes de filtrar.

### Template de descricao (markdown_description)

```markdown
## Contexto
Por que essa task existe. Background relevante.

## O que fazer
Passos concretos, numerados.

## Criterio de pronto
Como saber que esta finalizada.
```

## Google Calendar

- HORARIO = Calendar | ACAO = ClickUp | Reunioes = ambos
- Adicionar participantes como convidados; incluir pauta/contexto na descricao do evento
- **Onde o evento nasce e sobre propriedade, nao visibilidade** (convidado ja ve na agenda dele).
  Teste: *"se a pessoa sair, o evento continua?"* — **sim** → `contato@` (e da empresa: reuniao de
  equipe, fechamento, trimestral, Rotina Beco) · **nao** → agenda da pessoa (1:1 do Marco, sync
  H+Arthur, blocos solo).

### IDs dos calendarios

Verificado ao vivo em 2026-07-27. Os IDs antigos `@group.calendar.google.com` (`409d950b…`,
`88b6ab1c…`, `a0cfd611…`) estao **mortos (404)** — as agendas reais sao os `@pique.digital`.

| Calendario | ID |
|-----------|-----|
| # Pique (central da empresa) | contato@pique.digital |
| # Pique - Henrique | rique@pique.digital |
| # Pique - Marco | marco@pique.digital |
| # Pique - Carolina | carol@pique.digital |
| # Arthur Pique | arthur@pique.digital |
| # Pique - Gabriel | gabriel@pique.digital |
| # Financeiro | c_a77cec8f72ef408c7d3ce4d1444646c12bf40598c1d8dc640fa2f9e373196fac@group.calendar.google.com |

Acesso pelo MCP local `google-workspace` (`uvx workspace-mcp`), autenticado como `contato@`, que
le e escreve nas outras sem precisar de compartilhamento. Fuso de todos: America/Sao_Paulo
(excecao: Arthur em America/Bahia).

### Nomenclatura de evento

`<emoji-origem> <Rito> — <participantes> · <cadencia se ≠ semanal>`
🟦 coletivo · 🟩 par/1:1/sync · 🟨 solo · 🎬 gravacao · 💰 financeiro.
Aposentados: `[Pique]`, `X1 -`, `⏺️` solto.
