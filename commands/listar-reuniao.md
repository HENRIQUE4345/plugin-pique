---
description: Atalho rapido. Lista as ultimas 10 reunioes com anotacoes do Gemini na agenda Pique, voce escolhe uma, ela carrega o conteudo inteiro (resumo + transcricao) na conversa pra voce continuar conversando. Read-only — nao processa, nao cria task, nao mexe em arquivo.
---

Atalho de leitura. Caminho curto pra acessar a mesma pasta do `/pos-reuniao` modo automatico, sem entrar no fluxo de processamento. Use quando voce quer **abrir uma reuniao recente e conversar em cima**, nao quando quer fechar acoes formais.

## Quando usar

- "Lembra o que a Edith disse sobre PIX?" → abre a reuniao, busca no contexto
- "Como ficou aquele alinhamento com o Marco?" → carrega e relembra
- Quer revisar uma reuniao antes de decidir se vai processar com `/pos-reuniao`
- Quer puxar trechos pra colar em outro lugar (apresentacao, mensagem, sessao)

**NAO use quando:** voce quer extrair tasks/decisoes formalmente. Pra isso, `/pos-reuniao` direto.

## Ferramentas

- **Google Calendar** (listar eventos): chamar direto (`mcp__claude_ai_Google_Calendar__list_events`)
- **Google Drive** (ler doc Gemini): chamar direto (`mcp__claude_ai_Google_Drive__read_file_content`)
- **Gmail** (fallback): chamar direto (`mcp__claude_ai_Gmail__search_threads` + leitura)

---

## Fase 1: Listar as 10 ultimas

### 1.1 Buscar eventos

Busque no calendario **Pique Agenda** (ID em `CLAUDE.md` do plugin: `409d950b004a4b8e6eebb6c649945d5308c83b26c58415d738e4e93ef1a1c83c@group.calendar.google.com`) com:

- `timeMin`: hoje menos 30 dias
- `timeMax`: hoje + 1 dia (pra pegar reuniao que acabou de acontecer)
- `condenseEventDetails: false` (precisa dos attachments)
- `maxResults`: 100 (sobra pra filtrar)

### 1.2 Filtrar com anotacao do Gemini

Filtre apenas eventos cuja lista de attachments contenha um arquivo com:
- `title: "Anotações do Gemini"`
- `mimeType: "application/vnd.google-apps.document"`

### 1.3 Ordenar e cortar

Ordene por `start.dateTime` decrescente (mais recente primeiro). Pegue os 10 primeiros.

Se vierem menos que 10 (pouca reuniao no periodo), expanda a janela pra 60 dias e repita. Se ainda assim vier menos, mostre o que tem e avise: `Encontrei N reunioes na janela. Pra ver mais antigas, fala que eu expando.`

### 1.4 Apresentar lista

Formato OBRIGATORIO:

```
Ultimas 10 reunioes com anotacoes do Gemini:

1. [qua 28/05 14:00] Reuniao Beco — Marco, Edith
2. [ter 27/05 10:00] Reuniao Karine — Marco
3. [seg 26/05 19:00] H+M alinhamento societario — Marco
4. [sex 23/05 09:30] Reuniao Arthur — Arthur
...

Qual? (numero)
```

Regras do formato:
- `[dia-da-semana DD/MM HH:MM]` — sempre completo, abreviacao 3 letras (seg/ter/qua/qui/sex/sab/dom)
- Titulo = `summary` do evento
- Participantes = `attendees` (so o nome, sem email; sem incluir Henrique se ele esta na lista — implicito)
- Se nao tiver attendees alem do organizador, omitir `— ...`

ESPERE o usuario escolher um numero.

---

## Fase 2: Ler o conteudo INTEIRO

### 2.1 Drive-first

Pegue o `fileId` do attachment "Anotações do Gemini" do evento escolhido. Chame `mcp__claude_ai_Google_Drive__read_file_content` com esse fileId.

### 2.2 Garantir leitura COMPLETA do doc

**IMPORTANTE:** O Google Doc gerado pelo Gemini tem 2 ou 3 blocos distintos, na ordem:

1. **Resumo da reuniao** (descricao em prosa do que rolou)
2. **Itens de acao** ou **Proximos passos** (lista)
3. **Transcricao** (texto bruto fala-por-fala — geralmente a maior secao, no fim do doc)

Voce DEVE ler ate o final do documento e ter os 3 blocos no contexto. Erros comuns a evitar:

- Pegar so o resumo (primeiro bloco) e parar — perde a transcricao
- Pegar so a transcricao — perde o resumo/proximos passos que o Gemini ja destilou
- Truncar no meio da transcricao

Se a resposta do Drive vier truncada (acontece em doc longo), refaca a chamada pedindo paginacao/range, OU avise ao usuario: `Doc longo, primeira metade carregada. Quer que eu puxe o restante?`.

### 2.3 Fallback Gmail

Se o Drive falhar (sem permissao, attachment removido), busque email do Gemini:
- `from:gemini-notes@google.com`
- subject contem o nome do evento

Leia o body completo. Mesma regra: tem que ter resumo + transcricao.

### 2.4 Fallback manual

Se nada funcionar:

```
Nao consegui ler a anotacao automatica. O doc esta aqui: [link do Google Doc]
Abre, copia tudo (resumo + transcricao) e cola aqui que eu sigo.
```

---

## Fase 3: Confirmar carregamento e abrir conversa

Apos ler o conteudo, mostre um bloco curto de confirmacao:

```
Carreguei: **[Titulo da reuniao]**
- Data: [dia DD/MM HH:MM]
- Participantes: [nomes]
- Tamanho: [resumo: X linhas | transcricao: Y linhas]

Resumo do Gemini em 3 linhas:
- [bullet 1]
- [bullet 2]
- [bullet 3]

Conteudo inteiro carregado no contexto. Pergunta o que quiser, ou:
- `/pos-reuniao` — pra processar formalmente (extrair tasks, criar sessao, etc)
```

E PARE. NAO crie sessao no cerebro. NAO crie task no ClickUp. NAO sugira proximas acoes alem do atalho pro `/pos-reuniao`.

**A partir daqui, o usuario conversa em cima do contexto carregado.** Se ele perguntar "o que a Edith falou sobre X", voce responde citando trecho da transcricao. Se pedir resumo de um topico, voce destila. Se ele falar `/pos-reuniao`, voce ja tem a transcricao em maos — entra direto na Fase 2 daquele comando.

---

## Regras

- Read-only. Nao mexe em arquivo nenhum do cerebro, nao cria task no ClickUp, nao cria evento no Calendar.
- Sempre ler resumo + transcricao. Nao pegar so um dos blocos.
- Se voce nao conseguir ler o doc INTEIRO, avisar — nao fingir que leu.
- Se a janela de 30 dias nao tiver 10 reunioes com Gemini, expandir pra 60 e avisar.
- Nao pular pra processamento sem o usuario pedir. Esse comando termina em "conteudo carregado, pergunta o que quiser".
- Comunicar em portugues brasileiro, direto e sem formalidade.
