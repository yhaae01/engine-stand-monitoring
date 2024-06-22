import { RectificationFilterRequest } from './rectification-filter.request';

export interface RectificationDataRequest {
  filter?: RectificationFilterRequest;
  order?: object;
  limit?: number;
  offset?: number;
}
