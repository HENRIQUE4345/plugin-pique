---
name: rituais-pique
description: "Conhecimento sobre os rituais da Pique Digital (cadencia v2): grade da semana, quem conduz o que, o que e solo e o que e sincrono, onde cada registro mora, indicadores de alerta. Auto-invoca quando o usuario mencionar stand-up, ritual, review semanal, planejamento, reuniao, diario, boa-noite, bom-dia."
---

# Skill: Rituais Pique Digital — cadencia v2

> **Fonte:** `MEU-CEREBRO/pique/processos/cadencia-rituais-v2.md` (ativo, materializado em 20/07/2026).
> **Este arquivo e esqueleto, nao copia.** Traz a grade, os donos e o que esta em aberto. O detalhe
> (roteiro da reuniao de segunda, regua de Calendar, regua de registro) vive na fonte.
> **Conferido em:** 2026-07-27. Se a fonte tiver data mais nova que esta, a fonte ganha.
> **Deck de onboarding:** https://docs.pique.digital/publico/apresentacoes/cadencia-rituais-pique-v2/

## O principio que sustenta tudo

**Acompanhar o avanco = OLHAR o board (ClickUp v2), nao ouvir alguem reportar.** As reunioes nao
existem pra saber o que cada um fez — existem pra **destravar, decidir e cuidar da pessoa**.

Pre-requisito duro: o card precisa refletir a realidade. Por isso **o boa-noite move o card** — e
esse e o ato central do dia, nao um extra. Dona de que o board reflita a realidade: **Carol**.

**Rituais sao skills, nao reunioes.** Bom-dia, boa-noite, planejamento e review sao **solo** — cada
pessoa roda a propria skill. A unica reuniao sincrona da semana e a de **segunda, conduzida pela
Carol**, que consome esses outputs.

## Grade da semana

| Rito | Quando | Formato | Dono | Registro vai pra |
|---|---|---|---|---|
| **Planejamento da semana** | Seg 9h | Solo (skill) | Cada um | Slack + comentario na subtask |
| **Bom-dia** | **Ter–sex** 9h | Solo (skill) | Cada um | Slack |
| **Boa-noite** | **Seg–qui** 18h | Solo (skill) | Cada um | **Move os cards** + Slack |
| **Review da semana** | **Sex** 18h | Solo (skill) | Cada um | Slack + comentario na subtask |
| **Reuniao de equipe** | Seg 13h, 30min | Sincrono | **Carol** | Comentario no card da reuniao |
| **Rotina Beco** | Seg 11h | Sincrono | Arthur + Carol | — |
| **Sync de Produto** | Qui 15h | Sincrono | Henrique | — |
| **Gravacao de conteudo** | 1 dia fixo por socio (dia a cravar) | Sincrono | Cada socio; Gabriel opera | — |

⚠️ **Segunda nao tem bom-dia** (o planejamento o substitui) e **sexta nao tem boa-noite** (o review
o substitui). Sao 4 blocos solo por pessoa, replicados nas 5 agendas.

**A reuniao de segunda:** time todo, **Marco sempre presente, Henrique fora por padrao**. O trabalho
mora no ANTES (~40min solo da Carol: le os planos contra a cascata, monta o placar, fecha a lista de
excecoes e posta antes das 13h). Na sala: placar (5min) → excecoes e travas (18min) → fecho (7min).
**Marco decide, nao cobra** — cobranca de pessoa vai pro 1:1, nunca na sala.
**Piso:** a reuniao roda sempre; abaixo de 3 planos postados, os primeiros 10min viram conversa
sobre por que o ritual nao rodou.

## Alem da semana

| Rito | Quando | Dono | O que acontece |
|---|---|---|---|
| **1:1 Marco ↔ pessoa** | Quinzenal, 30min | Marco | Dimensao pessoa (Arthur, Carol, Gabriel). Destino do material: Drive do Marco, **nada vai pro cerebro compartilhado** |
| **Revisao financeira** | Mensal, antes do fechamento | Henrique | Consolida os numeros no Supabase |
| **Apresentacao de resultados** | Mensal, ultimo dia util (bloco 1) | Dono de cada objetivo | 1 bloco por frente M1–M5, ~8-10min: resultado macro + aprendizado, nao status |
| **Fechamento mensal** | Mensal, ultimo dia util (bloco 2) | Marco | So H + M: numeros, retrospectiva, altitude dos objetivos do trimestre |
| **Revisao estrategica + metas** | Trimestral, 1a semana | H + M | Define os objetivos do trimestre — a origem da cascata |

