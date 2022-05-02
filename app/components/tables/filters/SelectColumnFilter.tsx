import { useMemo } from "react";

export function SelectColumnFilter({
  // @ts-expect-error("react-table-type-error")
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => {
    const o = new Set();
    // @ts-expect-error("react-table-type-error")
    preFilteredRows.forEach((row) => {
      o.add(row.values[id]);
    });
    return [...o.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        // @ts-expect-error("react-table-type-error")
        <option key={i} value={option}>
          {/* @ts-expect-error("react-table-type-error")  */}
          {option}
        </option>
      ))}
    </select>
  );
}
