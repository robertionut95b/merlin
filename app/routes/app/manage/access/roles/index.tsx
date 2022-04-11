import { Role } from "@prisma/client";
import { Column } from "react-table";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import { LoaderFunction, json, useLoaderData, Link, useLocation } from "remix";
import Table from "~/components/tables/Table";
import { getRoles } from "~/models/role.server";
import DataAlert from "~/components/layout/DataAlert";
import { Button } from "@mantine/core";

export const loader: LoaderFunction = async () => {
  return json(await getRoles());
};

export const RolesPage = (): JSX.Element => {
  const roles = useLoaderData<Role[]>();
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
    },
    {
      Header: "Updated",
      accessor: "updatedAt",
      Cell: (row: any) => format(parseISO(row.value), "yyyy-MM-dd HH:mm"),
    },
  ];
  const { pathname } = useLocation();

  return (
    <>
      <div className="header">
        <h3 className="mb-2 text-xl font-bold">Roles</h3>
      </div>
      <div className="roles">
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
          columns={rolesColumns}
          data={roles}
        />
      </div>
    </>
  );
};

export function ErrorBoundary(): JSX.Element {
  return <DataAlert message="Could not load roles data" />;
}

export default RolesPage;
