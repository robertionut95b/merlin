import { Permission } from "@prisma/client";
import { format, parseISO } from "date-fns";
import { Column } from "react-table";
import {
  json,
  LoaderFunction,
  useLoaderData,
  useNavigate,
  Outlet,
  Link,
  useLocation,
} from "remix";
import DataAlert from "~/components/layout/DataAlert";
import Table from "~/components/tables/Table";
import { getPermissionsWithPagination } from "~/models/permission.server";
import { Button } from "@mantine/core";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const queryParams = url.searchParams;

  const pageSize = 10;
  const page = parseInt(queryParams.get("p") || "0");
  const skip = page === 0 || page === 1 ? 0 : (page - 1) * pageSize;
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
  const permsColumns: Column[] = [
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
    },
    {
      Header: "Updated",
      accessor: "updatedAt",
      Cell: (row: any) => format(parseISO(row.value), "yyyy-MM-dd HH:mm"),
    },
  ];

  const navigate = useNavigate();
  const { pathname } = useLocation();

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
        <div className="table-options mb-4">
          <Link to={pathname + "/new"}>
            <Button
              className="text-lg font-extrabold"
              variant="outline"
              compact
            >
              +
            </Button>
          </Link>
        </div>
        <Table
          className="rounded-lg border border-gray-200"
          columns={permsColumns}
          data={permissions}
          pagination={{
            pageSize,
            pageCount,
            total,
            onPageChange: (page: number) => navigate(`?p=${page}`),
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
