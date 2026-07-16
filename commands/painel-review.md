---
description: Prepara o Painel de Review semanal do time (sexta 09:30, Marco conduz). Cruza o que cada um commitou na segunda com o que entregou, conta o ritmo de stand-up, amarra na cascata e gera um HTML no padrao Pique. Execute este fluxo EXATAMENTE, sem pular etapas.
---

Prepara o **Painel de Review semanal do time Pique** — a reuniao de **sexta 09:30 que o Marco conduz** com a equipe toda ("Entregue vs planejado"). O painel e a pauta visual: uma janela por colaborador, mostrando o que cada um **commitou na segunda** vs o que **entregou**, o ritmo do stand-up e a amarracao na cascata do trimestre.

Este ritual e o par do **Stand-up de segunda** (Carol conduz) — segunda commita, sexta confere. NAO confundir com:
- `/pique:review-semanal` — review PESSOAL solo de cada socio (introspeccao, telemetria, diario). Outro proposito.
- `/pique:fechamento-semana` — legado; o "fechamento de socios" nao existe na pratica. O ritual real e a reuniao de EQUIPE.

## Ferramentas

- **WhatsApp** (ler o grupo de stand-up): MCP `plugin-whatsapp` — `whatsapp_read_messages`
- **Google Drive** (transcricao do stand-up + reunioes): MCP `google-workspace` — `search_drive_files` + `get_drive_file_content`
- **Google Calendar** (reunioes da semana): MCP `google-workspace` — `get_events`
- **ClickUp** (confirmar entrega + surgiu-no-meio): agent `gestor-clickup`
- **Arquivos do cerebro**: Read/Grep direto

> **IMPORTANTE**: WhatsApp e a fonte-chave (commits + ritmo). Se o MCP `plugin-whatsapp` estiver off, avise: "WhatsApp MCP desativado — sem ele nao da pra montar o ritmo nem os commits da equipe. Ative e me chame de novo." Google Workspace (Calendar/Drive) e OAuth do claude.ai — se off, rode em modo degradado (ver Fase 6) e avise o gap. NAO invente dado que a fonte nao deu.

## Configuracao

- **Quando:** Sexta de manha, ANTES da reuniao das 09:30. A semana coberta e **segunda a quinta** (a sexta e o proprio review).
- **Grupo de stand-up (WhatsApp):** JID `120363405801332081@g.us`.
- **As 5 pessoas** (parear SEMPRE por `sender_jid`, que e estavel — nunca por nome):

| Pessoa | sender_jid | Papel | Fonte do commit |
|---|---|---|---|
| Henrique | `66743875723427@lid` | Socio · produto/arquitetura | **TAREFAS.md (SEMANA)** — ele planeja o trilho, nao vai ao stand-up |
| Marco | `173014335365235@lid` | Socio · comercial/gestao | stand-up de segunda |
| Arthur | `233495930638507@lid` | Lideranca tecnica · YabaBuss | stand-up de segunda |
| Gabriel | `224192997904627@lid` | Audiovisual · conteudo | stand-up de segunda |
| Carol | `202872880914457@lid` | Gestao de projetos · Beco | stand-up de segunda |

Se algum sender_jid tiver mudado (numero novo), confirmar com `whatsapp_list_chats` antes. Se entrar gente nova no time, adicionar aqui.

- **Cascata do trimestre:** ler `pique/estrategia/2026-06-30-handoff-cascata-trimestre-jul-set.md` (os 5 objetivos M1-M5). Se houver handoff mais novo, usar o mais recente.

---

## Fase 1: Coleta (paralelo, NAO pergunte nada ainda)

Execute TUDO em paralelo.

### 1.1 WhatsApp — stand-up da semana (fonte-chave)

`whatsapp_read_messages` no grupo `120363405801332081@g.us`, `since` = a **segunda** desta semana. Puxe paginas suficientes pra cobrir seg-sex (o dump costuma passar de 1 pagina; se `has_more` e ainda nao chegou na segunda de manha, pagine).

> **Se o output estourar o limite de tokens**, ele e salvo em arquivo. Nesse caso, delegue a CONTAGEM a um subagente (Agent tool) com instrucao explicita de ler o arquivo em chunks e retornar so a tabela contada — nao traga o dump inteiro pro contexto principal.

