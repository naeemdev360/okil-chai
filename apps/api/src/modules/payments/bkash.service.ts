import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  CreatePaymentInput,
  IPaymentGateway,
  PaymentExecuteResult,
  PaymentSession,
} from './interfaces/payments.interfaces';

interface TokenCache {
  readonly token: string;
  readonly expiresAt: number;
}

// bKash raw response shapes — kept private to this file
interface BkashPaymentSession {
  readonly paymentID: string;
  readonly bkashURL: string;
}

interface BkashExecuteResult {
  readonly paymentID: string;
  readonly trxID: string;
  readonly transactionStatus: string;
  readonly amount: string;
  readonly currency: string;
  readonly merchantInvoiceNumber: string;
  readonly statusCode?: string;
  readonly statusMessage?: string;
}

@Injectable()
export class BkashGateway implements IPaymentGateway {
  private readonly logger = new Logger(BkashGateway.name);
  private static readonly CURRENCY = 'BDT';
  private static readonly CALLBACK_PATH = '/api/v1/payments/bkash/callback';

  private readonly baseUrl: string;
  private readonly appKey: string;
  private readonly appSecret: string;
  private readonly username: string;
  private readonly password: string;
  private readonly callbackURL: string;
  private tokenCache: TokenCache | null = null;

  constructor(config: ConfigService) {
    this.baseUrl = config.getOrThrow<string>('bkash.baseUrl');
    this.appKey = config.getOrThrow<string>('bkash.appKey');
    this.appSecret = config.getOrThrow<string>('bkash.appSecret');
    this.username = config.getOrThrow<string>('bkash.username');
    this.password = config.getOrThrow<string>('bkash.password');
    this.callbackURL = `${config.getOrThrow<string>('app.apiBaseUrl')}${BkashGateway.CALLBACK_PATH}`;
  }

  private async getToken(): Promise<string> {
    if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
      return this.tokenCache.token;
    }

    const response = await fetch(`${this.baseUrl}/tokenized/checkout/token/grant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        username: this.username,
        password: this.password,
      },
      body: JSON.stringify({ app_key: this.appKey, app_secret: this.appSecret }),
    });

    if (!response.ok) {
      throw new Error(`bKash token grant failed: HTTP ${response.status}`);
    }

    const data = (await response.json()) as { id_token: string; expires_in: number };
    this.tokenCache = {
      token: data.id_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };

    return this.tokenCache.token;
  }

  private async post<TResponse>(
    endpoint: string,
    body: Record<string, unknown>,
  ): Promise<TResponse> {
    const token = await this.getToken();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-APP-Key': this.appKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`bKash API error on ${endpoint}: HTTP ${response.status}`);
    }

    const data = (await response.json()) as TResponse & { statusCode?: string; statusMessage?: string };

    if (data.statusCode && data.statusCode !== '0000') {
      this.logger.error(`bKash business error on ${endpoint}: ${data.statusMessage ?? 'unknown'}`);
      throw new Error(`bKash error: ${data.statusMessage ?? 'unknown'}`);
    }

    return data;
  }

  async createPayment(input: CreatePaymentInput): Promise<PaymentSession> {
    const data = await this.post<BkashPaymentSession>('/tokenized/checkout/create', {
      mode: '0011',
      payerReference: input.payerRef,
      callbackURL: this.callbackURL,
      currency: BkashGateway.CURRENCY,
      amount: input.amount,
      merchantInvoiceNumber: input.invoiceRef,
      intent: 'sale',
    });

    return {
      externalPaymentId: data.paymentID,
      redirectUrl: data.bkashURL,
      currency: BkashGateway.CURRENCY,
    };
  }

  async executePayment(externalPaymentId: string): Promise<PaymentExecuteResult> {
    const data = await this.post<BkashExecuteResult>('/tokenized/checkout/execute', {
      paymentID: externalPaymentId,
    });

    return this.toExecuteResult(data);
  }

  async queryPayment(externalPaymentId: string): Promise<PaymentExecuteResult> {
    const data = await this.post<BkashExecuteResult>('/tokenized/checkout/query', {
      paymentID: externalPaymentId,
    });

    return this.toExecuteResult(data);
  }

  private toExecuteResult(data: BkashExecuteResult): PaymentExecuteResult {
    return {
      externalPaymentId: data.paymentID,
      externalTrxId: data.trxID,
      isCompleted: data.transactionStatus === 'Completed',
      amount: data.amount,
      currency: data.currency,
      invoiceRef: data.merchantInvoiceNumber,
    };
  }
}
