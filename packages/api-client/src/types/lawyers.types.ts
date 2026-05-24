import type { ConsultationType } from '@repo/shared';

export interface LawyerSearchParams {
  /** Free-text search across lawyer name, city, and specialization name. */
  readonly q?: string;
  readonly specialization?: string;
  readonly city?: string;
  readonly lang?: string;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly rating?: number;
  readonly consultationType?: ConsultationType;
  readonly isInstantBooking?: boolean;
  readonly page?: number;
  readonly limit?: number;
}

export interface LawyerSummary {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly specializations: readonly string[];
  readonly rating: number;
  readonly reviewCount: number;
  readonly hourlyRate: number;
  readonly location: string;
  readonly avatarUrl: string | null;
  readonly isVerified: boolean;
}

export interface LawyerProfile extends LawyerSummary {
  readonly bio: string;
  readonly barNumber: string;
  readonly yearsOfExperience: number;
  readonly consultationTypes: readonly ConsultationType[];
  readonly languages: readonly string[];
}

export interface LawyerAvailabilityParams {
  readonly dateFrom: string;
  readonly dateTo: string;
}

export interface TimeSlot {
  readonly startTime: string;
  readonly endTime: string;
  readonly isAvailable: boolean;
}

export interface LawyerAvailability {
  readonly lawyerId: string;
  readonly slots: readonly TimeSlot[];
}

export interface LawyerDashboard {
  readonly totalEarnings: number;
  readonly upcomingAppointmentsCount: number;
  readonly totalReviews: number;
  readonly averageRating: number;
}

export interface AvailabilityRuleInput {
  readonly dayOfWeek: number;
  readonly startTime: string;
  readonly endTime: string;
}
