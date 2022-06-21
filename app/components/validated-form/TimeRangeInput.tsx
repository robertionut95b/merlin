import type { TimeRangeInputProps } from "@mantine/dates";
import { TimeRangeInput as MTimeRangeInput } from "@mantine/dates";
import { setDate } from "date-fns";
import differenceInMinutes from "date-fns/differenceInMinutes";
import { useState } from "react";
import { useField } from "remix-validated-form";

type ITimeRangeInputProps = TimeRangeInputProps & {
  name: string;
  label: string;
};

export const TimeRangeInput = (props: ITimeRangeInputProps) => {
  const { name, defaultValue } = props;
  const { error, validate } = useField(name);
  const [values, setValues] = useState<[Date, Date]>([
    defaultValue?.[0] || new Date(),
    defaultValue?.[1] || new Date(),
  ]);
  const startDayOfMonth = values[0].getDate();
  const endDayOfMonth = values[1].getDate();

  return (
    <>
      {values.map((item, idx) => (
        <input key={idx} name={name} type="hidden" value={item.toISOString()} />
      ))}
      <MTimeRangeInput
        {...props}
        onChange={(v) => {
          const [start, end] = v;
          // equalize dates, we only care about the time interval
          const pStart = setDate(start, startDayOfMonth);
          const pEnd = setDate(end, endDayOfMonth);
          setValues([pStart, pEnd]);
          validate();
        }}
        error={error}
        defaultValue={defaultValue}
      />
      <span className="text-xs">
        Duration: {differenceInMinutes(values[1], values[0])} min
      </span>
    </>
  );
};
