import { endOfDay, startOfDay, toDate } from "date-fns";

export const getStartedAtEndAtDates = (date: string | null | undefined) => {
  let createdAt = undefined;
  let createdAtStart = undefined;
  let endAtStart = undefined;
  createdAt = toDate(parseInt(date || ""));
  if (createdAt && !isNaN(createdAt.getTime())) {
    createdAtStart = startOfDay(createdAt);
    endAtStart = endOfDay(createdAt);
  }
  return [createdAtStart, endAtStart];
};
