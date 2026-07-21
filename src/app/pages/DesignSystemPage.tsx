import { useState } from 'react';
import {
  Info, Palette, Layout, BookOpen, Briefcase, User, ChevronRight,
  Settings, LayoutDashboard, Award, UserCircle, ClipboardList, ClipboardCheck,
  TrendingUp, Users, CheckCircle2, Clock, CalendarClock, AlertCircle, XCircle,
  Eye, EyeOff, Pencil, Power, RefreshCw, Archive, ChevronLeft, ChevronDown, ChevronUp,
  Plus, Download, Search, X, AlertTriangle, ArrowLeft,
  Layers, Calendar, Wrench, Construction,
  Bell, ArrowLeftRight, LogOut, Menu, Activity, Monitor,
} from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { getCorFromPeso, niveisDefaultData } from '../data/mockData';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

type SectionId =
  | 'home'
  | 'fundamentos/cores'
  | 'fundamentos/tipografia'
  | 'fundamentos/espacamento'
  | 'fundamentos/icones'
  | 'componentes/botoes'
  | 'componentes/badges'
  | 'componentes/tabelas'
  | 'componentes/filtros-pills'
  | 'componentes/cards'
  | 'componentes/drawers'
  | 'componentes/modais'
  | 'componentes/formularios'
  | 'padroes/navegacao'
  | 'padroes/mensagens-orientacao'
  | 'padroes/estados-vazios'
  | 'padroes/paginacao'
  | 'regras/niveis-cores'
  | 'regras/cobertura-habilidades'
  | 'regras/estados-avaliacao'
  | 'regras/badges-status'
  | 'regras/jornadas-e-matriz'
  | 'telas-admin/matriz-habilidades'
  | 'telas-admin/criar-editar-jornada'
  | 'colaborador/meu-perfil'
  | 'colaborador/minhas-avaliacoes'
  | 'colaborador/minha-carreira';

type NavItem = { id: SectionId; label: string; }

type NavGroup = {
  label: string;
  items?: NavItem[];
  subgroups?: {
    label: string;
    id: string;
    items: NavItem[];
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Fundamentos',
    items: [
      { id: 'fundamentos/cores', label: 'Cores' },
      { id: 'fundamentos/tipografia', label: 'Tipografia' },
      { id: 'fundamentos/espacamento', label: 'Espaçamento' },
      { id: 'fundamentos/icones', label: 'Ícones' },
    ],
  },
  {
    label: 'Componentes',
    items: [
      { id: 'componentes/botoes', label: 'Botões' },
      { id: 'componentes/badges', label: 'Badges' },
      { id: 'componentes/tabelas', label: 'Tabelas' },
      { id: 'componentes/filtros-pills', label: 'Filtros e Pills' },
      { id: 'componentes/cards', label: 'Cards' },
      { id: 'componentes/drawers', label: 'Drawers' },
      { id: 'componentes/modais', label: 'Modais' },
      { id: 'componentes/formularios', label: 'Formulários' },
    ],
  },
  {
    label: 'Padrões',
    items: [
      { id: 'padroes/navegacao', label: 'Navegação' },
      { id: 'padroes/mensagens-orientacao', label: 'Mensagens de orientação' },
      { id: 'padroes/estados-vazios', label: 'Estados vazios' },
      { id: 'padroes/paginacao', label: 'Paginação' },
    ],
  },
  {
    label: 'Regras de negócio',
    items: [
      { id: 'regras/niveis-cores', label: 'Níveis e cores' },
      { id: 'regras/cobertura-habilidades', label: 'Cobertura de habilidades' },
      { id: 'regras/estados-avaliacao', label: 'Estados de avaliação' },
      { id: 'regras/badges-status', label: 'Badges de status' },
      { id: 'regras/jornadas-e-matriz', label: 'Jornadas e Matriz' },
    ],
  },
  {
    label: 'Especificação de Telas',
    subgroups: [
      {
        label: 'Admin / RH',
        id: 'telas-admin',
        items: [
          { id: 'telas-admin/matriz-habilidades', label: 'Matriz de Habilidades' },
          { id: 'telas-admin/criar-editar-jornada', label: 'Criar / Editar Jornada' },
        ],
      },
      {
        label: 'Gestor',
        id: 'telas-gestor',
        items: [],
      },
      {
        label: 'Colaborador',
        id: 'telas-colaborador',
        items: [
          { id: 'colaborador/meu-perfil', label: 'Meu Perfil' },
          { id: 'colaborador/minhas-avaliacoes', label: 'Minhas Avaliações' },
          { id: 'colaborador/minha-carreira', label: 'Minha Carreira' },
        ],
      },
    ],
  },
];


const QUICK_ACCESS = [
  { groupId: 'fundamentos', label: 'Fundamentos', description: 'Cores, tipografia, espaçamento e ícones do sistema.', icon: Palette, firstSection: 'fundamentos/cores' as SectionId },
  { groupId: 'componentes', label: 'Componentes', description: 'Botões, tabelas, cards, drawers, modais e formulários.', icon: Layout, firstSection: 'componentes/botoes' as SectionId },
  { groupId: 'padroes', label: 'Padrões', description: 'Navegação, estados vazios, mensagens de orientação.', icon: BookOpen, firstSection: 'padroes/navegacao' as SectionId },
  { groupId: 'regras', label: 'Regras de negócio', description: 'Níveis, cobertura, estados de avaliação e badges.', icon: Briefcase, firstSection: 'regras/niveis-cores' as SectionId },
  { groupId: 'telas', label: 'Especificação de Telas', description: 'Telas documentadas por perfil de acesso: Admin/RH, Gestor e Colaborador.', icon: Monitor, firstSection: 'telas-admin/matriz-habilidades' as SectionId },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) =>
  g.items ?? g.subgroups?.flatMap(sg => sg.items) ?? []
);

const BADGE_BASE = 'inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full';

// ─── SectionMeta ──────────────────────────────────────────────────────────────

type SectionMetaProps = {
  status: 'documentado' | 'em-construcao' | 'desatualizado';
  ultimaAtualizacao: string | null;
  debitosTecnicos: number;
  alertas: number;
};

