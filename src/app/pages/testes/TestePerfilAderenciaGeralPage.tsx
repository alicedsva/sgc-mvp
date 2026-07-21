import { useOutletContext } from 'react-router';
import { FlaskConical } from 'lucide-react';
import { colaboradoresData, cargosData } from '../../data/mockData';
import { JOAO_ID } from '../minhaCarreiraShared';
import { calcularHabilidadesComGap, calcularCobertura, calcularAderenciaGeral } from '../../utils/aderenciaColaborador';

// Protótipo de teste — compara o card "Cobertura" (já exibido em
// PerfilColaboradorPage.tsx, Admin > Perfis > perfil individual, aba Visão
// Geral) com o card "Aderência geral" + mensagem de criticidade, que existia
// calculado nessa mesma tela mas nunca chegou a ser renderizado em nenhum
// momento do histórico do arquivo (removido por ser variável não utilizada).
// Cálculo 100% reaproveitado de src/app/utils/aderenciaColaborador.ts —
// mesma função usada por PerfilColaboradorPage.tsx, nunca reimplementada
// aqui. Dados de João Silva (id=10, cargo Desenvolvedor Pleno / c2).

type OutletContext = { isSidebarCollapsed: boolean; viewMode: 'admin' | 'colaborador' };

export default function TestePerfilAderenciaGeralPage() {
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const colaborador = colaboradoresData.find(c => c.id === JOAO_ID)!;
  const cargo = cargosData.find(c => c.id === colaborador.cargoId);

  const habilidadesComGap = calcularHabilidadesComGap(colaborador.cargoId, colaborador.id);
  const cobertura = calcularCobertura(habilidadesComGap);
  const aderencia = calcularAderenciaGeral(habilidadesComGap);
  const habilidadesAtendidas = habilidadesComGap.filter(h => h.gap >= 0).length;
  const totalHabilidades = habilidadesComGap.length;

  const corPorPercentual = (percentual: number) => (
    percentual >= 91 ? { badge: 'bg-green-100 text-green-700', texto: 'text-green-700' } :
    percentual >= 71 ? { badge: 'bg-blue-100 text-blue-700', texto: 'text-blue-700' } :
    percentual >= 41 ? { badge: 'bg-yellow-100 text-yellow-700', texto: 'text-yellow-700' } :
    { badge: 'bg-red-100 text-red-700', texto: 'text-red-700' }
  );

  const corCobertura = corPorPercentual(cobertura.percentual);
  const corAderencia = corPorPercentual(aderencia.percentual);

  return (
    <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
      <div className="p-4 md:p-8 space-y-6">

        {/* Banner de teste */}
        <div className="flex items-start gap-3 p-4 bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg">
          <FlaskConical className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[var(--brand-800)]">
            <span className="font-medium">Tela de teste.</span> Compara o card "Cobertura" (já exibido em
            Perfis &gt; perfil individual &gt; Visão Geral) com o card "Aderência geral" + mensagem de
            criticidade — cálculo existente na mesma tela, mas nunca renderizado. Dados de{' '}
            {colaborador.nome} (id={colaborador.id}), cargo {cargo?.cargoRM ?? colaborador.cargo}.
            Não utilizar como referência de produto.
          </p>
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{colaborador.nome}</h1>
          <p className="text-sm text-gray-500 mt-1">{cargo?.cargoRM ?? colaborador.cargo} · {colaborador.gerencia}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card já existente — Cobertura */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Cobertura de habilidades do cargo</h2>
            <p className="text-sm text-gray-600 mb-6">
              Este indicador considera apenas as habilidades mapeadas no sistema. Outros fatores como
              desempenho, contexto e avaliação da liderança também são considerados na evolução de carreira.
            </p>

            <div className="flex items-center gap-4">
              <div className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${corCobertura.badge}`}>
                {cobertura.percentual}%
              </div>
              <div className="flex-1">
                <div className={`text-2xl font-semibold mb-1 ${corCobertura.texto}`}>
                  {cobertura.classificacao}
                </div>
                <p className="text-sm text-gray-700 mb-2">{cobertura.mensagem}</p>
                <p className="text-xs text-gray-500">
                  ({habilidadesAtendidas} de {totalHabilidades} habilidades mapeadas)
                </p>
              </div>
            </div>
          </div>

          {/* Card em teste — Aderência geral */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Aderência geral</h2>
            <p className="text-sm text-gray-600 mb-6">
              Média ponderada entre o nível atual e o nível esperado em cada habilidade — dá crédito
              parcial por estar perto do nível esperado, mesmo sem atingi-lo. Diferente de Cobertura, que
              só conta habilidades onde o nível esperado já foi atingido.
            </p>

            <div className="flex items-center gap-4">
              <div className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${corAderencia.badge}`}>
                {aderencia.percentual}%
              </div>
              <div className="flex-1">
                <div className={`text-2xl font-semibold mb-1 ${corAderencia.texto}`}>
                  Aderência ao nível esperado
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  {aderencia.mensagemCriticidade || 'Nenhuma habilidade abaixo do esperado — sem alertas de criticidade.'}
                </p>
                <p className="text-xs text-gray-500">
                  (soma dos níveis atuais ÷ soma dos níveis esperados, em todas as habilidades do cargo)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de apoio — evidencia a divergência habilidade a habilidade */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Habilidades consideradas no cálculo</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Habilidade</th>
                <th className="px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Nível atual</th>
                <th className="px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Nível esperado</th>
                <th className="px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Cobertura (gap ≥ 0)</th>
                <th className="px-4 py-2 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Obrigatória</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {habilidadesComGap.map(h => (
                <tr key={h.habilidadeId}>
                  <td className="px-4 py-2 text-xs md:text-sm text-gray-900">{h.nome}</td>
                  <td className="px-4 py-2 text-xs md:text-sm text-gray-700">{h.nivelAtual}</td>
                  <td className="px-4 py-2 text-xs md:text-sm text-gray-700">{h.nivelEsperado}</td>
                  <td className="px-4 py-2 text-xs md:text-sm">
                    <span className={h.gap >= 0 ? 'text-green-600' : 'text-red-500'}>
                      {h.gap >= 0 ? 'Atende' : 'Não atende'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs md:text-sm text-gray-700">{h.obrigatoria ? 'Sim' : 'Não'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
