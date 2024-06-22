export interface AddDataInventoryDTO {
  image_path: string;
  description: 'engine' | 'apu';
  destination_id?: number;
  type_id: number;
  aircraft_type_id: number[];
  part_number: string;
  serial_number: string;
  model?: string;
  storage_location?: string;
  owner_id: number;
  limitation: number;
  contract_date?: Date;
  manufacture_id: number;
  manufacture_date?: Date;
  inventory_number?: string;
  inventory_date?: Date;
  accessory?: string;
  remark?: string;
  activity_status: number;
  created_by: string;
  updated_by: string;
  is_available: number;

  // Insert ke tabel PMI
  // pmi_date: Date;
  // next_pmi_due_date: Date;
  // pmi_activity: string;
}
