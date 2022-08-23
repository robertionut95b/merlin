import type { Ticket } from ".prisma/client";
import { Button, Group } from "@mantine/core";
import type {
  Location,
  ScreenEvent,
  Screening,
  Theatre,
  User,
} from "@prisma/client";
import { useLocation } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { AuthenticityTokenInput } from "remix-utils";
import { ValidatedForm } from "remix-validated-form";
import { zfd } from "zod-form-data";
import { TicketModelForm } from "~/models/validators/ticket.validator";
import { DateTimeInput } from "../validated-form/DateTimeInput";
import { DateTimePickerInput } from "../validated-form/DateTimePickerInput";
import SelectScreenEventDate from "../validated-form/select-items/SelectScreenEventDate";
import SelectInput from "../validated-form/SelectInput";
import { SubmitButton } from "../validated-form/SubmitButton";
import { TextInput } from "../validated-form/TextInput";

const validator = withZod(zfd.formData(TicketModelForm));

export default function TicketForm({
  ticket,
  readOnly,
  users,
  screenEvents,
  time,
  children,
}: {
  ticket?: Ticket;
  readOnly?: boolean;
  users: User[];
  screenEvents: (ScreenEvent & {
    screening: Screening;
    theatres?: (Theatre & {
      location?: Location;
    })[];
  })[];
  time?: Date;
  children?: React.ReactNode;
}) {
  const [selectedScreenEvent, setSelectedScreenEvent] = useState<
    typeof screenEvents[number] | null
  >(screenEvents?.[0] || null);
  const { pathname } = useLocation();
  return (
    <>
      <div className="ticket-form">
        <div className="heading">
          <h3 className="mb-2 text-xl font-bold">Ticket</h3>
          <div className="sub-heading mb-2">
            <p>Configure the details of the ticket</p>
          </div>
        </div>
      </div>
      <ValidatedForm
        id="ticket-form"
        className="flex w-full flex-col gap-y-4 md:max-w-xl"
        aria-readonly={readOnly}
        validator={validator}
        method="post"
      >
        <AuthenticityTokenInput />
        <TextInput
          name="id"
          label="ID"
          required
          disabled
          placeholder="cl4pt5w110145k0ux4e3a91z2"
          defaultValue={ticket?.id}
        />
        <SelectInput
          name="userId"
          label="Customer"
          required
          disabled={readOnly}
          placeholder="johndoe@example.com"
          defaultValue={ticket?.userId}
          data={users.map((u) => ({
            label: u.email,
            value: u.id,
          }))}
        />
        <SelectInput
          name="screenEventId"
          label="Screen event"
          required
          searchable
          nothingFound="Nothing found"
          disabled={readOnly}
          placeholder="cl4pt7sht0232k0uxm5b1zes9"
          value={selectedScreenEvent?.id}
          onChange={(v) =>
            setSelectedScreenEvent(screenEvents.find((f) => f.id === v) || null)
          }
          defaultValue={selectedScreenEvent?.id || ticket?.screenEventId}
          itemComponent={SelectScreenEventDate}
          data={screenEvents.map((s) => ({
            label: `${s.screening.title} (${s.startTime} - ${s.endTime})`,
            value: s.id,
            description: `${s.daysOfWeek.map((st) => st + "s").join(", ")}`,
            image: s.screening.poster,
            location: `${s.theatres?.[0].name} - ${s.theatres?.[0].location?.name}`,
          }))}
          icon={
            selectedScreenEvent && (
              <img
                src={selectedScreenEvent?.screening.poster}
                alt="poster"
                width={16}
                height={16}
              />
            )
          }
        />
        <DateTimePickerInput
          name={"time"}
          label="Date"
          className="w-full"
          required
          clearable={false}
          defaultValue={time}
          readOnly={readOnly}
        />
        <DateTimeInput
          disabled
          label="Created"
          type="date"
          name="createdAt"
          defaultValue={
            ticket?.createdAt ? new Date(ticket.createdAt) : new Date()
          }
        />
        <DateTimeInput
          disabled
          label="Updated"
          type="date"
          name="updatedAt"
          defaultValue={
            ticket?.updatedAt ? new Date(ticket.updatedAt) : new Date()
          }
        />
        {children}
        <Group>
          <SubmitButton
            className="mt-2 place-self-start"
            variant="outline"
            disabled={readOnly}
          />
          <a href={`${pathname}/print`}>Print ticket</a>
          <Button variant="outline" className="mt-2" disabled={!ticket}>
            Print ticket
          </Button>
        </Group>
      </ValidatedForm>
    </>
  );
}
