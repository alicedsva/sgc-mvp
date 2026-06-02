import { useState } from 'react';
import { ClipboardCheck, Calendar, Award, CheckCircle2, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { RespostaAvaliacao } from './RespostaAvaliacao';
import { ResultadoAvaliacao } from './ResultadoAvaliacao';

/*
 * Estados possíveis de uma avaliação para o colaborador:
 *
 * "Não iniciada" — Admin: Ativa    | Colaborador não começou a responder
 * "Em andamento" — Admin: Ativa    | Colaborador começou mas não concluiu
 * "Concluída"    — Admin: Encerrada | Colaborador respondeu dentro do prazo
 * "Expirada"     — Admin: Encerrada | Colaborador não respondeu (prazo encerrado sem resposta)
 *
 * Avaliações com status Admin "Rascunho" não são exibidas ao colaborador.
 */

// Dados mockados de avaliações do colaborador
const avaliacoesMock = [
  {
    id: '1',
    titulo: 'Avaliação de Competências Técnicas Q1 2026',
    periodo: '01/03 - 31/03/2026',
    status: 'Não iniciada',
    tipo: 'Autoavaliação',
    competencias: 3,
    habilidades: 15,
    progresso: 0,
    dataLimite: '31 de março de 2026',
  },
  {
    id: '4',
    titulo: 'Avaliação de Vendas Q1',
    periodo: '05/03 - 25/03/2026',
    status: 'Em andamento',
    tipo: 'Autoavaliação',
    competencias: 2,
    habilidades: 8,
    progresso: 50,
    dataLimite: '25 de março de 2026',
  },
  {
    id: '2',
    titulo: 'Avaliação de Liderança 2026',
    periodo: '15/02 - 28/02/2026',
    status: 'Concluída',
    tipo: 'Autoavaliação',
    competencias: 2,
    habilidades: 10,
    progresso: 100,
    dataLimite: '28 de fevereiro de 2026',
    resultado: {
      media: 3.8,
      distribuicao: [
        { nivel: 'Básico', quantidade: 1 },
        { nivel: 'Intermediário', quantidade: 3 },
        { nivel: 'Avançado', quantidade: 5 },
        { nivel: 'Especialista', quantidade: 1 },
      ],
    },
  },
  {
    id: '5',
    titulo: 'Competências Analíticas',
    periodo: '01/01 - 31/01/2026',
    status: 'Concluída',
    tipo: 'Autoavaliação',
    competencias: 3,
    habilidades: 12,
    progresso: 100,
    dataLimite: '31 de janeiro de 2026',
    resultado: {
      media: 3.5,
      distribuicao: [
        { nivel: 'Básico', quantidade: 2 },
        { nivel: 'Intermediário', quantidade: 4 },
        { nivel: 'Avançado', quantidade: 5 },
        { nivel: 'Especialista', quantidade: 1 },
      ],
    },
  },
  {
    id: '6',
    titulo: 'Avaliação de Competências Q4 2025',
    periodo: '01/12 - 31/12/2025',
    status: 'Expirada',
    tipo: 'Autoavaliação',
    competencias: 3,
    habilidades: 12,
    progresso: 0,
    dataLimite: '31 de dezembro de 2025',
  },
];

export function MinhasAvaliacoes() {
  const [viewMode, setViewMode] = useState<'lista' | 'responder' | 'resultado'>('lista');
  const [selectedAvaliacao, setSelectedAvaliacao] = useState<any>(null);

  const handleResponderClick = (avaliacao: any) => {
    setSelectedAvaliacao(avaliacao);
    setViewMode('responder');
  };

  const handleVerResultadoClick = (avaliacao: any) => {
    setSelectedAvaliacao(avaliacao);
    setViewMode('resultado');
  };

  const handleVoltar = () => {
    setViewMode('lista');
    setSelectedAvaliacao(null);
  };

  if (viewMode === 'responder' && selectedAvaliacao) {
    return <RespostaAvaliacao avaliacao={selectedAvaliacao} onVoltar={handleVoltar} />;
  }

  if (viewMode === 'resultado' && selectedAvaliacao) {
    return <ResultadoAvaliacao avaliacao={selectedAvaliacao} onVoltar={handleVoltar} />;
  }

  const naoIniciadas = avaliacoesMock.filter(a => a.status === 'Não iniciada');
  const emAndamento = avaliacoesMock.filter(a => a.status === 'Em andamento');
  const concluidas = avaliacoesMock.filter(a => a.status === 'Concluída');
  const expiradas = avaliacoesMock.filter(a => a.status === 'Expirada');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Minhas Avaliações</h1>
        <p className="text-sm text-gray-600 mt-2">
          Responda suas avaliações e acompanhe seus resultados
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Avaliações em aberto</span>
            <Clock className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{naoIniciadas.length + emAndamento.length}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Avaliações concluídas</span>
            <CheckCircle2 className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{concluidas.length}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Última média obtida</span>
            <Award className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {concluidas.length > 0 ? concluidas[0].resultado?.media : '-'}
          </p>
          <p className="text-xs text-gray-400">escala de 1 a 5</p>
        </div>
      </div>

      {/* Avaliações Pendentes */}
      {(naoIniciadas.length > 0 || emAndamento.length > 0) && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Avaliações em aberto</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {[...naoIniciadas, ...emAndamento].map((avaliacao) => (
              <div key={avaliacao.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-medium text-gray-900">
                        {avaliacao.titulo}
                      </h3>
                      <span className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${
                        avaliacao.status === 'Não iniciada'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {avaliacao.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{avaliacao.periodo}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">•</span>
                        <span>{avaliacao.tipo}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">•</span>
                        <span>{avaliacao.habilidades} habilidades</span>
                      </div>
                    </div>

                    {avaliacao.progresso > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progresso</span>
                          <span>{avaliacao.progresso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[var(--brand-600)] h-2 rounded-full transition-all"
                            style={{ width: `${avaliacao.progresso}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-gray-500">
                      Prazo: {avaliacao.dataLimite}
                    </p>
                  </div>

                  <button
                    onClick={() => handleResponderClick(avaliacao)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] rounded-lg transition-colors"
                  >
                    {avaliacao.progresso > 0 ? 'Continuar' : 'Responder'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Histórico de Avaliações (Concluídas + Expiradas) */}
      {(concluidas.length > 0 || expiradas.length > 0) && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Histórico de Avaliações</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {[...concluidas, ...expiradas].map((avaliacao) => (
              <div key={avaliacao.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-medium text-gray-900">
                        {avaliacao.titulo}
                      </h3>
                      <span className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${
                        avaliacao.status === 'Concluída'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {avaliacao.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{avaliacao.periodo}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">•</span>
                        <span>{avaliacao.tipo}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">•</span>
                        <span>{avaliacao.habilidades} habilidades</span>
                      </div>
                    </div>

                    {avaliacao.status === 'Expirada' && (
                      <span className="text-xs text-gray-400">Não respondida</span>
                    )}

                    {avaliacao.status === 'Concluída' && (
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-[var(--brand-600)]" />
                          <div>
                            <span className="text-sm text-gray-700">
                              Nível médio: <strong>{avaliacao.resultado?.media}</strong>
                            </span>
                            <p className="text-xs text-gray-400">escala de 1 a 5</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {avaliacao.status === 'Concluída' && (
                    <button
                      onClick={() => handleVerResultadoClick(avaliacao)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--brand-600)] hover:bg-[var(--brand-50)] rounded-lg transition-colors"
                    >
                      Ver resultado
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
