import { RequestDTO } from 'src/app/pages/request/dto/request.dto';
import { MasterAircraftDTO } from './master-aircraft.dto';
import { MasterManufactureDTO } from './master-manufacture.dto';
import { MasterTypeDTO } from './master-type.dto';
import { MasterDestinationDTO } from './master-destination.dto';
import { MasterJobDescDTO } from './master-job-desc.dto';
import { RequestDateDTO } from 'src/app/pages/request-date/dto/request-date.dto';

export interface RequestDataDTO {
  requestId: number;
  jobDescId: number;
  destinationId: number;
  requestDateId: number;
  aircraftType: MasterAircraftDTO;
  type: MasterTypeDTO;
  manufacture: MasterManufactureDTO;
  partNumber: string;
  jobDescription: MasterJobDescDTO[];
  workOrderReff: string;
  date: Date;
  until: Date;
  requestDate: RequestDateDTO;
  serialNumber: string;
  remark: string;
  isAvailable: number;
  serialNumberEngine: RequestDTO;
  equipmentId: number;
}
