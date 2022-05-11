import type { Prisma } from "@prisma/client";

export type TheatreConfiguration = {
  rows: number;
  columns: number;
  seats: Prisma.SeatCreateManyTheatreInput[];
  setSeats?: React.Dispatch<
    React.SetStateAction<Prisma.SeatCreateManyTheatreInput[]>
  >;
  setRows?: React.Dispatch<React.SetStateAction<number>>;
  setColumns?: React.Dispatch<React.SetStateAction<number>>;
};
