---
description: Auditoria estrutural do cerebro pessoal (MEU-CEREBRO) em 8 eixos. Gera relatorio, planeja lotes atomicos, executa com aprovacao por lote. Execute este fluxo EXATAMENTE, sem pular etapas.
model: opus
---

Auditoria estrutural do cerebro pessoal (`MEU-CEREBRO`) em 8 eixos. Gera relatorio, planeja lotes atomicos, executa lote a lote com aprovacao explicita, valida no fim, e se auto-melhora. Execute este fluxo EXATAMENTE, sem pular etapas.

## Quando usar

- **Semestralmente** (~4h): auditoria completa nos 8 eixos
- **Trimestralmente** (~2h): eixos A/C/D/E/H (estrutura, drift temporal, clusters, obesos, mapa)
- **Mensalmente** (~30min): eixos H/C/G (mapa, drift temporal, sessoes velhas)
- **Gatilho extraordinario:** toda vez que regra nova for adicionada ao CLAUDE.md (rodar Eixo B) ou sub-brain passar de 15 arquivos (rodar Eixo A)

## Pre-requisitos

- Working directory = `MEU-CEREBRO` (a skill **PARA** se nao for)
- `CLAUDE.md` + `_mapa.md` existem na raiz
- Git inicializado, branch limpo OU drift conhecido (skill trata)

## Ferramentas

- **Filesystem + git:** Read / Glob / Grep / Bash diretos. **Sem agent** — esta skill e roteiro mecanico, nao delega.
- **Submodule `pique/`:** apenas leitura. Modificacoes proibidas sem flag explicita do usuario.
- **Auditoria de ClickUp / Drive:** explicitamente FORA DE ESCOPO. Pra ClickUp, apontar `/pique:checkup`.

## Gotchas (ler antes de comecar)

1. **Lote SEGURO ou PERIGOSO** — gating diferente. PERIGOSO pausa antes pra confirmacao extra.
2. **`git add -A`/`-u`/`.` PROIBIDO** — sempre arquivo por arquivo.
3. **`inbox/AUDITORIA-CEREBRO.md` NUNCA commitado com lotes** (untracked permanente — e doc de trabalho).
4. **Submodule `pique/` read-only** sem flag explicita do usuario.
5. **Forward slashes em paths** (Windows + bash compatibility).
6. **CRLF warnings** = ignorar (normalidade do Windows git).
7. **Drift preexistente** = backup + isolar tecnica antes de tocar arquivo modificado.
8. **Decisoes do relatorio NAO sao imutaveis** na execucao — usuario pode desviar se nova info aparecer.
9. **`git mv` sempre que mover arquivos** — preserva historico, detecta rename cross-directory ate ~80% similarity.
10. **Antes de renomear pasta**, grep refs externas e mostrar impacto pro usuario.

## Scope creep evitado

- NAO audita submodule `pique/` (default)
- NAO audita ClickUp (use `/pique:checkup`)
- NAO audita Drive
- NAO cristaliza sessoes automaticamente — so sinaliza no Eixo G
- NAO cria tasks no ClickUp como follow-up

---

## Regras duras (checklist aplicado em cada fase)

### Pre-flight (antes de qualquer operacao)
- [ ] `pwd` confirma working dir = `MEU-CEREBRO`
- [ ] `CLAUDE.md` + `_mapa.md` existem
- [ ] `git status` capturado; **drift preexistente listado pro usuario com label NAO TOCAR**
- [ ] Submodule `pique/` confirmado read-only
- [ ] Se `inbox/AUDITORIA-CEREBRO.md` ja existe → perguntar append/sobrescrever/comparar delta

### Por lote executado
- [ ] Operacoes do lote nao sobrepoem com drift preexistente OU usa sub-rotina de backup
- [ ] `git mv` pra movimentacao (preserva historico)
- [ ] Staging manual: `git add <arquivo-explicito>` — nunca `-A`/`-u`/`.`
- [ ] `inbox/AUDITORIA-CEREBRO.md` NAO entra no stage
- [ ] Submodule `pique/` NAO modificado pelo lote
- [ ] Commit no padrao: `cerebro: auditoria lote N — {descricao curta}`

### Pos-execute (apos cada commit)
- [ ] `git status` so mostra drift preexistente + commits do lote
- [ ] `_mapa.md` re-validado se foi tocado (Eixo H rapido)
- [ ] Refs externas dos arquivos movidos/renomeados verificadas (grep retorna 0 fora de `pique/` e `inbox/AUDITORIA-CEREBRO.md`)

