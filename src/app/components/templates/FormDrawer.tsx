import { ReactNode, FormEvent } from 'react';
import { X, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'number' | 'multiselect' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  error?: string;
  value?: any;
  onChange?: (value: any) => void;
  rows?: number;
}

interface AlertBanner {
  title: string;
  description: string;
  variant?: 'info' | 'warning' | 'success';
}

interface FormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  onSubmit: (e: FormEvent) => void;
  submitLabel?: string;
  isLoading?: boolean;
  alertBanner?: AlertBanner;
  secondaryAction?: {
    label: string;
    onClick: (e: FormEvent) => void;
  };
  customContent?: ReactNode;
}

export function FormDrawer({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  submitLabel = 'Salvar',
  isLoading = false,
  alertBanner,
  secondaryAction,
  customContent,
}: FormDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - apenas sobre a área de conteúdo (não cobre sidebar/header) */}
      <div
        className="fixed inset-0 ml-0 md:ml-20 lg:ml-64 mt-16 bg-black/20 z-40 transition-opacity duration-200 ease-out"
        onClick={onClose}
      />

      {/* Drawer - lateral direito, respeitando sidebar e header, full width no mobile */}
      <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-full md:w-[35%] md:max-w-xl md:min-w-[400px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-white">
          <h2 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* Form Fields */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-5">
            {/* Alert Banner - no topo dos campos */}
            {alertBanner && (
              <div
                className={`p-4 rounded-lg border flex items-start gap-3 ${
                  alertBanner.variant === 'info'
                    ? 'bg-blue-50 border-blue-200'
                    : alertBanner.variant === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : alertBanner.variant === 'success'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Info
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    alertBanner.variant === 'info'
                      ? 'text-blue-600'
                      : alertBanner.variant === 'warning'
                      ? 'text-yellow-600'
                      : alertBanner.variant === 'success'
                      ? 'text-green-600'
                      : 'text-gray-600'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-sm font-medium mb-1 ${
                      alertBanner.variant === 'info'
                        ? 'text-blue-900'
                        : alertBanner.variant === 'warning'
                        ? 'text-yellow-900'
                        : alertBanner.variant === 'success'
                        ? 'text-green-900'
                        : 'text-gray-900'
                    }`}
                  >
                    {alertBanner.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      alertBanner.variant === 'info'
                        ? 'text-blue-700'
                        : alertBanner.variant === 'warning'
                        ? 'text-yellow-700'
                        : alertBanner.variant === 'success'
                        ? 'text-green-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {alertBanner.description}
                  </p>
                </div>
              </div>
            )}

            {fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2"
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {field.type === 'text' ||
                field.type === 'email' ||
                field.type === 'number' ||
                field.type === 'date' ? (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={field.value || ''}
                    onChange={(e) => field.onChange?.(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent ${
                      field.error
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                ) : field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={field.value || ''}
                    onChange={(e) => field.onChange?.(e.target.value)}
                    rows={field.rows || 4}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent resize-none ${
                      field.error
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                ) : field.type === 'select' ? (
                  <Select
                    value={field.value || ''}
                    onValueChange={(value) => field.onChange?.(value)}
                  >
                    <SelectTrigger
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent ${
                        field.error
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300'
                      }`}
                    >
                      <SelectValue placeholder={field.placeholder || 'Selecione...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === 'multiselect' ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {field.options?.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={(field.value || []).includes(option.value)}
                          onChange={(e) => {
                            const currentValues = field.value || [];
                            const newValues = e.target.checked
                              ? [...currentValues, option.value]
                              : currentValues.filter((v: string) => v !== option.value);
                            field.onChange?.(newValues);
                          }}
                          className="w-4 h-4 text-[var(--brand-600)] border-gray-300 rounded focus:ring-2 focus:ring-[var(--brand-500)]"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={field.name}
                      name={field.name}
                      checked={field.value || false}
                      onChange={(e) => field.onChange?.(e.target.checked)}
                      className="w-4 h-4 text-[var(--brand-600)] border-gray-300 rounded focus:ring-2 focus:ring-[var(--brand-500)]"
                    />
                    <label
                      htmlFor={field.name}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {field.placeholder}
                    </label>
                  </div>
                ) : null}

                {field.error && (
                  <p className="mt-1 text-sm text-red-600">{field.error}</p>
                )}
              </div>
            ))}

            {customContent && <div>{customContent}</div>}
          </div>

          {/* Footer - fixo na base do drawer */}
          <div className="flex items-center justify-end gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-3 md:px-4 py-2 border border-gray-300 text-gray-700 text-xs md:text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 md:px-4 py-2 border border-[var(--brand-600)] text-[var(--brand-600)] text-xs md:text-sm font-medium rounded-lg hover:bg-[var(--brand-50)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Salvando...' : submitLabel}
            </button>
            {secondaryAction && (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                disabled={isLoading}
                className="px-3 md:px-4 py-2 bg-[var(--brand-600)] text-white text-xs md:text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}