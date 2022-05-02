import { Pagination } from "@mantine/core";

interface ITablePaginationProps {
  initialPage: number;
  pageLength: number;
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  setPage: (page: number) => void;
  onPageChange: (page: number) => void;
}

export const TablePagination = ({
  initialPage,
  pageLength,
  page,
  total,
  pageCount,
  setPage,
  onPageChange,
}: ITablePaginationProps): JSX.Element => {
  return (
    <div className="flex items-center justify-end gap-x-4">
      <span className="font-normal">
        {pageLength * page} of <b>{total}</b>
      </span>
      <Pagination
        initialPage={initialPage}
        classNames={{
          active: "bg-indigo-700",
        }}
        total={pageCount}
        page={page}
        withControls
        withEdges
        onChange={(p: number) => {
          setPage(p);
          onPageChange(p);
        }}
      />
    </div>
  );
};
