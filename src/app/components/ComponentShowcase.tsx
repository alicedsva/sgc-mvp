import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Layers, Briefcase, Award, Construction } from 'lucide-react';
import { EmptyState } from './ui/EmptyState';

export function ComponentShowcase() {
  const [defaultValue, setDefaultValue] = useState('');
  const [hoverValue, setHoverValue] = useState('');
  const [focusValue, setFocusValue] = useState('');

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section com gradiente (similar ao Figma) */}
      <div className="relative">
        <div className="bg-white rounded-[24px] border border-[#e5e7eb] overflow-clip">
          <div className="p-[40px] relative">
            {/* Título */}
            <div className="flex flex-col gap-[20px] relative z-10">
              <div className="flex gap-[10px] items-center">
                <h1 className="font-bold text-[36px] text-[#1f2937] tracking-[0.18px] leading-normal">
                  Dropdowns Examples
                </h1>
              </div>
            </div>
            
            {/* Gradiente de fundo decorativo (simplificado) */}
            <div className="absolute h-[500px] left-0 top-0 w-[900px] pointer-events-none opacity-40">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-cyan-100 to-blue-200 blur-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Exemplos */}
      <div className="p-8 max-w-7xl">
        <div className="flex flex-col gap-[10px] mb-6">
          <h2 className="font-semibold text-[18px] text-[#1f2937] tracking-[0.09px]">
            Examples
          </h2>
          <div className="bg-[#e5e7eb] h-px w-full" />
        </div>

        {/* Grid de exemplos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Default */}
          <div className="flex flex-col gap-[15px]">
            <div className="h-[17px]">
              <p className="font-medium text-[15px] text-[#1f2937] tracking-[0.075px]">
                Default
              </p>
            </div>
            <div className="flex items-start">
              <Select value={defaultValue} onValueChange={setDefaultValue}>
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="downloads">Downloads</SelectItem>
                  <SelectItem value="team-account">Team Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hover */}
          <div className="flex flex-col gap-[15px]">
            <div className="h-[17px]">
              <p className="font-medium text-[15px] text-[#1f2937] tracking-[0.075px]">
                Hover
              </p>
            </div>
            <div className="flex items-start">
              <Select value={hoverValue} onValueChange={setHoverValue}>
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="downloads">Downloads</SelectItem>
                  <SelectItem value="team-account">Team Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-gray-500 italic mt-2">
              Passe o mouse sobre o dropdown ou os itens para ver o estado hover
            </p>
          </div>

          {/* Focus */}
          <div className="flex flex-col gap-[15px]">
            <div className="h-[17px]">
              <p className="font-medium text-[15px] text-[#1f2937] tracking-[0.075px]">
                Focus
              </p>
            </div>
            <div className="flex items-start">
              <Select value={focusValue} onValueChange={setFocusValue}>
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="downloads">Downloads</SelectItem>
                  <SelectItem value="team-account">Team Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-gray-500 italic mt-2">
              Clique no dropdown para ver os estados de foco e navegação
            </p>
          </div>

          {/* Dividers (exemplo adicional) */}
          <div className="flex flex-col gap-[15px]">
            <div className="h-[17px]">
              <p className="font-medium text-[15px] text-[#1f2937] tracking-[0.075px]">
                Dividers
              </p>
            </div>
            <div className="flex items-start">
              <Select>
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="downloads">Downloads</SelectItem>
                  <SelectItem value="team-account">Team Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* With Icons (exemplo adicional) */}
          <div className="flex flex-col gap-[15px]">
            <div className="h-[17px]">
              <p className="font-medium text-[15px] text-[#1f2937] tracking-[0.075px]">
                With Icons
              </p>
            </div>
            <div className="flex items-start">
              <Select>
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="downloads">Downloads</SelectItem>
                  <SelectItem value="team-account">Team Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Demonstração de múltiplos selects */}
        <div className="mt-16">
          <div className="flex flex-col gap-[10px] mb-6">
            <h2 className="font-semibold text-[18px] text-[#1f2937] tracking-[0.09px]">
              Uso em Formulários
            </h2>
            <div className="bg-[#e5e7eb] h-px w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="gestao">Gestão</SelectItem>
                  <SelectItem value="comunicacao">Comunicação</SelectItem>
                  <SelectItem value="lideranca">Liderança</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select defaultValue="ativa">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="inativa">Inativa</SelectItem>
                  <SelectItem value="todas">Todas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Demonstração com textos longos */}
        <div className="mt-16">
          <div className="flex flex-col gap-[10px] mb-6">
            <h2 className="font-semibold text-[18px] text-[#1f2937] tracking-[0.09px]">
              Textos Longos (Legibilidade Aprimorada)
            </h2>
            <div className="bg-[#e5e7eb] h-px w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Competência
              </label>
              <Select defaultValue="gestao-projetos">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma competência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gestao-projetos">Gestão de Projetos Complexos</SelectItem>
                  <SelectItem value="comunicacao">Comunicação Interpessoal Eficaz</SelectItem>
                  <SelectItem value="lideranca">Liderança de Equipes Multidisciplinares</SelectItem>
                  <SelectItem value="analise">Análise de Dados e Business Intelligence</SelectItem>
                  <SelectItem value="negociacao">Negociação e Resolução de Conflitos</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-2">
                Note como os itens mais altos (py-3) facilitam a leitura de textos longos
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gerência
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma gerência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ti">Gerência de Tecnologia da Informação</SelectItem>
                  <SelectItem value="rh">Gerência de Recursos Humanos e Desenvolvimento</SelectItem>
                  <SelectItem value="comercial">Gerência Comercial e Relacionamento com Clientes</SelectItem>
                  <SelectItem value="financeiro">Gerência Financeira e Controladoria</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-2">
                O item selecionado aparece em brand-500 sem ícone de check
              </p>
            </div>
          </div>
        </div>

        {/* Documentação */}
        <div className="mt-16 bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Especificações do Componente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Trigger (Campo Fechado)</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Padding: <code className="bg-white px-1.5 py-0.5 rounded">12px 8px</code> (px-3 py-2)</li>
                <li>• Largura: <code className="bg-white px-1.5 py-0.5 rounded">min 180px (fixa)</code></li>
                <li>• Tipografia: <code className="bg-white px-1.5 py-0.5 rounded">14px medium</code> (text-sm)</li>
                <li>• Altura: <code className="bg-white px-1.5 py-0.5 rounded">~38px</code></li>
                <li>• Texto longo: <code className="bg-white px-1.5 py-0.5 rounded">ellipsis (...)</code></li>
                <li>• Ícone: <code className="bg-white px-1.5 py-0.5 rounded">14x14px ChevronDown</code></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Menu Dropdown</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Raio: <code className="bg-white px-1.5 py-0.5 rounded">8px</code></li>
                <li>• Padding: <code className="bg-white px-1.5 py-0.5 rounded">4px</code> (p-1)</li>
                <li>• Altura máxima: <code className="bg-white px-1.5 py-0.5 rounded">300px</code></li>
                <li>• Largura: <code className="bg-white px-1.5 py-0.5 rounded">dinâmica (min = trigger)</code></li>
                <li>• Expansão: <code className="bg-white px-1.5 py-0.5 rounded">horizontal automática</code></li>
                <li>• Scroll: <code className="bg-white px-1.5 py-0.5 rounded">vertical apenas</code></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Itens do Menu</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Padding: <code className="bg-white px-1.5 py-0.5 rounded">12px 12px</code> (px-3 py-3)</li>
                <li>• Altura: <code className="bg-white px-1.5 py-0.5 rounded">~42px</code></li>
                <li>• Tipografia: <code className="bg-white px-1.5 py-0.5 rounded">14px medium</code></li>
                <li>• Quebra linha: <code className="bg-white px-1.5 py-0.5 rounded">nunca (whitespace-nowrap)</code></li>
                <li>• Selecionado: <code className="bg-white px-1.5 py-0.5 rounded">texto brand-500</code></li>
                <li>• Check: <code className="bg-white px-1.5 py-0.5 rounded">removido</code></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Comportamento</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Campo: <code className="bg-white px-1.5 py-0.5 rounded">largura fixa e compacta</code></li>
                <li>• Dropdown: <code className="bg-white px-1.5 py-0.5 rounded">expande conforme texto</code></li>
                <li>• Legibilidade: <code className="bg-white px-1.5 py-0.5 rounded">texto completo visível</code></li>
                <li>• Alinhamento: <code className="bg-white px-1.5 py-0.5 rounded">mantido à esquerda</code></li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">✨ Melhorias de UX</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• <strong>Campo compacto e consistente</strong>: largura fixa de 180px (min), não muda com seleção</li>
              <li>• <strong>Ellipsis no campo</strong>: textos longos truncados com (...) quando fechado</li>
              <li>• <strong>Dropdown expansível</strong>: se expande horizontalmente para mostrar texto completo</li>
              <li>• <strong>Sem quebra de linha</strong>: todos os itens em linha única (whitespace-nowrap)</li>
              <li>• <strong>Indicação elegante</strong>: item selecionado em brand-500 sem ícone de check</li>
            </ul>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* ESTADOS VAZIOS                                                 */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="mt-16" id="estados-vazios">
          <div className="flex flex-col gap-[10px] mb-6">
            <h2 className="font-semibold text-[18px] text-[#1f2937] tracking-[0.09px]">
              Estados Vazios
            </h2>
            <div className="bg-[#e5e7eb] h-px w-full" />
          </div>

          <p className="text-sm text-gray-600 mb-10 max-w-2xl">
            Levantamento de todos os estados vazios encontrados no SGC. Quatro variantes existem no código real —
            cada uma com estrutura, ícone e hierarquia de texto distintos. Inconsistências sinalizadas ao final.
          </p>

          {/* ── Variante A: EmptyState (componente canônico) ── */}
          <div className="mb-14">
            <div className="flex items-baseline gap-3 mb-2">
              <h3 className="font-semibold text-[15px] text-gray-900">A — EmptyState canônico</h3>
              <span className="text-xs text-gray-400 font-mono">ui/EmptyState.tsx</span>
            </div>
            <p className="text-sm text-gray-600 mb-6 max-w-2xl">
              Componente reutilizável. Usado nas listagens de Competências, Carreiras, Avaliações (via{' '}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">ListingPage</code>) e diretamente
              na listagem de Jornadas.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Sem dados — sem ação */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Sem dados — sem ação
                </p>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <EmptyState
                    icon={<Layers className="w-8 h-8" />}
                    title="Nenhuma competência cadastrada"
                    description="Comece criando a primeira competência para organizar as habilidades da sua organização."
                  />
                </div>
              </div>

              {/* Sem dados — com ação */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Sem dados — com ação
                </p>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <EmptyState
                    icon={<Briefcase className="w-8 h-8" />}
                    title="Nenhuma carreira cadastrada"
                    description="Comece criando a primeira carreira para estruturar as jornadas da organização."
                    action={{ label: '+ Criar carreira', onClick: () => {} }}
                  />
                </div>
              </div>

              {/* Sem resultado de filtro */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Sem resultado de filtro/busca
                </p>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <EmptyState
                    icon={<Award className="w-8 h-8" />}
                    title="Nenhum resultado encontrado"
                    description='Não encontramos resultados para "typescript avançado". Tente ajustar sua busca.'
                  />
                </div>
              </div>

              {/* Jornadas — com wrapper externo */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Jornadas — com wrapper <code className="bg-gray-100 px-1 rounded text-xs font-mono">p-8 md:p-12</code>
                </p>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <div className="p-8 md:p-12">
                    <EmptyState
                      icon={<Briefcase className="w-8 h-8" />}
                      title="Nenhuma jornada cadastrada nesta carreira"
                      description="Comece criando a primeira jornada para estruturar os cargos e competências."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Classes — EmptyState</p>
              <div className="space-y-1.5 font-mono text-xs text-gray-600">
                <div><span className="text-gray-400">container</span>  <code>flex flex-col items-center justify-center py-12 px-4</code></div>
                <div><span className="text-gray-400">ícone wrapper</span>  <code>w-12 md:w-16 h-12 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400</code></div>
                <div><span className="text-gray-400">ícone</span>  <code>w-8 h-8</code> (passado via prop)</div>
                <div><span className="text-gray-400">título</span>  <code>text-sm md:text-base lg:text-lg font-medium text-gray-900 mb-2</code></div>
                <div><span className="text-gray-400">descrição</span>  <code>text-xs md:text-sm lg:text-base text-gray-500 text-center max-w-md mb-6</code></div>
                <div><span className="text-gray-400">botão ação</span>  <code>px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors</code></div>
              </div>
            </div>
          </div>

          {/* ── Variante B: Orientativo (ColaboradorView) ── */}
          <div className="mb-14">
            <div className="flex items-baseline gap-3 mb-2">
              <h3 className="font-semibold text-[15px] text-gray-900">B — Orientativo</h3>
              <span className="text-xs text-gray-400 font-mono">ColaboradorView.tsx</span>
            </div>
            <p className="text-sm text-gray-600 mb-6 max-w-2xl">
              Usado para sinalizar que uma seção da tela ainda não tem regra de negócio fechada — placeholder
              explícito de "em construção", não um estado vazio de dados. Ícone sem wrapper circular, cor mais
              suave (<code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">text-gray-300</code>).
            </p>

            <div className="mb-6">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Seção "Detalhamento de Habilidades" (Meu Perfil) — em definição
              </p>
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <Construction className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Em construção
                </p>
                <p className="text-sm text-gray-500">
                  Esta seção ainda está em definição — não deve ser usada como referência para o desenvolvimento.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Classes — Variante B</p>
              <div className="space-y-1.5 font-mono text-xs text-gray-600">
                <div><span className="text-gray-400">container</span>  <code>bg-white border border-gray-200 rounded-lg p-8 text-center</code></div>
                <div><span className="text-gray-400">ícone</span>  <code>w-8 h-8 text-gray-300 mx-auto mb-3</code> (sem wrapper circular)</div>
                <div><span className="text-gray-400">título</span>  <code>text-sm font-medium text-gray-700 mb-1</code></div>
                <div><span className="text-gray-400">descrição</span>  <code>text-sm text-gray-500</code></div>
              </div>
            </div>
          </div>

          {/* ── Variante C: Inline em painel compacto ── */}
          <div className="mb-14">
            <div className="flex items-baseline gap-3 mb-2">
              <h3 className="font-semibold text-[15px] text-gray-900">C — Inline em painel compacto</h3>
              <span className="text-xs text-gray-400 font-mono">ConfigurarHabilidadesCargo.tsx</span>
            </div>
            <p className="text-sm text-gray-600 mb-6 max-w-2xl">
              Usado dentro de drawers ou painéis com espaço reduzido. Sem ícone. Fundo{' '}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">bg-gray-50</code> com borda para
              delimitar a área. Texto principal + texto orientativo.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Habilidades vinculadas vazio */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Tabela vazia dentro de drawer
                </p>
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-500">
                    Nenhuma habilidade configurada para este cargo
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Clique em "Adicionar" para vincular habilidades
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Classes — Variante C</p>
              <div className="space-y-1.5 font-mono text-xs text-gray-600">
                <div><span className="text-gray-400">container</span>  <code>text-center py-8 bg-gray-50 rounded-lg border border-gray-200</code></div>
                <div><span className="text-gray-400">sem ícone</span></div>
                <div><span className="text-gray-400">texto principal</span>  <code>text-sm text-gray-500</code></div>
                <div><span className="text-gray-400">texto orientativo</span>  <code>text-xs text-gray-400 mt-1</code></div>
              </div>
            </div>
          </div>

          {/* ── Variante D: Inline mínimo ── */}
          <div className="mb-14">
            <div className="flex items-baseline gap-3 mb-2">
              <h3 className="font-semibold text-[15px] text-gray-900">D — Inline mínimo</h3>
              <span className="text-xs text-gray-400 font-mono">ColaboradorView.tsx · ConfigurarHabilidadesCargo.tsx</span>
            </div>
            <p className="text-sm text-gray-600 mb-6 max-w-2xl">
              Somente texto, sem ícone, sem estrutura. Usado diretamente dentro de células de tabela{' '}
              (<code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">&lt;td&gt;</code>) ou em
              listas de busca com espaço muito reduzido.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Tabela sem resultado */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Dentro de tabela (ColaboradorView — tabela e barras)
                </p>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td colSpan={4} className="px-3 md:px-6 py-8 text-center text-sm text-gray-500">
                          Nenhuma habilidade encontrada para os filtros aplicados.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Painel de busca sem resultado */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Dentro de lista de busca (ConfigurarHabilidadesCargo — panel add)
                </p>
                <div className="max-h-48 overflow-y-auto bg-gray-50 rounded-lg border border-gray-200 p-3">
                  <p className="text-xs text-gray-500 text-center py-4">
                    Nenhuma habilidade disponível
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Classes — Variante D</p>
              <div className="space-y-1.5 font-mono text-xs text-gray-600">
                <div><span className="text-gray-400">td (ColaboradorView)</span>  <code>px-3 md:px-6 py-8 text-center text-sm text-gray-500</code></div>
                <div><span className="text-gray-400">p (ColaboradorView barras)</span>  <code>py-8 text-center text-sm text-gray-500</code></div>
                <div><span className="text-gray-400">p (panel add)</span>  <code>text-xs text-gray-500 text-center py-4</code></div>
              </div>
            </div>
          </div>

          {/* ── Tabela comparativa ── */}
          <div className="mb-14">
            <div className="flex flex-col gap-[10px] mb-6">
              <h3 className="font-semibold text-[15px] text-gray-900">Comparativo das variantes</h3>
              <div className="bg-[#e5e7eb] h-px w-full" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 border border-gray-200">Variante</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 border border-gray-200">Contexto</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 border border-gray-200">Ícone</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 border border-gray-200">Container</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 border border-gray-200">Título</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 border border-gray-200">Descrição</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 border border-gray-200">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3 border border-gray-200 font-medium">A — EmptyState</td>
                    <td className="px-4 py-3 border border-gray-200 text-gray-600">Listas admin vazias ou sem filtro</td>
                    <td className="px-4 py-3 border border-gray-200"><code className="bg-gray-100 px-1 rounded">w-12 md:w-16 bg-gray-100 rounded-full text-gray-400</code></td>
                    <td className="px-4 py-3 border border-gray-200"><code className="bg-gray-100 px-1 rounded">py-12 px-4</code></td>
                    <td className="px-4 py-3 border border-gray-200"><code className="bg-gray-100 px-1 rounded">text-sm md:text-base font-medium text-gray-900</code></td>
                    <td className="px-4 py-3 border border-gray-200"><code className="bg-gray-100 px-1 rounded">text-xs md:text-sm text-gray-500 max-w-md</code></td>
                    <td className="px-4 py-3 border border-gray-200">Opcional — brand-600</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 border border-gray-200 font-medium">B — Orientativo</td>
                    <td className="px-4 py-3 border border-gray-200 text-gray-600">Estado dependente de ação do usuário</td>
                    <td className="px-4 py-3 border border-gray-200"><code className="bg-gray-100 px-1 rounded">w-8 h-8 text-gray-300 mx-auto mb-3</code> (sem wrapper)</td>
                    <td className="px-4 py-3 border border-gray-200"><code className="bg-gray-100 px-1 rounded">p-8 text-center</code></td>
                    <td className="px-4 py-3 border border-gray-200"><code className="bg-gray-100 px-1 rounded">text-sm font-medium text-gray-700</code></td>
                    <td className="px-4 py-3 border border-gray-200"><code className="bg-gray-100 px-1 rounded">text-sm text-gray-500</code></td>
                    <td className="px-4 py-3 border border-gray-200 text-gray-400">Não</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 border border-gray-200 font-medium">C — Painel compacto</td>
                    <td className="px-4 py-3 border border-gray-200 text-gray-600">Dentro de drawers, espaço reduzido</td>
                    <td className="px-4 py-3 border border-gray-200 text-gray-400">Não</td>
                    <td className="px-4 py-3 border border-gray-200"><code className="bg-gray-100 px-1 rounded">py-8 bg-gray-50 rounded-lg border border-gray-200 text-center</code></td>
                    <td className="px-4 py-3 border border-gray-200"><code className="bg-gray-100 px-1 rounded">text-sm text-gray-500</code></td>
                    <td className="px-4 py-3 border border-gray-200"><code className="bg-gray-100 px-1 rounded">text-xs text-gray-400 mt-1</code></td>
                    <td className="px-4 py-3 border border-gray-200 text-gray-400">Não</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 border border-gray-200 font-medium">D — Inline mínimo</td>
                    <td className="px-4 py-3 border border-gray-200 text-gray-600">Dentro de td ou lista de busca</td>
                    <td className="px-4 py-3 border border-gray-200 text-gray-400">Não</td>
                    <td className="px-4 py-3 border border-gray-200"><code className="bg-gray-100 px-1 rounded">py-8 text-center</code> (td ou p)</td>
                    <td className="px-4 py-3 border border-gray-200 text-gray-400">Não</td>
                    <td className="px-4 py-3 border border-gray-200"><code className="bg-gray-100 px-1 rounded">text-sm text-gray-500</code> ou <code className="bg-gray-100 px-1 rounded">text-xs text-gray-500</code></td>
                    <td className="px-4 py-3 border border-gray-200 text-gray-400">Não</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Inconsistências sinalizadas ── */}
          <div className="mb-14">
            <div className="flex flex-col gap-[10px] mb-6">
              <h3 className="font-semibold text-[15px] text-gray-900">Inconsistências encontradas</h3>
              <div className="bg-[#e5e7eb] h-px w-full" />
            </div>

            <div className="space-y-3">
              <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-amber-600 font-bold text-sm flex-shrink-0">1</span>
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    Tab Habilidades não usa o componente <code>EmptyState</code>
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    <strong>Arquivo:</strong> ContentArea.tsx (tab habilidades, linhas 1470–1486).
                    Duplica manualmente o padrão com diferenças: ícone <code>w-6 h-6</code> em vez de{' '}
                    <code>w-8 h-8</code>, wrapper <code>w-12 h-12</code> fixo em vez de responsivo
                    (<code>w-12 md:w-16</code>), título <code>text-base</code> fixo em vez de responsivo,
                    sem botão de ação. Deve ser substituído pelo componente canônico.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-amber-600 font-bold text-sm flex-shrink-0">2</span>
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    Variante A passa ícone <code>w-8 h-8</code> dentro de wrapper <code>w-12 md:w-16</code>
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    <strong>Arquivo:</strong> EmptyState.tsx + CallerSites.
                    O ícone fica pequeno dentro do wrapper circular em desktop (8px de folga de cada lado).
                    Deve ser documentado como intencional ou o wrapper deve ser ajustado para{' '}
                    <code>w-14 md:w-16</code> com ícone <code>w-7 md:w-8</code>.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-amber-600 font-bold text-sm flex-shrink-0">3</span>
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    Variante B usa <code>text-gray-300</code> no ícone; Variante A usa <code>text-gray-400</code>
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    <strong>Arquivos:</strong> ColaboradorView.tsx vs EmptyState.tsx.
                    A diferença pode ser intencional (ícone orientativo mais suave = instrução pendente)
                    mas não está documentada. Se for padrão, deve ser adotada consistentemente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Regras de uso ── */}
          <div className="mb-4 bg-gray-50 rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-5">Regras de uso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Quando usar Variante A</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Lista de entidades admin nunca teve dados</li>
                  <li>• Lista filtrada sem resultado (via <code className="bg-white px-1.5 py-0.5 rounded">ListingPage</code>)</li>
                  <li>• Sempre que houver uma ação primária associável ao empty</li>
                  <li>• Usar <code className="bg-white px-1.5 py-0.5 rounded">EmptyState</code> — nunca duplicar inline</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Quando usar Variante B</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Seção com regra de negócio ainda não fechada (placeholder "em construção")</li>
                  <li>• Contexto colaborador (ex: MeuPerfil)</li>
                  <li>• Sem ação disponível no estado vazio</li>
                  <li>• Ícone direto <code className="bg-white px-1.5 py-0.5 rounded">text-gray-300</code>, sem wrapper circular</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Quando usar Variante C</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Dentro de drawers ou modais com espaço limitado</li>
                  <li>• Tabela interna vazia (não lista principal da tela)</li>
                  <li>• Texto orientativo apontando a ação disponível no mesmo container</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Quando usar Variante D</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Diretamente dentro de <code className="bg-white px-1.5 py-0.5 rounded">&lt;td&gt;</code> de tabela</li>
                  <li>• Listas de busca em tempo real com altura restrita</li>
                  <li>• Quando ícone e título adicionariam ruído sem benefício</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
        {/* ══ FIM ESTADOS VAZIOS ══ */}

      </div>
    </div>
  );
}