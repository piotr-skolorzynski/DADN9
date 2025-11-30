import { IPagination } from './pagination.interface';

export interface IPaginatedResult<T> {
  items: T[];
  metadata: IPagination;
}
