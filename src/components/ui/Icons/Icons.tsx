import React, { createContext, useContext } from 'react';
import type { CSSProperties, SVGProps } from 'react';

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
export type IconWeight = 'thin' | 'light' | 'regular' | 'bold';
export type IconVariant = 'outline' | 'filled' | 'duotone';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'size' | 'width' | 'height'> {
  size?: IconSize;
  color?: string;
  secondaryColor?: string;
  strokeWidth?: number;
  weight?: IconWeight;
  variant?: IconVariant;
  rotate?: number;
  flipH?: boolean;
  flipV?: boolean;
  spin?: boolean;
  pulse?: boolean;
  className?: string;
  style?: CSSProperties;
  label?: string;
}

export interface IconContextValue {
  size?: IconSize;
  color?: string;
  secondaryColor?: string;
  strokeWidth?: number;
  weight?: IconWeight;
  variant?: IconVariant;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*                                ICON CONTEXT                                */
/* -------------------------------------------------------------------------- */

const defaultContext: IconContextValue = {
  size: 'md',
  color: 'currentColor',
  strokeWidth: 2,
  weight: 'regular',
  variant: 'outline',
};

export const IconContext = createContext<IconContextValue>(defaultContext);

export const IconProvider: React.FC<{ children: React.ReactNode; value?: IconContextValue }> = ({
  children,
  value = {},
}) => (
  <IconContext.Provider value={{ ...defaultContext, ...value }}>
    {children}
  </IconContext.Provider>
);

export const useIconContext = () => useContext(IconContext);

/* -------------------------------------------------------------------------- */
/*                                   BASE                                     */
/* -------------------------------------------------------------------------- */

const SIZE_MAP: Record<string, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

const WEIGHT_MAP: Record<string, number> = {
  thin: 1,
  light: 1.5,
  regular: 2,
  bold: 2.8,
};

function resolveSize(size: IconSize | undefined): number {
  if (size === undefined) return 20;
  if (typeof size === 'number') return size;
  return SIZE_MAP[size] ?? 20;
}

let stylesInjected = false;
function injectStylesOnce() {
  if (typeof document === 'undefined' || stylesInjected) return;
  const id = 'rachana-icon-styles';
  if (document.getElementById(id)) { stylesInjected = true; return; }
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
@keyframes rachana-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes rachana-pulse { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
.ri { display: inline-block; vertical-align: middle; flex-shrink: 0; }
.ri-spin { animation: rachana-spin 1.2s linear infinite; transform-origin: center; transform-box: fill-box; }
.ri-pulse { animation: rachana-pulse 1.8s ease-in-out infinite; }
`;
  document.head.appendChild(style);
  stylesInjected = true;
}

/* -------------------------------------------------------------------------- */
/*  IconBase                                                                   */
/*                                                                            */
/*  Handles outline and filled variants.                                      */
/*  For duotone, use DuotoneBase instead — it renders two separate layers     */
/*  so paths are never incorrectly doubled.                                   */
/* -------------------------------------------------------------------------- */

interface BaseProps extends IconProps {
  children: React.ReactNode;
}

export const IconBase: React.FC<BaseProps> = ({
  children,
  size,
  color,
  strokeWidth,
  weight,
  variant,
  rotate,
  flipH,
  flipV,
  spin,
  pulse,
  className = '',
  style,
  label,
  secondaryColor: _sec,
  ...rest
}) => {
  injectStylesOnce();

  const ctx = useIconContext();
  const resolvedSize = resolveSize(size ?? ctx.size);
  const resolvedColor = color ?? ctx.color ?? 'currentColor';
  const resolvedWeight = weight ?? ctx.weight ?? 'regular';
  const resolvedStrokeWidth = strokeWidth ?? ctx.strokeWidth ?? WEIGHT_MAP[resolvedWeight];
  const resolvedVariant = variant ?? ctx.variant ?? 'outline';
  const isFilled = resolvedVariant === 'filled';

  const transforms: string[] = [];
  if (flipH) transforms.push('scaleX(-1)');
  if (flipV) transforms.push('scaleY(-1)');
  if (rotate) transforms.push(`rotate(${rotate}deg)`);

  const classes = ['ri', spin && 'ri-spin', pulse && 'ri-pulse', className]
    .filter(Boolean).join(' ');

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={resolvedSize}
      height={resolvedSize}
      viewBox="0 0 24 24"
      fill={isFilled ? resolvedColor : 'none'}
      stroke={isFilled ? 'none' : resolvedColor}
      strokeWidth={isFilled ? 0 : resolvedStrokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={classes}
      style={{
        color: resolvedColor,
        transform: transforms.length
          ? transforms.join(' ')
          : undefined,
        ...style,
      }}
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={!label}
      {...rest}
    >
      {children}
    </svg>
  );
};

/* -------------------------------------------------------------------------- */
/*  DuotoneBase — two explicit layers                                          */
/*                                                                            */
/*  bg  = background fill paths (rendered semi-transparent)                  */
/*  fg  = foreground stroke paths                                             */
/*                                                                            */
/*  In "filled" variant both layers render as solid fills (no opacity).       */
/*  In "outline" / "duotone" variant, bg is 20% opacity fill, fg is stroke.  */
/* -------------------------------------------------------------------------- */

interface DuotoneProps extends IconProps {
  bg: React.ReactNode;
  fg: React.ReactNode;
}

export const DuotoneBase: React.FC<DuotoneProps> = ({
  bg,
  fg,
  size,
  color,
  secondaryColor,
  strokeWidth,
  weight,
  variant,
  rotate,
  flipH,
  flipV,
  spin,
  pulse,
  className = '',
  style,
  label,
  ...rest
}) => {
  injectStylesOnce();

  const ctx = useIconContext();
  const resolvedSize = resolveSize(size ?? ctx.size);
  const resolvedColor = color ?? ctx.color ?? 'currentColor';
  const resolvedSecondary = secondaryColor ?? ctx.secondaryColor ?? resolvedColor;
  const resolvedWeight = weight ?? ctx.weight ?? 'regular';
  const resolvedStrokeWidth = strokeWidth ?? ctx.strokeWidth ?? WEIGHT_MAP[resolvedWeight];
  const resolvedVariant = variant ?? ctx.variant ?? 'outline';

  const transforms: string[] = [];
  if (flipH) transforms.push('scaleX(-1)');
  if (flipV) transforms.push('scaleY(-1)');
  if (rotate) transforms.push(`rotate(${rotate}deg)`);

  const classes = ['ri', spin && 'ri-spin', pulse && 'ri-pulse', className]
    .filter(Boolean).join(' ');

  if (resolvedVariant === 'filled') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={resolvedSize} height={resolvedSize}
        viewBox="0 0 24 24"
        fill={resolvedColor} stroke="none" strokeWidth={0}
        strokeLinecap="round" strokeLinejoin="round"
        className={classes}
        style={{ transform: transforms.length ? transforms.join(' ') : undefined, ...style }}
        role={label ? 'img' : 'presentation'} aria-label={label} aria-hidden={!label}
        {...rest}
      >
        {bg}{fg}
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={resolvedSize} height={resolvedSize}
      viewBox="0 0 24 24"
      fill="none" stroke="none" strokeWidth={0}
      strokeLinecap="round" strokeLinejoin="round"
      className={classes}
      style={{ transform: transforms.length ? transforms.join(' ') : undefined, ...style }}
      role={label ? 'img' : 'presentation'} aria-label={label} aria-hidden={!label}
      {...rest}
    >
      <g fill={resolvedSecondary} opacity={0.2} stroke="none">{bg}</g>
      <g fill="none" stroke={resolvedColor} strokeWidth={resolvedStrokeWidth}
        strokeLinecap="round" strokeLinejoin="round">{fg}</g>
    </svg>
  );
};

/* ========================================================================== */
/*                              ICON DEFINITIONS                              */
/* ========================================================================== */

/* -------------------------------------------------------------------------- */
/*  Navigation & Layout                                                        */
/* -------------------------------------------------------------------------- */

export const HomeIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </IconBase>
);

export const DashboardIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </IconBase>
);

export const SidebarIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
  </IconBase>
);

export const MenuIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </IconBase>
);

export const GridIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </IconBase>
);

export const ListIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M9 6h12M9 12h12M9 18h12" />
    <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
  </IconBase>
);

export const ColumnsIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="12" y1="3" x2="12" y2="21" />
  </IconBase>
);

export const RowsIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </IconBase>
);

export const LayoutIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 9v12" />
  </IconBase>
);

export const MaximizeIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </IconBase>
);

export const MinimizeIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
  </IconBase>
);

export const ExpandIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 8V5a2 2 0 0 1 2-2h3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M21 16v3a2 2 0 0 1-2 2h-3" />
  </IconBase>
);

export const CollapseIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M9 9V5M5 9h4M15 9V5M19 9h-4M9 15v4M5 15h4M15 15v4M19 15h-4" />
  </IconBase>
);

export const DragHandleIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="9" cy="5" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="9" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="9" cy="19" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="15" cy="5" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="15" cy="19" r="1.5" fill="currentColor" stroke="none" />
  </IconBase>
);

export const LayersIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 12l10 5 10-5" />
    <path d="M2 17l10 5 10-5" />
  </IconBase>
);

export const PinIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 17v5M8 11V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6l2 2.5H6L8 11z" />
  </IconBase>
);

export const UnpinIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 17v5M8 11V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6l2 2.5H6L8 11z" />
    <line x1="3" y1="3" x2="21" y2="21" />
  </IconBase>
);

export const SidebarOpenIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M14 9l3 3-3 3" />
  </IconBase>
);

export const SidebarCloseIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M16 15l-3-3 3-3" />
  </IconBase>
);

export const PanelIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 15h18" />
  </IconBase>
);

export const DrawerIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
  </IconBase>
);

export const FullscreenIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 8V5a2 2 0 0 1 2-2h3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M21 16v3a2 2 0 0 1-2 2h-3" />
  </IconBase>
);

export const KanbanIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="4" height="18" rx="1" />
    <rect x="10" y="3" width="4" height="12" rx="1" />
    <rect x="17" y="3" width="4" height="15" rx="1" />
  </IconBase>
);

export const ViewBoardIcon: React.FC<IconProps> = KanbanIcon;

export const ViewTimelineIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="5" width="8" height="4" rx="1" />
    <rect x="9" y="11" width="10" height="4" rx="1" />
    <rect x="5" y="17" width="6" height="4" rx="1" />
  </IconBase>
);

export const ViewCalendarIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </IconBase>
);

export const ViewTableIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
  </IconBase>
);

export const GanttIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 3v18" />
    <rect x="5" y="5" width="8" height="3" rx="1" />
    <rect x="9" y="10" width="10" height="3" rx="1" />
    <rect x="5" y="15" width="6" height="3" rx="1" />
  </IconBase>
);

export const TreeIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="10" y="2" width="4" height="4" rx="1" />
    <rect x="3" y="18" width="4" height="4" rx="1" />
    <rect x="10" y="18" width="4" height="4" rx="1" />
    <rect x="17" y="18" width="4" height="4" rx="1" />
    <path d="M12 6v6M12 12H5v4M12 12h7v4" />
  </IconBase>
);

export const HierarchyIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="10" y="3" width="4" height="4" rx="1" />
    <rect x="3" y="15" width="4" height="4" rx="1" />
    <rect x="17" y="15" width="4" height="4" rx="1" />
    <path d="M12 7v4M6 11h12v4M6 15V11M18 15V11" />
  </IconBase>
);

export const SplitIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="12" y1="3" x2="12" y2="21" />
  </IconBase>
);

export const ModalIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" opacity="0.3" />
    <rect x="6" y="7" width="12" height="10" rx="1" />
  </IconBase>
);

export const TooltipIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="12" rx="2" />
    <path d="M9 15l3 4 3-4" />
  </IconBase>
);

export const PopoverIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="5" width="18" height="12" rx="2" />
    <path d="M8 5l4-4 4 4" />
  </IconBase>
);

/* -------------------------------------------------------------------------- */
/*  Actions & CRUD                                                             */
/* -------------------------------------------------------------------------- */

export const PlusIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 5v14M5 12h14" />
  </IconBase>
);

export const MinusIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M5 12h14" />
  </IconBase>
);

export const EditIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </IconBase>
);

export const PencilIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </IconBase>
);

export const TrashIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </IconBase>
);

export const SaveIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <path d="M17 21v-8H7v8M7 3v5h8" />
  </IconBase>
);

export const CopyIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </IconBase>
);

export const PasteIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
  </IconBase>
);

export const CutIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M20 4L8.12 15.88M15.88 15.88 20 20M8.12 8.12 12 12" />
  </IconBase>
);

export const DuplicateIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="4" y="4" width="10" height="10" rx="1.5" />
    <rect x="10" y="10" width="10" height="10" rx="1.5" />
  </IconBase>
);

export const ArchiveIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="2" y="3" width="20" height="5" rx="1" />
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
    <path d="M10 13h4" />
  </IconBase>
);

export const RestoreIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 7v6h6" />
    <path d="M3 13A9 9 0 1 0 5.63 5.63L3 8" />
  </IconBase>
);

export const ImportIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    <path d="M12 3v13M8 12l4 4 4-4" />
  </IconBase>
);

export const ExportIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    <path d="M12 15V3M8 7l4-4 4 4" />
  </IconBase>
);

export const UploadIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8l-5-5-5 5M12 3v12" />
  </IconBase>
);

export const DownloadIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 10l5 5 5-5M12 3v12" />
  </IconBase>
);

export const RefreshIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </IconBase>
);

export const SyncIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M21.5 2v6h-6M2.5 22v-6h6" />
    <path d="M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
  </IconBase>
);

export const UndoIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 7v6h6" />
    <path d="M3 13A9 9 0 1 0 5.63 5.63" />
  </IconBase>
);

export const RedoIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M21 7v6h-6" />
    <path d="M21 13A9 9 0 1 1 18.37 5.63" />
  </IconBase>
);

export const ResetIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 7v6h6" />
    <path d="M3 13A9 9 0 1 0 5.63 5.63L3 8" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <circle cx="12" cy="15" r="0.75" fill="currentColor" stroke="none" />
  </IconBase>
);

/* -------------------------------------------------------------------------- */
/*  Files & Documents                                                          */
/* -------------------------------------------------------------------------- */

export const FileIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </IconBase>
);

export const FilePlusIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="13" x2="12" y2="18" />
    <line x1="9.5" y1="15.5" x2="14.5" y2="15.5" />
  </IconBase>
);

export const FileMinusIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </IconBase>
);

export const FileTextIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
    <line x1="8" y1="9" x2="10" y2="9" />
  </IconBase>
);

export const FileCodeIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <polyline points="8.5 14.5 6.5 16.5 8.5 18.5" />
    <polyline points="13.5 14.5 15.5 16.5 13.5 18.5" />
  </IconBase>
);

export const FileCsvIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <text x="5.5" y="18" fontSize="5.5" fontFamily="monospace" fontWeight="bold" fill="currentColor" stroke="none">CSV</text>
  </IconBase>
);

export const FilePdfIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <text x="5.5" y="18" fontSize="5.5" fontFamily="monospace" fontWeight="bold" fill="currentColor" stroke="none">PDF</text>
  </IconBase>
);

export const FileImageIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <circle cx="9.5" cy="13.5" r="1.5" />
    <polyline points="20 18 15 12.5 9 19" />
  </IconBase>
);

export const FolderIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </IconBase>
);

export const FolderOpenIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v1" />
    <path d="M2 10h20" />
  </IconBase>
);

export const FolderPlusIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <line x1="12" y1="12" x2="12" y2="17" />
    <line x1="9.5" y1="14.5" x2="14.5" y2="14.5" />
  </IconBase>
);

export const AttachmentIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </IconBase>
);

export const PaperclipIcon: React.FC<IconProps> = AttachmentIcon;
export const DocumentIcon: React.FC<IconProps> = FileTextIcon;

export const ReportIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13h8M8 17h8M8 9h2" />
  </IconBase>
);

export const InvoiceIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M18 2H6a2 2 0 0 0-2 2v18l4-2 4 2 4-2 4 2V4a2 2 0 0 0-2-2z" />
    <line x1="8" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="16" x2="13" y2="16" />
  </IconBase>
);

export const ContractIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="m9 15 2 2 4-4" />
  </IconBase>
);

export const TemplateIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 9v12" />
  </IconBase>
);

/* -------------------------------------------------------------------------- */
/*  Communication                                                              */
/* -------------------------------------------------------------------------- */

export const MailIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </IconBase>
);

export const MailOpenIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6z" />
    <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
  </IconBase>
);

export const MailUnreadIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    <circle cx="19" cy="5" r="3" fill="currentColor" stroke="none" />
  </IconBase>
);

export const InboxIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M22 12h-5l-2 3H9l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </IconBase>
);

export const SendIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="m22 2-11 11M22 2 15 22l-4-9-9-4 20-7z" />
  </IconBase>
);

export const ReplyIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M9 17 4 12l5-5" />
    <path d="M4 12h11a4 4 0 0 1 4 4v1" />
  </IconBase>
);

export const ReplyAllIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M7 17 2 12l5-5M12 17l-5-5 5-5" />
    <path d="M7 12h11a4 4 0 0 1 4 4v1" />
  </IconBase>
);

export const ForwardIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="m15 17 5-5-5-5" />
    <path d="M20 12H9a4 4 0 0 0-4 4v1" />
  </IconBase>
);

export const ChatIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </IconBase>
);

export const ChatBubbleIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
  </IconBase>
);

export const SmsIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M22 2H2v20l4-4h16V2z" />
    <path d="M7 8h10M7 12h7" />
  </IconBase>
);

export const PhoneIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 11.6 19.79 19.79 0 0 1 1 3a2 2 0 0 1 2-2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.55 5.55l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </IconBase>
);

export const PhoneCallIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 1 5.18 2 2 0 0 1 3 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.55 5.55l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    <path d="M14.05 2a9 9 0 0 1 8 7.94M14.05 6A5 5 0 0 1 18 10" />
  </IconBase>
);

export const PhoneMissedIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <line x1="23" y1="1" x2="17" y2="7" />
    <line x1="17" y1="1" x2="23" y2="7" />
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 1 5.18 2 2 0 0 1 3 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 2.17 2.17" />
  </IconBase>
);

export const VideoCallIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="m23 7-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </IconBase>
);

export const BellIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </IconBase>
);

export const NotificationIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    <circle cx="18" cy="6" r="3" fill="currentColor" stroke="none" />
  </IconBase>
);

export const BellOffIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M13.73 21a2 2 0 0 1-3.46 0M18.63 13A17.89 17.89 0 0 1 18 8a6 6 0 0 0-9.33-5" />
    <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </IconBase>
);

export const MegaphoneIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M11 5H8a4 4 0 0 0 0 8h3" />
    <path d="M11 5v8l8 3.5V1.5L11 5z" />
    <path d="M8 13v4" />
  </IconBase>
);

export const AnnouncementIcon: React.FC<IconProps> = MegaphoneIcon;

/* -------------------------------------------------------------------------- */
/*  User & Team                                                                */
/* -------------------------------------------------------------------------- */

export const UserIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </IconBase>
);

export const UserPlusIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="9" cy="8" r="4" />
    <path d="M1 20c0-4 3.1-7 8-7s8 3 8 7" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="17" y1="11" x2="23" y2="11" />
  </IconBase>
);

export const UserMinusIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="9" cy="8" r="4" />
    <path d="M1 20c0-4 3.1-7 8-7s8 3 8 7" />
    <line x1="17" y1="11" x2="23" y2="11" />
  </IconBase>
);

export const UserCheckIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="9" cy="8" r="4" />
    <path d="M1 20c0-4 3.1-7 8-7s8 3 8 7" />
    <polyline points="17 11 19 13 23 9" />
  </IconBase>
);

export const UserXIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="9" cy="8" r="4" />
    <path d="M1 20c0-4 3.1-7 8-7s8 3 8 7" />
    <line x1="17" y1="9" x2="23" y2="15" />
    <line x1="23" y1="9" x2="17" y2="15" />
  </IconBase>
);

export const UsersIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="9" cy="8" r="4" />
    <path d="M1 20c0-4 3.1-7 8-7s8 3 8 7" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M23 20c0-3.5-2.5-6-7-7" />
  </IconBase>
);

export const AvatarIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="9" r="3" />
    <path d="M6.16 18.82A9.97 9.97 0 0 0 12 21c2.3 0 4.4-.77 6.08-2.06" />
  </IconBase>
);

export const ProfileIcon: React.FC<IconProps> = AvatarIcon;
export const PersonIcon: React.FC<IconProps> = UserIcon;

export const ContactIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="2" y="3" width="20" height="18" rx="2" />
    <circle cx="9" cy="11" r="3" />
    <path d="M3 20c0-2.5 2-4 6-4s6 1.5 6 4" />
    <line x1="16" y1="8" x2="20" y2="8" />
    <line x1="16" y1="12" x2="20" y2="12" />
    <line x1="16" y1="16" x2="18" y2="16" />
  </IconBase>
);

export const OrganizationIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="9" y="2" width="6" height="5" rx="1" />
    <rect x="2" y="15" width="6" height="5" rx="1" />
    <rect x="16" y="15" width="6" height="5" rx="1" />
    <path d="M12 7v4M5 15v-2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" />
  </IconBase>
);

export const DepartmentIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M3 9h6M3 15h6" />
    <path d="M9 7h12M9 12h12M9 17h8" />
  </IconBase>
);

export const RoleIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 2 2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </IconBase>
);

export const BadgeIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="8" r="6" />
    <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
  </IconBase>
);

export const IdCardIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <circle cx="8" cy="11" r="3" />
    <path d="M4 19c0-2 1.8-3 4-3s4 1 4 3" />
    <line x1="15" y1="9" x2="19" y2="9" />
    <line x1="15" y1="13" x2="19" y2="13" />
  </IconBase>
);

export const CrownIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 19h18M5 19 3 7l5 4 4-7 4 7 5-4-2 12H5z" />
  </IconBase>
);

export const StarUserIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="10" cy="9" r="4" />
    <path d="M2 21c0-4 3.1-7 8-7" />
    <path d="m17.5 13 1 2.5 2.5.2-1.9 1.8.6 2.5-2.2-1.4-2.2 1.4.6-2.5-1.9-1.8 2.5-.2 1-2.5z" />
  </IconBase>
);

/* -------------------------------------------------------------------------- */
/*  Security & Auth                                                            */
/* -------------------------------------------------------------------------- */

export const LockIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </IconBase>
);

export const UnlockIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </IconBase>
);

export const KeyIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="m21 2-9.6 9.6M15 7l3 3" />
  </IconBase>
);

export const PasswordIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <circle cx="8" cy="17" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
    <circle cx="16" cy="17" r="1" fill="currentColor" stroke="none" />
  </IconBase>
);

export const ShieldIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </IconBase>
);

export const ShieldCheckIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </IconBase>
);

export const ShieldXIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="10" y1="10" x2="14" y2="14" />
    <line x1="14" y1="10" x2="10" y2="14" />
  </IconBase>
);

export const FingerprintIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
    <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
    <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
    <path d="M2 12a10 10 0 0 1 18-6" />
    <path d="M2 17c1 .5 2.04.7 3 .7 3.4 0 6.5-1.83 8.28-4.89" />
    <path d="M5 12a7 7 0 0 1 3.5-6.07" />
    <path d="M5.55 17.1c.18-.88.45-1.83.76-2.73" />
    <path d="M8 12a4 4 0 0 1 8 0" />
  </IconBase>
);

export const EyeIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </IconBase>
);

export const EyeOffIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </IconBase>
);

export const LoginIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </IconBase>
);

export const LogoutIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </IconBase>
);

export const TwoFactorIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <circle cx="9" cy="17" r="1.5" />
    <circle cx="15" cy="17" r="1.5" />
  </IconBase>
);

export const TokenIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v2M12 16v2M6 12h2M16 12h2M8.5 8.5 10 10M14 14l1.5 1.5M8.5 15.5 10 14M14 10l1.5-1.5" />
  </IconBase>
);

export const CertificateIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="2" y="3" width="20" height="13" rx="2" />
    <path d="M8 21h8M12 17v4M9 9h6M9 12h4" />
  </IconBase>
);

export const PrivacyIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="9" x2="12" y2="12" />
    <circle cx="12" cy="14.5" r="0.75" fill="currentColor" stroke="none" />
  </IconBase>
);

export const GdprIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <text x="5" y="15" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" fill="currentColor" stroke="none">GDPR</text>
  </IconBase>
);

/* -------------------------------------------------------------------------- */
/*  Data & Analytics                                                           */
/* -------------------------------------------------------------------------- */

export const ChartBarIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 3v18h18" />
    <rect x="7" y="13" width="3" height="7" rx="0.5" />
    <rect x="13" y="8" width="3" height="12" rx="0.5" />
  </IconBase>
);

export const ChartLineIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 3v18h18" />
    <polyline points="7 16 10 10 14 13 19 6" />
  </IconBase>
);

export const ChartAreaIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 3v18h18" />
    <path d="M7 17 10 10l4 3 5-7v11H7z" />
  </IconBase>
);

export const ChartPieIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </IconBase>
);

export const ChartDonutIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3a9 9 0 0 1 9 9" strokeWidth={3} />
  </IconBase>
);

export const ChartScatterIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 3v18h18" />
    <circle cx="7" cy="16" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="11" cy="11" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="16" cy="7" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="9" cy="7" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="14" cy="14" r="1.5" fill="currentColor" stroke="none" />
  </IconBase>
);

export const TrendUpIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </IconBase>
);

export const TrendDownIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </IconBase>
);

export const AnalyticsIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 3v18h18" />
    <line x1="7" y1="21" x2="7" y2="14" />
    <line x1="12" y1="21" x2="12" y2="8" />
    <line x1="17" y1="21" x2="17" y2="11" />
  </IconBase>
);

export const MetricsIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <polyline points="7 14 10 11 13 13 17 9" />
  </IconBase>
);

export const KpiIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <text x="5" y="15" fontSize="7" fontWeight="bold" fill="currentColor" stroke="none">KPI</text>
  </IconBase>
);

export const TableIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
  </IconBase>
);

export const PivotIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 3v18h18" />
    <path d="M12 3v18M3 12h18" />
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
  </IconBase>
);

export const FilterIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polygon points="22 3 2 3 10 12.5 10 19 14 21 14 12.5 22 3" />
  </IconBase>
);

export const SortAscIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M4 6h14M4 12h9M4 18h4" />
    <path d="M17 10v10M14 17l3 3 3-3" />
  </IconBase>
);

export const SortDescIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M4 6h14M4 12h9M4 18h4" />
    <path d="M17 14V4M14 7l3-3 3 3" />
  </IconBase>
);

export const GroupByIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="12" cy="18" r="3" />
    <line x1="9" y1="6" x2="15" y2="6" />
    <line x1="7.5" y1="8.5" x2="10.5" y2="15.5" />
    <line x1="16.5" y1="8.5" x2="13.5" y2="15.5" />
  </IconBase>
);

export const AggregateIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M6 4h12M6 8h12M8 12h8M10 16h4M12 20h.01" />
  </IconBase>
);

export const FunnelIcon: React.FC<IconProps> = FilterIcon;

/* -------------------------------------------------------------------------- */
/*  Search & Discovery                                                         */
/* -------------------------------------------------------------------------- */

export const SearchIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </IconBase>
);

export const SearchPlusIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </IconBase>
);

export const SearchMinusIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </IconBase>
);

export const FindReplaceIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="10" cy="10" r="7" />
    <line x1="21" y1="21" x2="15" y2="15" />
    <path d="M14 19h7v-4M14 17h5" />
  </IconBase>
);

export const ExploreIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </IconBase>
);

export const CompassIcon: React.FC<IconProps> = ExploreIcon;

export const TagsIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.414 8.414a2 2 0 0 0 2.828 0l6.172-6.172a2 2 0 0 0 0-2.828L12.586 2.586z" />
    <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
  </IconBase>
);

export const LabelIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
  </IconBase>
);

export const CategoryIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <path d="M6.5 14 3 17.5 6.5 21 10 17.5 6.5 14z" />
  </IconBase>
);

export const TaxonomyIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="4" r="2" />
    <circle cx="4" cy="20" r="2" />
    <circle cx="20" cy="20" r="2" />
    <line x1="12" y1="6" x2="4" y2="18" />
    <line x1="12" y1="6" x2="20" y2="18" />
  </IconBase>
);

export const IndexIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 3v18" />
  </IconBase>
);

/* -------------------------------------------------------------------------- */
/*  Status & Feedback                                                          */
/* -------------------------------------------------------------------------- */

export const CheckIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polyline points="20 6 9 17 4 12" />
  </IconBase>
);

export const CheckCircleIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </IconBase>
);

export const XIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </IconBase>
);

export const XCircleIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </IconBase>
);

export const AlertTriangleIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="m10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <circle cx="12" cy="17" r="1.25" fill="currentColor" stroke="none" />
  </IconBase>
);

export const AlertCircleIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <circle cx="12" cy="16" r="1.25" fill="currentColor" stroke="none" />
  </IconBase>
);

export const InfoIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <circle cx="12" cy="8" r="1.25" fill="currentColor" stroke="none" />
  </IconBase>
);

export const InfoCircleIcon: React.FC<IconProps> = InfoIcon;

export const QuestionIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <circle cx="12" cy="17" r="1.25" fill="currentColor" stroke="none" />
  </IconBase>
);

export const QuestionCircleIcon: React.FC<IconProps> = QuestionIcon;
export const WarningIcon: React.FC<IconProps> = AlertCircleIcon;
export const ErrorIcon: React.FC<IconProps> = XCircleIcon;
export const SuccessIcon: React.FC<IconProps> = CheckCircleIcon;

export const LoadingIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p} spin>
    <circle cx="12" cy="12" r="10" opacity={0.2} />
    <path d="M12 2a10 10 0 0 1 10 10" />
  </IconBase>
);

export const PendingIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 7 12 12 15.5 14" />
  </IconBase>
);

export const InProgressIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 7v5l3 3" />
    <path d="M12 2a10 10 0 0 1 7 4" strokeWidth={3} strokeLinecap="round" />
  </IconBase>
);

export const BlockedIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </IconBase>
);

export const CancelledIcon: React.FC<IconProps> = XCircleIcon;

export const EmptyStateIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 15s1.5-2 4-2 4 2 4 2" />
    <circle cx="9" cy="9.5" r="1.25" fill="currentColor" stroke="none" />
    <circle cx="15" cy="9.5" r="1.25" fill="currentColor" stroke="none" />
  </IconBase>
);

export const SkeletonIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <rect x="6" y="7" width="12" height="2" rx="1" />
    <rect x="6" y="11" width="8" height="2" rx="1" />
    <rect x="6" y="15" width="5" height="2" rx="1" />
  </IconBase>
);

/* -------------------------------------------------------------------------- */
/*  Settings & Config                                                          */
/* -------------------------------------------------------------------------- */

export const SettingsIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </IconBase>
);

export const SlidersIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </IconBase>
);

export const ToggleIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="1" y="5" width="22" height="14" rx="7" />
    <circle cx="16" cy="12" r="4" fill="currentColor" stroke="none" />
  </IconBase>
);

export const AdjustmentsIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14h6M9 8h6M17 16h6" />
  </IconBase>
);

export const ConfigIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M12 3v18M3 12h18" />
  </IconBase>
);

export const WrenchIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 1 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" />
  </IconBase>
);

export const ToolIcon: React.FC<IconProps> = WrenchIcon;

export const BuildIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M12 8v8M8 12h8" />
  </IconBase>
);

export const CodeIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </IconBase>
);

export const TerminalIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </IconBase>
);

export const ApiIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="2" y="2" width="20" height="20" rx="3" />
    <text x="4.5" y="15.5" fontSize="8.5" fontWeight="bold" fontFamily="monospace" fill="currentColor" stroke="none">API</text>
  </IconBase>
);

export const WebhookIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
    <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" />
    <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" />
  </IconBase>
);

export const IntegrationIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M16 3h5v5M4 21l16-16M21 16v5h-5M15 15l6 6M4 4l5 5" />
  </IconBase>
);

export const PluginIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 2c0 2-1.5 3-3 3v4c0 1.1.9 2 2 2h6a2 2 0 0 0 2-2V5c-1.5 0-3-1-3-3" />
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
  </IconBase>
);

export const ExtensionIcon: React.FC<IconProps> = PluginIcon;

export const ModulesIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </IconBase>
);

/* -------------------------------------------------------------------------- */
/*  Time & Calendar                                                            */
/* -------------------------------------------------------------------------- */

export const CalendarIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </IconBase>
);

export const CalendarPlusIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="12" y1="14" x2="12" y2="18" />
    <line x1="10" y1="16" x2="14" y2="16" />
  </IconBase>
);

export const CalendarEventIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <rect x="8" y="13" width="4" height="4" rx="0.5" />
  </IconBase>
);

export const DatePickerIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <circle cx="8" cy="15" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
    <circle cx="16" cy="15" r="1" fill="currentColor" stroke="none" />
    <circle cx="8" cy="18" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
  </IconBase>
);

export const ClockIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 7 12 12 15.5 14" />
  </IconBase>
);

export const ClockHistoryIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 12A9 9 0 1 0 5.63 5.63L3 8" />
    <path d="M3 3v5h5" />
    <polyline points="12 7 12 12 15 14" />
  </IconBase>
);

export const TimerIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="14" r="8" />
    <polyline points="12 10 12 14 15 16" />
    <path d="M10 2h4M12 2v2" />
  </IconBase>
);

export const StopwatchIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="14" r="8" />
    <path d="M12 10v4l2.5 2.5" />
    <path d="M9.5 2.5 12 2l2.5.5M12 2v2" />
    <path d="M17.3 6 19 4.7" />
  </IconBase>
);

export const DeadlineIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18M8 14h8" />
    <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
  </IconBase>
);

export const ScheduleIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18M7 14h10M7 18h7" />
  </IconBase>
);

export const RecurringIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M21.5 2v6h-6M2.5 22v-6h6" />
    <path d="M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
  </IconBase>
);

export const TimeZoneIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </IconBase>
);

export const DurationIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M5 12h14" />
    <path d="m5 8-3 4 3 4M19 8l3 4-3 4" />
  </IconBase>
);

export const CronIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
    <path d="M6 3 4 5M18 3l2 2" />
  </IconBase>
);

/* -------------------------------------------------------------------------- */
/*  Billing & Finance                                                          */
/* -------------------------------------------------------------------------- */

export const CreditCardIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <path d="M1 10h22M5 15h4" />
  </IconBase>
);

export const WalletIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h14v4" />
    <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
    <rect x="14" y="11" width="8" height="6" rx="1" />
    <circle cx="17.5" cy="14" r="1" fill="currentColor" stroke="none" />
  </IconBase>
);

export const ReceiptIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
    <line x1="8" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="16" x2="12" y2="16" />
  </IconBase>
);

export const PaymentIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 8h20" />
    <rect x="5" y="12" width="3" height="2.5" rx="0.5" />
    <path d="M12 15h5" />
  </IconBase>
);

export const RefundIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 9h6M3 9V5l4.5 4L3 9z" />
    <path d="M3 9A9 9 0 1 0 6 5.28" />
  </IconBase>
);

export const SubscriptionIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 8h10M7 12h10M7 16h6" />
  </IconBase>
);

export const PlanIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="7" height="18" rx="1" />
    <rect x="14" y="3" width="7" height="12" rx="1" />
    <path d="M14 19h7" />
  </IconBase>
);

export const UpgradeIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </IconBase>
);

export const DowngradeIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </IconBase>
);

export const CouponIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a3 3 0 0 0 0 6v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a3 3 0 0 0 0-6z" />
    <line x1="12" y1="3" x2="12" y2="21" strokeDasharray="3 3" />
  </IconBase>
);

export const DiscountIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="19" y1="5" x2="5" y2="19" />
    <circle cx="9" cy="9" r="1.5" />
    <circle cx="15" cy="15" r="1.5" />
  </IconBase>
);

export const TaxIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <text x="7" y="15.5" fontSize="8" fontWeight="bold" fill="currentColor" stroke="none">%</text>
  </IconBase>
);

export const CurrencyIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12M9 9h4.5a2.5 2.5 0 0 1 0 5H9a2.5 2.5 0 0 0 0 5H15" />
  </IconBase>
);

export const DollarIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </IconBase>
);

export const EuroIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M19 7a7.7 7.7 0 0 0-13 5.5 7.7 7.7 0 0 0 13 5.5" />
    <path d="M5 10h9M5 14h9" />
  </IconBase>
);

export const PriceTagIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
  </IconBase>
);

export const BudgetIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M2 10h3M19 10h3M2 14h3M19 14h3" />
  </IconBase>
);

/* -------------------------------------------------------------------------- */
/*  Integrations & Dev                                                         */
/* -------------------------------------------------------------------------- */

export const CodeBlockIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="m9 10-2 2 2 2M15 10l2 2-2 2" />
  </IconBase>
);

export const RestIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <text x="4.5" y="15" fontSize="6.5" fontWeight="bold" fill="currentColor" stroke="none">REST</text>
  </IconBase>
);

export const GraphQlIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
    <circle cx="12" cy="12" r="3" />
  </IconBase>
);

export const DatabaseIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 5v6c0 1.66-4 3-9 3s-9-1.34-9-3V5" />
    <path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" />
  </IconBase>
);

export const ServerIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <circle cx="6" cy="6" r="1" fill="currentColor" stroke="none" />
    <circle cx="6" cy="18" r="1" fill="currentColor" stroke="none" />
  </IconBase>
);

export const CloudIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </IconBase>
);

export const CloudUploadIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    <path d="M12 12v6M10 14l2-2 2 2" />
  </IconBase>
);

export const CloudDownloadIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    <path d="M12 13v5M10 16l2 2 2-2" />
  </IconBase>
);

export const DeployIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 2 2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
  </IconBase>
);

export const CiCdIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="12" r="3" />
    <path d="M9 12h6M18 9V7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2M6 15v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2" />
  </IconBase>
);

export const GitIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="6" y1="9" x2="6" y2="15" />
    <path d="M6 9a9 9 0 0 1 9 9" />
  </IconBase>
);

export const BranchIcon: React.FC<IconProps> = GitIcon;

export const CommitIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="8" />
    <line x1="12" y1="16" x2="12" y2="22" />
  </IconBase>
);

export const PullRequestIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 15V9a4 4 0 0 0-4-4H9" />
    <line x1="6" y1="9" x2="6" y2="15" />
  </IconBase>
);

export const ConsoleIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <polyline points="7 9 11 12 7 15" />
    <line x1="13" y1="15" x2="17" y2="15" />
  </IconBase>
);

export const DebugIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 20H9a7 7 0 0 1-7-7v-2a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7v2a7 7 0 0 1-7 7h-1" />
    <path d="M12 14v6M8 14l-3 3M16 14l3 3M6 11H2M22 11h-4M9 5.5 7 3M17 3l-2 2.5" />
  </IconBase>
);

export const BugIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M8 6a4 4 0 0 1 8 0M8 6v2a4 4 0 0 0 8 0V6M8 6l-3-2M16 6l3-2M12 12v4M8 14H4M20 14h-4M7 19l-2 2M17 19l2 2M12 20v2" />
  </IconBase>
);

export const EndpointIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 20H5a2 2 0 0 1-2-2V8l5-6h9a2 2 0 0 1 2 2v6" />
    <path d="m18 14 4 4-4 4M22 18h-9" />
  </IconBase>
);

export const KeyApiIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="m21 2-9.6 9.6M15 7l3 3" />
    <rect x="18" y="2" width="4" height="3" rx="0.5" />
  </IconBase>
);

export const VariableIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M4 20c3.5-8 8-12 12-12M20 20C16.5 12 12 8 8 8" />
  </IconBase>
);

export const FunctionIconIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M11 4a1 1 0 0 1 1-1 3 3 0 0 1 3 3v1h1a1 1 0 0 1 0 2h-1v5a3 3 0 0 1-3 3 1 1 0 0 1 0-2 1 1 0 0 0 1-1v-5H9a1 1 0 0 1 0-2h4V6a1 1 0 0 0-1-1 1 1 0 0 1-1-1z" />
    <line x1="3" y1="12" x2="7" y2="12" />
  </IconBase>
);

/* -------------------------------------------------------------------------- */
/*  Media & Content                                                            */
/* -------------------------------------------------------------------------- */

export const ImageIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </IconBase>
);

export const GalleryIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="2" y="2" width="8" height="8" rx="1.5" />
    <rect x="14" y="2" width="8" height="8" rx="1.5" />
    <rect x="2" y="14" width="8" height="8" rx="1.5" />
    <rect x="14" y="14" width="8" height="8" rx="1.5" />
  </IconBase>
);

export const CameraIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </IconBase>
);

export const VideoIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </IconBase>
);

export const AudioIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M12 2v20M17 5v14M22 9v6M7 7v10M2 10v4" />
  </IconBase>
);

export const MusicIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </IconBase>
);

export const PlayIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </IconBase>
);

export const PauseIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </IconBase>
);

export const StopIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </IconBase>
);

export const RecordIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
  </IconBase>
);

export const MicrophoneIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M9 22h6" />
  </IconBase>
);

export const ScreenShareIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="2" y="3" width="20" height="13" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="m15 12 3-3-3-3M18 9H8" />
  </IconBase>
);

export const PresentationIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="2" y="3" width="20" height="13" rx="2" />
    <path d="M8 21h8M12 17v4M8 8h8M8 12h5" />
  </IconBase>
);

export const SlideshowIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="m10 8 5 3-5 3V8z" />
    <path d="M8 21h8M12 17v4" />
  </IconBase>
);

export const EmbedIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
    <line x1="14" y1="4" x2="10" y2="20" />
  </IconBase>
);

export const HtmlTagIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </IconBase>
);

export const RichTextIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 8h10M7 12h7M7 16h9" />
  </IconBase>
);

export const MarkdownIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 15V9l2.5 3L12 9v6M16 15V9l-3 3" />
  </IconBase>
);

export const FontIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polyline points="4 20 12 4 20 20" />
    <line x1="7" y1="13" x2="17" y2="13" />
  </IconBase>
);

export const BoldIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </IconBase>
);

export const ItalicIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </IconBase>
);

export const UnderlineIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M6 3v7a6 6 0 0 0 12 0V3" />
    <line x1="4" y1="21" x2="20" y2="21" />
  </IconBase>
);

export const LinkIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </IconBase>
);

export const UnlinkIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </IconBase>
);

/* -------------------------------------------------------------------------- */
/*  Maps & Location                                                            */
/* -------------------------------------------------------------------------- */

export const MapIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </IconBase>
);

export const MapPinIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </IconBase>
);

export const LocationIcon: React.FC<IconProps> = MapPinIcon;

export const GpsIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="8" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
  </IconBase>
);

export const GlobeIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </IconBase>
);

export const RegionIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="12" cy="12" r="4" />
  </IconBase>
);

export const CountryIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
  </IconBase>
);

export const AddressIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <circle cx="12" cy="12" r="2" />
  </IconBase>
);

export const DirectionsIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M8 12h8M13 9l3 3-3 3" />
  </IconBase>
);

export const RadiusIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="12" x2="21" y2="12" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </IconBase>
);

export const GeofenceIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
    <circle cx="12" cy="12" r="4" />
  </IconBase>
);

/* -------------------------------------------------------------------------- */
/*  E-commerce & CRM                                                           */
/* -------------------------------------------------------------------------- */

export const CartIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="9" cy="21" r="1.5" />
    <circle cx="20" cy="21" r="1.5" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </IconBase>
);

export const BagIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M16 8V6a4 4 0 0 0-8 0v2" />
  </IconBase>
);

export const WishlistIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </IconBase>
);

export const OrderIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="8" y1="7" x2="16" y2="7" />
    <line x1="8" y1="11" x2="16" y2="11" />
    <line x1="8" y1="15" x2="13" y2="15" />
  </IconBase>
);

export const ShippingIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="1" y="3" width="13" height="13" rx="2" />
    <polygon points="14 8 20 8 23 11 23 16 14 16" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </IconBase>
);

export const TrackingIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </IconBase>
);

export const CustomerIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </IconBase>
);

export const LeadIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="10" cy="8" r="4" />
    <path d="M2 21a8 8 0 0 1 14-5.66" />
    <path d="M20 3h2v4M21 1v2" />
  </IconBase>
);

export const DealIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    <path d="m9 12 2 2 4-4" />
  </IconBase>
);

export const PipelineIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="2" y="7" width="4" height="10" rx="1" />
    <rect x="10" y="5" width="4" height="14" rx="1" />
    <rect x="18" y="3" width="4" height="18" rx="1" />
    <path d="M6 12h4M14 12h4" />
  </IconBase>
);

export const OpportunityIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
    <path d="M16.9 17.9 19 20" />
  </IconBase>
);

export const QuoteIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M3 21h18M3 10h6v8H3zm12 0h6v8h-6z" />
  </IconBase>
);

export const ProposalIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="8" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <path d="m10 16 2 2 4-4" />
  </IconBase>
);

export const TicketIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a3 3 0 0 0 0 6v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a3 3 0 0 0 0-6z" />
  </IconBase>
);

export const SupportIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
    <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
    <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
  </IconBase>
);

export const HelpdeskIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none" />
  </IconBase>
);

export const SlaIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <text x="5.5" y="15" fontSize="7" fontWeight="bold" fill="currentColor" stroke="none">SLA</text>
  </IconBase>
);

export const FeedbackIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="12" y1="7" x2="12" y2="11" />
    <circle cx="12" cy="13.5" r="0.75" fill="currentColor" stroke="none" />
  </IconBase>
);

export const RatingIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </IconBase>
);

export const ReviewIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="m9 10 2 2 4-4" />
  </IconBase>
);

export const NpsIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <text x="5.5" y="15" fontSize="7" fontWeight="bold" fill="currentColor" stroke="none">NPS</text>
  </IconBase>
);

/* -------------------------------------------------------------------------- */
/*  Misc Utility                                                               */
/* -------------------------------------------------------------------------- */

export const BookmarkIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </IconBase>
);

export const FlagIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </IconBase>
);

export const StarIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </IconBase>
);

export const HeartIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </IconBase>
);

export const LikeIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </IconBase>
);

export const DislikeIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
  </IconBase>
);

export const ShareIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </IconBase>
);

export const ExternalLinkIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
  </IconBase>
);

export const RedirectIcon: React.FC<IconProps> = ExternalLinkIcon;

export const ShortcutIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="m9 9 3-3 3 3M12 6v7M9 16h6" />
  </IconBase>
);

export const HotkeyIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 12h2M15 9v6M11 9l-3 3 3 3" />
  </IconBase>
);

export const PrintIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" rx="1" />
  </IconBase>
);

export const QrCodeIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="6" height="6" rx="1" />
    <rect x="15" y="3" width="6" height="6" rx="1" />
    <rect x="3" y="15" width="6" height="6" rx="1" />
    <rect x="10" y="10" width="3" height="3" rx="0.5" />
    <line x1="15" y1="15" x2="15" y2="15.01" strokeWidth={3} />
    <line x1="21" y1="15" x2="21" y2="15.01" strokeWidth={3} />
    <line x1="15" y1="21" x2="15" y2="21.01" strokeWidth={3} />
    <line x1="21" y1="21" x2="21" y2="21.01" strokeWidth={3} />
  </IconBase>
);

export const BarcodeIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="4" width="1" height="16" fill="currentColor" stroke="none" />
    <rect x="5" y="4" width="1.5" height="16" fill="currentColor" stroke="none" />
    <rect x="8" y="4" width="0.8" height="16" fill="currentColor" stroke="none" />
    <rect x="10" y="4" width="2.5" height="16" fill="currentColor" stroke="none" />
    <rect x="14" y="4" width="1" height="16" fill="currentColor" stroke="none" />
    <rect x="16.5" y="4" width="2" height="16" fill="currentColor" stroke="none" />
    <rect x="20" y="4" width="1" height="16" fill="currentColor" stroke="none" />
  </IconBase>
);

export const ClipboardIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
  </IconBase>
);

export const ChecklistIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M9 6h12M9 12h12M9 18h12" />
    <path d="m5 6-1 1-1-1M5 12l-1 1-1-1M5 18l-1 1-1-1" />
  </IconBase>
);

export const DividerIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <line x1="2" y1="12" x2="22" y2="12" strokeDasharray="4 2" />
  </IconBase>
);

export const SeparatorIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <line x1="3" y1="12" x2="21" y2="12" />
  </IconBase>
);

export const SpacerIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <line x1="12" y1="3" x2="12" y2="21" strokeDasharray="4 2" />
    <polyline points="9 6 12 3 15 6" />
    <polyline points="9 18 12 21 15 18" />
  </IconBase>
);

export const MoreHorizontalIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="1.75" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1.75" fill="currentColor" stroke="none" />
    <circle cx="5" cy="12" r="1.75" fill="currentColor" stroke="none" />
  </IconBase>
);

export const MoreVerticalIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="1.75" fill="currentColor" stroke="none" />
    <circle cx="12" cy="5" r="1.75" fill="currentColor" stroke="none" />
    <circle cx="12" cy="19" r="1.75" fill="currentColor" stroke="none" />
  </IconBase>
);

export const OverflowIcon: React.FC<IconProps> = MoreVerticalIcon;

export const BreadcrumbIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </IconBase>
);

export const DotIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
  </IconBase>
);

export const CircleIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
  </IconBase>
);

export const SquareIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
  </IconBase>
);

export const DiamondIcon: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <polygon points="12 2 22 12 12 22 2 12 12 2" />
  </IconBase>
);

/* ========================================================================== */
/*                           ICON MAP & TYPES                                 */
/* ========================================================================== */

export const icons = {
  HomeIcon, DashboardIcon, SidebarIcon, MenuIcon, GridIcon, ListIcon,
  ColumnsIcon, RowsIcon, LayoutIcon, MaximizeIcon, MinimizeIcon, ExpandIcon,
  CollapseIcon, DragHandleIcon, LayersIcon, PinIcon, UnpinIcon,
  SidebarOpenIcon, SidebarCloseIcon, PanelIcon, DrawerIcon, FullscreenIcon,
  KanbanIcon, ViewBoardIcon, ViewTimelineIcon, ViewCalendarIcon, ViewTableIcon,
  GanttIcon, TreeIcon, HierarchyIcon, SplitIcon, ModalIcon, TooltipIcon, PopoverIcon,
  PlusIcon, MinusIcon, EditIcon, PencilIcon, TrashIcon, SaveIcon, CopyIcon,
  PasteIcon, CutIcon, DuplicateIcon, ArchiveIcon, RestoreIcon, ImportIcon,
  ExportIcon, UploadIcon, DownloadIcon, RefreshIcon, SyncIcon, UndoIcon,
  RedoIcon, ResetIcon,
  FileIcon, FilePlusIcon, FileMinusIcon, FileTextIcon, FileCodeIcon,
  FileCsvIcon, FilePdfIcon, FileImageIcon, FolderIcon, FolderOpenIcon,
  FolderPlusIcon, AttachmentIcon, PaperclipIcon, DocumentIcon, ReportIcon,
  InvoiceIcon, ContractIcon, TemplateIcon,
  MailIcon, MailOpenIcon, MailUnreadIcon, InboxIcon, SendIcon, ReplyIcon,
  ReplyAllIcon, ForwardIcon, ChatIcon, ChatBubbleIcon, SmsIcon, PhoneIcon,
  PhoneCallIcon, PhoneMissedIcon, VideoCallIcon, BellIcon, NotificationIcon,
  BellOffIcon, MegaphoneIcon, AnnouncementIcon,
  UserIcon, UserPlusIcon, UserMinusIcon, UserCheckIcon, UserXIcon, UsersIcon,
  AvatarIcon, ProfileIcon, PersonIcon, ContactIcon, OrganizationIcon,
  DepartmentIcon, RoleIcon, BadgeIcon, IdCardIcon, CrownIcon, StarUserIcon,
  LockIcon, UnlockIcon, KeyIcon, PasswordIcon, ShieldIcon, ShieldCheckIcon,
  ShieldXIcon, FingerprintIcon, EyeIcon, EyeOffIcon, LoginIcon, LogoutIcon,
  TwoFactorIcon, TokenIcon, CertificateIcon, PrivacyIcon, GdprIcon,
  ChartBarIcon, ChartLineIcon, ChartAreaIcon, ChartPieIcon, ChartDonutIcon,
  ChartScatterIcon, TrendUpIcon, TrendDownIcon, AnalyticsIcon, MetricsIcon,
  KpiIcon, TableIcon, PivotIcon, FilterIcon, SortAscIcon, SortDescIcon,
  GroupByIcon, AggregateIcon, FunnelIcon,
  SearchIcon, SearchPlusIcon, SearchMinusIcon, FindReplaceIcon, ExploreIcon,
  CompassIcon, TagsIcon, LabelIcon, CategoryIcon, TaxonomyIcon, IndexIcon,
  CheckIcon, CheckCircleIcon, XIcon, XCircleIcon, AlertTriangleIcon,
  AlertCircleIcon, InfoIcon, InfoCircleIcon, QuestionIcon, QuestionCircleIcon,
  WarningIcon, ErrorIcon, SuccessIcon, LoadingIcon, PendingIcon, InProgressIcon,
  BlockedIcon, CancelledIcon, EmptyStateIcon, SkeletonIcon,
  SettingsIcon, SlidersIcon, ToggleIcon, AdjustmentsIcon, ConfigIcon,
  WrenchIcon, ToolIcon, BuildIcon, CodeIcon, TerminalIcon, ApiIcon,
  WebhookIcon, IntegrationIcon, PluginIcon, ExtensionIcon, ModulesIcon,
  CalendarIcon, CalendarPlusIcon, CalendarEventIcon, DatePickerIcon,
  ClockIcon, ClockHistoryIcon, TimerIcon, StopwatchIcon, DeadlineIcon,
  ScheduleIcon, RecurringIcon, TimeZoneIcon, DurationIcon, CronIcon,
  CreditCardIcon, WalletIcon, ReceiptIcon, PaymentIcon, RefundIcon,
  SubscriptionIcon, PlanIcon, UpgradeIcon, DowngradeIcon, CouponIcon,
  DiscountIcon, TaxIcon, CurrencyIcon, DollarIcon, EuroIcon, PriceTagIcon,
  BudgetIcon,
  CodeBlockIcon, RestIcon, GraphQlIcon, DatabaseIcon, ServerIcon, CloudIcon,
  CloudUploadIcon, CloudDownloadIcon, DeployIcon, CiCdIcon, GitIcon,
  BranchIcon, CommitIcon, PullRequestIcon, ConsoleIcon, DebugIcon, BugIcon,
  EndpointIcon, KeyApiIcon, VariableIcon, FunctionIconIcon,
  ImageIcon, GalleryIcon, CameraIcon, VideoIcon, AudioIcon, MusicIcon,
  PlayIcon, PauseIcon, StopIcon, RecordIcon, MicrophoneIcon, ScreenShareIcon,
  PresentationIcon, SlideshowIcon, EmbedIcon, HtmlTagIcon, RichTextIcon,
  MarkdownIcon, FontIcon, BoldIcon, ItalicIcon, UnderlineIcon, LinkIcon,
  UnlinkIcon,
  MapIcon, MapPinIcon, LocationIcon, GpsIcon, GlobeIcon, RegionIcon,
  CountryIcon, AddressIcon, DirectionsIcon, RadiusIcon, GeofenceIcon,
  CartIcon, BagIcon, WishlistIcon, OrderIcon, ShippingIcon, TrackingIcon,
  CustomerIcon, LeadIcon, DealIcon, PipelineIcon, OpportunityIcon, QuoteIcon,
  ProposalIcon, TicketIcon, SupportIcon, HelpdeskIcon, SlaIcon, FeedbackIcon,
  RatingIcon, ReviewIcon, NpsIcon,
  BookmarkIcon, FlagIcon, StarIcon, HeartIcon, LikeIcon, DislikeIcon,
  ShareIcon, ExternalLinkIcon, RedirectIcon, ShortcutIcon, HotkeyIcon,
  PrintIcon, QrCodeIcon, BarcodeIcon, ClipboardIcon, ChecklistIcon,
  DividerIcon, SeparatorIcon, SpacerIcon, MoreHorizontalIcon, MoreVerticalIcon,
  OverflowIcon, BreadcrumbIcon, DotIcon, CircleIcon, SquareIcon, DiamondIcon,
};

export type IconName = keyof typeof icons;