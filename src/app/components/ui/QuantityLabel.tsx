interface QuantityLabelProps {
  value: number;
  singular: string;
  plural: string;
}

/**
 * Padrão "número + palavra" (02-design-system.md > Tipografia): número em
 * destaque, palavra/unidade ao lado em peso normal e cor mais fraca. Sem
 * tamanho de fonte próprio — herda o da célula onde for usado.
 */
export function QuantityLabel({ value, singular, plural }: QuantityLabelProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="font-semibold text-gray-900">{value}</span>
      <span className="font-normal text-gray-500">{value === 1 ? singular : plural}</span>
    </span>
  );
}
