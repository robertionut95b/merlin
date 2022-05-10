import type { TextInputProps } from "@mantine/core";
import { NumberInput as MantineNumberInput } from "@mantine/core";
import { useState } from "react";
import { useField } from "remix-validated-form";

type ITextInputProps = TextInputProps & {
  name: string;
  label: string;
};

export const NumberInput: React.FC<ITextInputProps> = ({ name, ...props }) => {
  const { error, getInputProps, defaultValue } = useField(name);
  const [value, setValue] = useState<number>(defaultValue || 0);
  return (
    // @ts-expect-error("Type errors")
    <MantineNumberInput
      defaultValue={defaultValue}
      {...getInputProps({ id: name, type: "number" })}
      {...props}
      error={error}
      value={value}
      onChange={(v) => setValue(v || defaultValue || 0)}
    />
  );
};
