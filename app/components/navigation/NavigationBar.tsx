import { UserButton } from "@clerk/clerk-react";
import { useMemo } from "react";
import { useLocation } from "remix";
import BurgerButton from "./BurgerButton";
import NavigationButton from "./NavigationButton";
import NavigationButtonMobile from "./NavigationButtonMobile";
import NotificationButton from "./NotificationButton";

interface INavigationItemProps {
  label: string;
  to?: string;
  active?: boolean;
}

const NavigationBar = (): JSX.Element => {
  const { pathname } = useLocation();

  const navigationItems: INavigationItemProps[] = useMemo(() => {
    return [
      {
        label: "Dashboard",
        to: "/app",
        active: pathname === "/app",
      },
      {
        label: "Manage",
        to: "/app/manage",
        active: pathname.toLowerCase().includes("/manage"),
      },
      // {
      //   label: "Users",
      //   to: "/app/users",
      //   active: pathname.toLowerCase().includes("/users"),
      // },
    ];
  }, [pathname]);

  return (
    <nav className="bg-gray-200 dark:bg-gray-800">
      <div className="px-3">
        <div className="relative flex h-14 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <BurgerButton />
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="logo flex flex-shrink-0 items-center gap-x-4">
              <img
                className="h-8 w-auto"
                src="/images/popcorn-logo.svg"
                alt="Workflow"
              />
              <h4 className="hidden text-lg font-bold tracking-wide text-white md:block">
                Merlin
              </h4>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigationItems.map((n) => (
                  <NavigationButton key={n.label} {...n} />
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <NotificationButton />
            <div className="relative ml-3 mt-1.5">
              <UserButton />
            </div>
          </div>
        </div>
      </div>
      <div className="sm:hidden" id="mobile-menu">
        <div className="space-y-2 px-2 pt-2 pb-3">
          {navigationItems.map((n) => (
            <NavigationButtonMobile key={n.label} {...n} />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
