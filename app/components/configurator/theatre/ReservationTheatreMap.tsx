import type { Seat } from "@prisma/client";
import type { ITheatreMapProps } from "../types";

type IReservationTheatreMapProps = {
  theatreId?: string;
  reservedSeats?: Seat[];
  reservingSeats?: Seat[];
  setReservingSeats?: React.Dispatch<React.SetStateAction<Seat[]>>;
} & ITheatreMapProps;

export const ReservationTheatreMap = () => {};
