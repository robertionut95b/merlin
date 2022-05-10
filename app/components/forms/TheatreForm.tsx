import { Divider } from "@mantine/core";
import type { Address, Location, Seat, Theatre } from "@prisma/client";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { TheatreModel } from "src/generated/zod";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";
import ThreatreConfig from "../configurator/TheatreConfig";
import { DateTimeInput } from "../validated-form/DateTimeInput";
import SelectInput from "../validated-form/SelectInput";
import { SubmitButton } from "../validated-form/SubmitButton";
import { TextInput } from "../validated-form/TextInput";

const Model = TheatreModel.extend({
  id: z.string(),
  seats: zfd.json(
    z.array(
      z.object({
        row: z.number(),
        column: z.number(),
        theatreId: z.string(),
      })
    )
  ),
});

const validator = withZod(zfd.formData(Model));

const NewTheatreForm = ({
  theatre,
  locations = [],
  readOnly,
}: {
  theatre?: Theatre & { seats: Seat[] };
  locations?: (Location & {
    address: Address;
  })[];
  readOnly?: boolean;
}): JSX.Element => {
  const [theatreId] = useState(theatre?.id || uuidv4());

  return (
    <div className="new-theatre flex flex-col gap-6">
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
        className="flex flex-col gap-y-4"
        aria-readonly={readOnly}
        method={"post"}
        validator={validator}
        defaultValues={{
          id: theatre?.id || theatreId,
          name: theatre?.name,
          locationId: theatre?.locationId,
          createdAt: theatre?.createdAt || new Date(),
          updatedAt: theatre?.updatedAt || new Date(),
          capacity: 0,
          seats: theatre?.seats || [],
        }}
      >
        <h4 className="text-lg font-bold">Base properties</h4>
        <TextInput
          name="id"
          label="Id"
          defaultValue={theatreId}
          readOnly={true}
        />
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
        />
        <DateTimeInput disabled label="Created" type="date" name="createdAt" />
        <DateTimeInput disabled label="Updated" type="date" name="updatedAt" />
        <Divider />
        <ThreatreConfig theatreId={theatreId} />
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

export default NewTheatreForm;
