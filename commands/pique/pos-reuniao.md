Processamento pos-reuniao. Recebe transcricao de reuniao e extrai tudo que e acionavel. Execute este fluxo EXATAMENTE, sem pular etapas.

## Delegacao de agents

- **Operacoes ClickUp** (criar tasks): delegar ao agent `gestor-clickup`
- **Google Calendar** (criar eventos, buscar reunioes): chamar diretamente (connector leve)
- **Gmail** (buscar anotacoes Gemini): chamar diretamente (connector leve)

## Quando usar

- Apos qualquer reuniao gravada (cliente, interna, prospect, parceiro)
- Quando o usuario colar transcricao de audio/video
- Funciona pra reunioes presenciais (transcricao do celular) e online (Meet/Zoom)

---

## Fase 0: Modo de entrada

Se o usuario JA colou uma transcricao junto com o comando, pule direto pra Fase 1.

Caso contrario, pergunte:

```
Como quer enviar a reuniao?

1. **Automatico** — busco na agenda do Google e puxo as anotacoes do Gemini
2. **Manual** — voce cola a transcricao aqui

Qual?
```

### Se modo automatico:

#### 0.1 Listar reunioes recentes

Busque eventos dos ultimos 7 dias no calendario Pique Agenda (ID em CLAUDE.md do plugin) com `condenseEventDetails: false`.

Filtre apenas eventos que tenham attachment com `title: "Anotações do Gemini"` (mimeType `application/vnd.google-apps.document`).

Apresente lista numerada:

```
Reunioes com anotacoes do Gemini (ultimos 7 dias):

1. [24/03 09:00] Reuniao Edith — Marco
2. [24/03 10:30] Reuniao Karine — Marco
3. [24/03 13:00] Reuniao Projeto Beto — Henrique, Daniel, Beto
4. [30/03 09:30] Reuniao Arthur — Arthur
...

Qual reuniao? (numero ou "todas")
```

Incluir data, hora, nome do evento e participantes (extrair dos attendees).

#### 0.2 Buscar conteudo das anotacoes

Apos o usuario escolher, tente buscar o conteudo nesta ordem:

**Tentativa 1 — Gmail:**
Busque email de `from:gemini-notes@google.com` com o nome da reuniao no subject (usar `gmail_search_messages`).
Se encontrar, leia o body com `gmail_read_message`. O email contem: resumo, topicos, proximas etapas.

**Tentativa 2 — Fallback manual:**
Se NAO encontrar email do Gemini, mostre o link do Google Doc (extraido do attachment do evento):

```
Nao encontrei o email do Gemini pra essa reuniao (provavelmente foi iniciado por outro participante).

O doc esta aqui: [link do Google Doc]
Abre, copia o conteudo e cola aqui que eu processo.
```

#### 0.3 Preencher contexto automaticamente

Com o evento do Calendar + conteudo do Gemini, preencha automaticamente:
- **Qual reuniao:** nome do evento
- **Quem estava:** attendees do evento
- **Data:** data do evento

Pule a Fase 1 e va direto pra Fase 2.

### Se modo manual:

Siga a Fase 1 normalmente.

---

## Fase 1: Contexto da reuniao

Pergunte (so o que nao conseguir inferir da transcricao):

1. **Qual reuniao?** (ex: review semanal, reuniao com Beco, call com prospect X)
2. **Quem estava?** (nomes e papeis)
3. **Data?** (se nao for hoje)

Se o usuario ja deu essas informacoes junto com a transcricao, NAO pergunte de novo.

---

## Fase 2: Reconhecimento (automatico, NAO pergunte nada)

Antes de processar a transcricao, busque contexto:

### 2.1 Cerebro

Consulte `_mapa.md` e busque:
- Ja existe arquivo sobre esse cliente/projeto/tema?
- Tem sessao de reuniao anterior com os mesmos participantes?
- Tem decisoes pendentes que podem ter sido resolvidas?

### 2.2 ClickUp

Consulte `pique/infra/clickup-setup.md` para IDs.

Busque tasks relacionadas ao tema da reuniao:
- Tasks em qualquer status que mencionam o cliente/projeto
- Tasks atribuidas aos participantes da reuniao

### 2.3 Tipo de reuniao

Classifique automaticamente:

| Tipo | Exemplo | Destino no cerebro |
|------|---------|-------------------|
| **Interna fixa** | Planejamento, review, brainstorm conteudo | `sessoes/YYYY-MM-DD-HHMM-[tipo]-[descricao].md` |
| **Cliente** | Reuniao com Beco, Miika, prospect | `sessoes/YYYY-MM-DD-HHMM-reuniao-[cliente].md` + atualizar arquivo do cliente |
| **Parceiro/externo** | Call com Daniel, Arthur, Gabriel | `sessoes/YYYY-MM-DD-HHMM-reuniao-[participante].md` |
| **1:1 com Marco** | Reuniao avulsa H+M | `sessoes/YYYY-MM-DD-HHMM-reuniao-marco.md` |

---

## Fase 3: Processar transcricao

Quando o usuario colar a transcricao:

### 3.1 Cruzar com contexto existente

Para cada informacao na transcricao, classifique:
- **CONFIRMADO** — algo que ja existia no cerebro e foi reafirmado
- **NOVO** — informacao que nao existia
- **MUDOU** — algo que existia mas foi alterado/corrigido
- **CONTRADIZ** — algo que contradiz o que esta no cerebro (sinalizar!)

### 3.2 Extrair categorias

