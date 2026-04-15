---
description: Retoma contexto de uma sessao Claude Code anterior. Lista candidatos (tema + arquivos tocados + duracao), carrega resumo + arquivos + ultimas mensagens. Read-only — nao executa nada da sessao antiga automaticamente.
argument-hint: [opcional: "global" pra listar de todos os cwds, ou termo de busca]
---

Retoma contexto de uma sessao anterior. Argumento (opcional): **$ARGUMENTS**

Use quando o chat atual ficou poluido, voce mudou de maquina, ou quer continuar de onde parou em outra conversa. So leitura — apresenta contexto, espera voce decidir o que fazer.

## Fontes de dados

| Fonte | Conteudo |
|-------|----------|
| `~/.claude/telemetria/chats-enriquecidos.jsonl` | Tema, resumo, categoria, arquivos_tocados, commits, tags (de `/pique:encerrar`) |
| `~/.claude/projects/<slug>/<sessionId>.jsonl` | Transcript bruto da sessao |

Regras de parsing canonicas (slug, primeiro_prompt, etc) estao em `commands/tempo.md` secao "Como ler". Reuse.

---

## Fase 1: Listar candidatos

**Passo 1 — derivar cwd alvo:**
- Se `$ARGUMENTS` vazio ou nao for "global": filtrar por `cwd` igual ao cwd atual
- Se `$ARGUMENTS == "global"`: nao filtrar por cwd
- Se `$ARGUMENTS` for outra string: usar como termo de busca (match case-insensitive em `tema`, `resumo`, `tags`)

**Passo 2 — ler enriquecidos:**
- `Read` ou `tail` em `~/.claude/telemetria/chats-enriquecidos.jsonl`
- Filtrar conforme Passo 1
- Pegar as 15 mais recentes (do fim do arquivo pra tras)
- Se arquivo nao existe ou esta vazio: avisar "telemetria enriquecida vazia. Encerre sessoes com `/pique:encerrar` pra alimentar o `/continuar`." e parar.

**Passo 3 — apresentar tabela:**

```
## Sessoes anteriores [— filtro: <cwd-curto> | global | "<termo>"]

#   data/hora       tema                                cat  dur     arquivos (top 3)
1   14/04 18:22     camadas memoria cerebro             C    45m     CLAUDE.md, MEMORY.md, settings.json
2   14/04 15:10     reorg ClickUp Pique Studio          B    1h20    clickup-setup.md
3   13/04 22:00     bug datas gestor-clickup            B    45m     gestor-clickup.md
...

Qual retomar? (numero | "ultimo" | "abortar")
```

Regras de formatacao:
- `data/hora`: timestamp local BRT, formato `DD/MM HH:MM`
- `tema`: truncar em 38 chars
- `cat`: A/B/C ou `-` se ausente
- `dur`: `Xh`, `XhYm` ou `Xm`
- `arquivos (top 3)`: basename dos 3 primeiros de `arquivos_tocados`. Se vazio, mostrar `—`.

Se uma entrada nao tem `arquivos_tocados` (sessao encerrada antes do plugin-pique 1.6.0), mostrar `—` na coluna. Nao filtrar essas entradas — so sinalizar.

---

## Fase 2: Selecao

Espere resposta do usuario:
- Numero (1-15): pegar essa entrada
- "ultimo": pegar entrada #1
- "abortar" / "cancela" / "nao": parar imediatamente, sem mais acoes

Se o numero for invalido, pedir de novo (1 vez). Segunda tentativa invalida, abortar.

---

## Fase 3: Carregar contexto

Pegue a entrada escolhida. Execute em paralelo onde possivel:

**3.1 — Resumo enriquecido (sempre):**
- Extraia: `tema`, `resumo`, `tags`, `categoria`, `wall_seconds`, `arquivos_tocados`, `commits`, `primeiro_prompt`, `session_id`, `ts`

**3.2 — Arquivos tocados (se existirem):**
- Para cada path em `arquivos_tocados[:3]` (top 3):
  - Verifique se ainda existe (`ls`)
  - Se existir: `Read` com `limit: 200`
  - Se nao existir: marcar como "deletado/movido"

**3.3 — Commits (se houver):**
- Para cada SHA em `commits[:3]`:
  - `git -C "<cwd>" show --stat <sha>` (so se cwd for repo)

**3.4 — Tail do transcript bruto (se sessao for recente — < 7 dias):**
- Localizar `~/.claude/projects/<slug>/<session_id>.jsonl`
- `tail -n 200` do arquivo
- Filtrar so linhas `"type":"user"` e `"type":"assistant"` com texto visivel (pular tool_use/tool_result longos)
- Extrair as ultimas ~10 mensagens em texto plano (truncar cada uma em 200 chars)

Se sessao for antiga (> 7 dias) ou JSONL nao existir, pular 3.4.

---

## Fase 4: Bootstrap

Apresente resumo consolidado:

```
## Retomando — <tema>

**Sessao:** <session_id curto> | <data BRT> | <duracao> | categoria <X>
**Cwd original:** <cwd>
**Tags:** <tags>

### Resumo anterior
<resumo>

### Primeiro prompt
> <primeiro_prompt>

### Arquivos tocados (<N> total, top 3 carregados)
- <path1> [200 linhas lidas | deletado | movido]
- <path2>
- <path3>

### Commits gerados (<N>)
- <sha> <subject>
- <sha> <subject>

### Ultimas mensagens (tail do transcript)
[user] <msg truncada>
[assistant] <msg truncada>
[user] <msg truncada>
...

---

Pronto pra retomar. Como quer continuar?
- "continua" — sigo no rumo da sessao anterior
- "ajusta" — me diz o que mudou desde la
- "so contexto" — fica so o contexto carregado, voce dirige
```

Pare aqui. NAO execute nada da sessao antiga automaticamente. Espere o usuario direcionar.

---

## Regras

- **Read-only.** Nenhuma escrita, nenhuma chamada destrutiva, nenhum commit. So `Read`, `Bash` (ls/git read-only), `Grep`.
- **Nunca rode `git` write.** Nada de checkout, reset, pull, push.
- **Trunque agressivamente.** Resposta final no maximo ~60 linhas. Tail de transcript no maximo 10 msgs de 200 chars cada.
- **Backwards-compat:** entradas sem `arquivos_tocados`/`commits`/`tags` (pre-1.6.0) sao validas — so faltam essas secoes.
- **Se nada existe pra retomar:** dizer claramente "sem sessao enriquecida no cwd <X>. Use `/pique:continuar global` ou encerre sessoes com `/pique:encerrar`."

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao:
1. A tabela da Fase 1 ficou legivel e cabe na tela?
2. O bootstrap da Fase 4 deu contexto suficiente sem inundar?
3. Algum campo do enriquecido foi sub-utilizado (ex: `tags` ignoradas quando seriam uteis)?
4. Houve alguma escrita acidental? (NUNCA deveria — read-only)

Se identificar melhorias CONCRETAS e EVIDENCIADAS:

```
[AUTO-AVALIACAO]
- [melhoria 1]
- [melhoria 2]
```

Anexe em `pique/infra/melhorias-plugin.md`:

```
## YYYY-MM-DD — continuar (usuario)
- [melhoria 1]
```

Se nada concreto, nao mostre nada. Nao melhore por melhorar.
