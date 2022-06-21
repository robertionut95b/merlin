import type {
  Location,
  PricingPolicy,
  ScreenEvent,
  Screening,
  Theatre,
} from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { endOfYear, format, startOfYear } from "date-fns";
import { validationError } from "remix-validated-form";
import { authorizationLoader } from "src/helpers/remix.rbac";
import ScheduledEventForm from "~/components/forms/ScheduledEventForm";
import { getPricingPolicies } from "~/models/pricingPolicy.server";
import {
  getUniqueScreeningEvent,
  updateScreeningEvent,
} from "~/models/screeningEvents.server";
import { getScreenings } from "~/models/screenings.server";
import { getTheatres } from "~/models/theatre.server";
import { ServerScreenEventModelForm } from "~/models/validators/screeningEvent.validator";

export const action: ActionFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Update", "All"],
    objects: ["ScreenEvent", "All"],
    loader: async ({ request }) => {
      // server-side additional checks
      const serverValidator = withZod(ServerScreenEventModelForm);
      const result = await serverValidator.validate(await request.formData());

      if (result.error) return validationError(result.error);

      const { timeRange, theatreId, pricingPolicyId, ...submitData } =
        result.data;
      const event = await updateScreeningEvent({
        data: {
          startTime: {
            set: format(new Date(timeRange[0]), "HH:mm:ss"),
          },
          endTime: {
            set: format(new Date(timeRange[1]), "HH:mm:ss"),
          },
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
          // @ts-expect-error("Prisma types")
          daysOfWeek: {
            set: submitData.daysOfWeek,
          },
          startRecur: {
            set: submitData.startRecur,
          },
          endRecur: {
            set: submitData.endRecur,
          },
          screening: {
            connect: {
              imdbId: submitData.screeningId,
            },
          },
        },
        where: {
          id: submitData.id,
        },
      });

      return redirect(`app/manage/schedule/calendar/${event.id}/#`);
    },
  });
};

export const loader: LoaderFunction = async ({ params }) => {
  const event = await getUniqueScreeningEvent({
    where: {
      id: params.eventId,
    },
    include: {
      theatres: {
        include: {
          location: true,
        },
      },
      pricingPolicy: true,
    },
  });

  const theatres = await getTheatres({
    include: {
      location: true,
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
    screenings,
    pricingPolicies,
    event,
    theatres,
  });
};

export default function CalendarEventPage() {
  const { event, screenings, pricingPolicies, theatres } = useLoaderData<{
    event: ScreenEvent & {
      theatres: (Theatre & {
        location: Location;
      })[];
      screening: {
        title: string;
      };
      pricingPolicy: PricingPolicy[];
    };
    screenings: Screening[];
    pricingPolicies: PricingPolicy[];
    theatres: (Theatre & {
      location: Location;
    })[];
  }>();

  return (
    <div className="update-event">
      <ScheduledEventForm
        event={event}
        screenings={screenings}
        pricingPolicies={pricingPolicies}
        theatres={theatres}
        theatre={event.theatres[0]}
      />
    </div>
  );
}
