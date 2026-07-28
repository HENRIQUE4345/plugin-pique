# ROADMAP — arquivo (abr–jul/2026)

**Arquivado:** 2026-07-28
**Substituído por:** `_tasks-plugin-2026-07.md` (execução) e `_auditoria-skills.md` (escopo)
**Original íntegro:** commit `3fd5bec` e anteriores, arquivo `ROADMAP.md`

O roadmap foi escrito em 01/04, atualizado pela última vez em 20/04 e descrevia o plugin na
**v1.15.0**. Quando foi arquivado o plugin estava em **2.3.0**, e a auditoria de 27/07 já tinha
fechado um escopo (11 comandos) que o roadmap desconhecia. Este arquivo guarda o veredito de cada
item — principalmente o que foi **decidido não fazer**, que é o que some quando se apaga um
roadmap.

---

## Entregue

| Item | Nota |
|---|---|
| **2.1** `/pique:executar` | Existe, mas **mudou de escopo**: virou porta de entrada de ledger `_tasks-*.md`, não chat guiado por task do ClickUp. Depois foi triado pra **exclusão** — 0 usos contra 49 do `/inc` |
| **2.5.1** `desenhar-individual` | Feito 18/04. Triado pra exclusão do plugin em 27/07 (duplicado no `pique-consultoria-hub`) |
| **2.6.1** `news` | Feito 20/04. O texto do roadmap ficou **duas mudanças atrás**: descrevia teaser no canal ClickUp `1301zr-3373`, que migrou pro Slack `#pique-news` em 16/07 |
| **4.2** Evolution API / WhatsApp | Feito **fora do plugin**: virou o `plugin-whatsapp`, que roda hoje e ainda serviu de gabarito técnico (`PYTHONPATH: ${CLAUDE_PLUGIN_ROOT}`) pro empacotamento dos outros MCPs |

## Morto por substituição

| Item | Por quê |
|---|---|
| **1.1** Roadmap/MIT nos rituais diários | Nunca implementado. O `bom-dia` evoluiu pra outra arquitetura: **4 lentes** `DECIDIR → SUPERVISIONAR/COBRAR → LEMBRAR → FAZER` sobre o `TAREFAS.md`. O `roadmap-metas-2026.md` que o item pressupõe não existe no fluxo |
| **1.4** Roadmap no planejamento e review semanal | Mesma razão |
| **1.2** Padronizar ClickUp via agent | Resolvido por outro mecanismo: o hook `PreToolUse` que obriga a delegar pro `gestor-clickup` — generalizado em 28/07 pra casar por verbo de escrita |
| **4.1** Stand-ups salvos no ClickUp | A v2.3.0 (22/07) cortou o fluxo de gravação centralizada de reunião. E o stand-up migrou pro Slack `#standup` em 16/07 |

## Descartado por dado podre

**5.1 `/pique:delegar`** — os perfis eram "Marco / **Daniel** / Gabriel". Daniel (`284658609`) foi
removido do `defaults.ts` em 28/07 por ser membro fantasma. Se a ideia voltar, nasce de novo:
Carol e Camila entraram, e as fichas DISC/Gallup de `areas/equipe/` são a fonte certa pra calibrar
task por perfil — não uma lista hardcoded no comando. Está no **Backlog** do ledger.

## Sobreviveu — migrado pro Backlog do `_tasks-plugin-2026-07.md`

- **1.3** Detalhamento como oferta (a Fase 4 do bom-dia que nunca é executada)
- **2.3** Pílula de conhecimento no `/encerrar`
- **3.1** Auto-avaliação com self-edit real
- **3.2** Sincronizar o plugin entre máquinas
- **5.3** `/pique:onboarding`

**2.2 `/pique:prep-reuniao`** não foi pro backlog — **subiu**: virou o comando `pre-reuniao`, um
dos 11 do escopo fechado, e é a task C.1 do ledger. A auditoria registrou que
`extensao-estrategica` e `painel-review` já tinham a mecânica de coleta multi-fonte → pauta, e
que ela precisa ser extraída **antes** de esses dois serem excluídos.

**5.2 `/pique:financeiro`** ficou sem veredito — entre 27 e 28/07 houve três sessões de painel
financeiro (integridade, árvore de conciliação, plano de contas). Decidir se o painel substituiu
o comando ou se ainda são coisas diferentes.

---

## Conexão Plugin Pique → Yabadoo (tabela original)

Preservada porque a tese ("cada uso do plugin = teste real do produto") não foi revogada, mas
4 das 7 linhas apontam pra itens agora mortos.

| Melhoria no Plugin | Equivalente no Yabadoo | Estado |
|---|---|---|
| Roadmap no bom-dia/boa-noite | "Objetivo do mês" no Yabadoo Business | ✝ morto (4 lentes) |
| Pílula de conhecimento | Proatividade do Yabadoo (scheduler) | vivo — backlog |
| Chat guiado por task | "Modo Foco" do Yabadoo | ✝ virou ledger, e o comando saiu |
| Prep de reunião | Feature do Yabadoo Business | **vivo — virou C.1** |
| Auto-avaliação com self-edit | Learning Machine do Yabadoo | vivo — backlog |
| Stand-up no ClickUp | Histórico de rituais auditável | ✝ morto (Slack) |
| Evolution API (WhatsApp auto) | Multi-canal nativo | ✝ feito fora (plugin-whatsapp) |

---

## O que o roadmap ensinou sobre roadmap

Ele tinha um campo `Status: a fazer` por item e uma seção "Como usar este roadmap" mandando
atualizar o status ao implementar. **Nenhum item marcado "a fazer" foi atualizado em 3 meses** —
os que foram entregues ganharam linha no "Estado atual" no topo, não no próprio item. O status
morreu por ficar longe do trabalho.

É por isso que o substituto (`_tasks-plugin-2026-07.md`) tem `Próximo passo` no cabeçalho e
`Histórico de chats` no rodapé: o ritual de atualizar está no `/inc`, que abre o arquivo toda vez
que o trabalho começa — não depende de alguém lembrar.
