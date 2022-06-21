import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { isActionAllowed } from "src/helpers/remix.rbac";
import ScreeningForm from "~/components/forms/ScreeningForm";
import { createScreening } from "~/models/screenings.server";
import { ScreeningModelForm } from "~/models/validators/screening.validator";

export const action: ActionFunction = async ({ request }) => {
  await isActionAllowed(request, ["Create", "All"], ["Screening", "All"]);
  const validator = withZod(ScreeningModelForm);
  const result = await validator.validate(await request.formData());

  if (result.error) return validationError(result.error);

  const screening = await createScreening({
    data: {
      ...result.data,
    },
  });

  return redirect(`/app/manage/schedule/screenings/${screening.imdbId}`);
};

export const loader: LoaderFunction = async () => {
  return {};
};

export default function NewScreeningPage() {
  return <ScreeningForm />;
}
