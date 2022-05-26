import { Menu } from "@mantine/core";
import { NavLink, useLocation } from "@remix-run/react";
import type { IMenuOptionProps } from "./Items";

const SidebarItem = ({
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
      <Menu
        trigger="hover"
        position="right"
        control={
          <NavLink
            to={url}
            className={`menu-item my-2 flex rounded-lg p-1.5 text-sm font-semibold hover:bg-gray-300 hover:text-white dark:hover:bg-indigo-700`}
          >
            {icon}
          </NavLink>
        }
      >
        <Menu.Label> {name}</Menu.Label>
        {items?.map((item, idx) => (
          <NavLink to={item.url} key={idx} prefetch="intent">
            <Menu.Item
              className={`hover:bg-gray-300 hover:text-white dark:hover:bg-indigo-700`}
              icon={item.icon}
            >
              {item.name}
            </Menu.Item>
          </NavLink>
        ))}
      </Menu>
    );
  } else
    return (
      <>
        <NavLink
          to={url}
          prefetch="intent"
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
                <SidebarItem key={idx} {...item} />
              ))}
            </div>
          </div>
        )}
      </>
    );
};

export default SidebarItem;
