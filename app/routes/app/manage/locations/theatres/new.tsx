import { showNotification } from "@mantine/notifications";
import type { Address, Location } from "@prisma/client";
import { Prisma } from "@prisma/client";
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { TheatreModel } from "src/generated/zod";
import { authorizationLoader, IsAllowedAccess } from "src/helpers/remix.rbac";
import { z } from "zod";
import { zfd } from "zod-form-data";
import TheatreForm from "~/components/forms/TheatreForm";
import InputAlert from "~/components/layout/InputAlert";
import { AlertCircle } from "~/components/react-icons/AlertCircle";
import { getLocations } from "~/models/locations.server";
import { createTheatre } from "~/models/theatre.server";

const Model = TheatreModel.extend({
  capacity: z.string().transform((v) => parseInt(v)),
  seats: zfd.json(
    z
      .array(
        z.object({
          row: z.number(),
          column: z.number(),
        })
      )
      .min(1, { message: "Must have at least one seat" })
  ),
  rows: z.string().transform((v) => parseInt(v)),
  columns: z.string().transform((v) => parseInt(v)),
});

const validator = withZod(zfd.formData(Model));

export const action: ActionFunction = async ({ request }) => {
  const access = await IsAllowedAccess({
    request,
    actions: ["Create", "All"],
    objects: ["Theatre", "All"],
  });

  if (!access) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  try {
    // create theatre
    await createTheatre({
      data: {
        ...result.data,
        seats: {
          createMany: {
            data: [...result.data.seats],
          },
        },
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e?.code === "P2002") {
        throw new Response("Theatre already exists", { status: 400 });
      }
    }
    throw e;
  }

  return redirect(`app/manage/locations/theatres`);
};

export const loader: LoaderFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Create", "All"],
    objects: ["Theatre", "All"],
    loader: async () => {
      const locations = await getLocations({
        include: {
          address: true,
        },
      });

      return json({
        locations,
      });
    },
  });
};

const NewTheatresPage = (): JSX.Element => {
  const { locations } = useLoaderData<{
    locations: (Location & {
      address: Address;
    })[];
  }>();

  return <TheatreForm locations={locations} />;
};

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 400) {
    showNotification({
      title: "Invalid input",
      message: caught.data,
      autoClose: 3000,
      color: "red",
      icon: <AlertCircle size={16} />,
    });
  }

  return <NewTheatresPage />;
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <InputAlert message={error.message} />;
};

export default NewTheatresPage;
