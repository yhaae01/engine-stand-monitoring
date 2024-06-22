import { TypeFilterRequest } from '././type-filter.request';

export interface TypeDataRequest {
  filter?: TypeFilterRequest;
  order?: object;
  limit?: number;
  offset?: number;
}
