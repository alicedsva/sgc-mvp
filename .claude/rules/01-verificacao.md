---

## Regra de verificação — obrigatória antes de qualquer implementação

Antes de implementar qualquer componente, tela, hook ou lógica:

### 1. Verificar se já existe

Faça uma busca no projeto pelos arquivos relevantes.

Perguntas obrigatórias:

- Já existe um componente que faz isso?

(busque em `src/app/components/`)

- Já existe essa tela ou rota?

(busque em `src/app/pages/` e no router)

- Já existe essa lógica de negócio?

(busque em `src/app/utils/` e `src/app/data/`)

### 2. Retornar o resultado antes de implementar

Se encontrar algo equivalente:

→ Informe o nome do arquivo e onde está

→ Pergunte se deve reutilizar ou se há uma razão para criar novo

Se não encontrar:

→ Informe que não encontrou

→ Só então implemente seguindo os padrões do DS

### 3. Ao criar algo novo

Sempre siga os padrões de componentes já existentes no projeto.

Nunca invente uma estrutura diferente — olhe um componente similar

e replique a estrutura.

Exemplo: criando tabela nova → leia como Table.tsx está feito →

replique a mesma estrutura de container, toolbar, thead, tbody,

paginação.
