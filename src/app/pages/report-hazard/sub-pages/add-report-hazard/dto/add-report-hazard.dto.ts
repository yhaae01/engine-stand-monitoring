export interface AddReportHazardDTO {
  equipmentId: number;
  categoryId: number;
  imagePath: string;
  notes: string;

  isClosed: number;

  rectificationId: number;
  remedy: Date;
  reason: string;
  link: string;

  createdBy: string;
  updatedAt: string;
}
