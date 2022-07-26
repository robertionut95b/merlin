import { Badge, Tabs } from "@mantine/core";
import type {
  Location,
  ScreenEvent,
  Screening,
  Seat,
  Theatre,
  User,
} from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { endOfDay, parse, startOfDay } from "date-fns";
import { useState } from "react";
import { validDateOrUndefined } from "src/helpers/dates";
import { authorizationLoader, IsAllowedAccess } from "src/helpers/remix.rbac";
import { zfd } from "zod-form-data";
import TheatreLegend from "~/components/configurator/legend/TheatreLegend";
import TheatreMap from "~/components/configurator/theatre/TheatreMap";
import TicketForm from "~/components/forms/TicketForm";
import { CalendarSVG, MovieSVG } from "~/components/tables/TableIcons";
import { getUniqueScreeningEvent } from "~/models/screeningEvents.server";
import { getSeats } from "~/models/seats.server";
import { createTicket } from "~/models/tickets.server";
import { getUsers } from "~/models/user.server";
import { ServerTicketModelForm } from "~/models/validators/ticket.validator";

export const action: ActionFunction = async ({ request }) => {
  const access = await IsAllowedAccess({
    request,
    actions: ["Create", "All"],
    objects: ["Ticket", "All"],
  });

  if (!access) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const serverValidator = withZod(zfd.formData(ServerTicketModelForm));
  const result = await serverValidator.validate(await request.formData());
  const inputSeats = result?.data?.seats || [];

  console.log(result);

  if (!result.data) {
    throw new Response("Invalid data input", {
      status: 400,
    });
  }

  const validSeats = inputSeats.map((s) => {
    const { ticketId, ...rest } = s;
    return rest;
  });

  await createTicket({
    data: {
      ...result.data,
      seats: {
        connect: validSeats.map((v) => ({
          row_column_theatreId: {
            column: v.column,
            row: v.row,
            theatreId: v.theatreId,
          },
        })),
      },
    },
  });

  return redirect(`/app/manage/sales/tickets`);
};

export const loader: LoaderFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Create", "All"],
    objects: ["Ticket", "All"],
    loader: async ({ params }) => {
      const time = params.time;
      const users = await getUsers({});
      const screenEvent = await getUniqueScreeningEvent({
        where: {
          id: params.screenEvent,
        },
        include: {
          screening: true,
          theatres: {
            include: {
              location: true,
              seats: true,
            },
          },
        },
      });

      if (!screenEvent) {
        throw new Response("Screening event not found", {
          status: 404,
        });
      }

      if (!time) {
        throw new Response("No time interval specified for this screening", {
          status: 400,
        });
      }

      if (!(validDateOrUndefined(time) instanceof Date)) {
        throw new Response("Invalid time interval", {
          status: 400,
        });
      }

      if (new Date() > new Date(time)) {
        throw new Response("Cannot book tickets for a passed event", {
          status: 403,
        });
      }

      const reservedSeats = await getSeats({
        where: {
          Ticket: {
            screenEventId: screenEvent.id,
            time: {
              gte: startOfDay(parse(time, "yyyy-MM-dd'T'HH:mm", new Date())),
              lt: endOfDay(parse(time, "yyyy-MM-dd'T'HH:mm", new Date())),
            },
          },
        },
      });

      return json({
        users,
        screenEvent,
        time,
        reservedSeats,
      });
    },
  });
};

export default function NewTicketLocationScreenEventPage() {
  const { users, screenEvent, time, reservedSeats } = useLoaderData<{
    users: User[];
    screenEvent: ScreenEvent & {
      screening: Screening;
      theatres: (Theatre & {
        location: Location;
        seats: Seat[];
      })[];
    };
    time: Date;
    reservedSeats: Seat[];
  }>();

  const theatre = screenEvent.theatres?.[0];
  const [seats, setSeats] = useState<Seat[]>([]);

  return (
    <Tabs defaultValue="base">
      <Tabs.List>
        <Tabs.Tab value="base" icon={<CalendarSVG />}>
          Base
        </Tabs.Tab>
        <Tabs.Tab value="seats" disabled={!theatre} icon={<MovieSVG />}>
          Seats
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel className="p-2" value="base">
        <TicketForm
          users={users}
          screenEvents={[screenEvent]}
          time={new Date(time)}
        >
          {seats.map((seat, idx) => (
            <input
              key={idx}
              type="hidden"
              name={"seats"}
              value={JSON.stringify(seat)}
            />
          ))}
        </TicketForm>
      </Tabs.Panel>
      {theatre && (
        <Tabs.Panel className="p-2" value="seats">
          <div className="col-span-2 flex flex-col gap-y-2">
            <h3 className="text-xl font-bold">Theatre</h3>
            <Badge
              className="self-start"
              color="indigo"
              radius="sm"
            >{`${theatre.name} - ${theatre.location.name}`}</Badge>
            <span className="text-sm font-thin">Reserved seats</span>
            <TheatreMap
              rows={theatre.rows}
              columns={theatre.columns}
              seats={theatre.seats}
              reservingSeats={seats}
              reservedSeats={reservedSeats}
              setReservingSeats={setSeats}
              theatreId={theatre.id}
            />
            <TheatreLegend />
          </div>
        </Tabs.Panel>
      )}
    </Tabs>
  );
}
