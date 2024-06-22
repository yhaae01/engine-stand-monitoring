export interface InsertOutgoingFormDTO {
  idInventory: number;

  // Insert data
  destination: string;
  reason: string;
  notes: string;
  externalLink: string;
}
