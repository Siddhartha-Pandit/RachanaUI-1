# Nexus Design System — Complete AI Prompting Guide

> Copy and paste this entire document into any AI prompt to generate components that are 100% consistent with the Nexus design system.

---

## SYSTEM INSTRUCTION FOR AI

You are building UI components for the **Nexus SaaS Design System**. Every component you generate must follow ALL rules in this document exactly — colors, tokens, spacing, typography, icons, motion, accessibility, and dark mode. Do not invent new values. Do not use Tailwind unless explicitly told to. Use only the CSS custom properties defined below.

---

## 1. BRAND IDENTITY

| Property | Value |
|---|---|
| Primary Brand Color | `#2271E6` (blue) |
| Product Type | B2B SaaS |
| Design Language | Clean, functional, trustworthy, accessible |
| Tone | Professional, clear, direct — never playful or loud |
| Mode | Light and dark both required unless specified |

---

## 2. COLOR TOKENS

### Light Mode (`:root`)

```css
/* Brand */
--brand-400: #2271e6;        /* Primary buttons, links, focus rings, active states */
--brand-50:  #eef3fb;        /* Active sidebar bg, hover bg, subtle brand tint */

/* Semantic */
--success-400: #12b76a;      /* Success badges, positive metrics, checkmarks */
--success-50:  #eafbf3;      /* Success alert bg, badge bg */
--warning-400: #f79009;      /* Warning icons, at-risk progress bars */
--danger-400:  #d92d20;      /* Error states, delete buttons, danger alerts */

/* Neutral */
--neutral-700: #0f172a;      /* Headings, body text — primary text */
--neutral-400: #5b6475;      /* Captions, hints, labels — secondary text */
--neutral-200: #d9e2f0;      /* Card borders, dividers, input borders */
--neutral-50:  #f5f8fc;      /* Page background, table headers */
--neutral-0:   #ffffff;      /* Cards, modals, dropdowns — surfaces */
```

### Dark Mode (`[data-theme="dark"]`)

```css
--brand-400: #4d91ff;
--brand-50:  rgba(34, 113, 230, 0.15);
--success-400: #22d87a;
--success-50:  rgba(18, 183, 106, 0.15);
--warning-400: #fba530;
--danger-400:  #f04438;
--neutral-700: #f1f5f9;      /* Text becomes light */
--neutral-400: #94a3b8;
--neutral-200: #334155;      /* Borders become dark */
--neutral-50:  #1e293b;      /* Page bg */
--neutral-0:   #1e293b;      /* Surface */
```

### Color Usage Rules

- **Never** use raw hex values in components — always use the CSS variable.
- **Never** add extra brand colors not in this list.
- Interactive elements use `--brand-400` for their active/selected state.
- Destructive actions use `--danger-400`.
- Success confirmations use `--success-400`.
- Warnings and cautions use `--warning-400`.
- All text must use `--neutral-700` (primary) or `--neutral-400` (secondary).
- All surfaces use `--neutral-0`. Page backgrounds use `--neutral-50`.
- Borders always use `--neutral-200`.

---

## 3. TYPOGRAPHY

### Font Families

```css
--font-family-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
--font-family-mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
```

### Type Scale

| Class | Size | Weight | Line-height | Letter-spacing | Usage |
|---|---|---|---|---|---|
| `.display` | 36px | 500 | 1.1 | -1px | Hero headlines only |
| `.h1` | 28px | 500 | 1.2 | -0.5px | Page titles |
| `.h2` | 22px | 500 | 1.3 | -0.3px | Section headings |
| `.h3` | 18px | 500 | 1.4 | 0 | Card headings |
| `.h4` | 16px | 500 | 1.4 | 0 | Sub-section headings |
| `.body-lg` | 15px | 400 | 1.7 | 0 | Long-form prose |
| `.body` | 14px | 400 | 1.6 | 0 | Default body text |
| `.body-sm` | 13px | 400 | 1.5 | 0 | Secondary descriptions |
| `.caption` | 12px | 400 | 1.4 | 0 | Metadata, timestamps |
| `.label` | 11px | 500 | 1.2 | 0.6px | Uppercase tags, badges |
| `.mono` | 13px | 400 | 1.5 | 0 | Code, IDs, keys |

### Typography Rules

- **Only weights 400 and 500 are used.** Never 600, 700, or bold in UI components.
- `.label` is always `text-transform: uppercase`.
- `.mono` always uses `--font-family-mono`.
- Body text default is always `.body` (14px/400).
- Interactive labels (buttons, tabs, nav) use 14px/500.

---

## 4. SPACING TOKENS

