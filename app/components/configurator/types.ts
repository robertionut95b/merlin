import type { Prisma, Seat } from "@prisma/client";

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

export type ITheatreMapProps = {
  theatreId?: string;
  readOnly?: boolean;
  selectedRows?: object;
  setSelectedRows?: React.Dispatch<React.SetStateAction<{}>>;
  reservedSeats?: Seat[];
  reservingSeats?: Seat[];
  setReservingSeats?: React.Dispatch<React.SetStateAction<Seat[]>>;
} & TheatreConfiguration;
