---
description: Gera apresentacoes HTML no padrao visual da Pique. Execute este fluxo EXATAMENTE, sem pular etapas.
---

Gera apresentacoes HTML no padrao visual da Pique. Execute este fluxo EXATAMENTE, sem pular etapas.

Argumento opcional: descricao curta do contexto (ex: "reuniao quinzenal Daniel sobre Beto Carvalho" ou "pitch pra novo cliente")

---

## Fase 1: Entender o que precisa

Se o usuario passou argumento, use como ponto de partida. Senao, pergunte:

1. **Qual o contexto?** (reuniao com quem, sobre o que, pitch pra quem, retrospectiva de que)
2. **Qual o objetivo?** (alinhar, apresentar, vender, onboarding, extrair contexto)
3. **Publico?** (interno Pique, cliente, parceiro, time novo)

Classifique automaticamente o tipo:

| Tipo | Exemplo | Caracteristica |
|------|---------|----------------|
| `reuniao-recorrente` | Quinzenal Daniel/Beto | Status + updates + prioridades + definicoes |
| `entrega` | Resultado financeiro pro Filipe | O que fizemos + descobertas + o que corrigimos + o que depende do cliente |
| `alinhamento` | Reuniao pontual pra decidir algo | Contexto + opcoes + decisoes necessarias + proximos passos |
| `onboarding` | Novo membro do time | Historia + visao + estrutura + cultura + pedido |
| `pitch` | Apresentar pra prospect | Problema + solucao + resultados + proposta |
| `retrospectiva` | Review mensal/trimestral | Numeros + conquistas + aprendizados + proximo ciclo |
| `custom` | Qualquer outro | Estrutura livre |

ESPERE confirmacao do tipo e contexto antes de continuar.

---

## Fase 2: Coletar contexto (automatico)

Com base no tipo, busque informacoes em paralelo:

### 2.1 Cerebro
- Consulte `_mapa.md` para encontrar arquivos relevantes ao tema.
- Leia os arquivos identificados (projetos, sessoes, areas).
- Priorize: ultimo estado das coisas, decisoes recentes, numeros atuais.

### 2.2 ClickUp (quando relevante)
Consulte `pique/infra/clickup-setup.md` para IDs.

| Tipo | O que buscar |
|------|-------------|
| reuniao-recorrente | Tasks do Space relevante (status, progresso, bloqueios) |
| entrega | Tasks finalizadas do projeto, dados de resultado |
| alinhamento | Tasks relacionadas ao tema da decisao |
| retrospectiva | Tasks finalizadas no periodo, metricas |
| pitch | Nada (contexto vem do cerebro/usuario) |
| onboarding | Estrutura geral dos Spaces |

### 2.3 Sessoes anteriores
- Se existe sessao ou apresentacao anterior sobre o mesmo tema, leia para continuidade.
- Busque em `sessoes/` e `inbox/contextos/` por arquivos relacionados.

### 2.4 Google Calendar (quando relevante)
- Se e uma reuniao, confirme data/hora/participantes.

---

## Fase 3: Estruturar a narrativa

Apresente a estrutura proposta em formato visual:

```
## Estrutura da Apresentacao: [Titulo]

**Tipo:** [tipo identificado]
**Para:** [publico]
**Data:** [data]

### Capitulos:

1. **[Titulo Capa]** — [subtitulo]
2. **[Capitulo 1]** — [o que cobre / 1 frase]
3. **[Capitulo 2]** — [o que cobre / 1 frase]
...
N. **[Capitulo Final]** — [fechamento]

### Componentes visuais planejados:
- Secao X: stats-grid (3 cards com numeros)
- Secao Y: roadmap-v2 (fases com metas)
- Secao Z: status-list (checklist visual)
...

### Dados que vou usar:
- [lista dos dados coletados que entram na apresentacao]

### Dados que FALTAM (preciso do usuario):
- [lista do que preciso que o usuario forneça]
```

### Esqueletos narrativos por tipo (ponto de partida — adapte ao contexto)

