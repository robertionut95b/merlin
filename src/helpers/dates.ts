import { setHours, setMinutes } from "date-fns";
import dayjs from "dayjs";

export const isValidDate = (date: Date): boolean => {
  return (
    (date instanceof Date && !isNaN(date.valueOf())) ||
    (date instanceof Date && isFinite(date.valueOf()))
  );
};

export const validDateOrUndefined = (date: string): Date | undefined => {
  const d = new Date(date);
  return date && isValidDate(d) ? d : undefined;
};

export default function combineTimeAndDate(time: Date, date: Date) {
  if (!(date instanceof Date)) return undefined;
  if (!(time instanceof Date)) return date;

  const hour = dayjs(time).hour();
  const minute = dayjs(time).minute();

  return dayjs(date).hour(hour).minute(minute);
}

export const parseStringTime = (time: string, referenceValue?: Date): Date => {
  let newDate = new Date(referenceValue || new Date());
  const parsedTime = time.split(":");
  newDate = setHours(newDate, parseInt(parsedTime[0]));
  newDate = setMinutes(newDate, parseInt(parsedTime[1]));

  let offset = newDate.getTimezoneOffset();
  offset = Math.abs(offset / 60);
  newDate = setHours(newDate, newDate.getHours() + offset);

  return newDate;
};
