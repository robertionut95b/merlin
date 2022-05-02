import { useField } from "remix-validated-form";
import type { DatePickerProps } from "@mantine/dates";
import { DatePicker } from "@mantine/dates";

type ITextInputProps = DatePickerProps & {
  name: string;
  label: string;
};

export const DateTimeInput = (props: ITextInputProps) => {
  const { name } = props;
  const { error, getInputProps, defaultValue } = useField(name);
  return (
    <DatePicker
      {...getInputProps({ id: name })}
      defaultValue={new Date(defaultValue) || new Date()}
      {...props}
      error={error}
    />
  );
};
