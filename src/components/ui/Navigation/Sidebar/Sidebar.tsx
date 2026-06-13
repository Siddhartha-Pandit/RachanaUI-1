import "./Sidebar.css";
import { useState, createContext, useContext } from "react";
import type { ReactNode, FC } from "react";
import { ChevronRightIcon, SidebarOpenIcon, SidebarCloseIcon } from "../../Icons/Icons";
import type { IconProps } from "../../Icons/Icons";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
export interface SidebarItem {
  label: string;
  icon?: FC<IconProps>;
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

/* ─────────────────────────────────────────────
   CONTEXT
───────────────────────────────────────────── */
interface SidebarContextValue {
  collapsed: boolean;
  activeItem?: string;
  onItemClick?: (label: string) => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
});

const useSidebar = () => useContext(SidebarContext);

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export interface SidebarProps {
  children: ReactNode;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  activeItem?: string;
  onItemClick?: (label: string) => void;
  className?: string;
}

function SidebarRoot({
  children,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  activeItem,
  onItemClick,
  className = "",
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

  const collapsed = controlledCollapsed ?? internalCollapsed;

  const setCollapsed = (v: boolean) => {
    setInternalCollapsed(v);
    onCollapsedChange?.(v);
  };

  return (
    <SidebarContext.Provider value={{ collapsed, activeItem, onItemClick }}>
      <aside className={`sidebar${collapsed ? " sidebar-collapsed" : ""} ${className}`}>
        {children}
      </aside>
    </SidebarContext.Provider>
  );
}

/* ─────────────────────────────────────────────
   HEADER
───────────────────────────────────────────── */
function SidebarHeader({ children }: { children?: ReactNode }) {
  return (
    <div className="sidebar-header">
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   BRAND / LOGO
───────────────────────────────────────────── */
function SidebarBrand({ children }: { children?: ReactNode }) {
  const { collapsed } = useSidebar();
  if (collapsed) return null;
  return <span className="sidebar-logo">{children}</span>;
}

/* ─────────────────────────────────────────────
   TRIGGER (collapse toggle)
───────────────────────────────────────────── */
interface SidebarTriggerProps {
  onClick?: () => void;
}

function SidebarTrigger({ onClick }: SidebarTriggerProps) {
  const { collapsed } = useSidebar();
  return (
    <button
      className="sidebar-toggle"
      onClick={onClick}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed
        ? <SidebarOpenIcon size={18} />
        : <SidebarCloseIcon size={18} />
      }
    </button>
  );
}

/* ─────────────────────────────────────────────
   CONTENT (scrollable area)
───────────────────────────────────────────── */
function SidebarContent({ children }: { children: ReactNode }) {
  return <div className="sidebar-content">{children}</div>;
}

/* ─────────────────────────────────────────────
   GROUP (section with optional label)
───────────────────────────────────────────── */
interface SidebarGroupProps {
  label?: string;
  children: ReactNode;
}

function SidebarGroup({ label, children }: SidebarGroupProps) {
  const { collapsed } = useSidebar();
  return (
    <div className="sidebar-section">
      {label && !collapsed && (
        <span className="sidebar-section-label">{label}</span>
      )}
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SEPARATOR
───────────────────────────────────────────── */
function SidebarSeparator() {
  return <div className="sidebar-divider" />;
}

/* ─────────────────────────────────────────────
   MENU (wrapper for items)
───────────────────────────────────────────── */
function SidebarMenu({ children }: { children: ReactNode }) {
  return <div className="sidebar-menu">{children}</div>;
}

/* ─────────────────────────────────────────────
   MENU ITEM
───────────────────────────────────────────── */
interface SidebarMenuItemProps {
  label: string;
  icon?: FC<IconProps>;
  badge?: string | number;
  danger?: boolean;
  active?: boolean;
  depth?: number;
  children?: ReactNode;
  onClick?: () => void;
}

function SidebarMenuItem({
  label,
  icon: Icon,
  badge,
  danger,
  active: activeProp,
  depth = 0,
  children,
  onClick,
}: SidebarMenuItemProps) {
  const { collapsed, activeItem, onItemClick } = useSidebar();
  const [open, setOpen] = useState(false);
  const hasChildren = !!children;
  const isActive = activeProp || activeItem === label;

  const handleClick = () => {
    if (hasChildren) setOpen((v) => !v);
    onClick?.();
    onItemClick?.(label);
  };

  return (
    <div className="sidebar-group">
      <button
        className={[
          "sidebar-item",
          isActive ? "sidebar-item-active" : "",
          danger ? "sidebar-item-danger" : "",
          depth > 0 ? "sidebar-item-child" : "",
        ].filter(Boolean).join(" ")}
        style={depth > 0 ? { paddingLeft: `${16 + depth * 12}px` } : undefined}
        onClick={handleClick}
        title={collapsed ? label : undefined}
      >
        {Icon && (
          <span className="sidebar-item-icon">
            <Icon size={18} />
          </span>
        )}

        {!collapsed && (
          <>
            <span className="sidebar-item-label">{label}</span>
            <span className="sidebar-item-end">
              {badge !== undefined && (
                <span className="sidebar-badge">{badge}</span>
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
          {children}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MENU SUB ITEM
───────────────────────────────────────────── */
interface SidebarMenuSubItemProps {
  label: string;
  icon?: FC<IconProps>;
  badge?: string | number;
  active?: boolean;
  depth?: number;
  onClick?: () => void;
}

function SidebarMenuSubItem(props: SidebarMenuSubItemProps) {
  return <SidebarMenuItem {...props} depth={(props.depth ?? 0) + 1} />;
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function SidebarFooter({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="sidebar-divider" />
      <div className="sidebar-section sidebar-footer">
        {children}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   LEGACY ADAPTER — accepts sections + footer props
   so existing usage keeps working unchanged
───────────────────────────────────────────── */
interface SidebarAdapterProps {
  sections: SidebarSection[];
  footer?: SidebarItem[];
  defaultCollapsed?: boolean;
  activeItem?: string;
  onItemClick?: (label: string) => void;
}

function SidebarAdapter({
  sections,
  footer,
  defaultCollapsed,
  activeItem,
  onItemClick,
}: SidebarAdapterProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed ?? false);

  return (
    <Sidebar
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      activeItem={activeItem}
      onItemClick={onItemClick}
    >
      <Sidebar.Header>
        <Sidebar.Brand>Nexus</Sidebar.Brand>
        <Sidebar.Trigger onClick={() => setCollapsed((v) => !v)} />
      </Sidebar.Header>

      <Sidebar.Content>
        {sections.map((section, i) => (
          <Sidebar.Group key={i} label={section.label}>
            <Sidebar.Menu>
              {section.items.map((item) => (
                <Sidebar.MenuItem
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  badge={item.badge}
                  danger={item.danger}
                  active={item.active}
                >
                  {item.children?.map((child) => (
                    <Sidebar.MenuSubItem
                      key={child.label}
                      label={child.label}
                      icon={child.icon}
                      badge={child.badge}
                      active={child.active}
                    />
                  ))}
                </Sidebar.MenuItem>
              ))}
            </Sidebar.Menu>
          </Sidebar.Group>
        ))}

        {footer?.length && (
          <Sidebar.Footer>
            <Sidebar.Menu>
              {footer.map((item) => (
                <Sidebar.MenuItem
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  badge={item.badge}
                  danger={item.danger}
                  active={item.active}
                />
              ))}
            </Sidebar.Menu>
          </Sidebar.Footer>
        )}
      </Sidebar.Content>
    </Sidebar>
  );
}

/* ─────────────────────────────────────────────
   COMPOUND EXPORT
───────────────────────────────────────────── */
export const Sidebar = Object.assign(SidebarRoot, {
  Header: SidebarHeader,
  Brand: SidebarBrand,
  Trigger: SidebarTrigger,
  Content: SidebarContent,
  Group: SidebarGroup,
  Separator: SidebarSeparator,
  Menu: SidebarMenu,
  MenuItem: SidebarMenuItem,
  MenuSubItem: SidebarMenuSubItem,
  Footer: SidebarFooter,
});

export { SidebarAdapter };
export default SidebarAdapter;