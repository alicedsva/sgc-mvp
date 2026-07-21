---

# Design System — regras visuais obrigatórias

## Cores

Sempre use tokens CSS para cores da marca:
- `var(--brand-500)` — foco de input, sidebar item ativo
- `var(--brand-600)` — botão primário, ícone ativo, link
- `var(--brand-700)` — hover do botão primário
- `var(--brand-50)` — fundo sutil
- `var(--brand-100)` — borda sutil

Para neutros, use classes Tailwind diretamente (gray-X).
Nunca use hex fixo. Nunca use classes `blue-X` para elementos da marca.

### Neutros — uso semântico
| Token    | Uso                                    |
|----------|----------------------------------------|
| gray-50  | fundo da página, header do thead       |
| gray-100 | pills inativas, badges de status       |
| gray-200 | bordas de cards e tabelas              |
| gray-300 | bordas de inputs                       |
| gray-400 | ícones inativos, placeholder           |
| gray-500 | texto secundário                       |
| gray-600 | texto de filtro inativo                |
| gray-700 | labels de campo                        |
| gray-900 | texto primário, títulos                |

## Tipografia

- Título de página: `text-2xl font-semibold text-gray-900`
- Subtítulo de página: `text-sm text-gray-600`
- Label de campo: `text-xs md:text-sm font-medium text-gray-700`
- Cabeçalho de tabela: `text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider`
- Conteúdo de célula: `text-xs md:text-sm text-gray-900`
- Informação complementar: `text-xs md:text-sm text-gray-500`
- Link: `text-xs md:text-sm font-medium text-[var(--brand-600)]`
- Erro de campo: `text-sm text-red-600`
- `font-bold` reservado apenas para valores numéricos em cards de métricas
- Regra: sempre usar prefixo `md:` quando tamanho muda entre breakpoints

## Espaçamento

Escala Tailwind obrigatória — nunca `style={{ margin: 'Xpx' }}`

- `space-y-6` — entre seções da página
- `space-y-4 md:space-y-5` — entre campos de formulário
- Margin negativa proibida exceto `-mx-4 md:mx-0` nas tabs
- Cards de métrica: `p-5` — nunca `p-6` ou maior
- Cards de conteúdo: `p-4 md:p-5` ou `p-5`

## Ícones

Biblioteca: lucide-react v0.487.0 — exclusiva.

### Tamanhos por contexto
- `w-4 h-4` — badges, texto inline, mensagens de orientação
- `w-5 h-5` — USO PRINCIPAL: cards, botões, toolbar
- `w-6 h-6` — sidebar, ações em tabela
- `w-8 h-8` — estados vazios, headers de seção

### Cores por contexto
- `text-[var(--brand-600)]` — cards de métricas, ativo na sidebar, links
- `text-gray-500` — toolbar, ações secundárias
- `text-gray-400` — decorativos, placeholders
- `text-gray-700` — ações em tabelas
- `text-green-500` — estados vazios positivos, sucesso
- `text-red-500` — erros, alertas críticos
- `text-slate-400` — ícone Info no banner de instrução de formulário

### Regras
- Sempre via `className` — nunca `style={{ width, height }}`
- Em botões: sempre à esquerda do texto, `gap-2`
- Em cards de métricas: sempre à **direita**, `w-5 h-5 flex-shrink-0`, sem wrapper
- Nunca SVG inline não documentado

## Badges

Classe base responsiva para status:
`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full`

Status de registro:
- Ativa: `bg-green-100 text-green-800`
- Desativada: `bg-red-100 text-red-700` — todos os registros, sem exceção
- Rascunho: `bg-yellow-100 text-yellow-800`
- Encerrada / Arquivado: `bg-gray-100 text-gray-700`

Estado do colaborador na avaliação:
- Não iniciada: `bg-orange-100 text-orange-800`
- Em andamento: `bg-blue-100 text-blue-800`
- Concluída: `bg-green-100 text-green-800`
- Expirada: `bg-gray-100 text-gray-700`

Habilidade tipo:
- Técnica: `bg-[var(--brand-100)] text-[var(--brand-800)]`
- Comportamental: `bg-purple-100 text-purple-800`