```css
--sp-1:  4px;    /* Icon gap, inline badge padding */
--sp-2:  8px;    /* Button icon gap, badge padding */
--sp-3:  12px;   /* Input internal padding, tight card */
--sp-4:  16px;   /* Card padding, list item gap, form field gap */
--sp-6:  24px;   /* Section subheading gap, modal inner padding */
--sp-8:  32px;   /* Card-to-card gap, form group separation */
--sp-12: 48px;   /* Section-to-section, major vertical gaps */
--sp-16: 64px;   /* Page top padding, hero gap */
--sp-24: 96px;   /* Major section breaks */
```

### Spacing Rules

- **Never** use raw pixel values — always use `var(--sp-N)`.
- Buttons internal padding: `var(--sp-2)` vertical, `var(--sp-4)` horizontal (default).
- Form inputs internal padding: `var(--sp-3)` all sides.
- Cards: `var(--sp-4)` or `var(--sp-6)` padding.
- Component gap between label and input: `var(--sp-2)`.
- Gap between form fields: `var(--sp-4)`.
- Gap between form sections: `var(--sp-8)`.

---

## 5. BORDER RADIUS TOKENS

```css
--radius-xs:      2px;    /* xs — very tight chips */
--radius-sm:      4px;    /* sm — badges, tags */
--radius-sm-plus: 6px;    /* sm+ — small interactive chips */
--radius-md:      8px;    /* md — inputs, buttons (default) */
--radius-lg:      12px;   /* lg — dropdowns, popovers */
--radius-xl:      16px;   /* xl — cards (default) */
--radius-2xl:     24px;   /* 2xl — large containers, hero blocks */
--radius-full:    9999px; /* full — pills, avatar badges */
```

### Radius Rules

| Element | Radius Token |
|---|---|
| Buttons | `--radius-md` |
| Inputs, textareas, selects | `--radius-md` |
| Badges, tags, chips | `--radius-sm` or `--radius-full` |
| Dropdowns, popovers, tooltips | `--radius-lg` |
| Cards | `--radius-xl` |
| Modals, dialogs | `--radius-xl` |
| Avatars | `--radius-full` |
| Code blocks | `--radius-md` |

---

## 6. SHADOW / ELEVATION TOKENS

### Light Mode

```css
--shadow-none: none;
--shadow-sm:   0 1px 2px rgba(15, 23, 42, 0.06);
--shadow-md:   0 4px 8px rgba(15, 23, 42, 0.08);
--shadow-lg:   0 8px 24px rgba(15, 23, 42, 0.10);
--shadow-xl:   0 16px 48px rgba(15, 23, 42, 0.14);
```

### Dark Mode

```css
--shadow-sm:  0 0 0 1px rgba(255,255,255,0.03), 0 1px 2px rgba(0,0,0,0.18);
--shadow-md:  0 0 0 1px rgba(255,255,255,0.04), 0 4px 8px rgba(0,0,0,0.22);
--shadow-lg:  0 0 0 1px rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.28);
--shadow-xl:  0 0 0 1px rgba(255,255,255,0.06), 0 16px 48px rgba(0,0,0,0.36);
```

### Shadow Usage

| Elevation Level | Token | Use For |
|---|---|---|
| 0 — flat | `--shadow-none` | Page sections, table rows, flat layouts |
| 1 — raised | `--shadow-sm` | Cards, widgets, stat panels |
| 2 — floating | `--shadow-md` | Tooltips, hover cards, sticky headers |
| 3 — overlay | `--shadow-lg` | Dropdowns, popovers, toasts, side menus |
| 4 — dialog | `--shadow-xl` | Modals, dialogs, large floating surfaces |

---

## 7. MOTION TOKENS

### Duration

```css
--motion-fast: 100ms;   /* Hover states, tooltips, focus rings, icon swaps */
--motion-base: 150ms;   /* Button press, toggle, badge swap, border color */
--motion-slow: 250ms;   /* Page transitions, modals, sidebar open/close */
```

### Easing

```css
--ease-default:  ease;
--ease-out:      cubic-bezier(0, 0, 0.2, 1);         /* Entering screen */
--ease-in:       cubic-bezier(0.4, 0, 1, 1);          /* Leaving screen */
--ease-in-out:   cubic-bezier(0.4, 0, 0.2, 1);        /* Moving across screen */
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);   /* Playful — toggles, dropdowns */
```

### Named Animations

```css
--anim-fade-in:    fadeIn var(--motion-base) var(--ease-out);
--anim-slide-in:   slideIn var(--motion-slow) var(--ease-out);
--anim-fade-scale: fadeScale var(--motion-slow) var(--ease-out);
--anim-shimmer:    shimmer 1.5s linear infinite;
--anim-slide-up:   slideUp var(--motion-slow) var(--ease-out);
--anim-bounce-in:  bounceIn 400ms var(--ease-spring);
```

