import type { ButtonProps } from "@mantine/core";
import { Button } from "@mantine/core";
import { useFormContext, useIsSubmitting } from "remix-validated-form";

export const SubmitButton = (
  props: ButtonProps & { label?: string }
): JSX.Element => {
  const isSubmitting = useIsSubmitting();
  const { isValid } = useFormContext();
  const disabled = isSubmitting || !isValid;
  const { label } = props;

  return (
    <Button type="submit" disabled={disabled} loading={isSubmitting} {...props}>
      {label ? label : "Submit"}
    </Button>
  );
};
