import type { Prisma } from "@prisma/client";

export const addSpot = (
  seats: Prisma.SeatUncheckedCreateInput[],
  row: number,
  column: number,
  theatreId: string
): Prisma.SeatUncheckedCreateInput[] => {
  const spot = { row, column, theatreId };
  // check if spot already exists
  if (checkSpotIsAdded(row, column, seats)) {
    // remove spot
    return seats.filter((s) => !(s.row === row && s.column === column));
  } else {
    // add spot
    return [...seats, spot];
  }
};

export const checkSpotIsAdded = (
  row: number,
  column: number,
  seats: Prisma.SeatUncheckedCreateInput[]
) => seats.some((spot) => spot.row === row && spot.column === column);

export const checkAllSeatsInRowAreAdded = (
  row: number,
  seats: Prisma.SeatUncheckedCreateInput[],
  totalCols: number
) =>
  seats.reduce((acc, curr) => (curr.row === row ? acc + 1 : acc + 0), 0) ===
  totalCols;

const checkAnySpotInRowIsAdded = (
  row: number,
  seats: Prisma.SeatUncheckedCreateInput[]
) => seats.some((spot) => spot.row === row);

export const addEntireRowSeats = (
  seats: Prisma.SeatUncheckedCreateInput[],
  row: number,
  columns: number,
  theatreId: string,
  totalCols: number
): Prisma.SeatUncheckedCreateInput[] => {
  const seatsToAdd: Prisma.SeatUncheckedCreateInput[] = [];
  // check if row already exists or if any element exists on the row
  if (
    checkAllSeatsInRowAreAdded(row, seats, totalCols) ||
    checkAnySpotInRowIsAdded(row, seats)
  ) {
    // remove row
    return seats.filter((s) => s.row !== row);
  } else {
    for (let i = 0; i < columns; i++) {
      seatsToAdd.push({
        row,
        column: i,
        createdAt: new Date(),
        updatedAt: new Date(),
        theatreId,
      });
    }
  }
  return [...seats, ...seatsToAdd];
};
