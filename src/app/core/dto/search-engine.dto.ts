import { RequestDTO } from 'src/app/pages/request/dto/request.dto';
import { MasterAircraftDTO } from './master-aircraft.dto';
import { MasterManufactureDTO } from './master-manufacture.dto';
import { MasterTypeDTO } from './master-type.dto';
import { MasterOwnerDTO } from './master-owner.dto';
import { PmiDataDTO } from './pmi-data.dto';
import { RequestDataDTO } from './request-data.dto';
import { MasterDestinationDTO } from './master-destination.dto';
import { LogInventoryDTO } from './log-inventory.dto';

export interface SearchEngineDTO {
  searchEngineId: number;
  equipmentId: number;
  description: string;
  aircraftType: MasterAircraftDTO;
  type: MasterTypeDTO;
  destination: MasterDestinationDTO;
  manufactureDate: string;
  manufacture: MasterManufactureDTO;
  serialNumberEngine: RequestDTO;
  pmiDate: string;
  nextPmiDueDate: string;
  contractDate: string;
  notes: string;
  imagePath: string;
  inventoryNumber: number;
  pmiActivity: string;
  model: string;
  storageLocation: string;
  pmiResult: number;
  reason: string;
  limitation: number;
  pmiData: PmiDataDTO[];
  logEquipment: LogInventoryDTO[];
  accessory: string;
  requests: RequestDataDTO[];
  partNumber: string;
  serialNumber: string;
  isAvailable: number;
  status: number;
  owner: MasterOwnerDTO;
  overall: number;
  updatedBy: string;
  pmiAggregate: {
    aggregate: {
      sum: {
        idealValue: number;
        actualValue: number;
      };
    };
  };
}
