import { ReportHazardFilterRequest } from './report-hazard-filter.request';

export interface ReportHazardDataRequest {
  filter?: ReportHazardFilterRequest;
  order?: object;
  limit?: number;
  offset?: number;
}
