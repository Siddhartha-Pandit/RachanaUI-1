import "./Toast.css";

import { useEffect, useState } from "react";

type ToastVariant =
  | "info"
  | "success"
  | "warning"
  | "danger";

type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

interface ToastProps {
  title?: string;

  description?: string;

  variant?: ToastVariant;

  position?: ToastPosition;

  open?: boolean;

  duration?: number;

  closable?: boolean;

  onClose?: () => void;
}

export default function Toast({
  title,
  description,

  variant = "info",

  position = "top-right",

  open = true,

  duration = 4000,

  closable = true,

  onClose,
}: ToastProps) {
  const [visible, setVisible] =
    useState(open);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration]);

  const handleClose = () => {
    setVisible(false);

    onClose?.();
  };

  if (!visible) return null;

  return (
    <div
      className={`toast-container toast-${position}`}
    >
      <div className={`toast toast-${variant}`}>
        <div className="toast-icon">
          {variant === "info" && "i"}

          {variant === "success" && "✓"}

          {variant === "warning" && "!"}

          {variant === "danger" && "×"}
        </div>

        <div className="toast-content">
          {title && (
            <h4 className="toast-title">
              {title}
            </h4>
          )}

          {description && (
            <p className="toast-description">
              {description}
            </p>
          )}
        </div>

        {closable && (
          <button
            className="toast-close"
            onClick={handleClose}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}