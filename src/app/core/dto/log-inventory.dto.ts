import { InventoryDTO } from './inventory.dto';

export interface LogInventoryDTO {
  inventoryData: InventoryDTO;

  link: string;
  status: number;
  createdBy: string;
  updatedBy: string;
  contractDate: Date;
}
