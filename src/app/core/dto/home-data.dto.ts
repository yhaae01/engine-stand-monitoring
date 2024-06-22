import { RequestDTO } from 'src/app/pages/request/dto/request.dto';
import { MasterAircraftDTO } from './master-aircraft.dto';
import { MasterTypeDTO } from './master-type.dto';
import { MasterManufactureDTO } from './master-manufacture.dto';
import { MasterOwnerDTO } from './master-owner.dto';
import { MasterDestinationDTO } from './master-destination.dto';
import { PmiDataDTO } from './pmi-data.dto';
import { LogInventoryDTO } from './log-inventory.dto';
import { PmiSheetDTO } from './pmi-sheet.dto';
import { RequestDateDTO } from 'src/app/pages/request-date/dto/request-date.dto';
import { RequestDeliveryDTO } from 'src/app/pages/request-delivery/dto/request-delivery.dto';
import { InventoryDTO } from './inventory.dto';

export interface HomeDataDTO {
  equipmentId: number;
  requestId: number;
  remark: string;
  destination: MasterDestinationDTO;
  isAvailable: number;
  description: string;
  imagePath: string;
  date: Date;
  equipmentData: InventoryDTO;
  aircraftType: MasterAircraftDTO;
  type: MasterTypeDTO;
  manufacture: MasterManufactureDTO;
  partNumber: string;
  serialNumber: string;
  inventoryNumber: string;
  inventoryDate: Date;
  requestDate: RequestDateDTO;
  requestDelivery: RequestDeliveryDTO[];
  model: string;
  owner: MasterOwnerDTO;
  storageLocation: string;
  reason: string;
  link: string;
  manufactureDate: Date;
  pmiData: PmiDataDTO[];
  pmiSheet: PmiSheetDTO[];
  logEquipment: LogInventoryDTO[];
  nextPmiDueDate: PmiDataDTO;
  limitation: string;
  contractDate: Date;
  accessory: string;
  notes: string;
  overall: number;
  status: number;
  workOrderReff: string;

  serialNumberEngine: RequestDTO;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  days: number;
}
