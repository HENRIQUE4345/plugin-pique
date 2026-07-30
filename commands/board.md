---
description: Canvas de grafo pra pensar projetos e ideias. Sobe o app, abre ou cria um board, e manipula nos e arestas junto com voce durante o brainstorm. O arquivo .board.json e a fonte de verdade — voce desenha, eu escrevo, os dois veem ao vivo.
argument-hint: "[nome do board | 'listar' | vazio = pergunta]"
---

Board de grafo. Alvo: **$ARGUMENTS**

## Quando usar

- "quero pensar isso em grafo", "abre um board", "desenha isso pra mim"
- Planejar projeto/feature onde as **relacoes** importam tanto quanto os itens
- Retomar um board existente
- **NAO** usar pra: lista de tarefas (ClickUp), documento linear (`.md` no cerebro),
  apresentacao (`/pique:apresentacao`), mapa de processo de cliente (grafo do YabaMap)

## Principios

- **O arquivo e a verdade.** `BOARDS_DIR/<slug>.board.json`. Nao existe localStorage.
- **Voce desenha, eu escrevo, os dois veem.** Autosave 700ms nos dois sentidos.
- **Nunca escrevo sem avisar.** Proponho em texto, voce fala "manda", ai eu escrevo.
- **Nunca escrevo enquanto voce arrasta.** Se o app estiver com edicao pendente, espero.
- **Posicao e problema do app.** Omito `position`; o canvas posiciona sozinho.
- **Penso em cima do GRAFO**, nao da lista. Se eu so estiver adicionando itens,
  estou usando a ferramenta errada.

---

## Fase 1: Garantir o app no ar

Health-check:

```bash
curl -s -m 2 http://localhost:5173/api/boards
```

- **Respondeu JSON** (mesmo `[]`) → app no ar. Va pra Fase 2.
- **Falhou** → suba numa janela SEPARADA (padrao do `/subir`):

```bash
cmd.exe /c "start cmd /k \"cd /d C:\Users\Henrique Carvalho\Documents\PROGRAMAS\BRAINSTORM-TEMPLATE && npm run dev\""
```

Depois refaca o health-check a cada 1,5s por ate 20s. Se nao subir, mostre a
ultima saida do terminal e **PARE** — nao tente consertar sozinho.

> A porta e fixa (`strictPort: true`). Se der "porta em uso", ja existe um dev
> server rodando — reaproveite, nao suba um segundo.

`BOARDS_DIR` sai de `BRAINSTORM-TEMPLATE/.env.local`; sem o arquivo, o default
e `BRAINSTORM-TEMPLATE/boards`.

---

## Fase 2: Abrir ou criar o board

`GET /api/boards` devolve `[{slug, title, updatedAt, nodes}]`.

| `$ARGUMENTS` | Acao |
|---|---|
| vazio | Liste os 8 boards mais recentes, numerados, + "N. criar novo". Pergunte. |
| `listar` | So a lista. Pare. |
| bate com um slug ou title | Abra esse. |
| nao bate | Confirme: *"nao achei '<x>'. Crio novo? (s/n)"* |

Criar: slug em kebab-case sem acento →
`curl -X POST http://localhost:5173/api/boards/<slug> -H 'content-type: application/json' -d '{"title":"<titulo>"}'`

Abrir no browser:

```bash
cmd.exe /c start "" "http://localhost:5173/?board=<slug>"
```

Leia o arquivo com `Read`. Resuma em **ate 5 linhas**: quantos nos por tipo,
quantas arestas, e qual a pergunta em aberto do board. **Pare e espere.**

---

## Fase 3: O contrato do JSON

Contrato completo: `BRAINSTORM-TEMPLATE/docs/arquitetura/formato-board.md`.

```jsonc
{
  "board": 1,
  "title": "...",
  "rev": 12,                      // servidor — NAO TOCAR
  "updatedAt": "...",             // servidor — NAO TOCAR
  "tabs": [{
    "id": "main", "label": "Principal",
    "layout": { "engine": "dagre", "direction": "TB" },
    "nodes": [{
      "id": "n-indias",
      "type": "generic",                     // SEMPRE "generic"
      "data": {
        "kind": "generic",
        "typeId": "ideia",                   // o tipo semantico
        "title": "Titulo curto",
        "fields": { "descricao": "..." }
      }
    }],
    "edges": [{
      "id": "e-n-indias-n-risco",
      "source": "n-indias", "target": "n-risco",
      "type": "smoothstep",
      "data": { "kind": "leva_a" }
    }]
  }]
}
```

