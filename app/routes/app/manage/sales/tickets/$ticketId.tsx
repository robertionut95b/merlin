import { Badge } from "@mantine/core";
import type {
  Location,
  ScreenEvent,
  Screening,
  Seat,
  Theatre,
  Ticket,
  User,
} from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authorizationLoader } from "src/helpers/remix.rbac";
import TheatreLegend from "~/components/configurator/legend/theatreLegend";
import TheatreMap from "~/components/configurator/theatre/TheatreMap";
import TicketForm from "~/components/forms/TicketForm";
import { getScreeningEvents } from "~/models/screeningEvents.server";
import { getUniqueTicket } from "~/models/tickets.server";
import { getUsers } from "~/models/user.server";

export const loader: LoaderFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Read", "All"],
    objects: ["Ticket", "All"],
    loader: async ({ params }) => {
      const ticket = await getUniqueTicket({
        where: {
          id: params.ticketId,
        },
        include: {
          seats: {
            include: {
              theatre: {
                include: {
                  seats: true,
                  location: true,
                },
              },
            },
          },
        },
      });
      const users = await getUsers({});
      const screenEvents = await getScreeningEvents({
        include: {
          screening: true,
        },
      });

      return json({
        ticket,
        users,
        screenEvents,
      });
    },
  });
};

const TicketPage = (): JSX.Element => {
  const { ticket, users, screenEvents } = useLoaderData<{
    ticket?: Ticket & {
      seats: (Seat & {
        theatre: Theatre & {
          seats: Seat[];
          location: Location;
        };
      })[];
    };
    users: User[];
    screenEvents: (ScreenEvent & {
      screening: Screening;
    })[];
  }>();

  const theatre = ticket?.seats?.[0]?.theatre;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div>
        <TicketForm
          ticket={ticket}
          readOnly
          users={users}
          screenEvents={screenEvents}
        />
      </div>
      {theatre && (
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
            reservedSeats={ticket.seats}
          />
          <TheatreLegend />
        </div>
      )}
    </div>
  );
};

export default TicketPage;
