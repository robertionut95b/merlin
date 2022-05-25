import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Loader, Select } from "@mantine/core";
import type { LoaderFunction } from "@remix-run/node";
import { useState } from "react";
import { ClientOnly } from "remix-utils";
import { getTheatres } from '~/models/theatre.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { Location, ScreenEvent, Screening, Theatre } from '@prisma/client';
import { getScreeningEvents } from '~/models/screeningEvents.server';
import { endOfYear, startOfYear} from 'date-fns';
import { getScreenings } from '../../../../../models/screenings.server';
import { dayStringToNumber } from 'src/helpers/fullcalendar';

export const loader: LoaderFunction = async () => {
  const theatres = await getTheatres({
    include: {
      location: true
    }
  });

  const events = await getScreeningEvents({
    where: {
      createdAt: {
        gte: startOfYear(new Date()),
      },
      AND: {
        createdAt: {
          lt: endOfYear(new Date()),
        }
      }
    },
    include: {
      theatres: true,
      screening: {
        select: {
          title: true,
        }
      }
    }
  })

  const screenings = await getScreenings({
    where: {
      createdAt: {
        gte: startOfYear(new Date()),
      },
      AND: {
        createdAt: {
          lt: endOfYear(new Date()),
        }
      }
    }
  })

  return json({
    theatres,
    screenings,
    events,
  });
};

export default function CalendarPage() {
  const DEFAULT_SLOT_DURATION = "00:30:00";
  const [slotDuration, setSlotDuration] = useState<string>(DEFAULT_SLOT_DURATION);

  const {theatres, events, screenings} = useLoaderData<{
    theatres: (Theatre & {
      location: Location
    })[],
    screenings: Screening[],
    events: (ScreenEvent & {
      theatres: Theatre[],
      screening: {
        title: string
      }
    })[]
  }>();
  const firstTheatre = theatres?.[0];
  return (
    <>
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
              defaultValue={firstTheatre?.id}
              data={theatres.map(t => ({label: `${t.name} - ${t.location.name}`, value: t.id}))}
              />
          </div>
          <div className="screening-selector">
            <Select
              label="Screening"
              data={screenings.map(s => ({label: s.title, value: s.imdbId}))}
              />
          </div>
        </div>
              <br />
        <ClientOnly fallback={ <Loader variant='dots' />}>
          {() => (
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              height={800}
              events={events.map(e => ({
                title: e.screening.title,
                groupId: e.id,
                startTime: e.startTime,
                endTime: e.endTime,
                daysOfWeek: e.daysOfWeek.map(d => dayStringToNumber(d)),
                startRecur: e.startRecur,
                endRecur: e.endRecur,
              }))}
              buttonText={{
                day: "day",
                week: "week",
                month: "month",
              }}
              nowIndicator
              now={new Date()}
              firstDay={1}
              editable
              dayMaxEvents
              eventStartEditable
              eventDurationEditable
              eventColor="#4f46e5"
              selectable
              select={(info) => {
                console.log(info.start, info.end);
              }}
              slotDuration={slotDuration}
              scrollTime={`${new Date().getHours()}:${new Date().getMinutes()}:00`}
              slotMinTime={"09:00:00"}
              slotMaxTime={"23:00:00"}
            />
          )}
        </ClientOnly>
      </div>
    </>
  );
}
