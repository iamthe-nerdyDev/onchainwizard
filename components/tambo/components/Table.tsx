"use client";

import React from "react";

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  width?: string | number;
}

interface TableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  onRowClick?: (row: T, index: number) => void;
  onSort?: (key: keyof T, direction: "asc" | "desc") => void;
  loading?: boolean;
  emptyMessage?: string;
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
}

interface SortState<T> {
  key: keyof T | null;
  direction: "asc" | "desc";
}

function Table<T extends Record<string, any>>(props: TableProps<T>) {
  const {
    data = [],
    columns = [],
    className = "",
    headerClassName = "",
    rowClassName = "",
    onRowClick,
    onSort,
    loading = false,
    emptyMessage = "No data available",
    striped = false,
    bordered = false,
    hover = false,
  } = props;

  const parsedData = React.useMemo(() => {
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === "string") {
      try {
        // Try to parse as JSON string array
        const jsonString = data.join("");
        return JSON.parse(jsonString);
      } catch {
        return [];
      }
    }

    return data;
  }, [data, columns]);

  const [sortState, setSortState] = React.useState<SortState<T>>({
    key: null,
    direction: "asc",
  });

  // Handle column sorting
  const handleSort = (key: keyof T) => {
    const newDirection =
      sortState.key === key && sortState.direction === "asc" ? "desc" : "asc";
    setSortState({ key, direction: newDirection });
    onSort?.(key, newDirection);
  };

  // Get row class name
  const getRowClassName = (row: T, index: number): string => {
    let classes = "border-b border-gray-200";

    if (striped && index % 2 === 1) {
      classes += " bg-gray-50";
    }

    if (hover) {
      classes += " hover:bg-gray-100 transition-colors";
    }

    if (onRowClick) {
      classes += " cursor-pointer";
    }

    if (typeof rowClassName === "function") {
      classes += " " + rowClassName(row, index);
    } else if (typeof rowClassName === "string") {
      classes += " " + rowClassName;
    }

    return classes;
  };

  // Render cell content
  const renderCell = (column: Column<T>, row: T, index: number) => {
    const value = row[column.key];

    if (column.render) {
      return column.render(value, row, index);
    }

    // Handle different data types
    if (value === null || value === undefined) {
      return <span className="text-gray-400">?</span>;
    }

    if (typeof value === "boolean") {
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      );
    }

    if (typeof value === "number") {
      return <span className="font-mono">{value.toLocaleString()}</span>;
    }

    if ((value as any) instanceof Date) {
      return <span className="font-mono">{value.toLocaleDateString()}</span>;
    }

    return String(value);
  };

  const SortIcon = ({ column }: { column: Column<T> }) => {
    if (!column.sortable) return null;

    const isActive = sortState.key === column.key;
    const direction = isActive ? sortState.direction : null;

    return (
      <span className="ml-2 inline-flex flex-col">
        <svg
          className={`w-3 h-3 ${
            direction === "asc" ? "text-blue-600" : "text-gray-400"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 6L6 10h8l-4-4z" />
        </svg>
        <svg
          className={`w-3 h-3 -mt-1 ${
            direction === "desc" ? "text-blue-600" : "text-gray-400"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 14l4-4H6l4 4z" />
        </svg>
      </span>
    );
  };

  const tableClasses = `
  w-full bg-white
  ${bordered ? "border border-gray-200 rounded-lg" : ""}
  ${className}
`.trim();

  return (
    <div className="overflow-x-auto max-w-[100%] w-max">
      <table className={tableClasses}>
        <thead className={`bg-gray-50 ${headerClassName}`}>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`
                px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                ${column.sortable ? "cursor-pointer hover:bg-gray-100 select-none" : ""}
                ${column.headerClassName || ""}
              `.trim()}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center">
                  {column.header}
                  <SortIcon column={column} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-500">Loading...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            parsedData.map((row: any, index: number) => (
              <tr
                key={index}
                className={getRowClassName(row, index)}
                onClick={() => onRowClick?.(row, index)}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                      column.className || ""
                    }`}
                  >
                    {renderCell(column, row, index)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
