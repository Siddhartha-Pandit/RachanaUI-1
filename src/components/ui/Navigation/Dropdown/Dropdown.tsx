import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useId,
} from "react";
import "./Dropdown.css";

interface DropdownContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerId: string;
  menuId: string;
}

const DropdownContext = createContext<DropdownContextValue>({
  open: false,
  setOpen: () => { },
  triggerId: "",
  menuId: "",
});

interface DropdownProps {
  children: React.ReactNode;
  className?: string;
}

function Dropdown({ children, className = "" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const triggerId = `dd-trigger-${id}`;
  const menuId = `dd-menu-${id}`;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerId, menuId }}>
      <div ref={ref} className={`dropdown-root ${className}`}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

interface DropdownTriggerProps {
  children: React.ReactNode;
  className?: string;
}

function DropdownTrigger({
  children,
  className = "",
}: DropdownTriggerProps) {
  const { open, setOpen, triggerId, menuId } = useContext(DropdownContext);

  return (
    <button
      id={triggerId}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={menuId}
      className={`dropdown-trigger ${className}`}
      onClick={() => setOpen(!open)}
    >
      {children}
    </button>
  );
}

type DropdownAlign = "start" | "center" | "end";
type DropdownSide = "top" | "bottom";

interface DropdownContentProps {
  children: React.ReactNode;
  align?: DropdownAlign;
  side?: DropdownSide;
  className?: string;
  minWidth?: number;
}

function DropdownContent({
  children,
  align = "start",
  side = "bottom",
  className = "",
  minWidth = 200,
}: DropdownContentProps) {
  const { open, menuId, triggerId } = useContext(DropdownContext);

  if (!open) return null;

  return (
    <div
      id={menuId}
      role="menu"
      aria-labelledby={triggerId}
      className={`dropdown-content dropdown-content--${align} dropdown-content--${side} ${className}`}
      style={{ minWidth }}
    >
      {children}
    </div>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  shortcut?: string;
  variant?: "default" | "danger";
  disabled?: boolean;
  className?: string;
}

function DropdownItem({
  children,
  onClick,
  icon,
  shortcut,
  variant = "default",
  disabled = false,
  className = "",
}: DropdownItemProps) {
  const { setOpen } = useContext(DropdownContext);

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    setOpen(false);
  };

  return (
    <button
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      className={[
        "dropdown-item",
        `dropdown-item--${variant}`,
        disabled ? "dropdown-item--disabled" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && (
        <span className="dropdown-item-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="dropdown-item-label">{children}</span>
      {shortcut && (
        <kbd className="dropdown-item-shortcut">{shortcut}</kbd>
      )}
    </button>
  );
}

interface DropdownLabelProps {
  children: React.ReactNode;
  className?: string;
}

function DropdownLabel({ children, className = "" }: DropdownLabelProps) {
  return (
    <div className={`dropdown-label ${className}`}>{children}</div>
  );
}

interface DropdownSeparatorProps {
  className?: string;
}

function DropdownSeparator({ className = "" }: DropdownSeparatorProps) {
  return (
    <div role="separator" className={`dropdown-separator ${className}`} />
  );
}

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Item = DropdownItem;
Dropdown.Label = DropdownLabel;
Dropdown.Separator = DropdownSeparator;

export default Dropdown;