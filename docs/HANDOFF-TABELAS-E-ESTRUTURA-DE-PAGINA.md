# Handoff — Padrão de Tabelas e Estrutura de Página (SGC)

> Documento escrito em **2026-09-17**, com base em auditoria direta do código do protótipo (não é resumo de memória nem suposição) e em comparação visual entre o protótipo e o build atual do desenvolvedor. Cobre dois assuntos: (1) a especificação definitiva de como toda tabela e toda página do sistema devem ser construídas, e (2) os pontos onde o build do dev diverge dessa especificação, tela por tela. Siga exatamente o que está aqui — não simplifique, não invente comportamento, não reorganize estrutura. Onde algo for uma exceção documentada, ela está marcada como tal; tudo o mais é regra geral, sem exceção.

Todo caminho de arquivo citado é relativo à raiz do repositório do protótipo (Claude Code), não do build do dev.

---

## Parte 1 — Especificação definitiva

### a. Visão geral e arquitetura

Toda tabela de listagem do sistema é construída sobre um componente único e compartilhado: `ui/Table.tsx`. Duas formas de uso:

- **Via `templates/ListingPage.tsx`** — quando a tela só precisa de busca + 1 filtro de status (Carreiras, Competências, Avaliações, Histórico de Avaliações do colaborador). `ListingPage` já entrega toolbar, `Table`, paginação e estado vazio prontos.
- **Direto (`<Table>` cru + toolbar manual)** — quando a tela precisa de mais filtros do que `ListingPage` oferece (Habilidades, com 3 filtros: Competência, Tipo, Status; Perfis, com Gerência, Cargo, Status). Essa é uma exceção **sancionada**, não um desvio — sempre que uma tela precisar de mais de 1 filtro além da busca, o caminho correto é replicar esse padrão (toolbar própria + `<Table>` direto), não estender `ListingPage`.

`Table.tsx` já inclui, no seu `<div>` raiz, a moldura do card (ver seção **c**) — nenhuma tela precisa repetir isso por fora. Quando uma tela precisa compor a tabela dentro de um card que já tem outro cabeçalho/filtro (ex: telas de detalhe com pills-no-cartão), existe uma prop `bare` que desliga a moldura interna, para não duplicar.

Perfis foi completamente reconstruída para deixar de ser uma implementação própria e passou a viver dentro do mesmo arquivo/padrão das outras 4 listagens principais (não é mais um componente separado).

---

### a2. Estrutura geral da página (fora da tabela)

Isso não é sobre a tabela — é sobre a "casca" da página em que ela vive. Valores auditados diretamente no código, idênticos nas 4 telas principais (Perfis, Habilidades, Carreiras, Avaliações), salvo onde indicado.

**Casca fixa (`Layout.tsx` / `Sidebar.tsx` / `Header.tsx`)**
- Sidebar: `w-64` (256px) expandida / `w-20` (80px) recolhida, `fixed left-0 top-0`, `z-50`.
- Header: `h-16` (64px), `fixed top-0 right-0`, `z-50`, offset esquerdo `` left-0 ${isSidebarCollapsed ? 'md:left-20' : 'md:left-64'} `` (condicional a sidebar expandida — a partir de `md:`/768px, corrigido em 2026-09-17 para eliminar a sobreposição que existia entre 768-1023px quando a sidebar era expandida manualmente).
- Colapso automático da sidebar: **não** usa breakpoint Tailwind — é `window.innerWidth` em `useEffect` (`Layout.tsx:66-101`), com limiares customizados: ≥1440px expandida, 768-1439px recolhida, <768px oculta. O limiar subiu de 1200 para 1440 de propósito, porque a sidebar de 256px comia espaço útil demais em notebooks (1280/1366px). **Risco a confirmar com o dev:** por ser JS (`resize`), não reage a zoom da mesma forma que uma media query CSS — pode deixar a sidebar "no estado errado" depois de certos zooms sem resize real de janela.
- Não existe `display: grid` na casca. É 100% posicionamento fixo (sidebar/header) + margin/padding compensatório no conteúdo.

**Container de conteúdo (repetido, idêntico, em cada tela)**

