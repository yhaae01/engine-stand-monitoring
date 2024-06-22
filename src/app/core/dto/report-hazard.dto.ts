import { MasterRectificationDTO } from 'src/app/core/dto/master-rectification.dto';
import { MasterCategoryDTO } from './master-category.dto';
import { InventoryDTO } from './inventory.dto';

export interface ReportHazardDTO {
  hazardId: number;
  category: MasterCategoryDTO;
  equipment: InventoryDTO;
  rectification: MasterRectificationDTO;
  rectificationId: number;
  isClosed: number;
  imagePath: string;
  link: string;
  notes: string;
  remark: string;
  reason: string;
  remedy: Date;

  createdBy: string;
  updatedBy: string;
}
