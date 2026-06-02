import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

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
      </div>
    </div>
  );
}