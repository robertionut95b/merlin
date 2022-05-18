import { Button } from "@mantine/core";
import type { TableInstance } from "react-table";

interface ITableTopOptionsProps {
  instance: TableInstance<object>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  onCreate?: () => void;
  clearFilters?: () => void;
}

const TableTopOptions = ({ onCreate }: ITableTopOptionsProps): JSX.Element => {
  return (
    <div className="table-options mb-4 flex items-center justify-between">
      <Button variant="outline" onClick={() => onCreate?.()}>
        Create
      </Button>
    </div>
  );
};

export default TableTopOptions;
