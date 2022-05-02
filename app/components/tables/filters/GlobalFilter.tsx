import { TextInput } from "@mantine/core";
import { useState } from "react";
import type { UseGlobalFiltersInstanceProps } from "react-table";
import { useAsyncDebounce } from "react-table";

export const GlobalFilter = <T extends object>({
  className,
  // @ts-expect-error("Type error")
  globalFilter,
  setGlobalFilter,
}: UseGlobalFiltersInstanceProps<T> & { className?: string }): JSX.Element => {
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((v) => {
    setGlobalFilter(v || undefined);
  }, 500);

  return (
    <TextInput
      className={className}
      value={value || ""}
      label="Global search"
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={`Search everywhere`}
    />
  );
};
