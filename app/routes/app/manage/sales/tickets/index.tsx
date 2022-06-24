import { useModals } from "@mantine/modals";
import type { Ticket } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import type { PaginatedResult } from "prisma-pagination";
import { useMemo } from "react";
import type { Column } from "react-table";
import { getResourceFiltersOperatorValue } from "src/helpers/remix-action-loaders";
import { authorizationLoader } from "src/helpers/remix.rbac";
import DataAlert from "~/components/layout/DataAlert";
import DateFilter from "~/components/tables/filters/DateFilter";
import type { UseFiltersColumnOptionsWithOptionsList } from "~/components/tables/filters/filters.types";
import Table from "~/components/tables/Table";
import { getTicketsWithPagination } from "~/models/tickets.server";

export const loader: LoaderFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Read", "All"],
    objects: ["Ticket", "All"],
    loader: async (arg) => {
      const { request } = arg;
      const url = new URL(request.url);
      const queryParams = url.searchParams;
      const page = parseInt(queryParams.get("p") || "0");

      // filters area
      const filters = getResourceFiltersOperatorValue(request);
      const [idOp, idV] = filters.get("id");

      const { data, meta } = await getTicketsWithPagination(
        {
          where: {
            id: {
              [idOp]: idV,
              mode: "insensitive",
            },
          },
          include: {
            user: {
              select: {
                email: true,
              },
            },
            ScreenEvent: {
              select: {
                screening: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
        {
          page,
        }
      );

      return json({
        tickets: data,
        meta,
      });
    },
  });
};

const TicketsPage = (): JSX.Element => {
  const {
    tickets,
    meta: { total, perPage, lastPage },
  } = useLoaderData<{
    tickets: (Ticket & {
      user: {
        email: string;
      };
      ScreenEvent: {
        screening: {
          title: string;
        };
      };
    })[];
    meta: PaginatedResult<Ticket>["meta"];
  }>();
  const modals = useModals();

  const columns: (Column & UseFiltersColumnOptionsWithOptionsList<object>)[] =
    useMemo(
      () => [
        {
          Header: "Id",
          accessor: "id",
        },
        {
          Header: "Seats",
          accessor: "seats",
          Cell: () => "[See details]",
        },
        {
          Header: "User",
          accessor: "user.email",
        },
        {
          Header: "Screening",
          accessor: "ScreenEvent.screening.title",
        },
        {
          Header: "Time",
          accessor: "time",
          Cell: (row: any) => format(parseISO(row.value), "dd MMM yy HH:mm"),
          Filter: DateFilter,
          filter: "dateFilter",
        },
        {
          Header: "Created",
          accessor: "createdAt",
          Cell: (row: any) => format(parseISO(row.value), "yyyy-MM-dd HH:mm"),
          Filter: DateFilter,
          filter: "dateFilter",
        },
        {
          Header: "Updated",
          accessor: "updatedAt",
          Cell: (row: any) => format(parseISO(row.value), "yyyy-MM-dd HH:mm"),
          Filter: DateFilter,
          filter: "dateFilter",
        },
      ],
      []
    );

  return (
    <>
      <div className="header">
        <h3 className="mb-2 text-xl font-bold">Tickets</h3>
      </div>
      <div className="content-description">
        <p>
          This section allows you to create tickets for runnning screening
          events.
        </p>
        <br />
      </div>
      <div className="tickets">
        <Table
          columns={columns}
          data={tickets}
          pagination={{
            pageSize: perPage,
            pageCount: lastPage,
            total,
          }}
          selection={{
            onDelete: (_row) =>
              modals.openConfirmModal({
                title: "Delete ticket",
                centered: true,
                confirmProps: {
                  variant: "light",
                  color: "red",
                },
                children: (
                  <span className="my-2 text-sm">
                    Are you sure you want to delete this item?
                  </span>
                ),
                labels: { confirm: "Confirm", cancel: "Cancel" },
                onCancel: () => null,
                onConfirm: () => null,
              }),
            onDeleteMany: (_rows) =>
              modals.openConfirmModal({
                title: "Delete tickets",
                centered: true,
                confirmProps: {
                  variant: "light",
                  color: "red",
                },
                children: (
                  <span className="my-2 text-sm">
                    Are you sure you want to delete the selected entries?
                  </span>
                ),
                labels: { confirm: "Confirm", cancel: "Cancel" },
                onCancel: () => null,
                onConfirm: () => null,
              }),
          }}
        />
      </div>
    </>
  );
};

export default TicketsPage;

export function ErrorBoundary(): JSX.Element {
  return <DataAlert message="Could not load tickets data" />;
}
