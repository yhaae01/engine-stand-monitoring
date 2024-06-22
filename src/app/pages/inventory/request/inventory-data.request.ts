import { InventoryFilterRequest } from './inventory-filter.request';

export interface InventoryDataRequest {
  filter?: InventoryFilterRequest;
  order?: object;
  limit?: number;
  offset?: number;
}