---

## Fase 0: Escopo (perguntar ao usuario)

Antes de comecar, defina via AskUserQuestion:

1. **Profundidade?**
   - `completa` — 8 eixos, ~4h (semestral)
   - `trimestral` — eixos A/C/D/E/H, ~2h
   - `mensal` — eixos H/C/G, ~30min

2. **Submodule pique:** incluir? — DEFAULT **nao**. Avisar: "Auditoria do submodule `pique/` e trabalho separado, fica fora deste fluxo. Continuo so com o cerebro pessoal?"

3. **Relatorio existente:** se `inbox/AUDITORIA-CEREBRO.md` ja existe, perguntar:
   - `delta` (DEFAULT) — comparar contra anterior, mostrar o que mudou
   - `append` — adicionar achados novos sem mexer no historico
   - `sobrescrever` — comecar do zero

Apos respostas, **detectar drift preexistente:**

1. Roda `git status` no cerebro
2. Lista pro usuario com label **NAO TOCAR**:
   ```
   ## Drift preexistente detectado (NAO TOCAR durante a auditoria)

   **Modificados:** N arquivos
   - [lista]

   **Untracked:** M arquivos
   - [lista]

   **Deletados em staging:** K arquivos
   - [lista]
   ```
3. Confirma: "Vou tratar esse drift como intocavel. Ele continua no WT no fim da auditoria. Concorda?"

Se o usuario apontar que algum desses arquivos faz parte da auditoria, marca pra usar a **sub-rotina drift** na Fase 5.

---

## Fase 1: Coleta por eixo

Cada eixo = sub-rotina mecanica. **Roda em paralelo** quando possivel (Read/Glob/Grep simultaneos). Cada item recebe tag **OBVIO** (acionavel sem decisao) ou **DEC** (precisa pergunta interativa).

### Eixo A — Estrutura

- `Glob projetos/**/*.md` + `Glob conhecimento/**/*.md` → conta arquivos por sub-brain
- Sub-brains com **>15 arquivos sem sub-organizacao** → **GAP-A** (sobrecarga)
- `Grep -r "\\[.*\\]\\(.*\\.md\\)"` → conta refs entrantes em cada doc-hub
- Hubs com >500 linhas → flag pra teste de "referencia densa" no Eixo E
- Docs em `conhecimento/` sem nenhum backlink → **GAP-A** (orfaos de backlink, cold storage)

### Eixo B — Drift de regras (vs CLAUDE.md)

Le `CLAUDE.md` regra-a-regra. Pra cada regra, valida pratica:

- **Tamanho** (3 testes) → ver Eixo E
- **Kebab-case sem acentos no nome** → `Glob` + regex
- **Frontmatter completo** (Criado, Status, Tags, Contexto) → Read top-10 linhas de cada `.md`
- **`status: arquivado`** em todos os `arquivo/*.md` → REGRA-B se faltar
- **Sessoes com timestamp** no nome (`YYYY-MM-DD-HHMM-tipo-descricao.md`) → Glob + regex
- **Um tema por arquivo** (heuristica: docs com 3+ secoes `## ` de temas distintos)
- **Decisoes no contexto** (nao em pasta `decisoes/` solta)

Output: **REGRA-B** pra cada violacao. Se >20% dos docs violam uma regra, propor reformulacao da regra (nao da pratica).

### Eixo C — Drift temporal (zumbis)

```bash
git log --diff-filter=M --since="60 days ago" --name-only --pretty=format: -- projetos/ | sort -u
```

Cruza com Glob `projetos/**/*.md`. Docs em `projetos/` **sem mencao em qualquer arquivo nas ultimas 60 dias** + sem commit recente → **ZUMBI-C**.

Antes de propor arquivar, le frontmatter pra checar campo `**Ritmo:**` — se for `longo-prazo`, NAO e zumbi.

### Eixo D — Clusters de redundancia

- Grep palavras-chave repetidas em titulos (`# ` linha 1) e tags
- Agrupa candidatos por afinidade lexica
- **CRITICO:** antes de declarar duplicata, **le os primeiros 30 linhas dos suspeitos** (cabecalho + Contexto). Nomes parecidos podem ser arquivos genuinamente diferentes (resumo vs completo, V1 vs V2, etc).
- Output: **CLUSTER-** com proposta de canonico + superseded + indice

