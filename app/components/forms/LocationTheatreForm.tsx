import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { NativeSelect } from "@mantine/core";
import type { Location, ScreenEvent, Screening, Theatre } from "@prisma/client";
import { useLocation, useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { ClientOnly } from "remix-utils";
import { dayStringToNumber } from "src/helpers/fullcalendar";

export default function LocationTheatreForm({
  screenEvents,
  theatres,
}: {
  screenEvents: (ScreenEvent & {
    screening: Screening;
    theatres?: (Theatre & {
      location?: Location;
    })[];
  })[];
  theatres: (Theatre & {
    location: Location;
  })[];
}) {
  const [selectedTheatre, setSelectedTheatre] = useState<
    typeof theatres[number] | null
  >(null);
  const memoEvents = useMemo(
    () =>
      screenEvents.filter((e) => e.theatres?.[0].id === selectedTheatre?.id),
    [screenEvents, selectedTheatre]
  );
  const navigation = useNavigate();
  const location = useLocation();
  return (
    <>
      <div className="location-select">
        <div className="heading">
          <h3 className="mb-2 text-xl font-bold">Location</h3>
          <div className="sub-heading mb-2">
            <p>Choose your the theatre and movie</p>
          </div>
        </div>
        <div className="content flex flex-col gap-y-4">
          <NativeSelect
            className="md:max-w-xl"
            name="theatre"
            label="Theatre"
            placeholder="Cupertino, CA 95014"
            data={theatres.map((t) => ({
              label: `${t.name} - ${t.location.name}`,
              value: t.id,
            }))}
            value={selectedTheatre?.id}
            onChange={(e) =>
              setSelectedTheatre(
                theatres.find((th) => th.id === e.currentTarget.value) || null
              )
            }
          />
          <ClientOnly>
            {() =>
              selectedTheatre && (
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
                    color: "#4c6ef5",
                  }))}
                  nowIndicator
                  now={new Date()}
                  firstDay={1}
                  editable
                  dayMaxEvents
                  eventStartEditable
                  eventDurationEditable
                  scrollTime={`${new Date().getHours()}:${new Date().getMinutes()}:00`}
                  slotMinTime={"09:00:00"}
                  slotMaxTime={"24:00:00"}
                  eventClick={(info) => {
                    if ((info.event.start || new Date()) < new Date()) {
                      return alert("Cannot create a ticket for a passed event");
                    }
                    navigation(
                      `${location.pathname}/${info.event.groupId}/${format(
                        info.event.start || new Date(),
                        "yyyy-MM-dd'T'HH:mm"
                      )}`
                    );
                  }}
                />
              )
            }
          </ClientOnly>
        </div>
      </div>
    </>
  );
}
