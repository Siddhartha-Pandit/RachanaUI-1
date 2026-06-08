import "./Toggles.css";

interface ToggleProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
}

export default function Toggles({
  checked,
  disabled,
  label,
  onChange,
}: ToggleProps) {
  return (
    <label className="toggle-wrapper">
      <div className="toggle">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) =>
            onChange?.(e.target.checked)
          }
        />

        <span className="toggle-slider" />
      </div>

      {label && (
        <span className="toggle-label">
          {label}
        </span>
      )}
    </label>
  );
}