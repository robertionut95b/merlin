import type { Location, ScreenEvent, Screening, Theatre } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { addMonths, subMonths } from "date-fns";
import { authorizationLoader } from "src/helpers/remix.rbac";
import LocationTheatreForm from "~/components/forms/LocationTheatreForm";
import { getScreeningEvents } from "~/models/screeningEvents.server";
import { getTheatres } from "~/models/theatre.server";

export const loader: LoaderFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Create", "All"],
    objects: ["Ticket", "All"],
    loader: async () => {
      const screenEvents = await getScreeningEvents({
        include: {
          screening: true,
          theatres: {
            include: {
              location: true,
            },
          },
        },
        orderBy: {
          screening: {
            title: "asc",
          },
        },
        where: {
          screening: {
            release: {
              gte: subMonths(new Date(), 4),
            },
            AND: {
              release: {
                lte: addMonths(new Date(), 4),
              },
            },
          },
        },
      });
      const theatres = await getTheatres({
        include: {
          location: true,
        },
      });

      return json({
        screenEvents,
        theatres,
      });
    },
  });
};

export default function TicketCreatePage() {
  const { screenEvents, theatres } = useLoaderData<{
    screenEvents: (ScreenEvent & {
      screening: Screening;
      theatres: (Theatre & {
        location: Location;
      })[];
    })[];
    theatres: (Theatre & {
      location: Location;
    })[];
  }>();

  return (
    <LocationTheatreForm screenEvents={screenEvents} theatres={theatres} />
  );
}
