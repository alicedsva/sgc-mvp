import { GripVertical, X } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';

const DRAG_TYPE = 'CARGO_SELECIONADO';

export interface DraggableCargoItem {
  id: string;
  nome: string;
  categoria: string;
}

export interface DraggableCargoProps {
  cargo: DraggableCargoItem;
  index: number;
  moveCargo: (fromIndex: number, toIndex: number) => void;
  onRemove: (id: string) => void;
}

export function DraggableCargo({ cargo, index, moveCargo, onRemove }: DraggableCargoProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: DRAG_TYPE,
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop({
    accept: DRAG_TYPE,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveCargo(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => preview(drop(node))}
      className={`flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg transition-opacity ${isDragging ? 'opacity-40' : ''}`}
    >
      <div ref={drag} className="cursor-move text-gray-300 hover:text-gray-500 transition-colors">
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">{cargo.nome}</div>
        <div className="text-xs text-gray-400">{cargo.categoria}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded tabular-nums">
          #{index + 1}
        </span>
        <button
          onClick={() => onRemove(cargo.id)}
          className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
