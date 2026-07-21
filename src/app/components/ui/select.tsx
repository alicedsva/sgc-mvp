"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";

import { cn } from "./utils";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        // Layout e estrutura
        "flex items-center justify-between gap-[10px] relative text-left",
        // Overflow - IMPEDE expansão pelo conteúdo
        "overflow-hidden",
        // Dimensões e padding
        "px-3 py-2",
        // Largura mínima fixa
        "min-w-[180px]",
        // Background
        "bg-white",
        // Borda e raio
        "rounded-[8px]",
        // Tipografia
        "text-sm font-normal text-[#1f2937] leading-normal",
        // Transições suaves
        "transition-colors duration-150",
        // Outline
        "outline-none",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Select value styling - ELLIPSIS garantido
        "[&>span]:block",
        "[&>span]:truncate",
        "[&>span]:overflow-hidden",
        "[&>span]:whitespace-nowrap",
        "[&>span]:flex-1",
        "[&>span]:min-w-0",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-[14px] shrink-0" strokeWidth={1.5} />
      </SelectPrimitive.Icon>
      {/* Borda e sombra como overlay */}
      <div 
        aria-hidden="true" 
        className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]"
        style={{ boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.05)' }}
      />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          // Background
          "bg-white",
          // Raio
          "rounded-[8px]",
          // Z-index para overlay
          "relative z-50",
          // Altura máxima para evitar dropdowns muito altos
          "max-h-[300px]",
          // Overflow para permitir scroll quando necessário
          "overflow-hidden",
          // Animações de entrada/saída
          "data-[state=open]:animate-in",
          "data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0",
          "data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95",
          "data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          // Posicionamento popper
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            // Padding mínimo
            "p-1",
            // Scroll interno vertical apenas
            "overflow-y-auto overflow-x-hidden max-h-[292px]",
            // Largura dinâmica - PODE SER MAIOR QUE O TRIGGER
            position === "popper" &&
              "w-auto min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
        {/* Borda e sombra como overlay */}
        <div 
          aria-hidden="true" 
          className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]"
          style={{ boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)' }}
        />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-[#6b7280] px-[12px] py-[8px] text-xs font-medium", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        // Layout
        "relative flex items-center",
        // Sem quebra de linha - largura baseada no conteúdo
        "whitespace-nowrap",
        // Raio
        "rounded-[8px]",
        // Padding - aumentado para melhor leitura
        "px-3 py-3",
        // Tipografia base
        "text-sm font-normal leading-normal",
        // Cor padrão
        "text-[#1f2937]",
        // Cor quando selecionado - BRAND-500
        "data-[state=checked]:text-[var(--brand-500)]",
        // Cursor
        "cursor-pointer select-none",
        // Hover - fundo cinza claro
        "hover:bg-[#f3f4f6]",
        // Focus/Highlighted - estado navegação por teclado
        "data-[highlighted]:bg-[#f3f4f6]",
        // Disabled
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        // Transição suave
        "transition-colors duration-150",
        // Outline
        "outline-none",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      {/* Check icon removido - indicação apenas por cor do texto */}
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-[#e5e7eb] pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};