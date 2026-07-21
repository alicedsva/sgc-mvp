import { ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  id: string;
  trigger: ReactNode;
  content: ReactNode;
  isOpen?: boolean;
  onToggle?: (id: string) => void;
  className?: string;
}

export function AccordionItem({ id, trigger, content, isOpen = false, onToggle, className = '' }: AccordionItemProps) {
  const [internalOpen, setInternalOpen] = useState(isOpen);
  const open = onToggle ? isOpen : internalOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle(id);
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Trigger - usar div com role="button" em vez de <button> para evitar nesting */}
      <div
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        role="button"
        tabIndex={0}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {trigger}
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Content */}
      {open && (
        <div className="border-t border-gray-200 bg-gray-50">
          {content}
        </div>
      )}
    </div>
  );
}

interface AccordionProps {
  children: ReactNode;
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ children, className = '' }: AccordionProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  );
}
