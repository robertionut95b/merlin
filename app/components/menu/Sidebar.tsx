import { Collapse } from "@mantine/core";
import { useEffect, useState } from "react";
import type { IMenuOptionProps } from "./Items";
import ManagementMenuItem from "./SidebarItem";

const SideBar = ({ options }: { options: IMenuOptionProps[] }): JSX.Element => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCollapsed(localStorage.getItem("sidebar-collapsed") === "true");
    }
  }, []);

  return (
    <aside className="h-full">
      <div className="hidden h-full md:block">
        <div className={`flex h-full flex-col justify-between`}>
          <div
            className={`overflow-y-auto transition-width duration-200 ease-out ${
              collapsed ? "min-w-min" : "w-56"
            }`}
          >
            {options.map((option, idx) => (
              <ManagementMenuItem key={idx} {...option} minimal={collapsed} />
            ))}
          </div>
          <button
            className="mt-4 flex w-full justify-center self-end rounded-md border border-indigo-800 bg-indigo-700 text-white"
            onClick={() => {
              setCollapsed(!collapsed);
              localStorage.setItem("sidebar-collapsed", String(!collapsed));
            }}
          >
            {collapsed ? (
              <svg
                width="24"
                height="24"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 6L15 12L9 18"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <div className="flex items-center">
                <svg
                  width="24"
                  height="24"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 6L9 12L15 18"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm">Collapse sidebar</span>
              </div>
            )}
          </button>
        </div>
      </div>
      <div className="block md:hidden">
        <Collapse in={collapsed} transitionDuration={500}>
          {options.map((option, idx) => (
            <ManagementMenuItem key={idx} {...option} />
          ))}
        </Collapse>
        <div className="btn-collapse flex justify-center">
          <button
            className="mt-2 flex w-full items-center justify-center rounded bg-indigo-700 text-center text-white"
            onClick={() => setCollapsed(!collapsed)}
          >
            {!collapsed ? (
              <svg
                width="24"
                height="24"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 15L12 9L18 15"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
