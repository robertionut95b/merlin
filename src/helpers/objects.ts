export const isEmptyObject = (obj: object) =>
  obj &&
  Object.keys(obj).length === 0 &&
  Object.getPrototypeOf(obj) === Object.prototype;
