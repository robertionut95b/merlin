import type { DatePickerProps } from "@mantine/dates";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useField } from "remix-validated-form";

type IDatetInputProps = DatePickerProps & {
  name: string;
  label: string;
};

export const DateTimePickerInput = (props: IDatetInputProps) => {
  const { name } = props;
  const { error, getInputProps } = useField(name);

  return (
    <div className="date-time-input flex flex-row gap-2">
      <DatePicker {...getInputProps({ id: name })} {...props} />
      <TimeInput {...props} name={`${name}__time`} label="Time" />
      <span className="text-xs text-red-600">{error}</span>
    </div>
  );
};
