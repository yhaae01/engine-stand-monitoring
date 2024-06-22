import { OwnerFilterRequest } from './owner-filter.request';

export interface OwnerDataRequest {
  filter?: OwnerFilterRequest;
  order?: object;
  limit?: number;
  offset?: number;
}
