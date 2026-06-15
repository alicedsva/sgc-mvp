# Design System — Sistema de Gestão de Carreiras

> Fonte da verdade visual e de componentes do SGC.
> Gerado em: 10/06/2026

---

## Sumário

**Fundamentos**
- [Cores](#cores)
- [Tipografia](#tipografia)
- [Espaçamento](#espaçamento)
- [Ícones](#ícones)

**Componentes**
- [Botões](#botões)
- [Badges](#badges)
- [Tabelas](#tabelas)
- [Filtros e Pills](#filtros-e-pills)
- [Cards](#cards)
- [Drawers](#drawers)
- [Modais](#modais)
- [Formulários](#formulários)

**Padrões**
- [Navegação](#navegação)
- [Mensagens de orientação](#mensagens-de-orientação)
- [Estados vazios](#estados-vazios)
- [Paginação](#paginação)

**Regras de negócio**
- [Níveis e cores](#níveis-e-cores)
- [Cobertura de habilidades](#cobertura-de-habilidades)
- [Estados de avaliação](#estados-de-avaliação)
- [Badges de status](#badges-de-status)

---

## Fundamentos

### Cores

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 1

> ℹ️ **Alerta:** Dark mode ainda não foi implementado nem validado. O token `.dark` existe em `theme.css` mas as telas não foram revisadas neste modo. Não usar como referência de implementação.

Tokens de cor do sistema definidos em `src/styles/theme.css`. Sempre use os tokens CSS (`var(--brand-600)`) em vez de valores hex diretamente.

#### Paleta de marca

Usada em botões, links, foco, ícones ativos e elementos interativos principais.

| Token | Hex | Uso principal |
|---|---|---|
| `--brand-50` | `#E6F7FB` | |
| `--brand-100` | `#CCEFF7` | |
| `--brand-200` | `#99DFEF` | |
| `--brand-300` | `#66CFE7` | |
| `--brand-400` | `#33BFDF` | |
| `--brand-500` | `#009FC2` | Uso principal |
| `--brand-600` | `#0083A1` | Uso principal |
| `--brand-700` | `#006780` | |
| `--brand-800` | `#004B5F` | |
| `--brand-900` | `#002F3E` | |
| `--brand-950` | `#001E28` | |

#### Uso por contexto

| Contexto | Token | Hex |
|---|---|---|
| Botão primário fundo | `--brand-600` | `#0083A1` |
| Botão primário hover | `--brand-700` | `#006780` |
| Focus ring | `--brand-500` | `#009FC2` |
| Ícone ativo / link | `--brand-600` | `#0083A1` |
| Background sutil | `--brand-50` | `#E6F7FB` |
| Borda sutil | `--brand-100` | `#CCEFF7` |

#### Neutros (Tailwind gray)

Usados em textos, bordas, fundos e divisores. Não usar valores hex diretamente — usar classes Tailwind.

| Classe | Hex | Uso |
|---|---|---|
| `gray-50` | `#f9fafb` | Fundo de página, header de tabela |
| `gray-100` | `#f3f4f6` | Pills inativas, badges |
| `gray-200` | `#e5e7eb` | Bordas de cards e tabelas |
| `gray-300` | `#d1d5db` | Bordas de inputs |
| `gray-400` | `#9ca3af` | Ícones inativos, placeholder |
| `gray-500` | `#6b7280` | Texto secundário, meta |
| `gray-600` | `#4b5563` | Texto de filtro inativo |
| `gray-700` | `#374151` | Labels de campos |
| `gray-900` | `#111827` | Texto principal, títulos |

#### Cores semânticas

| Cor | Uso | Classes |
|---|---|---|
| Sucesso (green) | badge Ativa, badge Concluída, Boa cobertura, "No esperado" / "Acima do esperado" | `bg-green-100 text-green-800` · `text-green-600` |
| Atenção (yellow) | badge Rascunho, Cobertura parcial | `bg-yellow-100 text-yellow-800` |
| Erro / alerta (red) | Baixa cobertura, "Abaixo do esperado", erros de formulário | `bg-red-100 text-red-700` · `text-red-500` · `text-red-600` |
| Informação orange | badge Não iniciada | `bg-orange-100 text-orange-800` |
| Informação blue | badge Em andamento | `bg-blue-100 text-blue-800` |

#### Como usar

```css
/* ✅ Correto — usa token CSS */
style={{ color: 'var(--brand-600)' }}
className="text-[var(--brand-600)]"
className="bg-[var(--brand-50)]"

/* ✅ Correto — usa classe Tailwind para neutros */
className="text-gray-900 border-gray-200 bg-gray-50"

/* ❌ Evitar — hex fixo não responde ao tema */
style={{ color: '#0083A1' }}
style={{ backgroundColor: '#E6F7FB' }}

/* ❌ Evitar — azul Tailwind padrão fora da paleta */
className="text-blue-600 bg-blue-500"
```

---

### Tipografia

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 1

> ℹ️ **Alerta:** A escala tipográfica não documenta o passo intermediário `text-lg` (18px) usado no título do drawer entre md e lg breakpoints. O DS documenta 16–20px mas o valor real em md é 18px.

Fonte base: DM Sans (Google Fonts). Definida em `src/styles/fonts.css`. Tamanho base: 16px. Line-height padrão: 1.5.

#### Escala por contexto

| Exemplo | Classes Tailwind | px | Peso |
|---|---|---|---|
| Título de página | `text-2xl font-semibold text-gray-900` | 24px | 600 |
| Subtítulo descritivo da página | `text-sm text-gray-600` | 14px | 400 |
| Título do drawer | `text-base md:text-lg lg:text-xl font-semibold text-gray-900` | 16–20px | 600 |
| Nome do campo * | `text-xs md:text-sm font-medium text-gray-700` | 12–14px | 500 |
| NOME DA COLUNA | `text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider` | 10–12px | 500 |
| Conteúdo da célula | `text-xs md:text-sm text-gray-900` | 12–14px | 400 |
| Informação complementar | `text-xs md:text-sm text-gray-500` | 12–14px | 400 |
| Ação do botão | `text-xs md:text-sm font-medium` | 12–14px | 500 |
| Este campo é obrigatório | `text-sm text-red-600` | 14px | 400 |
| Ver detalhes → | `text-xs md:text-sm font-medium text-[var(--brand-600)]` | 12–14px | 500 |

#### Pesos disponíveis

| Peso | Classe | Token | Uso |
|---|---|---|---|
| 400 | `font-normal` | `--font-weight-normal` | Texto corrido, inputs, células de tabela |
| 500 | `font-medium` | `--font-weight-medium` | Títulos, labels, botões, filtros |
| 600 | `font-semibold` | *(sem token — uso direto)* | Títulos de página, cabeçalhos de drawer |

#### Regras de uso

- `font-bold` (700) é reservado para valores numéricos de destaque em cards de métricas (ex: `text-3xl font-bold`). Não usar em texto corrido, labels, botões ou cabeçalhos.
- Nunca use tamanhos fora da escala acima (ex: `text-3xl` em conteúdo de página)
- Sempre use `text-gray-900` para texto principal e `text-gray-500` para texto secundário
- Labels de formulário sempre em `font-medium text-gray-700`
- Cabeçalhos de tabela sempre em `uppercase tracking-wider`
- Responsive: use prefixo `md:` quando o tamanho muda entre mobile e desktop

---

### Espaçamento

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 1

> ℹ️ **Alerta:** A tabela de espaçamento agrupa thead e tbody com os mesmos valores `px-3 md:px-6 py-3 md:py-4`, sugerindo que são configurados separadamente quando na prática são idênticos em Table.tsx.

O sistema usa a escala de espaçamento padrão do Tailwind CSS. Não há tokens customizados de espaçamento.

#### Espaçamento por contexto

**PÁGINA**

| Contexto | Classes | Valor |
|---|---|---|
| Gap vertical entre seções | `space-y-6` | 24px |
| Margem do subtítulo ao título | `mt-2` | 8px |

**TOOLBAR DE FILTROS**

| Contexto | Classes | Valor |
|---|---|---|
| Padding da toolbar | `p-3 md:p-4` | 12–16px |
| Gap entre elementos internos | `gap-3` | 12px |

**TABELA**

| Contexto | Classes | Valor |
|---|---|---|
| Padding células header e data | `px-3 md:px-6 py-3 md:py-4` | H: 12–24 / V: 12–16px |
| Padding footer paginação | `px-3 md:px-6 py-3 md:py-4` | H: 12–24 / V: 12–16px |

**DRAWER**

| Contexto | Classes | Valor |
|---|---|---|
| Padding header | `px-4 md:px-6 py-3 md:py-4` | H: 16–24 / V: 12–16px |
| Padding área de campos | `px-4 md:px-6 py-4 md:py-6` | H: 16–24 / V: 16–24px |
| Gap entre campos | `space-y-4 md:space-y-5` | 16–20px |
| Padding footer | `px-4 md:px-6 py-3 md:py-4` | H: 16–24 / V: 12–16px |
| Gap entre botões do footer | `gap-2 md:gap-3` | 8–12px |
| Label → input | `mb-1.5 md:mb-2` | 6–8px |

**CARDS DE MÉTRICAS**

| Contexto | Classes | Valor |
|---|---|---|
| Padding do card | `p-5` | 20px |
| Gap entre label e número | `mb-3` | 12px |

**INPUTS**

| Contexto | Classes | Valor |
|---|---|---|
| Padding interno | `px-3 py-2` | H: 12 / V: 8px |
| Border radius | `rounded-lg` | 8px |

**BOTÕES DE AÇÃO (ícone)**

| Contexto | Classes | Valor |
|---|---|---|
| Padding | `p-1.5 md:p-2` | 6–8px |
| Border radius | `rounded-lg` | 8px |

#### Escala base (1 unidade = 4px)

`1=4px` · `2=8px` · `3=12px` · `4=16px` · `5=20px` · `6=24px` · `8=32px` · `10=40px` · `12=48px` · `16=64px` · `20=80px` · `24=96px`

#### Border radius

| Classe | Valor | Uso |
|---|---|---|
| `rounded-sm` | 2px | Badges de variação percentual |
| `rounded` | 4px | Raro no sistema |
| `rounded-md` | 6px | Pills de filtro ativas |
| `rounded-lg` | 8px | Cards, inputs, botões, drawers |
| `rounded-full` | 9999px | Badges de status e nível |

#### Regras de uso

- Sempre use a escala Tailwind — nunca valores arbitrários em `style={{ margin: '13px' }}`
- Componentes responsivos usam o prefixo `md:` para desktop — ex: `p-3 md:p-4`
- Gap entre seções de página: sempre `space-y-6`
- Gap entre campos de formulário: `space-y-4 md:space-y-5`
- Nunca use margin negativa exceto em casos documentados (`-mx-4 md:mx-0` nas tabs do sistema)
- Padding de cards: sempre `p-4 md:p-5` ou `p-5` — nunca `p-6` ou maior em cards de métricas

---

### Ícones

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 1

> ℹ️ **Alerta:** O ícone `ArrowLeft` usado no botão de voltar não está listado no grupo NAVEGAÇÃO INTERNA da tabela de ícones, apesar de estar documentado na seção Navegação.

O sistema usa exclusivamente a biblioteca **Lucide React v0.487.0**. Nunca use outras bibliotecas de ícones ou SVGs inline não documentados.

#### Importação

```tsx
import { NomeDoIcone } from 'lucide-react';

<NomeDoIcone className="w-5 h-5 text-gray-500" />
```

#### Tamanhos de uso

| Classe | px | Uso |
|---|---|---|
| `w-4 h-4` | 16px | Ícones em badges, texto inline, mensagens de orientação (Info) |
| `w-5 h-5` | 20px | **USO PRINCIPAL** — ícones em cards de métricas, botões, toolbar |
| `w-6 h-6` | 24px | Ícones na sidebar de navegação, ações em tabela |
| `w-8 h-8` | 32px | Ícones decorativos em estados vazios, headers de seção |

#### Ícones por contexto

**NAVEGAÇÃO (sidebar Admin)**

| Ícone | Nome | Contexto |
|---|---|---|
| — | `LayoutDashboard` | Dashboard |
| — | `Users` | Perfis |
| — | `Award` | Habilidades |
| — | `Briefcase` | Carreiras |
| — | `ClipboardCheck` | Avaliações |

**NAVEGAÇÃO (sidebar Colaborador)**

| Ícone | Nome | Contexto |
|---|---|---|
| — | `UserCircle` | Meu Perfil |
| — | `ClipboardCheck` | Minhas Avaliações |
| — | `TrendingUp` | Minha Carreira |

**CARDS DE MÉTRICAS (Admin)**

| Nome | Contexto |
|---|---|
| `Users` | Colaboradores ativos |
| `BookOpen` | Habilidades cadastradas |
| `ClipboardList` | Avaliações ativas |
| `CheckCircle2` | Avaliações respondidas |

**CARDS DE MÉTRICAS (Colaborador)**

| Nome | Contexto |
|---|---|
| `Clock` | Avaliações em aberto |
| `CalendarClock` | Próxima avaliação encerra em |
| `AlertCircle` | Habilidades abaixo do esperado |
| `CheckCircle2` | Avaliações concluídas |

**AÇÕES EM TABELA**

| Nome | Contexto |
|---|---|
| `Eye` | Visualizar detalhe (somente leitura) |
| `Pencil` | Editar |
| `Power` | Toggle ativo/inativo |
| `RefreshCw` | Sincronizar (Perfis) |
| `Archive` | Arquivar nível |

**MENSAGENS E FEEDBACK**

| Nome | Contexto |
|---|---|
| `Info` | Mensagens de orientação (brand-600) |
| `Info` | Banner de instrução (slate-400) |
| `AlertCircle` | Alerta / atenção |
| `CheckCircle2` | Sucesso / concluído |
| `XCircle` | Erro |

**NAVEGAÇÃO INTERNA**

| Nome | Contexto |
|---|---|
| `ArrowLeft` | Botão "← Voltar" em páginas internas |
| `ChevronLeft` | Paginação — página anterior |
| `ChevronRight` | Próximo / paginação — próxima página |
| `ChevronDown` | Dropdown aberto / menu do usuário |
| `ChevronUp` | Dropdown fechado / accordion fechado |

**SIDEBAR / HEADER**

| Nome | Contexto |
|---|---|
| `Layers` | Ícone do logo SGC no header da sidebar |
| `Bell` | Botão de notificações no header |
| `User` | Avatar do usuário / item "Visão do Colaborador" |
| `ArrowLeftRight` | Item "Visão do Administrador" no menu |
| `BookOpen` | Item "Design System" no menu |
| `LogOut` | Item "Sair" no menu |
| `Menu` | Botão hamburger — apenas mobile, fora do DS |

#### Cores por contexto

| Cor | Classe | Uso |
|---|---|---|
| Brand | `text-[var(--brand-600)]` | Ícones em cards de métricas, ativo na sidebar, links |
| Cinza médio | `text-gray-500` | Ícones em toolbar, ações secundárias |
| Cinza claro | `text-gray-400` | Ícones decorativos, placeholders |
| Cinza escuro | `text-gray-700` | Ícones em tabelas, ações primárias |
| Verde | `text-green-500` | Estados vazios positivos, sucesso |
| Vermelho | `text-red-500` | Erros, alertas críticos |
| Slate | `text-slate-400` | Ícone Info em banner de instrução |

#### Regras de uso

- Sempre importe de `lucide-react` — nunca de outras bibliotecas
- Nunca use SVG inline não documentado
- Sempre defina tamanho via `className` (`w-X h-X`) — nunca via `style={{ width, height }}`
- Nunca use ícones como único indicador de ação — sempre acompanhe com texto ou tooltip
- Ícones em botões: sempre à esquerda do texto, `gap-2` entre ícone e texto
- Ícones em cards de métricas: sempre à direita, `w-5 h-5 text-[var(--brand-600)] flex-shrink-0`
- Não adicione novos ícones sem atualizar esta documentação

---

## Componentes

### Botões

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 0

Botões comunicam ações. Use a variante correta para cada nível de hierarquia de ação.

#### Variantes

**Primário**
```tsx
className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white
           text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
```
Ação principal da página ou drawer. Máximo 1 por contexto visível.

**Secundário**
```tsx
className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--brand-600)]
           text-[var(--brand-600)] text-sm font-medium rounded-lg hover:bg-[var(--brand-50)]
           transition-colors"
```
Ação alternativa, cancelar com intenção, salvar rascunho.

**Terciário**
```tsx
className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
           text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
```
Ações de menor hierarquia, cancelar simples.

**Destrutivo**
```tsx
className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white
           text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
```
Ações irreversíveis ou de risco (desativar, arquivar).

**Ação em tabela (ícone apenas)**
```tsx
className="p-1.5 md:p-2 rounded-lg text-gray-500 hover:bg-gray-100
           hover:text-gray-700 transition-colors"
```
Ações em tabelas (editar, visualizar, toggle). Sempre com tooltip ou contexto visual claro.

#### Estados

| Estado | Modificação |
|---|---|
| Normal | `bg-[var(--brand-600)]` |
| Hover | `bg-[var(--brand-700)]` |
| Desabilitado | `opacity-50 cursor-not-allowed` + atributo `disabled` |
| Carregando | `opacity-75 cursor-not-allowed` + `animate-spin` no ícone de loading |

#### Hierarquia em drawers

```
[Cancelar]  [Salvar]
```
Cancelar sempre à esquerda, ação primária sempre à direita. Nunca inverta essa ordem.

#### Regras de uso

- Máximo 1 botão primário por contexto visível
- Nunca use `font-bold` em botões — sempre `font-medium`
- Ícone sempre à esquerda do texto, nunca à direita
- Botões de ação em tabela: apenas ícone, sem texto, `p-1.5 md:p-2`
- Nunca use `button` sem type definido em formulários — use `type="button"` ou `type="submit"` explicitamente
- Ações destrutivas sempre em vermelho e sempre com modal de confirmação antes de executar
- Botão "Cancelar" nunca em vermelho — sempre ghost ou outline neutro

---

### Badges

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 1

> ℹ️ **Alerta:** SecaoEstadosAvaliacao documenta badge Encerrada com `text-gray-800`. SecaoBadgesStatus documenta a mesma badge com `text-gray-700`. O código real usa `text-gray-700`. Verificar se a correção foi aplicada em ambas as seções.

Badges comunicam estado de forma compacta. Nunca use badges para decoração — cada cor tem significado semântico definido.

#### Classe base

```tsx
// Classe base — aplicar em todos os badges de status
className="inline-flex px-1.5 md:px-2 py-0.5 md:py-1
           text-[10px] md:text-xs font-medium rounded-full"

// Badges de nível (cor derivada de getCorFromPeso)
style={{ backgroundColor: getCorFromPeso(ordem) }}
className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium text-white"
```

#### Status de registro

| Badge | Classes adicionais | Uso |
|---|---|---|
| Ativa | `bg-green-100 text-green-800` | Competências, Habilidades, Carreiras, Jornadas, Avaliações ativas |
| Desativada | `bg-red-100 text-red-700` | Registros desativados |
| Rascunho | `bg-yellow-100 text-yellow-800` | Avaliações não publicadas |
| Encerrada | `bg-gray-100 text-gray-700` | Avaliações com período encerrado |
| Arquivado | `bg-gray-100 text-gray-700` | Níveis arquivados |

#### Estado do colaborador na avaliação

| Badge | Classes adicionais | Condição de exibição |
|---|---|---|
| Não iniciada | `bg-orange-100 text-orange-800` | Avaliação Ativa + colaborador não começou |
| Em andamento | `bg-blue-100 text-blue-800` | Avaliação Ativa + colaborador iniciou mas não concluiu |
| Concluída | `bg-green-100 text-green-800` | Avaliação Encerrada + colaborador respondeu |
| Expirada | `bg-gray-100 text-gray-700` | Avaliação Encerrada + colaborador não respondeu |

#### Indicadores de status em texto (habilidades do colaborador)

Sem fundo — apenas cor no texto. Usados no Detalhamento de Habilidades.

| Indicador | Classe |
|---|---|
| Acima do esperado | `text-xs text-green-600` |
| No esperado | `text-xs text-green-600` |
| Abaixo do esperado | `text-xs text-red-500` |

#### Variação percentual (cards de métricas)

| Badge | Classes |
|---|---|
| ↑ 4% (positivo) | `inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700` |
| ↓ 8% (negativo) | `inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700` |

#### Regras de uso

- Nunca use cores de badge para decoração — cada cor tem significado semântico fixo
- Verde = positivo/ativo, Vermelho = alerta/erro, Amarelo = atenção/rascunho, Cinza = inativo/neutro
- Badges de nível: sempre usar `getCorFromPeso()` — nunca cor fixa hardcoded
- Texto em badges de nível: sempre `text-white`
- Badges não são clicáveis — nunca adicione `onClick` a um badge

---

### Tabelas

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 0

Componente principal de listagem do sistema. Sempre use a estrutura completa — container, toolbar, thead, tbody e paginação.

#### Anatomia da tabela

1. **Container** — `bg-white rounded-lg border border-gray-200 overflow-hidden`. Sempre com `overflow-hidden` para respeitar o border-radius.
2. **Toolbar** — `p-3 md:p-4 border-b border-gray-200`. Contém busca, filtros e botão de ação principal. Botão de ação sempre com `ml-auto` à direita.
3. **thead** — `bg-gray-50 border-b border-gray-200`. Texto `uppercase tracking-wider text-gray-500`. Nunca use bold no cabeçalho.
4. **tbody** — `divide-y divide-gray-200`. Sem hover em linhas não clicáveis. Hover brand-translúcido apenas em linhas clicáveis (`cursor-pointer`).
5. **Paginação** — `border-t border-gray-200`. Contagem à esquerda, controles à direita. Botões desabilitados com `opacity-50`.

#### Comportamento de linhas

```tsx
// Linha não clicável (padrão) — Habilidades, Avaliações
<tr className="transition-colors">

// Linha clicável — Carreiras (navega para página interna)
<tr className="hover:bg-[rgba(0,159,194,0.06)] cursor-pointer transition-colors">
```

#### Estado vazio em tabela

```tsx
// Sem resultados de busca/filtro
<div className="text-center py-12">
  <p className="text-sm text-gray-500">Nenhum resultado encontrado.</p>
  <button className="mt-2 text-sm font-medium text-[var(--brand-600)] hover:underline">
    Limpar filtros
  </button>
</div>

// Sem dados cadastrados
<div className="text-center py-12">
  <p className="text-sm text-gray-500">Nenhuma habilidade cadastrada ainda.</p>
</div>
```

#### Regras de uso

- Sempre use a estrutura completa: container → toolbar → tabela → paginação
- Nunca omita o `overflow-hidden` do container
- Toolbar sempre dentro do container da tabela, com `border-b` separando da tabela
- Botão de ação principal sempre com `ml-auto` à direita da toolbar
- Ações em linha: máximo 3 ícones, sem texto, sem menu de contexto (`MoreVertical`)
- Linhas clicáveis: hover brand-translúcido. Linhas não clicáveis: sem hover
- Estado vazio com filtro aplicado: mostrar "Limpar filtros"
- Estado vazio sem dados: sem botão de limpar filtros

---

### Filtros e Pills

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 1

> ℹ️ **Alerta:** `ListingPage.tsx` usa ícone `Search` com `w-5 h-5` no desktop. O DS documenta apenas `w-4 h-4` na seção de ícones e no exemplo da toolbar.

Componentes de filtragem usados nas toolbars de listagem. Sempre use o padrão completo — pills de status + campo de busca + dropdowns.

#### Pills de filtro de status

```tsx
// Container
<div className="flex items-center bg-gray-100 rounded-lg p-1">

// Item ativo
<button className="px-3 py-2 text-sm font-normal rounded-md bg-white text-gray-900
                   shadow-sm transition-all whitespace-nowrap">

// Item inativo
<button className="px-3 py-2 text-sm font-normal rounded-md text-gray-600
                   hover:text-gray-900 transition-all whitespace-nowrap">
```

#### Campo de busca

```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
  <input
    className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm
               focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]
               focus:border-transparent w-64"
  />
</div>
```

#### Variações de pills por contexto

| Contexto | Pills |
|---|---|
| Competências / Habilidades / Carreiras / Jornadas | Todos · Ativas · Desativadas |
| Níveis | Todos · Ativos · Desativados · Arquivados |
| Perfis | Todos · Ativos · Desativados |
| Avaliações | Todas · Rascunho · Ativas · Encerradas |
| Avaliações (Colaborador) | Todos · Não iniciada · Em andamento · Concluída · Expirada |

#### Regras de uso

- Pills sempre dentro do container `bg-gray-100 rounded-lg p-1`
- Aba padrão sempre "Ativos/Ativas" — nunca "Todos" como padrão
- Campo de busca sempre com ícone Search via `position absolute` — nunca inline
- Botão de ação sempre com `ml-auto` ou `justify-between` no container pai
- Dropdowns de filtro: usar Radix Select — nunca `<select>` nativo
- Filtros aplicados: mostrar contador no botão ex: "Gerência (2)" — nunca tags expandidas
- Toolbar sempre separada da tabela por `border-b border-gray-200`

---

### Cards

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 1

> ℹ️ **Alerta:** O DS documenta o badge do cargo atual na Jornada de Carreira como `bg-[var(--brand-600)] text-white`. `MinhaCarreira.tsx` usa `bg-[var(--brand-50)] text-[var(--brand-600)]`. A ser resolvido quando a Visão do Colaborador for documentada.

Cards são containers de conteúdo agrupado. O sistema tem três variantes principais: card de métrica, card de conteúdo e card de estado.

#### Card de métrica

Usado no Dashboard (Admin) e em Meu Perfil e Minhas Avaliações (Colaborador). Exibe um número grande com label e ícone.

```tsx
<div className="bg-white border border-gray-200 rounded-lg p-5">
  <div className="flex items-center justify-between mb-3">
    <span className="text-base font-semibold text-gray-700">{label}</span>
    <Icone className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
  </div>
  <p className="text-3xl font-bold text-gray-900">{valor}</p>
  <p className="text-xs text-gray-400 mt-2">{detalhe}</p>
</div>
```

#### Card de conteúdo

Container genérico. Estrutura: `bg-white border border-gray-200 rounded-lg p-5` com título, subtítulo e link "Ver todos →" em `text-[var(--brand-600)]`.

#### Card de cargo (Jornada de Carreira)

```tsx
<div className={`border border-gray-200 rounded-lg p-4 ${isCargoCurrent ? 'bg-[var(--brand-50)]' : ''}`}>
  {/* Barra de cobertura colorida por faixa (green/yellow/red) */}
  <div className="w-full bg-gray-200 rounded-full h-1.5">
    <div className={`${barraClasses} h-1.5 rounded-full`} style={{ width: largura }} />
  </div>
</div>
```

Badge do cargo atual: `bg-[var(--brand-600)] text-white` (conforme DS — divergência em MinhaCarreira.tsx pendente de resolução).

#### Card de identificação (Meu Perfil)

```tsx
<div
  className="rounded-xl p-6 md:p-8 border border-slate-200"
  style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}
>
  <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Boa tarde, João. 👋🏻</h1>
  <p className="text-sm text-gray-600 mt-1">Desenvolvedor Frontend · Pleno · 1 ano e 3 meses no cargo</p>
</div>
```

#### Regras de uso

- Cards sempre com `bg-white border border-gray-200 rounded-lg`
- Padding padrão: `p-5` para cards de métrica e conteúdo — nunca `p-6` ou maior
- Card de identificação usa `rounded-xl` e gradiente slate — exceção documentada
- Nunca use shadow em cards — apenas border
- Card de métrica: label acima, número grande, ícone solto à direita — nunca container colorido no ícone
- Card de cargo com `bg-[var(--brand-50)]` apenas quando é o cargo atual
- Ação inline no card (Ver todos →): sempre `text-[var(--brand-600)]`, nunca botão com fundo

---

### Drawers

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 0

Painéis laterais deslizantes usados para criar e editar registros. Sempre surgem pela direita e cobrem parcialmente o conteúdo.

#### Anatomia

```
┌──────────────────────────────────────┐
│  Criar habilidade              [X]   │  ← Header: px-4 md:px-6 py-3 md:py-4 border-b
├──────────────────────────────────────┤
│  Nome da habilidade *                │  ← Campos: px-4 md:px-6 py-4 md:py-6
│  [Input]                             │     flex-1 overflow-y-auto space-y-4 md:space-y-5
│                                      │
│  Descrição                           │
│  [Textarea]                          │
│                                      │
│  Competência *                       │
│  [Select]                            │
├──────────────────────────────────────┤
│            [Cancelar]  [Salvar]      │  ← Footer: px-4 md:px-6 py-3 md:py-4 border-t bg-gray-50
└──────────────────────────────────────┘
```

#### Espaçamentos

| Área | Classes | Valor |
|---|---|---|
| Header padding | `px-4 md:px-6 py-3 md:py-4` | H: 16–24px / V: 12–16px |
| Campos padding | `px-4 md:px-6 py-4 md:py-6` | H: 16–24px / V: 16–24px |
| Gap entre campos | `space-y-4 md:space-y-5` | 16–20px |
| Footer padding | `px-4 md:px-6 py-3 md:py-4` | H: 16–24px / V: 12–16px |
| Gap entre botões | `gap-2 md:gap-3` | 8–12px |
| Label → input | `mb-1.5 md:mb-2` | 6–8px |

#### Drawer de somente leitura

Acessado pelo ícone `Eye` na tabela. Não tem botão Salvar — apenas Fechar. Footer com apenas `[Fechar]` alinhado à direita.

#### Regras de uso

- Drawers sempre surgem pela direita
- Header sempre com título + botão X (nunca apenas X)
- Área de campos sempre com `overflow-y-auto` e `flex-1` para respeitar o footer fixo
- Footer sempre fixo no rodapé — nunca dentro da área de scroll
- Cancelar sempre à esquerda do Salvar
- Drawer de edição: botões Cancelar + Salvar
- Drawer de criação: botões Cancelar + Criar/Salvar
- Drawer somente leitura: apenas botão Fechar
- Campos obrigatórios marcados com `*` no label
- Nunca abra dois drawers simultaneamente
- Largura padrão: `w-full md:w-[35%] md:max-w-xl md:min-w-[400px]`

---

### Modais

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 0

Janelas de confirmação para ações críticas ou irreversíveis. Sempre bloqueiam a interação com o restante da página.

#### Modal vs Drawer

| Aspecto | Modal | Drawer |
|---|---|---|
| Propósito | Confirmação de ação crítica | Criar ou editar registro |
| Conteúdo | Curto — título + descrição + 2 botões | Longo — formulário com múltiplos campos |
| Bloqueio | Sempre bloqueia a página | Não bloqueia — overlay parcial |
| Fechamento | Botão Cancelar ou clique no overlay | Botão X ou Cancelar |
| Exemplos | Desativar, arquivar, excluir | Criar habilidade, editar avaliação |

#### Variantes

**Destrutiva** — `danger`
```tsx
// Ícone: bg-red-100 text-red-600
// Botão confirmar: bg-red-600 hover:bg-red-700
```
Usado para desativar, arquivar ou ações irreversíveis.

**Atenção** — `warning`
```tsx
// Ícone: bg-yellow-100 text-yellow-600
// Botão confirmar: bg-yellow-600 hover:bg-yellow-700
```
Usado para ações reversíveis com impacto potencial (ex: desativar avaliação com participantes em andamento).

**Neutra** — `info`
```tsx
// Ícone: bg-[var(--brand-100)] text-[var(--brand-600)]
// Botão confirmar: bg-[var(--brand-600)] hover:bg-[var(--brand-700)]
```
Usado para ações que precisam de confirmação mas não são destrutivas (ex: restaurar, ativar).

#### Anatomia do modal

```
1. Overlay     fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4
2. Container   bg-white rounded-lg shadow-xl max-w-md w-full
3. Ícone       w-12 h-12 rounded-full flex items-center justify-center (+ classes de variante)
4. Conteúdo    text-center mb-6 → h3: text-lg font-semibold text-gray-900 mb-2 · p: text-sm text-gray-600
5. Ações       flex items-center gap-3 → ambos os botões com flex-1
```

#### Componente real

```tsx
// src/app/components/templates/ConfirmationModal.tsx
<ConfirmationModal
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={onConfirm}
  title="Desativar nível 'Avançado'"
  message="Ao desativar este nível, ele não será mais visível..."
  confirmLabel="Desativar"
  cancelLabel="Cancelar"
  variant="danger" // 'danger' | 'warning' | 'info'
/>
```

#### Regras de uso

- Sempre use modal para ações destrutivas ou irreversíveis — nunca execute direto
- Ação destrutiva: botão vermelho (`bg-red-600 hover:bg-red-700`)
- Ação neutra de confirmação: botão primário (`bg-[var(--brand-600)]`)
- Cancelar sempre à esquerda, ação de confirmação sempre à direita — ambos com `flex-1`
- Sem botão X — fechamento apenas pelo botão Cancelar ou clique no overlay
- Descrição deve mencionar o impacto da ação (ex: "vinculado a 22 habilidades")
- Nunca use modal para formulários com mais de 2 campos — use drawer
- Título sempre menciona o nome do item afetado (ex: "Desativar nível 'Avançado'")
- Nunca empilhe dois modais

---

### Formulários

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 1

> ℹ️ **Alerta:** O DS documenta campos obrigatórios marcados com `*` no label sem especificar margin. `FormDrawer.tsx` usa `ml-1` no `<span>` do asterisco — detalhe não documentado.

Campos de entrada usados em drawers e wizards. Sempre use os padrões definidos.

#### Classes por elemento

| Elemento | Classes | Observação |
|---|---|---|
| Label | `text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block` | `*` para obrigatório |
| Input normal | `w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent` | — |
| Input erro | `+ border-red-300 focus:ring-red-500` | Substituir `border-gray-300` |
| Textarea | `+ resize-none` | `rows=4` padrão |
| Contador de chars | `text-xs text-gray-400 mt-1 text-right` | Quando há limite |
| Mensagem de erro | `text-sm text-red-600 mt-1` | Sempre abaixo do campo |
| Hint text | `text-xs text-gray-500 mt-1` | Instrução adicional ao campo |
| Campo desabilitado | `+ bg-gray-50 opacity-50 cursor-not-allowed` | — |

#### Wizard — formulário em etapas

Usado na criação de avaliações (`NovaAvaliacaoDrawer.tsx`).

| Estado | Círculo | Texto | Linha |
|---|---|---|---|
| Completo | `bg-[var(--brand-600)] text-white` | `text-gray-500` | `bg-[var(--brand-600)]` |
| Ativo | `bg-[var(--brand-600)] text-white ring-2 ring-offset-1 ring-[var(--brand-300)]` | `text-[var(--brand-600)] font-medium` | `bg-gray-200` |
| Inativo | `bg-gray-100 text-gray-400 border border-gray-200` | `text-gray-400` | `bg-gray-200` |

Etapa completa exibe `✓` em vez do número. Linha conectora: `flex-1 h-px mt-3.5 mx-1.5`.

#### Regras de uso

- Label sempre acima do campo — nunca inline ou placeholder como substituto de label
- Campos obrigatórios marcados com `*` via `<span className="text-red-500">*</span>`
- Mensagem de erro sempre abaixo do campo, nunca em tooltip ou modal
- Nunca use border-red no label — apenas no input
- Contador de caracteres sempre à direita, abaixo do campo
- Ordem no formulário: label → input → hint text → mensagem de erro
- Selects: sempre Radix Select — nunca select nativo
- Datas: `input type=date` — sem date picker customizado no MVP
- Gap entre campos: `space-y-4 md:space-y-5`
- Nunca use autofocus em campos de drawer

---

## Padrões

### Navegação

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 1

> ℹ️ **Alerta:** O layout mobile existe no código (sidebar deslizante via `translate-x`, breakpoints responsivos) mas não foi validado nem projetado intencionalmente. As classes responsivas `md:` existem como base mas o comportamento mobile não foi revisado.

#### Sidebar

**Item ativo:**
```tsx
<button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                   bg-[var(--brand-50)]">
  <Icon className="w-5 h-5 flex-shrink-0 text-[var(--brand-600)]" />
  <span className="text-[var(--brand-700)] font-medium">{label}</span>
</button>
```

**Item inativo:**
```tsx
<button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                   text-gray-700 hover:bg-gray-50">
  <Icon className="w-5 h-5 flex-shrink-0" />
  <span>{label}</span>
</button>
```

**Sidebar recolhida (ícone apenas):** `justify-center p-3` sem texto.

#### Botão de voltar

```tsx
<button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700
                   transition-colors mb-6">
  <ArrowLeft className="w-4 h-4" />
  Carreiras
</button>
```

| Contexto | Label |
|---|---|
| Dentro de uma carreira | `← Carreiras` |
| Dentro de uma jornada | `← Nome da carreira` |
| Respondendo avaliação | `← Minhas Avaliações` |
| Resultado de avaliação | `← Minhas Avaliações` |

Nunca use apenas `←` sem label. Nunca use breadcrumb.

#### Tabs de conteúdo

```tsx
// Tab ativa
<button className="pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap
                   border-[var(--brand-600)] text-[var(--brand-600)]">

// Tab inativa
<button className="pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap
                   border-transparent text-gray-600 hover:text-gray-900">
```

Container das tabs: `border-b border-gray-200 mb-6 -mx-6` com `flex gap-3 md:gap-8 overflow-x-auto scrollbar-hide px-6`.

#### Hierarquia de navegação

**Admin:**
- Dashboard
- Perfis → Perfil individual _(abas: Visão Geral · Habilidades · Carreira · Avaliações)_
- Habilidades _(abas: Competências · Níveis · Habilidades)_
- Carreiras → Carreira → Jornada → Matriz
- Avaliações → Detalhe da avaliação

**Colaborador:**
- Meu Perfil
- Minhas Avaliações → Responder avaliação / Resultado da avaliação
- Minha Carreira _(abas: Minha Jornada · Próximo passo)_

#### Regras de uso

- Páginas internas sempre com botão ← Label — nunca breadcrumb
- Nunca use o botão de voltar do browser como navegação principal
- Tabs sempre com `border-b` na aba ativa — nunca background colorido
- Sidebar sempre com ícone + label no modo expandido
- Item ativo na sidebar: nunca destaque apenas por cor do ícone — sempre fundo + cor do texto + ícone
- Navegação do Colaborador: React Router (rotas separadas) — não é `viewMode` condicional
- Nunca adicione item à sidebar sem atualizar esta documentação

---

### Mensagens de orientação

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 0

Banners informativos, instruções e avisos de estado. Existem 3 variantes — escolha pela semântica, não pela preferência de cor.

#### Comparativo de variantes

| Variante | Container | Ícone | Texto | Padding |
|---|---|---|---|---|
| Informativo contextual | `bg-[var(--brand-50)] border-[var(--brand-100)]` | `Info · text-[var(--brand-600)]` | `text-sm text-gray-700` | `p-4` |
| Instrução de formulário | `bg-slate-100 border-slate-300` | `Info · text-slate-500` | `text-sm text-slate-700` | `p-4` |
| Aviso de estado | `bg-yellow-50 border-yellow-200` | `Eye · text-yellow-600` | `text-sm text-yellow-800` | `px-4 py-3` |

#### A — Informativo contextual (brand)

Explica como dados são calculados, limitações da tela ou caveats importantes.

```tsx
<div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4
                flex items-start gap-3">
  <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
  <p className="text-sm text-gray-700">...</p>
</div>
```

Usado em: `MinhaCarreira.tsx:203`, `MinhaCarreira.tsx:276`, `ResultadoAvaliacao.tsx:85`.

#### B — Instrução de formulário (slate)

Instrução direta ao usuário antes de um formulário ou ação. Diferencia-se pela cor slate neutra e pelo bold label "Instruções:".

```tsx
<div className="bg-slate-100 border border-slate-300 rounded-lg p-4 flex items-start gap-3">
  <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
  <p className="text-sm text-slate-700">
    <span className="font-medium text-slate-800">Instruções: </span>
    Texto aqui.
  </p>
</div>
```

Usado em: `RespostaAvaliacao.tsx:108`.

#### C — Aviso de estado (yellow)

Indica o estado atual da página (ex: rascunho, prévia). Usa ícone `Eye` em vez de `Info`, e padding assimétrico `px-4 py-3`.

```tsx
<div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200
                rounded-lg px-4 py-3">
  <Eye className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
  <p className="text-sm text-yellow-800">
    <span className="font-semibold">Prévia</span> — texto aqui.
  </p>
</div>
```

Usado em: `AvaliacaoDetalhePage.tsx:454`.

#### Regras de uso

- Sempre use `flex items-start gap-3` — nunca `items-center`, pois textos longos precisam alinhar ao topo
- Sempre adicione `mt-0.5` no ícone para alinhar visualmente com a primeira linha do texto
- Sempre adicione `flex-shrink-0` no ícone
- Variante brand (A) = informativo contextual: dados calculados, limitações, caveats
- Variante slate (B) = instrução de formulário: o que o usuário deve fazer antes de preencher
- Variante yellow (C) = aviso de estado: comunica que a página está em modo especial
- Nunca use estas variantes para erros — erros usam `text-red-600` inline abaixo do campo

---

### Estados vazios

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 4 | **Alertas:** 1

> ℹ️ **Alerta:** Esta seção está marcada para revisão. Existem inconsistências de estilo entre os estados vazios do Admin e do Colaborador — tamanhos de fonte, estilos de ícone e estrutura de container não seguem um padrão único. O formato atual é temporário e será padronizado em versão futura.

> ⚠️ **Débito 1:** Tab Habilidades (`ContentArea.tsx` linhas 1470–1486) duplica manualmente o padrão `EmptyState` com diferenças: ícone `w-6 h-6` em vez de `w-8 h-8`, wrapper `w-12 h-12` fixo em vez de responsivo, título `text-base` fixo. Deve ser substituído pelo componente canônico.

> ⚠️ **Débito 2:** Variante B tem duas hierarquias de cor no título em `MinhaCarreira.tsx` — "Sem avaliação" usa `text-gray-700`; "Sem cargo selecionado" usa `text-gray-500`. Não há distinção semântica clara. O padrão deveria ser `text-gray-700` para título em ambos os casos.

> ⚠️ **Débito 3:** Variante A passa ícone `w-8 h-8` dentro de wrapper `w-12 md:w-16` — ícone fica pequeno em desktop. Deve ser documentado como intencional ou o wrapper deve ser ajustado para `w-14 md:w-16` com ícone `w-7 md:w-8`.

> ⚠️ **Débito 4:** Variante B usa `text-gray-300` no ícone; Variante A usa `text-gray-400`. A diferença pode ser intencional (ícone orientativo mais suave) mas não está documentada.

#### Comparativo das variantes

| Variante | Contexto | Ícone | Container | Título | Descrição | Ação |
|---|---|---|---|---|---|---|
| A — EmptyState | Listas admin vazias ou sem filtro | `w-12 md:w-16 bg-gray-100 rounded-full text-gray-400` | `py-12 px-4` | `text-sm md:text-base font-medium text-gray-900` | `text-xs md:text-sm text-gray-500 max-w-md` | Opcional — brand-600 |
| B — Orientativo | Estado dependente de ação do usuário | `w-8 h-8 text-gray-300 mx-auto mb-3` (sem wrapper) | `p-8 text-center` | `text-sm font-medium text-gray-700` | `text-sm text-gray-500` | Não |
| C — Painel compacto | Dentro de drawers, espaço reduzido | Não | `py-8 bg-gray-50 rounded-lg border border-gray-200 text-center` | `text-sm text-gray-500` | `text-xs text-gray-400 mt-1` | Não |
| D — Inline mínimo | Dentro de `<td>` ou lista de busca | Não | `py-8 text-center` (td ou p) | Não | `text-sm text-gray-500` ou `text-xs text-gray-500` | Não |

#### A — EmptyState canônico

Componente: `src/app/components/ui/EmptyState.tsx`

```tsx
<EmptyState
  icon={<Layers className="w-8 h-8" />}
  title="Nenhuma competência cadastrada"
  description="Comece criando a primeira competência..."
  action={{ label: '+ Criar competência', onClick: () => {} }} // opcional
/>
```

Classes internas:
- `container`: `flex flex-col items-center justify-center py-12 px-4`
- `ícone wrapper`: `w-12 md:w-16 h-12 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400`
- `título`: `text-sm md:text-base lg:text-lg font-medium text-gray-900 mb-2`
- `descrição`: `text-xs md:text-sm lg:text-base text-gray-500 text-center max-w-md mb-6`
- `botão ação`: `px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)]`

#### B — Orientativo

```tsx
<div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
  <BarChart2 className="w-8 h-8 text-gray-300 mx-auto mb-3" />
  <p className="text-sm font-medium text-gray-700 mb-1">Nenhuma avaliação respondida ainda</p>
  <p className="text-sm text-gray-500">Responda uma avaliação para visualizar seu perfil.</p>
</div>
```

#### C — Painel compacto

```tsx
<div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
  <p className="text-sm text-gray-500">Nenhuma habilidade configurada para este cargo</p>
  <p className="text-xs text-gray-400 mt-1">Clique em "Adicionar" para vincular habilidades</p>
</div>
```

#### D — Inline mínimo

```tsx
// Dentro de <td>
<td colSpan={4} className="px-3 md:px-6 py-8 text-center text-sm text-gray-500">
  Nenhuma habilidade encontrada para os filtros aplicados.
</td>

// Lista de busca
<p className="text-xs text-gray-500 text-center py-4">Nenhuma habilidade disponível</p>
```

#### Regras de uso

- **Variante A**: Lista de entidades admin nunca teve dados · lista filtrada sem resultado · sempre que houver ação primária associável · usar `EmptyState` — nunca duplicar inline
- **Variante B**: Conteúdo ausente por inação do usuário · contexto colaborador · sem ação disponível · ícone direto sem wrapper circular
- **Variante C**: Dentro de drawers ou modais · tabela interna vazia · texto orientativo apontando ação disponível no mesmo container
- **Variante D**: Diretamente dentro de `<td>` · listas de busca com altura restrita · quando ícone e título adicionariam ruído

---

### Paginação

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 1 | **Alertas:** 0

> ⚠️ **Débito:** `ColaboradorView.tsx` ainda define `getPageNumbers()` localmente (linhas 24–40), usada pelo modo barras (aba Explorar cargos, atualmente oculta). Migrar para `Table.tsx` quando a aba for reativada.

Padrão de paginação implementado no componente `Table.tsx` (canônico).

#### Algoritmo de janela

| Condição | Sequência exibida | Exemplo com N = 20 |
|---|---|---|
| `totalPages ≤ 5` | Todas as páginas | 1 2 3 4 5 |
| `currentPage ≤ 3` | 1 2 3 4 … N | 1 2 3 4 … 20 |
| `currentPage ≥ totalPages − 2` | 1 … N−3 N−2 N−1 N | 1 … 17 18 19 20 |
| demais | 1 … p−1 p p+1 … N | 1 … 9 10 11 … 20 |

#### Classes por elemento

| Elemento | Classes Tailwind |
|---|---|
| Container footer | `flex flex-col md:flex-row items-center justify-between px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50 gap-3 md:gap-0` |
| Texto de contagem | `text-xs md:text-sm text-gray-700` |
| "Exibindo" (desktop) | `hidden md:inline` |
| Valores N, M, T | `font-medium` (em `<span>`) |
| Container de controles | `flex items-center gap-1 md:gap-2` |
| Botão Anterior / Próximo | `px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors` |
| Ícone nav (Chevron) | `w-3 md:w-4 h-3 md:h-4` |
| Container de números | `flex items-center gap-0.5 md:gap-1` |
| Número — ativo | `min-w-[32px] md:min-w-[40px] px-2 md:px-3 py-1.5 md:py-2 text-xs font-normal rounded-lg transition-colors bg-gray-100 text-gray-900 border border-gray-200` |
| Número — inativo | `min-w-[32px] md:min-w-[40px] px-2 md:px-3 py-1.5 md:py-2 text-xs font-normal rounded-lg transition-colors text-gray-600 bg-white border border-gray-300 hover:bg-gray-50` |
| Reticências (…) | `px-1 md:px-2 text-xs text-gray-400` — `<span>`, não `<button>` |

#### Regras de uso

- **Sempre usar `Table.tsx`** — passe um objeto `PaginationConfig`. Nunca copie a lógica inline.
- **Reset ao filtrar** — ao aplicar qualquer filtro ou busca, retornar para a página 1 (`setPaginaAtual(1)`).
- **Formato da contagem** — sempre **N–M de T**. "Exibindo" apenas no desktop (`hidden md:inline`). Os três valores usam `font-medium`.
- **Estado desabilitado** — Botão Anterior desabilitado na página 1; Próximo na última página. Ambos aplicam `disabled:opacity-50 disabled:cursor-not-allowed`.

---

## Regras de negócio

### Níveis e cores

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 0

Níveis são cadastrados pelo RH com nome livre e ordem de progressão (1–5). A cor é derivada automaticamente da ordem — não é configurável.

#### Ordens de progressão e cores

| Ordem | Label | Hex | Token Tailwind |
|---|---|---|---|
| 1 | Mínimo | `#60A5FA` | Blue/400 |
| 2 | Baixo | `#2563EB` | Blue/600 |
| 3 | Médio | `#4338CA` | Indigo/700 |
| 4 | Alto | `#5B21B6` | Violet/800 |
| 5 | Máximo | `#581C87` | Purple/900 |

#### Regras importantes

- A cor não é configurável — é sempre derivada da ordem.
- O RH define o nome do nível livremente (ex: "Iniciante" no lugar de "Básico").
- A ordem de progressão define a hierarquia, não o nome.
- O vínculo é nível × habilidade, não nível × avaliação.
- Ordens com o mesmo valor: desempate por ordem alfabética do nome.

#### Estados de um nível

```
Ativo → Desativado → Arquivado
       ↑
(restaurar volta para Desativado)
```

| Estado | Descrição |
|---|---|
| Ativo | Visível e selecionável no sistema. |
| Desativado | Não aparece em novas seleções, histórico preservado. |
| Arquivado | Removido das listas, histórico preservado nos relatórios. |

#### Descrições pré-definidas automáticas

| Ordem | Descrição sugerida |
|---|---|
| 1 — Mínimo | Conhecimento inicial. Realiza atividades simples com supervisão constante. |
| 2 — Baixo | Executa tarefas com autonomia em situações conhecidas. Busca suporte em contextos novos. |
| 3 — Médio | Aplica conhecimento de forma consistente. Resolve problemas com pouca supervisão. |
| 4 — Alto | Atua com autonomia em situações complexas e orienta outros profissionais. |
| 5 — Máximo | Referência na área. Define padrões, resolve problemas críticos e forma outros profissionais. |

O RH pode editar a descrição sugerida ao criar o nível. Na habilidade, pode complementar com uma descrição específica.

#### Como usar no front-end

```tsx
// A função getCorFromPeso recebe o campo 'peso' do nível
// e retorna o hex correspondente
import { getCorFromPeso } from '@/app/data/mockData';

// Renderizar badge de nível
<span
  style={{ backgroundColor: getCorFromPeso(nivel.peso) }}
  className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium text-white">
  {nivel.nome}
</span>
```

---

### Cobertura de habilidades

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 0

Mede o percentual de habilidades onde o nível atual do colaborador atende ou supera o nível esperado na matriz para o cargo.

#### Cálculo

```
cobertura = habilidades onde nivelAtual >= nivelEsperado
percentual = (cobertura / total de habilidades do cargo) × 100
```

#### Classificação

| Classificação | Percentual | Classes de cor |
|---|---|---|
| Boa cobertura | ≥ 80% | `text-green-600` · `bg-green-500` |
| Cobertura parcial | 50% a 79% | `text-yellow-600` · `bg-yellow-500` |
| Baixa cobertura | < 50% | `text-red-600` · `bg-red-500` |

#### Função de cálculo

```tsx
// src/app/utils/cobertura.ts

export interface ResultadoCobertura {
  percentual: number;
  label: string;
  cor: string;   // Tailwind text color class
  bgCor: string; // Tailwind bg color class (for progress bars)
}

// Retorna true se nivelAtual (peso) >= nivelEsperado (peso)
export function calcularCobertura(
  nivelAtual: number,
  nivelEsperado: number
): boolean

export function calcularCoberturaCargo(
  habilidadesColaborador: HabilidadeColaborador[],
  matrizCargo: MatrizCargo[],
): ResultadoCobertura
```

---

### Estados de avaliação

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 1

> ℹ️ **Alerta:** Badge Encerrada documentada com `text-gray-800` nesta seção vs `text-gray-700` em SecaoBadgesStatus. O código real usa `text-gray-700`. Verificar se foi corrigido.

O Admin gerencia o status da avaliação. O Colaborador tem um estado próprio que reflete sua participação naquela avaliação.

#### Status da avaliação (Admin)

| Status | Badge | Descrição |
|---|---|---|
| Rascunho | `bg-yellow-100 text-yellow-800` | Avaliação criada mas não publicada. Não visível para o colaborador. |
| Ativa | `bg-green-100 text-green-800` | Publicada e disponível para resposta. |
| Encerrada | `bg-gray-100 text-gray-700` | Período encerrado. Não aceita mais respostas. |

#### Estado do colaborador na avaliação

| Estado | Badge | Condição |
|---|---|---|
| Não iniciada | `bg-orange-100 text-orange-800` | Avaliação Ativa + colaborador não começou |
| Em andamento | `bg-blue-100 text-blue-800` | Avaliação Ativa + colaborador iniciou mas não concluiu |
| Concluída | `bg-green-100 text-green-800` | Avaliação Encerrada + colaborador respondeu |
| Expirada | `bg-gray-100 text-gray-700` | Avaliação Encerrada + colaborador não respondeu |

> Avaliações com status **Rascunho** nunca aparecem para o colaborador, independente do estado.

---

### Badges de status

**Status:** Documentado | **Última atualização:** 10/06/2026 | **Débitos técnicos:** 0 | **Alertas:** 0

Badges usados em todo o sistema para comunicar estado de registros.

#### Classe base dos badges

```tsx
inline-flex px-1.5 md:px-2 py-0.5 md:py-1
text-[10px] md:text-xs font-medium rounded-full
```

#### Todos os badges do sistema

**Status de registro (Admin)**

| Badge | Classes | Uso |
|---|---|---|
| Ativa | `bg-green-100 text-green-800` | Competências, Habilidades, Carreiras, Jornadas |
| Desativada | `bg-red-100 text-red-700` | Registros desativados |
| Rascunho | `bg-yellow-100 text-yellow-800` | Avaliações |
| Encerrada | `bg-gray-100 text-gray-700` | Avaliações |

**Estado do colaborador**

| Badge | Classes | Uso |
|---|---|---|
| Não iniciada | `bg-orange-100 text-orange-800` | Minhas Avaliações |
| Em andamento | `bg-blue-100 text-blue-800` | Minhas Avaliações |
| Concluída | `bg-green-100 text-green-800` | Minhas Avaliações |
| Expirada | `bg-gray-100 text-gray-700` | Minhas Avaliações |

**Habilidades do colaborador** _(texto apenas, sem fundo)_

| Indicador | Classe | Uso |
|---|---|---|
| Acima do esperado | `text-xs font-medium text-green-600` | Detalhamento |
| No esperado | `text-xs font-medium text-green-600` | Detalhamento |
| Abaixo do esperado | `text-xs font-medium text-red-500` | Detalhamento |
