import type { Filters } from "react-table";

export const mapFiltersToQueryParams = <T extends object>(
  url: string,
  filters: Filters<T>
) =>
  `${url}?${filters
    .map((f) => `${f.id}=${f.value}`)
    .join("&")
    .toString()}`;

export const mapQueryParamsToFilters = (url: string) => {
  const queryParams = new URLSearchParams(url);
  let filters: { id: any; value: any }[] = [];
  for (var [key, value] of queryParams.entries()) {
    filters.push({ id: key, value });
  }
  return filters;
};
