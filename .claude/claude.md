---

# SGC — Sistema de Gestão de Carreiras

Protótipo React 18 + TypeScript + Vite 6 + Tailwind CSS v4.
Deploy: sgc-mvp.vercel.app

## Contexto

Plataforma corporativa de mapeamento de habilidades, desenvolvimento 
de carreira e gestão de talentos. Três perfis: Admin/RH (implementado), 
Colaborador (em andamento), Gestor (não iniciado).

## Regra fundamental

ANTES de criar qualquer componente, tela ou lógica nova:
1. Verifique se já existe algo equivalente no projeto
2. Se existir, replique — nunca crie uma segunda versão
3. Se não existir, siga os padrões dos arquivos em `.claude/rules/`

## Stack

- React 18 + TypeScript
- Tailwind CSS v4 (tokens em `src/styles/theme.css`)
- Lucide React v0.487.0 (único ícone permitido)
- Vite 6

## Arquivos-chave

- `src/data/schema.ts` — fonte única de verdade dos TIPOS de cada entidade
  (Carreira, Jornada, Cargo, Colaborador, Avaliação, Habilidade, Nível etc.).
  Campo novo entra aqui primeiro, antes de qualquer tela — ver
  `rules/06-integridade-de-dados.md`
- `docs/DATA_MODEL.md` — versão legível (sem jargão de código) do mesmo modelo,
  com explicação de cada campo e relação entre entidades
- `src/styles/theme.css` — tokens de cor da marca
- `src/app/components/ui/` — componentes compartilhados
- `src/app/components/templates/` — templates reutilizáveis
- `src/app/data/mockData.ts` — dados (tipados por `src/data/schema.ts`) e função getCorFromPeso()
- `src/app/utils/cobertura.ts` — cálculo de cobertura de habilidades
- `src/app/routes.ts` — todas as rotas do sistema

## Templates disponíveis

Antes de criar qualquer página ou componente novo, verifique se um template já resolve:

- `ListingPage.tsx` — páginas de listagem com busca, filtros e tabela
- `FormDrawer.tsx` — drawer lateral com formulário e ações
- `SelectionDrawer.tsx` — drawer de seleção com busca e lista
- `ConfirmationModal.tsx` — modal de confirmação (danger/warning/info)
- `HabilidadesSelectionModal.tsx` — modal de seleção de habilidades por competência
- `Table.tsx` — tabela com paginação integrada (nunca duplicar lógica de paginação)
- `EmptyState.tsx` — estado vazio padronizado (nunca escrever inline)

## O que nunca fazer

- Nunca usar hex fixo para cores da marca — sempre `var(--brand-X)`
- Nunca usar outras bibliotecas de ícones além de lucide-react
- Nunca criar menu de contexto (MoreVertical) em tabelas
- Nunca usar breadcrumb — sempre botão de voltar com label
- Nunca usar `select` nativo — sempre Radix Select
- Nunca criar badge para fins decorativos
- Nunca duplicar lógica que já existe em outro componente
- Nunca chamar o projeto de "SGC - Minha Jornada" — apenas "SGC" 
  ou "Sistema de Gestão de Carreiras"
- Nunca usar `Breadcrumb.tsx` — existe no projeto mas não é padrão do sistema;
  navegação sempre por botão de voltar com ArrowLeft (ver rules/03-navegacao.md)
- Nunca criar array de dados hardcoded para uma entidade que já existe ou
  deveria existir em `mockData.ts`, nem armazenar contador que poderia ser
  calculado dinamicamente — ver `rules/06-integridade-de-dados.md`
- Nunca redefinir inline (interface local, `useState` com literais) uma
  estrutura que já existe em `src/data/schema.ts` — campo novo entra primeiro
  em `schema.ts` + `docs/DATA_MODEL.md`, só depois em qualquer tela
- Nunca adicionar rota sem registrar em `src/app/routes.ts`

## Usuários de referência

- **Ana Silva** (id=`1`) — usuária padrão Admin/Colaborador; usar para fluxos Admin/RH
- **João Silva** (id=`10`) — exclusivo para `/testes/*`; tem dados enriquecidos (radar, benchmark, screening)
- Não misturar os dois entre contextos

---
