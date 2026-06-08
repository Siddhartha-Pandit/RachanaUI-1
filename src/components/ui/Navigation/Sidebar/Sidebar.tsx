import "./Sidebar.css";

import { useState } from "react";

interface SidebarItem {
  label: string;

  children?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];

  collapsed?: boolean;
}

export default function Sidebar({
  items,
  collapsed = false,
}: SidebarProps) {
  const [openGroups, setOpenGroups] =
    useState<string[]>([]);

  const toggleGroup = (
    label: string
  ) => {
    setOpenGroups((prev) =>
      prev.includes(label)
        ? prev.filter(
            (item) =>
              item !== label
          )
        : [...prev, label]
    );
  };

  return (
    <aside
      className={`sidebar ${
        collapsed
          ? "sidebar-collapsed"
          : ""
      }`}
    >
      <div className="sidebar-content">
        {items.map((item) => {
          const hasChildren =
            item.children &&
            item.children.length > 0;

          const isOpen =
            openGroups.includes(
              item.label
            );

          return (
            <div
              key={item.label}
              className="sidebar-group"
            >
              <button
                className="sidebar-item"
                onClick={() => {
                  if (hasChildren) {
                    toggleGroup(
                      item.label
                    );
                  }
                }}
              >
                <span>
                  {item.label}
                </span>

                {hasChildren && (
                  <span>
                    {isOpen
                      ? "−"
                      : "+"}
                  </span>
                )}
              </button>

              {hasChildren &&
                isOpen && (
                  <div className="sidebar-children">
                    {item.children?.map(
                      (
                        child
                      ) => (
                        <button
                          key={
                            child.label
                          }
                          className="sidebar-child"
                        >
                          {
                            child.label
                          }
                        </button>
                      )
                    )}
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}