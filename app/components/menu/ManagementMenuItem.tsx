import { IMenuOptionProps } from "./ManagementMenu";
import { NavLink, useLocation } from "remix";

const ManagementMenuItem = ({
  name,
  icon,
  url,
  items,
}: IMenuOptionProps): JSX.Element => {
  const { pathname } = useLocation();

  return (
    <>
      <NavLink
        to={url}
        className={({ isActive }) =>
          `menu-item my-2 flex rounded-lg p-2 text-sm font-semibold hover:bg-gray-300 hover:text-white dark:hover:bg-indigo-700 ${
            isActive &&
            pathname.endsWith(name.toLocaleLowerCase()) &&
            "bg-indigo-700 text-white"
          }`
        }
      >
        <div className="flex items-center gap-x-2">
          {icon}
          <span>{name}</span>
        </div>
      </NavLink>
      {items && (
        <div className="flex">
          <div className="separator ml-4 w-0.5 bg-gray-700">{` `}</div>
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
