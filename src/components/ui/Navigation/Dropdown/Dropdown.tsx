import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useId,
} from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
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
  children: ReactNode;
  className?: string;
}

type DropdownComponent = React.FC<DropdownProps> & {
  Trigger: typeof DropdownTrigger;
  Content: typeof DropdownContent;
  Item: typeof DropdownItem;
  Label: typeof DropdownLabel;
  Separator: typeof DropdownSeparator;
};

const Dropdown = (({ children, className = "" }: DropdownProps) => {
  const [open, setOpen] = useState(false);

  const id = useId();
  const triggerId = `dd-trigger-${id}`;
  const menuId = `dd-menu-${id}`;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerId, menuId }}>
      <div className={`dropdown-root ${className}`}>{children}</div>
    </DropdownContext.Provider>
  );
}) as DropdownComponent;

interface DropdownTriggerProps {
  children: ReactNode;
  className?: string;
}

function DropdownTrigger({ children, className = "" }: DropdownTriggerProps) {
  const { open, setOpen, triggerId, menuId } = useContext(DropdownContext);

  return (
    <div
      id={triggerId}
      role="button"
      tabIndex={0}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={menuId}
      className={`dropdown-trigger ${className}`}
      onClick={() => setOpen(!open)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(!open);
        }
      }}
    >
      {children}
    </div>
  );
}

type DropdownAlign = "start" | "center" | "end";
type DropdownSide = "top" | "bottom";

interface DropdownContentProps {
  children: ReactNode;
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
  const { open, menuId, triggerId, setOpen } = useContext(DropdownContext);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }

    const trigger = document.getElementById(triggerId);
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();

    let left: number;
    if (align === "end") {
      left = rect.right;
    } else if (align === "center") {
      left = rect.left + rect.width / 2;
    } else {
      left = rect.left;
    }

    const top = side === "top" ? rect.top - 8 : rect.bottom + 8;

    setCoords({ top, left });
  }, [open, triggerId, align, side]);

  // Close on outside click via portal-aware handler
  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (e: MouseEvent) => {
      const trigger = document.getElementById(triggerId);
      const menu = menuRef.current;
      if (
        menu &&
        !menu.contains(e.target as Node) &&
        trigger &&
        !trigger.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open, triggerId, setOpen]);

  if (!open || !coords) return null;

  const transformMap: Record<DropdownAlign, string | undefined> = {
    start: undefined,
    center: "translateX(-50%)",
    end: "translateX(-100%)",
  };

  return createPortal(
    <div
      ref={menuRef}
      id={menuId}
      role="menu"
      aria-labelledby={triggerId}
      className={`dropdown-content dropdown-content--${align} dropdown-content--${side} ${className}`}
      style={{
        position: "fixed",
        top: side === "top" ? undefined : coords.top,
        bottom: side === "top" ? `calc(100vh - ${coords.top}px)` : undefined,
        left: coords.left,
        minWidth,
        transform: transformMap[align],
      }}
    >
      {children}
    </div>,
    document.body
  );
}

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
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
      {shortcut && <kbd className="dropdown-item-shortcut">{shortcut}</kbd>}
    </button>
  );
}

interface DropdownLabelProps {
  children: ReactNode;
  className?: string;
}

function DropdownLabel({ children, className = "" }: DropdownLabelProps) {
  return <div className={`dropdown-label ${className}`}>{children}</div>;
}

interface DropdownSeparatorProps {
  className?: string;
}

function DropdownSeparator({ className = "" }: DropdownSeparatorProps) {
  return <div role="separator" className={`dropdown-separator ${className}`} />;
}

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Item = DropdownItem;
Dropdown.Label = DropdownLabel;
Dropdown.Separator = DropdownSeparator;

export default Dropdown;