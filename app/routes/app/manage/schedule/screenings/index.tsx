import { useModals } from "@mantine/modals";
import type { Prisma, Screening } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { addDays, format, parseISO } from "date-fns";
import type { PaginatedResult } from "prisma-pagination";
import { createPaginator } from "prisma-pagination";
import { useMemo } from "react";
import type { Column } from "react-table";
import { validDateOrUndefined } from "src/helpers/dates";
import { getResourceFiltersOperatorValue } from "src/helpers/remix-action-loaders";
import { authorizationLoader } from "src/helpers/remix.rbac";
import DateFilter from "~/components/tables/filters/DateFilter";
import type { UseFiltersColumnOptionsWithOptionsList } from "~/components/tables/filters/filters.types";
import Table from "~/components/tables/Table";
import { prisma } from "~/db.server";

export const loader: LoaderFunction = async (args) => {
  return authorizationLoader({
    ...args,
    actions: ["Read", "All"],
    objects: ["Screening", "All"],
    loader: async (arg) => {
      const { request } = arg;
      const url = new URL(request.url);
      const queryParams = url.searchParams;
      const page = parseInt(queryParams.get("p") || "0");

      // filters area
      const filters = getResourceFiltersOperatorValue(request);
      const [idOp, idV] = filters.get("imdbId");
      const [nameOp, nameV] = filters.get("title");
      const [createdOp, createdV] = filters.get("createdAt");
      const [updatedOp, updatedV] = filters.get("updatedAt");
      const createdAtDate = validDateOrUndefined(createdV);
      const updatedAtDate = validDateOrUndefined(updatedV);

      const paginate = createPaginator({ perPage: 10 });
      const { data, meta } = await paginate<
        Screening,
        Prisma.ScreeningFindManyArgs
      >(
        prisma.screening,
        {
          where: {
            imdbId: {
              [idOp]: idV,
              mode: "insensitive",
            },
            title: {
              [nameOp]: nameV,
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
        },
        { page }
      );
      return {
        screenings: data,
        meta,
      };
    },
  });
};

const ScreeningsPage = (): JSX.Element => {
  const {
    screenings,
    meta: { total, perPage, lastPage },
  } = useLoaderData<{
    screenings: Screening[];
    meta: PaginatedResult<Screening>["meta"];
  }>();
  const modals = useModals();

  const columns: (Column & UseFiltersColumnOptionsWithOptionsList<object>)[] =
    useMemo(
      () => [
        {
          Header: "IMDB Id",
          accessor: "imdbId",
        },
        {
          Header: "Poster",
          accessor: "poster",
          disableFilters: true,
          Cell: (row) => (
            <a href={row.value}>
              <img
                src={row.value}
                alt="Alternate title"
                width={24}
                height={24}
              />
            </a>
          ),
        },
        {
          Header: "Title",
          accessor: "title",
        },
        {
          Header: "Description",
          accessor: "description",
        },
        {
          Header: "Rating",
          accessor: "rating",
        },
        {
          Header: "Duration (min)",
          accessor: "duration",
        },
        {
          Header: "Release",
          accessor: "release",
          Cell: (row: any) => format(parseISO(row.value), "yyyy-MM-dd HH:mm"),
          Filter: DateFilter,
          filter: "dateFilter",
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
        <h3 className="mb-2 text-xl font-bold">Screenings</h3>
      </div>
      <div className="content-description">
        <p>
          This section allows you to create or customize the screenings for
          various cinemas.
        </p>
        <br />
      </div>
      <div className="screenings">
        <Table
          columns={columns}
          data={screenings}
          pagination={{
            pageSize: perPage,
            pageCount: lastPage,
            total,
          }}
          selection={{
            onDelete: (_row) =>
              modals.openConfirmModal({
                title: "Delete Screening",
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
                title: "Delete Screenings",
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

export default ScreeningsPage;
