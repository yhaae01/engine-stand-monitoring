import { PmiPartDetailDTO } from 'src/app/pages/pmi-part-detail/dto/pmi-part-detail.dto';

export interface PmiDataDTO {
  pmiDataId: number;
  equipmentId: number;
  pmiDate: string;
  nextPmiDueDate: string;
  pmiActivity: string;
  pmiResult: number;
  pmiPartDetails: PmiPartDetailDTO[];
  pmiAggregate: {
    aggregate: {
      sum: {
        idealValue: number;
        actualValue: number;
      };
    };
  };
}
