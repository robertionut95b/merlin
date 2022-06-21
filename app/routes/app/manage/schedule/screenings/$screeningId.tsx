import type { Screening } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ScreeningForm from "~/components/forms/ScreeningForm";
import { getUniqueScreening } from "~/models/screenings.server";

export const loader: LoaderFunction = async ({ params }) => {
  const screening = await getUniqueScreening({
    where: {
      imdbId: params.screeningId,
    },
  });
  return {
    screening,
  };
};

export default function ScreeningPage() {
  const { screening } = useLoaderData<{
    screening: Screening;
  }>();
  return <ScreeningForm screening={screening} readOnly />;
}
