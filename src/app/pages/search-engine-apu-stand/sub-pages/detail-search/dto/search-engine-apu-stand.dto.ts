export interface DetailSearchDTO {
  idSearch: number;
  // General Information
  description: string;
  inventoryNumber: string;
  idOwner: number;
  storageLocation: string;
  destination: string;
  reason: string;
  initialPmiDate: Date;
  nextPmi: Date;
  limitation: string;
  contractOfDate: Date;
  notes: string;

  // Specification Engine/APU Stand
  model: string;
  idAircraftType: number;
  engineApu: string;
  idManufacture: number;
  partNumber: string;
  serialNumber: string;
  dateManufacture: Date;
  overall: number;
  additionalAccessory: string;
}
