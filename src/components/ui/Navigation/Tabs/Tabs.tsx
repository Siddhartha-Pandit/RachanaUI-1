import "./Tabs.css";

interface Tab {
  label: string;

  badge?: string;

  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];

  activeTab: string;

  onChange: (
    value: string
  ) => void;

  variant?:
    | "default"
    | "pills"
    | "underline";
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,

  variant = "default",
}: TabsProps) {
  return (
    <div
      className={`tabs tabs-${variant}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.label}
          disabled={tab.disabled}
          className={`
            tab
            ${
              activeTab ===
              tab.label
                ? "tab-active"
                : ""
            }
            ${
              tab.disabled
                ? "tab-disabled"
                : ""
            }
          `}
          onClick={() =>
            !tab.disabled &&
            onChange(tab.label)
          }
        >
          <span className="tab-label">
            {tab.label}
          </span>

          {tab.badge && (
            <span className="tab-badge">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}