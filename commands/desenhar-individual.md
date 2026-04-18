---
description: Mapeia uma pessoa individual de cliente (ex: Edith do Beco) em 4 rodadas de destilacao — triangulacao factual de fontes, sintese com proveniencia, classificacao A/B/C com destino, MD canonico gabarito template-friendly. Replica o metodo aplicado a Edith em 18/04/2026. Execute este fluxo EXATAMENTE, sem pular etapas.
argument-hint: [cliente] [pessoa]
---

Orquestra mapeamento profundo de uma pessoa individual de cliente Pique. Gera dossie-pessoa em formato de schema v2 com proveniencia rastreavel por campo (cada afirmacao etiquetada com fonte + classe + destino). Replica o fluxo que produziu `pique-consultoria-hub/clientes/beco/individuais/edith-consolidado-v2.md` em 18/04/2026 (sessao Henrique + Marcella). Execute este fluxo EXATAMENTE, sem pular etapas.

## Ferramentas

- **Descoberta de fontes**: delegar aos Explore agents (Sonnet, paralelos)
- **Leitura direta de fontes**: Read (apos descoberta + confirmacao do usuario)
- **Escrita do gabarito**: Write (so na Fase 5)
- **Modelo desta skill**: Opus (orquestracao + julgamento etico de classes/destinos). Agents delegados usam Sonnet.

> **Esta skill NAO toca ClickUp.** Nao precisa do MCP `pique-clickup`. So sistema de arquivos.

## Configuracao e fontes de regras

- **Path final do gabarito**: `pique-consultoria-hub/clientes/<cliente>/individuais/<pessoa>-consolidado-v2.md`
- **Path de backup (se sobrescrevendo)**: `pique-consultoria-hub/clientes/<cliente>/individuais/.backups/<pessoa>-consolidado-v2-YYYY-MM-DD.md`
- **Path de leitura conjunta cliente (Fase 2.5)**: `pique/clientes/<cliente>/sessoes/YYYY-MM-DD-HHMM-reuniao-<pessoa>-leitura-rodada1.md`
- **Path de pendencias-acao**: `pique/clientes/<cliente>/_pendencias-individuais.md` (criar se nao existir)
- **Gabarito-referencia (caso real)**: `pique-consultoria-hub/clientes/beco/individuais/edith-consolidado-v2.md` — leia antes da Fase 5 pra confirmar formato
- **Plano metodologico que originou a skill**: `c:\Users\Henrique Carvalho\.claude\plans\vamos-fazer-o-doc-glimmering-wozniak.md` (rascunho — nao referenciar como fonte canonica)

**Onde fontes da pessoa tipicamente vivem (zonas de busca da Fase 1):**
- `MEU-CEREBRO/pique/clientes/<cliente>/` — diagnostico, sessoes, dossies, solucoes
- `MEU-CEREBRO/pique/sessoes/` — sessoes da Pique cruzando o cliente
- `CEREBRO-BETO/projetos/clientes-ativos/<cliente>/docs/` — material de consultor externo (Beto Carvalho)
- `pique-consultoria-hub/clientes/<cliente>/individuais/` — consolidados v1 anteriores (se existirem)
- `BRAINSTORM-TEMPLATE/docs/sessoes/` e outros repos paralelos em `PROGRAMAS/` — material orfao (memoria `feedback_clickup_space_por_space` referencia caso similar)

---

## Regras duras (checklist aplicado em cada fase)

### Default consultivo
- [ ] NAO escrever gabarito sem aprovacao explicita (so na Fase 5, e ainda assim com checkpoint)
- [ ] Max 3-5 perguntas cirurgicas por turno
- [ ] Pre-preencher respostas com contexto real (memoria `feedback_respostas_preenchidas`)
- [ ] Discutir antes de gerar entregaveis densos (memoria `feedback_discutir_antes_gerar`)

