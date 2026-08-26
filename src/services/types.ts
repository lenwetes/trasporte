import { ActionResult } from "@/types";

/**
 * Base Interface for all Business Services
 * Services should handle DB logic, complex validations and data transformations.
 */
export interface IBaseService<T, CreateInput, UpdateInput> {
    getById(id: string): Promise<ActionResult<T>>;
    getAll(params: {
        page?: number;
        pageSize?: number;
    }): Promise<ActionResult<T[]>>;
    create(data: CreateInput): Promise<ActionResult<T>>;
    update(id: string, data: UpdateInput): Promise<ActionResult<T>>;
    delete(id: string): Promise<ActionResult>;
}
