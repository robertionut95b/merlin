import type { Screening } from "@prisma/client";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { zfd } from "zod-form-data";
import { ScreeningModelForm } from "~/models/validators/screening.validator";
import { DateTimeInput } from "../validated-form/DateTimeInput";
import { NumberInput } from "../validated-form/NumberInput";
import { SubmitButton } from "../validated-form/SubmitButton";
import { TextAreaInput } from "../validated-form/TextAreaInput";
import { TextInput } from "../validated-form/TextInput";

const validator = withZod(zfd.formData(ScreeningModelForm));

interface IScreeningFormProps {
  screening?: Screening;
  readOnly?: boolean;
}

export default function ScreeningForm({
  screening,
  readOnly,
}: IScreeningFormProps) {
  return (
    <>
      <ValidatedForm
        className="flex w-full flex-col gap-y-4 md:max-w-xl"
        validator={validator}
        method="post"
      >
        <TextInput
          name="imdbId"
          label="IMDB Id"
          required
          readOnly={screening ? true : false}
          placeholder="tt1745960"
          defaultValue={screening?.imdbId}
          disabled={readOnly}
        />
        <TextInput
          label="Title"
          name="title"
          required
          defaultValue={screening?.title}
          placeholder="The Office"
          disabled={readOnly}
        />
        <TextAreaInput
          label="Description"
          name="description"
          required
          defaultValue={screening?.description}
          placeholder="A short description about the movie"
          minRows={4}
          disabled={readOnly}
        />
        <TextAreaInput
          label="Poster"
          name="poster"
          required
          defaultValue={screening?.poster}
          minRows={3}
          placeholder="https://m.media-amazon.com/images/M/abcd.jpg"
          icon={
            screening?.poster && (
              <a href={screening.poster}>
                <img
                  src={screening.poster}
                  alt="poster"
                  width={24}
                  height={24}
                />
              </a>
            )
          }
          disabled={readOnly}
        />
        <TextInput
          label="Rating"
          name="rating"
          required
          defaultValue={screening?.rating}
          placeholder="PG-13"
          disabled={readOnly}
        />
        <NumberInput
          label="Duration (min)"
          name="duration"
          required
          defaultValue={screening?.duration}
          min={0}
          max={999}
          disabled={readOnly}
        />
        <DateTimeInput
          name={"release"}
          label={"Release"}
          required
          disabled={readOnly}
          defaultValue={screening?.release && new Date(screening.release)}
        />
        <SubmitButton
          className="mt-2 place-self-start"
          variant="outline"
          disabled={readOnly}
        />
      </ValidatedForm>
    </>
  );
}
