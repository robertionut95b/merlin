import { useModals } from "@mantine/modals";
import type { User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { addDays } from "date-fns";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { useMemo } from "react";
import type { Column } from "react-table";
import { validDateOrUndefined } from "src/helpers/dates";
import { getResourceFiltersOperatorValue } from "src/helpers/remix-action-loaders";
import { authorizationLoader } from "src/helpers/remix.rbac";
import DataAlert from "~/components/layout/DataAlert";
import Table from "~/components/tables/Table";
import { getUsersWithPagination } from "~/models/user.server";

export const loader: LoaderFunction = (args) =>
  authorizationLoader({
    ...args,
    actions: ["Read", "All"],
    objects: ["User", "All"],
    loader: async ({ request }) => {
      const url = new URL(request.url);
      const queryParams = url.searchParams;

      // filters
      const filters = getResourceFiltersOperatorValue(request);
      const [idOp, idV] = filters.get("id");
      const [emailOp, emailV] = filters.get("email");
      const [usernameOp, usernameV] = filters.get("username");
      const [createdOp, createdV] = filters.get("createdAt");
      const [updatedOp, updatedV] = filters.get("updatedAt");
      const createdAtDate = validDateOrUndefined(createdV);
      const updatedAtDate = validDateOrUndefined(updatedV);

      const pageSize = 10;
      const page = parseInt(queryParams.get("p") || "0");
      const skip = page === 0 || page === 1 ? 0 : page * pageSize - 1;

      const {
        paginationMeta: { total },
        users,
      } = await getUsersWithPagination({
        take: pageSize,
        skip,
        where: {
          id: {
            [idOp]: idV,
            mode: "insensitive",
          },
          email: {
            [emailOp]: emailV,
            mode: "insensitive",
          },
          username: {
            [usernameOp]: usernameV,
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
        users,
        total: total,
        pageSize,
        pageCount,
      });
    },
  });

export const UsersPage = (): JSX.Element => {
  const { users, pageCount, pageSize, total } = useLoaderData<{
    users: User[];
    total: number;
    pageSize: number;
    pageCount: number;
  }>();
  const usersColumns: Column[] = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "Created",
        accessor: "createdAt",
        Cell: (row: any) => format(parseISO(row.value), "yyyy-MM-dd HH:mm"),
      },
      {
        Header: "Updated",
        accessor: "updatedAt",
        Cell: (row: any) => format(parseISO(row.value), "yyyy-MM-dd HH:mm"),
      },
    ],
    []
  );

  const modals = useModals();

  return (
    <>
      <div className="header">
        <h3 className="mb-2 text-xl font-bold">Users</h3>
      </div>
      <div className="content-description">
        <p>
          This section allows you to create custom defined users, if they do not
          login via OAuth.
        </p>
        <br />
      </div>
      <div className="users">
        <Table
          className="rounded-lg border border-gray-200"
          columns={usersColumns}
          data={users}
          pagination={{ pageSize, pageCount, total }}
          selection={{
            onDelete: (row) =>
              modals.openConfirmModal({
                title: "Delete User",
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
                title: "Delete User",
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
  return <DataAlert message="Could not load users data" />;
}

export default UsersPage;
