import "./Dropdown.css";

import {
  useEffect,
  useRef,
  useState,
} from "react";

interface DropdownItem {
  label: string;

  onClick?: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;

  items: DropdownItem[];
}

export default function Dropdown({
  trigger,
  items,
}: DropdownProps) {
  const [open, setOpen] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div
      className="dropdown"
      ref={dropdownRef}
    >
      <div
        className="dropdown-trigger"
        onClick={() =>
          setOpen(!open)
        }
      >
        {trigger}
      </div>

      {open && (
        <div className="dropdown-menu">
          {items.map((item) => (
            <button
              key={item.label}
              className="dropdown-item"
              onClick={() => {
                item.onClick?.();

                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}