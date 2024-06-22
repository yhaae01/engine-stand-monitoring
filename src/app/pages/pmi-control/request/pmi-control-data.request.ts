import { PmiControlFilterRequest } from './pmi-control-filter.request';

export interface PmiControlDataRequest {
  filter?: PmiControlFilterRequest;
  order?: object;
  limit?: number;
  offset?: number;
}