### Keyframes

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes fadeScale {
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes bounceIn {
  0%   { opacity: 0; transform: scale(0.92); }
  60%  { opacity: 1; transform: scale(1.03); }
  100% { transform: scale(1); }
}
```

### Motion Rules

- **Respect reduced motion.** Always include:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
    }
  }
  ```
- Hover transitions: `--motion-fast` with `--ease-out`.
- Enter animations: `--anim-fade-in` for content, `--anim-fade-scale` for modals/dropdowns.
- Exit: use `--ease-in` so elements leave quickly.

---

## 8. COMPONENT SPECIFICATIONS

### 8.1 Buttons

#### Anatomy
```
[icon?] [label] [trailing-icon?]
```

#### Sizes

| Size | Height | H-Padding | Font | Icon-size |
|---|---|---|---|---|
| xs | 24px | 8px | 12px/500 | 12px |
| sm | 32px | 12px | 13px/500 | 14px |
| md (default) | 36px | 16px | 14px/500 | 16px |
| lg | 40px | 20px | 15px/500 | 18px |
| xl | 48px | 24px | 15px/500 | 20px |

#### Variants

```css
/* Primary */
.btn-primary {
  background: var(--brand-400);
  color: #ffffff;
  border: 1px solid var(--brand-400);
  border-radius: var(--radius-md);
  transition: background var(--motion-base) var(--ease-out),
              box-shadow var(--motion-base) var(--ease-out);
}
.btn-primary:hover  { background: #1a5cc7; box-shadow: var(--shadow-sm); }
.btn-primary:active { background: #1550b2; transform: scale(0.98); }
.btn-primary:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(34,113,230,0.25); }
.btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

/* Secondary */
.btn-secondary {
  background: var(--neutral-0);
  color: var(--neutral-700);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-md);
}
.btn-secondary:hover  { background: var(--neutral-50); border-color: #b8c7de; }
.btn-secondary:active { background: #eaf0f8; }

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--neutral-700);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
}
.btn-ghost:hover  { background: var(--neutral-50); }
.btn-ghost:active { background: var(--neutral-200); }

/* Danger */
.btn-danger {
  background: var(--danger-400);
  color: #ffffff;
  border: 1px solid var(--danger-400);
  border-radius: var(--radius-md);
}
.btn-danger:hover { background: #b91c1c; }

/* Success */
.btn-success {
  background: var(--success-400);
  color: #ffffff;
  border: 1px solid var(--success-400);
}

/* Warning */
.btn-warning {
  background: var(--warning-400);
  color: #ffffff;
  border: 1px solid var(--warning-400);
}
```

#### Button Rules
- All buttons: `display: inline-flex; align-items: center; gap: var(--sp-2); font-weight: 500; cursor: pointer; white-space: nowrap;`
- Loading state: replace icon with spinning `LoadingIcon`, disable pointer events.
- Icon-only buttons: equal width/height (square), use `--radius-md`, use `title` or `aria-label`.
- Button groups: border-radius only on outer edges (`border-radius: 0` on interior buttons).

---

### 8.2 Form Inputs

#### Input Base

```css
.input {
  width: 100%;
  height: 36px;
  padding: 0 var(--sp-3);
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-700);
  background: var(--neutral-0);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color var(--motion-base) var(--ease-out),
              box-shadow var(--motion-base) var(--ease-out);
}
.input::placeholder { color: var(--neutral-400); }
.input:hover   { border-color: #b8c7de; }
.input:focus   { border-color: var(--brand-400); box-shadow: 0 0 0 3px rgba(34,113,230,0.12); }

/* States */
.input--error    { border-color: var(--danger-400); }
.input--error:focus { box-shadow: 0 0 0 3px rgba(217,45,32,0.12); }
.input--success  { border-color: var(--success-400); }
.input--disabled { background: var(--neutral-50); color: var(--neutral-400); cursor: not-allowed; opacity: 0.6; }
```

#### Input Sizes

| Size | Height | Font |
|---|---|---|
| sm | 28px | 13px |
| md (default) | 36px | 14px |
| lg | 40px | 15px |

#### Form Field Wrapper

```
[label]          ← 12px/500, color: --neutral-700, mb: --sp-2
[input/select]
[helper/error]   ← 12px/400, color: --neutral-400 (helper) or --danger-400 (error), mt: --sp-1
```

#### Textarea
- Same border/focus styles as input.
- Min-height: 80px. Resize: vertical only.
- Padding: `var(--sp-3)`.

#### Select
- Same height/border as input.
- Custom chevron: `ChevronDownIcon` at 16px in `--neutral-400`, positioned right `var(--sp-3)`.
- Appearance: none on native select.

#### Checkbox & Radio

```css
/* Base: 16x16, border-radius: 4px (checkbox) or 50% (radio) */
.checkbox {
  width: 16px; height: 16px;
  border: 1.5px solid var(--neutral-200);
  border-radius: var(--radius-sm);
  background: var(--neutral-0);
  appearance: none; cursor: pointer;
  transition: all var(--motion-base) var(--ease-out);
}
.checkbox:checked {
  background: var(--brand-400);
  border-color: var(--brand-400);
  /* checkmark via background SVG or ::after pseudo */
}
.checkbox:focus-visible { box-shadow: 0 0 0 3px rgba(34,113,230,0.18); }
```

#### Toggle / Switch

```css
/* Track: 36x20px, pill shape */
.toggle-track {
  width: 36px; height: 20px;
  border-radius: var(--radius-full);
  background: var(--neutral-200);
  transition: background var(--motion-base) var(--ease-spring);
}
.toggle-track.on { background: var(--brand-400); }

/* Thumb: 16x16, white circle, 2px inset */
.toggle-thumb {
  width: 16px; height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: var(--shadow-sm);
  transform: translateX(2px);
  transition: transform var(--motion-base) var(--ease-spring);
}
.toggle-track.on .toggle-thumb { transform: translateX(18px); }
```

---

### 8.3 Badges & Tags

```css
/* Base badge */
.badge {
  display: inline-flex; align-items: center; gap: var(--sp-1);
  padding: 2px var(--sp-2);
  font-size: 11px; font-weight: 500; line-height: 1.2;
  text-transform: uppercase; letter-spacing: 0.6px;
  border-radius: var(--radius-full);
}

/* Variants */
.badge-default  { background: var(--neutral-50);   color: var(--neutral-400); border: 1px solid var(--neutral-200); }
.badge-brand    { background: var(--brand-50);     color: var(--brand-400);   border: 1px solid rgba(34,113,230,0.2); }
.badge-success  { background: var(--success-50);   color: var(--success-400); border: 1px solid rgba(18,183,106,0.2); }
.badge-warning  { background: #fff8ec;             color: var(--warning-400); border: 1px solid rgba(247,144,9,0.2); }
.badge-danger   { background: #fef2f2;             color: var(--danger-400);  border: 1px solid rgba(217,45,32,0.2); }
```

---

### 8.4 Alerts / Banners

```
[icon 20px] [content: title + description] [close-button?]
```

```css
.alert {
  display: flex; align-items: flex-start; gap: var(--sp-3);
  padding: var(--sp-4);
  border-radius: var(--radius-lg);
  border-left: 3px solid;
  font-size: 14px;
  animation: var(--anim-fade-in);
}

.alert-info    { background: var(--brand-50);   border-color: var(--brand-400);   color: var(--neutral-700); }
.alert-success { background: var(--success-50); border-color: var(--success-400); color: var(--neutral-700); }
.alert-warning { background: #fff8ec;           border-color: var(--warning-400); color: var(--neutral-700); }
.alert-danger  { background: #fef2f2;           border-color: var(--danger-400);  color: var(--neutral-700); }
```

**Icon mapping:**
- `info` → `InfoIcon` in `--brand-400`
- `success` → `CheckCircleIcon` in `--success-400`
- `warning` → `AlertTriangleIcon` in `--warning-400`
- `danger` → `XCircleIcon` in `--danger-400`

---

### 8.5 Cards

```css
.card {
  background: var(--neutral-0);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: var(--sp-6);
  transition: box-shadow var(--motion-base) var(--ease-out);
}
.card:hover { box-shadow: var(--shadow-md); }

/* Stat card variant */
.card-stat {
  padding: var(--sp-4) var(--sp-6);
}
.card-stat .metric {
  font-size: 28px; font-weight: 500;
  color: var(--neutral-700); letter-spacing: -0.5px;
}
.card-stat .metric-label {
  font-size: 13px; color: var(--neutral-400);
}
.card-stat .trend-up   { color: var(--success-400); }
.card-stat .trend-down { color: var(--danger-400); }
```

---

### 8.6 Tables

```css
.table-wrapper {
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--neutral-0);
}
.table { width: 100%; border-collapse: collapse; }

/* Header */
.table thead th {
  background: var(--neutral-50);
  padding: var(--sp-3) var(--sp-4);
  font-size: 11px; font-weight: 500; text-transform: uppercase;
  letter-spacing: 0.6px; color: var(--neutral-400);
  border-bottom: 1px solid var(--neutral-200);
  text-align: left;
}

/* Row */
.table tbody td {
  padding: var(--sp-3) var(--sp-4);
  font-size: 14px; color: var(--neutral-700);
  border-bottom: 1px solid var(--neutral-200);
}
.table tbody tr:last-child td { border-bottom: none; }
.table tbody tr:hover td { background: var(--neutral-50); }

/* Selected row */
.table tbody tr.selected td { background: var(--brand-50); }
```

---

### 8.7 Navigation / Sidebar

```css
/* Sidebar nav item */
.nav-item {
  display: flex; align-items: center; gap: var(--sp-3);
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-md);
  font-size: 14px; font-weight: 400; color: var(--neutral-400);
  cursor: pointer;
  transition: all var(--motion-fast) var(--ease-out);
}
.nav-item:hover {
  background: var(--neutral-50);
  color: var(--neutral-700);
}
.nav-item.active {
  background: var(--brand-50);
  color: var(--brand-400);
  font-weight: 500;
}
.nav-item.active svg { color: var(--brand-400); }

/* Nav section label */
.nav-section-label {
  font-size: 11px; font-weight: 500; text-transform: uppercase;
  letter-spacing: 0.6px; color: var(--neutral-400);
  padding: var(--sp-2) var(--sp-3);
  margin-top: var(--sp-4);
}
```

---

### 8.8 Tabs

```css
/* Tab bar */
.tabs { display: flex; border-bottom: 1px solid var(--neutral-200); gap: 0; }

.tab {
  padding: var(--sp-2) var(--sp-4);
  font-size: 14px; font-weight: 400; color: var(--neutral-400);
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all var(--motion-fast) var(--ease-out);
  margin-bottom: -1px;
}
.tab:hover { color: var(--neutral-700); }
.tab.active {
  color: var(--brand-400);
  font-weight: 500;
  border-bottom-color: var(--brand-400);
}
```

---

### 8.9 Modals & Dialogs

```css
/* Backdrop */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1000;
  animation: var(--anim-fade-in);
}

/* Modal surface */
.modal {
  position: fixed; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: var(--neutral-0);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: var(--sp-6);
  z-index: 1001;
  min-width: 440px; max-width: 600px; width: 90vw;
  animation: var(--anim-fade-scale);
}

/* Modal header */
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: var(--sp-4);
}
.modal-title { font-size: 18px; font-weight: 500; color: var(--neutral-700); }

/* Modal footer */
.modal-footer {
  display: flex; align-items: center; justify-content: flex-end;
  gap: var(--sp-2); margin-top: var(--sp-6);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--neutral-200);
}
```

---

### 8.10 Dropdowns & Popovers

```css
.dropdown {
  background: var(--neutral-0);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--sp-1) 0;
  min-width: 180px;
  animation: var(--anim-fade-scale);
  z-index: 500;
}

.dropdown-item {
  display: flex; align-items: center; gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  font-size: 14px; color: var(--neutral-700);
  cursor: pointer;
  transition: background var(--motion-fast) var(--ease-out);
}
.dropdown-item:hover { background: var(--neutral-50); }
.dropdown-item.danger { color: var(--danger-400); }
.dropdown-item.danger:hover { background: #fef2f2; }

.dropdown-divider {
  height: 1px; background: var(--neutral-200);
  margin: var(--sp-1) 0;
}
.dropdown-section-label {
  font-size: 11px; font-weight: 500; text-transform: uppercase;
  letter-spacing: 0.6px; color: var(--neutral-400);
  padding: var(--sp-2) var(--sp-3) var(--sp-1);
}
```

---

### 8.11 Toasts / Notifications

```css
.toast {
  display: flex; align-items: center; gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  background: var(--neutral-700);
  color: #ffffff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  font-size: 14px; max-width: 380px;
  animation: var(--anim-slide-in);
}
/* Semantic toasts */
.toast-success { background: var(--success-400); }
.toast-warning { background: var(--warning-400); }
.toast-danger  { background: var(--danger-400);  }
```

Position: fixed, bottom-right, `bottom: var(--sp-6); right: var(--sp-6);`. Stack vertically with `gap: var(--sp-2)`.

---

### 8.12 Progress Bars

```css
.progress-track {
  width: 100%; height: 6px;
  background: var(--neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.progress-fill {
  height: 100%; border-radius: var(--radius-full);
  background: var(--brand-400);
  transition: width var(--motion-slow) var(--ease-out);
}
/* Semantic fills */
.progress-fill.success { background: var(--success-400); }
.progress-fill.warning { background: var(--warning-400); }
.progress-fill.danger  { background: var(--danger-400);  }

/* Sizes */
.progress-track.sm { height: 4px; }
.progress-track.lg { height: 8px; }
```

---

### 8.13 Skeleton Loaders

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--neutral-200) 25%,
    var(--neutral-50)  50%,
    var(--neutral-200) 75%
  );
  background-size: 400% 100%;
  border-radius: var(--radius-md);
  animation: shimmer 1.5s linear infinite;
}
```

---

### 8.14 Tooltips

```css
.tooltip {
  padding: var(--sp-1) var(--sp-2);
  background: var(--neutral-700);
  color: #ffffff;
  font-size: 12px; font-weight: 400;
  border-radius: var(--radius-sm-plus);
  box-shadow: var(--shadow-md);
  pointer-events: none;
  white-space: nowrap;
  max-width: 240px;
  animation: var(--anim-fade-in);
}
```

---

### 8.15 Empty States

```
[Icon 48px in --neutral-200]
[Title: h3 in --neutral-700]
[Description: body in --neutral-400]
[CTA button: primary or secondary]
```

Centered, `padding: var(--sp-12)`. Icon stroke uses `--neutral-200`, not `--neutral-400`.

---

## 9. ICON SYSTEM

### Icon Library: Rachana Icons (React)

Import from your icon file:

```tsx
import { HomeIcon, PlusIcon, SearchIcon } from '@/icons';
```

### IconProvider — Set Globals

```tsx
import { IconProvider } from '@/icons';

