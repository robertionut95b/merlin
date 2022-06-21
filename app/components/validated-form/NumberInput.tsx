import type { NumberInputProps } from "@mantine/core";
import { NumberInput as MantineNumberInput } from "@mantine/core";
import { useState } from "react";
import { useField } from "remix-validated-form";

type ITextInputProps = NumberInputProps & {
  name: string;
  label: string;
};

export const NumberInput: React.FC<ITextInputProps> = ({
  name,
  defaultValue,
  ...props
}) => {
  const { error, getInputProps } = useField(name);
  const [value, setValue] = useState<number>(defaultValue || 0);
  return (
    <MantineNumberInput
      {...getInputProps({ id: name })}
      {...props}
      error={error}
      value={value}
      onChange={(v) => setValue(v || defaultValue || 0)}
      defaultValue={defaultValue}
    />
  );
};
