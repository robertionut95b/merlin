import { TextInput } from "@mantine/core";
import { useState } from "react";
import type { Column } from "react-table";
import { useAsyncDebounce } from "react-table";

export const DefaultColumnFilter = ({
  // @ts-expect-error("react-table-types")
  column: { filterValue, setFilter, Header },
}: {
  column: Column;
}): JSX.Element => {
  const [value, setValue] = useState(filterValue);
  const onChange = useAsyncDebounce((v) => {
    setFilter(v || undefined);
  }, 1000);

  return (
    <TextInput
      value={value || ""}
      label={Header}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={`Search by ${Header}`}
    />
  );
};
