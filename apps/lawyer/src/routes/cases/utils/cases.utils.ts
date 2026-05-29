import { CaseAssignmentStatus, CaseCategory, CaseStage, CaseStatus } from '@repo/shared';

export const PAGE_SIZE = 10;

export const CASE_CATEGORY_LABELS: Record<CaseCategory, string> = {
  [CaseCategory.CRIMINAL]: 'Criminal',
  [CaseCategory.FAMILY]: 'Family',
  [CaseCategory.LAND_PROPERTY]: 'Land & Property',
  [CaseCategory.COMMERCIAL]: 'Commercial',
  [CaseCategory.CIVIL]: 'Civil',
  [CaseCategory.LABOR]: 'Labor',
  [CaseCategory.CONSTITUTIONAL]: 'Constitutional',
  [CaseCategory.INTELLECTUAL_PROPERTY]: 'Intellectual Property',
  [CaseCategory.IMMIGRATION]: 'Immigration',
  [CaseCategory.TAX]: 'Tax',
  [CaseCategory.CONSUMER_RIGHTS]: 'Consumer Rights',
  [CaseCategory.OTHER]: 'Other',
};

export const CASE_STAGE_LABELS: Record<CaseStage, string> = {
  [CaseStage.INTAKE]: 'Intake',
  [CaseStage.LAWYER_ASSIGNED]: 'Lawyer assigned',
  [CaseStage.DISCOVERY]: 'Discovery',
  [CaseStage.PRE_FILING]: 'Pre-filing',
  [CaseStage.FILED]: 'Filed',
  [CaseStage.HEARING_SCHEDULED]: 'Hearing scheduled',
  [CaseStage.IN_TRIAL]: 'In trial',
  [CaseStage.JUDGMENT]: 'Judgment',
  [CaseStage.APPEAL]: 'Appeal',
  [CaseStage.SETTLEMENT]: 'Settlement',
  [CaseStage.ON_HOLD]: 'On hold',
  [CaseStage.CLOSED]: 'Closed',
};

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  [CaseStatus.ACTIVE]: 'Active',
  [CaseStatus.ON_HOLD]: 'On hold',
  [CaseStatus.CLOSED]: 'Closed',
};

export const ASSIGNMENT_STATUS_LABELS: Record<CaseAssignmentStatus, string> = {
  [CaseAssignmentStatus.UNASSIGNED]: 'No lawyer assigned',
  [CaseAssignmentStatus.PENDING]: 'Awaiting lawyer response',
  [CaseAssignmentStatus.ACCEPTED]: 'Lawyer assigned',
  [CaseAssignmentStatus.DECLINED]: 'Lawyer declined',
  [CaseAssignmentStatus.RELEASED]: 'Lawyer released the case',
};

export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// Bridge between the API's `yyyy-MM-dd` filter strings and a local Date for the
// date-range picker. Parsing is done in local time so the displayed day matches.
export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateInputValue(value: string): Date | undefined {
  if (!value) return undefined;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

// Lawyer-driven workflow: next legal step in the timeline (excluding terminal stages).
export const NEXT_STAGES: Record<CaseStage, readonly CaseStage[]> = {
  [CaseStage.INTAKE]: [CaseStage.LAWYER_ASSIGNED, CaseStage.ON_HOLD],
  [CaseStage.LAWYER_ASSIGNED]: [CaseStage.DISCOVERY, CaseStage.PRE_FILING, CaseStage.ON_HOLD],
  [CaseStage.DISCOVERY]: [CaseStage.PRE_FILING, CaseStage.FILED, CaseStage.ON_HOLD],
  [CaseStage.PRE_FILING]: [CaseStage.FILED, CaseStage.SETTLEMENT, CaseStage.ON_HOLD],
  [CaseStage.FILED]: [CaseStage.HEARING_SCHEDULED, CaseStage.SETTLEMENT, CaseStage.ON_HOLD],
  [CaseStage.HEARING_SCHEDULED]: [CaseStage.IN_TRIAL, CaseStage.SETTLEMENT, CaseStage.ON_HOLD],
  [CaseStage.IN_TRIAL]: [CaseStage.JUDGMENT, CaseStage.SETTLEMENT, CaseStage.ON_HOLD],
  [CaseStage.JUDGMENT]: [CaseStage.APPEAL, CaseStage.ON_HOLD],
  [CaseStage.APPEAL]: [CaseStage.JUDGMENT, CaseStage.SETTLEMENT, CaseStage.ON_HOLD],
  [CaseStage.SETTLEMENT]: [CaseStage.ON_HOLD],
  [CaseStage.ON_HOLD]: [
    CaseStage.DISCOVERY,
    CaseStage.PRE_FILING,
    CaseStage.FILED,
    CaseStage.HEARING_SCHEDULED,
    CaseStage.IN_TRIAL,
    CaseStage.JUDGMENT,
  ],
  [CaseStage.CLOSED]: [],
};

export function caseInitials(title: string): string {
  return title
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
