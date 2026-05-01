export interface CreateReviewDto {
  readonly appointmentId: string;
  readonly rating: number;
  readonly comment: string;
}

export interface Review {
  readonly id: string;
  readonly appointmentId: string;
  readonly clientId: string;
  readonly lawyerId: string;
  readonly rating: number;
  readonly comment: string;
  readonly createdAt: string;
}
