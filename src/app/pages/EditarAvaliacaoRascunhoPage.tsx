import { useEffect, useState } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { useHabilidades } from '../context/HabilidadesContext';
import { useAvaliacoes } from '../context/AvaliacoesContext';
import { HOJE_SIMULADO } from '../data/mockData';
import type { Avaliacao } from '../../data/schema';
import { FormularioAvaliacao, montarCamposPrazo, type NovaAvaliacaoFormData } from '../components/avaliacoes/FormularioAvaliacao';
import { ModalResumoAvaliacao } from '../components/avaliacoes/ModalResumoAvaliacao';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

export default function EditarAvaliacaoRascunhoPage() {
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { habilidades: habilidadesData } = useHabilidades();
  const { avaliacoes: avaliacoesData, atualizarAvaliacao } = useAvaliacoes();

  const avaliacao = avaliacoesData.find(a => a.id === id);
  const voltarParaLista = () => navigate('/avaliacoes');

  // Avaliação já atualizada, para o ModalResumoAvaliacao — atualizarAvaliacao
  // só faz merge no Context (não retorna o objeto final), então montamos a
  // versão completa aqui mesmo, antes de chamá-lo, para passar ao modal.
  // Hook precisa vir antes do early return abaixo (regra dos Hooks).
  const [avaliacaoConcluida, setAvaliacaoConcluida] = useState<Avaliacao | null>(null);

  // Só Rascunho sem participantes pode ser editado por esta página — uma
  // avaliação já materializada só é prorrogável, pelo EditarAvaliacaoModal.
  // Guarda de acesso direto por URL (a tabela já filtra isso na origem).
  useEffect(() => {
    if (avaliacao && avaliacao.participantes.length > 0) {
      toast.error('Esta avaliação já tem participantes. Só é possível prorrogar o prazo.');
      navigate('/avaliacoes', { replace: true });
    }
  }, [avaliacao, navigate]);

  if (!avaliacao || avaliacao.participantes.length > 0) return null;

  const hojeISO = HOJE_SIMULADO.toISOString().slice(0, 10);

  const handleSalvarRascunho = (data: NovaAvaliacaoFormData) => {
    // Sem dataPublicacao — ainda é Rascunho, não uma publicação de fato.
    const { modoPrazo, periodoInicio, periodoFim, prazoDias } = montarCamposPrazo(data);
    const avaliacaoAtualizada: Avaliacao = {
      ...avaliacao,
      nome: data.nome,
      descricao: data.descricao,
      modoPrazo,
      periodoInicio,
      periodoFim,
      prazoDias,
      publicoLabel: data.publicoLabelCalculado,
      habilidades: data.habilidades,
      status: 'Rascunho',
      participantes: [],
      origemJornadaId: data.caminho === 'jornada' ? data.jornadaId : undefined,
      gerenciasComAutoInclusao: data.caminho === 'publico' && data.gerenciasComAutoInclusao.length > 0
        ? data.gerenciasComAutoInclusao
        : undefined,
    };
    atualizarAvaliacao(avaliacao.id, avaliacaoAtualizada);
    setAvaliacaoConcluida(avaliacaoAtualizada);
  };

  const handleAtivar = (data: NovaAvaliacaoFormData) => {
    // dataPublicacao = hoje — publicação de fato.
    const { modoPrazo, periodoInicio, periodoFim, prazoDias } = montarCamposPrazo(data, hojeISO);
    const avaliacaoAtualizada: Avaliacao = {
      ...avaliacao,
      nome: data.nome,
      descricao: data.descricao,
      modoPrazo,
      periodoInicio,
      periodoFim,
      prazoDias,
      publicoLabel: data.publicoLabelCalculado,
      habilidades: data.habilidades,
      status: 'Ativa',
      participantes: data.participantesIds.map((colaboradorId) => ({
        colaboradorId,
        status: 'Não iniciada' as const,
        visualizada: false,
        respostas: [],
        dataEntrada: hojeISO,
      })),
      origemJornadaId: data.caminho === 'jornada' ? data.jornadaId : undefined,
      gerenciasComAutoInclusao: data.caminho === 'publico' && data.gerenciasComAutoInclusao.length > 0
        ? data.gerenciasComAutoInclusao
        : undefined,
    };
    atualizarAvaliacao(avaliacao.id, avaliacaoAtualizada);
    setAvaliacaoConcluida(avaliacaoAtualizada);
  };

  return (
    <>
      <FormularioAvaliacao
        avaliacaoExistente={avaliacao}
        habilidades={habilidadesData}
        avaliacoesExistentes={avaliacoesData.map(a => ({
          nome: a.nome,
          publicoLabel: a.publicoLabel,
          jornadaId: a.origemJornadaId,
          participantesIds: a.participantes.map(p => p.colaboradorId),
        }))}
        onSalvarRascunho={handleSalvarRascunho}
        onAtivar={handleAtivar}
        isSidebarCollapsed={isSidebarCollapsed}
        breadcrumbLabel="Avaliações"
        onCancelar={voltarParaLista}
      />
      {avaliacaoConcluida && (
        <ModalResumoAvaliacao avaliacao={avaliacaoConcluida} onClose={voltarParaLista} />
      )}
    </>
  );
}
