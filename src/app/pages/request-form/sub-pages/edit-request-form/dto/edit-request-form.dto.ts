export interface EditRequestFormDTO {
  id_request: number;
  id_equipment: number;
  job_desc_id: number;
  destination_id: number;
  date: Date;
  until: Date;
  work_order_reff: string;
  // next_activity: string;

  created_by: string;
  updated_by: string;
}