// Wrap app or section:
<IconProvider value={{ size: 'md', color: 'currentColor', strokeWidth: 2, variant: 'outline' }}>
  {children}
</IconProvider>
```

### Props Reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'xs'`\|`'sm'`\|`'md'`\|`'lg'`\|`'xl'`\|`'2xl'`\|`number` | `'md'` (20px) | Icon size |
| `color` | `string` | `'currentColor'` | Stroke/fill color |
| `secondaryColor` | `string` | same as `color` | Duotone secondary layer color |
| `strokeWidth` | `number` | `2` | Stroke weight (overrides `weight`) |
| `weight` | `'thin'`\|`'light'`\|`'regular'`\|`'bold'` | `'regular'` | Preset stroke weight |
| `variant` | `'outline'`\|`'filled'`\|`'duotone'` | `'outline'` | Visual style |
| `rotate` | `number` | — | Degrees rotation |
| `flipH` | `boolean` | — | Horizontal flip |
| `flipV` | `boolean` | — | Vertical flip |
| `spin` | `boolean` | — | Continuous spin animation |
| `pulse` | `boolean` | — | Opacity pulse animation |
| `label` | `string` | — | Accessible `aria-label` (adds `role="img"`) |
| `className` | `string` | — | Extra CSS class |

### Size Token Map

