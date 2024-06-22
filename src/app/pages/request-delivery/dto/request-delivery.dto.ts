import { DeliversDTO } from 'src/app/core/dto/delivery.dto';
import { MasterDestinationDTO } from 'src/app/core/dto/master-destination.dto';

export interface RequestDeliveryDTO {
  requestDeliveryId: number;
  destination: MasterDestinationDTO;
  requestId: number;
  deliver: DeliversDTO;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
