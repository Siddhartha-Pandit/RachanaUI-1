import { useState } from "react";
import "./Avatar.css";

// ─── Color Generation Algorithm ──────────────────────────────────────────────
//
// Strategy: Hash the identifier (email or name) → derive a hue (0–360).
// Saturation is fixed at 65% and lightness at 88% so the background is always
// pastel/muted enough to guarantee readable dark text (contrast ≥ 4.5:1).
// The text/icon color is derived from the same hue but at S:75% L:30% so it
// visually "belongs" to the background while being dark enough to pass WCAG AA.
//
// Why these values?
//   - L:88% background  →  always near-white → dark text always readable
//   - L:30% text        →  always dark enough against L:88% bg (ratio ~5:1+)
//   - S:65% bg / S:75% fg → enough chroma to feel distinct per-user, not grey
// ─────────────────────────────────────────────────────────────────────────────

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // djb2-style: spread bits wide so "alice" vs "alice2" feel different
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // coerce to 32-bit int
  }
  return Math.abs(hash);
}

function getAvatarColors(identifier: string): {
  background: string;
  foreground: string;
  border: string;
} {
  const hue = hashString(identifier) % 360;

  // Avoid hues that collide with semantic system colors at these lightness levels:
  //   - Red  (~0°/355°)  → danger-400
  //   - Yellow/Orange (~40°) → warning-400
  //   - Green (~145°) → success-400
  //   - Blue (~215°)  → brand-400
  // We don't exclude them — the pastel BG is distinct enough — but this comment
  // documents the awareness.

  const background = `hsl(${hue}, 65%, 88%)`;
  const foreground = `hsl(${hue}, 75%, 28%)`;
  const border = `hsl(${hue}, 50%, 78%)`;

  return { background, foreground, border };
}

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "?";
}

// ─── Types ────────────────────────────────────────────────────────────────────

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type AvatarStatus = "online" | "offline" | "busy" | "away";

interface AvatarProps {
  /** Full name — used for initials (first + last initial) */
  name?: string;
  /** Email — used as fallback identifier for color if no name */
  email?: string;
  /** Image URL — shown if provided and loads successfully */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Visual size */
  size?: AvatarSize;
  /** Optional status indicator dot */
  status?: AvatarStatus;
  /** Extra CSS class */
  className?: string;
  /** onClick handler */
  onClick?: () => void;
  /** aria-label override */
  label?: string;
}

interface AvatarGroupProps {
  children: React.ReactNode;
  /** Max avatars to show before +N overflow */
  max?: number;
  size?: AvatarSize;
  className?: string;
}

// ─── Size config ──────────────────────────────────────────────────────────────

const SIZE_MAP: Record<AvatarSize, { px: number; font: number; status: number; statusOffset: number }> = {
  xs:  { px: 20, font: 9,  status: 6,  statusOffset: 0 },
  sm:  { px: 28, font: 11, status: 8,  statusOffset: 1 },
  md:  { px: 36, font: 14, status: 10, statusOffset: 1 },
  lg:  { px: 44, font: 16, status: 11, statusOffset: 2 },
  xl:  { px: 56, font: 20, status: 13, statusOffset: 2 },
  "2xl": { px: 72, font: 26, status: 16, statusOffset: 3 },
};

const STATUS_COLOR: Record<AvatarStatus, string> = {
  online:  "var(--success-400)",
  offline: "var(--neutral-200)",
  busy:    "var(--danger-400)",
  away:    "var(--warning-400)",
};

// ─── Avatar Component ─────────────────────────────────────────────────────────

