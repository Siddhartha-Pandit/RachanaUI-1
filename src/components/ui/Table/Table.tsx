import { useState, createContext, useContext } from "react";
import type { ReactNode, CSSProperties, FC } from "react";
import "./Table.css";
import Checkboxes from "../Forms/Checkboxes/Checkboxes";

interface TableContextValue {
  stickyHeader: boolean;
  stickyFirstColumn: boolean;
  striped: boolean;
  hoverable: boolean;
  selectable: boolean;
  selectedRows: Set<number>;
  allSelected: boolean;
  someSelected: boolean;
  toggleAll: (checked: boolean) => void;
  toggleRow: (index: number, checked: boolean) => void;
  columns: TableColumn[];
  visibleData: Record<string, any>[];
}

const TableContext = createContext<TableContextValue | null>(null);

const useTableContext = () => {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error("Must be used inside <Table>");
  return ctx;
};

export interface TableColumn {
  key: string;
  title: string;
  width?: string;
  align?: "left" | "center" | "right";
  sticky?: boolean;
}

export interface TableProps {
  columns: TableColumn[];
  data: Record<string, any>[];
  stickyHeader?: boolean;
  stickyFirstColumn?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedIndices: number[]) => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

function TableRoot({
  columns,
  data,
  stickyHeader = true,
  stickyFirstColumn = false,
  striped = true,
  hoverable = true,
  selectable = false,
  onSelectionChange,
  children,
  className = "",
  style,
}: TableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const allSelected = data.length > 0 && selectedRows.size === data.length;
  const someSelected = selectedRows.size > 0 && !allSelected;

  const toggleAll = (checked: boolean) => {
    const next = checked ? new Set(data.map((_, i) => i)) : new Set<number>();
    setSelectedRows(next);
    onSelectionChange?.(Array.from(next));
  };

  const toggleRow = (index: number, checked: boolean) => {
    const next = new Set(selectedRows);
    checked ? next.add(index) : next.delete(index);
    setSelectedRows(next);
    onSelectionChange?.(Array.from(next));
  };

  return (
    <TableContext.Provider
      value={{
        stickyHeader,
        stickyFirstColumn,
        striped,
        hoverable,
        selectable,
        selectedRows,
        allSelected,
        someSelected,
        toggleAll,
        toggleRow,
        columns,
        visibleData: data,
      }}
    >
      <div className={`table-wrapper ${className}`} style={style}>
        {children}
      </div>
    </TableContext.Provider>
  );
}

function TableScroll({ children }: { children: ReactNode }) {
  return <div className="table-scroll">{children}</div>;
}

function TableElement({ children }: { children: ReactNode }) {
  return <table className="table">{children}</table>;
}

