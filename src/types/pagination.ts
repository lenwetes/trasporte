/**
 * Standard pagination types for the application
 */

export interface PaginationParams {
    page?: number;
    pageSize?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        totalBlocked?: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export interface PaginationOptions {
    page: number;
    pageSize: number;
}

/**
 * Default pagination values
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/**
 * Parse and validate pagination parameters
 */
export function parsePaginationParams(
    params: PaginationParams,
): PaginationOptions {
    const page = Math.max(1, params.page || DEFAULT_PAGE);
    const pageSize = Math.min(
        MAX_PAGE_SIZE,
        Math.max(1, params.pageSize || DEFAULT_PAGE_SIZE),
    );

    return { page, pageSize };
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
    totalItems: number,
    options: PaginationOptions,
): PaginatedResponse<never>["pagination"] {
    const totalPages = Math.ceil(totalItems / options.pageSize);

    return {
        page: options.page,
        pageSize: options.pageSize,
        totalItems,
        totalPages,
        hasNextPage: options.page < totalPages,
        hasPreviousPage: options.page > 1,
    };
}

/**
 * Calculate skip value for Prisma queries
 */
export function calculateSkip(options: PaginationOptions): number {
    return (options.page - 1) * options.pageSize;
}
