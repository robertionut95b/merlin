import type { ScreenEvent } from "@prisma/client";
import { areIntervalsOverlapping, getDate, parse, setDate } from "date-fns";

export const mapNumberToDays = (number: number): string => {
  switch (number) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      throw new Error("Invalid day number");
  }
};

export const dayStringToNumber = (day: string): number => {
  switch (day) {
    case "Sunday":
      return 0;
    case "Monday":
      return 1;
    case "Tuesday":
      return 2;
    case "Wednesday":
      return 3;
    case "Thursday":
      return 4;
    case "Friday":
      return 5;
    case "Saturday":
      return 6;
    default:
      throw new Error("Invalid day number");
  }
};

export const checkEventsOverlapWithTime = (
  events: ScreenEvent[],
  start: Date,
  end: Date
): boolean => {
  for (var event of events) {
    const { startTime, endTime } = event;
    if (startTime && endTime) {
      const parsedStartTime = parse(startTime, "HH:mm:ss", new Date());
      const parsedEndTime = parse(endTime, "HH:mm:ss", new Date());
      const equalizedParsedStartDate = setDate(start, getDate(parsedStartTime));
      const equalizedParsedEndtDate = setDate(end, getDate(parsedEndTime));

      if (
        areIntervalsOverlapping(
          { start: parsedStartTime, end: parsedEndTime },
          { start: equalizedParsedStartDate, end: equalizedParsedEndtDate }
        )
      ) {
        return true;
      }
    }
  }
  return false;
};
