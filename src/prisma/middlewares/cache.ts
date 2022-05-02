import type { Prisma } from "@prisma/client";
import type NodeCache from "node-cache";

export async function cacheModelByQuery(
  model: string,
  params: Prisma.MiddlewareParams,
  next: (params: Prisma.MiddlewareParams) => Promise<any>,
  cache: NodeCache
) {
  const key: string =
    JSON.stringify(params.action) + JSON.stringify(params.args);
  if (params.model === model) {
    const cached = cache.get(key);
    if (cached) {
      console.debug(`Hitting cache for ${model}`);
      return cached;
    }
  }
  const result = await next(params);
  cache.set(key, result);
  console.debug(`Not hitting cache for ${model}`);
  return result;
}
