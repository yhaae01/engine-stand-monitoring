export interface DetailInventoryDTO {
  idInventory: number;

  // General Information
  storageLocation: string;
  inventoryNumber: string;
  inventoryDate: Date;
  initialPmiDate: Date;
  destination: string;
  reason: string;
  contractDate: Date;
  nextPmi: Date;
  limitaion: string;
  notes: string;
  status: string;

  // Spesification Engine/APU Stand
  model: string;
  idAircraftType: number;
  engineApuType: string;
  idManufacture: number;
  partNumber: string;
  serialNumber: string;
  dateManufacture: Date;
  overall: string;
  addtionalAccessory: string;
  description: string;
  idOwner: number;

  // Table
  activity: string;
  lastDate: Date;
  nextDate: Date;
  entryBy: number;
  result: string;
}
