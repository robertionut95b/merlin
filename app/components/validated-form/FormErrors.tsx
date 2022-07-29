import { useFormContext } from "remix-validated-form";

export const FormErrors = () => {
  const { fieldErrors } = useFormContext();
  return (
    <div className="errors flex flex-col">
      {fieldErrors &&
        Object.entries(fieldErrors)?.map((err) => (
          <span className="text-xs text-red-600" key={err[0]}>
            {err[0]} - {err[1]}
          </span>
        ))}
    </div>
  );
};
