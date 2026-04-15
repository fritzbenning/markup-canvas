interface ToggleSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleSwitch({ id, label, checked, onChange }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-[#eee] border-b py-3 last:border-b-0">
      <label className="cursor-pointer font-medium text-[#222] text-sm" htmlFor={id}>
        {label}
      </label>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        className="relative h-[26px] w-11 shrink-0 cursor-pointer rounded-[13px] border-0 bg-gray-300 p-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#808dfd] focus-visible:outline-offset-2 aria-checked:bg-[#808dfd]"
        onClick={() => onChange(!checked)}
      >
        <span
          className={`pointer-events-none absolute top-[3px] left-[3px] h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[18px]" : ""}`}
          aria-hidden
        />
      </button>
    </div>
  );
}
