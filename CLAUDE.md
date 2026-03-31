# Plugin: Pique Digital

Workflows da Pique Digital. Gestao, rituais, conteudo, automacoes de time.

COMUNIQUE-SE SEMPRE EM PORTUGUES BRASIL.

## Identificacao do usuario

Ler `plugin-pique.local.md` na raiz do projeto para identificar o usuario atual.
Se nao existir, perguntar o nome e criar usando o template em `config/user-config.example.md`.

Campos disponiveis no frontmatter:
- `user_name` — nome do usuario
- `user_clickup_id` — ID no ClickUp
- `diarios_path` — caminho dos diarios pessoais
- `calendarios.primary` — email principal
- `calendarios.pique` — ID calendario Pique (compartilhado)
- `calendarios.pessoal` — ID calendario pessoal

## Regras da empresa

1. Lingua: portugues brasileiro, direto, sem formalidade.
2. Tasks no ClickUp SEMPRE com: verbo no infinitivo, assignee, due_date, descricao (## Contexto / ## O que fazer / ## Criterio de pronto), prioridade.
3. Limite anti-TDAH: max 2-3 tasks/dia, max 5-7 tasks/semana por pessoa.
4. Calendar > ClickUp: o dia real define o teto, tasks preenchem o espaco.
5. Task empurrada 2+ vezes = bloqueio cronico (sinalizar na review).
6. Nunca julgar produtividade. TDAH = semanas variam. Registrar e seguir.
7. Cerebro compartilhado: `pique/` e submodule Git. Sincronizar com /pique:sincronizar.
8. Setup ClickUp: consultar `pique/infra/clickup-setup.md` para IDs, Spaces, Folders, Lists.
9. Acoes destrutivas (deletar, sobrescrever): NUNCA sem aprovacao explicita.
10. Dados do Apify consomem creditos: nunca scrapar mesmo perfil duas vezes na mesma sessao.

## Membros

| Nome | ClickUp ID | Papel |
|------|-----------|-------|
| Henrique | 48769703 | Estrategia, arquitetura, specs, conteudo @iairique, financeiro |
| Marco | 112131560 | Operacao, campo, clientes, prospeccao, conteudo proprio |

## ClickUp — Workspace

- **Workspace ID:** 36702200
- **Plano:** Pro

### Spaces

| Space | ID |
|-------|----|
| Pique Digital | 901313561086 |
| Conteudo | 901313691844 |
| Studio | 901313561098 |
| Yabadoo | 901313567191 |
| Beto Carvalho | 901313567164 |
| Pessoal | 901313561154 |

### Status workflow

```
A fazer → Essa semana → Hoje → Fazendo → Feito/Finalizado
```

### Template de descricao (markdown_description)

```markdown
## Contexto
Por que essa task existe. Background relevante.

## O que fazer
Passos concretos, numerados.

## Criterio de pronto
Como saber que esta finalizada.
```

## Google Calendar

- Toda reuniao profissional nasce no calendario **Pique Agenda**
- Adicionar participantes como convidados
- Incluir pauta/contexto na descricao do evento
- HORARIO = Calendar | ACAO = ClickUp | Reunioes = ambos

### IDs dos calendarios

| Calendario | ID |
|-----------|-----|
| Pique Agenda | 409d950b004a4b8e6eebb6c649945d5308c83b26c58415d738e4e93ef1a1c83c@group.calendar.google.com |
| Agenda Henrique | 88b6ab1c9c497ff2fae8d9beba332374e1d17f18fb03acf107eb0f20e794ee30@group.calendar.google.com |
| Agenda Marco | a0cfd61157ee347d8df2ca20705d005fd74a5fc2705e2af98c2dfb7d4e96e860@group.calendar.google.com |
