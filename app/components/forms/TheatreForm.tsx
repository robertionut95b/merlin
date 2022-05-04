import { Button, Group, Stepper } from "@mantine/core";
import type { Location, Theatre } from "@prisma/client";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { TheatreModel } from "src/generated/zod";
import { zfd } from "zod-form-data";
import ThreatreConfig from "../configurator/TheatreConfig";
import type { SeatsConfiguration } from "../configurator/types";
import { DateTimeInput } from "../validated-form/DateTimeInput";
import SelectInput from "../validated-form/SelectInput";
import { SubmitButton } from "../validated-form/SubmitButton";
import { TextInput } from "../validated-form/TextInput";

const validator = withZod(zfd.formData(TheatreModel));

const NewTheatreForm = ({
  theatre,
  locations = [],
  readOnly,
}: {
  theatre?: Theatre;
  locations?: Location[];
  readOnly?: boolean;
}): JSX.Element => {
  const [active, setActive] = useState<number>(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [name, setName] = useState<string>(theatre?.name || "");
  const [location, setLocation] = useState<string>(theatre?.locationId || "");
  const [createdAt] = useState<Date>(theatre?.createdAt || new Date());
  const [updatedAt] = useState<Date>(theatre?.updatedAt || new Date());
  const [spots, setSpots] = useState<SeatsConfiguration[]>([]);
  const [rows, setRows] = useState<number>(3);
  const [columns, setColumns] = useState<number>(3);

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
        method={"post"}
        validator={validator}
        defaultValues={{
          name: name,
          locationId: location,
          createdAt: createdAt,
          updatedAt: updatedAt,
        }}
      >
        <Stepper
          active={active}
          onStepClick={setActive}
          breakpoint="md"
          iconSize={36}
          classNames={{
            steps: "mb-4",
          }}
        >
          <Stepper.Step
            label="Information"
            description="Base information"
            allowStepSelect={active > 0}
          >
            <div className="step-one flex flex-col gap-y-4">
              <TextInput
                required
                name={"name"}
                label="Name"
                readOnly={readOnly}
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
              />
              <SelectInput
                name="location"
                label="Location"
                data={locations.map((l) => ({ label: l.name, value: l.id }))}
                defaultValue={location}
                onChange={(val) => setLocation(val ? val : "")}
                required
              />
              <DateTimeInput
                disabled
                label="Created"
                type="date"
                name="createdAt"
              />
              <DateTimeInput
                disabled
                label="Updated"
                type="date"
                name="updatedAt"
              />
            </div>
          </Stepper.Step>
          <Stepper.Step
            label="Configuration"
            description="Spots and entrances"
            allowStepSelect={active > 1}
          >
            <ThreatreConfig
              configuration={{
                columns,
                rows,
                spots,
                setSpots,
                setRows,
                setColumns,
              }}
            />
          </Stepper.Step>
          <Stepper.Step
            label="Confirm"
            description="Confirm the build"
            allowStepSelect={active > 2}
          >
            {!readOnly && (
              <SubmitButton
                className={"place-self-start"}
                type={"submit"}
                variant="outline"
                color="indigo"
              />
            )}
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>
      </ValidatedForm>

      <Group position="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button variant="outline" onClick={nextStep}>
          Next
        </Button>
      </Group>
    </div>
  );
};

export default NewTheatreForm;
