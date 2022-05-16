import {
  ActionIcon,
  Anchor,
  Button,
  Divider,
  Group,
  Popover,
  Radio,
  RadioGroup,
  TextInput,
} from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { useState } from "react";
import { FilterSvg } from "../TableIcons";
import type { FilterState } from "./filters.types";
import { OperatorValues } from "./filters.types";

// @ts-expect-error("react-table-types")
const StringFilter = (props) => {
  const {
    column: { filterValue, setFilter },
  } = props;
  const [opened, setOpened] = useState(false);
  const [state, setState] = useSetState<FilterState>(
    filterValue || { operator: OperatorValues.CONTAINS, value: "" }
  );

  const handleClose = () => {
    setState(filterValue || { operator: OperatorValues.CONTAINS, value: "" });
    setOpened(false);
  };

  const handleClear = () => {
    setFilter(undefined);
    setState({ operator: OperatorValues.CONTAINS, value: "" });
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
        onChange={(o) => {
          setState({
            operator: o as OperatorValues,
          });
        }}
      >
        <Radio value="contains" label={"Contains"} />
        <Radio value="notContains" label={"Does not contain"} />
        <Radio value="startsWith" label={"Starts with"} />
        <Radio value="endsWith" label={"Ends with"} />
        <Radio value="equals" label={"Equals"} />
        <Radio value="not" label={"Not equal"} />
      </RadioGroup>
      <Divider my="sm" />
      <TextInput
        placeholder="Enter text"
        mb="sm"
        data-autofocus
        value={state.value as string}
        onChange={(e) => setState({ value: e.target.value })}
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

export default StringFilter;
