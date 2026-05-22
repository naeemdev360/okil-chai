import { PaymentStatus } from '@repo/shared';

export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');
export const PAYMENTS_REPOSITORY = Symbol('PAYMENTS_REPOSITORY');

// ── Generic payment gateway contract ─────────────────────────────────────────
// Any provider (bKash, Nagad, SSLCommerz, Stripe …) implements this interface.
// The concrete class is swapped via DI in PaymentsModule — the rest of the app
// never knows which gateway is active.

export interface CreatePaymentInput {
  readonly amount: string;
  readonly invoiceRef: string;
  readonly payerRef: string;
}

export interface PaymentSession {
  readonly externalPaymentId: string;
  readonly redirectUrl: string;
  readonly currency: string;
}

export interface PaymentExecuteResult {
  readonly externalPaymentId: string;
  readonly externalTrxId: string;
  readonly isCompleted: boolean;
  readonly amount: string;
  readonly currency: string;
  readonly invoiceRef: string;
}

export interface IPaymentGateway {
  createPayment(input: CreatePaymentInput): Promise<PaymentSession>;
  executePayment(externalPaymentId: string): Promise<PaymentExecuteResult>;
  queryPayment(externalPaymentId: string): Promise<PaymentExecuteResult>;
  refundPayment(paymentId: string, trxId: string, amount: string): Promise<void>;
}

// ── Payments repository ───────────────────────────────────────────────────────

export interface InsertPaymentData {
  readonly appointmentId: string;
  readonly amount: string;
  readonly currency: string;
  readonly trxId: string | null;
  readonly platformFee: string | null;
  readonly lawyerPayout: string | null;
}

export interface PaymentRecord {
  readonly id: string;
  readonly appointmentId: string;
  readonly amount: string;
  readonly currency: string;
  readonly trxId: string | null;
  readonly status: PaymentStatus;
  readonly platformFee: string | null;
  readonly lawyerPayout: string | null;
  readonly payoutProcessedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface PaymentHistoryItem {
  readonly id: string;
  readonly appointmentId: string;
  readonly amount: string;
  readonly currency: string;
  readonly trxId: string | null;
  readonly status: PaymentStatus;
  readonly platformFee: string | null;
  readonly lawyerPayout: string | null;
  readonly payoutProcessedAt: Date | null;
  readonly createdAt: Date;
  // joined appointment fields
  readonly appointmentStartAt: Date;
  readonly appointmentEndAt: Date;
  readonly counterpartFirstName: string;
  readonly counterpartLastName: string;
}

export interface EarningsSummary {
  readonly totalEarned: string;
  readonly pendingPayout: string;
  readonly paidOut: string;
  readonly totalTransactions: number;
}

export interface PendingPayoutItem {
  readonly lawyerProfileId: string;
  readonly lawyerFirstName: string;
  readonly lawyerLastName: string;
  readonly lawyerEmail: string;
  readonly totalPending: string;
  readonly transactionCount: number;
  readonly oldestUnpaidAt: Date;
  readonly paymentIds: string[];
}

export interface PaymentHistoryOptions {
  readonly page?: number;
  readonly limit?: number;
}

export interface IPaymentsRepository {
  insert(data: InsertPaymentData): Promise<PaymentRecord>;
  findByAppointmentId(appointmentId: string): Promise<PaymentRecord | null>;
  updateStatusToRefunded(appointmentId: string): Promise<void>;
  findHistoryByClientId(
    clientId: string,
    opts: PaymentHistoryOptions,
  ): Promise<{ items: PaymentHistoryItem[]; total: number }>;
  findHistoryByLawyerProfileId(
    lawyerProfileId: string,
    opts: PaymentHistoryOptions,
  ): Promise<{ items: PaymentHistoryItem[]; total: number }>;
  getEarningsSummaryByLawyerProfileId(lawyerProfileId: string): Promise<EarningsSummary>;
  listPendingPayouts(): Promise<PendingPayoutItem[]>;
  markPayoutsProcessed(paymentIds: readonly string[]): Promise<void>;
}
