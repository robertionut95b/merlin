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
import { IsAllowedAccess } from "src/helpers/remix.rbac";
import { z } from "zod";
import { zfd } from "zod-form-data";
import NewTheatreForm from "~/components/forms/TheatreForm";
import InputAlert from "~/components/layout/InputAlert";
import { AlertCircle } from "~/components/react-icons/AlertCircle";
import { getLocations } from "~/models/locations.server";
import NewRolePage from "../../access/roles/new";

const Model = TheatreModel.extend({
  seats: zfd.json(
    z.array(
      z.object({
        row: z.number(),
        column: z.number(),
        theatreId: z.string(),
      })
    )
  ),
});

const validator = withZod(zfd.formData(Model));

export const action: ActionFunction = async ({ request }) => {
  const access = await IsAllowedAccess({
    request,
    actions: ["Create", "All"],
    objects: ["Role", "All"],
  });

  if (!access) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  console.log(result);

  try {
    // create theatre
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

export const loader: LoaderFunction = async ({ request }) => {
  const access = await IsAllowedAccess({
    request,
    actions: ["Create", "All"],
    objects: ["Role", "All"],
  });

  if (!access) {
    return redirect("/app");
  }

  const locations = await getLocations({
    include: {
      address: true,
    },
  });

  return json({
    locations,
  });
};

const NewTheatresPage = (): JSX.Element => {
  const { locations } = useLoaderData<{
    locations: (Location & {
      address: Address;
    })[];
  }>();

  return (
    <div className="new-theatre">
      <NewTheatreForm locations={locations} />
    </div>
  );
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

  return <NewRolePage />;
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <InputAlert message={error.message} />;
};

export default NewTheatresPage;
