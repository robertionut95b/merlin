import { prisma } from "~/db.server";

export interface PaginationOptions {
  take: number;
  skip: number;
  where?: any;
  include: any;
}

export interface PaginationResponse<T> {
  records: T[];
  paginationMeta: {
    total: number;
  };
}

export const getPaginatedModelResponse = async <T>(
  model: T,
  options: PaginationOptions
): Promise<PaginationResponse<T>> => {
  const { take, skip, include } = options;
  const [total, records] = await prisma.$transaction([
    // @ts-expect-error("prisma-types")
    prisma[model].count({ take, skip, where: { ...options.where } }),
    // @ts-expect-error("prisma-types")
    prisma[model].findMany({
      take,
      skip,
      where: { ...options.where },
      include,
    }),
  ]);

  return {
    records,
    paginationMeta: {
      total,
    },
  };
};
