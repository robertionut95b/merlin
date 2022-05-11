import { showNotification } from "@mantine/notifications";
import type { Address, Location, Seat, Theatre } from "@prisma/client";
import type { ErrorBoundaryComponent, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { IsAllowedAccess } from "src/helpers/remix.rbac";
import TheatreForm from "~/components/forms/TheatreForm";
import InputAlert from "~/components/layout/InputAlert";
import { AlertCircle } from "~/components/react-icons/AlertCircle";
import { getLocations } from "~/models/locations.server";
import { getUniqueTheatre } from "~/models/theatre.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const access = await IsAllowedAccess({
    request,
    actions: ["Read", "All"],
    objects: ["Theatre", "All"],
  });

  if (!access) {
    return redirect("/app");
  }

  const theatre = await getUniqueTheatre({
    where: {
      id: params.theatreId,
    },
    include: {
      location: true,
      seats: true,
    },
  });

  const locations = await getLocations({
    include: {
      address: true,
    },
  });

  return json({
    theatre,
    locations,
  });
};

const ViewTheatrePage = (): JSX.Element => {
  const { theatre, locations } = useLoaderData<{
    theatre: Theatre & {
      location: Location;
    } & { seats: Seat[] };
    locations: (Location & {
      address: Address;
    })[];
  }>();

  return (
    <div className="new-role">
      <TheatreForm readOnly theatre={theatre} locations={locations} />
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

  return <ViewTheatrePage />;
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <InputAlert message={error.message} />;
};

export default ViewTheatrePage;
