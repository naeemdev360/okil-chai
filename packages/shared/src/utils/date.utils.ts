import { format, parseISO } from 'date-fns';

const DATE_FORMAT = 'MMM d, yyyy';
const DATETIME_FORMAT = 'MMM d, yyyy, h:mm a';

function toDate(value: Date | string): Date {
  return typeof value === 'string' ? parseISO(value) : value;
}

export function formatDate(value: Date | string): string {
  return format(toDate(value), DATE_FORMAT);
}

export function formatDateTime(value: Date | string): string {
  return format(toDate(value), DATETIME_FORMAT);
}
