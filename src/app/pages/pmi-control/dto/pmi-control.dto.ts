export interface PmiControlDTO {
  idPmi: number;
  description: string;
  engineApu: string;
  idAircraftType: number;
  partNumber: string;
  serialNumber: string;
  inventoryNumber: string;
  dateManufacture: Date;
  idManufacture: number;
  lastPmiDate: Date;
  dueDate: Date;
  daysToGo: number;
  updateBy: number;
  idOwner: number;
  status: number;
}
