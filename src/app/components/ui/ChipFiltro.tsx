import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';

/*
 * Padrão vigente das 4 listagens principais (Habilidades, Avaliações,
 * Carreiras, Competências) desde 2026-09-16 — decisão de produto já
 * confirmada por Alice, ver 02-design-system.md > "Filtros e Pills".
 * Exploração visual original testada nas rotas /testes/* antes da migração.
 *
 * "Chip de filtro": botão fechado mostrando "Label: valor atual" + chevron;
 * ao clicar, abre um popover com as opções (escolha única). Substitui as
 * pills / segmented controls / Select longo do padrão anterior
 * (02-design-system.md > "Filtros e Pills"). Pills continuam em telas de
 * detalhe (CompetenciaDetalhePage, ParticipanteResultadoPage) — exceção
 * documentada, não são listagens principais.
 *
 * Base reaproveitada, NADA de mecanismo novo:
 * - Popover: ui/popover.tsx (wrapper de @radix-ui/react-popover) — mesmo
 *   usado por ui/SearchableSelect.tsx e ui/select.tsx.
 * - Busca interna (prop `searchable`): Command / cmdk (ui/command.tsx),
 *   exatamente como ui/SearchableSelect.tsx faz para as listas longas.
 *
 * Visual do botão fechado: deriva do botão "Cancelar" do design system
 * (`border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50`), só
 * mais compacto. Nenhuma cor/borda nova.
 */

export interface ChipFiltroOption {
  value: string;
  label: string;
}

interface ChipFiltroProps {
  label: string;
  value: string;
  options: ChipFiltroOption[];
  onChange: (value: string) => void;
  /** true → popover com campo de busca (Command), para listas longas. */
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function ChipFiltro({
  label,
  value,
  options,
  onChange,
  searchable = false,
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'Nenhum resultado encontrado',
}: ChipFiltroProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          /* Texto no `text-sm` do design system (02-design-system.md >
             Formulários / Botões) — mesmo tamanho de inputs e pills. Só o
             formato (botão fechado + popover) é experimental nesta rota. */
          className="inline-flex items-center gap-1.5 max-w-[240px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
        >
          <span className="shrink-0 text-gray-500">{label}:</span>
          <span className="truncate text-gray-900">{selected?.label ?? '-'}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </PopoverTrigger>

      {searchable ? (
        <PopoverContent align="start" className="w-56 p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty className="py-4 text-center text-sm text-gray-500">
                {emptyMessage}
              </CommandEmpty>
              <CommandGroup>
                {options.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    /* text-sm — mesmo tamanho do item de Select/SearchableSelect. */
                    className={`flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm ${
                      option.value === value ? 'text-[var(--brand-600)]' : 'text-gray-900'
                    }`}
                  >
                    {option.label}
                    {option.value === value && <Check className="w-3.5 h-3.5" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      ) : (
        <PopoverContent align="start" className="w-52 p-1">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              /* text-sm — mesmo tamanho das pills / itens de Select. */
              className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-gray-100 ${
                option.value === value ? 'font-medium text-[var(--brand-600)]' : 'text-gray-900'
              }`}
            >
              {option.label}
              {option.value === value && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          ))}
        </PopoverContent>
      )}
    </Popover>
  );
}