### Eixo E — Obesos (>150L)

```bash
find . -name "*.md" -not -path "./pique/*" -not -path "./.suporte/*" -not -path "./.claude/*" -not -path "./inbox/AUDITORIA-CEREBRO.md" -exec wc -l {} \; | sort -rn | awk '$1 > 150'
```

Pra cada doc obeso, aplica os **3 testes** de referencia densa:

1. **Consultado nao-linearmente** com TOC/secoes autonomas? (S/N)
2. **Dividir quebraria contexto** necessario pra entender qualquer parte? (S/N)
3. **NAO existe** outro lugar melhor pra metade do conteudo? (S/N)

Classificacao:
- **S/S/S ou S/N/N ou S/S/N** → ACEITAR
- **S/N/S ou N/S/S** → DIVIDIR (em N docs tematicos + INDEX)
- **N/N/N ou N/S/N** → EXTRAIR (mover pra `arquivo/`)

Output: **OBESO-** com classificacao e acao.

### Eixo F — Classificacao (5 pastas)

Le frontmatter `Status:` + nome da pasta. Sinaliza:
- Projeto com prazo `**Prazo:**` ou `**Periodo:**` expirado → **CLASSIF-F** (arquivar)
- Doc em `projetos/` sem prazo nem objetivo claro → **CLASSIF-F** (mover pra `areas/` ou `conhecimento/`)
- Doc em `conhecimento/` que e claramente projeto vivo → **CLASSIF-F** (mover pra `projetos/`)
- Status `ativo` em arquivo em `arquivo/` → **CLASSIF-F** (corrigir)

### Eixo G — Sessoes velhas (>30d sem cristalizacao)

- `Glob sessoes/*.md` + filtro por data no nome (`YYYY-MM-DD-`) >30d
- Pra cada uma, Read pra checar se ja tem `## Cristalizada em:`
- Se nao tiver → **SESSAO-G** com ritual de `conhecimento/metodologias/cristalizacao-sessoes.md`
- Sinaliza candidatos. **NAO cristaliza automaticamente** (scope creep).

### Eixo H — Fidelidade do `_mapa.md`

- Glob `**/*.md` recursivo (excluindo `pique/`, `.suporte/`, `.claude/`, `inbox/AUDITORIA-CEREBRO.md`, `inbox/contextos/*`, `inbox/DIARIO.md`, `inbox/REVISAO.md`, `diarios/*`)
- Read `_mapa.md`, extrai todas as entradas `[nome](path)`
- **Orfaos** (arquivo no disco, sem entrada no mapa) → **MAPA-** (adicionar)
- **Fantasmas** (entrada no mapa, sem arquivo no disco) → **MAPA-** (remover ou marcar `[drive]`)
- **Duplicatas** (mesma path em 2 entradas) → **MAPA-** (consolidar)

Excluir do diff: templates (`_template-*.md`), arquivos administrativos (`CLAUDE.md`, `_mapa.md`, `plugin-pique.local.md`).

---

## Fase 2: Geracao do relatorio

Escreve `inbox/AUDITORIA-CEREBRO.md` com a estrutura padrao:

```markdown
# AUDITORIA ESTRUTURAL — Cerebro Pessoal

**Criado:** YYYY-MM-DD
**Status:** decisoes pendentes
**Escopo:** {pastas auditadas}

## Sumario Executivo
- Diagnostico geral
- Top N acoes por impacto (tabela)
- Contagem por eixo (tabela)
- Estimativa de esforco

## Decisoes Pendentes (DEC-*)
## Acoes Obvias (OBVIO-*)
## Eixo A — Estrutura
## Eixo B — Drift de Regras
## Eixo C — Drift Temporal
## Eixo D — Clusters de Redundancia
## Eixo E — Obesos
## Eixo F — Classificacao
## Eixo G — Sessoes Velhas
## Eixo H — Mapa
## Cadencia futura
## Proxima acao
```

**Se modo = `delta`:** ANTES de sobrescrever, gera resumo do diff:
- OBVIOs sumiram (= ja resolvidos): N
- OBVIOs novos: M
- DECs ainda pendentes: K
- Eixos com mudanca significativa: [lista]

Apresenta o delta ao usuario antes de sobrescrever.

