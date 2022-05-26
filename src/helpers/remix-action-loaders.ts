import { addDays, startOfDay } from "date-fns";
import qs from "qs";
import { validDateOrUndefined } from "./dates";

export const inputFromSearch = (queryString: URLSearchParams) =>
  qs.parse(queryString.toString());

export const getResourceFilters = (request: Request) =>
  inputFromSearch(new URL(request.url).searchParams);

class RequestFiltersMap {
  private map: Record<string, [string, string]> = {};

  public add(key: string, value: [string, string]) {
    this.map[key] = value;
  }

  public get(key: string, defValue: [string?, string?] = []) {
    return this.map[key] || defValue;
  }
}

export const getResourceFiltersOperatorValue = (
  request: Request,
  delimiter: string = ":"
) => {
  const filters = getResourceFilters(request);
  const f = new RequestFiltersMap();
  Object.keys(filters).forEach((k) => {
    const [, operator, value] = String(filters?.[k] || "").split(delimiter);
    f.add(k, [operator, value]);
  });
  return f;
};

export const parseDateFiltersToQuery = (operator: string, value: string) => {
  var date = validDateOrUndefined(value);
  if (date === undefined) return {};
  date = startOfDay(date);

  switch (operator) {
    case "equals":
      return {
        gte: date,
        lt: addDays(date, 1),
      };
    case "not":
      return {
        lte: date,
        gt: addDays(date, 1),
      };
    case "gt":
      return {
        gt: date,
      };
    case "gte":
      return {
        gte: date,
      };
    case "lt":
      return {
        lt: date,
      };
    case "lte":
      return {
        lte: date,
      };

    default:
      return {};
  }
};
