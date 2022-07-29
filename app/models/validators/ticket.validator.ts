import { parse } from "date-fns";
import { SeatModel, TicketModel } from "src/generated/zod";
import * as z from "zod";
import { zfd } from "zod-form-data";
import { getBookedSeatsForEvent } from "../screeningEvents.server";

const SeatModelWithDates = SeatModel.extend({
  createdAt: z.string().transform((v) => new Date(v)),
  updatedAt: z.string().transform((v) => new Date(v)),
});

export const TicketModelForm = TicketModel.extend({
  time: z.string().transform((v) => parse(v, "LLLL dd, yyyy", new Date())),
  // seats: zfd.repeatableOfType(SeatModel),
  seats: zfd.json(
    zfd.repeatable(
      z
        .array(zfd.json(SeatModelWithDates))
        .min(1, "There must be at least one booked seat")
    )
  ),
}).superRefine(async (val, ctx) => {
  console.log(val.time);
  if (new Date() >= val.time) {
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
);
