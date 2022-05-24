import { ObjectType } from "@prisma/client";

export interface IMenuOptionProps {
  name: string;
  icon: JSX.Element;
  url: string;
  resource: ObjectType;
  minimal?: boolean;
  items?: IMenuOptionProps[];
}

export const menuOptions: IMenuOptionProps[] = [
  {
    name: "Manage",
    icon: (
      <>
        <svg
          width="24"
          height="24"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 9.5L12 4L21 9.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 13V19.4C19 19.7314 18.7314 20 18.4 20H5.6C5.26863 20 5 19.7314 5 19.4V13"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </>
    ),
    url: "/app/manage",
    resource: ObjectType.All,
  },
  {
    name: "Locations",
    resource: ObjectType.Location,
    icon: (
      <>
        <svg
          width="24"
          height="24"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.03132 8.91684L19.508 4.58337C19.8835 4.47824 20.2294 4.82421 20.1243 5.19967L15.7908 20.6763C15.6642 21.1284 15.0407 21.1726 14.8517 20.7429L11.6034 13.3605C11.5531 13.246 11.4616 13.1546 11.3471 13.1042L3.96477 9.85598C3.53507 9.66692 3.57926 9.04342 4.03132 8.91684Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </>
    ),
    url: "/app/manage/locations",
    items: [
      {
        name: "Theatres",
        resource: ObjectType.Location,
        url: "/app/manage/locations/theatres",
        icon: (
          <svg
            width="24"
            height="24"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 14C8.10457 14 9 13.1046 9 12C9 10.8954 8.10457 10 7 10C5.89543 10 5 10.8954 5 12C5 13.1046 5.89543 14 7 14Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 14C18.1046 14 19 13.1046 19 12C19 10.8954 18.1046 10 17 10C15.8954 10 15 10.8954 15 12C15 13.1046 15.8954 14 17 14Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 9C13.1046 9 14 8.10457 14 7C14 5.89543 13.1046 5 12 5C10.8954 5 10 5.89543 10 7C10 8.10457 10.8954 9 12 9Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 19C13.1046 19 14 18.1046 14 17C14 15.8954 13.1046 15 12 15C10.8954 15 10 15.8954 10 17C10 18.1046 10.8954 19 12 19Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12ZM2 12V22"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
    ],
  },
  {
    name: "Sales",
    resource: ObjectType.Sales,
    url: "#",
    icon: (
      <>
        <svg
          width="24"
          height="24"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M15 8.5C14.315 7.81501 13.1087 7.33855 12 7.30872M9 15C9.64448 15.8593 10.8428 16.3494 12 16.391M12 7.30872C10.6809 7.27322 9.5 7.86998 9.5 9.50001C9.5 12.5 15 11 15 14C15 15.711 13.5362 16.4462 12 16.391M12 7.30872V5.5M12 16.391V18.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </>
    ),
    items: [
      {
        name: "Reservations",
        resource: ObjectType.Sales,
        url: "/app/manage/sales/reservations",
        icon: (
          <>
            <svg
              width="24"
              height="24"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 18H10.5H14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 14H7.5H8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 10H8.5H10"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 2L16.5 2L21 6.5V19"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 20.5V6.5C3 5.67157 3.67157 5 4.5 5H14.2515C14.4106 5 14.5632 5.06321 14.6757 5.17574L17.8243 8.32426C17.9368 8.43679 18 8.5894 18 8.74853V20.5C18 21.3284 17.3284 22 16.5 22H4.5C3.67157 22 3 21.3284 3 20.5Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 8.4V5.35355C14 5.15829 14.1583 5 14.3536 5C14.4473 5 14.5372 5.03725 14.6036 5.10355L17.8964 8.39645C17.9628 8.46275 18 8.55268 18 8.64645C18 8.84171 17.8417 9 17.6464 9H14.6C14.2686 9 14 8.73137 14 8.4Z"
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        ),
      },
      {
        name: "Invoices",
        resource: ObjectType.Sales,
        url: "/app/manage/sales/invoices",
        icon: (
          <>
            <svg
              width="24"
              strokeWidth="1.5"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.7143"
                stroke="currentColor"
                strokeLinecap="round"
              />
              <path
                d="M6 17L20 17"
                stroke="currentColor"
                strokeLinecap="round"
              />
              <path
                d="M6 21L20 21"
                stroke="currentColor"
                strokeLinecap="round"
              />
              <path
                d="M6 21C4.89543 21 4 20.1046 4 19C4 17.8954 4.89543 17 6 17"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M9 7L15 7" stroke="currentColor" strokeLinecap="round" />
            </svg>
          </>
        ),
      },
      {
        name: "Tickets",
        resource: ObjectType.Sales,
        url: "/app/manage/sales/tickets",
        icon: (
          <>
            <svg
              width="24"
              height="24"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 3L5 3C3.89543 3 3 3.89543 3 5L3 19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 7L17 7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 12L17 12"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 17L13 17"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        ),
      },
      {
        name: "Payments",
        resource: ObjectType.Sales,
        url: "/app/manage/sales/payments",
        icon: (
          <>
            <svg
              width="24"
              height="24"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 5H21.4C21.7314 5 22 5.26863 22 5.6V18.4C22 18.7314 21.7314 19 21.4 19H14M14 5V19M14 5H10M14 19H10M10 19H2.6C2.26863 19 2 18.7314 2 18.4V5.6C2 5.26863 2.26863 5 2.6 5H10M10 19V5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 9.84866C7 9.43457 6.58681 9.15025 6.25061 9.39198C5.49323 9.93653 5 10.8254 5 11.8294C5 12.8334 5.49323 13.7223 6.25061 14.2668C6.58681 14.5085 7 14.2243 7 13.8102C7 12.5562 7 11.3768 7 9.84866Z"
                fill="currentColor"
              />
              <path
                d="M17 9.84866C17 9.43457 17.4132 9.15025 17.7494 9.39198C18.5068 9.93653 19 10.8254 19 11.8294C19 12.8334 18.5068 13.7223 17.7494 14.2668C17.4132 14.5085 17 14.2243 17 13.8102C17 12.5562 17 11.3768 17 9.84866Z"
                fill="currentColor"
              />
            </svg>
          </>
        ),
      },
    ],
  },
  {
    name: "Schedule",
    resource: ObjectType.All,
    url: "#",
    icon: (
      <>
        <svg
          width="24"
          height="24"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 4V2M15 4V6M15 4H10.5M3 10V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V10H3Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 10V6C3 4.89543 3.89543 4 5 4H7"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 2V6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 10V6C21 4.89543 20.1046 4 19 4H18.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </>
    ),
    items: [
      {
        name: "Screenings",
        resource: ObjectType.All,
        url: "/app/manage/schedule/screenings",
        icon: (
          <>
            <svg
              width="24"
              height="24"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 8.01L7.01 7.99889"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 8.01L17.01 7.99889"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 12.01L7.01 11.9989"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 12.01L17.01 11.9989"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 16.01L7.01 15.9989"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 16.01L17.01 15.9989"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 2H3.6C3.26863 2 3 2.26863 3 2.6V21.4C3 21.7314 3.26863 22 3.6 22H7M7 2V4M7 2H17M17 2H20.4C20.7314 2 21 2.26863 21 2.6V21.4C21 21.7314 20.7314 22 20.4 22H17M17 2V4M17 22V20M17 22H7M7 22V20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        ),
      },
      {
        name: "Releases",
        resource: ObjectType.All,
        url: "/app/manage/schedule/releases",
        icon: (
          <>
            <svg
              width="24"
              height="24"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 6L12 12L18 12"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        ),
      },
      {
        name: "Calendar",
        resource: ObjectType.ScreenSchedule,
        url: "/app/manage/schedule/calendar",
        icon: (
          <svg
            width="24"
            height="24"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 4V2M15 4V6M15 4H10.5M3 10V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V10H3Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 10V6C3 4.89543 3.89543 4 5 4H7"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 2V6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 10V6C21 4.89543 20.1046 4 19 4H18.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
    ],
  },
  {
    name: "Access",
    resource: ObjectType.All,
    icon: (
      <>
        <svg
          width="24"
          strokeWidth="1.5"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.7143"
            stroke="currentColor"
            strokeLinecap="round"
          />
          <path
            d="M14 10H14.4C14.7314 10 15 10.2686 15 10.6V13.4C15 13.7314 14.7314 14 14.4 14H9.6C9.26863 14 9 13.7314 9 13.4V10.6C9 10.2686 9.26863 10 9.6 10H10M14 10V8C14 7.33333 13.6 6 12 6C10.4 6 10 7.33333 10 8V10M14 10H10"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6 17L20 17" stroke="currentColor" strokeLinecap="round" />
          <path d="M6 21L20 21" stroke="currentColor" strokeLinecap="round" />
          <path
            d="M6 21C4.89543 21 4 20.1046 4 19C4 17.8954 4.89543 17 6 17"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </>
    ),
    url: "#",
    items: [
      {
        name: "Permissions",
        resource: ObjectType.Permission,
        url: "/app/manage/access/permissions",
        icon: (
          <>
            <svg
              width="24"
              height="24"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 12H17.4C17.7314 12 18 12.2686 18 12.6V19.4C18 19.7314 17.7314 20 17.4 20H6.6C6.26863 20 6 19.7314 6 19.4V12.6C6 12.2686 6.26863 12 6.6 12H8M16 12V8C16 6.66667 15.2 4 12 4C8.8 4 8 6.66667 8 8V12M16 12H8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        ),
      },
      {
        name: "Roles",
        resource: ObjectType.Role,
        url: "/app/manage/access/roles",
        icon: (
          <>
            <svg
              width="24"
              height="24"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 20V19C1 15.134 4.13401 12 8 12V12C11.866 12 15 15.134 15 19V20"
                stroke="currentColor"
                strokeLinecap="round"
              />
              <path
                d="M13 14V14C13 11.2386 15.2386 9 18 9V9C20.7614 9 23 11.2386 23 14V14.5"
                stroke="currentColor"
                strokeLinecap="round"
              />
              <path
                d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 9C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6C15 7.65685 16.3431 9 18 9Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        ),
      },
      {
        name: "Users",
        resource: ObjectType.User,
        url: "/app/manage/access/users",
        icon: (
          <>
            <svg
              width="24"
              height="24"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 20V19C5 15.134 8.13401 12 12 12V12C15.866 12 19 15.134 19 19V20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        ),
      },
    ],
  },
  {
    name: "Settings",
    resource: ObjectType.All,
    url: "/app/manage/settings",
    icon: (
      <>
        <svg
          width="24"
          height="24"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.6224 10.3954L18.5247 7.7448L20 6L18 4L16.2647 5.48295L13.5578 4.36974L12.9353 2H10.981L10.3491 4.40113L7.70441 5.51596L6 4L4 6L5.45337 7.78885L4.3725 10.4463L2 11V13L4.40111 13.6555L5.51575 16.2997L4 18L6 20L7.79116 18.5403L10.397 19.6123L11 22H13L13.6045 19.6132L16.2551 18.5155C16.6969 18.8313 18 20 18 20L20 18L18.5159 16.2494L19.6139 13.598L21.9999 12.9772L22 11L19.6224 10.3954Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </>
    ),
    items: [
      {
        name: "Internalization",
        resource: ObjectType.All,
        url: "/app/manage/settings/locales",
        icon: (
          <>
            <svg
              width="24"
              height="24"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21.5V15.5M9 15.5V6.99654C9 6.5444 9.48113 6.25472 9.88073 6.46627L16.5505 9.99731C16.9654 10.217 16.9787 10.8067 16.5739 11.0447L9 15.5ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        ),
      },
      {
        name: "Globals",
        resource: ObjectType.All,
        url: "/app/manage/settings/globals",
        icon: (
          <>
            <svg
              width="24"
              height="24"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 6C5.55228 6 6 5.55228 6 5C6 4.44772 5.55228 4 5 4C4.44772 4 4 4.44772 4 5C4 5.55228 4.44772 6 5 6Z"
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 20C19.5523 20 20 19.5523 20 19C20 18.4477 19.5523 18 19 18C18.4477 18 18 18.4477 18 19C18 19.5523 18.4477 20 19 20Z"
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 15L15.0111 15.01"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 13L13.0111 13.01"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 11L11.0111 11.01"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.00001 9L9.01112 9.01"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.00001 7L7.01112 7.01"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 17L17.0111 17.01"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        ),
      },
    ],
  },
];
