import { useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

export default function ConfigurarCargoPage() {
  const { carreiraId, jornadaId, cargoId } = useParams();
  const navigate = useNavigate();

  // Redirecionar para a nova estrutura inline (jornada com accordion)
  useEffect(() => {
    if (carreiraId && jornadaId) {
      navigate(`/carreiras/${carreiraId}/jornadas/${jornadaId}`, { replace: true });
    }
  }, [carreiraId, jornadaId, navigate]);

  return null;
}