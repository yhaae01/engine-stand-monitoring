export interface RequestFormDTO {
  idRequest: number;
  // id_availability_check: number;
  destination: string;
  // entry_by: number;
  // name: string;
  // unit: string;
  startDate: Date;
  endDate: Date;
  jobDesc: string;
  days: number;
  workOrderRef: string;
  remark: string;
}
