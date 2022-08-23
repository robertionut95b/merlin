import { TextInput } from "@mantine/core";
import type { DatePickerProps } from "@mantine/dates";
import { DatePicker } from "@mantine/dates";
import { getHours, getMinutes } from "date-fns";
import { useField } from "remix-validated-form";

type IDatetInputProps = DatePickerProps & {
  name: string;
  label: string;
};

export const DateTimePickerInput = (props: IDatetInputProps) => {
  const { name, defaultValue, readOnly, disabled } = props;
  const { error, getInputProps } = useField(name);

  return (
    <div className="date-time-input flex flex-row gap-2">
      <DatePicker {...getInputProps({ id: name })} {...props} />
      <TextInput
        name={`${name}__time`}
        defaultValue={
          defaultValue
            ? `${getHours(defaultValue)}:${getMinutes(defaultValue)}`
            : undefined
        }
        label="Time"
        readOnly={readOnly}
        disabled={disabled}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
};
