import { CategoryFilterRequest } from './category-filter.request';

export interface CategoryDataRequest {
  filter?: CategoryFilterRequest;
  order?: object;
  limit?: number;
  offset?: number;
}
