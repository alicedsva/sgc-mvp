---

## Padrões de navegação

### Botão de voltar

Sempre usar este padrão exato:

tsx

```

  
  Nome da página pai

```

- Ícone: ArrowLeft (não ChevronLeft)

- Gap: gap-1.5

- Margin bottom: mb-6

- Nunca usar apenas "←" sem label

- Nunca usar breadcrumb com ">"

### Labels do botão de voltar por contexto

| Contexto                     | Label                         |
|------------------------------|-------------------------------|
| Dentro de uma carreira       | "Carreiras"                   |
| Dentro de uma jornada        | Nome da carreira (dinâmico)   |
| Respondendo avaliação        | "Minhas Avaliações"           |
| Resultado de avaliação       | "Minhas Avaliações"           |

### Comportamento de linhas em tabela

Linha clicável → destino é área de trabalho editável (ex: Carreiras)

Linha não clicável → destino é somente leitura; navegação pelo ícone Eye

### Sidebar — item ativo

tsx

```

  
  {label}

```

Os três sinais são obrigatórios simultaneamente:
- container: `bg-[var(--brand-50)]`
- ícone: `text-[var(--brand-600)]`
- texto: `text-[var(--brand-700)] font-medium`

Nunca destaque apenas pela cor do ícone.

### Sidebar — item inativo

Classe explícita obrigatória: `text-gray-700 hover:bg-gray-50`
Nunca deixar herdar cor padrão do navegador.

## Tabs de conteúdo

Ativa: `border-b-2 border-[var(--brand-600)] text-[var(--brand-600)]`
Inativa: `border-b-2 border-transparent text-gray-600 hover:text-gray-900`

## Paginação

Sempre usar o componente Table.tsx com PaginationConfig.
Nunca copiar lógica de paginação inline.
Ao aplicar filtro ou busca: resetar para página 1.

## Hierarquia de navegação

### Admin
```
Dashboard
Perfis → Perfil individual
         tabs: Visão Geral · Habilidades · Carreira · Avaliações
Habilidades
         tabs: Competências · Níveis de Habilidades · Habilidades
Carreiras → Carreira → Jornada → Matriz
Avaliações → Detalhe da avaliação
```

### Colaborador
```
Meu Perfil
Minhas Avaliações → Responder avaliação
                 → Resultado da avaliação
Minha Carreira
         tabs: Minha Jornada · Próximo passo
```

Regra importante: navegação do Colaborador usa rotas separadas no React Router —
nunca `viewMode` condicional na mesma rota.

## Mobile

Layout mobile existe no código (sidebar via `translate-x`) mas não foi validado.
Classes `md:` existem como base.
Não assumir que mobile funciona corretamente — não testar nem documentar comportamentos mobile sem validação real.
