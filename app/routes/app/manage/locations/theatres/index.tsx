import { useModals } from "@mantine/modals";
import type { Location, Theatre } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { addDays, format, parseISO } from "date-fns";
import { useMemo } from "react";
import type { Column } from "react-table";
import { validDateOrUndefined } from "src/helpers/dates";
import { getResourceFiltersOperatorValue } from "src/helpers/remix-action-loaders";
import { authorizationLoader } from "src/helpers/remix.rbac";
import DataAlert from "~/components/layout/DataAlert";
import DateFilter from "~/components/tables/filters/DateFilter";
import type { UseFiltersColumnOptionsWithOptionsList } from "~/components/tables/filters/filters.types";
import { SelectFilter } from "~/components/tables/filters/SelectFilter";
import Table from "~/components/tables/Table";
import { getLocations } from "~/models/locations.server";
import { getTheatresWithPagination } from "~/models/theatre.server";

export const loader: LoaderFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Read", "All"],
    objects: ["Theatre", "All"],
    loader: async (arg) => {
      const { request } = arg;
      const url = new URL(request.url);
      const queryParams = url.searchParams;

      // filters area
      const filters = getResourceFiltersOperatorValue(request);
      const [idOp, idV] = filters.get("id");
      const [nameOp, nameV] = filters.get("name");
      const [locOp, locV] = filters.get("location");
      const [createdOp, createdV] = filters.get("createdAt");
      const [updatedOp, updatedV] = filters.get("updatedAt");
      const createdAtDate = validDateOrUndefined(createdV);
      const updatedAtDate = validDateOrUndefined(updatedV);

      const pageSize = 10;
      const page = parseInt(queryParams.get("p") || "0");
      const skip = page === 0 || page === 1 ? 0 : (page - 1) * pageSize;

      const {
        paginationMeta: { total },
        theatres,
      } = await getTheatresWithPagination({
        take: pageSize,
        skip,
        where: {
          id: {
            [idOp]: idV,
            mode: "insensitive",
          },
          name: {
            [nameOp]: nameV,
            mode: "insensitive",
          },
          createdAt: {
            ...(createdOp === "equals" && { gte: createdAtDate }),
            ...(createdOp === "equals" && {
              lt: addDays(createdAtDate as Date, 1),
            }),
          },
          updatedAt: {
            ...(updatedOp === "equals" && { gte: updatedAtDate }),
            ...(updatedOp === "equals" && {
              lt: addDays(updatedAtDate as Date, 1),
            }),
          },
          location: {
            name: {
              [locOp]: locV,
              mode: "insensitive",
            },
          },
        },
        include: {
          location: true,
        },
      });
      const pageCount = Math.ceil(total / pageSize);
      const locations = await getLocations();

      return json({
        theatres,
        total,
        locations,
        pageSize,
        pageCount,
      });
    },
  });
};

const TheatresPage = (): JSX.Element => {
  const modals = useModals();

  const { pageCount, pageSize, theatres, total, locations } = useLoaderData<{
    theatres: (Theatre & {
      location: Location;
    })[];
    locations: Location[];
    total: number;
    pageSize: number;
    pageCount: number;
  }>();

  const t = useMemo(() => theatres, [theatres]);
  const l = useMemo(() => locations, [locations]);
  const columns: (Column & UseFiltersColumnOptionsWithOptionsList<object>)[] =
    useMemo(
      () => [
        {
          Header: "Id",
          accessor: "id",
        },
        {
          Header: "Name",
          accessor: "name",
        },
        {
          Header: "Location",
          accessor: "location.name",
          Filter: SelectFilter,
          options: l.map((l) => ({ label: l.name, value: l.name })),
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
      [locations]
    );

  return (
    <>
      <div className="header">
        <h3 className="mb-2 text-xl font-bold">Theatres</h3>
      </div>
      <div className="content-description">
        <p>
          This section allows you to create the configuration of a theatre room.
          There can be several theatre rooms housed at a location.
        </p>
        <br />
      </div>
      <div className="theatres">
        <Table
          columns={columns}
          data={t}
          pagination={{
            pageSize,
            pageCount,
            total,
          }}
          selection={{
            onDelete: (_row) =>
              modals.openConfirmModal({
                title: "Delete Role",
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
                title: "Delete Roles",
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

export function ErrorBoundary(): JSX.Element {
  return <DataAlert message="Could not load theatres data" />;
}

export default TheatresPage;
