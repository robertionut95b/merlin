import { Divider, Menu } from "@mantine/core";
import { ViewSvg, EditSvg, DeleteSvg } from "./TableIcons";

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
    </Menu>
  );
};
