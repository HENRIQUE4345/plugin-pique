---
description: Planeje e crie tasks no ClickUp usando o processo iterativo de gestor de projeto. NUNCA crie tasks direto — sempre passe pelo ciclo completo abaixo.
---

Planeje e crie tasks no ClickUp usando o processo iterativo de gestor de projeto. NUNCA crie tasks direto — sempre passe pelo ciclo completo abaixo.

## Delegacao de agents

- **TODAS as operacoes ClickUp** (criar tasks, buscar, atualizar): delegar ao agent `gestor-clickup`

Argumento opcional: nome do Folder ou area a popular (ex: `/planejar-tasks Burocratico`). Se nao informado, perguntar.

---

## Fase 1: Reconhecimento

1. Ler `pique/infra/clickup-setup.md` para ter a estrutura completa (Spaces, Folders, Lists, IDs, membros).
2. Ler `pique/PLANO-CLICKUP.md` para entender o que ja foi feito e o que esta pendente.
3. Identificar o Folder/List alvo e buscar tasks existentes no ClickUp (via search).
4. Se houver tasks existentes, ler as descricoes (get_task) pra entender o nivel de detalhe e padrao ja usado.

## Fase 2: Perguntas iniciais

Antes de pesquisar, fazer 2-3 perguntas rapidas ao Henrique pra entender o escopo e direcao:
- "O que precisa acontecer nesse bloco?"
- "Quem ta envolvido?"
- "Tem alguma urgencia ou contexto que eu preciso saber?"

O objetivo aqui NAO e detalhar — e ter palavras-chave e direcao pra pesquisa ser mais eficiente.

## Fase 3: Pesquisa profunda no cerebro

ANTES de fazer perguntas detalhadas, varrer o cerebro inteiro buscando tudo relacionado ao tema. Usar agentes em paralelo (subagent_type: Explore) pra cobrir mais terreno.

Onde buscar:
- `projetos/` — docs de projeto, clientes, financeiro, estrategia
- `sessoes/` — brainstorms, reunioes, contextos
- `conhecimento/` — metodologias, aprendizados
- `TAREFAS.md` — tarefas pendentes que podem ser relevantes
- `inbox/contextos/` — contextos recentes de conversas com IA
- `_mapa.md` — indice completo do cerebro
- ClickUp — tasks existentes que se relacionam

Buscar por palavras-chave extraidas das perguntas iniciais (nomes de pessoas, projetos, termos tecnicos).

Consolidar tudo que encontrar num resumo estruturado e mostrar pro Henrique:
- O que ja esta documentado
- O que esta desatualizado ou contradiz o que ele disse
- Lacunas de informacao (coisas que precisam ser perguntadas)

## Fase 4: Extracao de contexto detalhada

Agora sim, fazer perguntas INFORMADAS — baseadas no que a pesquisa encontrou. Essas perguntas sao muito melhores porque ja mostram que voce sabe o contexto.

Exemplos do padrao certo:
- "O briefing de sociedade ja ta preenchido. Vai pra Gisele como base?" (em vez de "como funciona o contrato?")
- "No cerebro ta dizendo que modelo de cobranca do Beco e indefinido. Ja definiu?" (em vez de "como cobra?")
- "Vi que a NF da Miika ta pendente desde 04/02. O que travou?" (em vez de "tem pendencia financeira?")

### Regras da extracao

- NAO assumir — perguntar.
- Varias rodadas. Uma resposta gera novas perguntas. Continuar ate ter clareza suficiente.
- "Descer as escadas" — cada rodada aprofunda mais. Comeca amplo, vai estreitando.
- Se o Henrique mencionar algo novo que contradiz o cerebro, anotar pra atualizar depois.
- Objetivo: ter contexto suficiente pra escrever descricoes que qualquer pessoa entenda e consiga executar sem perguntar.

## Fase 5: Rascunho

Montar um plano visivel com todas as tasks propostas. Mostrar pro Henrique NO CHAT (nao criar arquivo).

Formato do rascunho:

```
## [Nome do Folder/List]

### Task 1: [Nome com verbo]
- **Dono:** [quem]
- **List:** [qual list]
- **Prioridade:** [urgent/high/normal/low]
- **Start date:** [se aplicavel]
- **Due date:** [se aplicavel]
- **Descricao:**

[Descricao completa no padrao — ver abaixo]

### Task 2: ...
```

Ao final, incluir tabela resumo:

```
| # | Task | Dono | List | Prioridade | Due |
|---|------|------|------|------------|-----|
```

### Padrao de descricao

