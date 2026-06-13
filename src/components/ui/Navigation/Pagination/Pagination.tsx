import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import "./Pagination.css";

// ─── Context ────────────────────────────────────────────────────────────────

interface PaginationContextValue {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const PaginationContext = createContext<PaginationContextValue>({
  page: 1,
  totalPages: 1,
  onPageChange: () => {},
});

// ─── Types ───────────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

type PaginationComponent = React.FC<PaginationProps> & {
  Prev: typeof PaginationPrev;
  Next: typeof PaginationNext;
  List: typeof PaginationList;
  Item: typeof PaginationItem;
  Ellipsis: typeof PaginationEllipsis;
};

// ─── Root ────────────────────────────────────────────────────────────────────

const Pagination = (({
  page,
  totalPages,
  onPageChange,
  disabled = false,
  className = "",
  children,
}: PaginationProps) => {
  return (
    <PaginationContext.Provider value={{ page, totalPages, onPageChange, disabled }}>
      <nav
        role="navigation"
        aria-label="Pagination"
        className={`pagination-root ${className}`}
      >
        {children}
      </nav>
    </PaginationContext.Provider>
  );
}) as PaginationComponent;

// ─── Prev ─────────────────────────────────────────────────────────────────

interface PaginationPrevProps {
  className?: string;
  children?: ReactNode;
}

function PaginationPrev({ className = "", children }: PaginationPrevProps) {
  const { page, onPageChange, disabled } = useContext(PaginationContext);
  const isDisabled = disabled || page <= 1;

  return (
    <button
      type="button"
      aria-label="Go to previous page"
      disabled={isDisabled}
      onClick={() => !isDisabled && onPageChange(page - 1)}
      className={`pagination-btn pagination-btn--nav ${isDisabled ? "pagination-btn--disabled" : ""} ${className}`}
    >
      {children ?? (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Previous</span>
        </>
      )}
    </button>
  );
}

// ─── Next ─────────────────────────────────────────────────────────────────

interface PaginationNextProps {
  className?: string;
  children?: ReactNode;
}

function PaginationNext({ className = "", children }: PaginationNextProps) {
  const { page, totalPages, onPageChange, disabled } = useContext(PaginationContext);
  const isDisabled = disabled || page >= totalPages;

  return (
    <button
      type="button"
      aria-label="Go to next page"
      disabled={isDisabled}
      onClick={() => !isDisabled && onPageChange(page + 1)}
      className={`pagination-btn pagination-btn--nav ${isDisabled ? "pagination-btn--disabled" : ""} ${className}`}
    >
      {children ?? (
        <>
          <span>Next</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </>
      )}
    </button>
  );
}

// ─── List ─────────────────────────────────────────────────────────────────

interface PaginationListProps {
  children: ReactNode;
  className?: string;
}

function PaginationList({ children, className = "" }: PaginationListProps) {
  return (
    <ol role="list" className={`pagination-list ${className}`}>
      {children}
    </ol>
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────

interface PaginationItemProps {
  page: number;
  className?: string;
  children?: ReactNode;
}

function PaginationItem({ page: targetPage, className = "", children }: PaginationItemProps) {
  const { page, onPageChange, disabled } = useContext(PaginationContext);
  const isActive = page === targetPage;
  const isDisabled = disabled;

  return (
    <li>
      <button
        type="button"
        aria-label={`Go to page ${targetPage}`}
        aria-current={isActive ? "page" : undefined}
        disabled={isDisabled}
        onClick={() => !isDisabled && onPageChange(targetPage)}
        className={[
          "pagination-btn",
          "pagination-btn--page",
          isActive ? "pagination-btn--active" : "",
          isDisabled ? "pagination-btn--disabled" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children ?? targetPage}
      </button>
    </li>
  );
}

// ─── Ellipsis ─────────────────────────────────────────────────────────────

interface PaginationEllipsisProps {
  className?: string;
}

function PaginationEllipsis({ className = "" }: PaginationEllipsisProps) {
  return (
    <li aria-hidden="true">
      <span className={`pagination-ellipsis ${className}`}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="5" cy="12" r="1.75" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.75" fill="currentColor" stroke="none" />
          <circle cx="19" cy="12" r="1.75" fill="currentColor" stroke="none" />
        </svg>
      </span>
    </li>
  );
}

// ─── Attach sub-components ────────────────────────────────────────────────

Pagination.Prev = PaginationPrev;
Pagination.Next = PaginationNext;
Pagination.List = PaginationList;
Pagination.Item = PaginationItem;
Pagination.Ellipsis = PaginationEllipsis;

export default Pagination;

// ─── Helper: usePagination ────────────────────────────────────────────────
// Generates the page number array with ellipsis markers.
// Returns items like: [1, 'ellipsis-start', 4, 5, 6, 'ellipsis-end', 20]

export type PaginationRange = (number | "ellipsis-start" | "ellipsis-end")[];

export function usePagination({
  page,
  totalPages,
  siblings = 1,
}: {
  page: number;
  totalPages: number;
  siblings?: number;
}): PaginationRange {
  if (totalPages <= 1) return [1];

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const totalPageNumbers = siblings * 2 + 5; // siblings + first + last + current + 2 ellipsis

  // No ellipsis needed
  if (totalPageNumbers >= totalPages) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(page - siblings, 1);
  const rightSiblingIndex = Math.min(page + siblings, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftPages = range(1, 3 + siblings * 2);
    return [...leftPages, "ellipsis-end", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightPages = range(totalPages - (2 + siblings * 2), totalPages);
    return [1, "ellipsis-start", ...rightPages];
  }

  const middlePages = range(leftSiblingIndex, rightSiblingIndex);
  return [1, "ellipsis-start", ...middlePages, "ellipsis-end", totalPages];
}