### Proveniencia rastreavel (regra dura — fundamento do schema v2)
- [ ] **Toda afirmacao** sobre a pessoa tem `fontes` apontando pra `fontes_registro`. Sem excecao.
- [ ] Classe A (humano preenche, IA nao sobrescreve) e a UNICA classe sem `fontes` obrigatoria
- [ ] Trecho literal curto em Classe B — direto, sem parafrasear pra suavizar
- [ ] Camada comportamental bruta (testemunho-bruto) entra **etiquetada, nao censurada**. Termo carregado do cliente (ex: Marcella usou "cancer" pra Mauricio em F2 SWOT Beco) preserva-se literal com badge claro

### Descoberta antes de agir (auditar paths reais)
- [ ] **Validar paths antes de citar como fonte.** Se o usuario passar paths, fazer Glob/Read pra confirmar existencia
- [ ] Se algum path passado nao existe, buscar arquivo similar e propor antes de seguir (memoria do caso Edith: F3 do plano original apontava `BRAINSTORM-TEMPLATE/...` mas arquivo real estava em `pique/clientes/beco/sessoes/...`)
- [ ] Detectar **duplicatas entre fontes** (ex: Beto Carvalho replica SWOT Marcella) e marcar `aviso: duplicata-de-Fx` no `fontes_registro` — nao usar como fonte independente

### Estrutura template-friendly do gabarito (REGRA RIGIDA)
- [ ] Cada familia (Identidade, Hierarquia, Forcas, Fraquezas etc) e uma **lista** com items
- [ ] Items tem `id` slug livre + campos estruturais (`titulo`, `classe`, `fontes`, `trecho`, `destino`, `tipo_sintese`, etc)
- [ ] **NAO criar campos top-level personalizados** tipo `### \`fraqueza_propoe_fora_prioridade\``. Erro do gabarito Edith-v1 que essa skill corrige na origem
- [ ] Esqueleto das 14 familias e fixo. Items dentro variam por pessoa

### Checkpoints obrigatorios (NUNCA pular)
- [ ] Pausar apos Fase 1 (Descoberta) — usuario confirma fontes + adiciona/remove
- [ ] Pausar apos Fase 2 (Rodada 1 triangulacao) — pergunta CRITICA sobre leitura conjunta com cliente
- [ ] Pausar apos Fase 3 (Rodada 2 sintese Classe C) — usuario valida campos C em massa ou individual
- [ ] Pausar apos Fase 4 (Rodada 3 classificacao) — usuario corrige classes/destinos errados
- [ ] Pausar apos Fase 5 (gabarito gerado) — usuario le e ajusta antes de persistir

### Camada brutal etiquetada (etica)
- [ ] Falas literais de terceiros sobre a pessoa (especialmente CEO sobre subordinada) entram com fonte clara + data + autor
- [ ] Por padrao, vao pra `destino: tbd-{questao}` (default conservador = `interno`)
- [ ] Nao parafrasear pra suavizar. Nao censurar. Etiqueta resolve o problema etico

### Pos-criacao
- [ ] Backup do consolidado anterior se sobrescrevendo
- [ ] Atualizar `_pendencias-individuais.md` com acoes-pendencia
- [ ] Reportar distribuicao final (A/B/C, destinos) + path com link clicavel
- [ ] Auto-avaliacao da Fase 8 sempre roda

---

## Plan mode awareness

Se o usuario ja esta em **plan mode** quando acionar a skill:
- Fases 1-4 (descoberta + 3 primeiras rodadas) podem rodar — sao analise + leituras
- Fase 5 (escrever gabarito) NAO executa ate `ExitPlanMode` ser chamado e o plan ser aprovado
- Em vez disso, Fase 5 escreve o gabarito-rascunho no plan file (via Edit do plan file)
- Apos aprovacao do plan, retomar direto na Fase 5 escrevendo no path real

---

## Fase 0: Input

Antes de comecar:

1. **Qual cliente?** (slug, ex: `beco`). Validar que existe `pique/clientes/<cliente>/`
2. **Qual pessoa?** (slug, ex: `edith`). Sera usado no nome do arquivo final
3. **Paths das fontes (opcional)** — se o usuario ja sabe, aceita lista. Senao, descobrir na Fase 1
4. **Tem leitura conjunta com cliente prevista?** Pre-pergunta — se sim, planeja janela apos Fase 2

