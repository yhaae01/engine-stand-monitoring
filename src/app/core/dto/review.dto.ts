export interface ReviewDTO {
  app: string;
  personal_number: number;
  rating: number;
  review_text: string;
  scope?: string[];
}
