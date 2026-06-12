import "./Banner.css";
import { InfoIcon, CheckIcon, XIcon, AlertTriangleIcon } from "../../Icons/Icons";

type BannerVariant =
  | "info"
  | "success"
  | "warning"
  | "danger";

interface BannerProps {
  title?: string;
  description?: string;
  variant?: BannerVariant;
}

export default function Banner({
  title,
  description,
  variant = "info",
}: BannerProps) {
  return (
    <div className={`banner banner-${variant}`}>
    <div className="banner-icon">
      {variant === "info" && <InfoIcon />}
      {variant === "success" && <CheckIcon />}
      {variant === "warning" && <AlertTriangleIcon />}
      {variant === "danger" && <XIcon />}
    </div>

      <div className="banner-content">
        {title && (
          <h4 className="banner-title">
            {title}
          </h4>
        )}

        {description && (
          <p className="banner-description">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}