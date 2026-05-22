import { Inject, Injectable } from '@nestjs/common';
import type { PaginationQuery } from '@repo/shared';
import { and, avg, count, desc, eq } from 'drizzle-orm';
import { DATABASE_TOKEN, type DatabaseInstance } from '../../database/database.module';
import { lawyerProfiles, reviews, users } from '../../database/schema';
import { BaseRepository } from '../../common/utils/base.repository';
import { buildPagination } from '../../common/utils/pagination.util';
import type {
  InsertReviewData,
  IReviewsRepository,
  ReviewRow,
  UpsertReviewResponseData,
} from './interfaces/reviews.interfaces';

const REVIEW_SELECT = {
  id: reviews.id,
  appointmentId: reviews.appointmentId,
  lawyerId: reviews.lawyerId,
  rating: reviews.rating,
  text: reviews.text,
  lawyerResponse: reviews.lawyerResponse,
  lawyerRespondedAt: reviews.lawyerRespondedAt,
  createdAt: reviews.createdAt,
  clientId: reviews.clientId,
  clientFirstName: users.firstName,
  clientLastName: users.lastName,
  clientAvatarUrl: users.avatarUrl,
};

@Injectable()
export class ReviewsRepository extends BaseRepository implements IReviewsRepository {
  constructor(@Inject(DATABASE_TOKEN) db: DatabaseInstance) {
    super(db);
  }

  async insert(data: InsertReviewData): Promise<ReviewRow> {
    const [inserted] = await this.db
      .insert(reviews)
      .values({
        appointmentId: data.appointmentId,
        clientId: data.clientId,
        lawyerId: data.lawyerId,
        rating: data.rating,
        text: data.text,
      })
      .returning({ id: reviews.id });

    const [row] = await this.db
      .select(REVIEW_SELECT)
      .from(reviews)
      .innerJoin(users, eq(reviews.clientId, users.id))
      .where(eq(reviews.id, inserted!.id))
      .limit(1);

    return row!;
  }

  async findById(reviewId: string): Promise<ReviewRow | null> {
    const [row] = await this.db
      .select(REVIEW_SELECT)
      .from(reviews)
      .innerJoin(users, eq(reviews.clientId, users.id))
      .where(eq(reviews.id, reviewId))
      .limit(1);

    return row ?? null;
  }

  async findByAppointmentIdAndClientId(
    appointmentId: string,
    clientId: string,
  ): Promise<ReviewRow | null> {
    const [row] = await this.db
      .select(REVIEW_SELECT)
      .from(reviews)
      .innerJoin(users, eq(reviews.clientId, users.id))
      .where(and(eq(reviews.appointmentId, appointmentId), eq(reviews.clientId, clientId)))
      .limit(1);

    return row ?? null;
  }

  async findByLawyerId(
    lawyerId: string,
    query: PaginationQuery,
  ): Promise<{ items: ReviewRow[]; total: number }> {
    const { offset, limit } = buildPagination(query);

    const [countResult, rows] = await Promise.all([
      this.db
        .select({ total: count() })
        .from(reviews)
        .where(eq(reviews.lawyerId, lawyerId)),
      this.db
        .select(REVIEW_SELECT)
        .from(reviews)
        .innerJoin(users, eq(reviews.clientId, users.id))
        .where(eq(reviews.lawyerId, lawyerId))
        .orderBy(desc(reviews.createdAt))
        .limit(limit)
        .offset(offset),
    ]);

    return { items: rows, total: countResult[0]?.total ?? 0 };
  }

  async updateLawyerAggregates(lawyerId: string): Promise<void> {
    const [result] = await this.db
      .select({
        avgRating: avg(reviews.rating),
        totalReviews: count(),
      })
      .from(reviews)
      .where(eq(reviews.lawyerId, lawyerId));

    await this.db
      .update(lawyerProfiles)
      .set({
        avgRating: result?.avgRating ?? null,
        totalReviews: result?.totalReviews ?? 0,
      })
      .where(eq(lawyerProfiles.id, lawyerId));
  }

  async upsertLawyerResponse(data: UpsertReviewResponseData): Promise<ReviewRow> {
    await this.db
      .update(reviews)
      .set({
        lawyerResponse: data.text,
        lawyerRespondedAt: new Date(),
      })
      .where(and(eq(reviews.id, data.reviewId), eq(reviews.lawyerId, data.lawyerId)));

    const [row] = await this.db
      .select(REVIEW_SELECT)
      .from(reviews)
      .innerJoin(users, eq(reviews.clientId, users.id))
      .where(eq(reviews.id, data.reviewId))
      .limit(1);

    return row!;
  }
}
