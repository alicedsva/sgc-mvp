import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`mb-6 flex items-center gap-1.5 text-sm ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            )}
            {isLast ? (
              <span className="text-gray-900 font-medium truncate">{item.label}</span>
            ) : (
              <button
                onClick={item.onClick}
                className="text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap"
              >
                {item.label}
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
}
