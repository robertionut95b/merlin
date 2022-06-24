import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authorizationLoader } from "src/helpers/remix.rbac";
import { getUniqueTicket } from "~/models/tickets.server";

export const loader: LoaderFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Read", "All"],
    objects: ["Ticket", "All"],
    loader: async ({ params }) => {
      const ticket = await getUniqueTicket({
        where: {
          id: params.ticketId,
        },
      });

      return json({
        ticket,
      });
    },
  });
};

const TicketPage = (): JSX.Element => {
  return <></>;
};

export default TicketPage;
