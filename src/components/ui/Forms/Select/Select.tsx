import "./Select.css";

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
}

export default function Select({
  label,
  hint,
  children,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="select-group">
      {label && (
        <label className="select-label">
          {label}
        </label>
      )}

      <div className="select-wrapper">
        <select
          className={`select ${className}`}
          {...props}
        >
          {children}
        </select>
      </div>

      {hint && (
        <p className="select-hint">
          {hint}
        </p>
      )}
    </div>
  );
}