Descricoes SEMPRE em markdown com headers `##`, listas, negrito. Adaptar secoes conforme o tipo de task:

**Para tasks de acao/entrega:**
```markdown
## O QUE FAZER
[Explicacao clara do que precisa ser feito e por que]

## PROCESSO / PASSO A PASSO
[Como executar — passos concretos]

## ENTREGAVEIS
[O que sai dessa task — artefatos, documentos, decisoes]

## CONTEXTO
[Links, referencias, informacoes extras uteis]

## DEPENDE DE
[O que precisa estar pronto antes — ou "Nada"]
```

**Para tasks de reuniao/ritual:**
```markdown
## POR QUE EXISTE
[Motivacao — por que essa reuniao/ritual importa]

## REGRAS
[Formato, duracao, frequencia, quem participa]

## RECORRENCIA
[Como configurar no ClickUp]

## PAUTA
[O que discutir/fazer durante]

## O QUE SAI
[Entregaveis pos-reuniao]
```

**Para tasks burocraticas/administrativas:**
```markdown
## O QUE FAZER
[Acao concreta]

## CONTEXTO
[Por que isso e importante agora, o que esta pendente]

## COMO FAZER
[Passos praticos — ligar pra quem, mandar o que, onde]

## RESULTADO ESPERADO
[O que muda quando essa task for concluida]
```

### Regras das tasks

- Toda task comeca com verbo
- Fazivel em 1-4h (se maior, quebrar em subtasks)
- Dono definido (consultar tabela de Membros no CLAUDE.md do plugin)
- Prioridade explicita
- Subtasks: so quando passos nao fazem sentido sozinhos

## Fase 6: Iteracao

Apresentar o rascunho e perguntar:
- "O que ta errado ou faltando?"
- "Alguma task que nao faz sentido ou que precisa ser quebrada?"
- "As descricoes estao no nivel certo de detalhe?"
- "Prazos e prioridades fazem sentido?"

Ajustar conforme feedback. Repetir ate o Henrique aprovar.

IMPORTANTE: O Henrique pode mudar tudo — juntar tasks, separar, mudar dono, mudar descricao, remover. Acatar e ajustar.

## Fase 7: Criacao

So apos aprovacao explicita ("pode criar", "manda", "aprova", etc.):

1. Criar as tasks no ClickUp com TODOS os campos preenchidos:
   - `name` — comeca com verbo
   - `list_id` — ID da List correta
   - `assignees` — array com user IDs do(s) dono(s)
   - `priority` — urgent/high/normal/low
   - `due_date` — YYYY-MM-DD
   - `start_date` — YYYY-MM-DD (se aplicavel)
   - `markdown_description` — descricao completa em markdown (NUNCA usar `description` — formatacao quebra com `\n` literal)

   OBSERVACAO CRITICA DE FORMATACAO: Ao criar ou atualizar tasks, SEMPRE usar o campo `markdown_description` em vez de `description`. O campo `description` interpreta `\n` como texto literal em vez de quebra de linha, resultando em descricoes ilegiveis. Com `markdown_description`, headers `##`, listas `-`, negrito `**` e quebras de linha funcionam corretamente no ClickUp.

2. Atualizar `pique/PLANO-CLICKUP.md` no formato padrao:

```markdown
### X.X [Nome do bloco] ✓ (populado em DD/MM)

**List: [Nome]** — N tasks
- [x] Nome da task (ID, Dono, due DD/MM)
  - Contexto breve de 1 linha
```

3. Mostrar resumo final com tabela e links das tasks criadas.
4. Se durante o processo descobriu informacao desatualizada no cerebro, avisar o Henrique e perguntar se quer que atualize.

---

## Notas

- Esse processo e iterativo. Normalmente leva 3+ rodadas de perguntas antes de rascunhar.
- A pesquisa profunda e o que diferencia tasks genericas de tasks que realmente funcionam. Nunca pular.
- O objetivo e que as tasks no ClickUp sejam tao claras que qualquer pessoa (Marco, Gabriel, Daniel) consiga executar sem precisar perguntar.
- Quando em duvida, perguntar. Melhor uma pergunta a mais do que uma task mal feita.

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. As tasks ficaram claras o suficiente pra qualquer pessoa executar?
2. A pesquisa profunda foi feita ou pulou direto pra rascunho?
3. O usuario mudou muito o rascunho? (indica gap na investigacao)
4. Estimativas, prioridades e dependencias foram definidas?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao, mostre:

```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
Quer que eu aplique essas melhorias na skill? (s/n)
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
