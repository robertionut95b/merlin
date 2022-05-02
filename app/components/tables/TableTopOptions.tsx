import { Button, Divider, Menu } from "@mantine/core";
import type { TableInstance } from "react-table";
import { GlobalFilter } from "./filters";
import { CancelSvg, FilterSvg } from "./TableIcons";

interface ITableTopOptionsProps {
  instance: TableInstance<object>;
  onCreate?: () => void;
  clearFilters?: () => void;
}

const TableTopOptions = ({
  instance,
  onCreate,
  clearFilters,
}: ITableTopOptionsProps): JSX.Element => {
  const {
    allColumns,
    // @ts-expect-error("Type error")
    preGlobalFilterRows,
    // @ts-expect-error("Type error")
    setGlobalFilter,
    state,
    // @ts-expect-error("Type error")
    setAllFilters,
  } = instance;

  return (
    <div className="table-options mb-4 flex items-center justify-between">
      <Button variant="outline" onClick={() => onCreate?.()}>
        Create
      </Button>
      <Menu
        size={"xl"}
        classNames={{
          body: "p-4",
        }}
        closeOnItemClick={false}
        control={
          <Button variant="outline">
            <FilterSvg size={22} />
          </Button>
        }
      >
        <GlobalFilter
          className="mb-4"
          preGlobalFilteredRows={preGlobalFilterRows}
          // @ts-expect-error("Type error")
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <Divider label="OR" labelPosition="center" />
        <div className="filters flex flex-col gap-y-4">
          {allColumns.map((c) =>
            // @ts-expect-error("Type error")
            c?.canFilter ? <div key={c.id}>{c.render("Filter")}</div> : null
          )}
        </div>
        <Menu.Item
          className="mt-2"
          icon={<CancelSvg />}
          color="indigo"
          onClick={() => {
            setAllFilters([]);
            clearFilters?.();
          }}
        >
          Clear filters
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default TableTopOptions;
