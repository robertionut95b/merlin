import { Divider, Menu } from "@mantine/core";
import { DeleteSvg, EditSvg, ViewSvg } from "./TableIcons";

interface ITableRowActionsProps<T> {
  selectedRow: T;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  selectedRows?: T[];
}

export const TableRowActions = <T,>({
  selectedRow,
  onView,
  onEdit,
  onDelete,
}: ITableRowActionsProps<T>): JSX.Element => {
  return (
    <Menu>
      <Menu.Target>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </svg>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item icon={<ViewSvg />} onClick={() => onView?.(selectedRow)}>
          View record
        </Menu.Item>
        <Menu.Item icon={<EditSvg />} onClick={() => onEdit?.(selectedRow)}>
          Update record
        </Menu.Item>
        <Divider />
        <Menu.Label>Undoable</Menu.Label>
        <Menu.Item
          icon={<DeleteSvg />}
          color={"red"}
          onClick={() => onDelete?.(selectedRow)}
        >
          Delete record
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
