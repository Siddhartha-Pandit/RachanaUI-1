import "./Checkboxes.css";

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Checkboxes({
  label,
  checked,
  disabled,
  onChange,
}: CheckboxProps) {
  return (
    <label className="checkbox">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) =>
          onChange?.(e.target.checked)
        }
      />

      <span className="checkbox-box">
        ✓
      </span>

      {label && (
        <span className="checkbox-label">
          {label}
        </span>
      )}
    </label>
  );
}