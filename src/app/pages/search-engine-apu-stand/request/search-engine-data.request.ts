import { SearchEngineFilterRequest } from './search-engine-filter.request';

export interface SearchEngineDataRequest {
  filter?: SearchEngineFilterRequest;
  order?: object;
  limit?: number;
  offset?: number;
}
