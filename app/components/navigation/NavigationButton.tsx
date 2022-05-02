import { Link } from "@remix-run/react";

const NavigationButton = ({
  label,
  to = "#",
  active = false,
}: {
  label: string;
  to?: string;
  active?: boolean;
}): JSX.Element => {
  return (
    <Link
      className={
        active
          ? `rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white`
          : "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
      }
      to={to}
    >
      {label}
    </Link>
  );
};

export default NavigationButton;
