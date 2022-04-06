import { Breadcrumbs } from "@mantine/core";
import { Link, useMatches } from "remix";
import { capitalizeFirstLetter } from "src/helpers/capitalize";

const PageBreadcrumbs = (): JSX.Element => {
  const matches = useMatches();

  const mpaths = matches
    .filter((m) => m.pathname !== "/")
    .filter((m) => m.pathname !== "/app")
    .map((m) => ({
      pathname: m.pathname,
      label: capitalizeFirstLetter(m.pathname.split("/").pop() || ""),
    }));

  const paths = mpaths.map(({ pathname, label }, idx) => (
    <Link key={idx} to={pathname}>
      {label}
    </Link>
  ));

  return (
    <div
      className={"flex rounded-lg border border-gray-200 bg-gray-50 py-3 px-5"}
      aria-label="Breadcrumb"
    >
      <Breadcrumbs
        separator={
          <svg
            className="h-5 w-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        }
        classNames={{
          root: "flex items-center",
          breadcrumb: "text-sm font-medium text-gray-700 hover:text-gray-500",
        }}
      >
        {paths}
      </Breadcrumbs>
    </div>
  );
};

export default PageBreadcrumbs;