Variação percentual (Dashboard):
- Positivo: `inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700`
- Negativo: `inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700`

Nível: sempre usar `getCorFromPeso(nivel.peso)` — nunca cor fixa.

### Regras
- Nunca `onClick` em badge
- Verde = positivo/ativo; Vermelho = alerta/erro; Amarelo = atenção/rascunho; Cinza = inativo/neutro

## Botões

Primário:
`inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors`

Secundário (outline brand):
`inline-flex items-center gap-2 px-4 py-2 border border-[var(--brand-600)] text-[var(--brand-600)] text-sm font-medium rounded-lg hover:bg-[var(--brand-50)] transition-colors`

Terciário:
`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors`

Destrutivo:
`inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors`

Cancelar:
`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors`

Ação em tabela (ícone):
`p-1.5 md:p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors`

### Estados
- Desabilitado: `opacity-50 cursor-not-allowed` + atributo `disabled`
- Carregando: `opacity-75 cursor-not-allowed` + `animate-spin` no ícone

### Regras
- Máximo 1 botão primário por contexto visível
- Nunca `font-bold` — sempre `font-medium`
- Nunca `<button>` sem `type` explícito em formulários
- Cancelar nunca em vermelho
- Ações destrutivas sempre com modal de confirmação antes

## Tabelas

### Anatomia completa
```
Container: bg-white rounded-lg border border-gray-200 overflow-hidden   (overflow-hidden obrigatório)
Toolbar:   p-3 md:p-4 border-b border-gray-200
Thead row: bg-gray-50 border-b border-gray-200
           uppercase tracking-wider text-gray-500 — texto NUNCA bold
           Exceção — Dashboard: os theads das tabelas internas
           das seções S2, S3, S4 e S5 não usam bg-gray-50 —
           fundo branco para integrar visualmente com o card.
Tbody:     divide-y divide-gray-200
Paginação: border-t border-gray-200 bg-gray-50
```

Linha clicável: `hover:bg-[rgba(0,159,194,0.06)] cursor-pointer transition-colors`
Linha não clicável: `transition-colors` (sem hover, sem cursor-pointer)

### Regras
- `overflow-hidden` obrigatório no container
- Ações em linha: máximo 3 ícones, sem `MoreVertical`
- Estado vazio com filtro ativo: mostrar botão "Limpar filtros"
- Estado vazio sem dados: sem botão de limpar

## Filtros e Pills

### Classes
```
Container:    flex items-center bg-gray-100 rounded-lg p-1
Item ativo:   px-3 py-2 text-sm font-normal rounded-md bg-white text-gray-900 shadow-sm whitespace-nowrap
Item inativo: px-3 py-2 text-sm font-normal rounded-md text-gray-600 hover:text-gray-900 whitespace-nowrap
Campo busca:  pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm
              focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent
```

### Pills por contexto
- Competências / Habilidades / Carreiras / Jornadas → Todos / Ativas / Desativadas
- Níveis → Todos / Ativos / Desativados / Arquivados
- Perfis → Todos / Ativos / Desativados
- Avaliações Admin → Todas / Rascunho / Ativas / Encerradas
- Avaliações Colaborador → Todos / Não iniciada / Em andamento / Concluída / Expirada

### Regras
- Aba padrão: sempre "Ativos/Ativas" — nunca "Todos"
- Dropdowns: Radix Select — nunca `<select>` nativo
- Filtros com seleção: contador no botão ("Gerência (2)") — nunca tags separadas
- Ao aplicar filtro ou busca: resetar para página 1

## Cards

- Sempre `bg-white border border-gray-200 rounded-lg` — nunca shadow
- Padding padrão: `p-5` — nunca `p-6` ou maior
- Card de identificação: exceção — `rounded-xl` + gradiente slate
- Card de cargo atual: `bg-[var(--brand-50)]` apenas quando cargo atual
- Ícone em card de métrica: sempre à direita, `w-5 h-5 flex-shrink-0`, nunca wrapper colorido
  Exceção — Colaborador: ver "Cards de métrica" abaixo.
- Ação inline "Ver todos →": `text-[var(--brand-600)]`, nunca botão com fundo

