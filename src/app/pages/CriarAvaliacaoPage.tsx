import { useState } from 'react';
import { useOutletContext, useLocation, useNavigate } from 'react-router';
import { useHabilidades } from '../context/HabilidadesContext';
import { useAvaliacoes } from '../context/AvaliacoesContext';
import { generateId } from '../context/CarreirasContext';
import { HOJE_SIMULADO } from '../data/mockData';
import type { Avaliacao } from '../../data/schema';
import { FormularioAvaliacao, montarCamposPrazo, type NovaAvaliacaoFormData } from '../components/avaliacoes/FormularioAvaliacao';
import { ModalResumoAvaliacao } from '../components/avaliacoes/ModalResumoAvaliacao';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

export default function CriarAvaliacaoPage() {
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const location = useLocation();
  const navigate = useNavigate();
  const { habilidades: habilidadesData } = useHabilidades();
  const { avaliacoes: avaliacoesData, adicionarAvaliacao } = useAvaliacoes();

  const jornadaPreSelecionada = (location.state as { jornadaPreSelecionada?: string } | null)?.jornadaPreSelecionada;

  const voltarParaLista = () => navigate('/avaliacoes');

  // Data de materialização — mesma convenção de RespostaAvaliacaoPage.tsx
  // (HOJE_SIMULADO, nunca new Date() real, para manter o mock determinístico).
  const hojeISO = HOJE_SIMULADO.toISOString().slice(0, 10);

  // Avaliação recém-criada, para o ModalResumoAvaliacao — navegação para a
  // listagem só acontece quando o Admin fecha esse modal, nunca antes.
  const [avaliacaoConcluida, setAvaliacaoConcluida] = useState<Avaliacao | null>(null);

  const handleSalvarRascunho = (data: NovaAvaliacaoFormData) => {
    // Sem dataPublicacao — ainda não é uma publicação de fato, periodoInicio
    // fica vazio quando a combinação preenchida resolveria para "agora".
    const { modoPrazo, periodoInicio, periodoFim, prazoDias } = montarCamposPrazo(data);
    const newAvaliacao: Avaliacao = {
      id: generateId('avaliacao'),
      nome: data.nome,
      tipo: 'Autoavaliação',
      status: 'Rascunho',
      modoPrazo,
      periodoInicio,
      periodoFim,
      prazoDias,
      publicoLabel: data.publicoLabelCalculado,
      descricao: data.descricao,
      habilidades: data.habilidades,
      participantes: [],
      origemJornadaId: data.caminho === 'jornada' ? data.jornadaId : undefined,
      gerenciasComAutoInclusao: data.caminho === 'publico' && data.gerenciasComAutoInclusao.length > 0
        ? data.gerenciasComAutoInclusao
        : undefined,
    };
    adicionarAvaliacao(newAvaliacao);
    setAvaliacaoConcluida(newAvaliacao);
  };

  const handleAtivar = (data: NovaAvaliacaoFormData) => {
    // dataPublicacao = hoje — publicação de fato, resolve os campos em
    // branco para o valor real (ver montarCamposPrazo em FormularioAvaliacao.tsx).
    const { modoPrazo, periodoInicio, periodoFim, prazoDias } = montarCamposPrazo(data, hojeISO);
    const newAvaliacao: Avaliacao = {
      id: generateId('avaliacao'),
      nome: data.nome,
      tipo: 'Autoavaliação',
      status: 'Ativa',
      modoPrazo,
      periodoInicio,
      periodoFim,
      prazoDias,
      publicoLabel: data.publicoLabelCalculado,
      descricao: data.descricao,
      habilidades: data.habilidades,
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
    adicionarAvaliacao(newAvaliacao);
    setAvaliacaoConcluida(newAvaliacao);
  };

  return (
    <>
      <FormularioAvaliacao
        jornadaPreSelecionada={jornadaPreSelecionada}
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
