import "./Tooltip.css";

interface TooltipProps {
  text?: string;

  children?: React.ReactNode;
}

export default function Tooltip({
  text,
  children,
}: TooltipProps) {
  return (
    <div className="tooltip-wrapper">
      {children}

      <div className="tooltip">
        {text}
      </div>
    </div>
  );
}