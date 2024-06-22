export interface AddReportHazardDTO {
  idHazard: number;
  description: string;
  engineApu: string;
  idAircraftType: number;
  partNumber: string;
  model: string;
  idManufacture: number;
  storageLocation: string;
  idOwner: number;
  dueDate: Date;
  dateManufacture: Date;
  inventoryNumber: string;
  status: string;
}
