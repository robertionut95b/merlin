import { Transition } from "@remix-run/react/transition";

export function isAdding(transition: Transition): boolean {
  return (
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "create"
  );
}
