import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  AppointmentResponse,
  AppointmentWithPayment,
  PaginatedAppointmentsResponse,
} from '@repo/shared';
import { AppointmentStatus, MIN_APPOINTMENT_DURATION_MS, Role } from '@repo/shared';
import {
  MAIL_PRODUCER,
  type IMailProducer,
} from '../mailer/interfaces/mailer.interfaces';
import {
  PAYMENT_GATEWAY,
  PAYMENTS_REPOSITORY,
  type IPaymentGateway,
  type IPaymentsRepository,
} from '../payments/interfaces/payments.interfaces';
import {
  APPOINTMENTS_REPOSITORY,
  type AppointmentRow,
  type CreateAppointmentInput,
  type IAppointmentsRepository,
  type IAppointmentsService,
  type ListAppointmentsQuery,
} from './interfaces/appointments.interfaces';
import { LAWYERS_SERVICE, type ILawyersService } from '../lawyers/interfaces/lawyers.interfaces';
import { buildPaginationMeta } from '../../common/utils/pagination.util';

const CANCELLABLE_STATUSES: AppointmentStatus[] = [
  AppointmentStatus.PENDING_PAYMENT,
  AppointmentStatus.CONFIRMED,
];
const COMPLETABLE_STATUSES: AppointmentStatus[] = [
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.IN_PROGRESS,
];

@Injectable()
export class AppointmentsService implements IAppointmentsService {
  constructor(
    @Inject(APPOINTMENTS_REPOSITORY)
    private readonly appointmentsRepository: IAppointmentsRepository,
    @Inject(LAWYERS_SERVICE)
    private readonly lawyersService: ILawyersService,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: IPaymentGateway,
    @Inject(PAYMENTS_REPOSITORY)
    private readonly paymentsRepository: IPaymentsRepository,
    @Inject(MAIL_PRODUCER)
    private readonly mailProducer: IMailProducer,
  ) {}

