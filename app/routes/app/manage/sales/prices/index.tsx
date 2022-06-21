import { useModals } from "@mantine/modals";
import type { PricingPolicy } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import type { PaginatedResult } from "prisma-pagination";
import { useMemo } from "react";
import type { Column } from "react-table";
import { authorizationLoader } from "src/helpers/remix.rbac";
import DataAlert from "~/components/layout/DataAlert";
import DateFilter from "~/components/tables/filters/DateFilter";
import type { UseFiltersColumnOptionsWithOptionsList } from "~/components/tables/filters/filters.types";
import Table from "~/components/tables/Table";
import { getPricingPoliciesWithPagination } from "~/models/pricingPolicy.server";

export const loader: LoaderFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Read", "All"],
    objects: ["PricingPolicy", "All"],
    loader: async ({ request }) => {
      const url = new URL(request.url);
      const queryParams = url.searchParams;
      const page = parseInt(queryParams.get("p") || "0");
      const { data, meta } = await getPricingPoliciesWithPagination(
        {},
        {
          page,
        }
      );
      return {
        pricingPolicies: data,
        meta,
      };
    },
  });
};

export default function PricesPage() {
  const {
    pricingPolicies,
    meta: { total, perPage, lastPage },
  } = useLoaderData<{
    pricingPolicies: PricingPolicy[];
    meta: PaginatedResult<PricingPolicy>["meta"];
  }>();
  const modals = useModals();
  const columns: (Column & UseFiltersColumnOptionsWithOptionsList<object>)[] =
    useMemo(
      () => [
        {
          Header: "ID",
          accessor: "id",
        },
        {
          Header: "Age category",
          accessor: "ageCategory",
        },
        {
          Header: "Ticket type",
          accessor: "ticketType",
          Cell: (row: any) =>
            row.value.replace("Two", "2").replace("Three", "3"),
        },
        {
          Header: "Price",
          accessor: "price",
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
  return (
    <>
      <div className="header">
        <h3 className="mb-2 text-xl font-bold">Prices</h3>
      </div>
      <div className="content-description">
        <p>
          This section allows you to create or customize pricing policies used
          in tickets sales for all managed cinemas.
        </p>
        <br />
      </div>
      <div className="prices">
        <Table
          columns={columns}
          data={pricingPolicies}
          pagination={{
            pageSize: perPage,
            pageCount: lastPage,
            total,
          }}
          selection={{
            onDelete: (_row) =>
              modals.openConfirmModal({
                title: "Delete pricing policy",
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
                title: "Delete pricing policies",
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
}

export function ErrorBoundary(): JSX.Element {
  return <DataAlert message="Could not load prices data" />;
}
