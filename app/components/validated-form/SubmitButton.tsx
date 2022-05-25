import type { SharedButtonProps } from "@mantine/core";
import { Button } from "@mantine/core";
import { useFormContext, useIsSubmitting } from "remix-validated-form";

export const SubmitButton = (
  props: SharedButtonProps & { label?: string }
): JSX.Element => {
  const isSubmitting = useIsSubmitting();
  const { isValid, fieldErrors } = useFormContext();
  const disabled = isSubmitting || !isValid;
  const { label } = props;

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
        {label ? label : "Submit"}
      </Button>
    </>
  );
};
