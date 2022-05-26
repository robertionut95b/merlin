import { useModals } from "@mantine/modals";
import type { Permission } from "@prisma/client";
import { ActionType, ObjectType } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import type { PaginatedResult } from "prisma-pagination";
import { useMemo } from "react";
import type { Column } from "react-table";
import {
  getResourceFiltersOperatorValue,
  parseDateFiltersToQuery,
} from "src/helpers/remix-action-loaders";
import { authorizationLoader } from "src/helpers/remix.rbac";
import DataAlert from "~/components/layout/DataAlert";
import DateFilter from "~/components/tables/filters/DateFilter";
import type { UseFiltersColumnOptionsWithOptionsList } from "~/components/tables/filters/filters.types";
import { SelectFilter } from "~/components/tables/filters/SelectFilter";
import Table from "~/components/tables/Table";
import { getPermissionsWithPagination } from "~/models/permission.server";

export const loader: LoaderFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Read", "All"],
    objects: ["Permission", "All"],
    loader: async (arg) => {
      const { request } = arg;
      const url = new URL(request.url);
      const queryParams = url.searchParams;
      const page = parseInt(queryParams.get("p") || "0");

      const filters = getResourceFiltersOperatorValue(request);
      const [idOp, idV] = filters.get("id");
      const [roleNameOp, roleNameV] = filters.get("Role.name");
      const [objectOp, objectV] = filters.get("objectType");
      const [actionOp, actionV] = filters.get("action");
      const [allowedOp, allowedV] = filters.get("allowed");
      const [createdOp, createdV] = filters.get("createdAt");
      const [updatedOp, updatedV] = filters.get("updatedAt");

      const { data, meta } = await getPermissionsWithPagination(
        {
          include: {
            Role: {
              select: {
                name: true,
              },
            },
          },
          where: {
            id: {
              [idOp]: idV,
              mode: "insensitive",
            },
            action: {
              [actionOp]: actionV,
            },
            Role: {
              name: {
                [roleNameOp]: roleNameV,
                mode: "insensitive",
              },
            },
            objectType: {
              [objectOp]: objectV,
            },
            allowed: {
              [allowedOp]:
                allowedV === undefined ? undefined : allowedV === "true",
            },
            createdAt: {
              ...parseDateFiltersToQuery(createdOp, createdV),
            },
            updatedAt: {
              ...parseDateFiltersToQuery(updatedOp, updatedV),
            },
          },
        },
        { page }
      );

      return json({
        permissions: data,
        meta,
      });
    },
  });
};

const PermissionsPage = (): JSX.Element => {
  const {
    permissions,
    meta: { perPage, total, lastPage },
  } = useLoaderData<{
    permissions: (Permission & {
      Role: {
        name: string;
      };
    })[];
    meta: PaginatedResult<Permission>["meta"];
  }>();

  const data = useMemo(() => permissions, [permissions]);
  const permsColumns: (Column &
    UseFiltersColumnOptionsWithOptionsList<object>)[] = useMemo(
    () => [
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
        Filter: SelectFilter,
        options: Object.keys(ObjectType).map((k) => ({ value: k, label: k })),
      },
      {
        Header: "Action",
        accessor: "action",
        Filter: SelectFilter,
        options: Object.keys(ActionType).map((k) => ({ value: k, label: k })),
      },
      {
        Header: "Allowed",
        accessor: "allowed",
        Cell: (row: any) => (row.value ? "Yes" : "No"),
        Filter: SelectFilter,
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ],
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
          data={data}
          pagination={{
            pageSize: perPage,
            pageCount: lastPage,
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
