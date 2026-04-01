---
name: rituais-pique
description: "Conhecimento sobre os rituais da Pique Digital: cadencia diaria/semanal/mensal, formato de stand-up, estrutura de diarios, regras de reuniao, indicadores de alerta. Auto-invoca quando o usuario mencionar stand-up, ritual, review semanal, planejamento, reuniao, diario, boa-noite, bom-dia."
---

# Skill: Rituais Pique Digital

## Quando esta skill e relevante

Esta skill deve ser invocada quando o usuario mencionar:
- Stand-up, daily, ritual, bom-dia, boa-noite
- Reuniao, review, planejamento, retrospectiva
- Diario, registro, check-in, check-out
- Cadencia, frequencia, semanal, mensal

## Cadencia dos rituais

### Diarios (inegociaveis)
- **9:00** — Stand-up: audio/texto no WhatsApp "Pique — Daily"
- **~18:00** — Check fim do dia: o que fez, o que ficou

### Semanais
- **Segunda** — Planejamento semanal (1-2h, presencial)
- **Quarta** — Brainstorm de conteudo (45min, presencial, com Gabriel)
- **Sexta** — Review semanal (1-2h, presencial)
- **Sexta alternada** — +1h extensao estrategica (quinzenal)

### Mensais
- **Ultimo dia util** — Revisao numeros + retrospectiva (2h, presencial)

## Formato do diario

Cada diario em `{diarios_path}/YYYY-MM-DD.md` segue:

```markdown
# Diario — YYYY-MM-DD

## Check-in
- Tasks planejadas: [lista]
- Reunioes: [lista]
- Energia: [alta/media/baixa]

## Check-out
- Feito: [lista]
- Nao feito: [lista com motivo]
- Blockers: [lista]
- Notas pra amanha: [lista]
```

## Indicadores de alerta

| Sinal | Significado |
|-------|-----------|
| Audios pararam por 3+ dias | Comunicacao quebrou |
| Review cancelada 2x seguidas | Alinhamento comprometido |
| Sem conteudo publicado em 2 semanas | Flywheel parou |
| Henrique trabalhando apos 19h 3+ dias | Burnout iminente |
| Marco sem iniciativa por 2+ semanas | Dependencia crescendo |
| Financeiro desatualizado 2+ semanas | Visibilidade zero |

## Comandos disponiveis

- `/plugin-pique:bom-dia` — executa stand-up completo
- `/plugin-pique:boa-noite` — executa fechamento do dia
- `/plugin-pique:planejamento-semanal` — ritual de segunda
- `/plugin-pique:review-semanal` — ritual de sexta
- `/plugin-pique:pos-reuniao` — processa transcricao de reuniao
- `/plugin-pique:encerrar` — fecha conversa e distribui

## Regras importantes

- Toda reuniao DEVE ser gravada em audio
- Reunioes presenciais — nao fazer por call
- Timer de 45min no brainstorm de conteudo
- Parar de trabalhar ate 19h (regra anti-TDAH, inegociavel)
