import { TextInput } from "@mantine/core";
import type { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import TheatreLegend from "./legend/TheatreLegend";
import TheatreMap from "./theatre/TheatreMap";
import type { TheatreConfiguration } from "./types";
import { checkAllSeatsInRowAreAdded } from "./utils";

const ThreatreConfig = ({
  configuration,
  readOnly = false,
}: {
  configuration?: TheatreConfiguration;
  readOnly?: boolean;
}): JSX.Element => {
  const [rows, setRows] = useState<number>(configuration?.rows || 3);
  const [columns, setColumns] = useState<number>(configuration?.columns || 3);
  const [seats, setSeats] = useState<Prisma.SeatCreateManyTheatreInput[]>(
    configuration?.seats || []
  );
  const [jsonSeats, setJsonSeats] = useState<string>();
  const [selectedRows, setSelectedRows] = useState<{}>({});
  const [capacity, setCapacity] = useState<number>(rows * columns);

  useEffect(() => setCapacity(rows * columns), [rows, columns]);

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

  useEffect(() => setJsonSeats(JSON.stringify(seats)), [seats]);

  return (
    <div className="main flex flex-col gap-4">
      <div className="configurator-options flex flex-col gap-4">
        <h4 className="text-lg font-bold">Theatre map configuration</h4>
        <TextInput
          type="number"
          name="rows"
          placeholder="Number of rows"
          label="Rows"
          required
          defaultValue={rows}
          readOnly={readOnly}
          min={1}
          onChange={(e) => {
            setRows(e.target.valueAsNumber);
            configuration?.setRows?.(e.target.valueAsNumber);
          }}
        />
        <TextInput
          type="number"
          name="columns"
          placeholder="Number of columns"
          label="Columns"
          required
          defaultValue={columns}
          readOnly={readOnly}
          min={1}
          onChange={(e) => {
            setColumns(e.target.valueAsNumber);
            configuration?.setColumns?.(e.target.valueAsNumber);
          }}
        />
        <TextInput
          name="capacity"
          type={"number"}
          placeholder="Number of possible seats"
          label="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.valueAsNumber)}
          readOnly
          min={1}
        />
        <TextInput
          className="hidden"
          name="seats"
          defaultValue={jsonSeats}
          readOnly={readOnly}
        />
      </div>
      <TheatreLegend />
      <h4 className="text-lg font-bold">Map editor</h4>
      <TheatreMap
        rows={rows}
        columns={columns}
        seats={seats}
        setSeats={setSeats}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
    </div>
  );
};

export default ThreatreConfig;