## Onde mora cada registro

**Calendar = QUANDO · ClickUp = O QUE (acao) · Slack = o PULSO · cerebro `.md` = memoria estrategica
dos socios.**

- **Rito-habito nao vira card.** Bom-dia, boa-noite, planejamento e review nao tem card proprio. Vira
  card o *output* (as tasks que o planejamento cria) e o *entregavel* de reuniao.
- **Reuniao = card recorrente** (dono = quem conduz). As acoes saem como **cards proprios** ligados
  ao projeto, nao subtarefas.
- **Ata nao mora no ClickUp.** Pauta, ata e transcricao vivem num Google Doc unico de 3 guias na
  pasta REUNIOES do Shared Drive. O card recebe o **link**.
- **Comentario de planejamento** registra **o que ficou de fora e por que** (as tasks carimbadas ja
  sao o plano — nao resumir). **Comentario de review** registra **por que** nao fechou e o
  aprendizado. Nunca um resumo do que o board ja mostra — isso reintroduz o reporte.

## Indicadores de alerta

| Sinal | Significado |
|---|---|
| **Cards parados 5+ dias** | O board nao esta sendo mantido fiel — mede o efeito, nao a postagem |
| Aderencia verde + cards parados vermelhos | O ritual esta sendo cumprido no papel e nao esta funcionando |
| Menos de 3 planos postados na segunda | O ritual nao rodou — vira conversa na sala, com o socio presente |
| Alguem explicando o proprio numero na sala | Virou tribunal — gatilho de reversao do painel publico |
| Review/reuniao cancelada 2x seguidas | Alinhamento comprometido |
| Ritmo de conteudo Yabadoo abaixo de 3 pecas/semana | Pipeline fixa parou |
| Revisao financeira mensal nao rodou | Visibilidade zero no fechamento |

**Aderencia tem 2 fontes:** planejamento e review saem das subtasks (ClickUp); bom-dia e boa-noite
**so existem no Slack** (rito-habito nao vira card).

**Fato vs interpretacao:** o binario (postou / nao postou) pode ser publico — ja e, no Slack. A
interpretacao (por que, o que diz da pessoa, o que fazer) e 1:1, sempre.

## Em aberto — nao cravar

1. **Formato da reuniao de segunda** — expositiva (Carol, 21/07) x arbitragem de excecoes
   (redesenho, 21/07). Card `86ajp5064` em `espera decisão`. O que esta escrito acima e o
   redesenho; se o usuario perguntar, dizer que esta em decisao.
2. **Onde cai o audio da reuniao** — a gravacao centralizada foi cortada e o `pos-reuniao` esta sem
   entrada. Nao afirmar que "toda reuniao e gravada".
3. **Divisao de supervisao dos marcos entre H e Marco** — cogitada em 27/07, contradiz o modelo
   fechado ("Carol sinaliza, Marco cobra"). Sem martelo. Nao aplicar.

## O que a v1 dizia e **nao vale mais**

Se aparecer em skill, card ou conversa, esta desatualizado: stand-up por audio no WhatsApp "Pique —
Daily" · brainstorm de conteudo na quarta com Gabriel (a ideacao ficou informal, sem rito) ·
planejamento e review como reuniao presencial de 1-2h · extensao estrategica quinzenal (virou
fechamento mensal) · review quinzenal do Marco (deletado do Calendar) · "toda reuniao deve ser
gravada" e "reunioes presenciais, nao por call".

## Comandos

Do escopo fechado do plugin (27/07):

| Existe hoje | Escopo, ainda nao existe |
|---|---|
| `/plugin-pique:bom-dia` · `/plugin-pique:boa-noite` · `/plugin-pique:planejamento-semanal` · `/plugin-pique:review-semanal` · `/plugin-pique:pos-reuniao` · `/plugin-pique:encerrar` · `/plugin-pique:sincronizar` · `/plugin-pique:apresentacao` | `pre-reuniao` (gera a pauta) · `iniciar` · `inbox` |

⚠️ **Nao anunciar** `extensao-estrategica`, `painel-review` nem `fechamento-semana` como rituais
ativos — sairam na triagem de 27/07, mesmo que os arquivos ainda existam em `commands/`.