**Tipos de no:** `ideia` · `pergunta` · `decisao` · `tarefa` · `risco` · `nota`
**Tipos de aresta (`data.kind`):** `leva_a` · `depende_de` · `bloqueia` ·
`contradiz` · `evidencia` · `relaciona`

Minhas regras ao escrever:

1. **Omita `position`.** O canvas posiciona (perto de um vizinho ligado, senao espiral).
2. **Nao toque em `rev` nem `updatedAt`.**
3. `type` e sempre `"generic"` (no) e `"smoothstep"` (aresta). `data.kind` = `"generic"` no no.
4. IDs deterministicos: `n-<slug-do-titulo>`, `e-<source>-<target>`. Deixa reescrever sem duplicar.
5. Indentacao 2 espacos, newline no fim. Mantem o diff do git limpo.
6. **`Edit` cirurgico > `Write` do arquivo inteiro**, sempre que der.
7. **Uma escrita por rodada.** Cinco `Edit` seguidos = cinco reloads no canvas dele.

---

## Fase 4: O loop de brainstorm (o coracao)

Cada rodada:

### 4.1 Ler
`Read` no `.board.json`. Ele pode ter mexido desde a ultima vez. Se mudou,
diga em 1 linha o que mudou (*"voce adicionou 3 nos e ligou X→Y"*).

### 4.2 Pensar em cima do grafo
Perguntas que **so o grafo responde** — e que sao o motivo de isso nao ser uma lista:

- **Nos orfaos** (sem nenhuma aresta) — ideia solta, ou faltou conexao?
- **Nos com muitas entradas** — gargalo ou dependencia critica escondida.
- **Ciclos** — dependencia circular. Quase sempre e erro de raciocinio, nao design.
- **`risco` sem `mitigacao` ligada.**
- **`decisao` com status aberto bloqueando `tarefa`** — a tarefa nao deveria estar viva.
- **Dois nos dizendo a mesma coisa** com nomes diferentes.

### 4.3 Propor em TEXTO primeiro
Nunca escreva de surpresa:

```
Proponho:
+ 3 nos: [risco] so roda em dev · [decisao] SSE agora ou depois · [tarefa] pinar a porta
+ 2 arestas: so-roda-em-dev --bloqueia--> build-prod
~ 1 alteracao: "persistencia" ganha descricao
Manda?
```

### 4.4 Escrever
So depois do OK. **Uma escrita por rodada.**

### 4.5 Confirmar
Uma linha: *"escrito. o canvas ja atualizou."*

> **Se der 409 ou o app mostrar faixa de conflito:** ele estava editando.
> **NAO force.** Releia o arquivo e refaca a proposta em cima da versao nova dele.

---

## Fase 5: Fechar

Ao fim da conversa, **ofereca** (nao faca sozinho):

- Resumo do board em `sessoes/YYYY-MM-DD-HHMM-brainstorm-<slug>.md` no cerebro
- Commit no cerebro: `board <slug>: <o que mudou>`
- Nos `[tarefa]` viram cards no ClickUp (regras em `MEU-CEREBRO/CLAUDE.md`)
- Decisoes maduras sobem pro `TAREFAS.md`

---

## Regras

- Portugues BR.
- **Nunca escreva sem OK explicito.** O canvas e dele.
- Nao invente `typeId` fora da lista dos 6.
- Nao reposicione nos que ele arrastou.
- **Nao apague no dele.** Proponha; deixe ele apagar.
- Se o board passar de ~60 nos, sugira quebrar em outra tab antes de continuar.
- Titulo de no: **curto** (cabe em ~30 caracteres). O texto longo vai em
  `fields.descricao`.

## Auto-avaliacao (executar sempre ao final)

1. O health-check da Fase 1 acertou de primeira, ou eu subi um segundo dev server?
2. Todo `typeId` e `data.kind` de aresta que escrevi esta na lista permitida?
3. Escrevi alguma vez sem propor antes?
4. Algum `Write` que podia ter sido `Edit` cirurgico? Fiz mais de uma escrita numa rodada?
5. As arestas que criei tem `kind` significativo, ou caiu tudo em `relaciona`?
   (Se caiu, o vocabulario de arestas esta pobre pro dominio — proponha kinds novos.)
6. **O board ficou mais legivel ou so maior?** Se so cresceu, eu virei maquina de
   inflar grafo e devia ter fundido ou cortado no.

Se identificar melhoria CONCRETA e EVIDENCIADA:

```
[AUTO-AVALIACAO]
- [melhoria]
```

Anexe em `pique/infra/melhorias-plugin.md` no formato `## YYYY-MM-DD — board`.
