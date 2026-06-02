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
import MinhaCarreiraPage from "./pages/MinhaCarreiraPage";
import ConfigurarCargoPage from "./pages/ConfigurarCargoPage";
import EditarJornadaPage from "./pages/EditarJornadaPage";

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
      { path: "minha-carreira", Component: MinhaCarreiraPage },
    ],
  },
]);