| Token | px |
|---|---|
| `xs` | 12 |
| `sm` | 16 |
| `md` | 20 |
| `lg` | 24 |
| `xl` | 32 |
| `2xl` | 48 |

### Weight → strokeWidth Map

| Token | strokeWidth |
|---|---|
| `thin` | 1 |
| `light` | 1.5 |
| `regular` | 2 |
| `bold` | 2.8 |

### Icon Usage in Context

```tsx
// Default — inherits color from parent text color
<PlusIcon size="md" />

// Explicit color
<CheckCircleIcon size="lg" color="var(--success-400)" />

// Button icon (always sm in default buttons, md in lg buttons)
<button className="btn-primary">
  <PlusIcon size="sm" />
  Add Item
</button>

// Semantic status icons
<CheckCircleIcon color="var(--success-400)" size="md" />
<AlertTriangleIcon color="var(--warning-400)" size="md" />
<XCircleIcon color="var(--danger-400)" size="md" />
<InfoIcon color="var(--brand-400)" size="md" />

// Loading spinner
<LoadingIcon size="sm" />   {/* spin is auto-applied */}

// Accessible icon (standalone, no label text)
<TrashIcon label="Delete item" size="md" />

// Duotone variant (decorative/illustration contexts)
<ShieldCheckIcon variant="duotone" color="var(--brand-400)" size="xl" />

// Filled variant (active states, selected toggles)
<StarIcon variant="filled" color="var(--warning-400)" size="md" />
```