Separe por pessoa (sender_jid) e classifique cada mensagem:
- **BOM-DIA** (check-in): comeca com "Hoje:", "Bom dia", ou lista o que a pessoa VAI fazer.
- **BOA-NOITE** (check-out): comeca com "Feito:", "Boa noite", ou lista o que FEZ + "Fica pra amanha".

### 1.2 Drive — transcricao do stand-up de segunda (fonte dos commits da equipe)

`search_drive_files` por `name contains 'Stand-up de entrega'` + `'Anotações do Gemini'`, `order_by: 'modifiedTime desc'`. Pegue o da **segunda** desta semana. `get_drive_file_content` no ID.

Extraia o **commit de cada pessoa da equipe** — o que ela DECLAROU que ia fazer na semana (secao "Proximas etapas" do Gemini + a fala literal na transcricao). Este e o commit CONGELADO.

### 1.3 Drive — transcricoes das reunioes da semana (leitura factual)

`search_drive_files` por `'Anotações do Gemini'`, `order_by: 'modifiedTime desc'`, dos ultimos 5 dias. Sao a fonte da "leitura factual" de cada janela (o *porque* que o card nao conta).

### 1.4 ClickUp — entrega + surgiu-no-meio

Delegue ao `gestor-clickup`, por assignee, nos Spaces da empresa. Buscar: tasks finalizadas (7 dias) + tasks criadas na semana (= candidatas a "surgiu no meio"). Serve pra **confirmar** o verde/vermelho e pegar o que surgiu fora do commit.

> ATENCAO: o ClickUp de alguns (ex: Marco) e defasado — eles reportam no WhatsApp mas nao movem card. NUNCA marque vermelho so porque o card nao mudou. A fonte primaria do cumprimento e a FALA (stand-up + boa-noites); o ClickUp confirma, nao decide.

### 1.5 Calendar — reunioes da semana

`get_events` no Pique Agenda (`409d950b...@group.calendar.google.com`), seg-sex. Serve pra "surgiu no meio" (reuniao nao planejada) e contexto.

### 1.6 TAREFAS.md — commit do Henrique

Leia `TAREFAS.md` (raiz do cerebro), secao **SEMANA**. Os itens etiquetados sao o commit do Henrique (ele nao vai ao stand-up). Separe por modo: `[Produzir]`/`[Dirigir]`/`[Afiar]` = **entrega** (vao pro painel); `[Pensar]`/`[Cobrar]` = direcao/decisao (NAO vao pro painel — ver regra abaixo).

---

## Fase 2: Montar cada janela (as 5)

Para cada pessoa, monte:

### 2.1 Commit → entregou (o coracao da janela)
- **Commit congelado:** so o que a pessoa declarou na SEGUNDA (equipe = stand-up; Henrique = TAREFAS.md/SEMANA). NAO adicione ao commit coisas que apareceram depois na semana.
- Para cada item do commit: cruzar com boa-noites + ClickUp -> **fechou (verde) / nao fechou (vermelho)**.
- Para o vermelho: extrair o **porque** (o que a pessoa disse — "travado em X", "escorregou pra data Y", "dependia de fulano"). O vermelho SEMPRE tem motivo; e a pessoa explicando, nao a IA acusando.
- **Score = fechados / total do commit** (ex: 2/3).

### 2.2 Entregou alem do commit
- O que a pessoa entregou que NAO estava no commit de segunda -> chips verdes "alem do commit". Conta como bonus, NAO infla o score do commit.

### 2.3 Surgiu no meio
- Eventualidade que nao foi commit nem entrega planejada (task nova, reuniao nao planejada, urgencia de cliente) -> chips ambar.

### 2.4 Ritmo do stand-up (REGUA /4 — critica, ver Fase 3)

### 2.5 Cascata (amarração aos 5 objetivos)
- Amarre os commits/entregas aos objetivos M1-M5 (tags no topo da janela).
- **Hibrido:** amarra o obvio, marca o ambiguo com `?`. E PROPOSTA da IA — o rodape do painel diz "confirmar na reuniao".
- Cuidado: reportar o PRODUTO por tras da tarefa, nao a tarefa crua. Ex: "popular grafo do Beco" -> na verdade e "construir o YabaBuss (M3)", com o Beco como cliente-laboratorio (M4). Cruzar com a cascata pra nomear certo.

