interface StatusBadgeProps {
  label: string;
  colorClass: string;
}

// Badge de status ao lado de um H1 (Avaliação, Jornada, Habilidade, ...) —
// mesma estrutura em todo o sistema: inline-flex px-2 py-1 text-xs
// font-medium rounded-full, sem dot antes do texto. Antes desta unificação
// coexistiam dois padrões (um com dot + py-0.5, usado só em
// JornadaDetalhePage/HabilidadeDetalhePage) — este componente é o único
// daqui em diante.
// A cor por status NUNCA é decidida aqui — vem de getStatusAvaliacaoBadgeClass/
// getStatusParticipanteBadgeClass (utils/avaliacoes.ts) para Avaliações, ou
// de uma expressão equivalente por entidade (ex.: Ativa/Desativada de
// StatusRegistro). Este componente só garante que padding/tamanho/ausência
// de dot nunca voltem a divergir entre telas.
export function StatusBadge({ label, colorClass }: StatusBadgeProps) {
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
      {label}
    </span>
  );
}
