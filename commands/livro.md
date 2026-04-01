---
description: Processamento de capitulo de livro. Ajudo o Henrique a fixar o que leu com resumo + insights pessoais.
---

Processamento de capitulo de livro. Ajudo o Henrique a fixar o que leu com resumo + insights pessoais.

## Fluxo

### 1. Identificar o capitulo

Pergunte qual capitulo o Henrique terminou de ler (ou interprete do contexto).

### 2. Carregar contexto

Leia o arquivo do livro correspondente:
- Verificar `conhecimento/livros/` no cerebro
- Se o livro nao tem arquivo ainda, criar seguindo o template padrao

### 3. Resumo do capitulo

Se o capitulo ainda nao tem resumo completo:
- Buscar conteudo do capitulo na web (PDF, resenhas, resumos)
- Gerar resumo estruturado com: tese, conceitos-chave, resumo em 2-3 frases
- Salvar no arquivo do livro

### 4. Coletar insights do Henrique

Apresente o resumo e pergunte:
- "O que te marcou nesse capitulo?"
- "Alguma conexao com o que voce esta vivendo?"

Se o Henrique gravar audio ou escrever texto livre, interpretar e estruturar.

### 5. Cruzar com o cerebro

Busque conexoes automaticas:
- Ler `_mapa.md` e identificar projetos/areas relacionados
- Sugerir 2-3 conexoes concretas (ex: "Isso conecta com sua decisao X no projeto Y")
- Incluir conexoes que o Henrique confirmar

### 6. Salvar no arquivo do livro

Atualizar a secao "Insights pessoais" do capitulo com:
- Insights do Henrique (formatados como bullets)
- Conexoes com cerebro (com links para arquivos relacionados)
- Gaps ou perguntas que surgiram

### 7. Recapitulacao rapida

Ao final, oferecer recapitulacao dos capitulos anteriores se o Henrique quiser revisar antes de continuar a leitura.

## Regras

- NAO spoilar capitulos futuros
- Resumos devem ser concisos (nao reescrever o livro)
- Insights pessoais sao do Henrique, nao inventar
- Cruzamento com cerebro e sugestao — Henrique aprova o que fica
- Se o Henrique so quer recapitular sem adicionar insights, tudo bem
