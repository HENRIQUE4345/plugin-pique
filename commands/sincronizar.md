---
description: Sincroniza o cerebro completo do Henrique — submodule pique (cerebro-pique) + super-repo MEU-CEREBRO, na ordem certa. Execute este fluxo EXATAMENTE.
model: sonnet
---

Sincroniza o cerebro do Henrique, que tem 2 camadas Git que sobem JUNTAS:

- **submodule `pique/`** — repo `cerebro-pique`, branch `main` (cerebro compartilhado com o Marco)
- **super-repo MEU-CEREBRO** — branch `master` (cerebro pessoal; rastreia o ponteiro do submodule)

Ordem obrigatoria: **pique PRIMEIRO, super-repo DEPOIS.** O super-repo versiona o *ponteiro* do submodule — se o pique nao estiver pushado antes, o commit do super aponta pra um commit que o remoto ainda nao tem.

## Fase 0: Localizar os repos

1. Ache o root do cerebro (super-repo). O cwd da sessao normalmente JA e o cerebro ou uma subpasta — confirme com `git rev-parse --show-toplevel`. Se estiver dentro do submodule, `git rev-parse --show-superproject-working-tree` devolve o super-repo.
2. Defina os dois alvos:
   - `SUPER` = root do MEU-CEREBRO (branch `master`)
   - `PIQUE` = `SUPER/pique` (branch `main`)
3. **Fallback Marco (clone direto):** se NAO existir o submodule `pique` (o repo atual JA e o cerebro-pique, sem super-repo), sincronize so esse repo no branch `main` com o fluxo da Fase 1 e PULE a Fase 2.

Use `git -C "<PIQUE>" ...` e `git -C "<SUPER>" ...` em todos os comandos — nao dependa de `cd`.

## Fase 1: Sincronizar o pique (submodule, branch `main`)

1. **Estado:** `git -C "<PIQUE>" status -sb`, depois `git -C "<PIQUE>" fetch origin --quiet` e `git -C "<PIQUE>" rev-list --left-right --count HEAD...@{u}` (ahead/behind).
2. Se **nada local pendente E 0 behind**: ja esta sincronizado — avise e va pra Fase 2.
3. Mostre o resumo agrupado (`git -C "<PIQUE>" status -s`) + ultimos commits. **Pede 1 OK** antes de enviar (salvo se o usuario ja pediu modo direto).
4. Apos OK, nesta ordem:
   a. **Commit primeiro** se houver working tree sujo (protege o merge): `git -C "<PIQUE>" add -A && git -C "<PIQUE>" commit -m "cerebro-pique: <descricao>"`.
   b. `git -C "<PIQUE>" pull origin main --no-edit` — trata conflito pelas Regras.
   c. `git -C "<PIQUE>" push origin main`.
   d. Confirme `0	0` em `git -C "<PIQUE>" fetch origin --quiet && git -C "<PIQUE>" rev-list --left-right --count HEAD...@{u}`.

## Fase 2: Sincronizar o super-repo MEU-CEREBRO (branch `master`)

1. **Estado:** `git -C "<SUPER>" status -sb` + fetch + ahead/behind. O ponteiro do `pique` aparece como `M pique` — e o bump do submodule que acabou de subir, e PRECISA entrar no commit.
2. Se nada pendente E 0 behind: avise e FIM.
3. Mostre o resumo agrupado por tipo (`git -C "<SUPER>" status -s | awk '{print $1}' | sort | uniq -c`). **Atencao a delecoes em massa e ao `inbox/`** — o super-repo costuma ter WIP/processamento de inbox solto; liste o que SAI antes de commitar. **Pede 1 OK.**
4. Apos OK, mesma ordem da Fase 1:
   a. **Commit primeiro** o que estiver sujo (inclui o ponteiro do pique): `git -C "<SUPER>" add -A && git -C "<SUPER>" commit -m "cerebro: <descricao> + bump submodule pique"`.
   b. `git -C "<SUPER>" pull origin master --no-edit` — trata conflito pelas Regras.
   c. `git -C "<SUPER>" push origin master`.
   d. Confirme `0	0`.

## Regras

- **Branches:** pique = `main`, super-repo = `master`. Nunca troque.
- **NUNCA force push** (`--force`).
- **Conflito de conteudo real** (mesma linha editada de forma diferente dos dois lados): NUNCA resolva sozinho — PARE, mostre os blocos de conflito e espere o Henrique decidir.
- **Conflito append-only** (additive — os dois lados adicionaram linhas DISTINTAS no mesmo ponto, ninguem apagou; classico de `_mapa.md` e logs como `infra/melhorias-plugin.md`): proponha **manter ambos** e peca OK. Resolver = apagar so as linhas-marcador. Antes, confirme que os marcadores NAO aparecem fora do conflito (`grep -nE "^(<<<<<<<|=======|>>>>>>>)" <arquivo>` deve listar so os do bloco), entao `sed -i -E '/^(<<<<<<<|=======|>>>>>>>)/d' <arquivo>`, `git add` o arquivo e conclua o merge (`git commit --no-edit`).
- **Mensagem de commit** sempre em portugues: prefixo `cerebro-pique:` no pique, `cerebro:` no super-repo.
- Se o push falhar por autenticacao, explique que precisa configurar credenciais do GitHub.
- **Modo direto:** se o usuario pedir "manda direto"/"sem confirmar", pule os checkpoints de OK — mas mantenha SEMPRE as regras de conflito acima.
