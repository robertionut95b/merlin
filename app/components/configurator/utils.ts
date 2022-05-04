import type { SeatsConfiguration } from "./types";

export const addSpot = (
  seats: SeatsConfiguration[],
  row: number,
  column: number
): SeatsConfiguration[] => {
  const spot = { row, column };
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
  seats: SeatsConfiguration[]
) => seats.some((spot) => spot.row === row && spot.column === column);

export const checkAllSeatsInRowAreAdded = (
  row: number,
  seats: SeatsConfiguration[],
  totalCols: number
) =>
  seats.reduce((acc, curr) => (curr.row === row ? acc + 1 : acc + 0), 0) ===
  totalCols;

const checkAnySpotInRowIsAdded = (row: number, seats: SeatsConfiguration[]) =>
  seats.some((spot) => spot.row === row);

export const addEntireRowSeats = (
  seats: SeatsConfiguration[],
  row: number,
  columns: number,
  totalCols: number
): SeatsConfiguration[] => {
  const seatsToAdd: SeatsConfiguration[] = [];
  // check if row already exists or if any element exists on the row
  if (
    checkAllSeatsInRowAreAdded(row, seats, totalCols) ||
    checkAnySpotInRowIsAdded(row, seats)
  ) {
    // remove row
    return seats.filter((s) => s.row !== row);
  } else {
    for (let i = 0; i < columns; i++) {
      seatsToAdd.push({ row, column: i });
    }
  }
  return [...seats, ...seatsToAdd];
};