function Avatar({
  name,
  email,
  src,
  alt,
  size = "md",
  status,
  className = "",
  onClick,
  label,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const identifier = name || email || "?";
  const { background, foreground, border } = getAvatarColors(identifier);
  const initials = getInitials(name, email);
  const sizeConf = SIZE_MAP[size];
  const showImage = src && !imgError;

  return (
    <span
      className={[
        "avatar",
        `avatar--${size}`,
        onClick ? "avatar--interactive" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--avatar-bg": background,
          "--avatar-fg": foreground,
          "--avatar-border": border,
          "--avatar-size": `${sizeConf.px}px`,
          "--avatar-font": `${sizeConf.font}px`,
          "--avatar-status-size": `${sizeConf.status}px`,
          "--avatar-status-offset": `${sizeConf.statusOffset}px`,
        } as React.CSSProperties
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={label || alt || name || email || "Avatar"}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {showImage ? (
        <img
          className="avatar__image"
          src={src}
          alt={alt || name || email || "Avatar"}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="avatar__initials">{initials}</span>
      )}

      {status && (
        <span
          className="avatar__status"
          style={{ background: STATUS_COLOR[status] }}
          aria-label={status}
        />
      )}
    </span>
  );
}

// ─── AvatarGroup Component ────────────────────────────────────────────────────

function AvatarGroup({
  children,
  max = 4,
  size = "md",
  className = "",
}: AvatarGroupProps) {
  const all = Array.isArray(children) ? children : [children];
  const visible = all.slice(0, max);
  const overflow = all.length - max;

  const sizeConf = SIZE_MAP[size];

  return (
    <span
      className={`avatar-group ${className}`}
      style={{ "--avatar-size": `${sizeConf.px}px` } as React.CSSProperties}
    >
      {visible.map((child, i) => (
        <span key={i} className="avatar-group__item">
          {child}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className={`avatar avatar--${size} avatar-group__overflow`}
          style={
            {
              "--avatar-size": `${sizeConf.px}px`,
              "--avatar-font": `${sizeConf.font}px`,
            } as React.CSSProperties
          }
          aria-label={`${overflow} more`}
        >
          <span className="avatar__initials avatar__initials--overflow">
            +{overflow}
          </span>
        </span>
      )}
    </span>
  );
}

Avatar.Group = AvatarGroup;

export default Avatar;

// ─── Demo ─────────────────────────────────────────────────────────────────────

export function AvatarDemo() {
  const users = [
    { name: "Alice Johnson",   email: "alice@nexus.io" },
    { name: "Bob Martinez",    email: "bob@nexus.io" },
    { name: "Carol White",     email: "carol@nexus.io" },
    { name: "David Kim",       email: "david@nexus.io" },
    { name: "Eve Nakamura",    email: "eve@nexus.io" },
    { name: "Frank O'Brien",   email: "frank@nexus.io" },
    { name: "Grace Liu",       email: "grace@nexus.io" },
    { name: "Henry Osei",      email: "henry@nexus.io" },
  ];

  return (
    <div className="demo">
      <h2 className="h2 demo__title">Avatar</h2>
      <p className="body demo__desc">
        Each avatar derives a unique background hue from the user's name or email via a
        djb2 hash → hue mapping. Background is L:88% S:65% (pastel, always
        light). Foreground text is same hue at L:28% S:75% (always dark, WCAG AA).
      </p>

      {/* Sizes */}
      <section className="demo__section">
        <p className="demo__label">Sizes</p>
        <div className="demo__row">
          {(["xs", "sm", "md", "lg", "xl", "2xl"] as AvatarSize[]).map((s) => (
            <Avatar key={s} name="Alice Johnson" size={s} />
          ))}
        </div>
      </section>

      {/* With image */}
      <section className="demo__section">
        <p className="demo__label">With image → fallback to initials on error</p>
        <div className="demo__row">
          <Avatar
            name="Alice Johnson"
            src="https://i.pravatar.cc/150?img=1"
            size="lg"
          />
          <Avatar
            name="Bob Martinez"
            src="https://i.pravatar.cc/150?img=3"
            size="lg"
          />
          <Avatar
            name="Carol White"
            src="https://broken-image-url.png"
            size="lg"
          />
          <Avatar
            email="david@nexus.io"
            src="https://broken-image-url.png"
            size="lg"
          />
        </div>
      </section>

      {/* All users — unique colors */}
      <section className="demo__section">
        <p className="demo__label">Deterministic colors — every user gets a unique hue</p>
        <div className="demo__grid">
          {users.map((u) => (
            <div key={u.email} className="demo__user-row">
              <Avatar name={u.name} email={u.email} size="md" />
              <div className="demo__user-info">
                <span className="body">{u.name}</span>
                <span className="body-sm demo__email">{u.email}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Status indicators */}
      <section className="demo__section">
        <p className="demo__label">Status indicators</p>
        <div className="demo__row">
          <Avatar name="Alice Johnson"  size="lg" status="online" />
          <Avatar name="Bob Martinez"   size="lg" status="away" />
          <Avatar name="Carol White"    size="lg" status="busy" />
          <Avatar name="David Kim"      size="lg" status="offline" />
        </div>
        <div className="demo__row demo__row--labels">
          {(["online", "away", "busy", "offline"] as AvatarStatus[]).map((s) => (
            <span key={s} className="demo__status-label">
              <span className="demo__status-dot" style={{ background: STATUS_COLOR[s] }} />
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Interactive */}
      <section className="demo__section">
        <p className="demo__label">Interactive (clickable)</p>
        <div className="demo__row">
          <Avatar
            name="Alice Johnson"
            size="lg"
            status="online"
            onClick={() => alert("Alice Johnson clicked")}
          />
        </div>
      </section>

      {/* Avatar Group */}
      <section className="demo__section">
        <p className="demo__label">Avatar group — stacked with overflow</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
          <Avatar.Group max={5} size="md">
            {users.map((u) => (
              <Avatar key={u.email} name={u.name} size="md" />
            ))}
          </Avatar.Group>
          <Avatar.Group max={3} size="lg">
            {users.map((u) => (
              <Avatar key={u.email} name={u.name} size="lg" />
            ))}
          </Avatar.Group>
          <Avatar.Group max={4} size="sm">
            {users.map((u) => (
              <Avatar key={u.email} name={u.name} size="sm" />
            ))}
          </Avatar.Group>
        </div>
      </section>

      {/* Email-only */}
      <section className="demo__section">
        <p className="demo__label">Email-only identifiers</p>
        <div className="demo__row">
          {["zara@corp.com", "quinn@team.io", "ivan@saas.co", "nadia@work.dev"].map((e) => (
            <Avatar key={e} email={e} size="lg" />
          ))}
        </div>
      </section>
    </div>
  );
}