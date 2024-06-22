export interface ShowOutgoingFormDTO {
  idInventory: number;

  // Show data
  image: string;
  description: string;
  engineApuType: string;
  idAircraftType: number;
  partNumber: string;
  serialNumber: string;
  model: string;
  idOwner: number;
  idManufacture: number;
  limitationOfDate: string;
  contractDate: Date;
  initialPmiDate: Date;
  nextPmi: Date;
  storageLocation: string;
  addtionalAccessory: string;
  dateManufacture: Date;
  overall: string;
}
