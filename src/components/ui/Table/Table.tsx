import "./Table.css";

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
}

export default function Table({
  columns,
  data,

  stickyHeader = true,

  stickyFirstColumn = false,

  striped = true,

  hoverable = true,
}: TableProps) {
  return (
    <div className="table-wrapper">
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              {columns.map(
                (column, index) => (
                  <th
                    key={column.key}
                    className={`
                      table-head
                      ${
                        stickyHeader
                          ? "table-head-sticky"
                          : ""
                      }
                      ${
                        stickyFirstColumn &&
                        index === 0
                          ? "table-first-column"
                          : ""
                      }
                    `}
                    style={{
                      width:
                        column.width,

                      textAlign:
                        column.align ||
                        "left",
                    }}
                  >
                    {column.title}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {data.map(
              (row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`
                    table-row
                    ${
                      striped
                        ? "table-row-striped"
                        : ""
                    }
                    ${
                      hoverable
                        ? "table-row-hover"
                        : ""
                    }
                  `}
                >
                  {columns.map(
                    (
                      column,
                      columnIndex
                    ) => (
                      <td
                        key={
                          column.key
                        }
                        className={`
                          table-cell
                          ${
                            stickyFirstColumn &&
                            columnIndex ===
                              0
                              ? "table-first-column"
                              : ""
                          }
                        `}
                        style={{
                          textAlign:
                            column.align ||
                            "left",
                        }}
                      >
                        {
                          row[
                            column.key
                          ]
                        }
                      </td>
                    )
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}