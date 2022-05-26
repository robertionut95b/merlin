import { useModals } from "@mantine/modals";
import type { Screening } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import type { PaginatedResult } from "prisma-pagination";
import { useMemo } from "react";
import type { Column } from "react-table";
import { getResourceFiltersOperatorValue } from "src/helpers/remix-action-loaders";
import { authorizationLoader } from "src/helpers/remix.rbac";
import DataAlert from "~/components/layout/DataAlert";
import DateFilter from "~/components/tables/filters/DateFilter";
import type { UseFiltersColumnOptionsWithOptionsList } from "~/components/tables/filters/filters.types";
import Table from "~/components/tables/Table";
import { getScreeningsWithPagination } from "~/models/screenings.server";
import { parseDateFiltersToQuery } from "../../../../../../src/helpers/remix-action-loaders";

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
      const [ratingOp, ratingV] = filters.get("rating");
      const [createdOp, createdV] = filters.get("createdAt");
      const [updatedOp, updatedV] = filters.get("updatedAt");
      const [releaseOp, releaseV] = filters.get("release");

      const { data, meta } = await getScreeningsWithPagination(
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
            rating: {
              [ratingOp]: ratingV,
              mode: "insensitive",
            },
            release: {
              ...parseDateFiltersToQuery(releaseOp, releaseV),
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

export function ErrorBoundary(): JSX.Element {
  return <DataAlert message="Could not load screenings data" />;
}
