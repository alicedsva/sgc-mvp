import { useState } from 'react';
import {
  Info, Palette, Layout, BookOpen, Briefcase, User, ChevronRight,
  Settings, LayoutDashboard, Layers, GitBranch, ClipboardList, ClipboardCheck,
  TrendingUp, Users, CheckCircle2, Clock, CalendarClock, AlertCircle, XCircle,
  Eye, Pencil, Power, RefreshCw, Archive, ChevronLeft, ChevronDown, ChevronUp,
  Plus, Download, Search,
} from 'lucide-react';
import { getCorFromPeso, niveisDefaultData } from '../data/mockData';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';

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
  | 'colaborador/meu-perfil'
  | 'colaborador/minhas-avaliacoes'
  | 'colaborador/minha-carreira';

interface NavItem { id: SectionId; label: string; }
interface NavGroup { label: string; items: NavItem[]; }

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
    ],
  },
  {
    label: 'Visão do Colaborador',
    items: [
      { id: 'colaborador/meu-perfil', label: 'Meu Perfil' },
      { id: 'colaborador/minhas-avaliacoes', label: 'Minhas Avaliações' },
      { id: 'colaborador/minha-carreira', label: 'Minha Carreira' },
    ],
  },
];

const QUICK_ACCESS = [
  { groupId: 'fundamentos', label: 'Fundamentos', description: 'Cores, tipografia, espaçamento e ícones do sistema.', icon: Palette, firstSection: 'fundamentos/cores' as SectionId },
  { groupId: 'componentes', label: 'Componentes', description: 'Botões, tabelas, cards, drawers, modais e formulários.', icon: Layout, firstSection: 'componentes/botoes' as SectionId },
  { groupId: 'padroes', label: 'Padrões', description: 'Navegação, estados vazios, mensagens de orientação.', icon: BookOpen, firstSection: 'padroes/navegacao' as SectionId },
  { groupId: 'regras', label: 'Regras de negócio', description: 'Níveis, cobertura, estados de avaliação e badges.', icon: Briefcase, firstSection: 'regras/niveis-cores' as SectionId },
  { groupId: 'colaborador', label: 'Visão do Colaborador', description: 'Meu Perfil, Minhas Avaliações e Minha Carreira.', icon: User, firstSection: 'colaborador/meu-perfil' as SectionId },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

const BADGE_BASE = 'inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full';

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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Níveis e cores</h1>
      <p className="text-sm text-gray-600 mb-8">
        Níveis são cadastrados pelo RH com nome livre e ordem de progressão (1–5). A cor é derivada
        automaticamente da ordem — não é configurável.
      </p>

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
{`// A função getCorFromPeso recebe a ordem de progressão
// e retorna o hex correspondente
import { getCorFromPeso } from '@/app/data/mockData';

// Renderizar badge de nível
<span
  style={{ backgroundColor: getCorFromPeso(nivel.ordemProgressao) }}
  className="inline-flex px-2.5 py-1 rounded-full
             text-xs font-medium text-white">
  {nivel.nome}
</span>

// Nota: internamente o campo se chama 'peso' no mock atual.
// Na implementação real, usar 'ordemProgressao'.`}
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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Cobertura de habilidades</h1>
      <p className="text-sm text-gray-600 mb-8">
        Mede o percentual de habilidades onde o nível atual do colaborador atende ou supera o nível
        esperado na matriz para o cargo.
      </p>

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
export function calcularCobertura(
  habilidadesColaborador: HabilidadeColaborador[],
  matrizCargo: MatrizCargo[]
): { percentual: number; label: string; cor: string } {
  const atendidas = matrizCargo.filter(exigida => {
    const hab = habilidadesColaborador
      .find(h => h.habilidadeId === exigida.habilidadeId);
    return hab && hab.peso >= exigida.pesoExigido;
  });
  const percentual = Math.round(
    (atendidas.length / matrizCargo.length) * 100
  );
  if (percentual >= 80) return {
    percentual, label: 'Boa cobertura', cor: 'text-green-600'
  };
  if (percentual >= 50) return {
    percentual, label: 'Cobertura parcial', cor: 'text-yellow-600'
  };
  return {
    percentual, label: 'Baixa cobertura', cor: 'text-red-600'
  };
}`}
        </pre>
      </div>
    </div>
  );
}

// ─── Seção: Estados de avaliação ─────────────────────────────────────────────

function SecaoEstadosAvaliacao() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Estados de avaliação</h1>
      <p className="text-sm text-gray-600 mb-8">
        O Admin gerencia o status da avaliação. O Colaborador tem um estado próprio que reflete
        sua participação naquela avaliação.
      </p>

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
                  <span className={`${BADGE_BASE} bg-gray-100 text-gray-800`}>Encerrada</span>
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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Badges de status</h1>
      <p className="text-sm text-gray-600 mb-8">
        Badges usados em todo o sistema para comunicar estado de registros.
      </p>

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
                  <span className={`${BADGE_BASE} bg-gray-100 text-gray-800`}>Inativa</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">bg-gray-100 text-gray-800</td>
                <td className="px-4 py-3 text-xs text-gray-500">Idem desativados</td>
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
      <p className="text-sm text-gray-600 mb-8">
        Tokens de cor do sistema definidos em{' '}
        <code className="bg-gray-100 px-1 rounded text-xs">src/styles/theme.css</code>.
        Sempre use os tokens CSS (
        <code className="bg-gray-100 px-1 rounded text-xs">var(--brand-600)</code>
        ) em vez de valores hex diretamente.
      </p>

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
        <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[var(--brand-700)]">
            Os tokens de marca (<code className="font-mono text-xs">--brand-*</code>) não se alteram no dark mode.
            As cores de superfície, texto e borda são redefinidas via classe{' '}
            <code className="font-mono text-xs">.dark</code> em{' '}
            <code className="font-mono text-xs">src/styles/dark-mode.css</code>.
            Sempre use tokens CSS e classes Tailwind — nunca valores hex fixos no código.
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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Tipografia</h1>
      <p className="text-sm text-gray-600 mb-8">
        Fonte base: DM Sans (Google Fonts).{' '}
        Definida em{' '}
        <code className="bg-gray-100 px-1 rounded text-xs">src/styles/fonts.css</code>.{' '}
        Tamanho base: 16px. Line-height padrão: 1.5.
      </p>

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
              <li>Nunca use <code className="font-mono text-xs bg-white/60 px-1 rounded">font-bold</code> (700) — não está no design system</li>
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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Espaçamento</h1>
      <p className="text-sm text-gray-600 mb-8">
        O sistema usa a escala de espaçamento padrão do Tailwind CSS. Não há tokens customizados
        de espaçamento — use sempre as classes Tailwind.
      </p>

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
  { label: 'Ativa',     classes: 'bg-green-100 text-green-800',   uso: 'Competências, Habilidades, Carreiras, Jornadas, Avaliações ativas' },
  { label: 'Inativa',   classes: 'bg-gray-100 text-gray-700',     uso: 'Registros desativados' },
  { label: 'Rascunho',  classes: 'bg-yellow-100 text-yellow-800', uso: 'Avaliações não publicadas' },
  { label: 'Encerrada', classes: 'bg-gray-100 text-gray-700',     uso: 'Avaliações com período encerrado' },
  { label: 'Arquivado', classes: 'bg-gray-100 text-gray-700',     uso: 'Níveis arquivados (não aparece em seleções)' },
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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Badges</h1>
      <p className="text-sm text-gray-600 mb-8">
        Badges comunicam estado de forma compacta. Nunca use badges para decoração — cada cor tem
        significado semântico definido.
      </p>

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
    { icone: Layers,          nome: 'Layers',          contexto: 'Habilidades' },
    { icone: GitBranch,       nome: 'GitBranch',       contexto: 'Carreiras' },
    { icone: ClipboardList,   nome: 'ClipboardList',   contexto: 'Avaliações' },
  ]},
  { grupo: 'NAVEGAÇÃO (sidebar Colaborador)', rows: [
    { icone: User,           nome: 'User',           contexto: 'Meu Perfil' },
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
    { icone: ChevronLeft,  nome: 'ChevronLeft',  contexto: 'Botão voltar (← Página anterior)' },
    { icone: ChevronRight, nome: 'ChevronRight', contexto: 'Próximo / expandir' },
    { icone: ChevronDown,  nome: 'ChevronDown',  contexto: 'Dropdown aberto' },
    { icone: ChevronUp,    nome: 'ChevronUp',    contexto: 'Dropdown fechado / accordion fechado' },
  ]},
  { grupo: 'DESIGN SYSTEM (menu)', rows: [
    { icone: BookOpen, nome: 'BookOpen', contexto: 'Link "Design System" no dropdown do perfil' },
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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Ícones</h1>
      <p className="text-sm text-gray-600 mb-8">
        O sistema usa exclusivamente a biblioteca Lucide React. Nunca use outras bibliotecas de ícones
        ou SVGs inline não documentados.
      </p>

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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Botões</h1>
      <p className="text-sm text-gray-600 mb-8">
        Botões comunicam ações. Use a variante correta para cada nível de hierarquia de ação.
      </p>

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
          <div className="flex items-center justify-end gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 border-t border-gray-200">
            <button className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              Cancelar
            </button>
            <button className="px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors">
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
      <div className="max-w-2xl mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Tabelas</h1>
        <p className="text-sm text-gray-600">
          Componente principal de listagem do sistema. Sempre use a estrutura completa — container,
          toolbar, thead, tbody e paginação.
        </p>
      </div>

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
            { n: 5, titulo: 'Paginação', desc: 'border-t border-gray-200. Contagem à esquerda, controles à direita. Botões desabilitados com opacity-40.' },
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

// ─── Página principal ─────────────────────────────────────────────────────────

const IMPLEMENTED: SectionId[] = [
  'fundamentos/cores',
  'fundamentos/tipografia',
  'fundamentos/espacamento',
  'fundamentos/icones',
  'componentes/botoes',
  'componentes/badges',
  'componentes/tabelas',
  'regras/niveis-cores',
  'regras/cobertura-habilidades',
  'regras/estados-avaliacao',
  'regras/badges-status',
];

export default function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  const activeSectionLabel =
    ALL_ITEMS.find((item) => item.id === activeSection)?.label ?? '';

  return (
    <div className="mt-16 min-h-screen flex">
      {/* Sidebar de navegação */}
      <aside className="w-56 flex-shrink-0 border-r border-gray-200 bg-white fixed top-16 bottom-0 overflow-y-auto hidden md:block">
        <nav className="px-2 pt-4 pb-8">
          <button
            onClick={() => setActiveSection('home')}
            className={`w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
              activeSection === 'home'
                ? 'text-[var(--brand-600)] font-medium bg-[var(--brand-50)]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Home
          </button>

          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 mt-4">
                {group.label}
              </p>
              {group.items.map((item) => (
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
            </div>
          ))}
        </nav>
      </aside>

      {/* Área de conteúdo */}
      <main className="flex-1 md:ml-56 p-4 md:p-8">
        {activeSection === 'home' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Design System</h1>
            <p className="text-sm text-gray-600 mb-8">
              Documentação de componentes, padrões visuais e regras de negócio do Sistema de Gestão de Carreiras.
            </p>
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
        {activeSection === 'regras/niveis-cores' && <SecaoNiveisCores />}
        {activeSection === 'regras/cobertura-habilidades' && <SecaoCoberturaHabilidades />}
        {activeSection === 'regras/estados-avaliacao' && <SecaoEstadosAvaliacao />}
        {activeSection === 'regras/badges-status' && <SecaoBadgesStatus />}

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
