import type { Row } from "react-table";

export const textFilter = (
  rows: Array<Row>,
  id: string,
  filterValue: string
) => {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue !== undefined
      ? String(rowValue)
          .toLowerCase()
          .startsWith(String(filterValue).toLowerCase())
      : true;
  });
};