### Icon Rules

- **Never** use images or emojis where icons exist.
- **Always** use `size="sm"` (16px) inside buttons and table cells.
- **Always** use `size="md"` (20px) in nav items, form labels, standalone contexts.
- **Always** use `size="lg"` (24px) in section headers and feature lists.
- **Always** use `size="xl"` (32px) or `size="2xl"` (48px) for empty states and illustrations.
- Icon color in nav item: `--neutral-400` default, `--brand-400` active.
- Icon color in danger context: `--danger-400`.
- Icons inside disabled elements: `opacity: 0.45`.
- Icons that require accessible labels (no visible text nearby): add `label` prop.
- For loading states: use `<LoadingIcon spin />`, never a custom spinner.
- For status: use semantic icons (`CheckCircleIcon`, `AlertTriangleIcon`, `XCircleIcon`, `InfoIcon`) with their matching semantic color.

### Icon Color in Components Quick Reference

| Context | Icon Color |
|---|---|
| Sidebar nav default | `--neutral-400` |
| Sidebar nav active | `--brand-400` |
| Button (primary) | `#ffffff` |
| Button (secondary/ghost) | `--neutral-700` |
| Input prefix/suffix | `--neutral-400` |
| Success state | `--success-400` |
| Warning state | `--warning-400` |
| Danger/error state | `--danger-400` |
| Info/brand state | `--brand-400` |
| Disabled | `--neutral-400` at 45% opacity |
| Table row action | `--neutral-400`, hover `--neutral-700` |

