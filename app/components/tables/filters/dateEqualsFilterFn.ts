import isEqual from "date-fns/isEqual";
import type { Row } from "react-table";

export const dateEqualsFilterFn = (
  rows: Array<Row>,
  id: string,
  filterValue: Date
) => {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return isEqual(rowValue, filterValue);
  });
};
