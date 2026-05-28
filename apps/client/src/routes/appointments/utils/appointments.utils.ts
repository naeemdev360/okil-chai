import type { AppointmentResponse } from '@repo/shared';
import { AppointmentStatus, CaseCategory, ConsultationType } from '@repo/shared';

export const PAGE_SIZE = 10;

export const CASE_CATEGORY_LABELS: Record<CaseCategory, string> = {
  [CaseCategory.CRIMINAL]:              'Criminal Law',
  [CaseCategory.FAMILY]:                'Family Law',
  [CaseCategory.LAND_PROPERTY]:         'Land & Property',
  [CaseCategory.COMMERCIAL]:            'Commercial Law',
  [CaseCategory.CIVIL]:                 'Civil Law',
  [CaseCategory.LABOR]:                 'Labor Law',
  [CaseCategory.CONSTITUTIONAL]:        'Constitutional Law',
  [CaseCategory.INTELLECTUAL_PROPERTY]: 'Intellectual Property',
  [CaseCategory.IMMIGRATION]:           'Immigration',
  [CaseCategory.TAX]:                   'Tax Law',
  [CaseCategory.CONSUMER_RIGHTS]:       'Consumer Rights',
  [CaseCategory.OTHER]:                 'Other',
};

export const UPCOMING_STATUSES = new Set<AppointmentStatus>([
  AppointmentStatus.PENDING_PAYMENT,
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.RESCHEDULE_REQUESTED,
  AppointmentStatus.RESCHEDULED,
  AppointmentStatus.IN_PROGRESS,
]);

export const CANCELLABLE_STATUSES = new Set<AppointmentStatus>([
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.PENDING_PAYMENT,
]);

export function typeLabel(type: ConsultationType): string {
  if (type === ConsultationType.VIDEO) return 'Video';
  if (type === ConsultationType.PHONE) return 'Phone';
  return 'In-Person';
}

export function relativeTimeLabel(startAt: Date | string): string {
  const diff = new Date(startAt).getTime() - Date.now();
  if (diff <= 0) return '';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return hours <= 1 ? 'in 1 hour' : `in ${hours} hours`;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 1) return 'tomorrow';
  if (days < 7) return `in ${days} days`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? 'in 1 week' : `in ${weeks} weeks`;
}

export function formatAppointmentDate(startAt: Date | string): string {
  return new Date(startAt).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

export function lawyerInitials(a: AppointmentResponse): string {
  return `${a.lawyer.firstName[0] ?? ''}${a.lawyer.lastName[0] ?? ''}`.toUpperCase();
}

export function statusBadgeLabel(status: AppointmentStatus): string {
  switch (status) {
    case AppointmentStatus.CANCELLED_BY_CLIENT:
    case AppointmentStatus.CANCELLED_BY_LAWYER:
    case AppointmentStatus.CANCELLED_BY_ADMIN: return 'Cancelled';
    case AppointmentStatus.NO_SHOW_CLIENT:
    case AppointmentStatus.NO_SHOW_LAWYER:     return 'No Show';
    case AppointmentStatus.REFUNDED:           return 'Refunded';
    case AppointmentStatus.DISPUTED:           return 'Disputed';
    case AppointmentStatus.PENDING_PAYMENT:    return 'Pending Payment';
    case AppointmentStatus.IN_PROGRESS:        return 'In Progress';
    default:                                   return status;
  }
}
