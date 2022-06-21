import type {
  Location,
  PricingPolicy,
  ScreenEvent,
  Screening,
  Theatre,
} from "@prisma/client";
import { withZod } from "@remix-validated-form/with-zod";
import { addMonths, getDay, parse } from "date-fns";
import { ValidatedForm } from "remix-validated-form";
import { dayStringToNumber } from "src/helpers/fullcalendar";
import { zfd } from "zod-form-data";
import { ScreenEventModelForm } from "~/models/validators/screeningEvent.validator";
import {
  CalendarSVG,
  CollectionSVG,
  DolarSVG,
  MovieSVG,
} from "../tables/TableIcons";
import { DateTimeInput } from "../validated-form/DateTimeInput";
import MultiSelectInput from "../validated-form/MultiSelectInput";
import SelectInput from "../validated-form/SelectInput";
import { SubmitButton } from "../validated-form/SubmitButton";
import { TextInput } from "../validated-form/TextInput";
import { TimeRangeInput } from "../validated-form/TimeRangeInput";

interface IScheduledEventFormCreateProps {
  timeRange: [Date, Date];
  screenings: Screening[];
  theatres: (Theatre & {
    location: Location;
  })[];
  theatre?: Theatre & {
    location: Location;
  };
  pricingPolicies: PricingPolicy[];
}

interface IScheduledEventFormUpdateProps {
  event?: ScreenEvent & {
    theatres: Theatre[];
    screening: {
      title: string;
    };
    pricingPolicy: PricingPolicy[];
  };
}

const validator = withZod(zfd.formData(ScreenEventModelForm));

const ScheduledEventForm = ({
  timeRange,
  screenings = [],
  theatres = [],
  theatre,
  pricingPolicies,
  event,
}: Partial<IScheduledEventFormCreateProps> &
  Partial<IScheduledEventFormUpdateProps>) => {
  return (
    <>
      <p className="mb-4 text-sm">Add a recurring event</p>
      <ValidatedForm
        className="flex w-full flex-col gap-y-4 md:max-w-xl"
        validator={validator}
        method="post"
      >
        {event && (
          <TextInput
            className="hidden"
            name="id"
            hidden
            label={"ID"}
            defaultValue={event.id}
          />
        )}
        <TimeRangeInput
          name="timeRange"
          label="Duration"
          placeholder="Pick dates range"
          defaultValue={
            event?.startTime && event?.endTime
              ? [
                  parse(event.startTime, "HH:mm:ss", new Date()),
                  parse(event.endTime, "HH:mm:ss", new Date()),
                ]
              : timeRange
          }
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <MultiSelectInput
          name="daysOfWeek"
          label="Days in the week"
          icon={<CalendarSVG size={16} />}
          defaultValue={
            (event?.daysOfWeek &&
              event.daysOfWeek.map((d) => dayStringToNumber(d).toString())) || [
              getDay(timeRange?.[0] || new Date()).toString(),
            ]
          }
          data={[
            { value: "0", label: "Sunday" },
            { value: "1", label: "Monday" },
            { value: "2", label: "Tuesday" },
            { value: "3", label: "Wednesday" },
            { value: "4", label: "Thursday" },
            { value: "5", label: "Friday" },
            { value: "6", label: "Saturday" },
          ]}
        />
        <SelectInput
          name="screeningId"
          icon={<MovieSVG size={16} />}
          label="Screening"
          defaultValue={event?.screeningId}
          data={screenings.map((s) => ({
            value: s.imdbId,
            label: `${s.title} (${new Date(s.release).getFullYear()}) [${
              s.duration
            } min]`,
          }))}
        />
        <SelectInput
          name="theatreId"
          label="Theatre"
          icon={<CollectionSVG size={16} />}
          data={theatres.map((t) => ({
            value: t.id,
            label: `${t.name} - ${t.location.name}`,
          }))}
          defaultValue={event?.theatres?.[0].id || theatre?.id}
        />
        <MultiSelectInput
          name="pricingPolicyId"
          icon={<DolarSVG size={16} />}
          label="Prices"
          defaultValue={
            (event?.pricingPolicy && event.pricingPolicy.map((p) => p.id)) || []
          }
          data={
            pricingPolicies?.map((p) => ({
              value: p.id,
              label: `${p.price}RON - (${p.ageCategory} ${p.ticketType
                .replace("Two", "2")
                .replace("Three", "3")})`,
            })) || []
          }
        />
        <DateTimeInput
          name="startRecur"
          label="Start"
          icon={<CalendarSVG size={16} />}
          defaultValue={
            (event?.startRecur && new Date(event.startRecur)) || new Date()
          }
        />
        <DateTimeInput
          name="endRecur"
          label="End"
          icon={<CalendarSVG size={16} />}
          defaultValue={
            (event?.endRecur && new Date(event.endRecur)) ||
            addMonths(new Date(), 3)
          }
        />
        <SubmitButton className="mt-2 place-self-start" variant="outline" />
      </ValidatedForm>
    </>
  );
};

export default ScheduledEventForm;
