# Especificação de telas — Admin/RH

## Criar / Editar Jornada

Estrutura geral:
- Página com scroll contínuo — não é wizard
- Todos os blocos renderizados simultaneamente
- Rodapé condicional com botões de ação

Modelo de evolução — radio cards:
- Contribuidor Individual (default)
- Gestão
Dois cards lado a lado, seleção por radio button visual.

Seleção de cargos:
- Grid 2 colunas
- Drag-and-drop via react-dnd para reordenar
- Nó de progressão visual:
  Primeiro cargo: bg-[var(--brand-600)] border-[var(--brand-600)] + badge "Início"
  Último cargo:   border-[var(--brand-600)] + badge "Topo"
  Intermediário:  border-gray-300

Rodapé condicional:
- Aparece via max-h transition
- Criar: aparece ao selecionar ≥ 1 cargo
- Editar: aparece ao alterar qualquer campo
- Editar preserva IDs de cargos existentes —
  configuração da matriz não é perdida ao editar

## Matriz de Habilidades

Toolbar:
- Campo de busca: w-56
- Toggle "Habilidades incompletas":
  Ativo:  bg-[var(--brand-50)] border-[var(--brand-200)] text-[var(--brand-700)]
  Inativo: bg-white border-gray-300 text-gray-700
- Botão "Gerenciar habilidades": primário
  (bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)])
  Ícone: Settings2 w-4 h-4
  Decisão: ação principal isolada em toolbar pode ser primária mesmo com
  filtros/toggles ao lado — filtros não são ações de mesma hierarquia.

Tabela da matriz:
- Coluna fixa de habilidades: sticky left-0 z-10 w-[220px]
- Ícone MoreVertical na coluna fixa:
  opacity-0 por padrão → opacity-100 no hover da linha
- Linha de competência:
  bg-[#F3F4F6] text-xs font-medium text-gray-500 uppercase tracking-wider
- Alternância de linhas:
  Par: bg-white
  Ímpar: bg-[#F9FAFB]

Rodapé da matriz:
- Aparece apenas com alterações não salvas
- Botão "Salvar alterações": bg-[var(--brand-600)] text-white, alinhado à direita

HabilidadesSelectionModal:
- Componente: src/app/components/templates/HabilidadesSelectionModal.tsx
- Dimensões: max-w-3xl × 80vh, max-height 720px
- Layout: duas colunas
  Coluna esquerda (w-56): lista de competências navegável com contador X/Y
    — X = selecionadas na competência, Y = total disponível com filtro ativo
    — item ativo: bg-[var(--brand-50)] text-[var(--brand-700)]
      border-l-2 border-[var(--brand-600)] font-medium
    — item inativo: text-gray-700 hover:bg-gray-50 border-l-2 border-transparent
  Coluna direita (flex-1): habilidades da competência selecionada
- Linha de busca (entre header e colunas):
  campo de busca (flex-1) + segmented control Todas/Técnica/Comportamental
  O segmented control filtra as competências visíveis na coluna esquerda
- Modo navegação (busca vazia):
  header da competência + botão link "Selecionar todas" / "Limpar seleção"
  sem badges de tipo nos itens — apenas checkbox + nome
- Modo busca (campo preenchido):
  resultados globais agrupados por competência
  sem botão "Selecionar todas"
  coluna esquerda mostra apenas competências com resultado
  clicar numa competência sai do modo busca
- Feedback visual de diff:
  adicionando: bg-blue-50 / removendo: bg-red-50 + line-through
- Footer:
  esquerda: "X habilidades selecionadas" (total global)
  direita: Cancelar + botão de confirmação
  botão desabilitado (opacity-50) quando sem alterações pendentes
  label: "Adicionar habilidades" quando só adicionando;
         "Salvar" quando há remoções (com ou sem adições)
- Cargos são adicionados via "Editar jornada" — nunca pela matriz

ColaboradoresSelectionModal:
- Componente: src/app/components/templates/ColaboradoresSelectionModal.tsx
- Dimensões: max-w-3xl × 80vh, max-height 720px
- Layout: duas colunas (mesmo padrão do HabilidadesSelectionModal)
  Coluna esquerda (w-56): cargos da jornada com contador total
  Coluna direita (flex-1): colaboradores do cargo selecionado
- Linha de busca: campo full-width, filtra colaboradores pelo nome
  (busca local ao cargo selecionado — não global)
- Mostra todos os colaboradores do cargo (vinculados + disponíveis):
  Vinculados: checkbox marcado, desabilitado, opacity-60, cursor-not-allowed
  Disponíveis: checkbox interativo
- "Selecionar todos" / "Limpar seleção" como botão link
  atua apenas sobre os disponíveis visíveis (respeitando busca)
- Footer:
  esquerda: "X colaboradores selecionados" (vinculados + novos)
  direita: Cancelar + "Adicionar colaboradores"
  botão desabilitado quando nenhum novo selecionado
- onConfirm retorna apenas IDs novos (não vinculados)
  handler existente (vincularColaborador) não precisa de alteração
- Empty state: apenas quando o cargo não tem nenhum colaborador no sistema

Aba Colaboradores (JornadaDetalhePage):
- Tabela com paginação: 10 itens/página, componente Table.tsx + PaginationConfig
- Reset para página 1 ao vincular ou desvincular colaborador
- Botão "Adicionar colaboradores": primário + ícone UserPlus w-4 h-4

## Dashboard

Exportar:
- Relatórios são gerados via botão "Exportar" no Dashboard
- Não existe página de relatórios — RelatoriosPage foi deletada

Seções na ordem correta:
1. Cobertura por competência
2. Ranking de GAPs mais frequentes
3. Média de habilidades por gerência
4. Avaliações ativas
5. Colaboradores com GAPs críticos

## Perfis

Filtros disponíveis:
- Pills: Ativos / Desativados / Todos
- Dropdown: Gerência
- Dropdown: Cargo

Ações por linha:
- RefreshCw: sincronização individual
- Sem menu de contexto

Botão fixo: "Sincronizar Todos"

Perfil individual — abas:
Visão Geral · Habilidades · Carreira · Avaliações

## Habilidades

Três abas: Competências · Níveis de Habilidades · Habilidades

Tela de detalhe da habilidade:
- Acessada pelo ícone Eye (somente leitura)
- Header: Nome + badge Status + badge Tipo + Competência (mesma linha)
- Descrição abaixo do header
- Critérios por nível abaixo da descrição

## Avaliações

Tipo fixado como Autoavaliação (único tipo no MVP).

Ícone Eye na tabela abre detalhe por status:
- Rascunho: prévia como o colaborador vai ver
  (habilidades + escala 1–5 não interativa)
- Ativa / Encerrada: detalhe completo com progresso,
  lista de participantes e notas por colaborador (drawer lateral)

Wizard de criação — 4 etapas:
1. Identificação
2. Escopo
3. Configuração
4. Revisão