Se faltar `cliente` ou `pessoa`, perguntar via `AskUserQuestion` (max 2 tentativas).

**Verificar destino:**
- Se `pique-consultoria-hub/clientes/<cliente>/individuais/<pessoa>-consolidado-v2.md` ja existe:
  - Perguntar: refazer do zero / atualizar campos especificos / cancelar
  - Se "refazer do zero": confirmar backup automatico em `.backups/`

---

## Fase 1: Descoberta de fontes (PARA E ESPERA)

**Objetivo:** descobrir TODAS as fontes que mencionam a pessoa, ranquear por densidade, eliminar duplicatas.

### Lancar 2-3 Explore agents em paralelo (Sonnet)

**Agent 1 — Cerebro Pique e cerebro pessoal**
> Busca nome `<pessoa>` em todos os `.md` de:
> - `MEU-CEREBRO/pique/clientes/<cliente>/`
> - `MEU-CEREBRO/pique/sessoes/`
> - `pique-consultoria-hub/clientes/<cliente>/individuais/`
> Reporta paths absolutos + N mencoes por arquivo + estimativa de natureza (sessao, dossie, consolidado, processo etc).

**Agent 2 — CEREBRO-BETO e repos paralelos**
> Busca nome `<pessoa>` em todos os `.md` de:
> - `CEREBRO-BETO/projetos/clientes-ativos/<cliente>/`
> - `BRAINSTORM-TEMPLATE/docs/sessoes/` (se existir)
> - Outros repos em `C:/Users/Henrique Carvalho/Documents/PROGRAMAS/` que tenham docs do cliente
> Reporta paths absolutos + N mencoes + natureza estimada + autor (Beto/Pique/cliente).

**Agent 3 — Detectar duplicatas e dependencias entre fontes (so se Agent 1+2 retornam >5 fontes)**
> Olha os top-N arquivos retornados por Agent 1 e 2. Identifica:
> - Arquivos que sao replica/conversao de outros (ex: `.xlsx` convertido por markitdown contem o mesmo SWOT que o `.docx` original)
> - Sessoes que se referenciam mutuamente
> Reporta pares `dup-de` ou `referencia` + observacoes.

### Consolidar e atribuir IDs estaveis

Apos agents retornarem, atribuir IDs `F1`, `F2`, `F3` ... `Fn` aos arquivos relevantes. Ordem de IDs: do mais rico/canonico pro mais perifico.

**Construir `fontes_registro` draft:**

```yaml
- id: F1
  tipo: <consolidado-pique | swot-cliente-autoral | sessao-planejamento-pique | sessao-coaching-externo | sessao-pique-cruzando | doc-do-cliente>
  titulo: "<titulo do arquivo ou descricao curta>"
  data: <YYYY-MM ou YYYY-MM-DD>
  autor: "<Pique | Marcella | Beto Carvalho | etc>"
  url_local: "<path absoluto>"
  natureza: "<descricao 1 linha>"
  grau_interpretacao: <baixo | medio | alto>
  aviso: "<se for duplicata, marcar 'duplicata-de-Fx'; senao omitir>"
```

### Apresentar ao usuario e PARAR

Formato:
```
## Descoberta de fontes — <pessoa> (<cliente>)

### Fontes encontradas (N total)

| ID | Path | Densidade (mencoes) | Natureza | Aviso |
|---|---|---|---|---|
| F1 | <path> | 47 | Consolidado Pique 34 docs | — |
| F2 | <path> | 12 | SWOT autoral Marcella | — |
| F3 | <path> | 8 | Sessao planejamento Pique | — |
| F4 | <path> | 6 | Programa Beto (xlsx convertido) | duplicata-de-F2 na coluna esquerda |
| F5 | <path> | 3 | Sessao Pique cruzando cliente | — |

### Perguntas
1. Concorda com a lista? Quer adicionar/remover alguma fonte?
2. Algum aviso de duplicata pra revisar?
3. Confirma os IDs estaveis (F1-Fn)?
```

**PARE e espere resposta.**

