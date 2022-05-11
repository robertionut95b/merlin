import { useModals } from "@mantine/modals";
import type { Theatre } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import type { Column } from "react-table";
import { IsAllowedAccess } from "src/helpers/remix.rbac";
import { getStartedAtEndAtDates } from "src/remix/dates";
import {
  mapFiltersToQueryParams,
  mapQueryParamsToFilters,
} from "src/remix/remix-routes";
import { DateTimeColumnFilter } from "~/components/tables/filters";
import Table from "~/components/tables/Table";
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
  const [createdAtStart, endAtStart] = getStartedAtEndAtDates(
    queryParams.get("createdAt")
  );
  const [updatedAtStart, updatedEndAtStart] = getStartedAtEndAtDates(
    queryParams.get("updatedAt")
  );

  const pageSize = 10;
  const page = parseInt(queryParams.get("p") || "0");
  const skip = page === 0 || page === 1 ? 0 : (page - 1) * pageSize;
  const { paginationMeta, theatres } = await getTheatresWithPagination({
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
      location: {
        name: {
          contains: queryParams.get("location.name") || undefined,
          mode: "insensitive",
        },
      },
    },
    include: {
      location: true,
    },
  });
  const pageCount = Math.ceil(paginationMeta.total / pageSize);

  return json({
    theatres,
    total: paginationMeta.total,
    pageSize,
    pageCount,
  });
};

const TheatresPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const modals = useModals();

  const { pageCount, pageSize, theatres, total } = useLoaderData<{
    theatres: (Theatre & {
      location: Location;
    })[];
    total: number;
    pageSize: number;
    pageCount: number;
  }>();

  const columns: Column[] = [
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
    },
    {
      Header: "Created",
      accessor: "createdAt",
      Cell: (row: any) => format(parseISO(row.value), "yyyy-MM-dd HH:mm"),
      // @ts-expect-error("react-table-types")
      Filter: DateTimeColumnFilter,
      filter: "dateEquals",
    },
    {
      Header: "Updated",
      accessor: "updatedAt",
      Cell: (row: any) => format(parseISO(row.value), "yyyy-MM-dd HH:mm"),
      // @ts-expect-error("react-table-types")
      Filter: DateTimeColumnFilter,
      filter: "dateEquals",
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
            initialPage: parseInt(new URLSearchParams(search).get("p") || "1"),
            pageSize,
            pageCount,
            total,
          }}
          manipulation={{
            onCreate: () => navigate(`${pathname}/new`, { replace: true }),
            onFilters: (filters, _globalFilter) =>
              navigate(mapFiltersToQueryParams(pathname, filters), {
                replace: true,
              }),
            defaultFilters: mapQueryParamsToFilters(search),
            clearFilters: () => navigate(pathname, { replace: true }),
          }}
          selection={{
            onView: (row) => navigate(`${pathname}/${row.id}`),
            onEdit: (row) => navigate(`${pathname}/${row.id}/edit`),
            onDelete: (row) =>
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

export default TheatresPage;
