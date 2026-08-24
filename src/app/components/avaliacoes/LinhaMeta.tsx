import { Fragment, ReactNode } from 'react';

interface LinhaMetaProps {
  partes: ReactNode[];
  className?: string;
}

// Subtítulo de página — texto corrido "{parte1} · {parte2} · {parte3}",
// mesmo padrão já usado em ColaboradorView.tsx (header do Meu Perfil:
// "{cargo} · {tempo de empresa} de empresa") e documentado em
// 02-design-system.md ("Subtítulo de página: text-sm text-gray-600").
// O "·" é só mais um caractere no fluxo do texto — nunca um <span> separado
// nem um container flex com gap, que produzem um vão exagerado ao redor do
// separador em vez do espaçamento normal de tipografia.
// Partes falsy (null/undefined/false/'') são filtradas antes de juntar,
// para nunca deixar "· ·" quando uma parte condicional (ex.: data de
// resposta) não se aplica.
export function LinhaMeta({ partes, className = 'text-sm text-gray-600' }: LinhaMetaProps) {
  const visiveis = partes.filter((parte) => parte !== null && parte !== undefined && parte !== false && parte !== '');
  return (
    <p className={className}>
      {visiveis.map((parte, i) => (
        <Fragment key={i}>
          {i > 0 && ' · '}
          {parte}
        </Fragment>
      ))}
    </p>
  );
}
