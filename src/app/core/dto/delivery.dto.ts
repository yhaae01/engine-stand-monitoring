export interface DeliversDTO {
  id: number;
  activityId: number;
  requestDeliveryId: number;
  status: string;
  nextActivity: string;
  createBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
