import { DestinationFilterRequest } from './destination-filter.request';

export interface DestinationDataRequest {
  filter?: DestinationFilterRequest;
  order?: object;
  limit?: number;
  offset?: number;
}
