import {
  ActionIcon,
  Anchor,
  Button,
  Divider,
  Group,
  Popover,
  Radio,
  RadioGroup,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useSetState } from "@mantine/hooks";
import { format } from "date-fns";
import { useState } from "react";
import type { UseFiltersColumnProps } from "react-table";
import { isValidDate } from "../../../../src/helpers/dates";
import { FilterSvg } from "../TableIcons";
import type { FilterState } from "./filters.types";
import { OperatorValues } from "./filters.types";

const DateFilter = <T,>(props: {
  column: UseFiltersColumnProps<T & object>;
}) => {
  const {
    column: { filterValue, setFilter },
  } = props;
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
    <Popover
      target={
        <ActionIcon
          variant={filterValue ? "light" : "hover"}
          color={filterValue ? "indigo" : "gray"}
          onClick={() => setOpened((o) => !o)}
        >
          <FilterSvg size={12} />
        </ActionIcon>
      }
      opened={opened}
      onClose={handleClose}
      onClick={(e) => e.stopPropagation()}
      position="bottom"
    >
      <RadioGroup
        description="Select your option"
        orientation="vertical"
        size="sm"
        value={state.operator}
        onChange={(o) => setState({ operator: o as OperatorValues })}
      >
        <Radio value="equals" label={"Equals"} />
        <Radio value="not" label={"Not equals"} />
        <Radio value="gt" label={"After"} />
        <Radio value="gte" label={"After or on"} />
        <Radio value="lt" label={"Before"} />
        <Radio value="lte" label={"Before or on"} />
      </RadioGroup>
      <Divider my="sm" />
      <DatePicker
        placeholder="Pick date"
        mb="sm"
        withinPortal={false}
        value={
          typeof state.value === "string"
            ? state.value !== ""
              ? new Date(state.value)
              : null
            : state.value
        }
        onChange={(val) =>
          setState({
            value: isValidDate(val as Date)
              ? format?.(val as Date, "yyyy-MM-dd")
              : undefined,
          })
        }
      />

      <Group position="apart">
        <Anchor
          component="button"
          color="indigo"
          size="sm"
          onClick={handleClear}
        >
          Clear
        </Anchor>
        <Button size="xs" variant="outline" onClick={handleApply}>
          Apply
        </Button>
      </Group>
    </Popover>
  );
};

export default DateFilter;
