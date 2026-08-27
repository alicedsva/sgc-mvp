import { Info } from 'lucide-react';
import { getCorFromPeso } from '../data/mockData';
import type { Nivel } from '../../data/schema';

interface NiveisProficienciaProps {
  niveisData: Nivel[];
}

export function NiveisProficiencia({ niveisData }: NiveisProficienciaProps) {
  const niveisOrdenados = [...niveisData].sort((a, b) => a.peso - b.peso);

  return (
    <div className="space-y-6">
      {/* Banner de contexto */}
      <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700">
          Esta tabela é somente para consulta dos 5 níveis fixos do sistema. Critérios específicos de cada habilidade são definidos ao criar ou editar a habilidade.
        </p>
      </div>

      {/* Tabela de níveis */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                Nome do Nível
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-36">
                Peso do nível
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-40 md:w-48">
                Habilidades Vinculadas
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {niveisOrdenados.map((nivel) => (
              <tr key={nivel.id}>
                {/* Nome do nível */}
                <td className="px-6 py-4 align-middle">
                  <div
                    className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                    style={{ backgroundColor: getCorFromPeso(nivel.peso), color: '#FFFFFF' }}
                  >
                    {nivel.nome}
                  </div>
                </td>

                {/* Descrição — texto completo, sem truncamento (tabela curta, 5 linhas fixas) */}
                <td className="px-6 py-4 align-middle">
                  <span className="text-sm text-gray-700 block max-w-md">
                    {nivel.descricao || <span className="text-gray-400">-</span>}
                  </span>
                </td>

                {/* Progressão */}
                <td className="px-6 py-4 align-middle">
                  <span className="text-sm text-gray-700">{nivel.peso}</span>
                </td>

                {/* Habilidades vinculadas */}
                <td className="px-6 py-4 align-middle">
                  {nivel.emUso && nivel.emUso > 0 ? (
                    <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                      <span className="font-medium">{nivel.emUso}</span>
                      <span className="text-gray-500">
                        {nivel.emUso === 1 ? 'habilidade' : 'habilidades'}
                      </span>
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
