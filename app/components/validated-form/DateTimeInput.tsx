import type { DatePickerProps } from "@mantine/dates";
import { DatePicker } from "@mantine/dates";
import { useField } from "remix-validated-form";

type ITextInputProps = DatePickerProps & {
  name: string;
  label: string;
};

export const DateTimeInput = (props: ITextInputProps) => {
  const { name } = props;
  const { error, getInputProps } = useField(name);
  return (
    <DatePicker {...getInputProps({ id: name })} {...props} error={error} />
  );
};
