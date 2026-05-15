import type { PaginationMeta, PaginationQuery } from '@repo/shared';

interface PaginationResult {
  readonly offset: number;
  readonly limit: number;
  readonly page: number;
}

export function buildPagination(query: PaginationQuery): PaginationResult {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 20));
  return { offset: (page - 1) * limit, limit, page };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  return { total, page, limit, totalPages: Math.ceil(total / limit) };
}
