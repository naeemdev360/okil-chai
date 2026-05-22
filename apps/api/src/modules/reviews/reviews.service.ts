import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import type { PaginatedReviewsResponse, ReviewResponse } from '@repo/shared';
import { AppointmentStatus, Role } from '@repo/shared';
import type { PaginationQuery } from '@repo/shared';
import {
  APPOINTMENTS_SERVICE,
  type IAppointmentsService,
} from '../appointments/interfaces/appointments.interfaces';
import { buildPagination, buildPaginationMeta } from '../../common/utils/pagination.util';
import type { SubmitReviewInput } from './interfaces/reviews.interfaces';
import {
  REVIEWS_REPOSITORY,
  type IReviewsRepository,
  type IReviewsService,
  type ReviewRow,
} from './interfaces/reviews.interfaces';

@Injectable()
export class ReviewsService implements IReviewsService {
  constructor(
    @Inject(REVIEWS_REPOSITORY)
    private readonly reviewsRepository: IReviewsRepository,
    @Inject(APPOINTMENTS_SERVICE)
    private readonly appointmentsService: IAppointmentsService,
  ) {}

  async submitReview(clientUserId: string, input: SubmitReviewInput): Promise<ReviewResponse> {
    const appointment = await this.appointmentsService.getAppointment(
      clientUserId,
      [Role.CLIENT],
      input.appointmentId,
    );

    if (appointment.status !== AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Reviews can only be submitted for completed appointments');
    }

    const existing = await this.reviewsRepository.findByAppointmentIdAndClientId(
      input.appointmentId,
      clientUserId,
    );
    if (existing) {
      throw new ConflictException('You have already submitted a review for this appointment');
    }

    const row = await this.reviewsRepository.insert({
      appointmentId: input.appointmentId,
      clientId: clientUserId,
      lawyerId: appointment.lawyerId,
      rating: input.rating,
      text: input.text ?? null,
    });

    await this.reviewsRepository.updateLawyerAggregates(appointment.lawyerId);

    return this.toResponse(row);
  }

  async getLawyerReviews(
    lawyerId: string,
    query: PaginationQuery,
  ): Promise<PaginatedReviewsResponse> {
    const { page, limit } = buildPagination(query);
    const { items, total } = await this.reviewsRepository.findByLawyerId(lawyerId, query);

    return {
      data: items.map((r) => this.toResponse(r)),
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  private toResponse(row: ReviewRow): ReviewResponse {
    return {
      id: row.id,
      appointmentId: row.appointmentId,
      lawyerId: row.lawyerId,
      rating: row.rating,
      text: row.text,
      client: {
        id: row.clientId,
        firstName: row.clientFirstName,
        lastName: row.clientLastName,
        avatarUrl: row.clientAvatarUrl,
      },
      createdAt: row.createdAt,
    };
  }
}