---

## Fase 3: Decisoes interativas

Loop AskUserQuestion pra cada `DEC-*` pendente. Cada pergunta tem **3-5 opcoes cirurgicas**, nao survey longo.

Apos cada resposta:
1. Atualiza `inbox/AUDITORIA-CEREBRO.md` com a decisao tomada
2. Reclassifica acoes derivadas (DEC → OBVIO se a decisao tornou a acao consensual)
3. Marca a DEC como `[x]` resolvida

**Regra explicita:** decisoes do relatorio nao sao imutaveis. Se durante a Fase 5 (execucao) aparecer info nova que invalida uma decisao, **pode desviar** — apenas avise o usuario e atualize o relatorio.

---

## Fase 4: Planejamento de lotes

Agrupa OBVIOs em lotes atomicos (1 lote = 1 commit) seguindo o **template de ordenacao** abaixo. **Omitir lotes vazios. Mesclar quando houver poucos OBVIOs.**

### Template de ordenacao (default)

| # | Lote | OBVIOs tipicos | Risco |
|---|------|----------------|-------|
| 1 | Higiene | frontmatter + `status: arquivado` em `arquivo/` + registros de cristalizacao ja feita | SEGURO |
| 2 | Arquivar expirados | projetos com prazo vencido | SEGURO |
| 3 | Correcoes de escopo | mover entre cerebro/submodule, atualizar CLAUDE.md | PERIGOSO (mexe submodule) |
| 4 | Movimentos pequenos | 1-2 docs entre subpastas | SEGURO |
| 5 | Reformulacoes de regra | atualizar CLAUDE.md, criar metodologias | SEGURO |
| 6 | Reconciliacoes + extracao de obesos | divergencias de dado, dividir obesos | PERIGOSO |
| 7 | Indices de clusters | criar `_INDEX.md` pra clusters | SEGURO |
| 8 | Reorganizacao estrutural grande | sub-brain reestruturado em subpastas | PERIGOSO (condicional) |
| 9 | **Fechamento `_mapa.md`** | reconciliar mapa apos lotes 1-8 | SEGURO (sempre ultimo) |

**Lote 8 e CONDICIONAL:** so existe se Eixo A flagrou sub-brain >15 arquivos sem sub-organizacao.

**Lote 9 e SEMPRE o ultimo** porque depende de todos os outros.

Apresenta tabela ao usuario:

```
## Plano de lotes — auditoria YYYY-MM-DD

| # | Lote | OBVIOs | Risco | Tempo |
|---|------|--------|-------|-------|
| 1 | Higiene | OBVIO-05, OBVIO-06, ... | SEGURO | 15min |
| 2 | ... | ... | ... | ... |

**Total:** N lotes, ~Xh
**Lotes PERIGOSOS:** [lista] (cada um pausa antes pra confirmacao extra)
```

**PARE e espere aprovacao do plano inteiro.**

Usuario pode pedir pra reordenar, mesclar, dividir, ou mover OBVIO entre lotes (licao 10 da execucao manual: OBVIOs podem ser reclassificados).

---

## Fase 5: Execucao lote a lote

Loop pra cada lote aprovado, em ordem:

### Lote SEGURO

1. Descreve as operacoes do lote em 3-5 linhas
2. Executa as operacoes sequencialmente
3. Aplica sub-rotina drift se algum arquivo modificado tem drift preexistente
4. `git add <arquivos-explicitos>`
5. **Validar antes do commit:** `git status` mostra so arquivos do lote no stage; drift preexistente continua no WT
6. `git commit -m "cerebro: auditoria lote N — {descricao}"`
7. Relatorio curto (formato abaixo)

### Lote PERIGOSO

1. **PARA e pede confirmacao explicita:**
   > "Lote N e PERIGOSO ({razao}). Vou {acoes}. Confirma? (sim/nao)"
2. Se SIM, segue o fluxo de SEGURO
3. Se NAO, pula o lote e marca como `pendente humano`

### Sub-rotina DRIFT (chamada quando lote toca arquivo com drift preexistente)

**Variante A — Arquivo modificado no lote E tem drift no WT:**

```bash
# 1. Backup do estado atual (com drift)
cp <arquivo> /tmp/backup-<arquivo>.md
```

