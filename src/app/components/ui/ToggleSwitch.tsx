interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked?: boolean) => void;
  disabled?: boolean;
  label?: string;
  labelOff?: string;
}

export function ToggleSwitch({ checked, onChange, disabled = false, label, labelOff }: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? undefined : () => onChange(!checked)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className={`relative inline-flex h-4 w-6 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 ${
          checked
            ? 'bg-green-600 focus:ring-green-500'
            : 'bg-red-500 focus:ring-red-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-2.5' : 'translate-x-0.5'
          }`}
        />
      </div>
      {label && labelOff && (
        <span className="text-sm font-medium text-gray-700">
          {checked ? label : labelOff}
        </span>
      )}
    </div>
  );
}