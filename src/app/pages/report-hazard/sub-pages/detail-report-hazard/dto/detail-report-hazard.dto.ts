export interface DetailReportHazardDTO {
  idHazard: number;
  serialNumber: string;
  image: string;
  categoryHazard: number;
  notes: string;
  description: string;
  engine_apu: string;
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
