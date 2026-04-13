interface ToggleSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleSwitch({ id, label, checked, onChange }: ToggleSwitchProps) {
  return (
    <div className="toggle-row">
      <label className="toggle-row__label" htmlFor={id}>
        {label}
      </label>
      <button type="button" id={id} role="switch" aria-checked={checked} className="toggle-switch" onClick={() => onChange(!checked)}>
        <span className="toggle-switch__thumb" aria-hidden />
      </button>
    </div>
  );
}
