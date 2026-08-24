"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { cn } from "./utils";

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

// Select com busca embutida — mesma anatomia visual do Select Radix
// (ui/select.tsx: mesma altura/borda/raio de trigger, mesmo item highlight),
// mas construído sobre Popover + Command (ui/command.tsx, shadcn/cmdk) em vez
// de @radix-ui/react-select, que não suporta filtro por texto. Ver
// .claude/rules/02-design-system.md — "Dropdowns: Radix Select — nunca
// <select> nativo": este componente é a exceção documentada para os casos
// que precisam de busca (a base ainda é Radix, via Popover).
export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Selecione",
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhum resultado encontrado",
  disabled,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex items-center justify-between gap-[10px] relative text-left overflow-hidden px-3 py-2 min-w-[180px] bg-white rounded-[8px] text-sm font-normal text-[#1f2937] leading-normal transition-colors duration-150 outline-none disabled:cursor-not-allowed disabled:opacity-50 border border-[#e5e7eb]",
            className,
          )}
          style={{ boxShadow: "0px 1px 1px 0px rgba(0,0,0,0.05)" }}
        >
          <span className={cn("block truncate overflow-hidden whitespace-nowrap flex-1 min-w-0", !selected && "text-[#6b7280]")}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDownIcon className="size-[14px] shrink-0 text-gray-500" strokeWidth={1.5} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="p-0 w-[var(--radix-popover-trigger-width)] rounded-[8px] border border-[#e5e7eb] shadow-lg"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty className="py-4 text-center text-sm text-gray-500">{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "text-sm rounded-[8px] px-3 py-3 cursor-pointer data-[selected=true]:bg-[#f3f4f6]",
                    option.value === value ? "text-[var(--brand-500)]" : "text-[#1f2937]",
                  )}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
