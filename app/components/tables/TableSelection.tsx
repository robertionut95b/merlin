import { Button, Divider, Menu } from "@mantine/core";
import { DeleteSvg, FileSvg } from "./TableIcons";

interface ITableSelectionProps<T> {
  selectedRows: T[];
  selectedRowIds: T[];
  onDeleteMany?: (selected: T[]) => void;
  onExportMany?: (selected: T[]) => void;
  onExportAll?: () => void;
}

export const TableSelection = <T,>({
  selectedRows,
  selectedRowIds,
  onDeleteMany,
  onExportMany,
  onExportAll,
}: ITableSelectionProps<T>): JSX.Element => {
  return (
    <Menu>
      <Menu.Target>
        <Button variant={"light"} color="indigo" compact>
          {Object.keys(selectedRowIds).length > 0
            ? `Selected: ${Object.keys(selectedRowIds).length}`
            : ""}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item icon={<FileSvg />} onClick={() => onExportAll?.()}>
          Export all
        </Menu.Item>
        <Menu.Item
          icon={<FileSvg />}
          onClick={() => onExportMany?.(selectedRows)}
        >
          Export selected
        </Menu.Item>
        <Divider />
        <Menu.Label>Undoable</Menu.Label>
        <Menu.Item
          icon={<DeleteSvg />}
          color={"red"}
          onClick={() => onDeleteMany?.(selectedRows)}
        >
          Delete records
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
