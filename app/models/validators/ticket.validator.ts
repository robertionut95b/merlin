import { isSameHour, isSameMinute, parse } from "date-fns";
import { SeatModel, TicketModel } from "src/generated/zod";
import { parseStringTime } from "src/helpers/dates";
import * as z from "zod";
import { zfd } from "zod-form-data";
import {
  getBookedSeatsForEvent,
  getUniqueScreeningEvent,
} from "../screeningEvents.server";

const SeatModelWithDates = SeatModel.extend({
  createdAt: z.string().transform((v) => new Date(v)),
  updatedAt: z.string().transform((v) => new Date(v)),
});

export const TicketModelForm = TicketModel.extend({
  time: z.string().transform((v) => parse(v, "LLLL dd, yyyy", new Date())),
  time__time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time value, must follow HH:mm format",
  }),
  // seats: zfd.repeatableOfType(SeatModel),
  seats: zfd.json(
    zfd.repeatable(
      z
        .array(zfd.json(SeatModelWithDates))
        .min(1, "There must be at least one booked seat")
    )
  ),
}).superRefine(async (val, ctx) => {
  const eventTime = parseStringTime(val.time__time, val.time);
  if (new Date() >= eventTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["time"],
      message: "Cannot book a ticket for a passed screening event",
    });
  }
});

export const ServerTicketModelForm = TicketModelForm.refine(
  async (data) => {
    const seats = await getBookedSeatsForEvent(data.screenEventId, data.time);
    let valid = false;
    seats.forEach((s) => {
      const inputSeats = data.seats;
      valid = inputSeats.some((v) => v.column === s.column && v.row === s.row);
    });

    return !valid;
  },
  {
    message: "Seat(s) are already booked",
    path: ["seats"],
  }
).refine(
  async (data) => {
    const screeningEvent = await getUniqueScreeningEvent({
      where: {
        id: data.screenEventId,
      },
    });

    if (screeningEvent && screeningEvent.startTime) {
      const startTime = parse(screeningEvent.startTime, "HH:mm:ss", new Date());
      const valTime = parseStringTime(data.time__time, data.time);

      return isSameHour(startTime, valTime) && isSameMinute(startTime, valTime);
    }

    return false;
  },
  {
    message: "Starting time does not match the event",
    path: ["time"],
  }
);
