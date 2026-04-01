---
description: Sincroniza o cerebro compartilhado da Pique (pull + commit + push). Execute este fluxo EXATAMENTE.
---

Sincroniza o cerebro compartilhado da Pique (pull + commit + push). Execute este fluxo EXATAMENTE.

## Fase 1: Status atual

1. Rode `git status` pra ver se tem mudancas locais.
2. Rode `git log --oneline -3` pra ver os ultimos commits.

Mostre pro usuario:
- Se tem mudancas pendentes (arquivos novos, modificados)
- Ultimo commit local

---

## Fase 2: Decidir acao

### Se NAO tem mudancas locais:

1. Rode `git pull origin main` pra puxar atualizacoes.
2. Mostre o resultado (novos arquivos, mudancas recebidas, ou "ja esta atualizado").
3. FIM.

### Se TEM mudancas locais:

1. Mostre a lista de mudancas.
2. Pergunte ao usuario: "Quer enviar essas mudancas? (sim/nao)"
3. Se SIM, va pra Fase 3.
4. Se NAO, pergunte se quer descartar ou deixar pra depois.

---

## Fase 3: Enviar mudancas

1. Primeiro, puxe atualizacoes: `git pull origin main`
   - Se der conflito, PARE e avise o usuario. NAO resolva automaticamente.
2. Adicione os arquivos modificados: `git add -A`
3. Gere uma mensagem de commit descritiva baseada nas mudancas:
   - Formato: `cerebro-pique: [descricao curta do que mudou]`
   - Exemplos:
     - `cerebro-pique: atualiza beco.md com notas da reuniao`
     - `cerebro-pique: adiciona sessao reuniao marco 19/03`
     - `cerebro-pique: atualiza processos e pipeline`
4. Mostre a mensagem de commit pro usuario e pergunte se quer ajustar.
5. Apos confirmacao, rode `git commit` e `git push origin main`.
6. Confirme que foi enviado com sucesso.

---

## Regras

- NUNCA force push (`--force`).
- NUNCA resolva conflitos automaticamente — avise o usuario.
- Se o push falhar por autenticacao, explique que precisa configurar o Git com credenciais do GitHub.
- Mensagem de commit sempre em portugues, prefixo `cerebro-pique:`.
