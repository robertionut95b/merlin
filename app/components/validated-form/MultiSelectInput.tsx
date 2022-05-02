import type { MultiSelectProps } from "@mantine/core";
import { MultiSelect } from "@mantine/core";
import { useState } from "react";
import { useField } from "remix-validated-form";

type IMultipleSelectInputProps = {
  name: string;
  helper?: React.ReactNode;
} & MultiSelectProps;

const MultiSelectInput = ({
  data,
  name,
  helper,
  ...props
}: IMultipleSelectInputProps): JSX.Element => {
  const { error, defaultValue } = useField(name);
  const [values, setValues] = useState<string[]>(defaultValue || []);
  return (
    <>
      {values.map((item) => (
        <input key={item} name={name} type="hidden" value={item} />
      ))}
      <MultiSelect
        data={data}
        value={values}
        onChange={setValues}
        {...props}
        error={error}
      />
      {helper && <>{helper}</>}
    </>
  );
};

export default MultiSelectInput;