### Cards de métrica
`bg-white border border-gray-200 rounded-lg p-5`
- Label: `text-base font-semibold text-gray-700`
- Valor: `text-3xl font-bold text-gray-900`
- Ícone: `w-5 h-5 text-[var(--brand-600)] flex-shrink-0` — sempre à direita, sem wrapper
- Nunca shadow — apenas border

Exceção documentada — Colaborador: cards de métrica em telas do Colaborador
(ex: `ColaboradorView.tsx`) podem usar wrapper colorido no ícone —
`bg-[var(--brand-100)]` de fundo, ícone `w-5 h-5 text-[var(--brand-600)]`.
Cards de métrica do Admin continuam sem wrapper, conforme regra geral acima.

Dentro dessa exceção, o tom do wrapper é neutro (brand) por padrão, EXCETO
nos cards com significado de status definido:
- Aderência ao cargo, Avaliações em aberto, Próxima avaliação: neutro —
  `bg-[var(--brand-100)]` / `text-[var(--brand-600)]`.
- Avaliações concluídas: `bg-green-100` / `text-green-800` — reaproveita
  direto o token já usado nos badges de status `Concluída`
  (Estado do colaborador na avaliação) e `Ativa` (Status de registro),
  sem criar cor nova.
- Habilidades abaixo do esperado: `bg-amber-100` / `text-amber-600` — novo
  padrão, registrado aqui pela primeira vez, específico para wrapper de
  ícone em card de métrica.

  Nota — coexistência com o indicador de texto: em "Indicadores de
  habilidade do colaborador" (04-regras-negocio.md) já existe
  `Abaixo do esperado: text-xs text-red-500`, mas isso é um rótulo de
  texto INLINE dentro de uma lista de habilidades (ex: ao lado do nome de
  cada habilidade), contexto diferente deste wrapper de ÍCONE em card de
  métrica agregado. As duas cores para "abaixo do esperado" (vermelho no
  texto inline, âmbar no wrapper do card) coexistem por serem usos
  diferentes — não é inconsistência a "corrigir", não alinhar as duas.

## Drawers

### Anatomia completa
```
Largura:  w-full md:w-[35%] md:max-w-xl md:min-w-[400px]
Header:   px-4 md:px-6 py-3 md:py-4 border-b border-gray-200
          título: text-base md:text-lg lg:text-xl font-semibold text-gray-900
          X:      p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg
Campos:   flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-5
Footer:   border-t border-gray-200 bg-gray-50 px-4 md:px-6 py-3 md:py-4
          Cancelar: border border-gray-300 text-gray-700 hover:bg-gray-50
          Salvar:   border border-[var(--brand-600)] text-[var(--brand-600)] hover:bg-[var(--brand-50)]
```

### Regras
- Somente leitura: apenas botão "Fechar" (outline neutro)
- Edição: Cancelar + Salvar
- Criação: Cancelar + Criar/Salvar
- Campos obrigatórios: `<span className="text-red-500">*</span>`
- Nunca dois drawers simultaneamente
- Footer sempre fixo, nunca dentro do scroll
- Campos com `flex-1 overflow-y-auto` para respeitar footer fixo

## Modais

### Variantes
- Destrutiva: ícone `bg-red-100 text-red-600`, botão `bg-red-600 hover:bg-red-700`
- Atenção: ícone `bg-yellow-100 text-yellow-600`, botão `bg-yellow-600 hover:bg-yellow-700`
- Neutra: ícone `bg-[var(--brand-100)] text-[var(--brand-600)]`, botão `bg-[var(--brand-600)] hover:bg-[var(--brand-700)]`

### Anatomia
```
Overlay:   fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4
Container: bg-white rounded-lg shadow-xl max-w-md w-full
Ícone:     w-12 h-12 rounded-full flex items-center justify-center
Conteúdo:  text-center mb-6
           título: text-lg font-semibold text-gray-900 mb-2
           descrição: text-sm text-gray-600
Ações:     flex items-center gap-3 — ambos com flex-1
```