| Categoria | O que extrair |
|-----------|--------------|
| **Decisoes** | "Vamos fazer X", "Nao vamos Y", "Decidimos Z". Incluir MOTIVO. |
| **Tasks** | Acoes concretas com dono. Verbo no infinitivo. |
| **Informacao** | Fatos, dados, contextos novos. |
| **Compromissos** | Prazos, reunioes agendadas, entregas combinadas. |
| **Dores/problemas** | Problemas mencionados (especialmente de clientes). |
| **Ideias** | Sugestoes, brainstorms, possibilidades levantadas. |
| **Pendencias** | Coisas que ficaram em aberto, precisam de resposta, aguardam alguem. |

### 3.3 NAO extrair

- Conversa fiada, cumprimentos, transicoes
- Repeticoes (mesmo ponto dito de formas diferentes)
- O que ja e sabido e foi apenas mencionado de passagem

---

## Fase 4: Apresentar resultado

```
## Pos-reuniao — [Titulo da reuniao]
**Data:** YYYY-MM-DD
**Participantes:** [nomes]
**Tipo:** [interna/cliente/parceiro]
**Duracao estimada:** [do tamanho da transcricao]

---

### Decisoes tomadas
1. [Decisao] — Motivo: [por que]
2. [Decisao] — Motivo: [por que]

### Tasks identificadas
| Task | Responsavel | Prazo | Space/Projeto |
|------|-------------|-------|---------------|
| [Verbo + acao] | [quem] | [quando] | [onde] |

### Informacao nova
- [fato/dado novo] — atualizar [arquivo] no cerebro
- [contexto novo] — criar/atualizar [onde]

### Compromissos agendados
- [evento] — [data, horario, quem]

### Dores/problemas identificados
- [dor] — de quem: [cliente/interno]

### Ideias (nao decidido, pra considerar)
- [ideia]

### Pendencias (ficou em aberto)
- [pendencia] — aguardando [quem/o que]

### Contradiz algo existente [?]
- [se houver] — arquivo [X] diz Y, mas na reuniao disseram Z

---

### Acoes propostas

**Cerebro:**
- Atualizar: [arquivo] — [o que muda]
- Criar: [novo-arquivo.md] em [pasta/] — sessao da reuniao

**ClickUp:**
- Criar task: [lista de tasks]
- Atualizar task: [tasks existentes que precisam de update]

**Calendar:**
- Criar evento: [se aplicavel]

Posso executar?
```

**Se alguma secao estiver vazia, escreva "Nenhum" — NAO omita.**

ESPERE o usuario revisar e aprovar antes de continuar.

---

## Fase 5: Execucao

Apos aprovacao:

### 5.1 Salvar sessao no cerebro

Crie `sessoes/YYYY-MM-DD-HHMM-[tipo]-[descricao].md` com template padrao:

```markdown
# Sessao — [Titulo da reuniao]

**Criado:** YYYY-MM-DD HH:MM
**Status:** ativo
**Tags:** sessao, [tags relevantes]

## Contexto
[Tipo de reuniao], [participantes], [motivacao].

## Decisoes
- [decisao 1] — Motivo: [por que]
- [decisao 2] — Motivo: [por que]

## Tasks criadas
- [ ] [task 1] → [responsavel]
- [ ] [task 2] → [responsavel]

## Informacao nova
- [o que foi aprendido/descoberto]

## Pendencias
- [o que ficou em aberto]

## Relacionado
- [links para arquivos atualizados]
- [link para sessao anterior se existir]
```

### 5.2 Atualizar arquivos existentes

- Se a reuniao e sobre um cliente, atualize o arquivo do cliente (ex: `pique/clientes/beco.md`)
- Se gerou decisoes que afetam estrategia, atualize o arquivo relevante
- Se contradiz algo, corrija e registre a mudanca

### 5.3 ClickUp

- Crie tasks seguindo as regras do CLAUDE.md
- Se alguma task existente foi resolvida na reuniao, proponha mover para "Finalizado"
- Se alguma task existente ganhou contexto novo, atualize a descricao

### 5.4 Google Calendar

- Se foram agendados compromissos, crie no calendario Pique Agenda
- Adicione participantes como convidados
- Inclua pauta/contexto na descricao do evento

### 5.5 Atualizar _mapa.md

Se criou arquivo novo, adicione ao mapa.

---

## Fase 6: Resumo final

```
## Processado

**Sessao:** sessoes/YYYY-MM-DD-HHMM-[tipo]-[descricao].md
**Cerebro atualizado:** [lista de arquivos]
**ClickUp:** [X tasks criadas, Y atualizadas]
**Calendar:** [X eventos / nenhum]

Reuniao processada. Nada ficou pra tras.
```

---

## Regras

- NAO execute nada sem aprovacao (Fase 4).
- Se a reuniao ja foi parcialmente processada por outra skill (ex: planejamento semanal), sinalize e NAO duplique.
- Foque no DELTA — o que e novo. Nao repita o que o cerebro ja sabe.
- Tasks sempre com verbo no infinitivo, responsavel e prazo (regras do CLAUDE.md).
- Se a transcricao for confusa ou incompleta, sinalize os trechos que nao conseguiu interpretar com [?].
- Se a reuniao menciona algo que nao esta mapeado no cerebro (novo cliente, novo projeto), sinalize e proponha onde criar.
- NAO julgue o conteudo da reuniao. Extraia, organize, proponha.
- Comunique-se em portugues brasileiro, direto e sem formalidade.

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. Extraiu tudo que era acionavel da transcricao?
2. Tasks geradas ficaram claras o suficiente pra executar sem perguntar?
3. Focou no delta (novidades) ou repetiu o que o cerebro ja sabia?
4. Trechos confusos foram sinalizados com [?]?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao, mostre:

```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
Quer que eu aplique essas melhorias na skill? (s/n)
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
