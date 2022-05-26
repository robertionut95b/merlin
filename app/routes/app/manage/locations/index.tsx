import { useModals } from "@mantine/modals";
import type { Address, Location } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import { useMemo } from "react";
import type { Column } from "react-table";
import { authorizationLoader } from "src/helpers/remix.rbac";
import { getStartedAtEndAtDates } from "src/remix/dates";
import DateFilter from "~/components/tables/filters/DateFilter";
import type { UseFiltersColumnOptionsWithOptionsList } from "~/components/tables/filters/filters.types";
import Table from "~/components/tables/Table";
import { getLocationsWithPagination } from "~/models/locations.server";

export const loader: LoaderFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Read", "All"],
    objects: ["Location", "All"],
    loader: async ({ request }) => {
      const url = new URL(request.url);
      const queryParams = url.searchParams;
      const [createdAtStart, endAtStart] = getStartedAtEndAtDates(
        queryParams.get("createdAt")
      );
      const [updatedAtStart, updatedEndAtStart] = getStartedAtEndAtDates(
        queryParams.get("updatedAt")
      );

      const pageSize = 10;
      const page = parseInt(queryParams.get("p") || "0");
      const skip = page === 0 || page === 1 ? 0 : (page - 1) * pageSize;
      const { paginationMeta, locations } = await getLocationsWithPagination({
        take: pageSize,
        skip,
        where: {
          id: {
            contains: queryParams.get("id") || undefined,
            mode: "insensitive",
          },
          name: {
            contains: queryParams.get("name") || undefined,
            mode: "insensitive",
          },
          createdAt: {
            gte: createdAtStart,
            lt: endAtStart,
          },
          updatedAt: {
            gte: updatedAtStart,
            lt: updatedEndAtStart,
          },
        },
        include: {
          address: true,
        },
      });
      const pageCount = Math.ceil(paginationMeta.total / pageSize);

      return json({
        locations,
        total: paginationMeta.total,
        pageSize,
        pageCount,
      });
    },
  });
};

const LocationsList = (): JSX.Element => {
  const modals = useModals();

  const { pageCount, pageSize, locations, total } = useLoaderData<{
    locations: (Location & { address: Address })[];
    total: number;
    pageSize: number;
    pageCount: number;
  }>();

  const columns: (Column & UseFiltersColumnOptionsWithOptionsList<object>)[] =
    useMemo(
      () => [
        {
          id: "id",
          accessor: "id",
          Header: "ID",
        },
        {
          id: "name",
          accessor: "name",
          Header: "Name",
        },
        {
          id: "street",
          accessor: "address.street",
          Header: "Street",
        },
        {
          id: "city",
          accessor: "address.city",
          Header: "City",
        },
        {
          id: "country",
          accessor: "address.country",
          Header: "Country",
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
    <div className="locations">
      <Table
        className="rounded-lg border border-gray-200"
        columns={columns}
        data={locations}
        pagination={{
          pageSize,
          pageCount,
          total,
        }}
        selection={{
          onDelete: (row) =>
            modals.openConfirmModal({
              title: "Delete Location",
              centered: true,
              confirmProps: {
                variant: "light",
                color: "red",
              },
              children: (
                <span className="my-2 text-sm">
                  Are you sure you want to delete the location{" "}
                  <b className="text-red-700">{row.name}</b> ?
                </span>
              ),
              labels: { confirm: "Confirm", cancel: "Cancel" },
              onCancel: () => null,
              onConfirm: () => null,
            }),
          onDeleteMany: (_rows) =>
            modals.openConfirmModal({
              title: "Delete Locations",
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
  );
};

export default LocationsList;
