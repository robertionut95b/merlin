import { useModals } from "@mantine/modals";
import type { Location, Theatre } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { addDays, format, parseISO } from "date-fns";
import type { Column } from "react-table";
import { isValidDate } from "src/helpers/dates";
import { IsAllowedAccess } from "src/helpers/remix.rbac";
import DataAlert from "~/components/layout/DataAlert";
import DateFilter from "~/components/tables/filters/DateFilter";
import type { UseFiltersColumnOptionsWithOptionsList } from "~/components/tables/filters/filters.types";
import { SelectFilter } from "~/components/tables/filters/SelectFilter";
import Table from "~/components/tables/Table";
import { getLocations } from "~/models/locations.server";
import { getTheatresWithPagination } from "~/models/theatre.server";

export const loader: LoaderFunction = async ({ request }) => {
  const access = await IsAllowedAccess({
    request,
    actions: ["Read", "All"],
    objects: ["Theatre", "All"],
  });

  if (!access) {
    return redirect("/app");
  }

  const url = new URL(request.url);
  const queryParams = url.searchParams;

  // filters area
  const id = queryParams.get("id") || undefined;
  const [, idOperator = "contains", idValue] = id?.split(":") || [];
  const name = queryParams.get("name") || undefined;
  const [, nameOperator = "contains", nameValue] = name?.split(":") || [];
  const createdAt = queryParams.get("createdAt") || undefined;
  const [, createdAtOperator, createdAtValue] = createdAt?.split(":") || [];
  const updatedAt = queryParams.get("updatedAt") || undefined;
  const [, updatedAtOperator, updatedAtValue] = updatedAt?.split(":") || [];
  const locationName = queryParams.get("location.name") || undefined;
  const [, locationNameOperator = "contains", locationNameValue] =
    locationName?.split(":") || [];

  const createdAtDate =
    createdAt && isValidDate(new Date(createdAt))
      ? new Date(createdAtValue)
      : undefined;
  const updatedAtDate =
    updatedAt && isValidDate(new Date(updatedAt))
      ? new Date(updatedAtValue)
      : undefined;

  const pageSize = 10;
  const page = parseInt(queryParams.get("p") || "0");
  const skip = page === 0 || page === 1 ? 0 : (page - 1) * pageSize;
  const { paginationMeta, theatres } = await getTheatresWithPagination({
    take: pageSize,
    skip,
    where: {
      id: {
        [idOperator]: idValue,
        mode: "insensitive",
      },
      name: {
        [nameOperator]: nameValue,
        mode: "insensitive",
      },
      createdAt: {
        ...(createdAtOperator === "equals" && { gte: createdAtDate }),
        ...(createdAtOperator === "equals" && {
          lt: addDays(createdAtDate, 1),
        }),
      },
      updatedAt: {
        [updatedAtOperator]: updatedAtDate,
      },
      location: {
        name: {
          [locationNameOperator]: locationNameValue,
          mode: "insensitive",
        },
      },
    },
    include: {
      location: true,
    },
  });
  const pageCount = Math.ceil(paginationMeta.total / pageSize);
  const locations = await getLocations();

  return json({
    theatres,
    total: paginationMeta.total,
    locations,
    pageSize,
    pageCount,
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

  const columns: (Column & UseFiltersColumnOptionsWithOptionsList<object>)[] = [
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
      options: locations.map((l) => ({ label: l.name, value: l.name })),
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
  ];
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
          data={theatres}
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
