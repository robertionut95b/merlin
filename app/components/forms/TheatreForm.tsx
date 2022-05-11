import { Divider } from "@mantine/core";
import type { Address, Location, Seat, Theatre } from "@prisma/client";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { TheatreModel } from "src/generated/zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import ThreatreConfig from "../configurator/TheatreConfig";
import { DateTimeInput } from "../validated-form/DateTimeInput";
import SelectInput from "../validated-form/SelectInput";
import { SubmitButton } from "../validated-form/SubmitButton";
import { TextInput } from "../validated-form/TextInput";

const Model = TheatreModel.extend({
  capacity: z.string().transform((v) => parseInt(v)),
  seats: zfd.json(
    z
      .array(
        z.object({
          row: z.number(),
          column: z.number(),
        })
      )
      .min(1, { message: "Must have at least one seat" })
  ),
  rows: z.string().transform((v) => parseInt(v)),
  columns: z.string().transform((v) => parseInt(v)),
});

const validator = withZod(zfd.formData(Model));

const TheatreForm = ({
  theatre,
  locations = [],
  readOnly,
}: {
  theatre?: Theatre & { seats: Seat[] } & { location: Location };
  locations?: (Location & {
    address: Address;
  })[];
  readOnly?: boolean;
}): JSX.Element => {
  return (
    <div className="new-theatre">
      <div className="heading">
        <h3 className="mb-2 text-xl font-bold">New theatre</h3>
        <div className="sub-heading mb-2">
          <p>
            This section allows you to configure the entire setup of a theatre
            room in a location.
          </p>
        </div>
      </div>
      <ValidatedForm
        id="new-theatre-form"
        className="flex flex-col gap-y-4"
        aria-readonly={readOnly}
        method={"post"}
        validator={validator}
        defaultValues={{
          name: theatre?.name,
          locationId: theatre?.location.id,
          createdAt: theatre?.createdAt || new Date(),
          updatedAt: theatre?.updatedAt || new Date(),
          capacity: theatre?.capacity,
          seats: theatre?.seats || [],
          rows: theatre?.rows,
          columns: theatre?.columns,
        }}
      >
        <h4 className="text-lg font-bold">Base properties</h4>
        <TextInput
          required
          name={"name"}
          label="Name"
          readOnly={readOnly}
          defaultValue={theatre?.name}
        />
        <SelectInput
          name="locationId"
          label="Location"
          data={locations.map((l) => ({
            label: `${l.name} - ${l.address.street}, ${l.address.city} ${l.address.country}`,
            value: l.id,
          }))}
          defaultValue={theatre?.locationId}
          required
          disabled={readOnly}
        />
        <DateTimeInput disabled label="Created" type="date" name="createdAt" />
        <DateTimeInput disabled label="Updated" type="date" name="updatedAt" />
        <Divider />
        <ThreatreConfig
          readOnly={readOnly}
          configuration={theatre ? theatre : undefined}
        />
        {!readOnly && (
          <SubmitButton
            className={"place-self-start"}
            type={"submit"}
            variant="outline"
            color="indigo"
          />
        )}
      </ValidatedForm>
    </div>
  );
};

export default TheatreForm;
