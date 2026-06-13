import "./Sidebar.css";
import { useState } from "react";
import { ChevronRightIcon, SidebarOpenIcon, SidebarCloseIcon } from "../../Icons/Icons";
import type { IconProps } from "../../Icons/Icons";

export interface SidebarItem {
  label: string;
  icon?: React.FC<IconProps>;
  badge?: string | number;
  danger?: boolean;
  href?: string;
  active?: boolean;
  children?: SidebarItem[];
}

export interface SidebarSection {
  label?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  sections: SidebarSection[];
  footer?: SidebarItem[];
  defaultCollapsed?: boolean;
  activeItem?: string;
  onItemClick?: (label: string) => void;
}

function SidebarItemRow({
  item,
  collapsed,
  activeItem,
  onItemClick,
  depth = 0,
}: {
  item: SidebarItem;
  collapsed: boolean;
  activeItem?: string;
  onItemClick?: (label: string) => void;
  depth?: number;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.children?.length;
  const isActive = item.active || activeItem === item.label;
  const Icon = item.icon;

  return (
    <div className="sidebar-group">
      <button
        className={[
          "sidebar-item",
          isActive ? "sidebar-item-active" : "",
          item.danger ? "sidebar-item-danger" : "",
          depth > 0 ? "sidebar-item-child" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={depth > 0 ? { paddingLeft: `${16 + depth * 12}px` } : undefined}
        onClick={() => {
          if (hasChildren) setOpen((v) => !v);
          onItemClick?.(item.label);
        }}
        title={collapsed ? item.label : undefined}
      >
        {Icon && (
          <span className="sidebar-item-icon">
            <Icon size={18} />
          </span>
        )}

        {!collapsed && (
          <>
            <span className="sidebar-item-label">{item.label}</span>
            <span className="sidebar-item-end">
              {item.badge !== undefined && (
                <span className="sidebar-badge">{item.badge}</span>
              )}
              {hasChildren && (
                <span className={`sidebar-chevron${open ? " sidebar-chevron-open" : ""}`}>
                  <ChevronRightIcon size={14} />
                </span>
              )}
            </span>
          </>
        )}
      </button>

      {hasChildren && open && !collapsed && (
        <div className="sidebar-children">
          {item.children!.map((child) => (
            <SidebarItemRow
              key={child.label}
              item={child}
              collapsed={collapsed}
              activeItem={activeItem}
              onItemClick={onItemClick}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({
  sections,
  footer,
  defaultCollapsed = false,
  activeItem,
  onItemClick,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <aside className={`sidebar${collapsed ? " sidebar-collapsed" : ""}`}>
      <div className="sidebar-header">
        {!collapsed && <span className="sidebar-logo">Nexus</span>}
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <SidebarOpenIcon size={18} /> : <SidebarCloseIcon size={18} />}
        </button>
      </div>

      <div className="sidebar-content">
        {sections.map((section, i) => (
          <div key={i} className="sidebar-section">
            {section.label && !collapsed && (
              <span className="sidebar-section-label">{section.label}</span>
            )}
            {section.items.map((item) => (
              <SidebarItemRow
                key={item.label}
                item={item}
                collapsed={collapsed}
                activeItem={activeItem}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        ))}

        {footer?.length && (
          <>
            <div className="sidebar-divider" />
            <div className="sidebar-section">
              {footer.map((item) => (
                <SidebarItemRow
                  key={item.label}
                  item={item}
                  collapsed={collapsed}
                  activeItem={activeItem}
                  onItemClick={onItemClick}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}