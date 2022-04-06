import { Link } from "remix";

const NavigationButtonMobile = ({
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
          ? `block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white`
          : "block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
      }
      to={to}
    >
      {label}
    </Link>
  );
};

export default NavigationButtonMobile;