  private toResponse(row: AppointmentRow): AppointmentResponse {
    return {
      id: row.id,
      clientId: row.clientId,
      lawyerId: row.lawyerId,
      consultationType: row.consultationType,
      startAt: row.startAt,
      endAt: row.endAt,
      status: row.status,
      caseCategory: row.caseCategory,
      clientNotes: row.clientNotes,
      client: {
        id: row.clientId,
        firstName: row.clientFirstName,
        lastName: row.clientLastName,
        photoUrl: row.clientAvatarUrl,
      },
      lawyer: {
        id: row.lawyerId,
        firstName: row.lawyerFirstName,
        lastName: row.lawyerLastName,
        photoUrl: row.lawyerPhotoUrl,
      },
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async createAppointment(
    clientUserId: string,
    input: CreateAppointmentInput,
  ): Promise<AppointmentWithPayment> {
    const lawyerProfile = await this.lawyersService.getPublicProfile(input.lawyerId);

    const { startAt, endAt } = input;

    if (startAt >= endAt) {
      throw new BadRequestException('endAt must be after startAt');
    }

    if (endAt.getTime() - startAt.getTime() < MIN_APPOINTMENT_DURATION_MS) {
      throw new BadRequestException('Appointment must be at least 15 minutes long');
    }

    if (startAt < new Date()) {
      throw new BadRequestException('Cannot book an appointment in the past');
    }

    const hasConflict = await this.appointmentsRepository.hasConflict(
      input.lawyerId,
      startAt,
      endAt,
    );
    if (hasConflict) {
      throw new ConflictException('This time slot is already booked');
    }

    const pricePerHour = lawyerProfile.pricePerHour ? parseFloat(lawyerProfile.pricePerHour) : 0;
    const durationHours = (endAt.getTime() - startAt.getTime()) / (1000 * 60 * 60);
    const feeAmount = (pricePerHour * durationHours).toFixed(2);
    const isFree = parseFloat(feeAmount) === 0;

    const status = isFree ? AppointmentStatus.CONFIRMED : AppointmentStatus.PENDING_PAYMENT;

    const row = await this.appointmentsRepository.insert({
      clientId: clientUserId,
      lawyerId: input.lawyerId,
      consultationType: input.consultationType,
      caseCategory: input.caseCategory,
      startAt,
      endAt,
      clientNotes: input.clientNotes ?? null,
      externalPaymentId: null,
      status,
    });

    if (isFree) {
      await this.sendConfirmationEmails(row.id);

      return {
        ...this.toResponse(row),
        redirectUrl: null,
        externalPaymentId: null,
        feeAmount: '0.00',
        currency: 'BDT',
      };
    }

    const paymentSession = await this.paymentGateway.createPayment({
      amount: feeAmount,
      invoiceRef: row.id,
      payerRef: clientUserId,
    });

    await this.appointmentsRepository.updateExternalPaymentId(row.id, paymentSession.externalPaymentId);

    return {
      ...this.toResponse(row),
      redirectUrl: paymentSession.redirectUrl,
      externalPaymentId: paymentSession.externalPaymentId,
      feeAmount,
      currency: paymentSession.currency,
    };
  }

  async listAppointments(
    userId: string,
    roles: readonly Role[],
    query: ListAppointmentsQuery,
  ): Promise<PaginatedAppointmentsResponse> {
    const isLawyer = roles.includes(Role.LAWYER);
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const { items, total } = await this.appointmentsRepository.findByParticipant(
      userId,
      isLawyer,
      query,
    );

    return {
      data: items.map((row) => this.toResponse(row)),
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getAppointment(
    userId: string,
    roles: readonly Role[],
    appointmentId: string,
  ): Promise<AppointmentResponse> {
    const row = await this.appointmentsRepository.findById(appointmentId);
    if (!row) throw new NotFoundException('Appointment not found');

    const isAdmin = roles.includes(Role.PLATFORM_ADMIN);
    const isParticipant = row.clientId === userId || row.lawyerUserId === userId;

    if (!isAdmin && !isParticipant) {
      throw new ForbiddenException('You are not a participant of this appointment');
    }

    return this.toResponse(row);
  }

  async cancelAppointment(
    userId: string,
    roles: readonly Role[],
    appointmentId: string,
  ): Promise<void> {
    const row = await this.appointmentsRepository.findById(appointmentId);
    if (!row) throw new NotFoundException('Appointment not found');

    const isClient = row.clientId === userId;
    const isLawyer = row.lawyerUserId === userId;
    const isAdmin = roles.includes(Role.PLATFORM_ADMIN);

    if (!isClient && !isLawyer && !isAdmin) {
      throw new ForbiddenException('You are not a participant of this appointment');
    }

    if (!CANCELLABLE_STATUSES.includes(row.status)) {
      throw new BadRequestException(`Cannot cancel an appointment with status: ${row.status}`);
    }

    let newStatus: AppointmentStatus;
    if (isAdmin) {
      newStatus = AppointmentStatus.CANCELLED_BY_ADMIN;
    } else if (isLawyer) {
      newStatus = AppointmentStatus.CANCELLED_BY_LAWYER;
    } else {
      newStatus = AppointmentStatus.CANCELLED_BY_CLIENT;
    }

    await this.appointmentsRepository.updateStatus(appointmentId, newStatus);
    // TODO: For CONFIRMED appointments with a bKash payment, trigger a refund via admin action or a background job.
  }

  async completeAppointment(lawyerUserId: string, appointmentId: string): Promise<void> {
    const row = await this.appointmentsRepository.findById(appointmentId);
    if (!row) throw new NotFoundException('Appointment not found');

    if (row.lawyerUserId !== lawyerUserId) {
      throw new ForbiddenException('Only the assigned lawyer can complete this appointment');
    }

    if (!COMPLETABLE_STATUSES.includes(row.status)) {
      throw new BadRequestException(`Cannot complete an appointment with status: ${row.status}`);
    }

    await this.appointmentsRepository.updateStatus(appointmentId, AppointmentStatus.COMPLETED);
  }

  async confirmPayment(externalPaymentId: string): Promise<string> {
    const executeResult = await this.paymentGateway.executePayment(externalPaymentId);

    if (!executeResult.isCompleted) {
      throw new BadRequestException('Payment was not completed by the gateway');
    }

    const appointmentId = executeResult.invoiceRef;

    await this.appointmentsRepository.updateStatus(appointmentId, AppointmentStatus.CONFIRMED);

    await this.paymentsRepository.insert({
      appointmentId,
      amount: executeResult.amount,
      currency: executeResult.currency,
      trxId: executeResult.externalTrxId,
    });

    await this.sendConfirmationEmails(appointmentId);

    return appointmentId;
  }

  async handlePaymentFailure(externalPaymentId: string): Promise<void> {
    const row = await this.appointmentsRepository.findByExternalPaymentId(externalPaymentId);
    if (!row) return;
    await this.appointmentsRepository.updateStatus(row.id, AppointmentStatus.DRAFT);
  }

  private async sendConfirmationEmails(appointmentId: string): Promise<void> {
    const info = await this.appointmentsRepository.findContactInfo(appointmentId);
    if (!info) return;

    const dateLabel = info.startAt.toUTCString();

    await Promise.all([
      this.mailProducer.sendBookingConfirmationEmail({
        to: info.clientEmail,
        firstName: info.clientFirstName,
        appointmentDate: dateLabel,
        consultationType: info.consultationType,
        isLawyer: false,
      }),
      this.mailProducer.sendBookingConfirmationEmail({
        to: info.lawyerEmail,
        firstName: info.lawyerFirstName,
        appointmentDate: dateLabel,
        consultationType: info.consultationType,
        isLawyer: true,
      }),
    ]);
  }
}
