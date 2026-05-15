import type { VerificationStatus } from '@repo/shared';

export type { VerificationStatus };

export interface VerificationRequest {
  readonly id: string;
  readonly lawyerId: string;
  readonly lawyerName: string;
  readonly barNumber: string;
  readonly submittedAt: string;
  readonly status: VerificationStatus;
}

export interface VerificationActionDto {
  readonly reason?: string;
}
