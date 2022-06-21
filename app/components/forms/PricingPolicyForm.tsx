import type { PricingPolicy } from "@prisma/client";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { zfd } from "zod-form-data";
import { PricingPolicyModelForm } from "~/models/validators/pricingPolicy.validator";
import { NumberInput } from "../validated-form/NumberInput";
import SelectInput from "../validated-form/SelectInput";
import { SubmitButton } from "../validated-form/SubmitButton";
import { TextInput } from "../validated-form/TextInput";

const validator = withZod(zfd.formData(PricingPolicyModelForm));

interface IPricingPolicyFormProps {
  pricingPolicy?: PricingPolicy;
  readOnly?: boolean;
}

const PricingPolicyForm = ({
  pricingPolicy,
  readOnly = false,
}: IPricingPolicyFormProps): JSX.Element => {
  return (
    <>
      <ValidatedForm
        className="flex w-full flex-col gap-y-4 md:max-w-xl"
        validator={validator}
        method="post"
      >
        {pricingPolicy && (
          <TextInput
            className="hidden"
            name="id"
            hidden
            label={"ID"}
            defaultValue={pricingPolicy.id}
            disabled={readOnly}
          />
        )}
        <SelectInput
          name="ageCategory"
          label="Age category"
          required
          data={[
            { value: "Adult", label: "Adult" },
            { value: "Senior", label: "Senior" },
            { value: "Child", label: "Child" },
          ]}
          defaultValue={pricingPolicy?.ageCategory}
          disabled={readOnly}
        />
        <SelectInput
          name="ticketType"
          label="Ticket type"
          required
          data={[
            { value: "TwoD", label: "2D" },
            { value: "ThreeD", label: "3D" },
            { value: "IMAX", label: "IMAX" },
            { value: "FourD", label: "4D" },
          ]}
          defaultValue={pricingPolicy?.ticketType}
          disabled={readOnly}
        />
        <NumberInput
          name="price"
          label="Price"
          required
          min={0}
          max={999}
          defaultValue={pricingPolicy?.price}
          disabled={readOnly}
        />
        <SubmitButton
          className="mt-2 place-self-start"
          variant="outline"
          disabled={readOnly}
        />
      </ValidatedForm>
    </>
  );
};

export default PricingPolicyForm;
