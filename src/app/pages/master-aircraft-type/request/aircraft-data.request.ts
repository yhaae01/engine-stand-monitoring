import { AircraftFilterRequest } from './aircraft-filter.request';

export interface AircraftDataRequest {
  filter?: AircraftFilterRequest;
  order?: object;
  limit?: number;
  offset?: number;
}
