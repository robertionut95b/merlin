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
