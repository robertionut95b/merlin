import type { SelectProps } from "@mantine/core";
import { Select } from "@mantine/core";
import type { ReactNode } from "react";
import { useField } from "remix-validated-form";

type ISelectInputProps = SelectProps & {
  name: string;
  data: {
    label: string;
    value: string;
  }[];
  helper?: ReactNode;
};

const SelectInput = ({
  data,
  name,
  helper,
  ...props
}: ISelectInputProps): JSX.Element => {
  const { error, getInputProps } = useField(name);
  return (
    <>
      <Select
        {...getInputProps({ id: name, data: data })}
        data={data}
        {...props}
        error={error}
      />
      {helper && <>{helper}</>}
    </>
  );
};

export default SelectInput;
