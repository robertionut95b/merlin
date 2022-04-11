import { Tooltip } from "@mantine/core";
import { NavLink, useLocation } from "remix";
import { IMenuOptionProps } from "./Items";

const ManagementMenuItem = ({
  name,
  icon,
  url,
  items,
  minimal,
}: IMenuOptionProps): JSX.Element => {
  const { pathname } = useLocation();

  const activeClass = (isActive: boolean) =>
    isActive &&
    pathname.endsWith(name.toLocaleLowerCase()) &&
    "bg-indigo-700 text-white";

  if (minimal) {
    return (
      <>
        <NavLink
          to={url}
          className={({ isActive }) =>
            `menu-item my-2 flex rounded-lg p-2 text-sm font-semibold hover:bg-gray-300 hover:text-white dark:hover:bg-indigo-700 ${activeClass(
              isActive
            )}`
          }
        >
          <Tooltip label={name} position="right" withArrow>
            <div className="flex items-center gap-x-2">{icon}</div>
          </Tooltip>
        </NavLink>
        {items &&
          items?.map((item, idx) => (
            <ManagementMenuItem key={idx} minimal={minimal} {...item} />
          ))}
      </>
    );
  } else
    return (
      <>
        <NavLink
          to={url}
          className={({ isActive }) =>
            `menu-item my-2 flex rounded-lg p-2 text-sm font-semibold hover:bg-gray-300 hover:text-white dark:hover:bg-indigo-700 ${activeClass(
              isActive
            )}`
          }
        >
          <div className="flex items-center gap-x-2">
            {icon}
            <span>{name}</span>
          </div>
        </NavLink>
        {items && (
          <div className="flex">
            <div className="separator ml-5 w-0.5 bg-gray-700">{` `}</div>
            <div className="menu-item-children ml-4 w-full">
              {items?.map((item, idx) => (
                <ManagementMenuItem key={idx} {...item} />
              ))}
            </div>
          </div>
        )}
      </>
    );
};

export default ManagementMenuItem;
