import { JobDescFilterRequest } from './job-desc-filter.request';

export interface JobDescDataRequest {
  filter?: JobDescFilterRequest;
  order?: object;
  limit?: number;
  offset?: number;
}
