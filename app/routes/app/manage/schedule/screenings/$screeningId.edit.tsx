import type { Screening } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { isActionAllowed } from "src/helpers/remix.rbac";
import ScreeningForm from "~/components/forms/ScreeningForm";
import {
  getUniqueScreening,
  updateScreening,
} from "~/models/screenings.server";
import { ScreeningModelForm } from "~/models/validators/screening.validator";

export const action: ActionFunction = async ({ request }) => {
  await isActionAllowed(request, ["Update", "All"], ["Screening", "All"]);
  const validator = withZod(ScreeningModelForm);
  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  const screening = await updateScreening({
    where: {
      imdbId: result.data.imdbId,
    },
    data: {
      ...result.data,
    },
  });

  return redirect(`/app/manage/schedule/screenings/${screening.imdbId}`);
};

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
  return <ScreeningForm screening={screening} />;
}
