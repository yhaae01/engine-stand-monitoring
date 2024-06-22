import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { PmiPartDetailDTO } from 'src/app/pages/pmi-part-detail/dto/pmi-part-detail.dto';
import { PmiPartDetailComponent } from 'src/app/pages/pmi-part-detail/pmi-part-detail.component';

interface PMIPartDetailData {
  data: PMIPartDetails[];
}

interface PMIPartDetails {
  pmi_m_part_id: number;
  ideal_value: number;
  actual_value: number;
  created_by: UserDataDTO;
  updated_by: UserDataDTO;
}

export interface AddDataPmiControlDTO {
  equipment_id: number;
  pmi_date: Date;
  next_pmi_due_date: Date;
  pmi_activity: string;
  pmi_result: string;
  created_by: string;
  updated_by: string;

  pmi_m_part_id: number;
  ideal_value1: number;
  actual_value1: number;
  ideal_value2: number;
  actual_value2: number;
  ideal_value3: number;
  actual_value3: number;

  pmi_part_details: PMIPartDetailData;
}
