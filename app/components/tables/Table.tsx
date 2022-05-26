import { Table as MantineTable } from "@mantine/core";
import { useLocation, useNavigate, useSearchParams } from "@remix-run/react";
import { useCallback, useMemo, useState } from "react";
import type { Column, Filters } from "react-table";
import {
  useFilters,
  useGlobalFilter,
  useRowSelect,
  useTable,
} from "react-table";
import {
  filterSetToTableFilters,
  filterSetToURLSearchParams,
  URLtoFilterSet,
} from "src/remix/filters.remix.utils";
import useDidMountEffect from "../../../src/helpers/mount";
import FiltersFunctions from "./filters/filterFns";
import type { TableFilter } from "./filters/filters.types";
import StringFilter from "./filters/StringFilter";
import { TableCheckbox } from "./TableCheckbox";
import { TablePagination } from "./TablePagination";
import { TableRowActions } from "./TableRowActions";
import { TableSelection } from "./TableSelection";
import TableTopOptions from "./TableTopOptions";
interface ITableProps<T> {
  columns: Column[];
  data: readonly T[];
  className?: string;
  pagination?: ITablePaginationProps;
  selection?: ITableSelectionProps<T>;
  manipulation?: ITableManipulationProps<T>;
}

interface ITableManipulationProps<T> {
  onCreate?: () => void;
  // @ts-expect-error("react-table-types")
  onFilters?: (filters: Filters<T>, globalFilter: string) => void;
  // @ts-expect-error("react-table-types")
  defaultFilters?: Filters<T>;
  clearFilters?: () => void;
}

interface ITableSelectionProps<T> {
  onView?: (selected: T) => void;
  onEdit?: (selected: T) => void;
  onDelete?: (selected: T) => void;
  onDeleteMany?: (selected: T[]) => void;
  onExportMany?: (selected: T[]) => void;
}

interface ITablePaginationProps {
  pageSize: number;
  pageCount: number;
  total: number;
  onPageChange?: (page: number) => void;
  initialPage?: number;
}

const Table = <T,>({
  columns,
  data,
  className = "rounded-lg border border-gray-200",
  pagination,
  selection,
  manipulation,
}: ITableProps<T>): JSX.Element => {
  const tableData = useMemo(() => data, [data]);
  const tableColumns = useMemo(() => columns, [columns]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const {
    onPageChange = (p: number) =>
      setSearchParams({ ...Object.fromEntries(searchParams), p: p.toString() }),
    initialPage = parseInt(searchParams.get("p") || "1"),
  } = pagination || {};

  const [page, setPage] = useState<number>(initialPage || 1);

  const {
    // @ts-expect-error("react-table-types")
    onView = (row: T) => navigate(`${pathname}/${row?.id}`),
    // @ts-expect-error("react-table-types")0
    onEdit = (row: T) => navigate(`${pathname}/${row?.id}/edit`),
  } = selection || {};

  const filtersState = useMemo(() => {
    return filterSetToTableFilters(URLtoFilterSet(searchParams.toString()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFiltersCb = useCallback(
    (sp) => (filterSet: TableFilter[], _globalFilter: string) => {
      const urlParams = filterSetToURLSearchParams(filterSet);
      // reset pagination
      setPage(1);
      return setSearchParams({
        ...sp,
        ...Object.fromEntries(urlParams),
        p: "1",
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const {
    onCreate = () => navigate(`${pathname}/new`),
    clearFilters = () => navigate(pathname, { replace: true }),
    onFilters = onFiltersCb(searchParams),
    defaultFilters = {
      filters: filtersState,
    },
  } = manipulation || {};

  const defaultColumn = useMemo(
    () => ({
      Filter: StringFilter,
      filter: "stringFilter",
    }),
    []
  );

  const plugins = [useGlobalFilter, useFilters, useRowSelect];

  const instance = useTable(
    {
      columns: tableColumns,
      // @ts-expect-error("react-table-types")
      data: tableData,
      // @ts-expect-error("react-table-types")
      defaultColumn: defaultColumn,
      defaultCanFilter: false,
      manualFilters: true,
      manualGlobalFilter: true,
      filterTypes: useMemo(
        () => ({
          stringFilter: FiltersFunctions.stringFilter,
          numberFilter: FiltersFunctions.numberFilter,
          dateFilter: FiltersFunctions.dateFilter,
        }),
        []
      ),
      // @ts-expect-error("react-table-types")
      initialState: {
        ...defaultFilters,
      },
    },
    ...plugins,
    (hooks) => {
      selection &&
        hooks.visibleColumns.push((cls) => [
          {
            id: "selection",
            // @ts-expect-error("type error")
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <TableCheckbox
                  size={"xs"}
                  {...getToggleAllRowsSelectedProps()}
                />
              </div>
            ),
            Cell: ({ row }) => (
              <div>
                <TableCheckbox
                  size={"xs"}
                  {...(row as any).getToggleRowSelectedProps()}
                />
              </div>
            ),
          },
          ...cls,
          {
            id: "actions",
            Header: "Actions",
            Cell: ({ row }) => (
              <TableRowActions
                selectedRow={row.original as unknown as T}
                {...selection}
                onView={onView}
                onEdit={onEdit}
              />
            ),
          },
        ]);
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    // @ts-expect-error("Type error")
    selectedFlatRows,
    // @ts-expect-error("Type error")
    state: { selectedRowIds, filters, globalFilter },
  } = instance;

  useDidMountEffect(() => onFilters(filters, globalFilter), [filters]);

  return (
    <div>
      <TableTopOptions
        instance={instance}
        setPage={setPage}
        {...manipulation}
        onCreate={onCreate}
        clearFilters={clearFilters}
      />
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
                  {/* @ts-expect-error("react-table-types") */}
                  {column.canFilter ? column.render("Filter") : null}
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
                    <td
                      {...cell.getCellProps()}
                      key={jdx}
                      className="max-w-xs truncate"
                      title={String(cell.value)}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td className="text-center" colSpan={tableColumns.length + 2}>
                No data
              </td>
            </tr>
          )}
        </tbody>
        <caption>
          <div
            className={`mt-2 flex flex-row items-center ${
              selection ? "justify-between" : "justify-end"
            }`}
          >
            {selection && (
              <TableSelection
                selectedRowIds={selectedRowIds}
                selectedRows={selectedFlatRows}
                {...selection}
              />
            )}
            <div className="self-end">
              {pagination && (
                <TablePagination
                  page={page}
                  pageLength={data.length}
                  setPage={(p) => setPage(p)}
                  initialPage={page}
                  {...pagination}
                  onPageChange={onPageChange}
                />
              )}
            </div>
          </div>
        </caption>
      </MantineTable>
    </div>
  );
};

export default Table;
