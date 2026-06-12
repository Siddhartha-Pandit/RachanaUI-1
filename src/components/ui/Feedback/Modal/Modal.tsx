import "./Modal.css";
import Button from "../../Buttons/Button";
import { XIcon } from "../../Icons/Icons";

interface ModalProps {
  open?: boolean;

  title?: string;

  description?: string;

  children?: React.ReactNode;

  onClose?: () => void;
}

export default function Modal({
  open,
  title,
  description,
  children,
  onClose,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            {title && (
              <h3 className="modal-title">
                {title}
              </h3>
            )}

            {description && (
              <p className="modal-description">
                {description}
              </p>
            )}
          </div>

          <Button
            className="modal-close"
            onClick={onClose}
            style={{ color: "var(--neutral-700)" }} variant="ghost">
            <XIcon size="sm" />
          </Button>
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}