### 2.6 Leitura factual (1-2 linhas, SEM adjetivo)
- Padrao observavel, factual. "Todas as eventualidades vieram do Beco." "Grava muito, publica devagar." A PESSOA interpreta se e bom ou ruim — a IA so aponta.
- **CORTE OBRIGATORIO:** extrair SO o que e sobre o TRABALHO (feito/decidido/travou). DESCARTAR o que e sobre a pessoa (humor, cansaco, reclamacao de terceiros, conversa fiada) — mesmo que esteja na transcricao. Regra do handoff: "o farol fala da FRENTE, nao da pessoa." "Como a pessoa esta" e o 1:1 do Marco, nao o painel.

---

## Fase 3: Contagem do ritmo (REGUA FIXA — nao improvisar)

Contar stand-up e a parte que mais da erro. As regras sao FIXAS:

1. **Denominador = 4** (segunda a quinta). A sexta e o proprio review — NAO conta. Nunca use /5.
2. **Conta DIAS COBERTOS, nao ocorrencias.** 2 mensagens no mesmo dia = 1 dia coberto. Dois bom-dias na quarta NAO pagam a terca pulada.
3. **Madrugada fecha o dia anterior.** Um "Feito:" postado 00:04 de quinta fecha a QUARTA (e o check-out do dia que passou, so postado tarde).
4. **Mensagem hibrida** ("Bom dia! Hoje: ... Feito: ...") conta **1 bom-dia + 1 boa-noite** (o "Feito" fecha o dia anterior, o "Hoje" abre o atual).
5. **CONTE DA FONTE, SEMPRE.** Nunca estime "essa pessoa manda todo dia". Se faltou pagina do WhatsApp pra confirmar um dia, pagine ou marque "nao confirmado" — nao chute.

Cores: 4/4 verde, 3/4 ambar (`.mid`), <=2/4 vermelho (`.lo`).

---

## Fase 4: Gerar o HTML (padrao Pique — ILUSTRAR, nao escrever)

Gere um HTML self-contained no **design system Pique** (tokens de `pique/materiais/design-system-pique.css`): fundo `#0a0a0a`, Inter, accent `#E89430`, verde `#34d399`, vermelho `#f87171`. **Layout de DASHBOARD** (janelas empilhadas, tudo visivel de bater o olho) — NAO a casca de apresentacao tela-cheia (sem `min-height: 100vh`). Igual a `extensao-estrategica`.

**Regra de ouro do HTML: ILUSTRAR > TEXTO.** Semaforo, barra de beads, checkbox, contador, mini-barras de ritmo. O Marco bate o olho e conduz — nao le paragrafo. Um gabarito validado desta skill existe (a "Semana 06-10 jul" foi o primeiro); seguir a mesma estrutura:

- **Header** + linha de KPIs (commits cumpridos, taxa, alem-do-commit, stand-ups enviados)
- **Farol** dos 5 objetivos (M1-M5) no topo — semaforo
- **Grid de janelas** (uma por pessoa): avatar+papel+tags de cascata / beads de cumprimento + lista commit com verde-vermelho+porque / chips "alem do commit" / chips "surgiu no meio" / ritmo (2 mini-barras) / leitura factual
- **Rodape** com a regua de contagem + "corte aplicado" + "cascata e proposta da IA, confirmar na reuniao"

Estrutura: `<!DOCTYPE html>` completo, `<head>` com Inter via `@import`, CSS inline. Responsivo em 780px.

Salve em `inbox/YYYY-MM-DD-painel-review-semana.html` (area de transito do cerebro).

> **node --check** se o HTML tiver JS. Antes de subir, validar estrutura (tags balanceadas, sem `<style>` orfao, N janelas = N pessoas).

---

## Fase 5: Apresentar + deploy

1. Apresente o resumo em texto ao Henrique: os 5 scores de cumprimento + os 5 de ritmo + os 2-3 insights que emergiram (ex: "Marco reporta mas nao move card", "Gabriel: gargalo e postagem", "Carol so apareceu quinta").
2. Informe o caminho do HTML local e pergunte: "Quer que eu abra pra revisar?"
3. **Deploy** (so apos aprovacao): subir via MCP `docs-pique__upload_page`, `folder: "pique/reunioes"`, `title` + `tags` (obrigatorios). Retorna a URL.

