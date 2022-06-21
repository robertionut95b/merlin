import type { TextInputProps } from "@mantine/core";
import { TextInput as MantineTextInput } from "@mantine/core";
import { useField } from "remix-validated-form";

type ITextInputProps = TextInputProps & {
  name: string;
  label: string;
};

export const TextInput: React.FC<ITextInputProps> = ({
  name,
  defaultValue,
  ...props
}) => {
  const { error, getInputProps } = useField(name);
  return (
    <MantineTextInput
      {...getInputProps({ id: name })}
      {...props}
      error={error}
      defaultValue={defaultValue}
    />
  );
};
