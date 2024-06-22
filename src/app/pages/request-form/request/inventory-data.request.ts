import { RequestFilterRequest } from './request-filter.request';

export interface RequestDataRequest {
  filter?: RequestFilterRequest;
  order?: object;
  limit?: number;
  offset?: number;
}