---

## 10. LAYOUT & STRUCTURE

### Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Topbar (60px height, border-bottom: --neutral-200) │
├──────────────┬──────────────────────────────────────┤
│  Sidebar     │  Main content area                   │
│  (240px)     │  padding: --sp-8                     │
│              │                                       │
│              │  Page header (title + actions)        │
│              │  ─────────────────────────────────── │
│              │  Content                              │
└──────────────┴──────────────────────────────────────┘
```

### Topbar
- Height: 60px
- Background: `--neutral-0`
- Border-bottom: 1px solid `--neutral-200`
- Shadow: `--shadow-sm`
- Padding: `0 var(--sp-6)`

### Sidebar
- Width: 240px (collapsed: 64px)
- Background: `--neutral-0`
- Border-right: 1px solid `--neutral-200`
- Padding: `var(--sp-4)`

### Main Content
- Padding: `var(--sp-8)`
- Max content width for forms/articles: 720px
- Max content width for dashboards: none (full width)

### Page Header
```
[title: h1]          [actions: button group]
[breadcrumb?]
─────────────────────────────────────────────
margin-bottom: --sp-6
```

### Grid System
- Use CSS grid or flexbox — no frameworks.
- Dashboard cards: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--sp-4);`
- Form layout (two-col): `grid-template-columns: 1fr 1fr; gap: var(--sp-4);`

---

## 11. FOCUS & ACCESSIBILITY RULES

- Every interactive element **must** have a visible focus ring.
- Standard focus ring:
  ```css
  :focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(34, 113, 230, 0.18);
  }
  ```
- Danger context focus ring:
  ```css
  box-shadow: 0 0 0 3px rgba(217, 45, 32, 0.18);
  ```
- Minimum contrast: text on `--neutral-50` must meet WCAG AA.
- `--neutral-700` on `--neutral-0` = 14.7:1 ✓
- `--neutral-400` on `--neutral-0` = 5.8:1 ✓
- `--brand-400` on white = 4.6:1 ✓ (AA for large text)
- Standalone icons must have `aria-label` or be `aria-hidden="true"` with adjacent text label.
- Color is **never** the only signal — always pair with icon, text, or pattern.

---

## 12. DARK MODE RULES

- Apply dark mode via `[data-theme="dark"]` on `<html>` or `<body>`.
- **Never** hardcode colors — always use CSS variables so dark mode works automatically.
- In dark mode, `--neutral-0` and `--neutral-50` are both `#1e293b` (surfaces merge).
- Shadows in dark mode add a 1px ring border to define elevation without relying on darkness.
- Never add `filter: brightness()` hacks — the token system handles it.
- Use `color-scheme: light dark` on `html` element.

---

## 13. INTERACTION STATES (ALL COMPONENTS)

Every interactive element must implement these states:

| State | CSS approach |
|---|---|
| `hover` | Lighter bg, or slightly darker border |
| `focus-visible` | Blue focus ring, `3px rgba(34,113,230,0.18)` |
| `active` / `pressed` | `transform: scale(0.98)`, slightly darker bg |
| `disabled` | `opacity: 0.45`, `cursor: not-allowed`, no events |
| `loading` | Replace icon with `<LoadingIcon spin />`, disable |
| `selected` / `active` | Brand color bg tint or brand color text |
| `error` | Danger color border/ring, `XCircleIcon` |
| `success` | Success color border/ring, `CheckCircleIcon` |

---

## 14. WRITING & COPY RULES