### Regras
- Sem botão X — fechar só pelo Cancelar ou clique no overlay
- Descrição deve mencionar o impacto da ação
- Título sempre menciona o nome do item afetado
- Nunca empilhar dois modais
- Nunca usar modal para formulários com mais de 2 campos

## Formulários

### Classes
```
Label:          text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block
Input normal:   w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent
Input erro:     substituir border-gray-300 por border-red-300 + focus:ring-red-500
Textarea:       resize-none rows=4
Contador chars: text-xs text-gray-400 mt-1 text-right
Msg de erro:    text-sm text-red-600 mt-1
Hint text:      text-xs text-gray-500 mt-1
Desabilitado:   bg-gray-50 opacity-50 cursor-not-allowed
```

### Regras
- Ordem: label → input → hint text → mensagem de erro
- Nunca autofocus em campos de drawer
- Datas: `input type="date"` — sem date picker customizado
- Label sempre acima — nunca placeholder substituindo label
- Nunca `border-red` no label — apenas no input

## Estados vazios

### A — EmptyState (ui/EmptyState.tsx) — listas admin
Usar sempre o componente — nunca duplicar inline.
```
container:     flex flex-col items-center justify-center py-12 px-4
ícone wrapper: w-12 md:w-16 h-12 md:h-16 bg-gray-100 rounded-full
               flex items-center justify-center mb-4 text-gray-400
ícone:         w-8 h-8 (via prop)
título:        text-sm md:text-base lg:text-lg font-medium text-gray-900 mb-2
descrição:     text-xs md:text-sm text-gray-500 text-center max-w-md mb-6
ação:          bg-[var(--brand-600)] text-white (opcional)
```

### B — Orientativo — contexto colaborador
```
container: bg-white border border-gray-200 rounded-lg p-8 text-center
ícone:     w-8 h-8 text-gray-300 mx-auto mb-3 (sem wrapper)
título:    text-sm font-medium text-gray-700 mb-1
descrição: text-sm text-gray-500
```

### C — Painel compacto — dentro de drawers
```
container: text-center py-8 bg-gray-50 rounded-lg border border-gray-200
título:    text-sm text-gray-500
detalhe:   text-xs text-gray-400 mt-1
```

### D — Inline mínimo — dentro de td ou listas
```
em td: px-3 md:px-6 py-8 text-center text-sm text-gray-500
em p:  text-xs text-gray-500 text-center py-4
```

## Paginação

### Algoritmo de janela
- `totalPages ≤ 5` → todas as páginas
- `currentPage ≤ 3` → 1 2 3 4 … N
- `currentPage ≥ N−2` → 1 … N−3 N−2 N−1 N
- demais → 1 … p−1 p p+1 … N

### Classes
- "Exibindo" só no desktop: `hidden md:inline`
- Reticências: `<span>` não `<button>`
- Página ativa: `bg-gray-100 text-gray-900 border border-gray-200`
- Página inativa: `text-gray-600 bg-white border border-gray-300 hover:bg-gray-50`
- Ao aplicar filtro ou busca: resetar para página 1

## Mensagens de orientação

### A — Informativo contextual (brand)
```
bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3
ícone: Info w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5
texto: text-sm text-gray-700
```

### B — Instrução de formulário (slate)
```
bg-slate-100 border border-slate-300 rounded-lg p-4 flex items-start gap-3
ícone: Info w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5
label "Instruções:": font-medium text-slate-800
```

### C — Aviso de estado (yellow)
```
bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 flex items-start gap-3
ícone: Eye w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5
label: font-semibold; texto: text-sm text-yellow-800
```

### Regras
- Sempre `items-start` — nunca `items-center`
- Sempre `mt-0.5` e `flex-shrink-0` no ícone
- Nunca usar para erros de campo

## Wizard stepper

- Completo: `bg-[var(--brand-600)] text-white`; label `text-gray-500`; linha `bg-[var(--brand-600)]`; exibe ✓
- Ativo: `bg-[var(--brand-600)] text-white ring-2 ring-offset-1 ring-[var(--brand-300)]`; label `text-[var(--brand-600)] font-medium`
- Inativo: `bg-gray-100 text-gray-400 border border-gray-200`; label `text-gray-400`; linha `bg-gray-200`

---
