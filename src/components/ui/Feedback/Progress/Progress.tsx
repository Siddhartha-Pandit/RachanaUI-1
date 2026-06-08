import "./Progress.css";

type ProgressVariant =
  | "default"
  | "success"
  | "warning"
  | "danger";

interface ProgressProps {
  value?: number;

  variant?: ProgressVariant;

  label?: string;
}

export default function Progress({
  value = 0,
  variant = "default",
  label,
}: ProgressProps) {
  return (
    <div className="progress-wrapper">
      {label && (
        <div className="progress-label">
          <span>{label}</span>

          <span>{value}%</span>
        </div>
      )}

      <div className="progress-track">
        <div
          className={`progress-fill progress-${variant}`}
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}