---

## Fase 2: Rodada 1 — Triangulacao factual (PARA E ESPERA)

**Regra de ouro:** colar o que cada fonte diz, **SEM interpretar**. Triangular por campo lado-a-lado.

### Estrutura do output

1. **Catalogo provisorio das fontes** (recap da Fase 1, com IDs confirmados)
2. **Mapa de quem fala o que** (1 linha por fonte: "F2 = Marcella falando sobre <pessoa>")
3. **Triangulacao por familia** — usar o esqueleto das 14 familias do Apendice B. Para cada familia, tabela:
   - Coluna 1: campo (subitem da familia)
   - Colunas 2-N: 1 coluna por fonte. Conteudo = literal ou parafrase muito curta com `(F2)` ou `(F4)` no fim
4. **Onde fontes divergem** — bullets curtos ("F2 marca como 'intuicao minha'; F3 suaviza pra 'possivel'")
5. **Onde se complementam** — bullets ("F4 e a UNICA fonte com autorrelato; F1 e a UNICA com citacoes literais de entrevista")
6. **4-6 pontos que chamaram atencao** — flagrar SEM interpretar (ex: "Felipe cita ela como exemplo na sessao Beto; unica corroboracao independente do pattern X")

### Checkpoint critico — leitura conjunta com cliente

Antes de seguir pra Rodada 2, perguntar:
```
A Rodada 1 esta pronta. Antes da Rodada 2 (sintese com proveniencia), pergunto:

**Voce vai conseguir mostrar essa triangulacao pra <pessoa-cliente> agora**
(o cliente, nao a pessoa mapeada — ex: Marcella enquanto mapeamos Edith)?

- Sim → eu paro e espero. Cole aqui o que ele/ela falar reagindo. Vou criar fonte F<N+1> = "leitura conjunta cliente DD/MM" e incorporar na Rodada 2
- Nao → registro `pendencia: leitura-conjunta-cliente` no gabarito final e sigo. Voce pode rodar essa parte depois e me chamar pra atualizar
```

**Se sim — escutar reacao:**
- Capturar falas literais (especialmente as carregadas — termos repetidos do cliente, frases-chave)
- Identificar correcoes pontuais (cliente refuta uma das fontes anteriores)
- Identificar novos padroes que so emergem ao vivo (ex: "tudo que ela quer ser, e o trem que ela morre" — emergiu na sessao Edith 18/04)
- Criar nova fonte F<N+1> com tipo `leitura-conjunta-cliente`, data hoje, autor = cliente
- Anotar `status: pendente-arquivar` se a transcricao ainda nao foi salva
- Pre-anotar bloco "Reacoes leitura conjunta — DD/MM/YYYY" pra incluir na Rodada 2

**Se nao — registrar e seguir** (com pendencia clara no gabarito final).

**PARE e espere resposta antes de seguir pra Rodada 2.**

---

## Fase 3: Rodada 2 — Sintese com proveniencia (PARA E ESPERA)

**Objetivo:** propor campos **Classe C** (sintese cruzando 2+ fontes) com tipologia formal.

### Antes de propor, validar/ajustar a taxonomia (so se necessario)

Apresentar a **taxonomia fixa de 10 tipos** (Apendice A). Pergunta: "Algum tipo novo precisa entrar pra esse caso especifico?" Se sim, adicionar com criterio claro. Se nao, seguir.

### Propor N campos Classe C

Para cada campo C, formato:

```
### Campo: <nome_descritivo_curto>

**Conteudo proposto:**
[Sintese de 2-5 frases cruzando o que as fontes dizem]

**Fontes:** [F1, F2, F5]
**Tipo de sintese:** <um da taxonomia>
**Confianca:** <alta | media | baixa> + 1 linha justificando
**Carga etica:** <baixa | alta | maxima> (so anotar se nao for baixa)
**Justificativa da sintese:** 1-3 linhas explicando como o cruzamento sustenta a afirmacao

**Decisao:** [ ] validar  [ ] editar  [ ] descartar
```

### Mapa visual no topo

Antes dos blocos detalhados, fazer tabela-resumo:

