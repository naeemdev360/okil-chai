import type { PaginatedReviewsResponse, ReviewResponse } from '@repo/shared';
import type { PaginationQuery } from '@repo/shared';

export const REVIEWS_SERVICE = Symbol('REVIEWS_SERVICE');
export const REVIEWS_REPOSITORY = Symbol('REVIEWS_REPOSITORY');

// ── Repository types ──────────────────────────────────────────────────────────

export interface ReviewRow {
  readonly id: string;
  readonly appointmentId: string;
  readonly lawyerId: string;
  readonly rating: number;
  readonly text: string | null;
  readonly lawyerResponse: string | null;
  readonly lawyerRespondedAt: Date | null;
  readonly createdAt: Date;
  readonly clientId: string;
  readonly clientFirstName: string;
  readonly clientLastName: string;
  readonly clientAvatarUrl: string | null;
}

export interface InsertReviewData {
  readonly appointmentId: string;
  readonly clientId: string;
  readonly lawyerId: string;
  readonly rating: number;
  readonly text: string | null;
}

export interface UpsertReviewResponseData {
  readonly reviewId: string;
  readonly lawyerId: string;
  readonly text: string;
}

export interface IReviewsRepository {
  insert(data: InsertReviewData): Promise<ReviewRow>;
  findById(reviewId: string): Promise<ReviewRow | null>;
  findByAppointmentIdAndClientId(
    appointmentId: string,
    clientId: string,
  ): Promise<ReviewRow | null>;
  findByLawyerId(
    lawyerId: string,
    query: PaginationQuery,
  ): Promise<{ items: ReviewRow[]; total: number }>;
  updateLawyerAggregates(lawyerId: string): Promise<void>;
  upsertLawyerResponse(data: UpsertReviewResponseData): Promise<ReviewRow>;
}

// ── Service input ─────────────────────────────────────────────────────────────

export interface SubmitReviewInput {
  readonly appointmentId: string;
  readonly rating: number;
  readonly text?: string;
}

export interface RespondToReviewInput {
  readonly text: string;
}

// ── Service contract ──────────────────────────────────────────────────────────

export interface IReviewsService {
  submitReview(clientUserId: string, input: SubmitReviewInput): Promise<ReviewResponse>;
  getLawyerReviews(lawyerId: string, query: PaginationQuery): Promise<PaginatedReviewsResponse>;
  respondToReview(
    lawyerUserId: string,
    reviewId: string,
    input: RespondToReviewInput,
  ): Promise<ReviewResponse>;
}