**entrega:**
1. Capa → 2. O que fizemos (timeline) → 3. Base de dados/evidencias → 4. Descobertas/resultados → 5. O que ja corrigimos → 6. O que depende do cliente → 7. Proximos passos

**alinhamento:**
1. Capa → 2. Contexto/situacao atual → 3. Opcoes na mesa → 4. Pros e contras → 5. Recomendacao → 6. Decisoes necessarias → 7. Proximos passos

**reuniao-recorrente:**
1. Capa → 2. Status das entregas → 3. Progresso vs planejado → 4. Bloqueios → 5. Prioridades → 6. Definicoes necessarias

**onboarding:**
1. Capa → 2. Quem somos → 3. O que fazemos → 4. Como fazemos → 5. Estrutura/ferramentas → 6. Cultura → 7. O que esperamos de voce

**pitch:**
1. Capa → 2. O problema → 3. A solucao → 4. Resultados/cases → 5. Como funciona → 6. Proposta → 7. Proximo passo

**retrospectiva:**
1. Capa → 2. Numeros do periodo → 3. Conquistas → 4. O que nao funcionou → 5. Aprendizados → 6. Proximo ciclo

ESPERE o usuario revisar, editar e aprovar a estrutura.
Se o usuario pedir mudancas, ajuste e apresente de novo.
Se faltam dados, pergunte AGORA — nao durante a geracao.

---

## Fase 4: Gerar o HTML

1. Carregue o design system em `${CLAUDE_PLUGIN_ROOT}/templates/design-system-pique.md`.
2. Gere o HTML completo seguindo as regras e componentes do design system.
3. Use APENAS os componentes documentados — nao invente novos.
4. PRIORIZE narrativa sobre quantidade. 5 capitulos bem feitos > 12 capitulos rasos.

### Destino do arquivo
- Apresentacoes da Pique: `pique/materiais/apresentacoes/YYYY-MM-DD-apresentacao-[contexto].html`
- Apresentacoes pessoais: `sessoes/YYYY-MM-DD-apresentacao-[contexto].html`
- Se for update de apresentacao existente: sobrescreve o arquivo anterior.

---

## Fase 5: Pos-geracao

1. Salve o HTML no destino correto.
2. Informe o caminho do arquivo.
3. Pergunte: "Quer que eu abra no navegador pra voce revisar?"
4. Se o usuario pedir ajustes, edite o HTML diretamente (nao regenere tudo).

### 5.1 Distribuicao (oferecer proativamente)

Apos o HTML estar pronto, pergunte:

**Drive:** "Quer que eu copie pro Drive compartilhado?"
- Destino padrao: `G:\Drives compartilhados\Pique Digital\Pique Digital\Clientes\[cliente]\Entregas\`
- Se nao souber o cliente, consultar `CLAUDE.md` do Drive pra encontrar a pasta correta.

**Calendar:** "Quer que eu crie o evento no Google Calendar?"
- Se sim, perguntar: horario, duracao, emails dos participantes.
- Criar no calendario Pique Agenda com pauta + link do Drive na descricao.
- Adicionar participantes como convidados + gerar link do Meet.

---

## Regras

- O HTML tem que funcionar abrindo direto no navegador (file://). Zero dependencias de servidor.
- Para reunioes recorrentes: compare com a apresentacao anterior quando existir (progresso, mudancas).
- O usuario pode passar contexto bruto (transcricao, notas, bullets) — a skill organiza em narrativa.
- Se faltar informacao critica, pergunte antes de gerar. Nao invente dados.
- Comunique-se em portugues brasileiro, direto e sem formalidade.

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. A narrativa ficou clara e fluida ou virou lista de bullets?
2. O HTML abriu corretamente no navegador (file://)?
3. O usuario pediu muitos ajustes? (indica gap no entendimento do briefing)
4. O design seguiu o padrao visual da Pique?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao, mostre:

```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
Quer que eu aplique essas melhorias na skill? (s/n)
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
