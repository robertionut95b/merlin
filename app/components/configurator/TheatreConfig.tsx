import { Checkbox, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import type { SeatsConfiguration, TheatreConfiguration } from "./types";
import {
  addEntireRowSeats,
  addSpot,
  checkAllSeatsInRowAreAdded,
  checkSpotIsAdded,
} from "./utils";

const ThreatreConfig = ({
  configuration,
}: {
  configuration?: TheatreConfiguration;
}): JSX.Element => {
  const [rows, setRows] = useState<number>(configuration?.rows || 3);
  const [columns, setColumns] = useState<number>(configuration?.columns || 3);
  const [seats, setSeats] = useState<SeatsConfiguration[]>(
    configuration?.spots || []
  );
  const [selectedRows, setSelectedRows] = useState<{}>({});

  useEffect(() => {
    Array(rows)
      .fill(0)
      .forEach((_, index) => {
        setSelectedRows((prev) => {
          return {
            ...prev,
            [index]: false,
          };
        });
      });
  }, [rows]);

  useEffect(() => {
    Array(rows)
      .fill(0)
      .forEach((_, index) => {
        const rowIsAllSelected = checkAllSeatsInRowAreAdded(
          index,
          seats,
          columns
        );
        setSelectedRows((prev) => {
          return {
            ...prev,
            [index]: rowIsAllSelected,
          };
        });
      });
  }, [columns, rows, seats]);

  return (
    <div className="main flex flex-col gap-4">
      <div className="configurator-options flex flex-col gap-4">
        <h4 className="text-lg font-bold">Base specifications</h4>
        <TextInput
          type="number"
          name="rows"
          placeholder="Number of rows"
          label="Rows"
          required
          defaultValue={rows}
          min={1}
          onChange={(e) => {
            setRows(Number(e.target.value));
            configuration?.setRows?.(Number(e.target.value));
          }}
        />
        <TextInput
          type="number"
          name="columns"
          placeholder="Number of columns"
          label="Columns"
          required
          defaultValue={columns}
          min={1}
          onChange={(e) => {
            setColumns(Number(e.target.value));
            configuration?.setColumns?.(Number(e.target.value));
          }}
        />
      </div>
      <div className="legend mt-2 flex flex-col gap-4">
        <h4 className="text-lg font-bold">Legend</h4>
        <div className="legend-seats-items flex flex-col gap-4 md:flex-row md:items-center">
          <div className="free-seat rounded-lg border border-dashed border-gray-700 p-2">
            <span className="text-sm">Free space</span>
          </div>
          <div className="legend-configured-seat rounded-lg border border-dashed border-gray-700 bg-gray-700 p-2 text-white">
            <span className="text-sm">Configured space</span>
          </div>
          <div className="legend-entrance-exit">
            <span className="rounded-lg bg-green-600 p-2 text-sm text-white">
              Exit/Entrance
            </span>
          </div>
          <div className="legend-screen">
            <span className="rounded-full bg-slate-700 p-3 text-sm text-slate-300">
              Screen
            </span>
          </div>
        </div>
        <p className="text-sm">
          Free spaces can be considered as hallways, as long as they traverse
          through the entire width or height of the room
        </p>
      </div>
      <h4 className="text-lg font-bold">Map editor</h4>
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
                  onChange={(e) => {
                    setSeats(addEntireRowSeats(seats, row, columns, columns));
                    configuration?.setSpots?.(
                      addEntireRowSeats(seats, row, columns, columns)
                    );
                    setSelectedRows((prev) => {
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
                      key={column}
                      className={`column-${column} flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-gray-700 p-4 transition-colors duration-200 hover:bg-gray-400 ${
                        checkSpotIsAdded(row, column, seats)
                          ? "bg-gray-700 text-white"
                          : null
                      }`}
                      onClick={() => {
                        setSeats(addSpot(seats, row, column));
                        configuration?.setSpots?.(addSpot(seats, row, column));
                      }}
                    >
                      {column + 1}
                    </button>
                  ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ThreatreConfig;
