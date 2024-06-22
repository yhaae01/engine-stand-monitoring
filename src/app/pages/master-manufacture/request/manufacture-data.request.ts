import { ManufactureFilterRequest } from './manufacture-filter.request';

export interface ManufactureDataRequest {
  filter?: ManufactureFilterRequest;
  order?: object;
  limit?: number;
  offset?: number;
}