<main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}> <div className="p-4 md:p-8"> {/* título + conteúdo */} </div> </main> ``` - `mt-16` compensa a altura do Header (64px). `` ml-0 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} `` compensa a sidebar — reage a partir de `md:`/768px (corrigido em 2026-09-17; antes o salto para `lg:ml-64` só acontecia em `lg:`/1024px, causando sobreposição de conteúdo se a sidebar fosse expandida manualmente entre 768-1023px). - Padding do conteúdo: **`p-4 md:p-8`** — 16px mobile / **32px desktop**. Esse é o respiro entre a borda da área útil e o primeiro elemento da página (o título). - Não existe componente `PageShell`/`PageContainer` compartilhado — esse bloco é copiado manualmente em cada branch. Qualquer ajuste futuro no padrão precisa ser replicado em todas as ocorrências.

Título e subtítulo (obrigatórios, sempre)

H1: text-2xl font-semibold text-gray-900.
Subtítulo: text-sm text-gray-500 mt-1 — SEMPRE presente, em toda tela de listagem principal. Não é opcional, não é uma decisão de produto por tela — é o padrão do sistema. Se uma tela não tem subtítulo no build do dev, é omissão, não escolha.
Espaço entre o bloco de título e a toolbar de filtros abaixo: mb-6 (24px), aplicado no <div> que envolve H1+subtítulo.
Exceção de fluxo, não de valor: em Habilidades, entre o título e a toolbar existe a barra de abas (Competências/Níveis de Habilidades/Habilidades) — o espaçamento então é título→abas (24px) e abas→toolbar (mb-6 md:mb-8, ou seja 24px mobile / 32px desktop), porque as abas se intercalam. Nas outras 3 telas, é direto: título→toolbar em 24px.

Toolbar de filtros e tabela são CAIXAS SEPARADAS
Isso é estrutural, não estético — são dois elementos irmãos, cada um com sua própria moldura:

Toolbar: bg-white rounded-lg border border-gray-200 p-3 md:p-4.
Tabela: bg-white rounded-lg border border-gray-200 overflow-hidden (vem de dentro de Table.tsx, não repetido pela tela).
Espaço entre as duas: 24px, via space-y-6 no container pai que as envolve.

Achado de código morto, sinalizado para não confundir quem for construir o build: templates/ListingPage.tsx:87-88 tem um bloco de título embutido próprio, com subtítulo em text-sm text-gray-600 mt-2 — uma classe diferente da usada em todo o resto do sistema (text-gray-500 mt-1). Esse bloco nunca renderiza na prática (nenhuma tela passa as props title/subtitle para ele) — é código morto, e a classe divergente não deve ser copiada como referência.

b. Tipografia de tabela
Elemento	Classe	Observação
Cabeçalho (<th>)	text-[10px] font-semibold text-gray-500 uppercase tracking-wider	Fixo — não cresce em tela grande. Decisão definitiva de 2026-09-15/16, substituiu um padrão antigo responsivo (md:text-xs) e o peso antigo (font-medium).
Célula de dado (<td>)	text-xs text-gray-900	Fixo — não cresce em tela grande. Mesma decisão.
Badge (Status/Tipo)	px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full	Este SIM é responsivo (10px mobile → 12px desktop). Não confundir com a regra de cabeçalho/célula acima — badge tem regra própria.
Número + palavra (contagens, ex: "118 habilidades")	Componente QuantityLabel — número font-semibold text-gray-900, palavra font-normal text-gray-500	Nunca escrever à mão; sempre usar o componente.
c. Moldura e padding
Moldura do card de tabela (bg-white rounded-lg border border-gray-200 overflow-hidden) já vem de dentro de Table.tsx — nenhuma tela precisa desenhar isso por fora.
Padding de célula (<th> e <td>): px-3 md:px-6 py-3 md:py-4 — este é responsivo: 12px/24px horizontal, 12px/16px vertical. É o "respiro" entre o texto e a linha divisória de cima/baixo de cada linha.
Padding da toolbar de filtros: p-3 md:p-4.
d. Cores
Cabeçalho (<thead>): bg-gray-50 border-b border-gray-200.
Divisórias de linha: divide-y divide-gray-200.
Hover de linha clicável (só quando há navegação ao clicar): rgba(0,159,194,0.06).
Bordas de card/tabela: border-gray-200 (nunca border-gray-300 ou outro tom).
Sombra da coluna fixa ao rolar (ver seção h): shadow-[4px_0_6px_-4px_rgba(0,0,0,0.15)] (borda esquerda) / shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.15)] (borda direita, coluna Ações).
e. Coluna de Ações
Largura fixa: w-20 md:w-24 (80px / 96px) — a mesma em toda tabela do sistema, sem exceção.
Regra de exibição: 1-2 ações = ícones soltos (cada um com Tooltip); 3 ou mais ações = menu (ícone MoreVertical, abre DropdownMenu, cada item com ícone + texto por extenso).
Tooltip de ação sempre via componente compartilhado (ui/tooltip.tsx, Radix) — nunca o atributo title nativo do HTML.
f. Quebra de linha vs. corte de texto

Regra que separa cabeçalho de célula — são tratamentos diferentes:

Cabeçalho: nunca corta com "...". Sempre quebra em até 2 linhas quando o espaço aperta. Todo botão de cabeçalho ordenável precisa ter text-left (ou text-start) explícito — sem isso, o <button> herda text-align: center do navegador, e o texto centraliza de forma imprevisível quando quebra em 2 linhas.
Célula de dado (texto longo/descrição): corta com "..." só depois de tentar quebrar em até 2 linhas — line-clamp-2 break-words, com Tooltip mostrando o texto completo. break-words é obrigatório junto do line-clamp (sem ele, uma palavra única muito longa estoura a largura fixa da coluna).
Célula de dado (nome curto): 1 linha + Tooltip quando o nome puder passar da largura da coluna.
g. Filtros
Padrão definitivo: chip — um botão fechado mostrando Rótulo: valor atual, que abre um popover com as opções ao clicar. Substituiu completamente o formato antigo de pills/segmented control sempre visíveis, em todas as listagens principais.
Ordem das opções, sempre: Todas → Ativas → Desativadas (nunca "Todos" por último, nunca invertido).
Valor interno (nome usado no código, não visível na tela): 'todas' / 'ativa' / 'desativada' — nunca 'inativa', nunca com acento (ex: 'concluida', não 'concluída').
Exceção sancionada: telas de detalhe/drill-down cujo filtro é de nível de proficiência (não é Ativa/Desativada) continuam em pills-dentro-do-cartão, sem busca — CompetenciaDetalhePage.tsx, ParticipanteResultadoPage.tsx, MinhaCarreiraPage.tsx (seção Mapeamento de competências).
h. Coluna fixa (sticky) + rolagem em tela de notebook
Quando aplicar: só nas tabelas cujas colunas de dado, nas larguras típicas de notebook (1280-1440px, com a sidebar real), esmagariam o texto ou gerariam scroll horizontal indesejado. Hoje isso vale para Habilidades e Avaliações (6 e 8 colunas respectivamente). Não se aplica a Carreiras e Competências (3 e 4 colunas — cabem confortavelmente).
A capacidade fica sempre disponível no componente Table.tsx (não é uma decisão manual por tela) — ela só "acorda" visualmente quando a tabela realmente excede a largura disponível; nas tabelas que já cabem, fica inofensiva.
Mecanismo: um piso de largura mínima (min-w-[1280px]) força a tabela a rolar horizontalmente em vez de espremer colunas. A 1ª coluna de dado e a coluna de Ações ficam fixas (position: sticky) durante a rolagem.
Indicador visual: sombra (não linha/borda), condicionada ao estado de scroll, com histerese para evitar oscilação — aparece quando scrollLeft > 2px, desaparece só quando scrollLeft <= 0 (ver classes na seção d).
i. Paginação
Padrão: 10 itens por página, com um seletor no rodapé (10 / 25 / 50), posicionado ao lado do texto "Exibindo X–Y de Z".
O seletor some quando o total de itens é ≤10 (não há motivo para oferecer uma opção que não mudaria nada).
O seletor fica oculto em telas mobile (hidden md:flex) — a navegação de página (Anterior/Próximo) continua visível.
j. Componente QuantityLabel

Todo "número + palavra" (contagens do tipo "118 habilidades", "5 níveis", "8 jornadas") usa esse componente compartilhado — número em font-semibold text-gray-900, palavra em font-normal text-gray-500, sem tamanho de fonte próprio (herda o da célula onde é usado). Nunca escrever esse padrão à mão numa tela nova.

k. Exceções documentadas (lista consolidada)

Cada uma abaixo é uma decisão consciente, não um desvio acidental — todas foram avaliadas e aprovadas.

Perfis — não é mais exceção estrutural: foi migrada para o mesmo padrão das outras 4 listagens principais (chip, Table.tsx, QuantityLabel, etc.), com toolbar manual (3 filtros) pelo mesmo motivo já explicado em a.
NiveisProficiencia.tsx (aba "Níveis de Habilidades") — a coluna Descrição não tem corte de texto (nem line-clamp nem Tooltip). Motivo: são as descrições fixas dos 5 níveis do sistema — conteúdo controlado, não texto variável de usuário. O padding da célula, porém, segue o padrão responsivo normal.
Matriz de Habilidades (dentro de uma Jornada) — tabela construída à parte (não usa Table.tsx), por ser uma matriz dinâmica (colunas variam por cargo). Três pontos aceitos como exceção: (a) o cabeçalho de cargo pode truncar com "...", diferente da regra geral da seção f; (b) o menu de ações é um mecanismo próprio, não o DropdownMenu compartilhado; (c) usa o mesmo mecanismo de sombra condicional da seção h, mas aplicado manualmente (não herda de Table.tsx).
CompetenciaDetalhePage.tsx / ParticipanteResultadoPage.tsx / MinhaCarreiraPage.tsx — filtro de proficiência em pills-no-cartão (ver seção g).
DashboardPage.tsx — tabelas construídas à parte, com uma exceção de cor já documentada (cabeçalho sem bg-gray-50, só borda inferior) e uma exceção de padding também documentada (sem crescer em tela grande, sem a anatomia de container/borda de Table.tsx). Fora do escopo deste handoff (é dashboard, não listagem).
Parte 2 — Comparação com o build atual do desenvolvedor

Os pontos abaixo foram levantados comparando prints lado a lado (protótipo × build do dev). Onde a tela do dev ainda não foi construída ou está claramente em progresso (ex: formulário de Nova Avaliação), isso está marcado como "pendente", não como erro.

l. Achados que se repetem em praticamente toda tela
Filtro em pills, não chip, em todo lugar. O build do dev mantém o formato antigo (pills sempre visíveis) em todas as telas — Habilidades, Carreiras, Avaliações, Perfis. O chip (ver seção g) é o padrão definitivo desde a versão mais recente do protótipo; nenhuma tela do dev usa esse componente hoje. Este é o achado de maior impacto — é a peça central da mudança feita no protótipo.
Sem seletor de itens-por-página. Em nenhum rodapé de tabela do dev aparece o controle 10/25/50 (seção i) — só "Exibindo X de Y" e a navegação de página.
Sem destaque no número das contagens. Onde deveria aparecer "118 habilidades" (número em negrito, ver QuantityLabel, seção j), o build do dev mostra tudo no mesmo peso de fonte.
Subtítulo ausente em toda página. Nenhuma tela do dev (Perfis, Habilidades, Carreiras, Avaliações) tem o subtítulo abaixo do título — que é obrigatório no padrão (seção a2). Perguntar ao dev se essa foi uma decisão de negócio nova; se foi, precisa estar documentada — hoje não está em lugar nenhum.
Título da página parece menor que o protótipo. O H1 do protótipo é text-2xl font-semibold (seção a2) — pedir ao dev para confirmar/ajustar o tamanho real usado no build.
Botão sem padrão único entre telas. Tamanho e formato do botão primário mudam de tela pra tela no build do dev; no protótipo é um único padrão, sem variação.
Container de filtros colado na tabela. No protótipo são duas caixas visualmente separadas, com 24px de espaço entre elas (seção a2) — no build do dev, os filtros parecem fazer parte do mesmo bloco visual da tabela, sem a separação.
Espaçamento geral mais condensado. Linhas de tabela com menos respiro entre o texto e a divisória (comparar com o padding exato da seção c); espaço entre título e conteúdo também parece menor que os 24px/32px documentados na seção a2. Pedir ao dev os valores reais usados, pra comparar contra a especificação.
Badge de Tipo/Status com borda, no dev. O protótipo nunca usa borda em badge — só fundo colorido sólido por categoria (ex: Técnica com um tom, Comportamental com outro). O build do dev parece ter adicionado uma borda e possivelmente mudado a cor.
m. Perfis
Filtro de status na ordem antiga (Ativos → Desativados → Todos) — a ordem correta e definitiva é Todos → Ativos → Desativados (seção g; note que em Perfis o gênero é masculino, "Ativos"/"Desativados", diferente das outras telas que usam feminino).
Badge de status mostra "Ativa" (feminino) — o correto para perfil (substantivo masculino) é "Ativo".
A bolinha de indicador de sincronização usa 3 cores no build do dev (verde / laranja-ou-vazio / vermelho); no protótipo só existem 2 estados (verde = sincronizado, vermelho = dados desatualizados). Perguntar ao dev se o terceiro estado é intencional — se for, precisa ser documentado como decisão nova; se não, é divergência a corrigir.
Sem subtítulo (ver achado geral #4).
n. Habilidades (3 abas: Competências, Níveis de Habilidades, Habilidades)
Sem subtítulo (achado geral #4).
Linhas visivelmente mais condensadas que o protótipo, confirmando o achado geral #8 — comparar padding exato de célula (seção c).
Badges das colunas Tipo e Status usam borda e possivelmente cor diferente do protótipo (achado geral #9) — confirmar com o dev qual paleta ele usou e comparar com o padrão documentado.
"Peso do Nível" (aba Níveis de Habilidades): no build do dev, o número aparece em peso normal, sem destaque. Isso é esperado por ora — a decisão de deixar esse número em negrito (mesmo padrão de QuantityLabel, seção j) é recente no protótipo; não tratar como "erro" do dev, e sim como atualização a passar pra ele.
o. Carreiras / Jornadas (dentro de Carreira) / Colaboradores (dentro de Jornada) / Matriz de Habilidades
Sem subtítulo (achado geral #4).
Na aba Jornadas: os filtros aparecem deslocados — o botão de ação principal precisa estar sempre à direita, o resto dos controles (busca, filtro) à esquerda; confirmar o alinhamento real usado pelo dev contra esse padrão.
Tela "Criar Jornada" está completamente diferente do protótipo — os blocos de conteúdo (seções do formulário) foram respeitados, mas o conteúdo dentro deles não. Este ponto precisa de um adendo separado e minucioso (componente por componente, gap por gap, padding por padding, texto/copy exato), porque a divergência é grande demais para resumir numa lista de bullets — recomenda-se anexar prints lado a lado com anotação direta sobre cada elemento.
O sistema (protótipo) não usa breadcrumb nessa tela; confirmar se o build do dev usa e, se sim, perguntar se foi decisão de navegação nova.
Perguntar ao dev por que não foi usado o botão de ação no rodapé da tela (Cancelar/Criar), como o protótipo especifica.
p. Avaliações
Sem subtítulo (achado geral #4).
Tela de detalhe de avaliação (/avaliacoes/:id) precisa ser atualizada para o formato mais recente do protótipo — faltam as abas "Habilidades / Colaboradores" que a versão atual tem, e a tabela de participantes do build do dev não tem cabeçalho ordenável nem a mesma estrutura de colunas (Cargo/Gerência) que o protótipo mostra.
q. Formulários (drawers/modais de criação)

Nova Habilidade

O botão "Continuar" (troca de aba dentro do drawer, não submete o formulário) deveria ser secundário (contorno) — no build do dev está primário (preenchido). Inverter.
O card informativo "Como funciona o cadastro" é fixo, sem interação no protótipo — não tem seta de collapse/expandir. No build do dev, esse card pode ser fechado/aberto, o que é um comportamento novo que não deveria ter sido adicionado.

Nova Carreira

O build do dev tem hoje só o campo "Nome da carreira" — faltam o texto explicativo "Como funciona" (que explica que cada carreira representa uma gerência real da empresa) e o campo de Gerência (que deveria ser um select com busca, mostrando a lista completa de gerências ao abrir, não um campo comum vazio). Precisa do mesmo nível de detalhe minucioso pedido para "Criar Jornada" (seção o).

Nova Avaliação

Ainda não foi construída no formato do protótipo — não é bug, é trabalho pendente do dev. Registrando aqui como referência para quando ele chegar nessa parte: o fluxo do protótipo tem 5 passos (Público → Identificação → Habilidades → Prazo → Revisão), começando por uma decisão estrutural que não existe em nenhum outro formulário do sistema — se a avaliação será definida "Por Jornada de Carreira" (habilidades e participantes vêm automaticamente da matriz da jornada escolhida) ou "Por Público-alvo" (o admin escolhe manualmente gerências, colaboradores e habilidades). Essa bifurcação inicial muda o restante do fluxo e precisa ser detalhada em um adendo próprio quando o dev chegar a essa tela.
Nota final

Este documento cobre o que foi auditado até 2026-09-17. Qualquer mudança futura no padrão de tabela ou na estrutura de página deve ser refletida aqui — e, na direção contrária, qualquer divergência nova encontrada no build do dev deve ser registrada na Parte 2, tela por tela, no mesmo formato usado acima (o que é, onde está, por que diverge, o que pedir).
