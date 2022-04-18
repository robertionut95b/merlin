import { useMemo, useState } from "react";
import { useTable, Column } from "react-table";
import { Pagination, Table as MantineTable } from "@mantine/core";

interface ITableProps<T> {
  columns: Column[];
  data: readonly T[];
  className?: string;
  pagination?: ITablePaginationProps;
}

interface ITablePaginationProps {
  pageSize: number;
  pageCount: number;
  total: number;
  onPageChange: (page: number) => void;
}

const Table = <T,>({
  columns,
  data,
  className,
  pagination,
}: ITableProps<T>): JSX.Element => {
  const tableData = useMemo(() => data, [data]);
  const tableColumns = useMemo(() => columns, [columns]);
  const [page, setPage] = useState<number>(1);

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable({
      columns: tableColumns,
      // @ts-expect-error("react-table-types")
      data: tableData,
    });

  return (
    <MantineTable
      striped
      highlightOnHover
      captionSide="bottom"
      className={className}
      {...getTableProps()}
    >
      <thead>
        {headerGroups.map((headerGroup, idx) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
            {headerGroup.headers.map((column, jdx) => (
              <th {...column.getHeaderProps()} key={jdx}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, idx) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={idx}>
              {row.cells.map((cell, jdx) => {
                return (
                  <td {...cell.getCellProps()} key={jdx}>
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
      <caption>
        {pagination && (
          <div className="flex items-center justify-end gap-x-4">
            <span className="font-normal">
              {data.length * page} of <b>{pagination.total}</b>
            </span>
            <Pagination
              classNames={{
                active: "bg-indigo-700",
              }}
              total={pagination.pageCount}
              page={page}
              withControls
              withEdges
              onChange={(p: number) => {
                setPage(p);
                pagination.onPageChange(p);
              }}
            />
          </div>
        )}
      </caption>
    </MantineTable>
  );
};

export default Table;
