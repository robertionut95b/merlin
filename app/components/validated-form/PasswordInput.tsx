import type { PasswordInputProps } from "@mantine/core";
import { PasswordInput as MantinePasswordInput } from "@mantine/core";
import { useField } from "remix-validated-form";

type IPasswordInputProps = PasswordInputProps & {
  name: string;
  label: string;
};

export const PasswordInput: React.FC<IPasswordInputProps> = ({
  name,
  ...props
}) => {
  const { error, getInputProps, defaultValue } = useField(name);
  return (
    <MantinePasswordInput
      {...getInputProps({ id: name })}
      {...props}
      error={error}
      defaultValue={defaultValue}
    />
  );
};
