import { useModals } from "@mantine/modals";
import type { Role } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { addDays } from "date-fns";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import type { Column } from "react-table";
import { validDateOrUndefined } from "src/helpers/dates";
import { getResourceFiltersOperatorValue } from "src/helpers/remix-action-loaders";
import { authorizationLoader } from "src/helpers/remix.rbac";
import DataAlert from "~/components/layout/DataAlert";
import DateFilter from "~/components/tables/filters/DateFilter";
import Table from "~/components/tables/Table";
import { getRolesWithPagination } from "~/models/role.server";

export const loader: LoaderFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Read", "All"],
    objects: ["Role", "All"],
    loader: async (arg) => {
      const { request } = arg;

      const url = new URL(request.url);
      const queryParams = url.searchParams;

      // filters
      const filters = getResourceFiltersOperatorValue(request);
      const [idOp, idV] = filters.get("id");
      const [nameOp, nameV] = filters.get("name");
      const [descOp, descV] = filters.get("description");
      const [createdOp, createdV] = filters.get("createdAt");
      const [updatedOp, updatedV] = filters.get("updatedAt");
      const createdAtDate = validDateOrUndefined(createdV);
      const updatedAtDate = validDateOrUndefined(updatedV);

      const pageSize = 10;
      const page = parseInt(queryParams.get("p") || "0");
      const skip = page === 0 || page === 1 ? 0 : (page - 1) * pageSize;
      const {
        paginationMeta: { total },
        roles,
      } = await getRolesWithPagination({
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
          description: {
            [descOp]: descV,
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
        },
      });
      const pageCount = Math.ceil(total / pageSize);

      return json({
        roles,
        total,
        pageSize,
        pageCount,
      });
    },
  });
};

export const RolesPage = (): JSX.Element => {
  const { pageCount, pageSize, roles, total } = useLoaderData<{
    roles: Role[];
    total: number;
    pageSize: number;
    pageCount: number;
  }>();
  const rolesColumns: Column[] = [
    {
      Header: "Id",
      accessor: "id",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Created",
      accessor: "createdAt",
      Cell: (row: any) => format(parseISO(row.value), "yyyy-MM-dd HH:mm"),
      // @ts-expect-error("react-table-types")
      Filter: DateFilter,
      filter: "dateFilter",
    },
    {
      Header: "Updated",
      accessor: "updatedAt",
      Cell: (row: any) => format(parseISO(row.value), "yyyy-MM-dd HH:mm"),
      // @ts-expect-error("react-table-types")
      Filter: DateFilter,
      filter: "dateFilter",
    },
  ];

  const modals = useModals();

  return (
    <>
      <div className="header">
        <h3 className="mb-2 text-xl font-bold">Roles</h3>
      </div>
      <div className="content-description">
        <p>
          This section allows you to create custom groups containing an infinite
          number of users.
        </p>
        <br />
      </div>
      <div className="roles">
        <Table
          className="rounded-lg border border-gray-200"
          columns={rolesColumns}
          data={roles}
          pagination={{
            pageSize,
            pageCount,
            total,
          }}
          selection={{
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
                    Are you sure you want to delete the role{" "}
                    <b className="text-red-700">{row.name}</b> ?
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
  return <DataAlert message="Could not load Roles data" />;
}

export default RolesPage;