| # | Campo | tipo_sintese | Fontes | Confianca | Carga etica |
|---|---|---|---|---|---|

### Checkpoint

```
Os N campos Classe C estao propostos. Voce valida em massa ou prefere percorrer um por um?

Pode ser "tudo OK menos X e Y". Sinaliza so o que precisa edit/descartar.
```

**PARE e espere resposta.**

Apos resposta, incorporar edicoes/descartes e seguir.

---

## Fase 4: Rodada 3 — Classificacao campo a campo (PARA E ESPERA)

**Objetivo:** percorrer as 14 familias e classificar TODOS os items (Classe A ancorado humano + Classe B extraido de 1 fonte + Classe C ja produzida na Rodada 2).

### Por familia, produzir tabela enxuta

```
## Familia <N>. <Nome>

| campo | classe | fontes | trecho | tipo_sintese | destino |
|---|---|---|---|---|---|
| <id>  | A/B/C  | [F1]   | "..."  | <ou —>       | hub-publico/interno/tbd-q1 |
```

**Regras de classificacao:**

- **Classe A (Ancorado)**: humano preenche, IA nao sobrescreve. Usar quando o dado nao aparece em nenhuma fonte mas e tipico do schema (ex: `tempo_casa` quando nenhuma fonte traz)
- **Classe B (Extraido)**: 1 fonte unica. SEMPRE com `trecho` literal curto (max 25 palavras) extraido da fonte
- **Classe C (Sintetizado)**: 2+ fontes. SEMPRE com `tipo_sintese` da taxonomia + `confianca`

**Regras de destino:**

- `hub-publico` — operacional neutro, citacao da propria pessoa, dado profissional. Renderiza no hub
- `interno` — diagnostico Pique sintetico, problema fiscal, dado financeiro sensivel
- `tbd-{questao}` — pendente de decisao (default = `tbd-q1` quando questao = "cliente acessa o hub?"). Default conservador = `interno` ate decisao

**Carga etica → destino default:**
- Carga maxima (testemunho bruto carregado) → `tbd-q1`
- Carga alta (`padrao_projecao`, `risco_relacional`, etc) → `tbd-q1`
- Carga baixa → `hub-publico` (a menos que seja sintese diagnostica Pique = `interno`)

### Apresentar fechamento da Rodada

```
## Distribuicao final

- Total: N campos
- Por classe: A=X (Y%) | B=X (Y%) | C=X (Y%)
- Por destino: hub-publico=X | interno=X | tbd-q1=X

## Algum campo classificou errado?

Pode sinalizar B-deveria-ser-C, destino X, etc. Aceito lista curta.
```

**PARE e espere resposta.**

---

## Fase 5: Rodada 4 — Gabarito MD canonico template-friendly

**Objetivo:** materializar o gabarito final em `pique-consultoria-hub/clientes/<cliente>/individuais/<pessoa>-consolidado-v2.md` no formato de listas (NAO campos top-level).

### Antes de escrever — verificar plan mode

Se em plan mode → escrever rascunho no plan file (via Edit do plan ja existente). Sair do plan mode dispara escrita real.

### Antes de escrever — backup se necessario

Se `<pessoa>-consolidado-v2.md` ja existe:
- Mover pra `.backups/<pessoa>-consolidado-v2-YYYY-MM-DD.md`
- Anotar no historico do gabarito novo: "Supersede backup `<path>`"

### Estrutura obrigatoria do gabarito

```markdown
# <Nome Pessoa> — Consolidado v2 (gabarito schema v2)

**Criado:** YYYY-MM-DD
**Status:** gabarito-rodada-4 (pendente: Q1 destino dos tbd-q1)
**Schema:** v2 (proveniencia por campo)
**Cliente:** <cliente>
**Mapeado por:** Pique
**Supersede:** <path consolidado v1 se existir, senao "primeira versao">

---

## Sobre esse documento

[Paragrafo curto sobre o metodo (4 rodadas) + decisao Q1 pendente + default conservador. Reusar texto do gabarito-referencia Edith.]

---

## Legenda

[Tabelas de Classes (A/B/C), Destinos (hub-publico/interno/tbd-q1), Tipos de sintese (10 tipos da taxonomia)]

---

## fontes_registro

```yaml
- id: F1
  tipo: <...>
  titulo: <...>
  data: <...>
  autor: <...>
  url_local: <...>
  natureza: <...>
  grau_interpretacao: <...>
  [aviso opcional]
