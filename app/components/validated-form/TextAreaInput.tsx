import type { TextareaProps } from "@mantine/core";
import { Textarea as MantineTextAreaInput } from "@mantine/core";
import { useField } from "remix-validated-form";

type ITextAreaInputProps = TextareaProps & {
  name: string;
  label: string;
};

export const TextAreaInput: React.FC<ITextAreaInputProps> = ({
  name,
  defaultValue,
  ...props
}) => {
  const { error, getInputProps } = useField(name);
  return (
    <MantineTextAreaInput
      {...getInputProps({ id: name })}
      {...props}
      error={error}
      defaultValue={defaultValue}
    />
  );
};
