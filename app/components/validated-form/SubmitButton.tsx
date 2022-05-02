import { useFormContext, useIsSubmitting } from "remix-validated-form";
import type { SharedButtonProps } from "@mantine/core";
import { Button } from "@mantine/core";

export const SubmitButton = (props: SharedButtonProps): JSX.Element => {
  const isSubmitting = useIsSubmitting();
  const { isValid, fieldErrors } = useFormContext();
  const disabled = isSubmitting || !isValid;

  return (
    <>
      {fieldErrors &&
        Object.entries(fieldErrors)?.map((err) => (
          <span className="text-xs text-red-700" key={err[0]}>
            {err[0]} - {err[1]}
          </span>
        ))}
      <Button
        type="submit"
        disabled={disabled}
        loading={isSubmitting}
        {...props}
      >
        Submit
      </Button>
    </>
  );
};
