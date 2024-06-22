import { MasterAircraftDTO } from './master-aircraft.dto';
import { MasterTypeDTO } from './master-type.dto';
import { MasterManufactureDTO } from './master-manufacture.dto';
import { MasterOwnerDTO } from './master-owner.dto';
import { MasterDestinationDTO } from './master-destination.dto';
import { PmiDataDTO } from './pmi-data.dto';
import { LogInventoryDTO } from './log-inventory.dto';
import { PmiSheetDTO } from './pmi-sheet.dto';
import { RequestDataDTO } from './request-data.dto';

export interface InventoryDTO {
  equipmentId: number;
  requestId: number;
  description: string;
  imagePath: string;
  aircraftType: MasterAircraftDTO;
  type: MasterTypeDTO;
  manufacture: MasterManufactureDTO;
  partNumber: string;
  serialNumber: string;
  inventoryNumber: string;
  inventoryDate: string;
  model: string;
  owner: MasterOwnerDTO;
  storageLocation: string;
  request: RequestDataDTO;
  destination: MasterDestinationDTO;
  reason: string;
  link: string;
  manufactureDate: string;
  pmiData: PmiDataDTO[];
  pmiSheet: PmiSheetDTO[];
  logEquipment: LogInventoryDTO[];
  nextPmiDueDate: PmiDataDTO;
  limitation: string;
  contractDate: string;
  accessory: string;
  remark: string;
  notes: string;
  overall: number;
  status: number;
  isAvailable: number;
  pmiAggregate: {
    aggregate: {
      sum: {
        idealValue: number;
        actualValue: number;
      };
    };
  };
}