function TableHeader() {
  const {
    columns, stickyHeader, stickyFirstColumn,
    selectable, allSelected, someSelected, toggleAll,
  } = useTableContext();

  // checkbox column is 44px wide; first data column left offset accounts for it
  const firstColLeft = selectable ? "44px" : "0px";

  return (
    <thead>
      <tr>
        {selectable && (
          <th className={["table-head", "table-head-check", stickyHeader ? "table-head-sticky" : ""].filter(Boolean).join(" ")}>
            <Checkboxes checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
          </th>
        )}
        {columns.map((col, i) => (
          <th
            key={col.key}
            className={[
              "table-head",
              stickyHeader ? "table-head-sticky" : "",
              stickyFirstColumn && i === 0 ? "table-first-column" : "",
            ].filter(Boolean).join(" ")}
            style={{
              width: col.width,
              textAlign: col.align || "left",
              left: stickyFirstColumn && i === 0 ? firstColLeft : undefined,
            }}
          >
            {col.title}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TableBody({ children }: { children?: ReactNode }) {
  const {
    columns, visibleData, striped, hoverable,
    selectable, stickyFirstColumn, selectedRows, toggleRow,
  } = useTableContext();

  const firstColLeft = selectable ? "44px" : "0px";

  if (children) return <tbody>{children}</tbody>;

  return (
    <tbody>
      {visibleData.map((row, rowIndex) => {
        const isSelected = selectedRows.has(rowIndex);
        return (
          <tr
            key={rowIndex}
            className={[
              "table-row",
              striped && rowIndex % 2 !== 0 ? "table-row-striped" : "",
              hoverable ? "table-row-hover" : "",
              isSelected ? "table-row-selected" : "",
            ].filter(Boolean).join(" ")}
          >
            {selectable && (
              <td className="table-cell table-cell-check">
                <Checkboxes
                  checked={isSelected}
                  onChange={(checked) => toggleRow(rowIndex, checked)}
                />
              </td>
            )}
            {columns.map((col, colIndex) => (
              <td
                key={col.key}
                className={[
                  "table-cell",
                  stickyFirstColumn && colIndex === 0 ? "table-first-column" : "",
                ].filter(Boolean).join(" ")}
                style={{
                  textAlign: col.align || "left",
                  left: stickyFirstColumn && colIndex === 0 ? firstColLeft : undefined,
                }}
              >
                {row[col.key]}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
}

interface TableRowProps {
  children: ReactNode;
  index?: number;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
}

function TableRow({ children, index = 0, selected, className = "", onClick }: TableRowProps) {
  const { striped, hoverable } = useTableContext();
  return (
    <tr
      className={[
        "table-row",
        striped && index % 2 !== 0 ? "table-row-striped" : "",
        hoverable ? "table-row-hover" : "",
        selected ? "table-row-selected" : "",
        className,
      ].filter(Boolean).join(" ")}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface TableCellProps {
  children?: ReactNode;
  align?: "left" | "center" | "right";
  sticky?: boolean;
  className?: string;
  style?: CSSProperties;
}

function TableCell({ children, align = "left", sticky, className = "", style }: TableCellProps) {
  return (
    <td
      className={["table-cell", sticky ? "table-first-column" : "", className].filter(Boolean).join(" ")}
      style={{ textAlign: align, ...style }}
    >
      {children}
    </td>
  );
}

interface TableHeadCellProps {
  children?: ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  sticky?: boolean;
  className?: string;
}

function TableHeadCell({ children, align = "left", width, sticky, className = "" }: TableHeadCellProps) {
  const { stickyHeader } = useTableContext();
  return (
    <th
      className={[
        "table-head",
        stickyHeader ? "table-head-sticky" : "",
        sticky ? "table-first-column" : "",
        className,
      ].filter(Boolean).join(" ")}
      style={{ textAlign: align, width }}
    >
      {children}
    </th>
  );
}

function TableFooter({ children }: { children: ReactNode }) {
  return <div className="table-pagination">{children}</div>;
}

function TableEmpty({ message = "No data available" }: { message?: string }) {
  const { columns, selectable } = useTableContext();
  const colSpan = columns.length + (selectable ? 1 : 0);
  return (
    <tbody>
      <tr>
        <td className="table-cell table-empty" colSpan={colSpan}>
          {message}
        </td>
      </tr>
    </tbody>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  const { columns, selectable } = useTableContext();
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="table-row">
          {selectable && (
            <td className="table-cell table-cell-check">
              <div className="table-skeleton-box" style={{ width: 16, height: 16 }} />
            </td>
          )}
          {columns.map((col) => (
            <td key={col.key} className="table-cell">
              <div className="table-skeleton-box" style={{ width: `${50 + Math.random() * 40}%`, height: 14 }} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function TablePaginationInfo({ page, pageSize, total }: { page: number; pageSize: number; total: number }) {
  const from = Math.min((page - 1) * pageSize + 1, total);
  const to = Math.min(page * pageSize, total);
  return (
    <span className="table-pagination-info">
      {from}–{to} of {total}
    </span>
  );
}

export const Table = Object.assign(TableRoot, {
  Scroll: TableScroll,
  Element: TableElement,
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  HeadCell: TableHeadCell,
  Footer: TableFooter,
  Empty: TableEmpty,
  Skeleton: TableSkeleton,
  PaginationInfo: TablePaginationInfo,
});

export default Table;