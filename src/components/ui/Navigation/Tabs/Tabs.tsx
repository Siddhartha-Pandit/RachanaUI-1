import { createContext, useContext, useState } from "react";

interface TabsContextValue {
  value: string;
  onValueChange: (v: string) => void;
  variant: "default" | "underline" | "pills";
}

const TabsContext = createContext<TabsContextValue>({
  value: "",
  onValueChange: () => { },
  variant: "underline",
});

interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "default" | "underline" | "pills";
  children: React.ReactNode;
  className?: string;
}

function Tabs({
  value,
  defaultValue = "",
  onValueChange,
  variant = "underline",
  children,
  className = "",
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;
  const active = controlled ? value : internal;

  const handleChange = (v: string) => {
    if (!controlled) setInternal(v);
    onValueChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ value: active, onValueChange: handleChange, variant }}>
      <div className={`tabs-root ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

function TabsList({ children, className = "" }: TabsListProps) {
  const { variant } = useContext(TabsContext);
  return (
    <div
      role="tablist"
      className={`tabs-list tabs-list--${variant} ${className}`}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
  className?: string;
}

function TabsTrigger({
  value,
  children,
  disabled = false,
  badge,
  className = "",
}: TabsTriggerProps) {
  const { value: active, onValueChange, variant } = useContext(TabsContext);
  const isActive = active === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => !disabled && onValueChange(value)}
      className={[
        "tabs-trigger",
        `tabs-trigger--${variant}`,
        isActive ? "tabs-trigger--active" : "",
        disabled ? "tabs-trigger--disabled" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span>{children}</span>
      {badge !== undefined && (
        <span className="tabs-badge">{badge}</span>
      )}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

function TabsContent({ value, children, className = "" }: TabsContentProps) {
  const { value: active } = useContext(TabsContext);
  if (active !== value) return null;
  return (
    <div
      role="tabpanel"
      className={`tabs-content ${className}`}
    >
      {children}
    </div>
  );
}

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export default Tabs;