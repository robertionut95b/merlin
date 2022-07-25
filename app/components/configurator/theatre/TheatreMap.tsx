import { Checkbox } from "@mantine/core";
import type { Prisma, Seat } from "@prisma/client";
import type { ITheatreMapProps } from "../types";
import {
  addEntireRowSeats,
  addReservingSpot,
  addSpot,
  checkSpotIsAdded,
} from "../utils";

const colorByAddOrReservation = (
  row: number,
  column: number,
  seats: Prisma.SeatCreateManyTheatreInput[],
  reservedSeats: Seat[],
  reservingSeats: Seat[]
) => {
  if (checkSpotIsAdded?.(row, column, reservingSeats)) {
    return "bg-green-700 text-white hover:bg-green-500";
  } else if (checkSpotIsAdded?.(row, column, reservedSeats)) {
    return "bg-indigo-700 text-white hover:bg-indigo-500";
  } else if (checkSpotIsAdded?.(row, column, seats)) {
    return "bg-gray-700 text-white hover:bg-gray-500";
  }

  return null;
};

export default function TheatreMap({
  theatreId = "",
  readOnly,
  rows,
  columns,
  seats,
  setSeats,
  selectedRows,
  setSelectedRows,
  reservedSeats = [],
  reservingSeats = [],
  setReservingSeats,
}: ITheatreMapProps) {
  return (
    <div className="background min-h-[640px] overflow-x-auto bg-gray-900 pb-8 dark:bg-gray-200">
      <div className="screen mx-auto flex h-6 w-[97%] justify-center rounded-br-full rounded-bl-full bg-slate-700 px-2 pt-1">
        <span className="text-sm text-slate-300">Screen</span>
      </div>
      <div className="entrances my-2 flex w-full justify-between gap-2 p-2">
        <span className="w-24 rounded-lg bg-green-600 p-4 text-center text-sm text-white">
          Exit
        </span>
        <span className="w-24 rounded-lg bg-green-600 p-4 text-center text-sm text-white">
          Entrance
        </span>
      </div>
      <div className="room mx-6 mt-16 grid items-center overflow-x-auto">
        {Array(rows)
          .fill(0)
          .map((_, row) => (
            <div
              key={row}
              className={`row-${row} my-4 flex items-center justify-center gap-4`}
            >
              <Checkbox
                label={`R${row + 1}`}
                size={"sm"}
                disabled={readOnly}
                onChange={(e) => {
                  setSeats?.(addEntireRowSeats(seats, row, columns, columns));
                  setSeats?.(addEntireRowSeats(seats, row, columns, columns));
                  setSelectedRows?.((prev) => {
                    return {
                      ...prev,
                      [row]: e.target.checked,
                    };
                  });
                }}
                // @ts-expect-error("type-error")
                checked={selectedRows?.[row] || false}
              />
              {Array(columns)
                .fill(0)
                .map((__, column) => (
                  <button
                    type={"button"}
                    key={column}
                    disabled={readOnly}
                    className={`column-${column} flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-gray-700 p-4 transition-colors duration-200 hover:bg-gray-300 ${colorByAddOrReservation(
                      row,
                      column,
                      seats,
                      reservedSeats,
                      reservingSeats
                    )}`}
                    onClick={() => {
                      setSeats?.(addSpot(seats, row, column));
                      setSeats?.(addSpot(seats, row, column));
                      setReservingSeats?.(
                        addReservingSpot(
                          reservingSeats,
                          reservedSeats,
                          row,
                          column,
                          theatreId
                        )
                      );
                    }}
                  >
                    {column + 1}
                  </button>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
}
