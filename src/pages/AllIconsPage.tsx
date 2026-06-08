import React, { useState } from "react";
import * as Icons from "../components/ui/Icons/Icons";

interface AllIconsPageProps {
  onBack: () => void;
}

const AllIconsPage: React.FC<AllIconsPageProps> = ({ onBack }) => {
  const [iconSize, setIconSize] = useState<Icons.IconSize>("lg");
  const [iconWeight, setIconWeight] = useState<Icons.IconWeight>("regular");
  const [iconVariant, setIconVariant] = useState<Icons.IconVariant>("outline");
  const [iconColor, setIconColor] = useState("var(--brand-400)");
  const [secondaryColor, setSecondaryColor] = useState("var(--success-400)");
  const [iconSpin, setIconSpin] = useState(false);
  const [iconPulse, setIconPulse] = useState(false);
  const [iconRotate, setIconRotate] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  return (
    <main
      style={{
        padding: "var(--sp-12)",
        background: "var(--neutral-50)",
        minHeight: "100vh",
        color: "var(--neutral-700)",
      }}
    >
      <button
        onClick={onBack}
        style={{
          marginBottom: "var(--sp-4)",
          padding: "var(--sp-2) var(--sp-4)",
          border: "1px solid var(--neutral-200)",
          borderRadius: "var(--radius-md)",
          background: "var(--neutral-0)",
          cursor: "pointer",
        }}
      >
        ← Back to Icon Playground
      </button>
      {/* Controls identical to App playground */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--sp-4)", marginBottom: "var(--sp-6)" }}>
        <div>
          <label className="label mb-2" style={{ display: "block" }}>Variant</label>
          <select
            value={iconVariant}
            onChange={(e) => setIconVariant(e.target.value as Icons.IconVariant)}
            style={{ width: "100%", padding: "var(--sp-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--neutral-200)", background: "var(--neutral-0)", color: "inherit" }}
          >
            <option value="outline">Outline</option>
            <option value="filled">Filled</option>
            <option value="duotone">Duotone</option>
          </select>
        </div>
        <div>
          <label className="label mb-2" style={{ display: "block" }}>Weight</label>
          <select
            value={iconWeight}
            onChange={(e) => setIconWeight(e.target.value as Icons.IconWeight)}
            style={{ width: "100%", padding: "var(--sp-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--neutral-200)", background: "var(--neutral-0)", color: "inherit" }}
          >
            <option value="thin">Thin</option>
            <option value="light">Light</option>
            <option value="regular">Regular</option>
            <option value="bold">Bold</option>
          </select>
        </div>
        <div>
          <label className="label mb-2" style={{ display: "block" }}>Size</label>
          <select
            value={iconSize}
            onChange={(e) => setIconSize(e.target.value as Icons.IconSize)}
            style={{ width: "100%", padding: "var(--sp-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--neutral-200)", background: "var(--neutral-0)", color: "inherit" }}
          >
            <option value="xs">XS (12px)</option>
            <option value="sm">SM (16px)</option>
            <option value="md">MD (20px)</option>
            <option value="lg">LG (24px)</option>
            <option value="xl">XL (32px)</option>
            <option value="2xl">2XL (48px)</option>
          </select>
        </div>
        <div>
          <label className="label mb-2" style={{ display: "block" }}>Primary Color</label>
          <select
            value={iconColor}
            onChange={(e) => setIconColor(e.target.value)}
            style={{ width: "100%", padding: "var(--sp-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--neutral-200)", background: "var(--neutral-0)", color: "inherit" }}
          >
            <option value="var(--brand-400)">Brand Blue</option>
            <option value="var(--success-400)">Success Green</option>
            <option value="var(--warning-400)">Warning Orange</option>
            <option value="var(--danger-400)">Danger Red</option>
            <option value="var(--neutral-700)">Neutral Text</option>
          </select>
        </div>
        {iconVariant === "duotone" && (
          <div>
            <label className="label mb-2" style={{ display: "block" }}>Secondary Color</label>
            <select
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              style={{ width: "100%", padding: "var(--sp-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--neutral-200)", background: "var(--neutral-0)", color: "inherit" }}
            >
              <option value="var(--brand-400)">Brand Blue</option>
              <option value="var(--success-400)">Success Green</option>
              <option value="var(--warning-400)">Warning Orange</option>
              <option value="var(--danger-400)">Danger Red</option>
              <option value="var(--neutral-400)">Muted Gray</option>
            </select>
          </div>
        )}
        <div>
          <label className="label mb-2" style={{ display: "block" }}>Rotation</label>
          <select
            value={iconRotate}
            onChange={(e) => setIconRotate(Number(e.target.value))}
            style={{ width: "100%", padding: "var(--sp-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--neutral-200)", background: "var(--neutral-0)", color: "inherit" }}
          >
            <option value={0}>0°</option>
            <option value={90}>90°</option>
            <option value={180}>180°</option>
            <option value={270}>270°</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "var(--sp-4)", flexWrap: "wrap", marginBottom: "var(--sp-6)" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", cursor: "pointer" }}>
            <input type="checkbox" checked={iconSpin} onChange={(e) => setIconSpin(e.target.checked)} />
            <span className="body-sm">Spin</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", cursor: "pointer" }}>
            <input type="checkbox" checked={iconPulse} onChange={(e) => setIconPulse(e.target.checked)} />
            <span className="body-sm">Pulse</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", cursor: "pointer" }}>
            <input type="checkbox" checked={flipH} onChange={(e) => setFlipH(e.target.checked)} />
            <span className="body-sm">Flip H</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", cursor: "pointer" }}>
            <input type="checkbox" checked={flipV} onChange={(e) => setFlipV(e.target.checked)} />
            <span className="body-sm">Flip V</span>
          </label>
        </div>
      </div>
      {/* Icon Gallery */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
          gap: "var(--sp-3)",
          maxHeight: "380px",
          overflowY: "auto",
          padding: "var(--sp-2)",
          border: "1px solid var(--neutral-200)",
          borderRadius: "var(--radius-md)",
          background: "var(--neutral-50)",
        }}
      >
        {Object.keys(Icons.icons).map((key) => {
          const Comp = (Icons.icons as any)[key];
          return (
            <div
              key={key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "var(--sp-3)",
                background: "var(--neutral-0)",
                border: "1px solid var(--neutral-200)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-sm)",
                textAlign: "center",
              }}
            >
              <Comp
                size={iconSize}
                weight={iconWeight}
                variant={iconVariant}
                color={iconColor}
                secondaryColor={secondaryColor}
                spin={iconSpin}
                pulse={iconPulse}
                rotate={iconRotate}
                flipH={flipH}
                flipV={flipV}
              />
              <span style={{ fontSize: "10px", marginTop: "var(--sp-2)", color: "var(--neutral-400)", wordBreak: "break-all" }}>
                {key.replace("Icon", "")}
              </span>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default AllIconsPage;
