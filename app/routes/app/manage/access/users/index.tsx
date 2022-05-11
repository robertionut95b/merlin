import { useModals } from "@mantine/modals";
import type { User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import type { Column } from "react-table";
import { authorizationLoader } from "src/helpers/remix.rbac";
import {
  mapFiltersToQueryParams,
  mapQueryParamsToFilters,
} from "src/remix/remix-routes";
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

      const pageSize = 10;
      const page = parseInt(queryParams.get("p") || "0");
      const skip = page === 0 || page === 1 ? 0 : page * pageSize - 1;
      const { paginationMeta, users } = await getUsersWithPagination({
        take: pageSize,
        skip,
      });
      const pageCount = Math.ceil(paginationMeta.total / pageSize);

      return json({
        users,
        total: paginationMeta.total,
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
  const usersColumns: Column[] = [
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
  ];

  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const modals = useModals();

  return (
    <>
      <div className="header">
        <h3 className="mb-2 text-xl font-bold">Users</h3>
      </div>
      <div className="content-description">
        <p>
          This section allows you to create custom defined users, if they do not
          login via OAuth provided by Clerk.
        </p>
        <br />
      </div>
      <div className="users">
        <Table
          className="rounded-lg border border-gray-200"
          columns={usersColumns}
          data={users}
          pagination={{
            initialPage: parseInt(new URLSearchParams(search).get("p") || "1"),
            pageSize,
            pageCount,
            total,
          }}
          manipulation={{
            onFilters: (filters, _globalFilter) => {
              return navigate(mapFiltersToQueryParams(pathname, filters), {
                replace: true,
              });
            },
            defaultFilters: mapQueryParamsToFilters(search),
            clearFilters: () => navigate(pathname, { replace: true }),
          }}
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
