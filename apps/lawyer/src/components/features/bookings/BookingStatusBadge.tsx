import { Badge } from '@repo/ui';
import type { BookingStatus } from '../../../types/lawyer.types';

interface BookingStatusBadgeProps {
  readonly status: BookingStatus;
}

const STATUS_MAP: Record<BookingStatus, { variant: 'pending' | 'available' | 'outline' | 'cancelled'; label: string }> = {
  pending:   { variant: 'pending',   label: 'Pending' },
  confirmed: { variant: 'available', label: 'Confirmed' },
  completed: { variant: 'outline',   label: 'Completed' },
  declined:  { variant: 'cancelled', label: 'Declined' },
};

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const { variant, label } = STATUS_MAP[status];
  return <Badge variant={variant}>{label}</Badge>;
}