- **Sentence case** everywhere. Never Title Case on UI labels.
- Active voice: "Save changes" not "Submit form".
- Buttons describe the action: "Delete project", "Invite member", "Export CSV".
- Error messages describe the problem and fix: "Email already in use — try logging in instead."
- Empty states are invitations: "No projects yet — create your first one."
- Placeholders are examples, not instructions: `user@company.com` not `Enter your email`.
- Tooltips are short (< 10 words) and appear only on hover/focus.

---

## 15. COMPONENT CHECKLIST (for AI generation)

When generating any component, verify:

- [ ] All colors use CSS variables from section 2
- [ ] All spacing uses `--sp-N` tokens from section 4
- [ ] All border-radius uses `--radius-N` tokens from section 5
- [ ] All shadows use `--shadow-N` tokens from section 6
- [ ] All transitions use `--motion-N` + `--ease-N` tokens from section 7
- [ ] Icons use the Rachana icon system from section 9
- [ ] Dark mode works via `[data-theme="dark"]` without extra CSS
- [ ] Focus rings are present on all interactive elements
- [ ] Disabled state is implemented with `opacity: 0.45` + `cursor: not-allowed`
- [ ] Font weights are only 400 or 500
- [ ] No hardcoded hex values in component CSS
- [ ] Reduced motion is respected (`@media (prefers-reduced-motion: reduce)`)
- [ ] Copy is sentence case and action-oriented

---

## 16. QUICK REFERENCE: COLOR SEMANTICS

| Meaning | Color Token | Icon |
|---|---|---|
| Primary action | `--brand-400` | — |
| Brand hover bg | `--brand-50` | — |
| Success / positive | `--success-400` | `CheckCircleIcon` |
| Success bg | `--success-50` | — |
| Warning / caution | `--warning-400` | `AlertTriangleIcon` |
| Danger / destructive | `--danger-400` | `XCircleIcon` |
| Info / neutral | `--brand-400` | `InfoIcon` |
| Primary text | `--neutral-700` | — |
| Secondary text | `--neutral-400` | — |
| Border | `--neutral-200` | — |
| Page background | `--neutral-50` | — |
| Surface / card | `--neutral-0` | — |

---

## 17. FULL TOKEN CHEATSHEET

```css
/* Colors – Light */
--brand-400: #2271e6;    --brand-50: #eef3fb;
--success-400: #12b76a; --success-50: #eafbf3;
--warning-400: #f79009;
--danger-400: #d92d20;
--neutral-700: #0f172a; --neutral-400: #5b6475;
--neutral-200: #d9e2f0; --neutral-50: #f5f8fc; --neutral-0: #ffffff;

/* Spacing */
--sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px;
--sp-6:24px; --sp-8:32px; --sp-12:48px; --sp-16:64px; --sp-24:96px;

/* Radius */
--radius-xs:2px; --radius-sm:4px; --radius-sm-plus:6px; --radius-md:8px;
--radius-lg:12px; --radius-xl:16px; --radius-2xl:24px; --radius-full:9999px;

/* Shadows */
--shadow-none:none;
--shadow-sm:0 1px 2px rgba(15,23,42,0.06);
--shadow-md:0 4px 8px rgba(15,23,42,0.08);
--shadow-lg:0 8px 24px rgba(15,23,42,0.10);
--shadow-xl:0 16px 48px rgba(15,23,42,0.14);

/* Motion */
--motion-fast:100ms; --motion-base:150ms; --motion-slow:250ms;
--ease-out:cubic-bezier(0,0,0.2,1);
--ease-in:cubic-bezier(0.4,0,1,1);
--ease-in-out:cubic-bezier(0.4,0,0.2,1);
--ease-spring:cubic-bezier(0.34,1.56,0.64,1);
```

---

## 18. SAMPLE PROMPT TEMPLATE

Use this template when asking AI to build a specific component:

```
Build a [COMPONENT NAME] component following the Nexus Design System.

Requirements:
- [describe the component behavior]
- [list any specific states needed: hover, active, disabled, error, etc.]
- [specify if it needs dark mode]
- [mention icon names from Rachana icon system if known]

Rules:
- Use ONLY the CSS variables defined in the Nexus Design System guide
- Font weights: 400 or 500 only
- Import icons from the Rachana icon system
- Include focus rings on all interactive elements
- Include dark mode via [data-theme="dark"]
- Include reduced motion media query
- No Tailwind, no external CSS frameworks
- No hardcoded hex values
```

---

*Nexus Design System — Version 1.0 | Primary: #2271E6 | Success: #12b76a | Warning: #f79009 | Danger: #d92d20*