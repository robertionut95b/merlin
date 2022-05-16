import { useModals } from "@mantine/modals";
import type { Permission } from "@prisma/client";
import { ActionType } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import type { Column, UseFiltersColumnOptions } from "react-table";
import { IsAllowedAccess } from "src/helpers/remix.rbac";
import DataAlert from "~/components/layout/DataAlert";
import DateFilter from "~/components/tables/filters/DateFilter";
import Table from "~/components/tables/Table";
import { getPermissionsWithPagination } from "~/models/permission.server";

export const loader: LoaderFunction = async ({ request }) => {
  const access = await IsAllowedAccess({
    request,
    actions: ["Read", "All"],
    objects: ["Permission", "All"],
  });

  if (!access) {
    return redirect("/app");
  }

  const url = new URL(request.url);
  const queryParams = url.searchParams;

  const actionTypeFilter =
    ActionType[(queryParams.get("action") || "") as keyof typeof ActionType] ||
    undefined;

  const pageSize = 10;
  const page = parseInt(queryParams.get("p") || "0");
  const skip = page === 0 || page === 1 ? 0 : (page - 1) * pageSize;

  const roleName = queryParams.get("Role.name") || undefined;
  const [, roleNameOperator = "contains", roleNameValue] =
    roleName?.split(":") || [];

  const createdAt = queryParams.get("createdAt") || undefined;
  const [, createdAtOperator = "equals", createdAtValue] =
    createdAt?.split(":") || [];
  const updatedAt = queryParams.get("updatedAt") || undefined;

  const { paginationMeta, permissions } = await getPermissionsWithPagination({
    take: pageSize,
    skip,
    include: {
      Role: {
        select: {
          name: true,
        },
      },
    },
    where: {
      action: actionTypeFilter,
      Role: {
        name: {
          [roleNameOperator]: roleNameValue,
          mode: "insensitive",
        },
      },
    },
  });
  const pageCount = Math.ceil(paginationMeta.total / pageSize);

  return json({
    permissions,
    total: paginationMeta.total,
    pageSize,
    pageCount,
  });
};

const PermissionsPage = (): JSX.Element => {
  const { pageCount, pageSize, permissions, total } = useLoaderData<{
    permissions: (Permission & {
      Role: {
        name: string;
      };
    })[];
    total: number;
    pageSize: number;
    pageCount: number;
  }>();
  const permsColumns: (Column & UseFiltersColumnOptions<object>)[] = [
    {
      Header: "Id",
      accessor: "id",
    },
    {
      Header: "Role",
      accessor: "Role.name",
    },
    {
      Header: "Object",
      accessor: "objectType",
    },
    {
      Header: "Action",
      accessor: "action",
    },
    {
      Header: "Allowed",
      accessor: "allowed",
      Cell: (row: any) => (row.value ? "Yes" : "No"),
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

  const modals = useModals();

  return (
    <>
      <div className="header">
        <h3 className="mb-2 text-xl font-bold">Permissions</h3>
      </div>
      <div className="content-description">
        <p>
          This section allows you to create custom access rules based on the
          object type and main actions: create, read, update, delete.
        </p>
        <br />
      </div>
      <div className="permissions">
        <Table
          columns={permsColumns}
          data={permissions}
          pagination={{
            pageSize,
            pageCount,
            total,
          }}
          selection={{
            onDelete: (_row) =>
              modals.openConfirmModal({
                title: "Delete Permission",
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
                title: "Delete Permission",
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
      <Outlet />
    </>
  );
};

export function ErrorBoundary(): JSX.Element {
  return <DataAlert message="Could not load permissions data" />;
}

export default PermissionsPage;
