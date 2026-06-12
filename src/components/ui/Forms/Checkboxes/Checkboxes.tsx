import "./Checkboxes.css";
import { useEffect, useRef } from "react";

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Checkboxes({
  label,
  checked,
  indeterminate,
  disabled,
  onChange,
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className="checkbox">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="checkbox-box">✓</span>
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
}