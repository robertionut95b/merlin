import {
  ActionIcon,
  Anchor,
  Button,
  Divider,
  Group,
  Popover,
  Select,
} from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { useState } from "react";
import type { UseFiltersColumnProps } from "react-table";
import { FilterSvg } from "../TableIcons";
import type { FilterState } from "./filters.types";
import { OperatorValues } from "./filters.types";

export const SelectFilter = <T,>({
  column: { filterValue, setFilter, options = [] },
}: {
  column: UseFiltersColumnProps<T & object> & {
    options: { value: string; label: string }[];
  };
}) => {
  const [opened, setOpened] = useState(false);
  const [state, setState] = useSetState<FilterState>(
    filterValue || { operator: OperatorValues.EQUAL, value: null }
  );

  const handleClose = () => {
    setState(filterValue || { operator: OperatorValues.EQUAL, value: "" });
    setOpened(false);
  };

  const handleClear = () => {
    setFilter(undefined);
    setState({ operator: OperatorValues.EQUAL, value: "" });
    setOpened(false);
  };

  const handleApply = () => {
    setFilter(state);
    setOpened(false);
  };

  return (
    <Popover opened={opened} onClose={handleClose} position="bottom">
      <Popover.Target>
        <ActionIcon
          variant={filterValue ? "light" : "subtle"}
          color={filterValue ? "indigo" : "gray"}
          onClick={() => setOpened((o) => !o)}
        >
          <FilterSvg size={12} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Select
          data={options}
          value={state.value as string}
          onChange={(value) =>
            setState({ operator: OperatorValues.EQUAL, value: value as string })
          }
          disabled={options?.length === 0}
          placeholder={
            options?.length === 0 ? "No options provided" : "Select option"
          }
          label="Options"
        />
        <Divider my="sm" />
        <Group position="apart">
          <Anchor
            component="button"
            color="indigo"
            size="sm"
            onClick={handleClear}
            disabled={options?.length === 0}
          >
            Clear
          </Anchor>
          <Button
            size="xs"
            variant="outline"
            onClick={handleApply}
            disabled={options?.length === 0}
          >
            Apply
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
};