function SectionMeta({ status, ultimaAtualizacao, debitosTecnicos, alertas }: SectionMetaProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8 items-stretch">
      <div className={`border rounded-lg p-4 flex flex-col gap-3 ${
        status === 'documentado' ? 'bg-green-50 border-green-200' :
        status === 'em-construcao' ? 'bg-yellow-50 border-yellow-200' :
        'bg-red-50 border-red-200'
      }`}>
        {status === 'documentado' && <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-600" />}
        {status === 'em-construcao' && <Clock className="w-4 h-4 flex-shrink-0 text-yellow-600" />}
        {status === 'desatualizado' && <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />}
        <div>
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <p className="text-sm font-semibold leading-tight">
            {status === 'documentado' ? 'Documentado' : status === 'em-construcao' ? 'Em construção' : 'Desatualizado'}
          </p>
        </div>
      </div>
      <div className="border rounded-lg p-4 flex flex-col gap-3 bg-white border-gray-200">
        <Calendar className="w-4 h-4 flex-shrink-0 text-gray-400" />
        <div>
          <p className="text-xs text-gray-500 mb-1">Última atualização</p>
          <p className={`text-sm font-semibold leading-tight ${!ultimaAtualizacao ? 'text-gray-400 italic' : ''}`}>
            {ultimaAtualizacao ?? 'Não commitado'}
          </p>
        </div>
      </div>
      <div className={`border rounded-lg p-4 flex flex-col gap-3 ${
        debitosTecnicos > 0 ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'
      }`}>
        <Wrench className={`w-4 h-4 flex-shrink-0 ${debitosTecnicos > 0 ? 'text-orange-600' : 'text-gray-400'}`} />
        <div>
          <p className="text-xs text-gray-500 mb-1">Débitos técnicos</p>
          <p className={`text-sm font-semibold leading-tight ${debitosTecnicos > 0 ? 'text-orange-600' : ''}`}>
            {debitosTecnicos}
          </p>
        </div>
      </div>
      <div className={`border rounded-lg p-4 flex flex-col gap-3 ${
        alertas > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'
      }`}>
        <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${alertas > 0 ? 'text-yellow-600' : 'text-gray-400'}`} />
        <div>
          <p className="text-xs text-gray-500 mb-1">Alertas</p>
          <p className={`text-sm font-semibold leading-tight ${alertas > 0 ? 'text-yellow-600' : ''}`}>
            {alertas}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Seção: Níveis e cores ────────────────────────────────────────────────────

const ORDENS_PROGRESSAO = [
  { ordem: 1, label: 'Mínimo', hex: '#60A5FA', token: 'Blue/400' },
  { ordem: 2, label: 'Baixo', hex: '#2563EB', token: 'Blue/600' },
  { ordem: 3, label: 'Médio', hex: '#4338CA', token: 'Indigo/700' },
  { ordem: 4, label: 'Alto', hex: '#5B21B6', token: 'Violet/800' },
  { ordem: 5, label: 'Máximo', hex: '#581C87', token: 'Purple/900' },
];

const DESCRICOES_SUGERIDAS = [
  { ordem: '1 — Mínimo', desc: 'Conhecimento inicial. Realiza atividades simples com supervisão constante.' },
  { ordem: '2 — Baixo', desc: 'Executa tarefas com autonomia em situações conhecidas. Busca suporte em contextos novos.' },
  { ordem: '3 — Médio', desc: 'Aplica conhecimento de forma consistente. Resolve problemas com pouca supervisão.' },
  { ordem: '4 — Alto', desc: 'Atua com autonomia em situações complexas e orienta outros profissionais.' },
  { ordem: '5 — Máximo', desc: 'Referência na área. Define padrões, resolve problemas críticos e forma outros profissionais.' },
];

const REGRAS_NIVEIS = [
  'A cor não é configurável — é sempre derivada da ordem.',
  'O RH define o nome do nível livremente (ex: "Iniciante" no lugar de "Básico").',
  'A ordem de progressão define a hierarquia, não o nome.',
  'O vínculo é nível × habilidade, não nível × avaliação.',
  'Ordens com o mesmo valor: desempate por ordem alfabética do nome.',
];

function SecaoNiveisCores() {
  const nomesPorOrdem: Record<number, string> = {};
  niveisDefaultData.forEach((n) => { nomesPorOrdem[n.peso] = n.nome; });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Níveis e cores</h1>
      <p className="text-sm text-gray-600 mb-4">
        Níveis são cadastrados pelo RH com nome livre e ordem de progressão (1–5). A cor é derivada
        automaticamente da ordem — não é configurável.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={0} />

      {/* Bloco 1 — Tabela de ordens */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Ordens de progressão e cores</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Ordem</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Label</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Hex</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Token Tailwind</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ORDENS_PROGRESSAO.map(({ ordem, label, hex, token }) => (
                <tr key={ordem} className="bg-white">
                  <td className="px-4 py-3 text-gray-600">{ordem}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{label}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{hex}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{token}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: hex }}
                    >
                      {nomesPorOrdem[ordem] ?? label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bloco 2 — Regras importantes */}
      <div className="mb-8">
        <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-1" />
          <ul className="text-sm text-[var(--brand-700)] space-y-1.5 list-none">
            {REGRAS_NIVEIS.map((regra) => (
              <li key={regra}>{regra}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bloco 3 — Ciclo de vida */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Estados de um nível</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-center font-mono text-xs text-gray-700 leading-loose">
          <p>Ativo → Desativado → Arquivado</p>
          <p className="text-gray-400 tracking-wide">↑</p>
          <p className="text-gray-400">(restaurar volta para Desativado)</p>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { estado: 'Ativo', desc: 'Visível e selecionável no sistema.' },
            { estado: 'Desativado', desc: 'Não aparece em novas seleções, histórico preservado.' },
            { estado: 'Arquivado', desc: 'Removido das listas, histórico preservado nos relatórios.' },
          ].map(({ estado, desc }) => (
            <div key={estado} className="flex gap-3 text-sm">
              <span className="font-medium text-gray-900 w-24 flex-shrink-0">{estado}</span>
              <span className="text-gray-500">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bloco 4 — Descrições sugeridas */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Descrições pré-definidas automáticas</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 w-36">Ordem</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Descrição sugerida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DESCRICOES_SUGERIDAS.map(({ ordem, desc }) => (
                <tr key={ordem} className="bg-white">
                  <td className="px-4 py-3 font-medium text-gray-900 text-xs whitespace-nowrap">{ordem}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          O RH pode editar a descrição sugerida ao criar o nível. Na habilidade, pode complementar
          com uma descrição específica para aquela habilidade.
        </p>
      </div>

      {/* Bloco 5 — Código de referência */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Como usar no front-end</h2>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto leading-relaxed">
{`// A função getCorFromPeso recebe o campo 'peso' do nível
// e retorna o hex correspondente
import { getCorFromPeso } from '@/app/data/mockData';

// Renderizar badge de nível
<span
  style={{ backgroundColor: getCorFromPeso(nivel.peso) }}
  className="inline-flex px-2.5 py-1 rounded-full
             text-xs font-medium text-white">
  {nivel.nome}
</span>`}
        </pre>
      </div>
    </div>
  );
}

// ─── Seção: Cobertura de habilidades ─────────────────────────────────────────

const FAIXAS_COBERTURA = [
  { label: 'Boa cobertura', faixa: '≥ 80%', corLabel: 'text-green-600', corBarra: 'bg-green-500', exemplo: 85 },
  { label: 'Cobertura parcial', faixa: '50% a 79%', corLabel: 'text-yellow-600', corBarra: 'bg-yellow-500', exemplo: 65 },
  { label: 'Baixa cobertura', faixa: '< 50%', corLabel: 'text-red-600', corBarra: 'bg-red-500', exemplo: 35 },
];

const EXEMPLOS_CARGOS = [
  { nome: 'Desenvolvedor Pleno', label: 'Boa cobertura', percentual: 85, corLabel: 'text-green-600', corBarra: 'bg-green-500' },
  { nome: 'Desenvolvedor Sênior', label: 'Cobertura parcial', percentual: 65, corLabel: 'text-yellow-600', corBarra: 'bg-yellow-500' },
  { nome: 'Tech Lead', label: 'Baixa cobertura', percentual: 35, corLabel: 'text-red-600', corBarra: 'bg-red-500' },
];

function SecaoCoberturaHabilidades() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Cobertura de habilidades</h1>
      <p className="text-sm text-gray-600 mb-4">
        Mede o percentual de habilidades onde o nível atual do colaborador atende ou supera o nível
        esperado na matriz para o cargo.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={0} />

      {/* Bloco 1 — Fórmula */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Cálculo</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-xs text-gray-700 leading-relaxed">
          <p>cobertura = habilidades onde nivelAtual &gt;= nivelEsperado</p>
          <p>percentual = (cobertura / total de habilidades do cargo) × 100</p>
        </div>
      </div>

      {/* Bloco 2 — Tabela de classificação */}
      <div className="mb-8">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Classificação</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Percentual</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Barra de exemplo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {FAIXAS_COBERTURA.map((faixa) => (
                <tr key={faixa.label} className="bg-white">
                  <td className={`px-4 py-3 font-medium ${faixa.corLabel}`}>{faixa.label}</td>
                  <td className="px-4 py-3 text-gray-600">{faixa.faixa}</td>
                  <td className="px-4 py-3 w-40">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${faixa.corBarra}`}
                        style={{ width: `${faixa.exemplo}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bloco 3 — Exemplos visuais */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Como aparece na interface</h2>
        <div className="flex flex-col gap-3">
          {EXEMPLOS_CARGOS.map((ex) => (
            <div key={ex.nome} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{ex.nome}</span>
                <span className={`text-xs font-medium ${ex.corLabel}`}>
                  {ex.label} — {ex.percentual}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${ex.corBarra}`}
                  style={{ width: `${ex.percentual}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bloco 4 — Código de referência */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Função de cálculo</h2>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto leading-relaxed">
{`// src/app/utils/cobertura.ts

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
): ResultadoCobertura`}
        </pre>
      </div>
    </div>
  );
}

// ─── Seção: Estados de avaliação ─────────────────────────────────────────────

function SecaoEstadosAvaliacao() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Estados de avaliação</h1>
      <p className="text-sm text-gray-600 mb-4">
        O Admin gerencia o status da avaliação. O Colaborador tem um estado próprio que reflete
        sua participação naquela avaliação.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={1} />

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 mb-8 max-w-2xl">
        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-800">Divergência interna no DS</p>
          <p className="text-sm text-yellow-700 mt-1">Badge Encerrada documentada com <code className="font-mono text-xs">text-gray-800</code> nesta seção vs <code className="font-mono text-xs">text-gray-700</code> em SecaoBadgesStatus. O código real usa <code className="font-mono text-xs">text-gray-700</code>. Verificar se foi corrigido.</p>
        </div>
      </div>

      {/* Bloco 1 — Status do Admin */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Status da avaliação (Admin)</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Badge</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Descrição</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-white">
                <td className="px-4 py-3 font-medium text-gray-900">Rascunho</td>
                <td className="px-4 py-3">
                  <span className={`${BADGE_BASE} bg-yellow-100 text-yellow-800`}>Rascunho</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">Avaliação criada mas não publicada. Não visível para o colaborador.</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 font-medium text-gray-900">Ativa</td>
                <td className="px-4 py-3">
                  <span className={`${BADGE_BASE} bg-green-100 text-green-800`}>Ativa</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">Publicada e disponível para resposta.</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 font-medium text-gray-900">Encerrada</td>
                <td className="px-4 py-3">
                  <span className={`${BADGE_BASE} bg-gray-100 text-gray-700`}>Encerrada</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">Período encerrado. Não aceita mais respostas.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bloco 2 — Estado do colaborador */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Estado do colaborador na avaliação</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Estado</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Badge</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Condição</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-white">
                <td className="px-4 py-3 font-medium text-gray-900">Não iniciada</td>
                <td className="px-4 py-3">
                  <span className={`${BADGE_BASE} bg-orange-100 text-orange-800`}>Não iniciada</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">Avaliação Ativa + colaborador não começou</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 font-medium text-gray-900">Em andamento</td>
                <td className="px-4 py-3">
                  <span className={`${BADGE_BASE} bg-blue-100 text-blue-800`}>Em andamento</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">Avaliação Ativa + colaborador iniciou mas não concluiu</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 font-medium text-gray-900">Concluída</td>
                <td className="px-4 py-3">
                  <span className={`${BADGE_BASE} bg-green-100 text-green-800`}>Concluída</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">Avaliação Encerrada + colaborador respondeu</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 font-medium text-gray-900">Expirada</td>
                <td className="px-4 py-3">
                  <span className={`${BADGE_BASE} bg-gray-100 text-gray-700`}>Expirada</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">Avaliação Encerrada + colaborador não respondeu</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bloco 3 — Aviso */}
      <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[var(--brand-700)]">
          Avaliações com status Rascunho nunca aparecem para o colaborador, independente do estado.
        </p>
      </div>
    </div>
  );
}

// ─── Seção: Badges de status ──────────────────────────────────────────────────

function SecaoBadgesStatus() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Badges de status</h1>
      <p className="text-sm text-gray-600 mb-4">
        Badges usados em todo o sistema para comunicar estado de registros.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={0} />

      {/* Bloco 1 — Tabela completa */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Todos os badges do sistema</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Badge</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Classes</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Uso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">

              {/* Grupo: Status de registro (Admin) */}
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status de registro (Admin)
                </td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3">
                  <span className={`${BADGE_BASE} bg-green-100 text-green-800`}>Ativa</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">bg-green-100 text-green-800</td>
                <td className="px-4 py-3 text-xs text-gray-500">Competências, Habilidades, Carreiras, Jornadas</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3">
                  <span className={`${BADGE_BASE} bg-red-100 text-red-700`}>Desativada</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">bg-red-100 text-red-700</td>
                <td className="px-4 py-3 text-xs text-gray-500">Registros desativados</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3">
                  <span className={`${BADGE_BASE} bg-yellow-100 text-yellow-800`}>Rascunho</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">bg-yellow-100 text-yellow-800</td>
                <td className="px-4 py-3 text-xs text-gray-500">Avaliações</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3">
                  <span className={`${BADGE_BASE} bg-gray-100 text-gray-700`}>Encerrada</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">bg-gray-100 text-gray-700</td>
                <td className="px-4 py-3 text-xs text-gray-500">Avaliações</td>
              </tr>

              {/* Grupo: Estado do colaborador */}
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Estado do colaborador
                </td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3">
                  <span className={`${BADGE_BASE} bg-orange-100 text-orange-800`}>Não iniciada</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">bg-orange-100 text-orange-800</td>
                <td className="px-4 py-3 text-xs text-gray-500">Minhas Avaliações</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3">
                  <span className={`${BADGE_BASE} bg-blue-100 text-blue-800`}>Em andamento</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">bg-blue-100 text-blue-800</td>
                <td className="px-4 py-3 text-xs text-gray-500">Minhas Avaliações</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3">
                  <span className={`${BADGE_BASE} bg-green-100 text-green-800`}>Concluída</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">bg-green-100 text-green-800</td>
                <td className="px-4 py-3 text-xs text-gray-500">Minhas Avaliações</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3">
                  <span className={`${BADGE_BASE} bg-gray-100 text-gray-700`}>Expirada</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">bg-gray-100 text-gray-700</td>
                <td className="px-4 py-3 text-xs text-gray-500">Minhas Avaliações</td>
              </tr>

              {/* Grupo: Habilidades do colaborador */}
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Habilidades do colaborador
                </td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3">
                  <span className="text-xs font-medium text-green-600">Acima do esperado</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">text-green-600 (texto, sem fundo)</td>
                <td className="px-4 py-3 text-xs text-gray-500">Detalhamento</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3">
                  <span className="text-xs font-medium text-green-600">No esperado</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">text-green-600 (texto, sem fundo)</td>
                <td className="px-4 py-3 text-xs text-gray-500">Detalhamento</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3">
                  <span className="text-xs font-medium text-red-500">Abaixo do esperado</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">text-red-500 (texto, sem fundo)</td>
                <td className="px-4 py-3 text-xs text-gray-500">Detalhamento</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bloco 2 — Código de referência */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Classe base dos badges</h2>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto leading-relaxed">
{`inline-flex px-1.5 md:px-2 py-0.5 md:py-1
text-[10px] md:text-xs font-medium rounded-full`}
        </pre>
      </div>
    </div>
  );
}

// ─── Seção: Jornadas e Matriz de Habilidades ──────────────────────────────────

const REGRAS_CRIACAO_JORNADA = [
  'A jornada pertence a uma carreira e não pode existir sem ela.',
  'O modelo de evolução é definido na criação e determina o tipo de progressão: Contribuidor Individual (evolução técnica) ou Gestão (evolução para liderança).',
  'Os cargos são selecionados e ordenados pelo RH via drag-and-drop, definindo a sequência de progressão.',
  'A ordem dos cargos define a progressão — o primeiro cargo é o ponto de entrada, o último é o topo da jornada.',
  'Um mesmo cargo pode pertencer a múltiplas jornadas simultaneamente.',
  'Cada jornada tem sua própria matriz de habilidades — o mesmo cargo pode ter exigências diferentes em jornadas distintas.',
];

const REGRAS_MATRIZ = [
  'As habilidades disponíveis na matriz são as cadastradas no módulo Habilidades — técnicas e comportamentais.',
  'Para cada habilidade, o RH define o nível mínimo exigido por cargo usando os níveis cadastrados (ex: Básico para Júnior, Intermediário para Pleno, Avançado para Sênior).',
  'Uma habilidade pode ter níveis diferentes para cada cargo da mesma jornada.',
  'O colaborador é avaliado contra a matriz do cargo atual na sua jornada.',
  'Habilidades não incluídas na matriz não afetam a cobertura do colaborador naquela jornada.',
];

const REGRAS_VINCULO = [
  'O vínculo é colaborador × jornada, não colaborador × cargo.',
  'A cobertura de habilidades é calculada sempre em relação à matriz da jornada do colaborador.',
  'Times diferentes podem ter jornadas diferentes para o mesmo cargo — ex: um time focado em React e outro em Vue, ambos com Desenvolvedores Plenos.',
];

function SecaoJornadasEMatriz() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Jornadas e Matriz de Habilidades</h1>
      <p className="text-sm text-gray-600 mb-4">
        Regras que governam a construção de jornadas de carreira e a definição de habilidades exigidas por cargo.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="12/06/2026" debitosTecnicos={0} alertas={0} />

      {/* Bloco 1 — Hierarquia de carreiras */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Hierarquia de carreiras</h2>
        <div className="flex flex-col items-center gap-0 max-w-sm">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 w-full">
            <p className="text-sm font-semibold text-gray-900">Carreira</p>
            <p className="text-xs text-gray-500 mt-0.5">Agrupa jornadas de uma mesma área funcional</p>
          </div>
          <p className="text-gray-400 text-lg text-center leading-none py-1">↓</p>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 w-full">
            <p className="text-sm font-semibold text-gray-900">Jornada</p>
            <p className="text-xs text-gray-500 mt-0.5">Define a progressão de cargos e o modelo de evolução do colaborador</p>
          </div>
          <p className="text-gray-400 text-lg text-center leading-none py-1">↓</p>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 w-full">
            <p className="text-sm font-semibold text-gray-900">Cargo (ordenado na jornada)</p>
            <p className="text-xs text-gray-500 mt-0.5">Posição que o colaborador ocupa ou almeja</p>
          </div>
          <p className="text-gray-400 text-lg text-center leading-none py-1">↓</p>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 w-full">
            <p className="text-sm font-semibold text-gray-900">Matriz de Habilidades</p>
            <p className="text-xs text-gray-500 mt-0.5">Define o nível mínimo exigido por habilidade para cada cargo da jornada</p>
          </div>
        </div>
      </div>

      {/* Bloco 2 — Criação de jornada */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Criação de jornada</h2>
        <ul className="space-y-2">
          {REGRAS_CRIACAO_JORNADA.map((regra, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
              {regra}
            </li>
          ))}
        </ul>
      </div>

      {/* Bloco 3 — Matriz de habilidades */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Matriz de habilidades</h2>
        <p className="text-sm text-gray-600 mb-4">
          A matriz define o nível mínimo exigido para cada habilidade em cada cargo da jornada. É configurada após a
          criação da jornada e pode ser editada a qualquer momento pelo RH.
        </p>
        <ul className="space-y-2">
          {REGRAS_MATRIZ.map((regra, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
              {regra}
            </li>
          ))}
        </ul>
      </div>

      {/* Bloco 4 — Vínculo com o colaborador */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Vínculo com o colaborador</h2>
        <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3 mb-4">
          <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">
            O colaborador é vinculado a uma jornada específica — não apenas a um cargo. Dois colaboradores no mesmo
            cargo podem seguir jornadas diferentes com matrizes de habilidades distintas.
          </p>
        </div>
        <ul className="space-y-2">
          {REGRAS_VINCULO.map((regra, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
              {regra}
            </li>
          ))}
        </ul>
      </div>

      {/* Bloco 5 — Exemplo prático */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Exemplo prático</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Habilidade</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Dev Pleno — Jornada Frontend</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Dev Pleno — Jornada Backend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-white">
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">React</td>
                <td className="px-4 py-3 text-sm text-gray-700">Avançado</td>
                <td className="px-4 py-3 text-sm text-gray-400 italic">Não exigido</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">Node.js</td>
                <td className="px-4 py-3 text-sm text-gray-400 italic">Não exigido</td>
                <td className="px-4 py-3 text-sm text-gray-700">Avançado</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">Comunicação</td>
                <td className="px-4 py-3 text-sm text-gray-700">Intermediário</td>
                <td className="px-4 py-3 text-sm text-gray-700">Intermediário</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500">
          O mesmo cargo (Dev Pleno) tem matrizes diferentes em cada jornada. A cobertura do colaborador é calculada
          contra a matriz da sua jornada.
        </p>
      </div>
    </div>
  );
}

// ─── Seção: Cores ─────────────────────────────────────────────────────────────

const PALETA_MARCA = [
  { token: '--brand-50',  hex: '#E6F7FB', principal: false },
  { token: '--brand-100', hex: '#CCEFF7', principal: false },
  { token: '--brand-200', hex: '#99DFEF', principal: false },
  { token: '--brand-300', hex: '#66CFE7', principal: false },
  { token: '--brand-400', hex: '#33BFDF', principal: false },
  { token: '--brand-500', hex: '#009FC2', principal: true  },
  { token: '--brand-600', hex: '#0083A1', principal: true  },
  { token: '--brand-700', hex: '#006780', principal: false },
  { token: '--brand-800', hex: '#004B5F', principal: false },
  { token: '--brand-900', hex: '#002F3E', principal: false },
  { token: '--brand-950', hex: '#001E28', principal: false },
];

const USO_CONTEXTO = [
  { contexto: 'Botão primário fundo', token: '--brand-600', hex: '#0083A1' },
  { contexto: 'Botão primário hover', token: '--brand-700', hex: '#006780' },
  { contexto: 'Focus ring',           token: '--brand-500', hex: '#009FC2' },
  { contexto: 'Ícone ativo / link',   token: '--brand-600', hex: '#0083A1' },
  { contexto: 'Background sutil',     token: '--brand-50',  hex: '#E6F7FB' },
  { contexto: 'Borda sutil',          token: '--brand-100', hex: '#CCEFF7' },
];

const NEUTROS = [
  { classe: 'gray-50',  hex: '#f9fafb', uso: 'Fundo de página, header de tabela' },
  { classe: 'gray-100', hex: '#f3f4f6', uso: 'Pills inativas, badges' },
  { classe: 'gray-200', hex: '#e5e7eb', uso: 'Bordas de cards e tabelas' },
  { classe: 'gray-300', hex: '#d1d5db', uso: 'Bordas de inputs' },
  { classe: 'gray-400', hex: '#9ca3af', uso: 'Ícones inativos, placeholder' },
  { classe: 'gray-500', hex: '#6b7280', uso: 'Texto secundário, meta' },
  { classe: 'gray-600', hex: '#4b5563', uso: 'Texto de filtro inativo' },
  { classe: 'gray-700', hex: '#374151', uso: 'Labels de campos' },
  { classe: 'gray-900', hex: '#111827', uso: 'Texto principal, títulos' },
];

function SecaoCores() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Cores</h1>
      <p className="text-sm text-gray-600 mb-4">
        Tokens de cor do sistema definidos em{' '}
        <code className="bg-gray-100 px-1 rounded text-xs">src/styles/theme.css</code>.
        Sempre use os tokens CSS (
        <code className="bg-gray-100 px-1 rounded text-xs">var(--brand-600)</code>
        ) em vez de valores hex diretamente.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={1} />

      {/* Bloco 1 — Paleta de marca */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Paleta de marca</h2>
        <p className="text-xs text-gray-500 mb-3">
          Usada em botões, links, foco, ícones ativos e elementos interativos principais.
        </p>
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: 'repeat(11, minmax(0, 1fr))' }}
        >
          {PALETA_MARCA.map(({ token, hex, principal }) => (
            <div key={token} className="flex flex-col gap-0.5">
              <div
                className="h-12 rounded-md w-full"
                style={{ backgroundColor: hex }}
                title={`${token}: ${hex}`}
              />
              <p className="text-[9px] font-mono text-gray-600 break-all leading-tight">{token}</p>
              <p className="text-[9px] text-gray-400 leading-tight">{hex}</p>
              {principal && (
                <p className="text-[9px] text-[var(--brand-600)] font-medium leading-tight">Uso principal</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bloco 2 — Uso por contexto */}
      <div className="mb-8 max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Uso por contexto</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Contexto</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Token</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Hex</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Exemplo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {USO_CONTEXTO.map(({ contexto, token, hex }) => (
                <tr key={contexto} className="bg-white">
                  <td className="px-4 py-3 text-xs text-gray-700">{contexto}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{token}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{hex}</td>
                  <td className="px-4 py-3 w-24">
                    <div className="w-full h-6 rounded" style={{ backgroundColor: hex }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bloco 3 — Neutros */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Neutros (Tailwind gray)</h2>
        <p className="text-xs text-gray-500 mb-3">
          Usados em textos, bordas, fundos e divisores. Não usar valores hex diretamente — usar classes Tailwind.
        </p>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {NEUTROS.map(({ classe, hex, uso }) => (
            <div key={classe} className="flex flex-col gap-0.5">
              <div
                className="h-10 rounded-md w-full border border-gray-100"
                style={{ backgroundColor: hex }}
                title={uso}
              />
              <p className="text-[10px] font-mono text-gray-600">{classe}</p>
              <p className="text-[10px] text-gray-400">{hex}</p>
              <p className="text-[9px] text-gray-400 leading-tight">{uso}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bloco 4 — Semânticas */}
      <div className="mb-8 max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Cores semânticas</h2>
        <p className="text-xs text-gray-500 mb-3">
          Usadas para comunicar estado e feedback. Nunca usar para decoração.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="h-8 w-full rounded-md bg-green-500 mb-3" />
            <p className="text-xs font-semibold text-gray-900 mb-0.5">Sucesso (green)</p>
            <p className="text-[10px] text-gray-500 mb-2">
              badge Ativa, badge Concluída, Boa cobertura, "No esperado" / "Acima do esperado"
            </p>
            <div className="flex flex-wrap gap-1">
              {['bg-green-100 text-green-800', 'text-green-600'].map((c) => (
                <span key={c} className="font-mono text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{c}</span>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="h-8 w-full rounded-md bg-yellow-500 mb-3" />
            <p className="text-xs font-semibold text-gray-900 mb-0.5">Atenção (yellow)</p>
            <p className="text-[10px] text-gray-500 mb-2">badge Rascunho, Cobertura parcial</p>
            <div className="flex flex-wrap gap-1">
              {['bg-yellow-100 text-yellow-800'].map((c) => (
                <span key={c} className="font-mono text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{c}</span>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="h-8 w-full rounded-md bg-red-500 mb-3" />
            <p className="text-xs font-semibold text-gray-900 mb-0.5">Erro / alerta (red)</p>
            <p className="text-[10px] text-gray-500 mb-2">
              Baixa cobertura, "Abaixo do esperado", erros de formulário
            </p>
            <div className="flex flex-wrap gap-1">
              {['bg-red-100 text-red-700', 'text-red-500', 'text-red-600'].map((c) => (
                <span key={c} className="font-mono text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{c}</span>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex gap-2 mb-3">
              <div className="h-8 flex-1 rounded-md bg-orange-500" />
              <div className="h-8 flex-1 rounded-md bg-blue-500" />
            </div>
            <p className="text-xs font-semibold text-gray-900 mb-0.5">Informação</p>
            <p className="text-[10px] text-gray-500 mb-2">
              <span className="text-orange-600 font-medium">orange</span>: badge Não iniciada
              {' · '}
              <span className="text-blue-600 font-medium">blue</span>: badge Em andamento
            </p>
            <div className="flex flex-wrap gap-1">
              {['bg-orange-100 text-orange-800', 'bg-blue-100 text-blue-800'].map((c) => (
                <span key={c} className="font-mono text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bloco 5 — Dark mode */}
      <div className="mb-8 max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Dark mode</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">
            Dark mode ainda não foi implementado nem validado. O token{' '}
            <code className="font-mono text-xs">.dark</code> existe em{' '}
            <code className="font-mono text-xs">theme.css</code> mas as telas não foram revisadas
            neste modo. Não usar como referência de implementação.
          </p>
        </div>
      </div>

      {/* Bloco 6 — Código */}
      <div className="mb-8 max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Como usar</h2>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto leading-relaxed">
{`/* ✅ Correto — usa token CSS */
style={{ color: 'var(--brand-600)' }}
className="text-[var(--brand-600)]"
className="bg-[var(--brand-50)]"

/* ✅ Correto — usa classe Tailwind para neutros */
className="text-gray-900 border-gray-200 bg-gray-50"

/* ❌ Evitar — hex fixo não responde ao tema */
style={{ color: '#0083A1' }}
style={{ backgroundColor: '#E6F7FB' }}

/* ❌ Evitar — azul Tailwind padrão fora da paleta */
className="text-blue-600 bg-blue-500"`}
        </pre>
      </div>
    </div>
  );
}

// ─── Seção: Tipografia ───────────────────────────────────────────────────────

const ESCALA_TIPOGRAFICA = [
  { texto: 'Título de página',               classes: 'text-2xl font-semibold text-gray-900',                                     px: '24px',    peso: '600' },
  { texto: 'Subtítulo descritivo da página', classes: 'text-sm text-gray-600',                                                    px: '14px',    peso: '400' },
  { texto: 'Título do drawer',               classes: 'text-base md:text-lg lg:text-xl font-semibold text-gray-900',              px: '16–20px', peso: '600' },
  { texto: 'Nome do campo *',                classes: 'text-xs md:text-sm font-medium text-gray-700',                             px: '12–14px', peso: '500' },
  { texto: 'NOME DA COLUNA',                 classes: 'text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider', px: '10–12px', peso: '500' },
  { texto: 'Conteúdo da célula',             classes: 'text-xs md:text-sm text-gray-900',                                         px: '12–14px', peso: '400' },
  { texto: 'Informação complementar',        classes: 'text-xs md:text-sm text-gray-500',                                         px: '12–14px', peso: '400' },
  { texto: 'Ação do botão',                  classes: 'text-xs md:text-sm font-medium',                                           px: '12–14px', peso: '500' },
  { texto: 'Este campo é obrigatório',       classes: 'text-sm text-red-600',                                                     px: '14px',    peso: '400' },
  { texto: 'Ver detalhes →',                 classes: 'text-xs md:text-sm font-medium text-[var(--brand-600)]',                   px: '12–14px', peso: '500' },
];

function SecaoTipografia() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Tipografia</h1>
      <p className="text-sm text-gray-600 mb-4">
        Fonte base: DM Sans (Google Fonts).{' '}
        Definida em{' '}
        <code className="bg-gray-100 px-1 rounded text-xs">src/styles/fonts.css</code>.{' '}
        Tamanho base: 16px. Line-height padrão: 1.5.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={1} />

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 mb-8 max-w-2xl">
        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-800">Escala omite text-lg (18px)</p>
          <p className="text-sm text-yellow-700 mt-1">A escala tipográfica não documenta o passo intermediário <code className="font-mono text-xs">text-lg</code> (18px) usado no título do drawer entre md e lg breakpoints. O DS documenta 16–20px mas o valor real em md é 18px.</p>
        </div>
      </div>

      {/* Bloco 1 — Família tipográfica */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Família tipográfica</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-4xl font-semibold text-gray-900 mb-2">
            DM Sans
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Google Fonts · Pesos disponíveis: 400 (normal) e 500 (medium)
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-base text-gray-700">
            A quick brown fox jumps over the lazy dog. 0123456789 !@#$%
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-base font-medium text-gray-700 mt-2">
            A quick brown fox jumps over the lazy dog. 0123456789 !@#$% (medium)
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          <code className="font-mono text-xs">font-semibold</code> (600) é usado em títulos de página e
          cabeçalhos de drawer mas não tem token definido — usar com atenção.
        </p>
      </div>

      {/* Bloco 2 — Escala por contexto */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Escala por contexto</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 flex px-4 py-2.5 gap-2">
            <div className="w-1/3 text-xs font-semibold text-gray-600">Exemplo</div>
            <div className="w-1/3 text-xs font-semibold text-gray-600">Classes Tailwind</div>
            <div className="w-1/6 text-xs font-semibold text-gray-600 text-right">px</div>
            <div className="w-1/6 text-xs font-semibold text-gray-600 text-right">Peso</div>
          </div>
          <div className="divide-y divide-gray-100">
            {ESCALA_TIPOGRAFICA.map(({ texto, classes, px, peso }) => (
              <div key={texto} className="flex items-start px-4 py-3 gap-2">
                <div className="w-1/3 min-w-0">
                  <span className={classes}>{texto}</span>
                </div>
                <div className="w-1/3 min-w-0">
                  <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 break-all leading-relaxed">
                    {classes}
                  </code>
                </div>
                <div className="w-1/6 text-xs text-gray-500 text-right pt-0.5">{px}</div>
                <div className="w-1/6 text-xs text-gray-500 text-right pt-0.5">{peso}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bloco 3 — Pesos disponíveis */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Pesos disponíveis</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-[10px] font-mono text-[var(--brand-600)] mb-1">--font-weight-normal</p>
            <p className="text-2xl font-normal text-gray-800 mb-1">400</p>
            <code className="text-[10px] bg-gray-100 px-1 rounded text-gray-600">font-normal</code>
            <p className="text-lg font-normal text-gray-800 mt-3">Texto normal</p>
            <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">Texto corrido, inputs, células de tabela</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-[10px] font-mono text-[var(--brand-600)] mb-1">--font-weight-medium</p>
            <p className="text-2xl font-medium text-gray-800 mb-1">500</p>
            <code className="text-[10px] bg-gray-100 px-1 rounded text-gray-600">font-medium</code>
            <p className="text-lg font-medium text-gray-800 mt-3">Texto medium</p>
            <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">Títulos, labels, botões, filtros</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-[10px] font-mono text-gray-400 mb-1">Sem token (uso direto)</p>
            <p className="text-2xl font-semibold text-gray-800 mb-1">600</p>
            <code className="text-[10px] bg-gray-100 px-1 rounded text-gray-600">font-semibold</code>
            <p className="text-lg font-semibold text-gray-800 mt-3">Texto semibold</p>
            <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">Títulos de página, cabeçalhos de drawer</p>
            <p className="text-[10px] text-orange-500 mt-1 font-medium">Sem token definido — usar com atenção</p>
          </div>
        </div>
      </div>

      {/* Bloco 4 — Regras de uso */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Regras de uso</h2>
        <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-[var(--brand-700)] mb-2">
              Siga estas regras para manter consistência tipográfica:
            </p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><code className="font-mono text-xs bg-white/60 px-1 rounded">font-bold</code> (700) é reservado para valores numéricos de destaque em cards de métricas (ex: <code className="font-mono text-xs bg-white/60 px-1 rounded">text-3xl font-bold</code>). Não usar em texto corrido, labels, botões ou cabeçalhos.</li>
              <li>Nunca use tamanhos fora da escala acima (ex: <code className="font-mono text-xs bg-white/60 px-1 rounded">text-3xl</code> em conteúdo de página)</li>
              <li>Sempre use <code className="font-mono text-xs bg-white/60 px-1 rounded">text-gray-900</code> para texto principal e <code className="font-mono text-xs bg-white/60 px-1 rounded">text-gray-500</code> para texto secundário</li>
              <li>Labels de formulário sempre em <code className="font-mono text-xs bg-white/60 px-1 rounded">font-medium text-gray-700</code></li>
              <li>Cabeçalhos de tabela sempre em <code className="font-mono text-xs bg-white/60 px-1 rounded">uppercase tracking-wider</code></li>
              <li>Responsive: use <code className="font-mono text-xs bg-white/60 px-1 rounded">md:</code> prefix quando o tamanho muda entre mobile e desktop</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Seção: Espaçamento ──────────────────────────────────────────────────────

type EspacRow = { contexto: string; classes: string; valor: string; barra: number };
type EspacGrupo = { grupo: string; rows: EspacRow[] };

const ESPACAMENTO_GRUPOS: EspacGrupo[] = [
  {
    grupo: 'PÁGINA',
    rows: [
      { contexto: 'Gap vertical entre seções',    classes: 'space-y-6', valor: '24px', barra: 96 },
      { contexto: 'Margem do subtítulo ao título', classes: 'mt-2',      valor: '8px',  barra: 32 },
    ],
  },
  {
    grupo: 'TOOLBAR DE FILTROS',
    rows: [
      { contexto: 'Padding da toolbar',           classes: 'p-3 md:p-4', valor: '12–16px', barra: 64 },
      { contexto: 'Gap entre elementos internos', classes: 'gap-3',       valor: '12px',    barra: 48 },
    ],
  },
  {
    grupo: 'TABELA',
    rows: [
      { contexto: 'Padding células header e data', classes: 'px-3 md:px-6 py-3 md:py-4', valor: 'H: 12–24 / V: 12–16px', barra: 96 },
      { contexto: 'Padding footer paginação',      classes: 'px-3 md:px-6 py-3 md:py-4', valor: 'H: 12–24 / V: 12–16px', barra: 96 },
    ],
  },
  {
    grupo: 'DRAWER',
    rows: [
      { contexto: 'Padding header',             classes: 'px-4 md:px-6 py-3 md:py-4', valor: 'H: 16–24 / V: 12–16px', barra: 96 },
      { contexto: 'Padding área de campos',     classes: 'px-4 md:px-6 py-4 md:py-6', valor: 'H: 16–24 / V: 16–24px', barra: 96 },
      { contexto: 'Gap entre campos',           classes: 'space-y-4 md:space-y-5',    valor: '16–20px',               barra: 80 },
      { contexto: 'Padding footer',             classes: 'px-4 md:px-6 py-3 md:py-4', valor: 'H: 16–24 / V: 12–16px', barra: 96 },
      { contexto: 'Gap entre botões do footer', classes: 'gap-2 md:gap-3',             valor: '8–12px',                barra: 48 },
      { contexto: 'Label → input',              classes: 'mb-1.5 md:mb-2',             valor: '6–8px',                 barra: 32 },
    ],
  },
  {
    grupo: 'CARDS DE MÉTRICAS',
    rows: [
      { contexto: 'Padding do card',          classes: 'p-5',  valor: '20px', barra: 80 },
      { contexto: 'Gap entre label e número', classes: 'mb-3', valor: '12px', barra: 48 },
    ],
  },
  {
    grupo: 'INPUTS',
    rows: [
      { contexto: 'Padding interno', classes: 'px-3 py-2',  valor: 'H: 12 / V: 8px', barra: 48 },
      { contexto: 'Border radius',   classes: 'rounded-lg', valor: '8px',             barra: 32 },
    ],
  },
  {
    grupo: 'BOTÕES DE AÇÃO (ícone)',
    rows: [
      { contexto: 'Padding',       classes: 'p-1.5 md:p-2', valor: '6–8px', barra: 32 },
      { contexto: 'Border radius', classes: 'rounded-lg',   valor: '8px',   barra: 32 },
    ],
  },
];

const ESCALA_BASE = [
  { unidade: 1,  px: 4  },
  { unidade: 2,  px: 8  },
  { unidade: 3,  px: 12 },
  { unidade: 4,  px: 16 },
  { unidade: 5,  px: 20 },
  { unidade: 6,  px: 24 },
  { unidade: 8,  px: 32 },
  { unidade: 10, px: 40 },
  { unidade: 12, px: 48 },
  { unidade: 16, px: 64 },
  { unidade: 20, px: 80 },
  { unidade: 24, px: 96 },
];

const BORDER_RADIUS_VALORES = [
  { classe: 'rounded-sm',   valor: '2px',    uso: 'Badges de variação percentual' },
  { classe: 'rounded',      valor: '4px',    uso: 'Raro no sistema' },
  { classe: 'rounded-md',   valor: '6px',    uso: 'Pills de filtro ativas' },
  { classe: 'rounded-lg',   valor: '8px',    uso: 'Cards, inputs, botões, drawers' },
  { classe: 'rounded-full', valor: '9999px', uso: 'Badges de status e nível' },
];

function SecaoEspacamento() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Espaçamento</h1>
      <p className="text-sm text-gray-600 mb-4">
        O sistema usa a escala de espaçamento padrão do Tailwind CSS. Não há tokens customizados
        de espaçamento — use sempre as classes Tailwind.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={1} />

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 mb-8 max-w-2xl">
        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-800">thead e tbody com valores idênticos</p>
          <p className="text-sm text-yellow-700 mt-1">A tabela de espaçamento agrupa thead e tbody com os mesmos valores <code className="font-mono text-xs">px-3 md:px-6 py-3 md:py-4</code>, sugerindo que são configurados separadamente quando na prática são idênticos em Table.tsx.</p>
        </div>
      </div>

      {/* Bloco 1 — Espaçamento por contexto */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Espaçamento por contexto</h2>
        <p className="text-xs text-gray-500 mb-3">
          Valores definidos e validados no sistema. Use estes antes de qualquer outro valor.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 flex items-center px-4 py-2.5 gap-2">
            <div className="flex-1 text-xs font-semibold text-gray-600">Contexto</div>
            <div className="w-24 text-xs font-semibold text-gray-600">Área</div>
            <div className="w-40 text-xs font-semibold text-gray-600">Classes</div>
            <div className="w-28 text-xs font-semibold text-gray-600">Valor</div>
          </div>
          {ESPACAMENTO_GRUPOS.map(({ grupo, rows }) => (
            <div key={grupo}>
              <div className="bg-gray-50 border-t border-gray-200 px-4 py-1.5">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {grupo}
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                {rows.map(({ contexto, classes, valor, barra }) => (
                  <div key={contexto} className="flex items-center px-4 py-2.5 gap-2 bg-white">
                    <div className="flex-1 text-xs text-gray-700 min-w-0">{contexto}</div>
                    <div className="w-24">
                      <div
                        className="h-2 rounded-sm bg-[var(--brand-200)]"
                        style={{ width: `${barra}px` }}
                      />
                    </div>
                    <div className="w-40 min-w-0">
                      <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 break-all leading-relaxed">
                        {classes}
                      </code>
                    </div>
                    <div className="w-28 text-xs text-gray-500 leading-tight">{valor}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bloco 2 — Escala base */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Escala base de referência</h2>
        <p className="text-xs text-gray-500 mb-3">1 unidade Tailwind = 4px</p>
        <div className="grid grid-cols-4 gap-3">
          {ESCALA_BASE.map(({ unidade, px }) => (
            <div key={unidade} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="font-mono text-xs text-gray-700 mb-0.5">{unidade}</p>
              <p className="text-xs text-gray-400 mb-2">{px}px</p>
              <div className="bg-[var(--brand-400)] h-2 rounded-sm" style={{ width: `${px}px` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Bloco 3 — Border radius */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Border radius</h2>
        <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
          {BORDER_RADIUS_VALORES.map(({ classe, valor, uso }) => (
            <div key={classe} className="flex flex-col items-start gap-2">
              <div className={`w-16 h-16 bg-[var(--brand-100)] border border-[var(--brand-300)] ${classe}`} />
              <p className="font-mono text-xs text-gray-700">{classe}</p>
              <p className="text-xs text-gray-400">{valor}</p>
              <p className="text-xs text-gray-500 leading-tight">{uso}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bloco 4 — Regras de uso */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Regras de uso</h2>
        <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-[var(--brand-700)] mb-2">
              Siga estas regras para manter consistência de espaçamento:
            </p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>Sempre use a escala Tailwind — nunca valores arbitrários em <code className="font-mono text-xs bg-white/60 px-1 rounded">{"style={{ margin: '13px' }}"}</code></li>
              <li>Componentes responsivos usam o prefixo <code className="font-mono text-xs bg-white/60 px-1 rounded">md:</code> para desktop — ex: <code className="font-mono text-xs bg-white/60 px-1 rounded">p-3 md:p-4</code></li>
              <li>Gap entre seções de página: sempre <code className="font-mono text-xs bg-white/60 px-1 rounded">space-y-6</code></li>
              <li>Gap entre campos de formulário: <code className="font-mono text-xs bg-white/60 px-1 rounded">space-y-4 md:space-y-5</code></li>
              <li>Nunca use margin negativa exceto em casos documentados (<code className="font-mono text-xs bg-white/60 px-1 rounded">-mx-4 md:mx-0</code> nas tabs do sistema)</li>
              <li>Padding de cards: sempre <code className="font-mono text-xs bg-white/60 px-1 rounded">p-4 md:p-5</code> ou <code className="font-mono text-xs bg-white/60 px-1 rounded">p-5</code> — nunca <code className="font-mono text-xs bg-white/60 px-1 rounded">p-6</code> ou maior em cards de métricas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Seção: Badges ───────────────────────────────────────────────────────────

const STATUS_REGISTRO = [
  { label: 'Ativa',      classes: 'bg-green-100 text-green-800',   uso: 'Competências, Habilidades, Carreiras, Jornadas, Avaliações ativas' },
  { label: 'Desativada', classes: 'bg-red-100 text-red-700',      uso: 'Registros desativados' },
  { label: 'Rascunho',   classes: 'bg-yellow-100 text-yellow-800', uso: 'Avaliações não publicadas' },
  { label: 'Encerrada',  classes: 'bg-gray-100 text-gray-700',    uso: 'Avaliações com período encerrado' },
  { label: 'Arquivado',  classes: 'bg-gray-100 text-gray-700',    uso: 'Níveis arquivados (não aparece em seleções)' },
];

const ESTADO_COLABORADOR_BADGES = [
  { label: 'Não iniciada', classes: 'bg-orange-100 text-orange-800', condicao: 'Avaliação Ativa + colaborador não começou' },
  { label: 'Em andamento', classes: 'bg-blue-100 text-blue-800',     condicao: 'Avaliação Ativa + colaborador iniciou mas não concluiu' },
  { label: 'Concluída',    classes: 'bg-green-100 text-green-800',   condicao: 'Avaliação Encerrada + colaborador respondeu' },
  { label: 'Expirada',     classes: 'bg-gray-100 text-gray-700',     condicao: 'Avaliação Encerrada + colaborador não respondeu' },
];

function SecaoBadges() {
  const nomesMock = niveisDefaultData.map((n) => `${n.nome} (${n.peso})`).join(' / ');

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Badges</h1>
      <p className="text-sm text-gray-600 mb-4">
        Badges comunicam estado de forma compacta. Nunca use badges para decoração — cada cor tem
        significado semântico definido.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={1} />

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 mb-8 max-w-2xl">
        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-800">Divergência interna no DS</p>
          <p className="text-sm text-yellow-700 mt-1">SecaoEstadosAvaliacao documenta badge Encerrada com <code className="font-mono text-xs">text-gray-800</code>. SecaoBadgesStatus documenta a mesma badge com <code className="font-mono text-xs">text-gray-700</code>. O código real usa <code className="font-mono text-xs">text-gray-700</code>. Verificar se a correção foi aplicada em ambas as seções.</p>
        </div>
      </div>

      {/* Bloco 1 — Classe base */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Classe base</h2>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto leading-relaxed">{`// Classe base — aplicar em todos os badges de status
className="inline-flex px-1.5 md:px-2 py-0.5 md:py-1
           text-[10px] md:text-xs font-medium rounded-full"

// Badges de nível (cor derivada de getCorFromPeso)
style={{ backgroundColor: getCorFromPeso(ordem) }}
className="inline-flex px-2.5 py-1 rounded-full
           text-xs font-medium text-white"`}</pre>
      </div>

      {/* Bloco 2 — Status de registro */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Status de registro</h2>
        <p className="text-xs text-gray-500 mb-3">
          Usados em Competências, Habilidades, Carreiras, Jornadas e Avaliações.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
            <span className="w-28 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Badge</span>
            <span className="w-52 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Classes adicionais</span>
            <span className="flex-1 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Uso</span>
          </div>
          <div className="divide-y divide-gray-100">
            {STATUS_REGISTRO.map((item) => (
              <div key={item.label} className="flex items-center px-4 py-3">
                <div className="w-28 flex-shrink-0">
                  <span className={`${BADGE_BASE} ${item.classes}`}>{item.label}</span>
                </div>
                <div className="w-52 flex-shrink-0 min-w-0">
                  <code className="font-mono text-xs text-gray-500 break-all">{item.classes}</code>
                </div>
                <p className="flex-1 text-xs text-gray-500">{item.uso}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bloco 3 — Estado do colaborador */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Estado do colaborador na avaliação</h2>
        <p className="text-xs text-gray-500 mb-3">
          Refletem a participação do colaborador, não o status da avaliação.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
            <span className="w-28 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Badge</span>
            <span className="w-52 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Classes adicionais</span>
            <span className="flex-1 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Condição de exibição</span>
          </div>
          <div className="divide-y divide-gray-100">
            {ESTADO_COLABORADOR_BADGES.map((item) => (
              <div key={item.label} className="flex items-center px-4 py-3">
                <div className="w-28 flex-shrink-0">
                  <span className={`${BADGE_BASE} ${item.classes}`}>{item.label}</span>
                </div>
                <div className="w-52 flex-shrink-0 min-w-0">
                  <code className="font-mono text-xs text-gray-500 break-all">{item.classes}</code>
                </div>
                <p className="flex-1 text-xs text-gray-500">{item.condicao}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bloco 4 — Badges de nível */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Badges de nível</h2>
        <p className="text-xs text-gray-500 mb-4">
          Cor derivada automaticamente da ordem de progressão via{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">getCorFromPeso()</code>.
          Texto sempre branco.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {ORDENS_PROGRESSAO.map(({ ordem, label }) => (
            <span
              key={ordem}
              style={{ backgroundColor: getCorFromPeso(ordem) }}
              className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium text-white"
            >
              {label}
            </span>
          ))}
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">
            <span className="font-medium">Nomes no mock atual:</span>{' '}
            {nomesMock}
          </p>
          <p className="text-xs text-gray-500">
            Os nomes são definidos pelo RH e podem variar. A cor é sempre determinada pela ordem
            de progressão, não pelo nome.
          </p>
        </div>
      </div>

      {/* Bloco 5 — Indicadores de status em texto */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Indicadores de status em texto</h2>
        <p className="text-xs text-gray-500 mb-4">
          Usados no Detalhamento de Habilidades do Colaborador. Sem fundo — apenas cor no texto.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
            <span className="w-48 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Indicador</span>
            <span className="flex-1 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Classe</span>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center px-4 py-3">
              <div className="w-48 flex-shrink-0"><span className="text-xs text-green-600">Acima do esperado</span></div>
              <code className="font-mono text-xs text-gray-500">text-xs text-green-600</code>
            </div>
            <div className="flex items-center px-4 py-3">
              <div className="w-48 flex-shrink-0"><span className="text-xs text-green-600">No esperado</span></div>
              <code className="font-mono text-xs text-gray-500">text-xs text-green-600</code>
            </div>
            <div className="flex items-center px-4 py-3">
              <div className="w-48 flex-shrink-0"><span className="text-xs text-red-500">Abaixo do esperado</span></div>
              <code className="font-mono text-xs text-gray-500">text-xs text-red-500</code>
            </div>
          </div>
        </div>
      </div>

      {/* Bloco 6 — Badge de variação percentual */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Variação percentual</h2>
        <p className="text-xs text-gray-500 mb-4">
          Usado nos cards de métricas do Dashboard para indicar variação em relação ao período anterior.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
            <span className="w-20 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Badge</span>
            <span className="flex-1 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Classes</span>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center px-4 py-3">
              <div className="w-20 flex-shrink-0">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">↑ 4%</span>
              </div>
              <code className="font-mono text-xs text-gray-500 break-all">inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700</code>
            </div>
            <div className="flex items-center px-4 py-3">
              <div className="w-20 flex-shrink-0">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">↓ 8%</span>
              </div>
              <code className="font-mono text-xs text-gray-500 break-all">inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700</code>
            </div>
          </div>
        </div>
      </div>

      {/* Bloco 7 — Regras de uso */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Regras de uso</h2>
        <div className="bg-[var(--brand-50)] border border-[var(--brand-200)] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0" />
            <span className="text-sm font-medium text-[var(--brand-700)]">Orientações de uso</span>
          </div>
          <ul className="text-sm text-gray-700 space-y-2 pl-2">
            <li>Nunca use cores de badge para decoração — cada cor tem significado semântico fixo</li>
            <li>Verde = positivo/ativo, Vermelho = alerta/erro, Amarelo = atenção/rascunho, Cinza = inativo/neutro</li>
            <li>Badges de nível: sempre usar <code className="font-mono text-xs bg-white/60 px-1 rounded">getCorFromPeso()</code> — nunca cor fixa hardcoded</li>
            <li>Texto em badges de nível: sempre <code className="font-mono text-xs bg-white/60 px-1 rounded">text-white</code></li>
            <li>Badges de status: sempre usar a classe base responsiva (<code className="font-mono text-xs bg-white/60 px-1 rounded">px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs</code>)</li>
            <li>Nunca misture os contextos: badge de status de registro ≠ badge de estado do colaborador</li>
            <li>Badges não são clicáveis — nunca adicione <code className="font-mono text-xs bg-white/60 px-1 rounded">onClick</code> a um badge</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Seção: Ícones ────────────────────────────────────────────────────────────

type IconeRow = { icone: any; nome: string; contexto: string };
type IconeGrupo = { grupo: string; rows: IconeRow[] };

const ICONES_GRUPOS: IconeGrupo[] = [
  { grupo: 'NAVEGAÇÃO (sidebar Admin)', rows: [
    { icone: LayoutDashboard, nome: 'LayoutDashboard', contexto: 'Dashboard' },
    { icone: Users,           nome: 'Users',           contexto: 'Perfis' },
    { icone: Award,           nome: 'Award',           contexto: 'Habilidades' },
    { icone: Briefcase,       nome: 'Briefcase',       contexto: 'Carreiras' },
    { icone: ClipboardCheck,  nome: 'ClipboardCheck',  contexto: 'Avaliações' },
  ]},
  { grupo: 'NAVEGAÇÃO (sidebar Colaborador)', rows: [
    { icone: UserCircle,     nome: 'UserCircle',     contexto: 'Meu Perfil' },
    { icone: ClipboardCheck, nome: 'ClipboardCheck', contexto: 'Minhas Avaliações' },
    { icone: TrendingUp,     nome: 'TrendingUp',     contexto: 'Minha Carreira' },
  ]},
  { grupo: 'CARDS DE MÉTRICAS (Admin)', rows: [
    { icone: Users,        nome: 'Users',        contexto: 'Colaboradores ativos' },
    { icone: BookOpen,     nome: 'BookOpen',     contexto: 'Habilidades cadastradas' },
    { icone: ClipboardList, nome: 'ClipboardList', contexto: 'Avaliações ativas' },
    { icone: CheckCircle2, nome: 'CheckCircle2', contexto: 'Avaliações respondidas' },
  ]},
  { grupo: 'CARDS DE MÉTRICAS (Colaborador)', rows: [
    { icone: Clock,        nome: 'Clock',        contexto: 'Avaliações em aberto' },
    { icone: CalendarClock, nome: 'CalendarClock', contexto: 'Próxima avaliação encerra em' },
    { icone: AlertCircle,  nome: 'AlertCircle',  contexto: 'Habilidades abaixo do esperado' },
    { icone: CheckCircle2, nome: 'CheckCircle2', contexto: 'Avaliações concluídas' },
  ]},
  { grupo: 'AÇÕES EM TABELA', rows: [
    { icone: Eye,       nome: 'Eye',       contexto: 'Visualizar detalhe (somente leitura)' },
    { icone: Pencil,    nome: 'Pencil',    contexto: 'Editar' },
    { icone: Power,     nome: 'Power',     contexto: 'Toggle ativo/inativo' },
    { icone: RefreshCw, nome: 'RefreshCw', contexto: 'Sincronizar (Perfis)' },
    { icone: Archive,   nome: 'Archive',   contexto: 'Arquivar nível' },
  ]},
  { grupo: 'MENSAGENS E FEEDBACK', rows: [
    { icone: Info,        nome: 'Info',        contexto: 'Mensagens de orientação (brand-600)' },
    { icone: Info,        nome: 'Info',        contexto: 'Banner de instrução (slate-400)' },
    { icone: AlertCircle, nome: 'AlertCircle', contexto: 'Alerta / atenção' },
    { icone: CheckCircle2, nome: 'CheckCircle2', contexto: 'Sucesso / concluído' },
    { icone: XCircle,     nome: 'XCircle',     contexto: 'Erro' },
  ]},
  { grupo: 'NAVEGAÇÃO INTERNA', rows: [
    { icone: ArrowLeft,    nome: 'ArrowLeft',    contexto: 'Botão "← Voltar" em páginas internas' },
    { icone: ChevronLeft,  nome: 'ChevronLeft',  contexto: 'Paginação — página anterior' },
    { icone: ChevronRight, nome: 'ChevronRight', contexto: 'Próximo / paginação — próxima página' },
    { icone: ChevronDown,  nome: 'ChevronDown',  contexto: 'Dropdown aberto / menu do usuário' },
    { icone: ChevronUp,    nome: 'ChevronUp',    contexto: 'Dropdown fechado / accordion fechado' },
  ]},
  { grupo: 'SIDEBAR — logo', rows: [
    { icone: Layers, nome: 'Layers', contexto: 'Ícone do logo SGC no header da sidebar' },
  ]},
  { grupo: 'HEADER / MENU DO USUÁRIO', rows: [
    { icone: Bell,           nome: 'Bell',           contexto: 'Botão de notificações no header' },
    { icone: User,           nome: 'User',           contexto: 'Avatar do usuário no header e item "Visão do Colaborador" no menu' },
    { icone: ChevronDown,    nome: 'ChevronDown',    contexto: 'Seta do dropdown do menu do usuário' },
    { icone: ArrowLeftRight, nome: 'ArrowLeftRight', contexto: 'Item "Visão do Administrador" no menu' },
    { icone: BookOpen,       nome: 'BookOpen',       contexto: 'Item "Design System" no menu' },
    { icone: LogOut,         nome: 'LogOut',         contexto: 'Item "Sair" no menu' },
    { icone: Menu,           nome: 'Menu',           contexto: 'Botão hamburger — apenas mobile, fora do Design System' },
  ]},
];

const ICONES_CORES = [
  { nome: 'Brand',        classe: 'text-[var(--brand-600)]', uso: 'Ícones em cards de métricas, ativo na sidebar, links' },
  { nome: 'Cinza médio',  classe: 'text-gray-500',           uso: 'Ícones em toolbar, ações secundárias' },
  { nome: 'Cinza claro',  classe: 'text-gray-400',           uso: 'Ícones decorativos, placeholders' },
  { nome: 'Cinza escuro', classe: 'text-gray-700',           uso: 'Ícones em tabelas, ações primárias' },
  { nome: 'Verde',        classe: 'text-green-500',          uso: 'Estados vazios positivos, sucesso' },
  { nome: 'Vermelho',     classe: 'text-red-500',            uso: 'Erros, alertas críticos' },
  { nome: 'Slate',        classe: 'text-slate-400',          uso: 'Ícone Info em banner de instrução' },
];

function SecaoIcones() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Ícones</h1>
      <p className="text-sm text-gray-600 mb-4">
        O sistema usa exclusivamente a biblioteca Lucide React. Nunca use outras bibliotecas de ícones
        ou SVGs inline não documentados.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={1} />

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 mb-8 max-w-2xl">
        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-800">ArrowLeft ausente no grupo Navegação Interna</p>
          <p className="text-sm text-yellow-700 mt-1">O ícone <code className="font-mono text-xs">ArrowLeft</code> usado no botão de voltar não está listado no grupo NAVEGAÇÃO INTERNA da tabela de ícones, apesar de estar documentado na seção Navegação.</p>
        </div>
      </div>

      {/* Bloco 1 — Biblioteca e importação */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Biblioteca</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">Lucide React</span>
            <span className="font-mono text-xs text-gray-500">v0.487.0</span>
          </div>
          <a
            href="https://lucide.dev"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[var(--brand-600)] hover:underline"
          >
            lucide.dev →
          </a>
        </div>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto leading-relaxed">{`import { NomeDoIcone } from 'lucide-react';

<NomeDoIcone className="w-5 h-5 text-gray-500" />`}</pre>
      </div>

      {/* Bloco 2 — Tamanhos padrão */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Tamanhos de uso</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="border border-gray-200 bg-white rounded-lg p-4 flex flex-col gap-2">
            <Settings className="w-4 h-4 text-[var(--brand-600)]" />
            <code className="font-mono text-xs text-gray-700">w-4 h-4</code>
            <span className="text-xs text-gray-400">16px</span>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">Ícones em badges, texto inline, mensagens de orientação (Info)</p>
          </div>
          <div className="border border-[var(--brand-300)] bg-[var(--brand-50)] rounded-lg p-4 flex flex-col gap-2">
            <Settings className="w-5 h-5 text-[var(--brand-600)]" />
            <code className="font-mono text-xs text-gray-700">w-5 h-5</code>
            <span className="text-xs text-gray-400">20px</span>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">Ícones em cards de métricas, botões, toolbar — USO PRINCIPAL</p>
          </div>
          <div className="border border-gray-200 bg-white rounded-lg p-4 flex flex-col gap-2">
            <Settings className="w-6 h-6 text-[var(--brand-600)]" />
            <code className="font-mono text-xs text-gray-700">w-6 h-6</code>
            <span className="text-xs text-gray-400">24px</span>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">Ícones na sidebar de navegação, ações em tabela</p>
          </div>
          <div className="border border-gray-200 bg-white rounded-lg p-4 flex flex-col gap-2">
            <Settings className="w-8 h-8 text-[var(--brand-600)]" />
            <code className="font-mono text-xs text-gray-700">w-8 h-8</code>
            <span className="text-xs text-gray-400">32px</span>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">Ícones decorativos em estados vazios, headers de seção</p>
          </div>
        </div>
      </div>

      {/* Bloco 3 — Ícones por contexto */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Ícones por contexto</h2>
        <p className="text-xs text-gray-500 mb-3">
          Ícones fixados por função no sistema. Não substituir sem atualizar esta documentação.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
            <span className="w-10 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Ícone</span>
            <span className="w-40 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Nome</span>
            <span className="flex-1 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Contexto de uso</span>
          </div>
          {ICONES_GRUPOS.map((grupo) => (
            <div key={grupo.grupo}>
              <div className="px-4 py-1.5 bg-gray-50 border-t border-gray-200">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{grupo.grupo}</span>
              </div>
              <div className="divide-y divide-gray-100">
                {grupo.rows.map((row, i) => {
                  const Icone = row.icone;
                  return (
                    <div key={i} className="flex items-center px-4 py-2.5">
                      <div className="w-10 flex-shrink-0">
                        <Icone className="w-5 h-5 text-gray-700" />
                      </div>
                      <div className="w-40 flex-shrink-0 min-w-0">
                        <code className="font-mono text-xs text-gray-600 break-all">{row.nome}</code>
                      </div>
                      <p className="flex-1 text-sm text-gray-500">{row.contexto}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bloco 4 — Cores de ícones */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Cores por contexto</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
            <span className="w-28 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Cor</span>
            <span className="w-56 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Classe</span>
            <span className="flex-1 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Uso</span>
          </div>
          <div className="divide-y divide-gray-100">
            {ICONES_CORES.map((item) => (
              <div key={item.classe} className="flex items-center px-4 py-2.5">
                <span className="w-28 flex-shrink-0 text-sm text-gray-700">{item.nome}</span>
                <div className="w-56 flex-shrink-0 flex items-center gap-2 min-w-0">
                  <Settings className={`w-5 h-5 flex-shrink-0 ${item.classe}`} />
                  <code className="font-mono text-xs text-gray-600 break-all">{item.classe}</code>
                </div>
                <p className="flex-1 text-xs text-gray-500">{item.uso}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bloco 5 — Regras de uso */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Regras de uso</h2>
        <div className="bg-[var(--brand-50)] border border-[var(--brand-200)] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0" />
            <span className="text-sm font-medium text-[var(--brand-700)]">Orientações de uso</span>
          </div>
          <ul className="text-sm text-gray-700 space-y-2 pl-2">
            <li>Sempre importe de <code className="font-mono text-xs bg-white/60 px-1 rounded">lucide-react</code> — nunca de outras bibliotecas</li>
            <li>Nunca use SVG inline não documentado</li>
            <li>Sempre defina tamanho via <code className="font-mono text-xs bg-white/60 px-1 rounded">className</code> (<code className="font-mono text-xs bg-white/60 px-1 rounded">w-X h-X</code>) — nunca via <code className="font-mono text-xs bg-white/60 px-1 rounded">{"style={{ width, height }}"}</code></li>
            <li>Nunca use ícones como único indicador de ação — sempre acompanhe com texto ou tooltip</li>
            <li>Ícones em botões: sempre à esquerda do texto, <code className="font-mono text-xs bg-white/60 px-1 rounded">gap-2</code> entre ícone e texto</li>
            <li>Ícones em cards de métricas: sempre à direita, <code className="font-mono text-xs bg-white/60 px-1 rounded">w-5 h-5 text-[var(--brand-600)] flex-shrink-0</code></li>
            <li>Não adicione novos ícones sem atualizar esta documentação</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Seção: Botões ────────────────────────────────────────────────────────────

function SecaoBotoes() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Botões</h1>
      <p className="text-sm text-gray-600 mb-4">
        Botões comunicam ações. Use a variante correta para cada nível de hierarquia de ação.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={0} />

      {/* Bloco 1 — Variantes */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Variantes</h2>
        <div className="flex flex-col gap-6">

          <div className="flex items-start gap-6">
            <div className="w-40 flex-shrink-0 flex items-start pt-1">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors">
                Ação primária
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <code className="block font-mono text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-2 mb-1.5 leading-relaxed break-all">
                bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)]
              </code>
              <p className="text-xs text-gray-500">Ação principal da página ou drawer. Máximo 1 por contexto visível.</p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-40 flex-shrink-0 flex items-start pt-1">
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--brand-600)] text-[var(--brand-600)] text-sm font-medium rounded-lg hover:bg-[var(--brand-50)] transition-colors">
                Ação secundária
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <code className="block font-mono text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-2 mb-1.5 leading-relaxed break-all">
                border border-[var(--brand-600)] text-[var(--brand-600)] text-sm font-medium rounded-lg hover:bg-[var(--brand-50)]
              </code>
              <p className="text-xs text-gray-500">Ação alternativa, cancelar com intenção, salvar rascunho.</p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-40 flex-shrink-0 flex items-start pt-1">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                Ação terciária
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <code className="block font-mono text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-2 mb-1.5 leading-relaxed break-all">
                text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100
              </code>
              <p className="text-xs text-gray-500">Ações de menor hierarquia, cancelar simples.</p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-40 flex-shrink-0 flex items-start pt-1">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                Desativar
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <code className="block font-mono text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-2 mb-1.5 leading-relaxed break-all">
                bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700
              </code>
              <p className="text-xs text-gray-500">Ações irreversíveis ou de risco (desativar, arquivar).</p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-40 flex-shrink-0 flex items-start pt-1">
              <button className="p-1.5 md:p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <code className="block font-mono text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-2 mb-1.5 leading-relaxed break-all">
                p-1.5 md:p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700
              </code>
              <p className="text-xs text-gray-500">Ações em tabelas (editar, visualizar, toggle de status). Sempre acompanhado de tooltip ou contexto visual claro.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bloco 2 — Estados */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Estados</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-3">Normal</p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors">
              Ação primária
            </button>
            <p className="font-mono text-xs text-gray-400 mt-3">bg-[var(--brand-600)]</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-3">Hover</p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-700)] text-white text-sm font-medium rounded-lg transition-colors">
              Ação primária
            </button>
            <p className="font-mono text-xs text-gray-400 mt-3">bg-[var(--brand-700)]</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-3">Desabilitado</p>
            <button
              disabled
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg opacity-50 cursor-not-allowed"
            >
              Desabilitado
            </button>
            <p className="font-mono text-xs text-gray-400 mt-3">opacity-50 cursor-not-allowed</p>
            <p className="text-xs text-gray-400 mt-1">Adicione disabled e opacity-50 cursor-not-allowed ao botão.</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-3">Carregando</p>
            <button
              disabled
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg opacity-75 cursor-not-allowed"
            >
              <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Salvando...
            </button>
            <p className="font-mono text-xs text-gray-400 mt-3">opacity-75 cursor-not-allowed + animate-spin</p>
          </div>
        </div>
      </div>

      {/* Bloco 3 — Botões com ícone */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Botões com ícone</h2>
        <p className="text-xs text-gray-500 mb-4">Ícone sempre à esquerda do texto, gap-2.</p>
        <div className="flex flex-col gap-4">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors self-start">
            <Plus className="w-4 h-4" />
            Criar avaliação
          </button>

          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors self-start">
            <Download className="w-4 h-4" />
            Exportar
          </button>

          <div>
            <p className="text-xs text-gray-500 mb-2">Ação em tabela (ícone apenas):</p>
            <div className="flex items-center gap-1">
              <button className="p-1.5 md:p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-1.5 md:p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button className="p-1.5 md:p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                <Power className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bloco 4 — Hierarquia de ações em drawers */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Hierarquia de ações em drawers</h2>
        <p className="text-xs text-gray-500 mb-4">Padrão fixo para rodapé de drawers e modais de confirmação.</p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-end gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50">
            <button className="px-3 md:px-4 py-2 border border-gray-300 text-gray-700 text-xs md:text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button className="px-3 md:px-4 py-2 border border-[var(--brand-600)] text-[var(--brand-600)] text-xs md:text-sm font-medium rounded-lg hover:bg-[var(--brand-50)] transition-colors">
              Salvar
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Cancelar sempre à esquerda, ação primária sempre à direita. Nunca inverta essa ordem.
        </p>
      </div>

      {/* Bloco 5 — Regras de uso */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Regras de uso</h2>
        <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-1" />
          <ul className="text-sm text-gray-700 space-y-2">
            <li>Máximo 1 botão primário por contexto visível</li>
            <li>Nunca use <code className="font-mono text-xs bg-white/60 px-1 rounded">font-bold</code> em botões — sempre <code className="font-mono text-xs bg-white/60 px-1 rounded">font-medium</code></li>
            <li>Ícone sempre à esquerda do texto, nunca à direita</li>
            <li>Botões de ação em tabela: apenas ícone, sem texto, <code className="font-mono text-xs bg-white/60 px-1 rounded">p-1.5 md:p-2</code></li>
            <li>Nunca use <code className="font-mono text-xs bg-white/60 px-1 rounded">button</code> sem type definido em formulários — use <code className="font-mono text-xs bg-white/60 px-1 rounded">type="button"</code> ou <code className="font-mono text-xs bg-white/60 px-1 rounded">type="submit"</code> explicitamente</li>
            <li>Ações destrutivas sempre em vermelho e sempre com modal de confirmação antes de executar</li>
            <li>Botão "Cancelar" nunca em vermelho — sempre ghost ou outline neutro</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Seção: Tabelas ───────────────────────────────────────────────────────────

const TABELA_ROWS = [
  { nome: 'React', competencia: 'Desenvolvimento Frontend', tipo: 'Técnica', status: 'Ativa' },
  { nome: 'Comunicação Clara', competencia: 'Comunicação Corporativa', tipo: 'Comportamental', status: 'Ativa' },
  { nome: 'Node.js', competencia: 'Desenvolvimento Backend', tipo: 'Técnica', status: 'Desativada' },
];

function SecaoTabelas() {
  return (
    <div>
      <div className="max-w-2xl mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Tabelas</h1>
        <p className="text-sm text-gray-600">
          Componente principal de listagem do sistema. Sempre use a estrutura completa — container,
          toolbar, thead, tbody e paginação.
        </p>
      </div>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={0} />

      {/* Bloco 1 — Estrutura completa */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Estrutura completa</h2>
        <p className="text-xs text-gray-500 mb-4">Renderize uma tabela de exemplo real com dados fictícios de habilidades.</p>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-3 md:p-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  readOnly
                  placeholder="Buscar..."
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent w-64"
                />
              </div>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                {['Todos', 'Ativos', 'Desativadas'].map((f) => (
                  <button
                    key={f}
                    className={
                      f === 'Ativos'
                        ? 'px-3 py-2 text-sm font-normal rounded-md bg-white text-gray-900 shadow-sm transition-all'
                        : 'px-3 py-2 text-sm font-normal rounded-md text-gray-600 hover:text-gray-900 transition-all'
                    }
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors">
              <Plus className="w-4 h-4" />
              Criar habilidade
            </button>
          </div>

          {/* Tabela */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-[30%] px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Nome da habilidade</th>
                <th className="w-[30%] px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Competência</th>
                <th className="w-[15%] px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="w-[12%] px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="w-[13%] px-3 md:px-6 py-3 md:py-4 text-right text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {TABELA_ROWS.map((row) => (
                <tr key={row.nome} className="transition-colors">
                  <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900 font-medium">{row.nome}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-500">{row.competencia}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-500">{row.tipo}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <span className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${
                      row.status === 'Ativa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 md:p-2 rounded-lg transition-colors relative text-gray-600 hover:bg-gray-100">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 md:p-2 rounded-lg transition-colors relative text-gray-600 hover:bg-gray-100">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 md:p-2 rounded-lg transition-colors relative">
                        <ToggleSwitch checked={row.status === 'Ativa'} onChange={() => {}} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginação */}
          <div className="flex flex-col md:flex-row items-center justify-between px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50 gap-3 md:gap-0">
            <div className="text-xs md:text-sm text-gray-700">
              <span className="hidden md:inline">Exibindo </span>
              <span className="font-medium">1</span>–
              <span className="font-medium">3</span> de{' '}
              <span className="font-medium">3</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <button
                disabled
                className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-3 md:w-4 h-3 md:h-4" />
              </button>
              <div className="flex items-center gap-0.5 md:gap-1">
                <button className="min-w-[32px] md:min-w-[40px] px-2 md:px-3 py-1.5 md:py-2 text-xs font-normal rounded-lg transition-colors bg-gray-100 text-gray-900 border border-gray-200">
                  1
                </button>
              </div>
              <button
                disabled
                className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
              >
                <ChevronRight className="w-3 md:w-4 h-3 md:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bloco 2 — Anatomia */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Anatomia da tabela</h2>
        <ol className="space-y-3 text-sm text-gray-700 list-none">
          {[
            { n: 1, titulo: 'Container', desc: 'bg-white rounded-lg border border-gray-200 overflow-hidden. Sempre com overflow-hidden para respeitar o border-radius nas bordas.' },
            { n: 2, titulo: 'Toolbar', desc: 'p-3 md:p-4 border-b border-gray-200. Contém busca, filtros e botão de ação principal. Botão de ação sempre com ml-auto à direita.' },
            { n: 3, titulo: 'thead', desc: 'bg-gray-50 border-b border-gray-200. Texto uppercase tracking-wider text-gray-500. Nunca use bold no cabeçalho.' },
            { n: 4, titulo: 'tbody', desc: 'divide-y divide-gray-200. Sem hover em linhas não clicáveis. Hover brand-translúcido apenas em linhas clicáveis (cursor-pointer).' },
            { n: 5, titulo: 'Paginação', desc: 'border-t border-gray-200. Contagem à esquerda, controles à direita. Botões desabilitados com opacity-50.' },
          ].map(({ n, titulo, desc }) => (
            <li key={n} className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--brand-100)] text-[var(--brand-700)] text-xs font-semibold flex items-center justify-center">{n}</span>
              <div>
                <span className="font-medium text-gray-900">{titulo}</span>
                <span className="text-gray-500"> — {desc}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Bloco 3 — Comportamento de linhas */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Comportamento de linhas</h2>
        <div className="flex flex-col gap-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-600">Linha não clicável (padrão)</p>
            </div>
            <div className="px-4 py-3">
              <pre className="text-xs font-mono text-gray-700 mb-2">{`<tr className="transition-colors">`}</pre>
              <p className="text-xs text-gray-500">Sem hover. Navegação apenas via ícones de ação.</p>
              <p className="text-xs text-gray-400 mt-1">Uso: Habilidades, Avaliações (lista).</p>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-600">Linha clicável</p>
            </div>
            <div className="px-4 py-3">
              <pre className="text-xs font-mono text-gray-700 mb-2 whitespace-pre-wrap">{`<tr className="hover:bg-[rgba(0,159,194,0.06)]\n  cursor-pointer transition-colors">`}</pre>
              <p className="text-xs text-gray-500">Linha inteira é área clicável.</p>
              <p className="text-xs text-gray-400 mt-1">Uso: Carreiras (navega para página interna).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bloco 4 — Estado vazio */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Estado vazio</h2>
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-600">Sem resultados de busca/filtro</p>
            </div>
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">Nenhum resultado encontrado.</p>
              <button className="mt-2 text-sm font-medium text-[var(--brand-600)] hover:underline">
                Limpar filtros
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-600">Sem dados cadastrados</p>
            </div>
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">Nenhuma habilidade cadastrada ainda.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bloco 5 — Regras de uso */}
      <div className="mb-8">
        <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-1" />
          <ul className="text-sm text-[var(--brand-700)] space-y-2 list-none">
            <li>Sempre use a estrutura completa: container → toolbar → tabela → paginação</li>
            <li>Nunca omita o overflow-hidden do container</li>
            <li>Toolbar sempre dentro do container da tabela, com border-b separando da tabela</li>
            <li>Botão de ação principal sempre com ml-auto à direita da toolbar</li>
            <li>Ações em linha: máximo 3 ícones, sem texto, sem menu de contexto (MoreVertical)</li>
            <li>Nunca adicione ações não previstas no Figma</li>
            <li>Linhas clicáveis: hover brand-translúcido. Linhas não clicáveis: sem hover</li>
            <li>Estado vazio com filtro aplicado: mostrar "Limpar filtros"</li>
            <li>Estado vazio sem dados: sem botão de limpar filtros</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Seção: Filtros e Pills ────────────────────────────────────────────────────

function PillGroupDemo({ pills }: { pills: string[] }) {
  const [ativo, setAtivo] = useState(pills[0]);
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1 flex-wrap gap-y-1">
      {pills.map((p) => (
        <button
          key={p}
          onClick={() => setAtivo(p)}
          className={
            ativo === p
              ? 'px-3 py-2 text-sm font-normal rounded-md bg-white text-gray-900 shadow-sm transition-all whitespace-nowrap'
              : 'px-3 py-2 text-sm font-normal rounded-md text-gray-600 hover:text-gray-900 transition-all whitespace-nowrap'
          }
        >
          {p}
        </button>
      ))}
    </div>
  );
}

function SecaoFiltrosEPills() {
  const [filtroAtivo, setFiltroAtivo] = useState('Ativos');
  const [competenciaBloco3, setCompetenciaBloco3] = useState('todas');
  const [buscaBloco4, setBuscaBloco4] = useState('');
  const [filtroBloco4, setFiltroBloco4] = useState('Ativos');
  const [competenciaBloco4, setCompetenciaBloco4] = useState('todas');

  const VARIACOES_PILLS = [
    { contexto: 'Competências / Habilidades / Carreiras / Jornadas', pills: ['Todos', 'Ativas', 'Desativadas'] },
    { contexto: 'Níveis', pills: ['Todos', 'Ativos', 'Desativados', 'Arquivados'] },
    { contexto: 'Perfis', pills: ['Todos', 'Ativos', 'Desativados'] },
    { contexto: 'Avaliações', pills: ['Todas', 'Rascunho', 'Ativas', 'Encerradas'] },
    { contexto: 'Avaliações (Colaborador)', pills: ['Todos', 'Não iniciada', 'Em andamento', 'Concluída', 'Expirada'] },
  ];

  return (
    <div>
      <div className="max-w-2xl mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Filtros e Pills</h1>
        <p className="text-sm text-gray-600">
          Componentes de filtragem usados nas toolbars de listagem. Sempre use o padrão completo —
          pills de status + campo de busca + dropdowns.
        </p>
      </div>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={1} />

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 mb-8 max-w-2xl">
        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-800">Ícone Search com tamanho divergente</p>
          <p className="text-sm text-yellow-700 mt-1">ListingPage.tsx usa ícone <code className="font-mono text-xs">Search</code> com <code className="font-mono text-xs">w-5 h-5</code> no desktop. O DS documenta apenas <code className="font-mono text-xs">w-4 h-4</code> na seção de ícones e no exemplo da toolbar.</p>
        </div>
      </div>

      {/* Bloco 1 — Pills de filtro de status */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Pills de filtro de status</h2>
        <p className="text-sm text-gray-500 mb-4">
          Usadas para filtrar por estado do registro. Sempre dentro de um container{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">bg-gray-100 rounded-lg</code>.
        </p>
        <div className="mb-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {['Todos', 'Ativos', 'Desativadas'].map((f) => (
              <button
                key={f}
                onClick={() => setFiltroAtivo(f)}
                className={
                  filtroAtivo === f
                    ? 'px-3 py-2 text-sm font-normal rounded-md bg-white text-gray-900 shadow-sm transition-all whitespace-nowrap'
                    : 'px-3 py-2 text-sm font-normal rounded-md text-gray-600 hover:text-gray-900 transition-all whitespace-nowrap'
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-2xl">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Estado</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {[
                { label: 'Container', classes: 'flex items-center bg-gray-100 rounded-lg p-1' },
                { label: 'Item ativo', classes: 'px-3 py-2 text-sm font-normal rounded-md bg-white text-gray-900 shadow-sm transition-all whitespace-nowrap' },
                { label: 'Item inativo', classes: 'px-3 py-2 text-sm font-normal rounded-md text-gray-600 hover:text-gray-900 transition-all whitespace-nowrap' },
              ].map(({ label, classes }) => (
                <tr key={label}>
                  <td className="px-4 py-2.5 text-xs font-medium text-gray-700">{label}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{classes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bloco 2 — Campo de busca */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Campo de busca</h2>
        <p className="text-sm text-gray-500 mb-4">
          Sempre com ícone Search à esquerda via{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">position relative</code>.
        </p>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar habilidade..."
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent w-64"
            />
          </div>
        </div>
        <div className="max-w-2xl">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Elemento</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {[
                { label: 'Container', classes: 'relative' },
                { label: 'Ícone Search', classes: 'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' },
                { label: 'Input', classes: 'pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent w-64' },
              ].map(({ label, classes }) => (
                <tr key={label}>
                  <td className="px-4 py-2.5 text-xs font-medium text-gray-700">{label}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{classes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bloco 3 — Dropdown de filtro */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Dropdown de filtro</h2>
        <p className="text-sm text-gray-500 mb-4">
          Usado para filtros com múltiplas opções (gerência, cargo, competência). Sempre{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Radix Select</code> — nunca{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">{'<select>'}</code> nativo.
        </p>
        <div className="mb-4">
          <Select value={competenciaBloco3} onValueChange={setCompetenciaBloco3}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Todas as competências" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as competências</SelectItem>
              <SelectItem value="frontend">Desenvolvimento Frontend</SelectItem>
              <SelectItem value="backend">Desenvolvimento Backend</SelectItem>
              <SelectItem value="softskills">Soft Skills</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bloco 4 — Toolbar completa */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Toolbar completa</h2>
        <p className="text-sm text-gray-500 mb-4">
          Combinação de todos os elementos numa toolbar real. Busca e filtros à esquerda,
          botão de ação à direita.
        </p>
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={buscaBloco4}
                onChange={(e) => setBuscaBloco4(e.target.value)}
                placeholder="Buscar habilidade..."
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent w-64"
              />
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {['Todos', 'Ativos', 'Desativadas'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltroBloco4(f)}
                  className={
                    filtroBloco4 === f
                      ? 'px-3 py-2 text-sm font-normal rounded-md bg-white text-gray-900 shadow-sm transition-all whitespace-nowrap'
                      : 'px-3 py-2 text-sm font-normal rounded-md text-gray-600 hover:text-gray-900 transition-all whitespace-nowrap'
                  }
                >
                  {f}
                </button>
              ))}
            </div>
            <Select value={competenciaBloco4} onValueChange={setCompetenciaBloco4}>
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Todas as competências" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as competências</SelectItem>
                <SelectItem value="frontend">Desenvolvimento Frontend</SelectItem>
                <SelectItem value="backend">Desenvolvimento Backend</SelectItem>
                <SelectItem value="softskills">Soft Skills</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors">
            <Plus className="w-4 h-4" />
            Criar habilidade
          </button>
        </div>
      </div>

      {/* Bloco 5 — Variações por contexto */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Variações por contexto</h2>
        <p className="text-sm text-gray-500 mb-4">
          O texto das pills acompanha o gênero e o vocabulário do contexto.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Contexto</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pills</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {VARIACOES_PILLS.map(({ contexto, pills }) => (
                <tr key={contexto}>
                  <td className="px-4 py-3 text-xs text-gray-700 align-middle">{contexto}</td>
                  <td className="px-4 py-3">
                    <PillGroupDemo pills={pills} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bloco 6 — Regras de uso */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Regras de uso</h2>
        <div className="max-w-2xl bg-blue-50 border border-blue-200 rounded-lg p-4">
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
            <li>
              Pills sempre dentro do container{' '}
              <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-blue-100">bg-gray-100 rounded-lg p-1</code>
            </li>
            <li>Aba padrão sempre "Ativos/Ativas" — nunca "Todos" como padrão</li>
            <li>
              Campo de busca sempre com ícone Search via{' '}
              <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-blue-100">position absolute</code> — nunca inline
            </li>
            <li>
              Botão de ação sempre com{' '}
              <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-blue-100">ml-auto</code> ou{' '}
              <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-blue-100">justify-between</code> no container pai
            </li>
            <li>
              Dropdowns de filtro: usar Radix Select — nunca{' '}
              <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-blue-100">{'<select>'}</code> nativo
            </li>
            <li>Filtros aplicados: mostrar contador no botão ex: "Gerência (2)" — nunca tags expandidas</li>
            <li>
              Toolbar sempre separada da tabela por{' '}
              <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-blue-100">border-b border-gray-200</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Seção: Cards ─────────────────────────────────────────────────────────────

function SecaoCards() {
  const METRICAS = [
    {
      label: 'Colaboradores ativos',
      valor: '97',
      detalhe: 'Sincronizados do RM',
      icone: Users,
      badge: null,
    },
    {
      label: 'Habilidades cadastradas',
      valor: '28',
      detalhe: 'Últimos 30 dias',
      icone: BookOpen,
      badge: { sinal: '↑', valor: '4%', classes: 'bg-green-100 text-green-700' },
    },
    {
      label: 'Avaliações ativas',
      valor: '5',
      detalhe: 'Últimos 30 dias',
      icone: ClipboardList,
      badge: { sinal: '↓', valor: '8%', classes: 'bg-red-100 text-red-700' },
    },
    {
      label: 'Avaliações respondidas',
      valor: '12',
      detalhe: 'Hoje vs. ontem',
      icone: CheckCircle2,
      badge: { sinal: '↑', valor: '20%', classes: 'bg-green-100 text-green-700' },
    },
  ];

  const CARGOS = [
    {
      nome: 'Desenvolvedor Frontend — Pleno',
      badgeLabel: 'Cargo atual',
      badgeClasses: 'bg-[var(--brand-600)] text-white',
      coberturaLabel: 'Boa cobertura — 85% das habilidades mapeadas atendidas',
      coberturaClasses: 'text-xs text-green-600 mb-2',
      barraClasses: 'bg-green-500',
      largura: '85%',
      cardBg: 'bg-[var(--brand-50)]',
    },
    {
      nome: 'Desenvolvedor Frontend — Sênior',
      badgeLabel: 'Referência para desenvolvimento',
      badgeClasses: 'bg-gray-100 text-gray-700',
      coberturaLabel: 'Cobertura parcial — 65% das habilidades mapeadas atendidas',
      coberturaClasses: 'text-xs text-yellow-600 mb-2',
      barraClasses: 'bg-yellow-500',
      largura: '65%',
      cardBg: '',
    },
    {
      nome: 'Tech Lead — Frontend',
      badgeLabel: null,
      badgeClasses: '',
      coberturaLabel: 'Baixa cobertura — 35% das habilidades mapeadas atendidas',
      coberturaClasses: 'text-xs text-red-600 mb-2',
      barraClasses: 'bg-red-500',
      largura: '35%',
      cardBg: '',
    },
  ];

  return (
    <div>
      <div className="max-w-2xl mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Cards</h1>
        <p className="text-sm text-gray-600">
          Cards são containers de conteúdo agrupado. O sistema tem três variantes principais:
          card de métrica, card de conteúdo e card de estado.
        </p>
      </div>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={0} />

      {/* Bloco 1 — Card de métrica */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Card de métrica</h2>
        <p className="text-sm text-gray-500 mb-4">
          Usado no Dashboard (Admin) e em Meu Perfil e Minhas Avaliações (Colaborador).
          Exibe um número grande com label e ícone.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {METRICAS.map(({ label, valor, detalhe, icone: Icone, badge }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-semibold text-gray-700">{label}</span>
                <Icone className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{valor}</p>
              {badge ? (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">{detalhe}</span>
                  <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${badge.classes}`}>
                    {badge.sinal} {badge.valor}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-2">{detalhe}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bloco 2 — Card de conteúdo */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Card de conteúdo</h2>
        <p className="text-sm text-gray-500 mb-4">
          Container genérico para agrupar seções de conteúdo relacionado.
        </p>
        <div className="max-w-lg">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Título da seção</h3>
                <p className="text-sm text-gray-500 mt-0.5">Descrição opcional do conteúdo</p>
              </div>
              <button className="text-xs md:text-sm font-medium text-[var(--brand-600)] hover:underline">
                Ver todos →
              </button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-sm text-gray-900">Item de exemplo {i}</span>
                  <span className="text-sm text-gray-500">Detalhe</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bloco 3 — Card de cargo */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Card de cargo</h2>
        <p className="text-sm text-gray-500 mb-4">
          Usado na Jornada de Carreira do Colaborador. Exibe cobertura de habilidades por cargo
          com barra de progresso colorida.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CARGOS.map(({ nome, badgeLabel, badgeClasses, coberturaLabel, coberturaClasses, barraClasses, largura, cardBg }) => (
            <div key={nome} className={`border border-gray-200 rounded-lg p-4 ${cardBg}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{nome}</p>
                  {badgeLabel && (
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${badgeClasses}`}>
                      {badgeLabel}
                    </span>
                  )}
                </div>
              </div>
              <p className={coberturaClasses}>{coberturaLabel}</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className={`${barraClasses} h-1.5 rounded-full`} style={{ width: largura }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bloco 4 — Card de identificação */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Card de identificação</h2>
        <p className="text-sm text-gray-500 mb-4">
          Usado no topo de Meu Perfil. Gradiente slate com saudação dinâmica.
        </p>
        <div
          className="rounded-xl p-6 md:p-8 border border-slate-200"
          style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}
        >
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Boa tarde, João. 👋🏻
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Desenvolvedor Frontend · Pleno · 1 ano e 3 meses no cargo
            </p>
          </div>
        </div>
      </div>

      {/* Bloco 5 — Regras de uso */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Regras de uso</h2>
        <div className="max-w-2xl bg-blue-50 border border-blue-200 rounded-lg p-4">
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
            <li>
              Cards sempre com{' '}
              <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-blue-100">bg-white border border-gray-200 rounded-lg</code>
            </li>
            <li>
              Padding padrão:{' '}
              <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-blue-100">p-5</code>{' '}
              para cards de métrica e conteúdo — nunca{' '}
              <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-blue-100">p-6</code> ou maior
            </li>
            <li>
              Card de identificação usa{' '}
              <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-blue-100">rounded-xl</code>{' '}
              e gradiente slate — exceção documentada
            </li>
            <li>Nunca use shadow em cards — apenas border</li>
            <li>
              Card de métrica: label acima, número grande, ícone solto à direita — nunca container
              colorido no ícone
            </li>
            <li>
              Card de cargo com{' '}
              <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-blue-100">bg-[var(--brand-50)]</code>{' '}
              apenas quando é o cargo atual
            </li>
            <li>
              Ação inline no card (Ver todos →): sempre{' '}
              <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-blue-100">text-[var(--brand-600)]</code>
              , nunca botão com fundo
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Seção: Drawers ───────────────────────────────────────────────────────────

function SecaoDrawers() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Drawers</h1>
      <p className="text-sm text-gray-600 mb-4">
        Painéis laterais deslizantes usados para criar e editar registros. Sempre surgem
        pela direita e cobrem parcialmente o conteúdo.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={0} />

      {/* Bloco 1 — Anatomia */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Anatomia do drawer</h2>
        <div
          className="border border-gray-200 rounded-lg overflow-hidden flex flex-col"
          style={{ height: '480px', width: '100%', maxWidth: '440px' }}
        >
          {/* Header */}
          <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900">Criar habilidade</h2>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Área de campos (scroll) */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-5">
            {/* Campo texto */}
            <div>
              <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block">
                Nome da habilidade *
              </label>
              <input
                readOnly
                placeholder="Ex: React"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
              />
            </div>

            {/* Campo textarea */}
            <div>
              <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block">
                Descrição
              </label>
              <textarea
                readOnly
                placeholder="Descreva esta habilidade..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent resize-none"
              />
            </div>

            {/* Campo select — Competência */}
            <div>
              <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block">
                Competência *
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma competência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Desenvolvimento Frontend</SelectItem>
                  <SelectItem value="backend">Desenvolvimento Backend</SelectItem>
                  <SelectItem value="softskills">Soft Skills</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campo select — Tipo */}
            <div>
              <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block">
                Tipo *
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tecnica">Técnica</SelectItem>
                  <SelectItem value="comportamental">Comportamental</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer fixo */}
          <div className="flex items-center justify-end gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50">
            <button className="px-3 md:px-4 py-2 border border-gray-300 text-gray-700 text-xs md:text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button className="px-3 md:px-4 py-2 border border-[var(--brand-600)] text-[var(--brand-600)] text-xs md:text-sm font-medium rounded-lg hover:bg-[var(--brand-50)] transition-colors">
              Salvar
            </button>
          </div>
        </div>
      </div>

      {/* Bloco 2 — Especificações de espaçamento */}
      <div className="mb-8 max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Espaçamentos do drawer</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Área</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Classes</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { area: 'Header padding', classes: 'px-4 md:px-6 py-3 md:py-4', valor: 'H: 16–24px / V: 12–16px' },
                { area: 'Campos padding', classes: 'px-4 md:px-6 py-4 md:py-6', valor: 'H: 16–24px / V: 16–24px' },
                { area: 'Gap entre campos', classes: 'space-y-4 md:space-y-5', valor: '16–20px' },
                { area: 'Footer padding', classes: 'px-4 md:px-6 py-3 md:py-4', valor: 'H: 16–24px / V: 12–16px' },
                { area: 'Gap entre botões', classes: 'gap-2 md:gap-3', valor: '8–12px' },
                { area: 'Label → input', classes: 'mb-1.5 md:mb-2', valor: '6–8px' },
              ].map(({ area, classes, valor }) => (
                <tr key={area} className="bg-white">
                  <td className="px-4 py-3 font-medium text-gray-900">{area}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{classes}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bloco 3 — Drawer de somente leitura */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Drawer de somente leitura</h2>
        <p className="text-xs text-gray-500 mb-3">
          Usado para visualizar detalhes sem edição. Acessado pelo ícone Eye na tabela.
          Não tem botão Salvar — apenas Fechar.
        </p>
        <div
          className="border border-gray-200 rounded-lg overflow-hidden flex flex-col"
          style={{ height: '320px', width: '100%', maxWidth: '440px' }}
        >
          {/* Header */}
          <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900">Detalhes da habilidade</h2>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo estático */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-4">
            {[
              { label: 'Nome', valor: 'React' },
              { label: 'Competência', valor: 'Desenvolvimento Frontend' },
              { label: 'Tipo', valor: 'Técnica' },
              { label: 'Status', valor: 'Ativa' },
            ].map(({ label, valor }) => (
              <div key={label}>
                <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
                <p className="text-sm text-gray-900">{valor}</p>
              </div>
            ))}
          </div>

          {/* Footer — apenas Fechar */}
          <div className="flex items-center justify-end px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50">
            <button className="px-3 md:px-4 py-2 border border-gray-300 text-gray-700 text-xs md:text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Fechar
            </button>
          </div>
        </div>
      </div>

      {/* Bloco 4 — Regras de uso */}
      <div className="max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Regras de uso</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <ul className="text-sm text-gray-700 space-y-2 list-none">
            <li>Drawers sempre surgem pela direita</li>
            <li>Header sempre com título + botão X (nunca apenas X)</li>
            <li>Área de campos sempre com <code className="font-mono text-xs bg-white/60 px-1 rounded">overflow-y-auto</code> e <code className="font-mono text-xs bg-white/60 px-1 rounded">flex-1</code> para respeitar o footer fixo</li>
            <li>Footer sempre fixo no rodapé — nunca dentro da área de scroll</li>
            <li>Cancelar sempre à esquerda do Salvar</li>
            <li>Drawer de edição: botões Cancelar + Salvar</li>
            <li>Drawer de criação: botões Cancelar + Criar/Salvar</li>
            <li>Drawer somente leitura: apenas botão Fechar</li>
            <li>Campos obrigatórios marcados com * no label</li>
            <li>Nunca abra dois drawers simultaneamente</li>
            <li>Largura padrão: <code className="font-mono text-xs bg-white/60 px-1 rounded">w-full md:w-[35%] md:max-w-xl md:min-w-[400px]</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Seção: Modais ────────────────────────────────────────────────────────────

function SecaoModais() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Modais</h1>
      <p className="text-sm text-gray-600 mb-4">
        Janelas de confirmação para ações críticas ou irreversíveis. Sempre bloqueiam
        a interação com o restante da página.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={0} />

      {/* Bloco 1 — Modal vs Drawer */}
      <div className="mb-8 max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Modal vs Drawer</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 w-32"></th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Modal</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Drawer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { aspecto: 'Propósito', modal: 'Confirmação de ação crítica', drawer: 'Criar ou editar registro' },
                { aspecto: 'Conteúdo', modal: 'Curto — título + descrição + 2 botões', drawer: 'Longo — formulário com múltiplos campos' },
                { aspecto: 'Bloqueio', modal: 'Sempre bloqueia a página', drawer: 'Não bloqueia — overlay parcial' },
                { aspecto: 'Fechamento', modal: 'Botão Cancelar ou clique no overlay', drawer: 'Botão X ou Cancelar' },
                { aspecto: 'Exemplos', modal: 'Desativar, arquivar, excluir', drawer: 'Criar habilidade, editar avaliação' },
              ].map(({ aspecto, modal, drawer }) => (
                <tr key={aspecto} className="bg-white">
                  <td className="px-4 py-3 font-medium text-gray-900">{aspecto}</td>
                  <td className="px-4 py-3 text-gray-600">{modal}</td>
                  <td className="px-4 py-3 text-gray-600">{drawer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bloco 2 — Modal destrutiva */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Modal de confirmação destrutiva</h2>
        <p className="text-xs text-gray-500 mb-3">Usado para desativar, arquivar ou ações irreversíveis.</p>
        <div className="relative rounded-xl overflow-hidden" style={{ height: '340px' }}>
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 text-red-600">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Desativar nível "Avançado"
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ao desativar este nível, ele não será mais visível para os usuários.
                    Este nível está vinculado a 22 habilidades.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    Cancelar
                  </button>
                  <button className="flex-1 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors bg-red-600 hover:bg-red-700">
                    Desativar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bloco 3 — Modal atenção (warning) */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Modal de confirmação — atenção (warning)</h2>
        <p className="text-xs text-gray-500 mb-3">Usado para ações reversíveis com impacto potencial (ex: desativar avaliação com participantes em andamento).</p>
        <div className="relative rounded-xl overflow-hidden" style={{ height: '340px' }}>
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100 text-yellow-600">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Desativar avaliação em andamento
                  </h3>
                  <p className="text-sm text-gray-600">
                    Esta avaliação tem 8 participantes com respostas em andamento.
                    Desativar irá interromper o ciclo — as respostas parciais serão preservadas.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    Cancelar
                  </button>
                  <button className="flex-1 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors bg-yellow-600 hover:bg-yellow-700">
                    Desativar assim mesmo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bloco 4 — Modal neutra */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Modal de confirmação neutra</h2>
        <p className="text-xs text-gray-500 mb-3">
          Usado para ações que precisam de confirmação mas não são destrutivas (ex: restaurar, ativar).
        </p>
        <div className="relative rounded-xl overflow-hidden" style={{ height: '340px' }}>
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--brand-100)] text-[var(--brand-600)]">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Restaurar nível "Avançado"
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ao restaurar, o nível voltará para o estado Desativado. As 22 habilidades
                    vinculadas serão mantidas.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    Cancelar
                  </button>
                  <button className="flex-1 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors bg-[var(--brand-600)] hover:bg-[var(--brand-700)]">
                    Restaurar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bloco 4 — Anatomia */}
      <div className="mb-8 max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Anatomia do modal</h2>
        <ol className="space-y-3 text-sm text-gray-700 list-none">
          {[
            {
              n: '1',
              titulo: 'Overlay',
              desc: 'Fundo escurecido que bloqueia interação.',
              code: 'fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4',
            },
            {
              n: '2',
              titulo: 'Container',
              desc: 'Caixa branca centralizada.',
              code: 'bg-white rounded-lg shadow-xl max-w-md w-full',
            },
            {
              n: '3',
              titulo: 'Ícone',
              desc: 'Centralizado em círculo colorido por variante (danger = bg-red-100 text-red-600, info = bg-brand-100 text-brand-600).',
              code: 'w-12 h-12 rounded-full flex items-center justify-center',
            },
            {
              n: '4',
              titulo: 'Conteúdo',
              desc: 'Centralizado — título text-lg font-semibold text-gray-900 mb-2 + mensagem text-sm text-gray-600.',
              code: 'text-center mb-6',
            },
            {
              n: '5',
              titulo: 'Ações',
              desc: 'Dois botões lado a lado, ambos flex-1. Sem botão X — fechamento apenas pelo Cancelar ou clique no overlay.',
              code: 'flex items-center gap-3',
            },
          ].map(({ n, titulo, desc, code }) => (
            <li key={n} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold flex items-center justify-center">
                {n}
              </span>
              <div>
                <span className="font-medium text-gray-900">{titulo}</span>
                {' — '}
                <span className="text-gray-600">{desc}</span>
                {code && (
                  <code className="block font-mono text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded mt-1">
                    {code}
                  </code>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Bloco 5 — Regras de uso */}
      <div className="max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Regras de uso</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <ul className="text-sm text-gray-700 space-y-2 list-none">
            <li>Sempre use modal para ações destrutivas ou irreversíveis — nunca execute direto</li>
            <li>Ação destrutiva: botão vermelho (<code className="font-mono text-xs bg-white/60 px-1 rounded">bg-red-600 hover:bg-red-700</code>)</li>
            <li>Ação neutra de confirmação: botão primário (<code className="font-mono text-xs bg-white/60 px-1 rounded">bg-[var(--brand-600)]</code>)</li>
            <li>Cancelar sempre à esquerda, ação de confirmação sempre à direita — ambos com <code className="font-mono text-xs bg-white/60 px-1 rounded">flex-1</code></li>
            <li>Sem botão X — fechamento apenas pelo botão Cancelar ou clique no overlay</li>
            <li>Descrição deve mencionar o impacto da ação (ex: "vinculado a 22 habilidades")</li>
            <li>Nunca use modal para formulários com mais de 2 campos — use drawer</li>
            <li>Título sempre menciona o nome do item afetado (ex: "Desativar nível 'Avançado'")</li>
            <li>Nunca empilhe dois modais</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Seção: Formulários ───────────────────────────────────────────────────────

function SecaoFormularios() {
  const ETAPAS_WIZARD = [
    { numero: 1, label: 'Identificação' },
    { numero: 2, label: 'Escopo' },
    { numero: 3, label: 'Configuração' },
    { numero: 4, label: 'Revisão' },
  ];

  const ESTADOS_WIZARD = [
    { estado: 'Completo', circulo: 'bg-[var(--brand-600)] text-white', texto: 'text-gray-500', linha: 'bg-[var(--brand-600)]' },
    { estado: 'Ativo', circulo: 'bg-[var(--brand-600)] text-white ring-2 ring-offset-1 ring-[var(--brand-300)]', texto: 'text-[var(--brand-600)] font-medium', linha: 'bg-gray-200' },
    { estado: 'Inativo', circulo: 'bg-gray-100 text-gray-400 border border-gray-200', texto: 'text-gray-400', linha: 'bg-gray-200' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Formulários</h1>
      <p className="text-sm text-gray-600 mb-4">
        Campos de entrada usados em drawers e wizards. Sempre use os padrões definidos —
        nunca crie variações não documentadas.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={1} />

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 mb-8 max-w-2xl">
        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-800">Asterisco de campo obrigatório</p>
          <p className="text-sm text-yellow-700 mt-1">O DS documenta campos obrigatórios marcados com <code className="font-mono text-xs">*</code> no label sem especificar margin. FormDrawer.tsx usa <code className="font-mono text-xs">ml-1</code> no <code className="font-mono text-xs">{'<span>'}</code> do asterisco — detalhe não documentado.</p>
        </div>
      </div>

      {/* Bloco 1 — Campos de entrada */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Campos de entrada</h2>
        <div className="space-y-6 max-w-sm">

          {/* Text input — normal */}
          <div>
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">Text input — estado normal</p>
            <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block">
              Nome da habilidade <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              readOnly
              placeholder="Ex: React"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
            />
          </div>

          {/* Text input — erro */}
          <div>
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">Text input — estado de erro</p>
            <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block">
              Nome da habilidade <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              readOnly
              placeholder="Ex: React"
              className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="text-sm text-red-600 mt-1">Este campo é obrigatório.</p>
          </div>

          {/* Textarea */}
          <div>
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">Textarea</p>
            <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block">
              Descrição
            </label>
            <textarea
              readOnly
              placeholder="Descreva esta habilidade..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">0/100</p>
          </div>

          {/* Select Radix */}
          <div>
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">Select (Radix)</p>
            <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block">
              Tipo <span className="text-red-500">*</span>
            </label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tecnica">Técnica</SelectItem>
                <SelectItem value="comportamental">Comportamental</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date input */}
          <div>
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">Date input</p>
            <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block">
              Data de início <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
            />
          </div>

        </div>
      </div>

      {/* Bloco 2 — Tabela de classes */}
      <div className="mb-8 max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Classes por elemento</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Elemento</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Classes</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Observação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { el: 'Label', classes: 'text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block', obs: '* para obrigatório' },
                { el: 'Input normal', classes: 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent', obs: '—' },
                { el: 'Input erro', classes: '+ border-red-300 focus:ring-red-500', obs: 'Substituir border-gray-300' },
                { el: 'Textarea', classes: '+ resize-none', obs: 'rows=4 padrão' },
                { el: 'Contador de chars', classes: 'text-xs text-gray-400 mt-1 text-right', obs: 'Quando há limite' },
                { el: 'Mensagem de erro', classes: 'text-sm text-red-600 mt-1', obs: 'Sempre abaixo do campo' },
                { el: 'Hint text', classes: 'text-xs text-gray-500 mt-1', obs: 'Instrução adicional ao campo' },
              ].map(({ el, classes, obs }) => (
                <tr key={el} className="bg-white">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{el}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 break-all">{classes}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{obs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bloco 3 — Wizard */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Wizard — formulário em etapas</h2>
        <p className="text-xs text-gray-500 mb-4">
          Usado na criação de avaliações. Estrutura copiada de <code className="font-mono bg-gray-100 px-1 rounded">NovaAvaliacaoDrawer.tsx</code>.
        </p>

        {/* Stepper demo — etapa 2 ativa (1 completa, 3 e 4 inativas) */}
        <div className="max-w-sm mb-6">
          <div className="flex items-start justify-between">
            {ETAPAS_WIZARD.map((etapa, idx) => {
              const completa = etapa.numero < 2;
              const ativa = etapa.numero === 2;
              return (
                <div key={etapa.numero} className="flex items-start flex-1">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      completa
                        ? 'bg-[var(--brand-600)] text-white'
                        : ativa
                        ? 'bg-[var(--brand-600)] text-white ring-2 ring-offset-1 ring-[var(--brand-300)]'
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}>
                      {completa ? '✓' : etapa.numero}
                    </div>
                    <span className={`mt-1 text-[10px] font-medium text-center whitespace-nowrap ${
                      ativa ? 'text-[var(--brand-600)]' : completa ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {etapa.label}
                    </span>
                  </div>
                  {idx < ETAPAS_WIZARD.length - 1 && (
                    <div className={`flex-1 h-px mt-3.5 mx-1.5 ${completa ? 'bg-[var(--brand-600)]' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabela de estados do stepper */}
        <div className="border border-gray-200 rounded-lg overflow-hidden max-w-2xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Estado</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Círculo</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Texto</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Linha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ESTADOS_WIZARD.map(({ estado, circulo, texto, linha }) => (
                <tr key={estado} className="bg-white">
                  <td className="px-4 py-3 font-medium text-gray-900">{estado}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 break-all">{circulo}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 break-all">{texto}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{linha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bloco 4 — Validação e feedback */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Validação e feedback</h2>
        <div className="space-y-6 max-w-sm">

          {/* 1. Campo válido */}
          <div>
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">1 — Campo válido</p>
            <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block">
              Nome da habilidade <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              readOnly
              defaultValue="React"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">Sem indicador visual — o sistema não usa ícone de check.</p>
          </div>

          {/* 2. Campo com erro */}
          <div>
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">2 — Campo com erro</p>
            <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block">
              Nome da habilidade <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              readOnly
              placeholder="Ex: React"
              className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="text-sm text-red-600 mt-1">Este campo é obrigatório.</p>
          </div>

          {/* 3. Campo desabilitado */}
          <div>
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">3 — Campo desabilitado</p>
            <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block">
              Nome da habilidade
            </label>
            <input
              type="text"
              disabled
              defaultValue="React"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 opacity-50 cursor-not-allowed"
            />
          </div>

        </div>
      </div>

      {/* Bloco 5 — Regras de uso */}
      <div className="max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Regras de uso</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <ul className="text-sm text-gray-700 space-y-2 list-none">
            <li>Label sempre acima do campo — nunca inline ou placeholder como substituto de label</li>
            <li>Campos obrigatórios marcados com <span className="text-red-500 font-medium">*</span> no label, via <code className="font-mono text-xs bg-white/60 px-1 rounded">&lt;span className="text-red-500"&gt;*&lt;/span&gt;</code></li>
            <li>Mensagem de erro sempre abaixo do campo, nunca em tooltip ou modal</li>
            <li>Nunca use border-red no label — apenas no input</li>
            <li>Contador de caracteres sempre à direita, abaixo do campo</li>
            <li>Hint text sempre abaixo do campo, acima da mensagem de erro</li>
            <li>Ordem no formulário: label → input → hint text → mensagem de erro</li>
            <li>Selects: sempre Radix Select — nunca select nativo</li>
            <li>Datas: <code className="font-mono text-xs bg-white/60 px-1 rounded">input type=date</code> — sem date picker customizado no MVP</li>
            <li>Gap entre campos: <code className="font-mono text-xs bg-white/60 px-1 rounded">space-y-4 md:space-y-5</code></li>
            <li>Nunca use autofocus em campos de drawer</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Seção: Navegação ─────────────────────────────────────────────────────────

function SecaoNavegacao() {
  const [activeTabDemo, setActiveTabDemo] = useState('competencias');

  const adminItems = [
    { id: 'dashboard',   label: 'Dashboard',   icon: LayoutDashboard, active: true  },
    { id: 'perfis',      label: 'Perfis',       icon: Users,           active: false },
    { id: 'habilidades', label: 'Habilidades',  icon: Award,           active: false },
    { id: 'carreiras',   label: 'Carreiras',    icon: Briefcase,       active: false },
    { id: 'avaliacoes',  label: 'Avaliações',   icon: ClipboardCheck,  active: false },
  ];

  const colaboradorItems = [
    { id: 'meu-perfil',        label: 'Meu Perfil',        icon: UserCircle,    active: true  },
    { id: 'minhas-avaliacoes', label: 'Minhas Avaliações', icon: ClipboardCheck, active: false },
    { id: 'minha-carreira',    label: 'Minha Carreira',    icon: TrendingUp,    active: false },
  ];

  const tabLabels: Record<string, string> = {
    competencias: 'Competências',
    niveis: 'Níveis de Habilidades',
    habilidades: 'Habilidades',
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Navegação</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          Padrões de navegação do sistema. Sempre siga a hierarquia definida — nunca crie novos padrões sem documentar.
        </p>
        <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={1} />
      </div>

      {/* ── Bloco 1: Sidebar ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-0.5">Sidebar</h3>
          <p className="text-sm text-gray-500">Navegação principal do sistema. Leia Sidebar.tsx e copie a estrutura exata.</p>
        </div>

        <div className="flex flex-wrap gap-8">
          {/* Admin — expandida */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Admin — expandida</p>
            <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-1 w-52">
              {adminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      item.active ? 'bg-[var(--brand-50)]' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${item.active ? 'text-[var(--brand-600)]' : ''}`} />
                    <span className={item.active ? 'text-[var(--brand-700)] font-medium' : ''}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Admin — recolhida */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Admin — recolhida</p>
            <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-1 w-20">
              {adminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`w-full flex items-center justify-center p-3 rounded-lg text-sm font-medium transition-colors ${
                      item.active ? 'bg-[var(--brand-50)]' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${item.active ? 'text-[var(--brand-600)]' : ''}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Colaborador — expandida */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Colaborador — expandida</p>
            <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-1 w-52">
              {colaboradorItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      item.active ? 'bg-[var(--brand-50)]' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${item.active ? 'text-[var(--brand-600)]' : ''}`} />
                    <span className={item.active ? 'text-[var(--brand-700)] font-medium' : ''}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bloco 1b: Mobile ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-0.5">Mobile</h3>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">
            O layout mobile existe no código (sidebar deslizante via <code className="font-mono text-xs">translate-x</code>,
            breakpoints responsivos) mas não foi validado nem projetado intencionalmente.
            As classes responsivas <code className="font-mono text-xs">md:</code> existem como base mas o comportamento
            mobile não foi revisado.
          </p>
        </div>
      </section>

      {/* ── Bloco 2: Botão de voltar ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-0.5">Botão de voltar</h3>
          <p className="text-sm text-gray-500">Usado em páginas internas. Sempre com label da página anterior.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3">
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Carreiras
          </button>
          <code className="block text-xs font-mono text-gray-500 bg-gray-50 rounded px-3 py-2">
            {'flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6'}
          </code>
          <code className="block text-xs font-mono text-gray-500 bg-gray-50 rounded px-3 py-2">
            {'<ArrowLeft className="w-4 h-4" />'}
          </code>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contexto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-gray-700">Dentro de uma carreira</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">← Carreiras</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-700">Dentro de uma jornada</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">← Nome da carreira</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-700">Respondendo avaliação</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">← Minhas Avaliações</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-700">Resultado de avaliação</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">← Minhas Avaliações</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          Nunca use apenas '←' sem label. Nunca use breadcrumb.
        </div>
      </section>

      {/* ── Bloco 3: Tabs de conteúdo ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-0.5">Tabs de conteúdo</h3>
          <p className="text-sm text-gray-500">
            Usadas para alternar entre seções de uma mesma página. Leia ContentArea.tsx e copie a implementação exata das tabs de Habilidades.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="border-b border-gray-200 mb-6 -mx-6">
            <div className="flex gap-3 md:gap-8 overflow-x-auto scrollbar-hide px-6">
              {['competencias', 'niveis', 'habilidades'].map((tab) => {
                const isActive = activeTabDemo === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTabDemo(tab)}
                    className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex-shrink-0 inline-flex items-center gap-2 ${
                      isActive
                        ? 'border-[var(--brand-600)] text-[var(--brand-600)]'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tabLabels[tab]}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-gray-400 italic">
            Conteúdo da aba: {tabLabels[activeTabDemo]}
          </p>
        </div>
      </section>

      {/* ── Bloco 4: Hierarquia de navegação ── */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900">Hierarquia de navegação</h3>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Admin</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">Dashboard</span>
              </div>
              <div className="flex items-start gap-2 flex-wrap">
                <span className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">Perfis</span>
                <span className="text-gray-400 mt-2">→</span>
                <div>
                  <span className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 inline-block">Perfil individual</span>
                  <p className="text-xs text-gray-400 mt-1 ml-1">abas: Visão Geral · Habilidades · Carreira · Avaliações</p>
                </div>
              </div>
              <div className="flex items-start gap-2 flex-wrap">
                <span className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">Habilidades</span>
                <p className="text-xs text-gray-400 mt-2 ml-1">abas: Competências · Níveis · Habilidades</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">Carreiras</span>
                <span className="text-gray-400">→</span>
                <span className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">Carreira</span>
                <span className="text-gray-400">→</span>
                <span className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">Jornada</span>
                <span className="text-gray-400">→</span>
                <span className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">Matriz</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">Avaliações</span>
                <span className="text-gray-400">→</span>
                <span className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">Detalhe da avaliação</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Colaborador</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">Meu Perfil</span>
              </div>
              <div className="flex items-start gap-2 flex-wrap">
                <span className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 whitespace-nowrap">Minhas Avaliações</span>
                <span className="text-gray-400 mt-2">→</span>
                <div className="space-y-1">
                  <span className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 block">Responder avaliação</span>
                  <span className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 block">Resultado da avaliação</span>
                </div>
              </div>
              <div className="flex items-start gap-2 flex-wrap">
                <span className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 whitespace-nowrap">Minha Carreira</span>
                <p className="text-xs text-gray-400 mt-2 ml-1">abas: Minha Jornada · Próximo passo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bloco 5: Regras de uso ── */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900">Regras de uso</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-outside pl-5">
            <li>Páginas internas sempre com botão ← Label — nunca breadcrumb</li>
            <li>Nunca use o botão de voltar do browser como navegação principal</li>
            <li>Tabs sempre com border-b na aba ativa — nunca background colorido</li>
            <li>Sidebar sempre com ícone + label no modo expandido</li>
            <li>Item ativo na sidebar: nunca destaque apenas por cor do ícone — sempre fundo + cor do texto + ícone</li>
            <li>Navegação do Colaborador: React Router (rotas separadas) — não é viewMode condicional</li>
            <li>Nunca adicione item à sidebar sem atualizar esta documentação</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

// ─── Seção: Mensagens de orientação ──────────────────────────────────────────

function SecaoMensagensOrientacao() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Mensagens de orientação</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          Banners informativos, instruções e avisos de estado usados no SGC. Existem 3 variantes — escolha pela semântica, não pela preferência de cor.
        </p>
        <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={0} alertas={0} />
      </div>

      {/* ── Bloco 1: Variante A — Informativo contextual (brand) ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-0.5">Informativo contextual</h3>
          <p className="text-sm text-gray-500">
            Explica como dados são calculados, limitações da tela ou caveats importantes. Variante mais usada no SGC (1 instância).
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          {/* Demo */}
          <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              O progresso é calculado com base nas habilidades mapeadas na matriz da jornada. Atingir 100% das habilidades não garante promoção — outros fatores são considerados pela liderança.
            </p>
          </div>

          {/* Classes */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-1 font-mono text-xs text-gray-600">
            <p className="text-gray-400 mb-2">{`<!-- Container -->`}</p>
            <p>{`<div class="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">`}</p>
            <p className="ml-4 text-gray-400">{`<!-- Ícone -->`}</p>
            <p className="ml-4">{`<Info class="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />`}</p>
            <p className="ml-4 text-gray-400">{`<!-- Texto -->`}</p>
            <p className="ml-4">{`<p class="text-sm text-gray-700">...</p>`}</p>
            <p>{`</div>`}</p>
          </div>
        </div>

        {/* Onde é usado */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arquivo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contexto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">ResultadoAvaliacao.tsx:85</td>
                <td className="px-4 py-3 text-gray-700">"Banner de contexto" — orienta o uso dos resultados</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Bloco 2: Variante B — Instrução de formulário (slate) ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-0.5">Instrução de formulário</h3>
          <p className="text-sm text-gray-500">
            Instrução direta ao usuário antes de um formulário ou ação. Diferencia-se da variante brand pelo tom slate neutro e pelo bold label "Instruções:".
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          {/* Demo */}
          <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700">
              <span className="font-medium text-slate-800">Instruções: </span>
              Avalie seu nível de proficiência em cada habilidade listada. Seja honesto e considere sua experiência prática e conhecimento teórico. Você pode salvar como rascunho e continuar depois.
            </p>
          </div>

          {/* Classes */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-1 font-mono text-xs text-gray-600">
            <p className="text-gray-400 mb-2">{`<!-- Container -->`}</p>
            <p>{`<div class="bg-slate-100 border border-slate-300 rounded-lg p-4 flex items-start gap-3">`}</p>
            <p className="ml-4 text-gray-400">{`<!-- Ícone -->`}</p>
            <p className="ml-4">{`<Info class="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />`}</p>
            <p className="ml-4 text-gray-400">{`<!-- Texto com label em bold -->`}</p>
            <p className="ml-4">{`<p class="text-sm text-slate-700">`}</p>
            <p className="ml-8">{`<span class="font-medium text-slate-800">Instruções: </span>`}</p>
            <p className="ml-8">{`Texto da instrução aqui.`}</p>
            <p className="ml-4">{`</p>`}</p>
            <p>{`</div>`}</p>
          </div>
        </div>

        {/* Onde é usado */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arquivo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contexto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">RespostaAvaliacao.tsx:108</td>
                <td className="px-4 py-3 text-gray-700">Bloco "Instruções" — acima dos campos de autoavaliação</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Bloco 3: Variante C — Aviso de estado (yellow) ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-0.5">Aviso de estado</h3>
          <p className="text-sm text-gray-500">
            Indica o estado atual da página (ex: rascunho, prévia). Usa <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">Eye</code> em vez de <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">Info</code>, e padding assimétrico <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">px-4 py-3</code>.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          {/* Demo */}
          <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
            <Eye className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Prévia</span> — esta avaliação ainda não foi ativada. Você está visualizando como ela será apresentada aos colaboradores.
            </p>
          </div>

          {/* Classes */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-1 font-mono text-xs text-gray-600">
            <p className="text-gray-400 mb-2">{`<!-- Container — px-4 py-3, não p-4 -->`}</p>
            <p>{`<div class="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">`}</p>
            <p className="ml-4 text-gray-400">{`<!-- Ícone Eye, não Info -->`}</p>
            <p className="ml-4">{`<Eye class="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />`}</p>
            <p className="ml-4 text-gray-400">{`<!-- Texto com label em bold -->`}</p>
            <p className="ml-4">{`<p class="text-sm text-yellow-800">`}</p>
            <p className="ml-8">{`<span class="font-semibold">Prévia</span> — texto aqui.`}</p>
            <p className="ml-4">{`</p>`}</p>
            <p>{`</div>`}</p>
          </div>
        </div>

        {/* Onde é usado */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arquivo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contexto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">AvaliacaoDetalhePage.tsx:454</td>
                <td className="px-4 py-3 text-gray-700">"Banner de prévia" — avaliação em rascunho ainda não ativada</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Divergência documentada ── */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900">Divergência detectada</h3>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 space-y-2">
          <p className="font-semibold">Variante A (brand) vs Variante B (slate) — mesma semântica, cores diferentes</p>
          <p>Ambas usam o ícone <code className="bg-amber-100 px-1 py-0.5 rounded text-xs font-mono">Info</code> e servem para orientar o usuário. A diferença está nas cores (brand vs slate). Variante A aparece 3× no SGC; variante B aparece 1×.</p>
          <p><span className="font-medium">Padrão going forward:</span> use <strong>variante A (brand)</strong> para informativo contextual. Reserve a variante slate apenas para instrução direta antes de formulário, quando a neutralidade de cor é importante para não distrair do formulário abaixo.</p>
        </div>
      </section>

      {/* ── Tabela comparativa ── */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900">Comparativo de variantes</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variante</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Container</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ícone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Texto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Padding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-gray-900 font-medium">Informativo contextual</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">bg-[var(--brand-50)] border-[var(--brand-100)]</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">Info · text-[var(--brand-600)]</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">text-sm text-gray-700</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">p-4</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 font-medium">Instrução de formulário</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">bg-slate-100 border-slate-300</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">Info · text-slate-500</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">text-sm text-slate-700</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">p-4</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 font-medium">Aviso de estado</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">bg-yellow-50 border-yellow-200</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">Eye · text-yellow-600</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">text-sm text-yellow-800</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">px-4 py-3</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Regras de uso ── */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900">Regras de uso</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-outside pl-5">
            <li>Sempre use <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">flex items-start gap-3</code> — nunca <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">items-center</code>, pois textos longos precisam alinhar ao topo</li>
            <li>Sempre adicione <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">mt-0.5</code> no ícone para alinhar visualmente com a primeira linha do texto</li>
            <li>Sempre adicione <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">flex-shrink-0</code> no ícone para evitar que seja comprimido em telas estreitas</li>
            <li>Variante brand (A) = informativo contextual: dados calculados, limitações, caveats</li>
            <li>Variante slate (B) = instrução de formulário: o que o usuário deve fazer antes de preencher</li>
            <li>Variante yellow (C) = aviso de estado: comunica que a página está em modo especial (rascunho, prévia)</li>
            <li>Nunca use estas variantes para erros — erros usam <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">text-red-600</code> inline abaixo do campo</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

// ─── Seção: Estados vazios ────────────────────────────────────────────────────

function SecaoEstadosVazios() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Estados vazios</h1>
      <p className="text-sm text-gray-600 mb-4 max-w-2xl">
        Levantamento de todos os estados vazios encontrados no SGC. Quatro variantes existem no código real —
        cada uma com estrutura, ícone e hierarquia de texto distintos.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={4} alertas={1} />
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 mb-10 max-w-2xl">
        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-800">
          <strong>Esta seção está marcada para revisão.</strong> Existem inconsistências de estilo entre
          os estados vazios do Admin e do Colaborador — tamanhos de fonte, estilos de ícone e estrutura
          de container não seguem um padrão único. O formato atual é temporário e será padronizado em versão futura.
        </p>
      </div>

      {/* ── Variante A: EmptyState canônico ── */}
      <div className="mb-14">
        <div className="flex items-baseline gap-3 mb-2">
          <h2 className="text-sm font-semibold text-gray-900">A — EmptyState canônico</h2>
          <span className="text-xs text-gray-400 font-mono">ui/EmptyState.tsx</span>
        </div>
        <p className="text-sm text-gray-600 mb-6 max-w-2xl">
          Componente reutilizável. Usado nas listagens de Competências, Carreiras, Avaliações (via{' '}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">ListingPage</code>) e diretamente
          na listagem de Jornadas.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Sem dados — sem ação</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <EmptyState
                icon={<Layers className="w-8 h-8" />}
                title="Nenhuma competência cadastrada"
                description="Comece criando a primeira competência para organizar as habilidades da sua organização."
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Sem dados — com ação</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <EmptyState
                icon={<Briefcase className="w-8 h-8" />}
                title="Nenhuma carreira cadastrada"
                description="Comece criando a primeira carreira para estruturar as jornadas da organização."
                action={{ label: '+ Criar carreira', onClick: () => {} }}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Sem resultado de filtro/busca</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <EmptyState
                icon={<Award className="w-8 h-8" />}
                title="Nenhum resultado encontrado"
                description='Não encontramos resultados para "typescript avançado". Tente ajustar sua busca.'
              />
            </div>
          </div>

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
            <div><span className="text-gray-400">container</span>{"  "}<code>flex flex-col items-center justify-center py-12 px-4</code></div>
            <div><span className="text-gray-400">ícone wrapper</span>{"  "}<code>w-12 md:w-16 h-12 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400</code></div>
            <div><span className="text-gray-400">ícone</span>{"  "}<code>w-8 h-8</code> (passado via prop)</div>
            <div><span className="text-gray-400">título</span>{"  "}<code>text-sm md:text-base lg:text-lg font-medium text-gray-900 mb-2</code></div>
            <div><span className="text-gray-400">descrição</span>{"  "}<code>text-xs md:text-sm lg:text-base text-gray-500 text-center max-w-md mb-6</code></div>
            <div><span className="text-gray-400">botão ação</span>{"  "}<code>px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors</code></div>
          </div>
        </div>
      </div>

      {/* ── Variante B: Orientativo ── */}
      <div className="mb-14">
        <div className="flex items-baseline gap-3 mb-2">
          <h2 className="text-sm font-semibold text-gray-900">B — Orientativo</h2>
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
            <p className="text-sm font-medium text-gray-700 mb-1">Em construção</p>
            <p className="text-sm text-gray-500">
              Esta seção ainda está em definição — não deve ser usada como referência para o desenvolvimento.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Classes — Variante B</p>
          <div className="space-y-1.5 font-mono text-xs text-gray-600">
            <div><span className="text-gray-400">container</span>{"  "}<code>bg-white border border-gray-200 rounded-lg p-8 text-center</code></div>
            <div><span className="text-gray-400">ícone</span>{"  "}<code>w-8 h-8 text-gray-300 mx-auto mb-3</code> (sem wrapper circular)</div>
            <div><span className="text-gray-400">título</span>{"  "}<code>text-sm font-medium text-gray-700 mb-1</code></div>
            <div><span className="text-gray-400">descrição</span>{"  "}<code>text-sm text-gray-500</code></div>
          </div>
        </div>
      </div>

      {/* ── Variante C: Inline em painel compacto ── */}
      <div className="mb-14">
        <div className="flex items-baseline gap-3 mb-2">
          <h2 className="text-sm font-semibold text-gray-900">C — Inline em painel compacto</h2>
          <span className="text-xs text-gray-400 font-mono">ConfigurarHabilidadesCargo.tsx</span>
        </div>
        <p className="text-sm text-gray-600 mb-6 max-w-2xl">
          Usado dentro de drawers ou painéis com espaço reduzido. Sem ícone. Fundo{' '}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">bg-gray-50</code> com borda para
          delimitar a área. Texto principal + texto orientativo.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Tabela vazia dentro de drawer</p>
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">Nenhuma habilidade configurada para este cargo</p>
              <p className="text-xs text-gray-400 mt-1">Clique em "Adicionar" para vincular habilidades</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Classes — Variante C</p>
          <div className="space-y-1.5 font-mono text-xs text-gray-600">
            <div><span className="text-gray-400">container</span>{"  "}<code>text-center py-8 bg-gray-50 rounded-lg border border-gray-200</code></div>
            <div><span className="text-gray-400">sem ícone</span></div>
            <div><span className="text-gray-400">texto principal</span>{"  "}<code>text-sm text-gray-500</code></div>
            <div><span className="text-gray-400">texto orientativo</span>{"  "}<code>text-xs text-gray-400 mt-1</code></div>
          </div>
        </div>
      </div>

      {/* ── Variante D: Inline mínimo ── */}
      <div className="mb-14">
        <div className="flex items-baseline gap-3 mb-2">
          <h2 className="text-sm font-semibold text-gray-900">D — Inline mínimo</h2>
          <span className="text-xs text-gray-400 font-mono">ColaboradorView.tsx · ConfigurarHabilidadesCargo.tsx</span>
        </div>
        <p className="text-sm text-gray-600 mb-6 max-w-2xl">
          Somente texto, sem ícone, sem estrutura. Usado diretamente dentro de células de tabela{' '}
          (<code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{'<td>'}</code>) ou em
          listas de busca com espaço muito reduzido.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Dentro de lista de busca (ConfigurarHabilidadesCargo — panel add)
            </p>
            <div className="max-h-48 overflow-y-auto bg-gray-50 rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500 text-center py-4">Nenhuma habilidade disponível</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Classes — Variante D</p>
          <div className="space-y-1.5 font-mono text-xs text-gray-600">
            <div><span className="text-gray-400">td (ColaboradorView)</span>{"  "}<code>px-3 md:px-6 py-8 text-center text-sm text-gray-500</code></div>
            <div><span className="text-gray-400">p (ColaboradorView barras)</span>{"  "}<code>py-8 text-center text-sm text-gray-500</code></div>
            <div><span className="text-gray-400">p (panel add)</span>{"  "}<code>text-xs text-gray-500 text-center py-4</code></div>
          </div>
        </div>
      </div>

      {/* ── Tabela comparativa ── */}
      <div className="mb-14">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Comparativo das variantes</h2>
        <div className="h-px bg-gray-200 mb-6" />
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
                <td className="px-4 py-3 border border-gray-200 text-gray-600">Seção com regra de negócio ainda não fechada</td>
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

      {/* ── Inconsistências ── */}
      <div className="mb-14">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Inconsistências encontradas</h2>
        <div className="h-px bg-gray-200 mb-6" />
        <div className="space-y-3">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
            <Wrench className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-800">Tab Habilidades não usa o componente <code>EmptyState</code></p>
              <p className="text-sm text-orange-700">
                <strong>Arquivo:</strong> ContentArea.tsx (tab habilidades, linhas 1470–1486).
                Duplica manualmente o padrão com diferenças: ícone <code>w-6 h-6</code> em vez de{' '}
                <code>w-8 h-8</code>, wrapper <code>w-12 h-12</code> fixo em vez de responsivo
                (<code>w-12 md:w-16</code>), título <code>text-base</code> fixo em vez de responsivo,
                sem botão de ação. Deve ser substituído pelo componente canônico.
              </p>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
            <Wrench className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-800">Variante A passa ícone <code>w-8 h-8</code> dentro de wrapper <code>w-12 md:w-16</code></p>
              <p className="text-sm text-orange-700">
                <strong>Arquivo:</strong> EmptyState.tsx + CallerSites.
                O ícone fica pequeno dentro do wrapper circular em desktop (8px de folga de cada lado).
                Deve ser documentado como intencional ou o wrapper deve ser ajustado para{' '}
                <code>w-14 md:w-16</code> com ícone <code>w-7 md:w-8</code>.
              </p>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
            <Wrench className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-800">Variante B usa <code>text-gray-300</code> no ícone; Variante A usa <code>text-gray-400</code></p>
              <p className="text-sm text-orange-700">
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
        <h2 className="text-sm font-semibold text-gray-900 mb-5">Regras de uso</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Quando usar Variante A</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Lista de entidades admin nunca teve dados</li>
              <li>• Lista filtrada sem resultado (via <code className="bg-white px-1.5 py-0.5 rounded">ListingPage</code>)</li>
              <li>• Sempre que houver uma ação primária associável ao empty</li>
              <li>• Usar <code className="bg-white px-1.5 py-0.5 rounded">EmptyState</code> — nunca duplicar inline</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Quando usar Variante B</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Seção com regra de negócio ainda não fechada (placeholder "em construção")</li>
              <li>• Contexto colaborador (ex: MeuPerfil)</li>
              <li>• Sem ação disponível no estado vazio</li>
              <li>• Ícone direto <code className="bg-white px-1.5 py-0.5 rounded">text-gray-300</code>, sem wrapper circular</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Quando usar Variante C</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Dentro de drawers ou modais com espaço limitado</li>
              <li>• Tabela interna vazia (não lista principal da tela)</li>
              <li>• Texto orientativo apontando a ação disponível no mesmo container</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Quando usar Variante D</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Diretamente dentro de <code className="bg-white px-1.5 py-0.5 rounded">{'<td>'}</code> de tabela</li>
              <li>• Listas de busca em tempo real com altura restrita</li>
              <li>• Quando ícone e título adicionariam ruído sem benefício</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Seção: Paginação ────────────────────────────────────────────────────────

function pgNums(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage <= 3) {
    for (let i = 1; i <= 4; i++) pages.push(i);
    pages.push('...'); pages.push(totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(1); pages.push('...');
    for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1); pages.push('...');
    pages.push(currentPage - 1); pages.push(currentPage); pages.push(currentPage + 1);
    pages.push('...'); pages.push(totalPages);
  }
  return pages;
}

interface PaginacaoFooterDemoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (p: number) => void;
}

function PaginacaoFooterDemo({ currentPage, totalPages, totalItems, perPage, onPageChange }: PaginacaoFooterDemoProps) {
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);
  const pages = pgNums(currentPage, totalPages);
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50 gap-3 md:gap-0">
      <div className="text-xs md:text-sm text-gray-700">
        <span className="hidden md:inline">Exibindo </span>
        <span className="font-medium">{start}</span>–
        <span className="font-medium">{end}</span> de{' '}
        <span className="font-medium">{totalItems}</span>
      </div>
      <div className="flex items-center gap-1 md:gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-3 md:w-4 h-3 md:h-4" />
        </button>
        <div className="flex items-center gap-0.5 md:gap-1">
          {pages.map((page, index) =>
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={`min-w-[32px] md:min-w-[40px] px-2 md:px-3 py-1.5 md:py-2 text-xs font-normal rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-gray-100 text-gray-900 border border-gray-200'
                    : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="px-1 md:px-2 text-xs text-gray-400">{page}</span>
            )
          )}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
        >
          <ChevronRight className="w-3 md:w-4 h-3 md:h-4" />
        </button>
      </div>
    </div>
  );
}

function SecaoPaginacao() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(5);

  const TOTAL1 = 48; const PER1 = 10; const TOTALPAGES1 = Math.ceil(TOTAL1 / PER1);
  const TOTAL2 = 200; const PER2 = 10; const TOTALPAGES2 = Math.ceil(TOTAL2 / PER2);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Paginação</h1>
      <p className="text-sm text-gray-600 mb-4 max-w-2xl">
        Padrão de paginação do SGC. Implementado no componente{' '}
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Table.tsx</code> (canônico). A tabela de habilidades em{' '}
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">ColaboradorView.tsx</code> foi migrada para{' '}
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Table.tsx</code> — débito técnico residual registrado ao final.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="10/06/2026" debitosTecnicos={1} alertas={0} />

      {/* Demo 1 — poucas páginas */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Poucas páginas (≤ 5 total)</h2>
        <p className="text-sm text-gray-500 mb-4">Todos os números são exibidos diretamente, sem reticências.</p>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs text-gray-400">
            48 itens · 10 por página · 5 páginas no total
          </div>
          <PaginacaoFooterDemo
            currentPage={page1}
            totalPages={TOTALPAGES1}
            totalItems={TOTAL1}
            perPage={PER1}
            onPageChange={p => setPage1(Math.max(1, Math.min(TOTALPAGES1, p)))}
          />
        </div>
      </section>

      {/* Demo 2 — muitas páginas */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Muitas páginas (&gt; 5 total)</h2>
        <p className="text-sm text-gray-500 mb-4">
          Reticências condensam a sequência. Clique nos números para ver os três estados de janela.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs text-gray-400">
            200 itens · 10 por página · 20 páginas no total
          </div>
          <PaginacaoFooterDemo
            currentPage={page2}
            totalPages={TOTALPAGES2}
            totalItems={TOTAL2}
            perPage={PER2}
            onPageChange={p => setPage2(Math.max(1, Math.min(TOTALPAGES2, p)))}
          />
        </div>
      </section>

      {/* Algoritmo de janela */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Algoritmo de janela</h2>
        <p className="text-sm text-gray-500 mb-4">
          Função <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">getPageNumbers()</code> em{' '}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Table.tsx</code>.{' '}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">ColaboradorView.tsx</code> mantém uma cópia local usada exclusivamente pelo modo barras.
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 w-1/3">Condição</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 w-1/3">Sequência exibida</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Exemplo com N = 20</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              <tr>
                <td className="px-4 py-3 text-gray-700 font-mono">totalPages ≤ 5</td>
                <td className="px-4 py-3 text-gray-600">Todas as páginas</td>
                <td className="px-4 py-3 text-gray-400">1 2 3 4 5</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-700 font-mono">currentPage ≤ 3</td>
                <td className="px-4 py-3 text-gray-600">1 2 3 4 … N</td>
                <td className="px-4 py-3 text-gray-400">1 2 3 4 … 20</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-700 font-mono">currentPage ≥ totalPages − 2</td>
                <td className="px-4 py-3 text-gray-600">1 … N−3 N−2 N−1 N</td>
                <td className="px-4 py-3 text-gray-400">1 … 17 18 19 20</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-700 font-mono">demais</td>
                <td className="px-4 py-3 text-gray-600">1 … p−1 p p+1 … N</td>
                <td className="px-4 py-3 text-gray-400">1 … 9 10 11 … 20</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Classes por elemento */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Classes por elemento</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 w-1/4">Elemento</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Classes Tailwind</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              <tr>
                <td className="px-4 py-3 text-gray-900 font-medium align-top">Container footer</td>
                <td className="px-4 py-3 text-gray-500 font-mono break-all">flex flex-col md:flex-row items-center justify-between px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50 gap-3 md:gap-0</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 font-medium align-top">Texto de contagem</td>
                <td className="px-4 py-3 text-gray-500 font-mono break-all">text-xs md:text-sm text-gray-700</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 font-medium align-top">"Exibindo" (desktop)</td>
                <td className="px-4 py-3 text-gray-500 font-mono break-all">hidden md:inline</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 font-medium align-top">Valores N, M, T</td>
                <td className="px-4 py-3 text-gray-500 font-mono break-all">font-medium (em {'<span>'})</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 font-medium align-top">Container de controles</td>
                <td className="px-4 py-3 text-gray-500 font-mono break-all">flex items-center gap-1 md:gap-2</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 font-medium align-top">Botão Anterior / Próximo</td>
                <td className="px-4 py-3 text-gray-500 font-mono break-all">px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 font-medium align-top">Ícone nav (Chevron)</td>
                <td className="px-4 py-3 text-gray-500 font-mono break-all">w-3 md:w-4 h-3 md:h-4</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 font-medium align-top">Container de números</td>
                <td className="px-4 py-3 text-gray-500 font-mono break-all">flex items-center gap-0.5 md:gap-1</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 font-medium align-top">Número — ativo</td>
                <td className="px-4 py-3 text-gray-500 font-mono break-all">min-w-[32px] md:min-w-[40px] px-2 md:px-3 py-1.5 md:py-2 text-xs font-normal rounded-lg transition-colors bg-gray-100 text-gray-900 border border-gray-200</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 font-medium align-top">Número — inativo</td>
                <td className="px-4 py-3 text-gray-500 font-mono break-all">min-w-[32px] md:min-w-[40px] px-2 md:px-3 py-1.5 md:py-2 text-xs font-normal rounded-lg transition-colors text-gray-600 bg-white border border-gray-300 hover:bg-gray-50</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900 font-medium align-top">Reticências (…)</td>
                <td className="px-4 py-3 text-gray-500 font-mono break-all">px-1 md:px-2 text-xs text-gray-400 — {'<span>'}, não {'<button>'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Inconsistências */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Inconsistências encontradas</h2>
        <div className="space-y-3">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
            <Wrench className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-800">Débito técnico — paginação inline residual</p>
              <p className="text-sm text-orange-700">
                <code className="bg-orange-100 px-1 rounded text-xs">ColaboradorView.tsx</code> ainda define{' '}
                <code className="bg-orange-100 px-1 rounded text-xs">getPageNumbers()</code> localmente (linhas 24–40),
                usada pelo modo barras (aba Explorar cargos, atualmente oculta). Débito técnico registrado — migrar quando a aba for reativada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Regras de uso */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Regras de uso</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-1">Sempre usar Table.tsx</p>
            <p className="text-sm text-gray-600">
              Passe um objeto <code className="bg-gray-100 px-1 rounded text-xs">PaginationConfig</code> para o componente{' '}
              <code className="bg-gray-100 px-1 rounded text-xs">Table</code>. Nunca copie a lógica de paginação inline.
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-1">Reset ao filtrar</p>
            <p className="text-sm text-gray-600">
              Ao aplicar qualquer filtro ou busca, retornar para a página 1. Em{' '}
              <code className="bg-gray-100 px-1 rounded text-xs">ColaboradorView.tsx</code>, feito chamando{' '}
              <code className="bg-gray-100 px-1 rounded text-xs">setPaginaAtual(1)</code> junto com o setter do filtro.
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-1">Formato da contagem</p>
            <p className="text-sm text-gray-600">
              Sempre <strong>N–M de T</strong>. O texto "Exibindo" aparece somente no desktop (<code className="bg-gray-100 px-1 rounded text-xs">hidden md:inline</code>). Os três valores usam <code className="bg-gray-100 px-1 rounded text-xs">font-medium</code>.
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-1">Estado desabilitado</p>
            <p className="text-sm text-gray-600">
              Botão Anterior desabilitado na página 1; botão Próximo desabilitado na última página. Ambos aplicam{' '}
              <code className="bg-gray-100 px-1 rounded text-xs">disabled:opacity-50 disabled:cursor-not-allowed</code>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Seção: Meu Perfil ────────────────────────────────────────────────────────

function SecaoMeuPerfil() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Meu Perfil</h1>
      <SectionMeta status="em-construcao" ultimaAtualizacao={null} debitosTecnicos={0} alertas={0} />
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-800">
          Esta seção está em construção. A Visão do Colaborador ainda tem regras de negócio em aberto.
          O conteúdo será documentado após as decisões de produto serem tomadas.
        </p>
      </div>
    </div>
  );
}

function SecaoMinhasAvaliacoes() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Minhas Avaliações</h1>
      <SectionMeta status="em-construcao" ultimaAtualizacao={null} debitosTecnicos={0} alertas={0} />
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-800">
          Esta seção está em construção. A Visão do Colaborador ainda tem regras de negócio em aberto.
          O conteúdo será documentado após as decisões de produto serem tomadas.
        </p>
      </div>
    </div>
  );
}

function SecaoMinhaCarreira() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Minha Carreira</h1>
      <SectionMeta status="em-construcao" ultimaAtualizacao={null} debitosTecnicos={0} alertas={0} />
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-800">
          Esta seção está em construção. A Visão do Colaborador ainda tem regras de negócio em aberto.
          O conteúdo será documentado após as decisões de produto serem tomadas.
        </p>
      </div>
    </div>
  );
}
// ─── Seção: Criar e Editar Jornada (Admin / RH) ───────────────────────────────

function SecaoCriarEditarJornada() {
  const [tabJornada, setTabJornada] = useState(0);
  const TABS_JORNADA = [
    'Visão geral',
    'Nome e modelo',
    'Seleção de cargos',
    'Progressão',
    'Diferenças Criar vs Editar',
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Criar e Editar Jornada</h1>
      <p className="text-sm text-gray-600 mb-4">
        Especificação das telas de criação e edição de jornada de carreira.
        Fonte:{' '}
        <code className="bg-gray-100 px-1 rounded text-xs">CriarJornadaPage.tsx</code>,{' '}
        <code className="bg-gray-100 px-1 rounded text-xs">EditarJornadaPage.tsx</code>,{' '}
        <code className="bg-gray-100 px-1 rounded text-xs">DraggableCargo.tsx</code>,{' '}
        <code className="bg-gray-100 px-1 rounded text-xs">cargosRM.ts</code>.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="15/06/2026" debitosTecnicos={0} alertas={0} />

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 flex gap-6 overflow-x-auto">
        {TABS_JORNADA.map((label, idx) => (
          <button
            key={label}
            onClick={() => setTabJornada(idx)}
            className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              tabJornada === idx
                ? 'border-[var(--brand-600)] text-[var(--brand-600)]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TAB 1 — Visão geral */}
      {tabJornada === 0 && (
        <div>
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Estrutura da página</h2>
            <ul className="space-y-1.5 mb-5">
              {[
                'Página única com scroll vertical — não é wizard.',
                'Todos os blocos são renderizados simultaneamente, não há etapas.',
                'Bloco 1 — Nome da jornada + Modelo de evolução.',
                'Bloco 2 — Seleção de cargos: grid 2 colunas (lista disponível + lista selecionada).',
                'Bloco 3 — Progressão da jornada: preview read-only dos cargos na ordem definida.',
                'Rodapé condicional: aparece via transição max-h apenas quando há alterações não salvas.',
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>

            <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--brand-700)]">
                A tela de Editar Jornada é uma página separada — não um drawer. O usuário navega para{' '}
                <code className="bg-[var(--brand-100)] px-1 rounded text-xs">/carreiras/:id/jornadas/:id/editar</code>{' '}
                ao clicar em "Editar jornada" no menu de 3 pontos do header da página de detalhe.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2 — Nome e modelo */}
      {tabJornada === 1 && (
        <div>
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Bloco 1 — Nome e modelo de evolução</h2>
            <ul className="space-y-1.5 mb-5">
              {[
                'Campo "Nome da jornada": input text, max-w-md, placeholder "Ex: Desenvolvedor", obrigatório.',
                'Validação: toast.error ao submeter com campo vazio.',
                'Campo "Modelo de evolução": radio cards com 2 opções — Contribuidor Individual (default) e Gestão.',
                'Tooltip via HelpCircle no hover: "O modelo define a natureza da progressão: técnica, de liderança ou especialização estratégica."',
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>

            {/* Mockup estático do bloco */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-base font-medium text-gray-900 mb-1">Modelo de evolução</h3>
              <p className="text-sm text-gray-500 mb-6">Defina o nome da jornada e seu modelo de evolução</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da jornada
                  </label>
                  <input
                    readOnly
                    value="Desenvolvedor"
                    className="w-full max-w-md px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <label className="text-sm font-medium text-gray-700">Modelo de evolução</label>
                    <div className="relative group/tip">
                      <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      <div className="absolute left-5 top-0 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 hidden group-hover/tip:block z-10 shadow-lg">
                        O modelo define a natureza da progressão: técnica, de liderança ou especialização estratégica.
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex items-start gap-3 p-4 border-2 border-[var(--brand-500)] bg-[var(--brand-50)] rounded-lg cursor-pointer flex-1 max-w-xs">
                      <div className="w-4 h-4 mt-0.5 rounded-full border-2 border-[var(--brand-600)] flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[var(--brand-600)]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Contribuidor Individual</div>
                        <div className="text-xs text-gray-500 mt-0.5">Atuação técnica com foco em especialização</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer flex-1 max-w-xs hover:border-gray-300">
                      <div className="w-4 h-4 mt-0.5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Gestão</div>
                        <div className="text-xs text-gray-500 mt-0.5">Liderança de pessoas e desenvolvimento de times</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3 — Seleção de cargos */}
      {tabJornada === 2 && (
        <div>
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Bloco 2 — Seleção de cargos</h2>
            <ul className="space-y-1.5 mb-5">
              {[
                'Layout: grid 2 colunas — cargos disponíveis (esquerda) e cargos selecionados (direita).',
                'Lista esquerda: campo de busca filtra em tempo real os 17 cargos de cargosRM.ts.',
                'Cargo já selecionado: desabilitado (bg-gray-50, cursor-default) com ícone Check.',
                'Clique em cargo disponível: move para a lista direita imediatamente.',
                'Lista direita: cada item é um DraggableCargo — grip handle + nome + categoria + badge #N + botão X.',
                'Drag-and-drop via react-dnd (HTML5Backend) para reordenar a lista selecionada.',
                '"Arraste para reordenar" aparece ao lado do contador quando há ≥1 cargo selecionado.',
                'Validação: toast.error ao submeter sem nenhum cargo selecionado.',
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>

            {/* Mockup estático do grid */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-base font-medium text-gray-900 mb-1">Seleção de cargos</h3>
              <p className="text-sm text-gray-500 mb-6">Selecione os cargos e defina a ordem de progressão de carreira</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna esquerda */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Cargos disponíveis</h4>
                    <span className="text-xs text-gray-400">14 cargos</span>
                  </div>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input readOnly value="" placeholder="Buscar cargo…" className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white outline-none" />
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="divide-y divide-gray-100">
                      {[
                        { nome: 'Desenvolvedor Junior', cat: 'Tecnologia', selecionado: true },
                        { nome: 'Desenvolvedor Pleno', cat: 'Tecnologia', selecionado: true },
                        { nome: 'Desenvolvedor Sênior', cat: 'Tecnologia', selecionado: true },
                        { nome: 'Tech Lead', cat: 'Tecnologia', selecionado: false },
                        { nome: 'Arquiteto de Software', cat: 'Tecnologia', selecionado: false },
                      ].map(({ nome, cat, selecionado }) => (
                        <div
                          key={nome}
                          className={`flex items-center justify-between px-4 py-3 ${selecionado ? 'bg-gray-50' : 'bg-white'}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm truncate ${selecionado ? 'text-gray-400' : 'text-gray-900'}`}>{nome}</div>
                            <div className="text-xs text-gray-400">{cat}</div>
                          </div>
                          {selecionado
                            ? <svg className="w-4 h-4 text-[var(--brand-500)] flex-shrink-0 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                            : <Plus className="w-4 h-4 text-green-600 flex-shrink-0 ml-2 opacity-50" />
                          }
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Coluna direita */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Cargos selecionados</h4>
                    <span className="text-xs font-medium text-[var(--brand-700)] bg-[var(--brand-50)] px-2 py-0.5 rounded">3 cargos</span>
                    <span className="text-xs text-gray-400">· Arraste para reordenar</span>
                  </div>
                  <div className="border border-gray-200 rounded-lg bg-gray-50 p-3 space-y-2">
                    {[
                      { nome: 'Desenvolvedor Junior', cat: 'Tecnologia', n: 1 },
                      { nome: 'Desenvolvedor Pleno', cat: 'Tecnologia', n: 2 },
                      { nome: 'Desenvolvedor Sênior', cat: 'Tecnologia', n: 3 },
                    ].map(({ nome, cat, n }) => (
                      <div key={nome} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="cursor-move text-gray-300">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{nome}</div>
                          <div className="text-xs text-gray-400">{cat}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">#{n}</span>
                          <button className="p-1 text-gray-300 hover:text-red-500 rounded">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4 — Progressão */}
      {tabJornada === 3 && (
        <div>
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Bloco 3 — Progressão da jornada</h2>
            <ul className="space-y-1.5 mb-5">
              {[
                'Preview visual read-only dos cargos selecionados na ordem definida.',
                'Renderizado como nós conectados em sequência horizontal com overflow-x-auto.',
                'Atualiza em tempo real conforme cargos são adicionados ou reordenados.',
                'Somente leitura — o usuário não interage diretamente com este bloco.',
                'Nó inicial: preenchido bg-[var(--brand-600)] com badge "Início". Nó final: borda brand com badge "Topo".',
                'Nós intermediários: borda cinza (border-gray-300) com número central.',
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>

            {/* Mockup estático com 3 cargos */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-base font-medium text-gray-900 mb-1">Progressão da jornada</h3>
              <p className="text-sm text-gray-500 mb-6">Como a trilha ficará visível para os colaboradores</p>

              <div className="overflow-x-auto">
                <div className="flex items-start gap-0 pb-2 min-w-max">
                  {[
                    { nome: 'Dev Junior', cat: 'Tecnologia', isFirst: true, isLast: false },
                    { nome: 'Dev Pleno', cat: 'Tecnologia', isFirst: false, isLast: false },
                    { nome: 'Dev Sênior', cat: 'Tecnologia', isFirst: false, isLast: true },
                  ].map(({ nome, cat, isFirst, isLast }, index) => (
                    <div key={nome} className="flex items-start">
                      <div className="flex flex-col items-center w-28">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${
                          isFirst
                            ? 'bg-[var(--brand-600)] border-[var(--brand-600)] text-white'
                            : isLast
                            ? 'bg-white border-[var(--brand-600)] text-[var(--brand-600)]'
                            : 'bg-white border-gray-300 text-gray-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="mt-2 text-center px-1">
                          <div className="text-xs font-medium text-gray-900 leading-tight">{nome}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{cat}</div>
                        </div>
                        {isFirst && (
                          <span className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--brand-100)] text-[var(--brand-700)]">
                            Início
                          </span>
                        )}
                        {isLast && (
                          <span className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
                            Topo
                          </span>
                        )}
                      </div>
                      {!isLast && (
                        <div className="flex items-center mt-4 flex-shrink-0">
                          <div className="w-6 h-px bg-gray-300" />
                          <ChevronRight className="w-3 h-3 text-gray-300 -ml-1" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5 — Diferenças Criar vs Editar */}
      {tabJornada === 4 && (
        <div>
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Diferenças entre Criar e Editar</h2>

            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Aspecto</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Criar</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Editar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    {
                      aspecto: 'Rota',
                      criar: '/carreiras/:id/jornadas/criar',
                      editar: '/carreiras/:id/jornadas/:id/editar',
                      mono: true,
                    },
                    {
                      aspecto: 'Rodapé',
                      criar: 'Aparece ao selecionar ≥1 cargo',
                      editar: 'Aparece ao alterar qualquer campo',
                      mono: false,
                    },
                    {
                      aspecto: 'Botão de ação',
                      criar: '"Criar jornada"',
                      editar: '"Salvar alterações"',
                      mono: false,
                    },
                    {
                      aspecto: 'Pré-preenchimento',
                      criar: 'Campos vazios',
                      editar: 'Dados da jornada existente',
                      mono: false,
                    },
                    {
                      aspecto: 'IDs dos cargos',
                      criar: 'Sempre novos (generateId)',
                      editar: 'Mantém IDs existentes, gera só para novos',
                      mono: false,
                    },
                    {
                      aspecto: 'Cancelar',
                      criar: 'Volta para a carreira',
                      editar: 'Volta para o detalhe da jornada',
                      mono: false,
                    },
                  ].map(({ aspecto, criar, editar, mono }) => (
                    <tr key={aspecto} className="bg-white">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{aspecto}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {mono ? <code className="bg-gray-100 px-1 rounded text-xs">{criar}</code> : criar}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {mono ? <code className="bg-gray-100 px-1 rounded text-xs">{editar}</code> : editar}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--brand-700)]">
                Ao editar e salvar, os IDs dos cargos existentes são preservados — a configuração da matriz de habilidades não é perdida.
                Apenas cargos novos adicionados durante a edição recebem novos IDs.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Seção: Matriz de Habilidades — Edição (Admin / RH) ──────────────────────

function SecaoMatrizHabilidadesAdmin() {
  const [tabMatriz, setTabMatriz] = useState(0);
  const TABS_MATRIZ = [
    'Visão geral',
    'Gerenciar habilidades',
    'Configurar níveis',
    'Gerenciar cargos',
    'Toolbar',
    'Salvar',
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Matriz de Habilidades</h1>
      <p className="text-sm text-gray-600 mb-4">
        Especificação completa da tela de edição da matriz de habilidades por cargo.
        Para as regras de negócio conceituais, consulte Regras de negócio → Jornadas e Matriz.
        Fonte: <code className="bg-gray-100 px-1 rounded text-xs">JornadaDetalhePage.tsx</code>,{' '}
        <code className="bg-gray-100 px-1 rounded text-xs">MatrizCell.tsx</code>,{' '}
        <code className="bg-gray-100 px-1 rounded text-xs">HabilidadesSelectionModal.tsx</code>.
      </p>
      <SectionMeta status="documentado" ultimaAtualizacao="15/06/2026" debitosTecnicos={0} alertas={0} />

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 flex gap-6 overflow-x-auto">
        {TABS_MATRIZ.map((label, idx) => (
          <button
            key={label}
            onClick={() => setTabMatriz(idx)}
            className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              tabMatriz === idx
                ? 'border-[var(--brand-600)] text-[var(--brand-600)]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TAB 1 — Visão geral */}
      {tabMatriz === 0 && (
        <div>
          {/* Estrutura visual da tabela */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Estrutura visual da tabela</h2>
            <ul className="space-y-1.5 mb-5">
              {[
                'Eixo das linhas: habilidades agrupadas por competência.',
                'Eixo das colunas: cargos da jornada (mínimo 160px por coluna, scroll horizontal).',
                'Coluna fixa (sticky left-0 z-10, w-[220px]): nome da habilidade com botão MoreVertical aparece no hover.',
                'Cabeçalho de cargo: nome truncado + barra de progresso configuradas/total. Verde (#16A34A) quando 100%, âmbar (#F59E0B) quando parcial, cinza (#E5E7EB) quando zero.',
                'Agrupador de competência: linha de cabeçalho bg-[#F3F4F6] separando grupos — text-xs font-medium text-gray-500 uppercase tracking-wider.',
                'Alternância de fundo: bg-white (par) / bg-[#F9FAFB] (ímpar) por índice da habilidade filtrada.',
                'Botão MoreVertical por linha: opacity-0 → opacity-100 no hover do grupo, remove a habilidade via ConfirmationModal.',
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>

            {/* Mockup estático da tabela */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="sticky left-0 bg-gray-50 w-[200px] px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Habilidade</span>
                    </th>
                    {/* Cargo 1 — completo */}
                    <th className="px-4 py-3 text-center min-w-[160px]">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium text-gray-900 truncate max-w-[130px]">Dev Júnior</span>
                        <div className="w-full flex items-center gap-1.5">
                          <div className="flex-1 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: '#16A34A' }} />
                          </div>
                          <span className="text-[10px] font-medium" style={{ color: '#16A34A' }}>3/3</span>
                        </div>
                      </div>
                    </th>
                    {/* Cargo 2 — parcial */}
                    <th className="px-4 py-3 text-center min-w-[160px]">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium text-gray-900 truncate max-w-[130px]">Dev Pleno</span>
                        <div className="w-full flex items-center gap-1.5">
                          <div className="flex-1 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: '67%', backgroundColor: '#F59E0B' }} />
                          </div>
                          <span className="text-[10px] font-medium" style={{ color: '#6B7280' }}>2/3</span>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Agrupador de competência */}
                  <tr>
                    <td colSpan={3} className="bg-[#F3F4F6] px-4 py-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Técnica</span>
                    </td>
                  </tr>
                  {/* Linha par — bg-white */}
                  <tr className="bg-white group">
                    <td className="sticky left-0 bg-white px-4 py-3 z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900 flex-1">React</span>
                        <span className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-300 rounded">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="rounded-lg border border-gray-200 bg-white text-left" style={{ borderLeftWidth: 3, borderLeftColor: '#2563EB' }}>
                        <div className="px-2.5 py-2 space-y-0.5">
                          <span className="block text-xs font-semibold leading-tight" style={{ color: '#2563EB' }}>Básico</span>
                          <span className="block text-[10px] text-gray-400 leading-tight">Progressão 1</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="rounded-lg border border-gray-200 bg-white text-left" style={{ borderLeftWidth: 3, borderLeftColor: '#4338CA' }}>
                        <div className="px-2.5 py-2 space-y-0.5">
                          <span className="block text-xs font-semibold leading-tight" style={{ color: '#4338CA' }}>Avançado</span>
                          <span className="block text-[10px] text-gray-400 leading-tight">Progressão 4</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {/* Agrupador segunda competência */}
                  <tr>
                    <td colSpan={3} className="bg-[#F3F4F6] px-4 py-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Comportamental</span>
                    </td>
                  </tr>
                  {/* Linha ímpar — bg-[#F9FAFB] */}
                  <tr className="bg-[#F9FAFB]">
                    <td className="sticky left-0 bg-[#F9FAFB] px-4 py-3 z-10">
                      <span className="text-sm text-gray-900">Comunicação</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="w-full inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 border border-dashed border-amber-300 text-amber-500">
                        –
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="w-full inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium border border-dashed border-[#D1D5DB] bg-transparent text-[#9CA3AF]">
                        +
                      </div>
                    </td>
                  </tr>
                  {/* Linha par */}
                  <tr className="bg-white">
                    <td className="sticky left-0 bg-white px-4 py-3 z-10">
                      <span className="text-sm text-gray-900">Trabalho em equipe</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="rounded-lg border border-gray-200 bg-white text-left" style={{ borderLeftWidth: 3, borderLeftColor: '#4338CA' }}>
                        <div className="px-2.5 py-2 space-y-0.5">
                          <span className="block text-xs font-semibold leading-tight" style={{ color: '#4338CA' }}>Intermediário</span>
                          <span className="block text-[10px] text-gray-400 leading-tight">Progressão 2</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="w-full inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium border border-dashed border-[#D1D5DB] bg-transparent text-[#9CA3AF]">
                        +
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Barra de progresso por cargo */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Barra de progresso por cargo</h2>
            <ul className="space-y-1.5 mb-5">
              {[
                'Aparece no cabeçalho de cada coluna, abaixo do nome do cargo.',
                'Mostra configuradas/total de habilidades na forma "N/M".',
                '"Configuradas" = células com nível definido OU com valor \'not_required\'.',
                'Cor da barra: #16A34A (verde) quando 100%, #F59E0B (âmbar) quando parcial, #E5E7EB (cinza) quando zero.',
                'Cor do texto: #16A34A quando 100%, #6B7280 nos demais casos.',
                'Altura da barra: h-1.5, track bg-[#E5E7EB], borda arredondada.',
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Dev Júnior', config: 3, total: 3, pct: 100, barColor: '#16A34A', textColor: '#16A34A' },
                { label: 'Dev Pleno', config: 2, total: 3, pct: 67, barColor: '#F59E0B', textColor: '#6B7280' },
                { label: 'Dev Sênior', config: 0, total: 3, pct: 0, barColor: '#E5E7EB', textColor: '#6B7280' },
              ].map(({ label, config, total, pct, barColor, textColor }) => (
                <div key={label} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-900 mb-3 text-center">{label}</p>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                      </div>
                      <span className="text-[10px] font-medium" style={{ color: textColor }}>{config}/{total}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2 — Gerenciar habilidades */}
      {tabMatriz === 1 && (
        <div>
          {/* Modal Gerenciar habilidades */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Modal — Gerenciar habilidades</h2>
            <p className="text-sm text-gray-600 mb-4">
              Componente <code className="bg-gray-100 px-1 rounded text-xs">HabilidadesSelectionModal.tsx</code>. Modal centralizado (não drawer): 640px × 80vh, máximo 720px.
            </p>
            <ul className="space-y-2 mb-5">
              {[
                'Header: título "Gerenciar habilidades" + subtítulo "Marque as habilidades que devem estar na matriz" + botão X.',
                'Busca: input text com ícone Search à esquerda, foco automático ao abrir.',
                'Filtros: segmented control Todas/Técnica/Comportamental (bg-gray-100 rounded-lg p-1) + Radix Select por competência.',
                'Lista agrupada por competência: header sticky bg-gray-50, ChevronDown/Right para collapse individual, contador N/M (brand) ou só N (gray).',
                '"Selecionar todas" / "Desmarcar todas" por grupo (text-[var(--brand-600)]).',
                'Item marcado para adicionar: bg-blue-50 hover:bg-blue-100 + checkbox brand preenchido.',
                'Item marcado para remover: bg-red-50 hover:bg-red-100 + nome text-red-500 line-through + badge "Será removida".',
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>

            <div className="border border-gray-200 rounded-lg overflow-hidden mb-5">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Estado do item</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Fundo da linha</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Checkbox</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Botão confirmar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-white">
                    <td className="px-4 py-3 text-sm text-gray-900">Desmarcado (não estava)</td>
                    <td className="px-4 py-3 text-xs text-gray-500">hover:bg-gray-50</td>
                    <td className="px-4 py-3 text-xs text-gray-500">border-gray-300 vazio</td>
                    <td className="px-4 py-3 text-xs text-gray-500">—</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 text-sm text-gray-900">Marcado para adicionar</td>
                    <td className="px-4 py-3 text-xs text-gray-500">bg-blue-50</td>
                    <td className="px-4 py-3 text-xs text-gray-500">bg-[var(--brand-600)] preenchido</td>
                    <td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-lg bg-[var(--brand-600)] text-white">Adicionar N</span></td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="px-4 py-3 text-sm text-red-500 line-through">Marcado para remover</td>
                    <td className="px-4 py-3 text-xs text-gray-500">bg-red-50</td>
                    <td className="px-4 py-3 text-xs text-gray-500">border-red-300 vazio</td>
                    <td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-lg bg-red-600 text-white">Remover N</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ul className="space-y-2">
              {[
                'Rodapé esquerda: "+N a adicionar · -N a remover" quando há diff; "N habilidades na matriz" quando sem diff.',
                'Botão confirmar: desabilitado (bg-gray-200) quando sem diff; bg-red-600 quando só remoções; bg-[var(--brand-600)] quando há adições.',
                'Label do botão: "Adicionar N · Remover N" — exibe apenas as partes com contagem > 0.',
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Remover habilidade da matriz */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Remover habilidade da matriz</h2>
            <ul className="space-y-1.5 mb-5">
              {[
                'Botão MoreVertical aparece no hover da linha da habilidade (opacity-0 → opacity-100).',
                'Menu suspenso com única opção "Remover habilidade" — texto text-red-600, hover:bg-red-50.',
                'Ao clicar: abre ConfirmationModal com variante danger.',
                'Ao confirmar: remove o id de habilidadesNaMatriz e limpa todas as entradas da habilidade em matrizNiveis.',
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
            {/* Mockup do menu de habilidade */}
            <div className="flex items-start gap-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden w-64">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="bg-white group border-b border-gray-100">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900 flex-1">TypeScript</span>
                          <span className="p-0.5 text-gray-400 rounded">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <button className="w-full px-3 py-2 text-left text-sm text-red-600 bg-red-50 flex items-center gap-2 whitespace-nowrap">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Remover habilidade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3 — Configurar níveis */}
      {tabMatriz === 2 && (
        <div>
          {/* Estados da célula */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Estados da célula (MatrizCell)</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-900 mb-3">Vazio (null)</p>
                <div className="flex justify-center mb-4">
                  <div className="w-full inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium border border-dashed border-[#D1D5DB] bg-transparent text-[#9CA3AF]">
                    +
                  </div>
                </div>
                <ul className="space-y-1">
                  {[
                    'Valor: null ou undefined',
                    'Borda dashed #D1D5DB',
                    'Hover: solid #3B82F6, bg #EFF6FF',
                    'Nível não configurado',
                  ].map((t, i) => <li key={i} className="text-xs text-gray-500">{t}</li>)}
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-900 mb-3">Não exigido ('not_required')</p>
                <div className="flex justify-center mb-4">
                  <div className="w-full inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 border border-dashed border-amber-300 text-amber-500">
                    –
                  </div>
                </div>
                <ul className="space-y-1">
                  {[
                    "Valor: 'not_required'",
                    'Borda dashed amber-300',
                    'Hover: sólido amber-400',
                    'Decisão explícita do RH',
                  ].map((t, i) => <li key={i} className="text-xs text-gray-500">{t}</li>)}
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-900 mb-3">Com nível definido</p>
                <div className="mb-4">
                  <div
                    className="rounded-lg border border-gray-200 bg-white text-left cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all"
                    style={{ borderLeftWidth: 3, borderLeftColor: '#5B21B6' }}
                    title="Especialista: Usa hooks, gerencia estado local e consome APIs REST"
                  >
                    <div className="px-2.5 py-2 space-y-0.5">
                      <span className="block text-xs font-semibold leading-tight" style={{ color: '#5B21B6' }}>Especialista</span>
                      <p className="text-xs text-gray-500 leading-snug line-clamp-3">Usa hooks, gerencia estado local e consome APIs REST</p>
                      <span className="block text-[10px] text-gray-400 leading-tight">Progressão 5</span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-1">
                  {[
                    'Valor: string com nome do nível',
                    'Borda esquerda: 3px via borderLeftColor',
                    'Cor via getCorFromPeso(peso)',
                    'Critério: text-xs text-gray-500 line-clamp-3 (condicional — só aparece se criterio não for vazio)',
                    'Tooltip: title="Nome do nível: criterio"',
                    'Hover: border-gray-300 + shadow-sm',
                  ].map((t, i) => <li key={i} className="text-xs text-gray-500">{t}</li>)}
                </ul>
              </div>
            </div>

            <p className="text-xs text-gray-500 italic mt-4">
              A descrição exibida na célula é o critério específico cadastrado para aquela habilidade naquele nível no módulo Habilidades. Se não houver critério cadastrado, a célula exibe apenas o nome e a progressão.
            </p>
          </div>

          {/* Dropdown de seleção */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Dropdown de seleção de nível</h2>
            <p className="text-sm text-gray-600 mb-4">
              Abre ao clicar em qualquer célula da matriz. Largura fixa 200px, posição <code className="bg-gray-100 px-1 rounded text-xs">absolute top-full mt-1</code>.
            </p>
            <div className="flex items-start gap-8 mb-5">
              <div className="w-[200px] bg-white rounded-lg shadow-lg border border-[#E5E7EB] overflow-hidden flex-shrink-0" style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}>
                {[
                  { nome: 'Básico', peso: 1, cor: '#60A5FA' },
                  { nome: 'Intermediário', peso: 2, cor: '#2563EB' },
                  { nome: 'Avançado', peso: 4, cor: '#4338CA' },
                  { nome: 'Especialista', peso: 5, cor: '#5B21B6' },
                ].map((n, idx, arr) => (
                  <div key={n.nome} className={`px-4 py-2.5 flex items-center gap-2 hover:bg-[#F3F4F6] transition-colors ${idx < arr.length - 1 ? 'border-b border-[#F3F4F6]' : ''}`}>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap text-white" style={{ backgroundColor: n.cor }}>{n.nome}</span>
                    <span className="text-xs text-gray-400">{n.peso}</span>
                  </div>
                ))}
                <div className="border-t border-[#E5E7EB]" />
                <div className="px-4 py-2.5 flex items-center text-[#374151] text-sm hover:bg-[#FEF9C3] hover:text-[#92400E]">
                  <span className="whitespace-nowrap">Não exigido neste cargo</span>
                </div>
                <div className="border-t border-[#E5E7EB]" />
                <div className="px-4 py-2.5 flex items-center gap-2 text-[#6B7280] text-sm hover:bg-[#F3F4F6]">
                  <X className="w-4 h-4" />
                  <span className="whitespace-nowrap">Remover nível</span>
                </div>
              </div>

              <ul className="space-y-2 pt-1">
                {[
                  'Itens de nível: badge com cor via getCorFromPeso(peso) + peso em gray-400',
                  'Separador border-t border-[#E5E7EB] antes de "Não exigido" e antes de "Remover nível"',
                  '"Não exigido neste cargo": whitespace-nowrap, hover bg-[#FEF9C3] text-[#92400E]',
                  '"Remover nível": só renderizado se já havia nível (nivel !== null), ícone X lucide',
                  'Fechar: clique fora via useEffect mousedown no document',
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                Os níveis disponíveis são os cadastrados para aquela habilidade no módulo Habilidades. Se nenhum nível estiver vinculado, o sistema usa todos os níveis cadastrados como fallback.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4 — Gerenciar cargos */}
      {tabMatriz === 3 && (
        <div>
          {/* Remover cargo da matriz */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Remover cargo da matriz</h2>
            <ul className="space-y-1.5 mb-5">
              {[
                'Botão MoreVertical no cabeçalho da coluna do cargo (th), sempre visível.',
                'Menu suspenso com única opção "Remover cargo" — texto text-red-600, ícone Trash2, hover:bg-red-50.',
                'Posição do dropdown: absolute top-full left-1/2 -translate-x-1/2 mt-1, w-40, z-[200].',
                'Ao clicar: abre ConfirmationModal antes de remover.',
                'Ao confirmar: remove o cargo da lista de cargos e limpa todas as entradas do cargo em matrizNiveis.',
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>

            {/* Mockup do cabeçalho com menu de cargo */}
            <div className="border border-gray-200 rounded-lg overflow-visible mb-5">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="sticky left-0 bg-gray-50 w-[200px] px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Habilidade</span>
                    </th>
                    <th className="px-4 py-3 text-center min-w-[160px] relative">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center gap-0.5 w-full">
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <span className="block text-sm font-medium text-gray-900 truncate">Dev Pleno</span>
                          </div>
                          <div className="relative flex-shrink-0 w-5">
                            <button className="p-0.5 text-gray-500 hover:text-gray-700 rounded transition-colors" title="Opções do cargo">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                            </button>
                            <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[200]">
                              <button className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 whitespace-nowrap">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Remover cargo
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="w-full mt-2 flex items-center gap-1.5">
                          <div className="flex-1 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: '67%', backgroundColor: '#F59E0B' }} />
                          </div>
                          <span className="text-[10px] font-medium text-gray-500">2/3</span>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>

            <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                Adicionar cargos à jornada é feito via "Editar jornada" no menu de 3 pontos do header da página. O MoreVertical no cabeçalho da coluna remove o cargo apenas da visualização da matriz.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5 — Toolbar */}
      {tabMatriz === 4 && (
        <div>
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Elementos da toolbar</h2>
            <p className="text-sm text-gray-600 mb-4">
              Barra de controles acima da matriz (<code className="bg-gray-100 px-1 rounded text-xs">flex items-center gap-3 px-4 py-3 border-b border-gray-200</code>).
              Busca e filtro à esquerda, gerenciar à direita.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                'Campo de busca (w-56, flex-shrink-0): ícone Search à esquerda, placeholder "Filtrar habilidades…". Filtra as linhas da matriz por nome da habilidade em tempo real.',
                'Botão "Habilidades incompletas": toggle (modoCompletude). Ícone Eye/EyeOff. Badge circular (w-5 h-5) com o contador de habilidades que possuem ao menos 1 cargo sem definição. Ao ativar: destaca visualmente as habilidades incompletas.',
                'flex-1 separador: empurra o botão "Gerenciar habilidades" para a direita.',
                'Botão "Gerenciar habilidades" (flex-shrink-0): ícone Plus, abre o modal HabilidadesSelectionModal. bg-white border border-gray-300 text-gray-700, hover:bg-gray-50.',
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>

            {/* Mockup da toolbar */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
                {/* Campo de busca */}
                <div className="w-56 flex-shrink-0 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    readOnly
                    placeholder="Filtrar habilidades…"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none bg-white"
                  />
                </div>

                {/* Botão modoCompletude — ativo */}
                <button className="flex-shrink-0 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border bg-[var(--brand-50)] border-[var(--brand-200)] text-[var(--brand-700)]">
                  <Eye className="w-4 h-4" />
                  Habilidades incompletas
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold bg-[var(--brand-100)] text-[var(--brand-700)]">4</span>
                </button>

                <div className="flex-1" />

                {/* Botão gerenciar */}
                <button className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  <Plus className="w-4 h-4" />
                  Gerenciar habilidades
                </button>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-xs text-gray-400 italic">
                Tabela da matriz abaixo da toolbar...
              </div>
            </div>

            {/* Estados do botão modoCompletude */}
            <div className="mt-5">
              <p className="text-xs font-semibold text-gray-700 mb-3">Estados do botão "Habilidades incompletas"</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 mb-3">Inativo (modoCompletude = false)</p>
                  <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border bg-white border-gray-300 text-gray-700">
                    <Eye className="w-4 h-4" />
                    Habilidades incompletas
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">4</span>
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 mb-3">Ativo (modoCompletude = true)</p>
                  <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border bg-[var(--brand-50)] border-[var(--brand-200)] text-[var(--brand-700)]">
                    <EyeOff className="w-4 h-4" />
                    Habilidades incompletas
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold bg-[var(--brand-100)] text-[var(--brand-700)]">4</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6 — Salvar */}
      {tabMatriz === 5 && (
        <div>
          {/* Salvamento */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Salvamento</h2>

            {/* Mockup visual do rodapé */}
            <div className="relative rounded-lg overflow-hidden border border-gray-200 mb-5" style={{ height: '120px' }}>
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                <p className="text-sm text-gray-400">Conteúdo da matriz</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3">
                <div className="flex items-center justify-between px-4 md:px-8">
                  <span className="text-sm text-gray-500">Alterações não salvas</span>
                  <button className="px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors">
                    Salvar alterações
                  </button>
                </div>
              </div>
            </div>

            <ul className="space-y-2 mb-5">
              {[
                'Rodapé fixo aparece apenas quando há alterações não salvas (max-h transition: max-h-0 ↔ max-h-20).',
                '"Alterações não salvas" text-sm text-gray-500 à esquerda.',
                'Botão "Salvar alterações" bg-[var(--brand-600)] text-white à direita.',
                'Ao salvar: itera todos os cargos → monta array HabilidadeCargo por cargo → chama atualizarHabilidadesCargo(cargo.id, habilidadesDocargo) no contexto.',
                'Células null/undefined omitidas (não persistidas).',
                "Valores 'not_required' e nomes de nível (strings) são salvos como nivelEsperado.",
                'Persiste em CarreirasContext via localStorage.',
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
            <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                Navegar sem salvar descarta todas as alterações da sessão atual.
              </p>
            </div>
          </div>

          {/* Avisos importantes */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Importante</h2>
            <div className="space-y-3">
              <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
                <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  Cargos são adicionados ou removidos via "Editar jornada" (menu de 3 pontos no header da página) — não pela matriz. A matriz define apenas os níveis mínimos.
                </p>
              </div>
              <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
                <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  <strong>"Não exigido"</strong> e <strong>"não configurado"</strong> são estados distintos:{' '}
                  <em>Não configurado</em> = célula vazia, RH ainda não definiu.{' '}
                  <em>Não exigido</em> = decisão explícita do RH de que a habilidade não é necessária neste cargo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

const IMPLEMENTED: SectionId[] = [
  'fundamentos/cores',
  'fundamentos/tipografia',
  'fundamentos/espacamento',
  'fundamentos/icones',
  'componentes/botoes',
  'componentes/badges',
  'componentes/tabelas',
  'componentes/filtros-pills',
  'componentes/cards',
  'componentes/drawers',
  'componentes/modais',
  'componentes/formularios',
  'regras/niveis-cores',
  'regras/cobertura-habilidades',
  'regras/estados-avaliacao',
  'regras/badges-status',
  'regras/jornadas-e-matriz',
  'telas-admin/matriz-habilidades',
  'telas-admin/criar-editar-jornada',
  'padroes/navegacao',
  'padroes/mensagens-orientacao',
  'padroes/estados-vazios',
  'padroes/paginacao',
  'colaborador/meu-perfil',
  'colaborador/minhas-avaliacoes',
  'colaborador/minha-carreira',
];

export default function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [expandedSubgroups, setExpandedSubgroups] = useState<Record<string, boolean>>({
    'telas-admin': false,
    'telas-gestor': false,
    'telas-colaborador': true,
  });

  const toggleSubgroup = (id: string) => {
    setExpandedSubgroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeSectionLabel =
    ALL_ITEMS.find((item) => item.id === activeSection)?.label ?? '';

  return (
    <div className="mt-16 min-h-screen flex">
      {/* Sidebar de navegação */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white fixed top-16 bottom-0 overflow-y-auto hidden md:block">
        <nav className="px-2 pt-4 pb-8">
          <button
            onClick={() => setActiveSection('home')}
            className={`w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 ${
              activeSection === 'home'
                ? 'text-[var(--brand-600)] font-medium bg-[var(--brand-50)]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Activity className="w-4 h-4 flex-shrink-0" />
            Status
          </button>

          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 mt-4">
                {group.label}
              </p>
              {group.items?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                    activeSection === item.id
                      ? 'text-[var(--brand-600)] font-medium bg-[var(--brand-50)]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {group.subgroups?.map((subgroup) => (
                <div key={subgroup.id}>
                  <button
                    onClick={() => toggleSubgroup(subgroup.id)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <span>{subgroup.label}</span>
                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expandedSubgroups[subgroup.id] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSubgroups[subgroup.id] && (
                    subgroup.items.length > 0 ? (
                      subgroup.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full text-left text-sm pl-6 pr-3 py-1.5 rounded-md transition-colors ${
                            activeSection === item.id
                              ? 'text-[var(--brand-600)] font-medium bg-[var(--brand-50)]'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))
                    ) : (
                      <p className="pl-6 py-1.5 text-xs text-gray-400 italic">Nenhuma tela documentada ainda</p>
                    )
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Área de conteúdo */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {activeSection === 'home' && (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Design System</h1>
            <p className="text-sm text-gray-600 mb-8">
              Documentação de componentes, padrões visuais e regras de negócio do Sistema de Gestão de Carreiras.
            </p>

            <p className="text-base font-semibold text-gray-900 mb-4">Visão geral da documentação</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="border rounded-lg p-4 flex flex-col gap-3 bg-green-50 border-green-200">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Seções documentadas</p>
                  <p className="text-sm font-semibold leading-tight">23</p>
                </div>
              </div>
              <div className="border rounded-lg p-4 flex flex-col gap-3 bg-yellow-50 border-yellow-200">
                <Clock className="w-4 h-4 flex-shrink-0 text-yellow-600" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Em construção</p>
                  <p className="text-sm font-semibold leading-tight">3</p>
                </div>
              </div>
              <div className="border rounded-lg p-4 flex flex-col gap-3 bg-orange-50 border-orange-200">
                <Wrench className="w-4 h-4 flex-shrink-0 text-orange-600" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Débitos técnicos</p>
                  <p className="text-sm font-semibold leading-tight">5</p>
                </div>
              </div>
              <div className="border rounded-lg p-4 flex flex-col gap-3 bg-yellow-50 border-yellow-200">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-yellow-600" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Alertas ativos</p>
                  <p className="text-sm font-semibold leading-tight">11</p>
                </div>
              </div>
            </div>

            <p className="text-sm font-medium text-gray-700 mb-3">Atenção necessária</p>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Seção</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 text-center">Débitos</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 text-center">Alertas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {([
                    { secao: 'Cores',             status: 'documentado',   debitos: 0, alertas: 1 },
                    { secao: 'Tipografia',        status: 'documentado',   debitos: 0, alertas: 1 },
                    { secao: 'Espaçamento',       status: 'documentado',   debitos: 0, alertas: 1 },
                    { secao: 'Badges',            status: 'documentado',   debitos: 0, alertas: 1 },
                    { secao: 'Ícones',            status: 'documentado',   debitos: 0, alertas: 1 },
                    { secao: 'Filtros e Pills',   status: 'documentado',   debitos: 0, alertas: 1 },
                    { secao: 'Cards',             status: 'documentado',   debitos: 0, alertas: 1 },
                    { secao: 'Formulários',       status: 'documentado',   debitos: 0, alertas: 1 },
                    { secao: 'Navegação',         status: 'documentado',   debitos: 0, alertas: 1 },
                    { secao: 'Estados de avaliação', status: 'documentado', debitos: 0, alertas: 1 },
                    { secao: 'Estados vazios',    status: 'documentado',   debitos: 4, alertas: 1 },
                    { secao: 'Paginação',         status: 'documentado',   debitos: 1, alertas: 0 },
                    { secao: 'Meu Perfil',        status: 'em-construcao', debitos: 0, alertas: 0 },
                    { secao: 'Minhas Avaliações', status: 'em-construcao', debitos: 0, alertas: 0 },
                    { secao: 'Minha Carreira',    status: 'em-construcao', debitos: 0, alertas: 0 },
                  ] as Array<{
                    secao: string;
                    status: 'documentado' | 'em-construcao' | 'desatualizado';
                    debitos: number;
                    alertas: number;
                  }>).map(({ secao, status, debitos, alertas }) => (
                    <tr key={secao} className="bg-white">
                      <td className="px-4 py-3 text-sm text-gray-900">{secao}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          status === 'documentado' ? 'text-green-700' :
                          status === 'em-construcao' ? 'text-yellow-700' :
                          'text-red-700'
                        }`}>
                          {status === 'documentado' && <CheckCircle2 className="w-3 h-3" />}
                          {status === 'em-construcao' && <Clock className="w-3 h-3" />}
                          {status === 'desatualizado' && <AlertCircle className="w-3 h-3" />}
                          {status === 'documentado' ? 'Documentado' : status === 'em-construcao' ? 'Em construção' : 'Desatualizado'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{debitos}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{alertas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm font-medium text-gray-700 mb-3">Especificação de Telas — Admin / RH</p>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Tela</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {([
                    { tela: 'Matriz de Habilidades',  sectionId: 'telas-admin/matriz-habilidades'    as SectionId },
                    { tela: 'Criar / Editar Jornada', sectionId: 'telas-admin/criar-editar-jornada'  as SectionId },
                  ] as const).map(({ tela, sectionId }) => (
                    <tr key={tela} className="bg-white hover:bg-gray-50 cursor-pointer" onClick={() => setActiveSection(sectionId)}>
                      <td className="px-4 py-3 text-sm text-[var(--brand-600)] font-medium">{tela}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
                          <CheckCircle2 className="w-3 h-3" />
                          Documentado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {QUICK_ACCESS.map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.groupId}
                    onClick={() => setActiveSection(card.firstSection)}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:border-[var(--brand-300)] cursor-pointer transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[var(--brand-50)] flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-[var(--brand-600)]" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">{card.label}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{card.description}</p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-[var(--brand-600)] font-medium">
                      <span>Ver seção</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === 'fundamentos/cores' && <SecaoCores />}
        {activeSection === 'fundamentos/tipografia' && <SecaoTipografia />}
        {activeSection === 'fundamentos/espacamento' && <SecaoEspacamento />}
        {activeSection === 'fundamentos/icones' && <SecaoIcones />}
        {activeSection === 'componentes/botoes' && <SecaoBotoes />}
        {activeSection === 'componentes/badges' && <SecaoBadges />}
        {activeSection === 'componentes/tabelas' && <SecaoTabelas />}
        {activeSection === 'componentes/filtros-pills' && <SecaoFiltrosEPills />}
        {activeSection === 'componentes/cards' && <SecaoCards />}
        {activeSection === 'componentes/drawers' && <SecaoDrawers />}
        {activeSection === 'componentes/modais' && <SecaoModais />}
        {activeSection === 'componentes/formularios' && <SecaoFormularios />}
        {activeSection === 'regras/niveis-cores' && <SecaoNiveisCores />}
        {activeSection === 'regras/cobertura-habilidades' && <SecaoCoberturaHabilidades />}
        {activeSection === 'regras/estados-avaliacao' && <SecaoEstadosAvaliacao />}
        {activeSection === 'regras/badges-status' && <SecaoBadgesStatus />}
        {activeSection === 'regras/jornadas-e-matriz' && <SecaoJornadasEMatriz />}
        {activeSection === 'telas-admin/matriz-habilidades' && <SecaoMatrizHabilidadesAdmin />}
        {activeSection === 'telas-admin/criar-editar-jornada' && <SecaoCriarEditarJornada />}
        {activeSection === 'padroes/navegacao' && <SecaoNavegacao />}
        {activeSection === 'padroes/mensagens-orientacao' && <SecaoMensagensOrientacao />}
        {activeSection === 'padroes/estados-vazios' && <SecaoEstadosVazios />}
        {activeSection === 'padroes/paginacao' && <SecaoPaginacao />}
        {activeSection === 'colaborador/meu-perfil' && <SecaoMeuPerfil />}
        {activeSection === 'colaborador/minhas-avaliacoes' && <SecaoMinhasAvaliacoes />}
        {activeSection === 'colaborador/minha-carreira' && <SecaoMinhaCarreira />}

        {activeSection !== 'home' && !IMPLEMENTED.includes(activeSection) && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{activeSectionLabel}</h2>
            <p className="text-sm text-gray-500">Esta seção está sendo documentada.</p>
          </div>
        )}
      </main>
    </div>
  );
}
