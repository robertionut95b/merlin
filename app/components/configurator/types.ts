import type { Prisma } from "@prisma/client";

export type TheatreConfiguration = {
  rows: number;
  columns: number;
  seats: Prisma.SeatUncheckedCreateInput[];
  setSeats?: React.Dispatch<
    React.SetStateAction<Prisma.SeatUncheckedCreateInput[]>
  >;
  setRows?: React.Dispatch<React.SetStateAction<number>>;
  setColumns?: React.Dispatch<React.SetStateAction<number>>;
};
