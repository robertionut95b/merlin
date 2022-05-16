import type {
  OperatorValues,
  TableFilter,
} from "~/components/tables/filters/filters.types";

export const filterSetToURL = (filters: TableFilter[]) =>
  filters
    .map((filter) => {
      const { id, value } = filter;
      const { operator, value: filterValue } = value;
      return `${id}=:${operator}:${filterValue}`;
    })
    .join("&");

export const filterSetToURLSearchParams = (filters: TableFilter[]) =>
  new URLSearchParams(filterSetToURL(filters));

export const URLtoFilterSet = (url: string): TableFilter[] => {
  const urlSearchParams = new URLSearchParams(url);
  const filterSet: TableFilter[] = [];
  for (const [key, value] of urlSearchParams.entries()) {
    const [, operator, filterValue] = value.split(":");
    filterSet.push({
      id: key,
      value: {
        operator: operator as OperatorValues,
        value: filterValue,
      },
    });
  }
  return filterSet;
};

export const filterSetToTableFilters = (filters: TableFilter[]) => {
  return filters.map((f) => ({
    id: f.id,
    value: f.value,
  }));
};