2. Reverte drift via Edit (volta linha por linha pro estado de `git show HEAD:<arquivo>`)
3. Aplica mudancas do lote
4. `git add <arquivo>`
5. **Antes do commit do lote**, reaplica drift via Edit (le `/tmp/backup-<arquivo>.md` e recoloca as mudancas)

**Variante B — Quando o arquivo e `_mapa.md` (mais simples):**

```bash
# 1. Backup
cp _mapa.md /tmp/backup-mapa.md

# 2. Restaura WT ao HEAD (perde drift no WT)
git checkout HEAD -- _mapa.md
```

3. Aplica mudancas do lote (re-editando `_mapa.md` baseado no HEAD)
4. `git add _mapa.md`
5. `git commit ...`
6. Reaplica drift via Edit no WT (le `/tmp/backup-mapa.md`, identifica o que era drift, recoloca contra o novo HEAD)

### Regras absolutas pro execute

- `git add -A` / `-u` / `.` PROIBIDO — sempre arquivo por arquivo
- `git mv` pra movimentar (preserva historico)
- **Antes de renomear pasta:** `Grep -r "<path-antigo>"` em todo o cerebro, mostra impacto, pede ok
- `inbox/AUDITORIA-CEREBRO.md` NUNCA entra no stage
- Submodule `pique/` NAO modificado (a menos que `--incluir-pique` foi setado na Fase 0)

### Relatorio curto apos cada lote

```
### Lote N — RESULTADO
- OBVIOs aplicados: X
- Arquivos tocados: Y
- Refs externas atualizadas: Z
- Drift preexistente preservado: OK
- Proximo lote: M (ou "FIM")
```

---

## Fase 6: Validacao final

Apos o ultimo lote:

- [ ] `git status` so mostra drift preexistente + commits dos lotes
- [ ] Re-roda Eixo H rapido pra validar `_mapa.md` (sem fantasmas, sem orfaos novos)
- [ ] `Grep -r "<path-antigo>"` retorna 0 matches fora de `pique/` e `inbox/AUDITORIA-CEREBRO.md` (pra cada renomeacao feita)
- [ ] Spot-check: 5 docs aleatorios, valida frontmatter completo + presenca no `_mapa.md`
- [ ] `inbox/AUDITORIA-CEREBRO.md` continua **untracked**

Apresenta resumo final:

```
## Auditoria do cerebro — RESUMO

**Data:** YYYY-MM-DD
**Profundidade:** {completa|trimestral|mensal}
**Lotes commitados:** N
**Arquivos tocados:** X
**OBVIOs aplicados:** Y
**DECs respondidas:** Z
**Drift preexistente preservado:** W arquivos

**Pendencias humanas:**
- [lista de OBVIOs/DECs nao executados, com razao]

**Proxima cadencia sugerida:**
- Mensal: YYYY-MM-DD
- Trimestral: YYYY-MM-DD
- Semestral: YYYY-MM-DD
```

---

## Fase 7: Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:

1. **Ruido vs sinal:** algum eixo gerou mais ruido que problema real?
2. **Planejamento raso:** algum lote precisou ser dividido na execucao?
3. **Drift escapou:** algum drift preexistente quase foi commitado por engano?
4. **Detecccao incompleta:** apareceu OBVIO durante execucao que nao foi detectado na Fase 1?
5. **Decisoes mal formuladas:** alguma DEC foi revertida na execucao?
6. **Gotcha tecnico novo:** CRLF, submodule, refs cross-directory, encoding?

Se identificar melhorias **CONCRETAS e EVIDENCIADAS** nesta execucao:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [descricao da melhoria 1, com evidencia]
- [descricao da melhoria 2, com evidencia]

Quer que eu ajuste a skill pra prevenir isso na proxima vez?
```

2. Se aprovar, **editar este proprio arquivo** (`${CLAUDE_PLUGIN_ROOT}/commands/auditoria-cerebro.md`) incorporando a melhoria em:
   - Checklist de regras duras (se for validacao nova)
   - Lista de Gotchas (se for armadilha nova)
   - Eixo especifico (se for checagem faltando)
   - Sub-rotina drift (se for variante nova)

3. Anexar tambem em `pique/infra/melhorias-plugin.md` no formato:
```
## YYYY-MM-DD — auditoria-cerebro (Henrique)
- [melhoria aplicada no arquivo X, secao Y]
```

Se nao identificar nada concreto, **NAO mostre nada**. NAO melhore por melhorar.
