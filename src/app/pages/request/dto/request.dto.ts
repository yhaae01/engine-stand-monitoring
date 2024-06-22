export interface RequestDTO {
  requestId: number;
  equipmentId: number;
  jobDescriptionId: number;
  destinationId: number;
  date: Date;
  requestDate: Date;
  workOrderReff: string;
  until: Date;
  serialNumberEngine: string;
}
