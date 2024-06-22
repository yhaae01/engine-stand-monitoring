import { PmiFilterRequest } from '././pmi-filter.request';

export interface PmiDataRequest {
  filter?: PmiFilterRequest;
  order?: object;
  limit?: number;
  offset?: number;
}
