import qs from "qs";

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