> **ALERTA DE PRIVACIDADE (dar uma vez, claro, e seguir):** o painel expoe cumprimento individual + nome ("Carol 2/8", "Marco some no fim"). Isso e avaliacao de pessoas. Em `visibility: "publico"` fica indexavel e acessivel ao time/mundo. Recomende `interno` por padrao. Se o Henrique decidir `publico` mesmo assim, e decisao consciente dele — registre e siga, NAO bloqueie repetidamente.
> **Gotcha:** o upload reescreve o `<head>` e strippa favicon (memoria 20/06). Passe o HTML completo; nao dependa de favicon local.
> Credenciais Dufs em `.suporte/credenciais.md` se der 401.

---

## Fase 6: Modo degradado (fontes off)

Roda so com **WhatsApp + ClickUp** (o nucleo: commits, ritmo, cumprimento). Se faltar:
- **Drive off:** commits da equipe saem so do WhatsApp (sem a transcricao do stand-up pra cruzar); leitura factual sai so do ClickUp (sem o *porque* da transcricao). Avise o gap.
- **Calendar off:** janela sem "reuniao nao planejada".
Sempre **informe o gap, nao invente**.

---

## Fase 7: Salvar sessao

Crie `sessoes/YYYY-MM-DD-HHMM-painel-review-semana.md` (SEM sufixo de user — e da empresa):

```markdown
# Sessao — Painel Review Semana [DD/MM a DD/MM]

**Criado:** YYYY-MM-DD HH:MM
**Status:** ativo
**Tags:** sessao, pique-digital, review-semanal, painel, equipe

## Contexto
Painel de review do time pra reuniao de sexta 09:30 (Marco conduz).

## Placar (cumprimento do commit)
| Pessoa | Commit | Ritmo (BD/BN) |
|--------|--------|---------------|
[as 5 linhas]

## Insights que emergiram
[os padroes que o painel revelou]

## Link do painel
[URL do deploy]

## Relacionado
- Cascata: [handoff]
- Stand-up de segunda: [transcricao]
```

Atualize `_mapa.md`. Encerre: "Painel no ar. Leva pra reuniao das 09:30."

---

## Regras

- **E reuniao de EQUIPE, nao de socios.** As 5 pessoas aparecem. Output vai pro Marco (conduz) + time — NAO re-centraliza no Henrique.
- **Commit congelado na segunda.** O que veio depois e "alem do commit", nunca infla a meta.
- **Fonte do commit varia por pessoa** (equipe=stand-up, Henrique=TAREFAS.md). Respeitar.
- **So ENTREGA vai pro painel.** `[Pensar]`/`[Cobrar]` do trilho ficam de fora — decidir/cobrar nao e entregar.
- **Ritmo: regua /4, seg-qui, dias cobertos.** Sempre contar da fonte, nunca estimar.
- **Farol fala da frente, nao da pessoa.** Leitura factual sem adjetivo; corte trabalho-so na transcricao.
- **Cascata e proposta, nao veredito.** Marcada pra confirmar na reuniao.
- **Ilustrar > texto** no HTML. Padrao visual Pique, layout dashboard.
- Comunique-se em portugues brasileiro, direto e sem formalidade.

## Auto-avaliacao (executar sempre ao final)

Avalie a execucao com base nestas perguntas:
1. O ritmo foi contado da FONTE (regua /4, dias cobertos) ou foi estimado? Bateu com o WhatsApp real?
2. Os commits ficaram CONGELADOS na segunda, ou vazou entrega-de-depois pra dentro do commit (inflando a meta)?
3. A fonte do commit do Henrique foi o TAREFAS.md (nao o stand-up, que ele nao vai)?
4. A leitura factual respeitou o corte trabalho-so (nada de humor/pessoa/conversa fiada da transcricao)?
5. O HTML ficou no padrao Pique (dashboard, nao deck) e ilustra em vez de encher de texto?
6. O alerta de privacidade foi dado no deploy publico (uma vez, sem bloquear)?

Se identificar melhorias CONCRETAS e EVIDENCIADAS nesta execucao:

1. Mostre ao usuario:
```
[AUTO-AVALIACAO]
- [descricao da melhoria 1]
- [descricao da melhoria 2]
```

2. Anexe em `pique/infra/melhorias-plugin.md` no formato:
```
## YYYY-MM-DD — painel-review (usuario)
- [melhoria 1]
- [melhoria 2]
```

Se nao identificar nada concreto, nao mostre nada.
NAO melhore por melhorar.