- id: F2
  ...
```

---

## 1. Identidade

identidade:
  - id: nome_completo
    titulo: "<Nome Completo>"
    classe: A
    destino: hub-publico
  - id: idade
    titulo: <NN> anos
    classe: B
    fontes: [F4]
    trecho: "<trecho literal>"
    destino: hub-publico
  - id: cargo_oficial
    titulo: "Sem cargo formal definido — fontes divergem"
    classe: C
    fontes: [F1, F2, F3, F4]
    tipo_sintese: comparativo
    confianca: alta
    destino: hub-publico
    conteudo: |
      F1: "<...>"
      F2: "<...>"
      F3: "<...>"
      F4: "<...>"

## 2. Hierarquia / reporte
[mesma estrutura — items de lista com id slug livre]

## 3. Escopo / responsabilidades
[idem]

## 4. Fluxos de trabalho
[idem — pode ter items grandes com bloco "trecho" multilinhas pra fluxos completos]

## 5. Forcas
[idem]

## 6. Fraquezas
[idem]

## 7. Comportamento / padroes
[idem — onde mora `padrao_projecao` se aplicavel]

## 8. Dores reportadas (autorrelato da pessoa)
[idem]

## 9. Dores observadas (Pique consolidou)
[idem]

## 10. Aspiracoes
[idem]

## 11. Citacoes diretas
[idem — agrupar citacoes da pessoa vs citacoes-sobre-a-pessoa de terceiros]

## 12. Handoffs / canais
[idem — pode ter 2 items compostos: handoffs_tabela + canais_comunicacao]

## 13. Eventos datados (timeline)
[idem]

## 14. Sinteses cruzadas
[Os campos Classe C exclusivos dessa secao + cross-refs pros que aparecem em outras]

---

## Campos descartados (com motivo)

| campo potencial | origem | motivo do descarte |
|---|---|---|
| <nome> | <fonte / hipotese> | <motivo claro> |

---

## Distribuicao final

[Tabela com totais por classe + por destino]

---

## Notas pra renderer (schema v2)

[Tabela de cores de badge: A cinza/invisivel modo apresentacao, B-direto verde, B-observado amarelo, C-triangulado azul, C-sintese roxo. Cross-refs explicitos. Filtros por destino.]

---

## Pendencias-acao

| # | Acao | Origem | Quem | Quando |
|---|---|---|---|---|
| 1 | <...> | <...> | <...> | <...> |

---

## Historico

- YYYY-MM-DD — criado, destilado em 4 rodadas. Supersede <v1 se existir>.
```

### Apresentar pra revisao

```
Gabarito gerado em <path>.

Distribuicao: <recap>

Pode ler e me sinalizar ajustes pontuais. Quando aprovar, sigo pra Fase 6 (persistencia + indexacao).
```

**PARE e espere aprovacao final.**

---

## Fase 6: Persistencia + indexacao

Apos aprovacao final do gabarito:

1. Confirmar que o arquivo esta salvo em `pique-consultoria-hub/clientes/<cliente>/individuais/<pessoa>-consolidado-v2.md`
2. Se tinha v1 (`<pessoa>-contexto-consolidado.md` ou similar), atualizar status pra `superseded por <v2>` no header e mover pra `.archive/` (NAO deletar — convencao Pique)
3. Atualizar `pique/clientes/<cliente>/_pendencias-individuais.md` com as acoes-pendencia geradas (criar arquivo se nao existe; usar template do Apendice C)
4. Se houve leitura conjunta (Fase 2 → F<N+1>) e a transcricao esta marcada `pendente-arquivar`, lembrar usuario:
   ```
   Lembrete: a fonte F<N+1> (leitura conjunta cliente DD/MM) tem `status: pendente-arquivar`. 
   Salve a transcricao em `pique/clientes/<cliente>/sessoes/YYYY-MM-DD-HHMM-reuniao-<cliente>-leitura-rodada1-<pessoa>.md` quando puder, e atualize `url_local` no `fontes_registro` do gabarito.
   ```

