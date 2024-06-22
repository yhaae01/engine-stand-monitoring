export interface ReportHazardDTO {
  idHazard: number;
  description: string;
  engineApu: string;
  idAircraftType: number;
  model: string;
  partNumber: string;
  serialNumber: string;
  inventoryNumber: string;
  dateManufacture: Date;
  idManufacture: number;
  dueDate: Date;
  idOwner: number;
  storageLocation: string;
  subject: string;
  status: string;
}
