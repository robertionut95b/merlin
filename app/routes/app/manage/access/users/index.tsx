import { Button } from "@mantine/core";
import type { User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import type { Column } from "react-table";
import { IsAllowedAccess } from "src/helpers/remix.rbac";
import DataAlert from "~/components/layout/DataAlert";
import Table from "~/components/tables/Table";
import { getUsersWithPagination } from "~/models/user.server";

export const loader: LoaderFunction = async ({ request }) => {
  const access = await IsAllowedAccess({
    request,
    actions: ["Read", "All"],
    objects: ["User", "All"],
  });

  if (!access) {
    return redirect("/app");
  }

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
};

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
        <div className="table-options mb-4">
          <Link to={pathname + "/new"}>
            <Button variant="outline">Create</Button>
          </Link>
        </div>
        <Table
          className="rounded-lg border border-gray-200"
          columns={usersColumns}
          data={users}
          pagination={{
            initialPage: parseInt(new URLSearchParams(search).get("p") || "1"),
            pageSize,
            pageCount,
            total,
            onPageChange: (page: number) => navigate(`?p=${page}`),
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
