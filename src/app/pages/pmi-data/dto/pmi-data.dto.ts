export interface PmiDataDTO {
  id: number;
  equipmentId: number;
  pmiDate: Date;
  nextPmiDueDate: Date;
  pmiActivity: string;
  pmiResult: number;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
