import type { UseFiltersColumnOptions } from "react-table";

export type FilterState = { operator: OperatorValues; value: string | Date };

export type TableFilter = {
  id: string;
  value: FilterState;
};

export enum OperatorValues {
  EQUAL = "equals",
  NOT_EQUAL = "not",
  GREATER_THAN = "gt",
  LESS_THAN = "lt",
  GREATER_THAN_OR_EQUAL = "gte",
  LESS_THAN_OR_EQUAL = "lte",
  CONTAINS = "contains",
  NOT_CONTAINS = "notContains",
  STARTS_WITH = "startsWith",
  ENDS_WITH = "endsWith",
}

export interface UseFiltersColumnOptionsWithOptionsList<T>
  extends UseFiltersColumnOptions<T & object> {
  options?: { value: string; label: string }[];
}
