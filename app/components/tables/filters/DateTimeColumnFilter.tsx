import { DatePicker } from "@mantine/dates";
import { useState } from "react";

export function DateTimeColumnFilter({
  // @ts-expect-error("react-table-type-error")
  column: { filterValue, setFilter, Header },
}) {
  const [value, setValue] = useState<Date | undefined>(
    filterValue || undefined
  );

  return (
    <DatePicker
      label={Header}
      onChange={(date) => {
        setValue(date || undefined);
        const dateWithoutTime = date?.setHours(0, 0, 0, 0);
        setFilter(dateWithoutTime || undefined);
      }}
      value={value}
      placeholder="Select date"
    />
  );
}
