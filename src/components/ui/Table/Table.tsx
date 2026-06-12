import { useState } from "react";
import "./Table.css";
import Checkboxes from "../Forms/Checkboxes/Checkboxes";

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
  paginationSlot,
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
            {data.map((row, rowIndex) => {
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

      {paginationSlot && (
        <div className="table-pagination">{paginationSlot}</div>
      )}
    </div>
  );
}