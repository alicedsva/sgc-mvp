import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { niveisDefaultData, getCorFromPeso } from '../data/mockData';
import { toast } from 'sonner';

interface RespostaAvaliacaoProps {
  avaliacao: any;
  onVoltar: () => void;
}

// Dados mockados de competências e habilidades para avaliação
const competenciasMock = [
  {
    id: '1',
    nome: 'Desenvolvimento Frontend',
    habilidades: [
      { id: '1', nome: 'React', descricao: 'Desenvolvimento com React e ecossistema' },
      { id: '2', nome: 'TypeScript', descricao: 'Programação com tipagem estática' },
      { id: '8', nome: 'Figma', descricao: 'Design de interfaces e prototipagem' },
    ],
  },
  {
    id: '2',
    nome: 'Desenvolvimento Backend',
    habilidades: [
      { id: '3', nome: 'Node.js', descricao: 'Desenvolvimento backend com Node.js' },
      { id: '4', nome: 'PostgreSQL', descricao: 'Modelagem e consultas em banco relacional' },
      { id: '15', nome: 'Python', descricao: 'Programação em Python' },
    ],
  },
  {
    id: '3',
    nome: 'DevOps e Infraestrutura',
    habilidades: [
      { id: '6', nome: 'Kubernetes', descricao: 'Orquestração de containers' },
      { id: '19', nome: 'CI/CD', descricao: 'Integração e entrega contínua' },
      { id: '20', nome: 'Terraform', descricao: 'Infrastructure as Code' },
    ],
  },
];

export function RespostaAvaliacao({ avaliacao, onVoltar }: RespostaAvaliacaoProps) {
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [competenciaExpandida, setCompetenciaExpandida] = useState<string[]>(['1']);

  const toggleCompetencia = (competenciaId: string) => {
    setCompetenciaExpandida(prev =>
      prev.includes(competenciaId)
        ? prev.filter(id => id !== competenciaId)
        : [...prev, competenciaId]
    );
  };

  const handleNivelChange = (habilidadeId: string, nivelId: string) => {
    setRespostas(prev => ({ ...prev, [habilidadeId]: nivelId }));
  };

  const totalHabilidades = competenciasMock.reduce((acc, comp) => acc + comp.habilidades.length, 0);
  const respondidas = Object.keys(respostas).length;
  const progresso = Math.round((respondidas / totalHabilidades) * 100);

  const handleSalvarRascunho = () => {
    toast.success('Respostas salvas! Você pode continuar depois.');
  };

  const handleEnviar = () => {
    if (respondidas < totalHabilidades) {
      toast.error('Por favor, avalie todas as habilidades antes de enviar.');
      return;
    }
    toast.success('Avaliação enviada com sucesso!');
    setTimeout(() => {
      onVoltar();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header com botão voltar */}
      <div>
        <button
          onClick={onVoltar}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Minhas Avaliações
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">{avaliacao.titulo}</h1>
        <p className="text-sm text-gray-600 mt-1">
          Período: {avaliacao.periodo} • Tipo: {avaliacao.tipo}
        </p>
      </div>

      {/* Instruções */}
      <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-slate-700">
          <span className="font-medium text-slate-800">Instruções: </span>
          Avalie seu nível de proficiência em cada habilidade listada. Seja honesto e considere sua experiência prática e conhecimento teórico. Você pode salvar como rascunho e continuar depois.
        </p>
      </div>

      {/* Lista de competências e habilidades */}
      <div className="space-y-4">
        {competenciasMock.map((competencia) => {
          const isExpanded = competenciaExpandida.includes(competencia.id);
          const habilidadesRespondidas = competencia.habilidades.filter(h => respostas[h.id]).length;

          return (
            <div key={competencia.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header da competência */}
              <button
                onClick={() => toggleCompetencia(competencia.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="text-left">
                  <h3 className="text-base font-medium text-gray-900">{competencia.nome}</h3>
                  <p className="text-sm text-gray-500">
                    {habilidadesRespondidas} de {competencia.habilidades.length} habilidades avaliadas
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Lista de habilidades */}
              {isExpanded && (
                <div className="border-t border-gray-200 divide-y divide-gray-200">
                  {competencia.habilidades.map((habilidade) => (
                    <div key={habilidade.id} className="p-5 bg-gray-50">
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">{habilidade.nome}</h4>
                        <p className="text-xs text-gray-600">{habilidade.descricao}</p>
                      </div>

                      {/* Seletor de nível */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700 mb-2">Selecione seu nível:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                          {niveisDefaultData.map((nivel) => {
                            const isSelected = respostas[habilidade.id] === nivel.id;
                            return (
                              <button
                                key={nivel.id}
                                onClick={() => handleNivelChange(habilidade.id, nivel.id)}
                                className={`p-3 rounded-lg border-2 text-left transition-all ${
                                  isSelected ? '' : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                                style={isSelected ? {
                                  borderColor: getCorFromPeso(nivel.peso),
                                  backgroundColor: getCorFromPeso(nivel.peso) + '1A',
                                } : {}}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className="text-sm font-medium"
                                    style={isSelected ? { color: getCorFromPeso(nivel.peso) } : { color: '#374151' }}
                                  >
                                    {nivel.nome}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600">{nivel.descricao}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ações fixas */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 md:-mx-8 flex items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          {respondidas} de {totalHabilidades} habilidades avaliadas ({progresso}%)
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSalvarRascunho}
            className="px-4 py-2 border border-[var(--brand-600)] text-[var(--brand-600)] text-sm font-medium rounded-lg hover:bg-[var(--brand-50)] transition-colors"
          >
            Salvar rascunho
          </button>
          <button
            onClick={handleEnviar}
            disabled={respondidas < totalHabilidades}
            className="px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar avaliação
          </button>
        </div>
      </div>
    </div>
  );
}
