import { useMemo } from "react";

export function DateRangeColumnFilter({
  // @ts-expect-error("react-table-type-error")
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = useMemo(() => {
    let min = preFilteredRows.length
      ? new Date(preFilteredRows[0].values[id])
      : new Date(0);
    let max = preFilteredRows.length
      ? new Date(preFilteredRows[0].values[id])
      : new Date(0);

    preFilteredRows.forEach(
      (row: { values: { [x: string]: string | number | Date } }) => {
        const rowDate = new Date(row.values[id]);

        min = rowDate <= min ? rowDate : min;
        max = rowDate >= max ? rowDate : max;
      }
    );

    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div>
      <input
        min={min.toISOString().slice(0, 10)}
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [val ? val : undefined, old[1]]);
        }}
        type="date"
        value={filterValue[0] || ""}
      />
      {" to "}
      <input
        max={max.toISOString().slice(0, 10)}
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            old[0],
            val ? val.concat("T23:59:59.999Z") : undefined,
          ]);
        }}
        type="date"
        // @ts-expect-error("react-table-type-error")
        value={filterValue[1]?.slice(0, 10) || ""}
      />
    </div>
  );
}
