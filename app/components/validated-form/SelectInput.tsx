import type { SelectProps } from "@mantine/core";
import { Select } from "@mantine/core";
import { useField } from "remix-validated-form";

type ISelectInputProps = SelectProps & {
  name: string;
  data: {
    label: string;
    value: string;
  }[];
};

const SelectInput = ({
  data,
  name,
  ...props
}: ISelectInputProps): JSX.Element => {
  const { error, getInputProps } = useField(name);
  return (
    <Select
      {...getInputProps({ id: name, data: data })}
      data={data}
      {...props}
      error={error}
    />
  );
};

export default SelectInput;
