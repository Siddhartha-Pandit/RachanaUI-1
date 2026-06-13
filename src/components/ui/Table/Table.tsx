import { useState } from "react";
import "./Table.css";
import Checkboxes from "../Forms/Checkboxes/Checkboxes";
import Pagination, { usePagination } from "../Navigation/Pagination/Pagination";

interface TableColumn {
  key: string;
  title: string;
  width?: string;
  sticky?: boolean;
  align?: "left" | "center" | "right";
}

interface TableProps {
  columns: TableColumn[];
  data: Record<string, any>[];
  stickyHeader?: boolean;
  stickyFirstColumn?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedIndices: number[]) => void;
  pageSize?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  paginationSlot?: React.ReactNode;
}

export default function Table({
  columns,
  data,
  stickyHeader = true,
  stickyFirstColumn = false,
  striped = true,
  hoverable = true,
  selectable = true,
  onSelectionChange,
  pageSize,
  page: externalPage,
  totalPages: externalTotalPages,
  onPageChange: externalOnPageChange,
  paginationSlot,
}: TableProps) {
  const [internalPage, setInternalPage] = useState(1);

  const isInternal = pageSize !== undefined && externalPage === undefined;
  const isExternal = externalPage !== undefined && externalTotalPages !== undefined;

  const page = isInternal ? internalPage : (externalPage ?? 1);
  const totalPages = isInternal
    ? Math.max(1, Math.ceil(data.length / pageSize!))
    : (externalTotalPages ?? 1);

  const handlePageChange = (p: number) => {
    if (isInternal) {
      setInternalPage(p);
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      externalOnPageChange?.(p);
    }
  };

  const visibleData = isInternal
    ? data.slice((page - 1) * pageSize!, page * pageSize!)
    : data;

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const allSelected = visibleData.length > 0 && selectedRows.size === visibleData.length;
  const someSelected = selectedRows.size > 0 && !allSelected;

  const toggleAll = (checked: boolean) => {
    const next = checked
      ? new Set(visibleData.map((_, i) => i))
      : new Set<number>();
    setSelectedRows(next);
    onSelectionChange?.(Array.from(next));
  };

  const toggleRow = (index: number, checked: boolean) => {
    const next = new Set(selectedRows);
    checked ? next.add(index) : next.delete(index);
    setSelectedRows(next);
    onSelectionChange?.(Array.from(next));
  };

  const range = usePagination({ page, totalPages, siblings: 1 });
  const showBuiltInPagination = !paginationSlot && (isInternal || isExternal) && totalPages > 1;

  return (
    <div className="table-wrapper">
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              {selectable && (
                <th
                  className={`table-head table-head-check${stickyHeader ? " table-head-sticky" : ""}`}
                >
                  <Checkboxes
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={[
                    "table-head",
                    stickyHeader ? "table-head-sticky" : "",
                    stickyFirstColumn && index === 0 ? "table-first-column" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{ width: column.width, textAlign: column.align || "left" }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

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
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {selectable && (
                    <td className="table-cell table-cell-check">
                      <Checkboxes
                        checked={isSelected}
                        onChange={(checked) => toggleRow(rowIndex, checked)}
                      />
                    </td>
                  )}
                  {columns.map((column, columnIndex) => (
                    <td
                      key={column.key}
                      className={[
                        "table-cell",
                        stickyFirstColumn && columnIndex === 0
                          ? "table-first-column"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={{ textAlign: column.align || "left" }}
                    >
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mode C — custom slot */}
      {paginationSlot && (
        <div className="table-pagination">{paginationSlot}</div>
      )}

      {/* Mode A & B — built-in pagination */}
      {showBuiltInPagination && (
        <div className="table-pagination">
          {isInternal && (
            <span className="table-pagination-info">
              {Math.min((page - 1) * pageSize! + 1, data.length)}–
              {Math.min(page * pageSize!, data.length)} of {data.length}
            </span>
          )}
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange}>
            <Pagination.Prev />
            <Pagination.List>
              {range.map((item) =>
                item === "ellipsis-start" || item === "ellipsis-end" ? (
                  <Pagination.Ellipsis key={item} />
                ) : (
                  <Pagination.Item key={item} page={item} />
                )
              )}
            </Pagination.List>
            <Pagination.Next />
          </Pagination>
        </div>
      )}
    </div>
  );
}