---

## Fase 7: Encerramento

```
## <Pessoa> (<Cliente>) — Mapeamento concluido

**Path do gabarito:** <link clicavel>
**Total de campos:** N (A=X, B=Y, C=Z)
**Distribuicao destino:** hub-publico=X | interno=X | tbd-q1=X
**Fontes consolidadas:** N (F1-Fn)
**Pendencias-acao:** M (registradas em `_pendencias-individuais.md`)

**Decisoes pendentes pra desbloquear renderizacao no hub:**
- Q1 (cliente acessa o hub): <pendente | resolvida>
- [outras se houver]

**Sugestao de proximo passo:**
- Mapear proxima pessoa: [se cliente tem outras pessoas-chave nao mapeadas, sugerir]
- Resolver pendencia X
- Validar gabarito com cliente
```

---

## Fase 8: Auto-avaliacao (regra global self-improving)

Avalie a execucao desta rodada:

1. **Descoberta de fontes pegou tudo?** Usuario teve que adicionar fontes nao encontradas? (sinal de zona de busca incompleta — atualizar lista de zonas no Fase 1)
2. **Leitura conjunta com cliente aconteceu?** Gerou correcoes substanciais? (se gerou padrao novo nao previsto, considerar promover pra `tipo_sintese` novo na taxonomia)
3. **Taxonomia das 10 sinteses cobriu?** Algum padrao precisou de tipo improvisado? Anotar pra revisar
4. **14 familias cobriram?** Algum dado importante ficou sem familia? Sugerir 15a ou re-particionar
5. **Classificacao precisou muita revisao manual?** (>30% dos campos editados pelo usuario = sinal de criterio fraco — investigar quais classes ou destinos)
6. **Estrutura template-friendly aderiu?** Gabarito saiu como listas (correto) ou top-level escapou?
7. **Plano de leitura conjunta resolveu carga etica?** Campos `tbd-q1` ficaram em proporcao razoavel ou excessiva?

Se identificar melhorias **CONCRETAS e EVIDENCIADAS**:

```
[AUTO-AVALIACAO]
- [descricao da melhoria com evidencia da execucao]
- [...]

Quer que eu ajuste a skill pra prevenir proxima vez?
```

Se aprovado, **editar este proprio arquivo** (`${CLAUDE_PLUGIN_ROOT}/commands/desenhar-individual.md`) incorporando + anexar em `pique/infra/melhorias-plugin.md`:

```
## YYYY-MM-DD — desenhar-individual <cliente>/<pessoa>
- [melhoria aplicada em linhas X-Y]
```

Se nao identificar nada concreto, nao mostre nada. **NAO melhore por melhorar.**

---

## Apendice A — Taxonomia fixa de `tipo_sintese`

10 tipos validados na sessao Edith 18/04/2026. Adicionar so com evidencia clara de necessidade.

| tipo_sintese | Significado | Quando usar |
|---|---|---|
| `triangulado` | 2+ fontes independentes convergem na mesma afirmacao | Forcas/dores observadas com consenso |
| `espelho-invertido` | Autorrelato (fonte primaria propria) contradiz testemunho de terceiros | Pessoa diz "X" + terceiros dizem "nao X" |
| `comparativo` | Fonte A diz X, fonte B diz Y; sintese expoe o conflito sem resolver | Cargo "oficial" divergente entre fontes |
| `diagnostico` | Conclusao analitica da equipe Pique (consolidacao de varias observacoes) | "Insegura com mudancas" + exemplos |
| `spof` | Single point of failure operacional | Pessoa concentra varias funcoes sem backup |
| `evolucao-temporal` | Leitura mudou entre datas — registra a mudanca como dado | Marcella sobre Karine fev → abr |
| `gap-governanca` | Lacuna formal identificada (alcada, escopo, contrato) | Autonomia ampla sem acordo |
| `tendencia-recente` | Sinal temporal isolado, ainda sem corroboracao | "Lojas externas caindo nos ultimos meses" |
| `testemunho-bruto` | Coletanea literal de fala carregada — destino define renderizacao | Frases brutas do cliente sobre a pessoa |
| `alinhamento` | Aspiracao da pessoa converge com solucao Pique projetada | Aspiracao "gerir por numeros" + Plugin F3 |

