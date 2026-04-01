---
description: Processa meu inbox completo. Siga este fluxo EXATAMENTE, sem pular etapas.
---

Processa meu inbox completo. Siga este fluxo EXATAMENTE:

## Fase 1: Leitura

1. Leia `_mapa.md` para ter contexto do cerebro.
2. Leia `inbox/DIARIO.md` (se existir e tiver conteudo).
3. Leia `inbox/REVISAO.md` (se existir e tiver conteudo).
4. Liste e leia todos os arquivos em `inbox/contextos/` (se houver).

Se NENHUM dos tres tiver conteudo, avise que o inbox esta vazio e encerre.

## Fase 1.5: Verificacao cruzada (ANTES de classificar)

Antes de gerar o PLANO, verificar o que JA EXISTE:

1. **Tasks no ClickUp:** buscar (search ou filter_tasks) cada tarefa mencionada nos contextos. So propor task nova se NAO existir equivalente.
2. **Sessoes no cerebro:** verificar se transcricoes/brainstorms ja foram processados em `sessoes/`. Comparar datas e participantes.
3. **Conteudo no cerebro:** para cada item que parece "salvar no cerebro", grep no arquivo destino pra verificar se a info ja esta la.
4. **Revisoes:** grep no arquivo alvo antes de propor revisao — a mudanca pode ja ter sido aplicada.

Regra: so entra no PLANO o que for GENUINAMENTE NOVO. Contextos ja processados vao direto pra Descartar.

## Fase 2: Gerar PLANO.md

Para cada entrada encontrada, classifique em:
- **Acoes/Tarefas**: coisas para fazer (ex: "preciso fazer X", "lembrar de Y")
- **Ideias**: insights, ideias de produto, conteudo, negocios
- **Informacao**: fatos, dados, contexto que vale registrar no cerebro
- **Revisao**: correcoes ou ajustes em arquivos existentes do cerebro
- **Descartavel**: desabafo sem conteudo acionavel, nota obsoleta, registro ja processado

Gere o arquivo `inbox/PLANO.md` com este formato:

```markdown
# Plano de Processamento — YYYY-MM-DD

## Resumo do dia
Breve resumo de 2-3 frases sobre o que o Henrique registrou hoje.

## Tarefas para o ClickUp
- [ ] Descricao da tarefa | Projeto: X | Prioridade: urgente/alta/normal/baixa

## Salvar no cerebro
| # | Conteudo (resumo) | Destino | Acao |
|---|-------------------|---------|------|
| 1 | Descricao | `areas/saude.md` (secao X) | Adicionar |
| 2 | Descricao | `conhecimento/ia/novo-tema.md` | Criar novo |

## Revisoes no cerebro
| # | O que mudar | Arquivo alvo | Tipo |
|---|------------|--------------|------|
| 1 | Descricao da correcao | `projetos/atendeai.md` | Atualizar |

## Descartar
| # | Item | Motivo |
|---|------|--------|
| 1 | Descricao | Motivo pelo qual nao precisa salvar |

## Origem dos itens
Lista de quais entradas do DIARIO/REVISAO/contextos geraram cada item acima (para rastreabilidade).
```

## Fase 3: Pausa para revisao

Apos gerar o PLANO.md:
1. Avise o Henrique que o plano foi gerado em `inbox/PLANO.md`.
2. Peca para ele abrir o arquivo, revisar, editar o que quiser.
3. Diga: "Quando terminar de revisar, me avise que eu executo."
4. NAO execute nada ate receber confirmacao.

## Fase 4: Execucao (apos confirmacao)

1. Releia `inbox/PLANO.md` (pode ter sido editado pelo Henrique).
2. Execute EXATAMENTE o que esta no plano revisado:
   - Salve conteudo nos arquivos indicados do cerebro
   - Aplique revisoes/correcoes nos arquivos indicados
   - Atualize `_mapa.md` se novos arquivos foram criados
3. Se o DIARIO.md foi processado:
   - Mova para `diarios/YYYY-MM-DD.md`
   - Crie novo `inbox/DIARIO.md` vazio
4. Limpe `inbox/REVISAO.md` (se tinha conteudo).
5. Remova arquivos processados de `inbox/contextos/`.
6. Apague `inbox/PLANO.md`.
7. Mostre um resumo final do que foi feito.

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. A classificacao do PLANO.md estava correta ou o usuario mudou muito?
2. Algum item ficou ambiguo (nao sabia pra onde ia)?
3. O diario foi processado completamente ou ficou algo pra tras?
4. Houve duplicacao com conteudo que ja existia no cerebro?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao, mostre:

```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
Quer que eu aplique essas melhorias na skill? (s/n)
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
