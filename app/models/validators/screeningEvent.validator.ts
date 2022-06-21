import type { DayOfWeek } from "@prisma/client";
import { differenceInMinutes } from "date-fns";
import { ScreenEventModel } from "src/generated/zod";
import {
  checkEventsOverlapWithTime,
  mapNumberToDays,
} from "src/helpers/fullcalendar";
import { z } from "zod";
import { getScreeningEvents } from "../screeningEvents.server";
import { getUniqueScreeningById } from "../screenings.server";

export const ScreenEventModelForm = ScreenEventModel.extend({
  timeRange: z
    .array(z.string())
    .transform((v) => [v[0], v[1]])
    .superRefine((val, ctx) => {
      const [start, end] = val;
      if (start > end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Starting time must be before ending time",
        });
      }
      const startDate = new Date(start);
      const endDate = new Date(end);
      const minutes = differenceInMinutes(endDate, startDate);
      if (minutes < 30) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Event must be at least 30 minutes long",
        });
      }
    }),
  daysOfWeek: z
    .array(z.string())
    .or(z.string())
    .transform((v) => {
      if (Array.isArray(v)) {
        return v.map((day) => mapNumberToDays(parseInt(day, 10)));
      } else {
        return mapNumberToDays(parseInt(v, 10));
      }
    }),
  startRecur: z.string().transform((v) => new Date(v)),
  endRecur: z.string().transform((v) => new Date(v)),
  theatreId: z.string(),
  pricingPolicyId: z.array(z.string()).min(1).or(z.string()),
}).passthrough();

export const ServerScreenEventModelForm = ScreenEventModelForm.refine(
  async (data) => {
    const { screeningId, timeRange } = data;
    const [start, end] = timeRange;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const minutes = differenceInMinutes(endDate, startDate);
    const screening = await getUniqueScreeningById(screeningId);
    const pauseBreak = 15;

    if (!screening) {
      throw new Response("Screening not found", { status: 404 });
    }

    // check if the time range duration is at least the same as the screening's duration (in minutes), also adding a 15 minutes break for room cleaning
    return minutes >= screening.duration + pauseBreak;
  },
  {
    message:
      "Time range must be at least the same as the screening's duration, with a 15 minutes break for room cleaning",
    path: ["timeRange"],
  }
).refine(
  async (data) => {
    // check if recurrence overlaps with other events
    const { daysOfWeek, startRecur, endRecur, theatreId, timeRange } = data;
    const startDate = new Date(startRecur);
    const endDate = new Date(endRecur);
    const [start, end] = timeRange;
    const parsedStartDate = new Date(start);
    const parsedEndDate = new Date(end);
    const daysOfWeekFilter = Array.isArray(daysOfWeek)
      ? daysOfWeek
      : [daysOfWeek];

    const events = await getScreeningEvents({
      where: {
        daysOfWeek: {
          hasSome: daysOfWeekFilter as Array<DayOfWeek> | undefined,
        },
        startRecur: {
          lte: endDate,
        },
        endRecur: {
          gte: startDate,
        },
        theatres: {
          some: {
            id: theatreId,
          },
        },
        AND: {
          NOT: {
            id: data.id,
          },
        },
      },
    });

    const overlaps = checkEventsOverlapWithTime(
      events,
      parsedStartDate,
      parsedEndDate
    );

    return !overlaps;
  },
  {
    message: "Event overlaps with other recurring events",
    path: ["daysOfWeek"],
  }
);
