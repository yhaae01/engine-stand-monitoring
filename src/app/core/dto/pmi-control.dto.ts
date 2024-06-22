import { RequestDTO } from 'src/app/pages/request/dto/request.dto';
import { MasterAircraftDTO } from './master-aircraft.dto';
import { MasterManufactureDTO } from './master-manufacture.dto';
import { MasterTypeDTO } from './master-type.dto';
import { MasterOwnerDTO } from './master-owner.dto';
import { PmiDataDTO } from './pmi-data.dto';
import { PmiSheetDTO } from './pmi-sheet.dto';

export interface PmiControlDTO {
  pmiControlId: number;
  equipmentId: number;
  description: string;
  aircraftType: MasterAircraftDTO;
  type: MasterTypeDTO;
  manufactureDate: Date;
  manufacture: MasterManufactureDTO;
  serialNumberEngine: RequestDTO;
  pmiDate: Date;
  nextPmiDueDate: Date;
  inventoryNumber: number;
  pmiActivity: string;
  pmiResult: number;
  pmiData: PmiDataDTO;
  partNumber: string;
  serialNumber: string;
  isAvailable: number;
  status: number;
  owner: MasterOwnerDTO;
  updatedBy: string;
  days: number;

  pmiSheet: PmiSheetDTO[];
}