---

## Apendice B — 14 familias semanticas (esqueleto fixo do gabarito)

Sao as secoes obrigatorias do MD canonico. Items dentro variam por pessoa, mas a familia sempre existe (mesmo vazia se a pessoa nao tem dado).

| # | Familia | O que contem |
|---|---|---|
| 1 | Identidade | Nome, idade, familia, tempo de casa, cargo oficial/real, datas de entrevista |
| 2 | Hierarquia / reporte | Reporta para, supervisiona, pares, grupos formais |
| 3 | Escopo / responsabilidades | Frentes que toca, autoridade de aprovacao, carga relativa |
| 4 | Fluxos de trabalho | Diagramas/sequencias dos processos que ela opera |
| 5 | Forcas | Forcas declaradas (autorrelato) e observadas (terceiros) |
| 6 | Fraquezas | Fraquezas observadas + autorrelato + falas de terceiros |
| 7 | Comportamento / padroes | Comportamentos especificos + padroes (ex: `padrao_projecao`) |
| 8 | Dores reportadas (autorrelato) | O que ELA reclama / sente |
| 9 | Dores observadas (Pique) | Dores operacionais consolidadas pela Pique |
| 10 | Aspiracoes | O que ela quer fazer / ser |
| 11 | Citacoes diretas | Falas literais (dela e sobre ela) |
| 12 | Handoffs / canais | Com quem se comunica, por onde |
| 13 | Eventos datados | Timeline de episodios + sessoes referenciais |
| 14 | Sinteses cruzadas | Campos Classe C exclusivos (que nao sentam em outra familia) + cross-refs |

---

## Apendice C — Template de campo (item de lista no gabarito)

### Para Classe A

```yaml
- id: <slug_curto>
  titulo: "<descricao curta legivel>"
  classe: A
  destino: <hub-publico | interno | tbd-q1>
  conteudo: "<valor preenchido pelo humano, ou — se ainda em branco>"
```

### Para Classe B

```yaml
- id: <slug_curto>
  titulo: "<descricao curta legivel>"
  classe: B
  fontes: [F1]
  trecho: "<trecho literal curto, max 25 palavras>"
  destino: <hub-publico | interno | tbd-q1>
```

### Para Classe C

```yaml
- id: <slug_curto>
  titulo: "<descricao curta legivel>"
  classe: C
  fontes: [F1, F2, F5]
  tipo_sintese: <um da taxonomia>
  confianca: <alta | media | baixa>
  destino: <hub-publico | interno | tbd-q1>
  carga_etica: <baixa | alta | maxima>  # opcional, so se nao for baixa
  conteudo: |
    <sintese narrativa cruzando as fontes, 2-5 frases>
  cross_refs: [familia.outro_campo, ...]  # opcional
```

---

## Apendice D — Template de `_pendencias-individuais.md`

Caminho: `pique/clientes/<cliente>/_pendencias-individuais.md`

```markdown
# Pendencias-acao individuais — <Cliente>

Cada item liga uma pessoa mapeada a uma acao pendente que desbloqueia o gabarito v2.

| # | Pessoa | Acao | Origem | Quem | Quando |
|---|---|---|---|---|---|
| 1 | <pessoa> | <acao> | <gabarito v2 / leitura conjunta> | <responsavel> | <prazo> |

---

## Decisoes pendentes globais

- **Q1 — Cliente acessa o hub publico?** Status: <pendente | resolvida em DD/MM>
  - Se resolvida: indicar caminho. Se "Sim acessa", revisar todos os `tbd-q1` dos gabaritos individuais.
```
