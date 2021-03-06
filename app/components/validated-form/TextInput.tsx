import { useField } from "remix-validated-form";
import type { TextInputProps } from "@mantine/core";
import { TextInput as MantineTextInput } from "@mantine/core";

type ITextInputProps = TextInputProps & {
  name: string;
  label: string;
};

export const TextInput: React.FC<ITextInputProps> = ({ name, ...props }) => {
  const { error, getInputProps, defaultValue } = useField(name);
  return (
    <MantineTextInput
      defaultValue={defaultValue}
      {...getInputProps({ id: name })}
      {...props}
      error={error}
    />
  );
};
