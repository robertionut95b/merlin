import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Loader, Modal, Select } from "@mantine/core";
import type {
  Location,
  PricingPolicy,
  ScreenEvent,
  Screening,
  Theatre,
} from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { endOfYear, format, startOfYear } from "date-fns";
import { useMemo, useState } from "react";
import { ClientOnly } from "remix-utils";
import { validationError } from "remix-validated-form";
import { dayStringToNumber } from "src/helpers/fullcalendar";
import { authorizationLoader } from "src/helpers/remix.rbac";
import ScheduledEventForm from "~/components/forms/ScheduledEventForm";
import { getPricingPolicies } from "~/models/pricingPolicy.server";
import {
  createScreeningEvent,
  getScreeningEvents,
} from "~/models/screeningEvents.server";
import { getScreenings } from "~/models/screenings.server";
import { getTheatres } from "~/models/theatre.server";
import { ServerScreenEventModelForm } from "~/models/validators/screeningEvent.validator";

const randomColor = () => {
  const colors = [
    "#4E79A7",
    "#F28E2B",
    "#E15759",
    "#76B7B2",
    "#17becf",
    "#EDC948",
    "#B07AA1",
    "#FF9DA7",
    "#9C755F",
    "#BAB0AC",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const action: ActionFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Create", "All"],
    objects: ["ScreenEvent", "All"],
    loader: async ({ request }) => {
      // server-side additional checks
      const serverValidator = withZod(ServerScreenEventModelForm);
      const result = await serverValidator.validate(await request.formData());

      if (result.error) return validationError(result.error);

      const { timeRange, theatreId, pricingPolicyId, ...submitData } =
        result.data;
      const event = await createScreeningEvent({
        // @ts-expect-error("Prisma types")
        data: {
          ...submitData,
          startTime: format(new Date(timeRange[0]), "HH:mm:ss"),
          endTime: format(new Date(timeRange[1]), "HH:mm:ss"),
          pricingPolicy: {
            connect: Array.isArray(pricingPolicyId)
              ? pricingPolicyId.map((p) => ({ id: p }))
              : { id: pricingPolicyId },
          },
          theatres: {
            connect: {
              id: theatreId,
            },
          },
        },
      });

      return redirect(`app/manage/schedule/calendar/${event.id}`);
    },
  });
};

export const loader: LoaderFunction = async () => {
  const theatres = await getTheatres({
    include: {
      location: true,
    },
  });

  const events = await getScreeningEvents({
    where: {
      createdAt: {
        gte: startOfYear(new Date()),
      },
      AND: {
        createdAt: {
          lt: endOfYear(new Date()),
        },
      },
    },
    include: {
      theatres: true,
      screening: {
        select: {
          title: true,
        },
      },
    },
  });

  const screenings = await getScreenings({
    where: {
      createdAt: {
        gte: startOfYear(new Date()),
      },
      AND: {
        createdAt: {
          lt: endOfYear(new Date()),
        },
      },
    },
  });

  const pricingPolicies = await getPricingPolicies({});

  return json({
    theatres,
    screenings,
    events,
    pricingPolicies,
  });
};

export default function CalendarPage() {
  const DEFAULT_SLOT_DURATION = "00:30:00";
  const [slotDuration, setSlotDuration] = useState<string>(
    DEFAULT_SLOT_DURATION
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const { theatres, events, screenings, pricingPolicies } = useLoaderData<{
    theatres: (Theatre & {
      location: Location;
    })[];
    screenings: Screening[];
    events: (ScreenEvent & {
      theatres: Theatre[];
      screening: {
        title: string;
      };
    })[];
    pricingPolicies: PricingPolicy[];
  }>();

  const [selectedTheatre, setSelectedTheatre] = useState<
    typeof theatres[number] | undefined
  >(theatres?.[0]);
  const memoEvents = useMemo(
    () => events.filter((e) => e.theatres?.[0].id === selectedTheatre?.id),
    [events, selectedTheatre]
  );

  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <>
      <Modal
        opened={openModal}
        onClose={() => setOpenModal(false)}
        title="Create event"
        overlayColor={"#c3c3c3"}
        overlayOpacity={0.55}
        overlayBlur={3}
        closeOnClickOutside={false}
      >
        <ScheduledEventForm
          timeRange={[startDate, endDate]}
          screenings={screenings}
          theatres={theatres}
          theatre={selectedTheatre}
          pricingPolicies={pricingPolicies}
        />
      </Modal>
      <div className="header">
        <h3 className="mb-2 text-xl font-bold">Screenings calendar</h3>
      </div>
      <div className="content-description mb-4">
        <p>
          This section allows you to manage all screening events across multiple
          locations, theatres. You can create new events, edit existing ones, or
          delete them. Events support recurring timelines.
        </p>
      </div>
      <div className="calendar">
        <div className="options flex gap-4">
          <div className="slots-selector">
            <Select
              label="Slot duration"
              value={slotDuration}
              onChange={(v) => setSlotDuration(v || DEFAULT_SLOT_DURATION)}
              data={[
                {
                  value: "00:05:00",
                  label: "5 minutes",
                },
                {
                  value: "00:10:00",
                  label: "10 minutes",
                },
                {
                  value: "00:30:00",
                  label: "30 minutes",
                },
                {
                  value: "01:00:00",
                  label: "1 hour",
                },
              ]}
            />
          </div>
          <div className="theatre-selector">
            <Select
              label="Theatre"
              defaultValue={selectedTheatre?.id}
              data={theatres.map((t) => ({
                label: `${t.name} - ${t.location.name}`,
                value: t.id,
              }))}
              onChange={(v) => {
                setSelectedTheatre(theatres?.find((t) => t.id === v));
              }}
            />
          </div>
        </div>
        <br />
        <ClientOnly fallback={<Loader variant="dots" />}>
          {() => (
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              height={800}
              events={memoEvents.map((e) => ({
                title: e.screening.title,
                groupId: e.id,
                startTime: e.startTime,
                endTime: e.endTime,
                daysOfWeek: e.daysOfWeek.map((d) => dayStringToNumber(d)),
                startRecur: e.startRecur,
                endRecur: e.endRecur,
                color: randomColor(),
              }))}
              nowIndicator
              now={new Date()}
              firstDay={1}
              editable
              dayMaxEvents
              eventStartEditable
              eventDurationEditable
              selectable
              select={(info) => {
                setStartDate(info.start);
                setEndDate(info.end);
                setOpenModal(true);
              }}
              slotDuration={slotDuration}
              scrollTime={`${new Date().getHours()}:${new Date().getMinutes()}:00`}
              slotMinTime={"09:00:00"}
              slotMaxTime={"24:00:00"}
              eventClick={(info) =>
                navigate(`${pathname}/${info.event.groupId}`)
              }
            />
          )}
        </ClientOnly>
      </div>
    </>
  );
}
