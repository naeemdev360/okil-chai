export interface PaginationMeta {
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

export interface PaginationQuery {
  readonly page?: number;
  readonly limit?: number;
}
