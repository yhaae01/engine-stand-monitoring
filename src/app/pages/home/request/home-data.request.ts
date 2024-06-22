import { HomeFilterRequest } from './home-filter.request';

export interface HomeDataRequest {
  filter?: HomeFilterRequest;
  order?: object;
  limit?: number;
  offset?: number;
}
