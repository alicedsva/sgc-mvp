import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

export default function ConfigurarCargoPage() {
  const { carreiraId, jornadaId } = useParams();
  const navigate = useNavigate();

  // Redirecionar para a nova estrutura inline (jornada com accordion)
  useEffect(() => {
    if (carreiraId && jornadaId) {
      navigate(`/carreiras/${carreiraId}/jornadas/${jornadaId}`, { replace: true });
    }
  }, [carreiraId, jornadaId, navigate]);

  return null;
}