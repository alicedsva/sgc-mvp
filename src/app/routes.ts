import { createBrowserRouter, redirect } from "react-router";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import CarreirasListPage from "./pages/CarreirasListPage";
import CarreiraDetalhePage from "./pages/CarreiraDetalhePage";
import JornadaDetalhePage from "./pages/JornadaDetalhePage";
import CriarJornadaPage from "./pages/CriarJornadaPage";
import PerfilColaboradorPage from "./pages/PerfilColaboradorPage";
import HabilidadesPage from "./pages/HabilidadesPage";
import HabilidadeDetalhePage from "./pages/HabilidadeDetalhePage";
import PerfisListPage from "./pages/PerfisListPage";
import AvaliacoesPage from "./pages/AvaliacoesPage";
import AvaliacaoDetalhePage from "./pages/AvaliacaoDetalhePage";
import MeuPerfilPage from "./pages/MeuPerfilPage";
import MinhasAvaliacoesPage from "./pages/MinhasAvaliacoesPage";
import RespostaAvaliacaoPage from "./pages/RespostaAvaliacaoPage";
import ResultadoAvaliacaoPage from "./pages/ResultadoAvaliacaoPage";
import MinhaCarreiraPage from "./pages/MinhaCarreiraPage";
import CompetenciaDetalhePage from "./pages/CompetenciaDetalhePage";
import ConfigurarCargoPage from "./pages/ConfigurarCargoPage";
import EditarJornadaPage from "./pages/EditarJornadaPage";
import DesignSystemPage from "./pages/DesignSystemPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, loader: () => redirect("/dashboard") },
      { path: "dashboard", Component: DashboardPage },
      { path: "habilidades", Component: HabilidadesPage },
      { path: "habilidades/:id", Component: HabilidadeDetalhePage },
      { path: "perfis", Component: PerfisListPage },
      { path: "perfis/:colaboradorId", Component: PerfilColaboradorPage },
      { path: "carreiras", Component: CarreirasListPage },
      { path: "carreiras/:carreiraId", Component: CarreiraDetalhePage },
      { path: "carreiras/:carreiraId/jornadas/criar", Component: CriarJornadaPage },
      { path: "carreiras/:carreiraId/jornadas/:jornadaId", Component: JornadaDetalhePage },
      { path: "carreiras/:carreiraId/jornadas/:jornadaId/editar", Component: EditarJornadaPage },
      { path: "carreiras/:carreiraId/jornadas/:jornadaId/cargos/:cargoId", Component: ConfigurarCargoPage },
      { path: "avaliacoes", Component: AvaliacoesPage },
      { path: "avaliacoes/:id", Component: AvaliacaoDetalhePage },
      { path: "meu-perfil", Component: MeuPerfilPage },
      { path: "minhas-avaliacoes", Component: MinhasAvaliacoesPage },
      { path: "minhas-avaliacoes/resultado/:avaliacaoId", Component: ResultadoAvaliacaoPage },
      { path: "minha-carreira", Component: MinhaCarreiraPage },
      { path: "minha-carreira/competencia/:id", Component: CompetenciaDetalhePage },
      { path: "design-system", Component: DesignSystemPage },
      { path: "design-system/:secao", Component: DesignSystemPage },
    ],
  },
  // Rota irmã, fora da árvore de Layout.tsx — modo de foco (fullscreen, sem
  // Sidebar/Header do sistema). Promovida a partir do protótipo vencedor da
  // exploração de wizard (/testes/resposta-sem-nome, já removido) — monta o
  // próprio wrapper mínimo (header sticky com nome/prazo + botão único
  // "Salvar e sair", etapa de Instruções antes do wizard), nunca reaproveita
  // Layout/Sidebar/Header.
  { path: "/minhas-avaliacoes/responder/:avaliacaoId", Component: RespostaAvaliacaoPage },
]);
