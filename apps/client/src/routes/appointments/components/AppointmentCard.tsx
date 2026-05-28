import type { AppointmentResponse } from '@repo/shared';
import { AppointmentStatus, CaseCategory, ConsultationType } from '@repo/shared';
import { Avatar, Badge, Button, ConfirmDialog } from '@repo/ui';
import { MapPin, Phone, Video } from 'lucide-react';
import { useState } from 'react';
import {
  CANCELLABLE_STATUSES,
  CASE_CATEGORY_LABELS,
  UPCOMING_STATUSES,
  formatAppointmentDate,
  lawyerInitials,
  relativeTimeLabel,
  statusBadgeLabel,
  typeLabel,
} from '../utils/appointments.utils';

function TypeIcon({ type }: { readonly type: ConsultationType }) {
  if (type === ConsultationType.VIDEO) return <Video  size={11} />;
  if (type === ConsultationType.PHONE) return <Phone  size={11} />;
  return <MapPin size={11} />;
}

interface AppointmentCardProps {
  readonly appointment: AppointmentResponse;
  readonly isUpcomingTab: boolean;
  readonly onCancel: (id: string) => void;
  readonly isCancelling: boolean;
}

export function AppointmentCard({
  appointment,
  isUpcomingTab,
  onCancel,
  isCancelling,
}: AppointmentCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const status          = appointment.status as AppointmentStatus;
  const consultationType = appointment.consultationType as ConsultationType;
  const caseCategory    = appointment.caseCategory as CaseCategory;

  const isActive    = UPCOMING_STATUSES.has(status);
  const isCompleted = status === AppointmentStatus.COMPLETED;
  const canCancel   = CANCELLABLE_STATUSES.has(status);
  const timeLabel   = isActive ? relativeTimeLabel(appointment.startAt) : '';

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
        <Avatar
          initials={lawyerInitials(appointment)}
          src={appointment.lawyer.photoUrl}
          size="xl"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <span className="font-heading text-[17px] font-semibold text-navy">
              {appointment.lawyer.firstName} {appointment.lawyer.lastName}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 px-2 py-0.5 bg-gray-50 rounded font-sans">
              <TypeIcon type={consultationType} />
              {typeLabel(consultationType)}
            </span>
            {timeLabel && <Badge variant="available">{timeLabel}</Badge>}
            {!isActive && !isCompleted && (
              <Badge variant="cancelled">{statusBadgeLabel(status)}</Badge>
            )}
          </div>
          <p className="text-[13px] text-gray-600 font-sans">
            {CASE_CATEGORY_LABELS[caseCategory] ?? caseCategory}
            {' · '}
            {formatAppointmentDate(appointment.startAt)}
          </p>
        </div>

        <div className="w-full text-left sm:text-right sm:w-auto shrink-0">
          <p className="font-heading text-base font-semibold text-navy mb-2">
            ${parseFloat(appointment.feeAmount).toFixed(0)}
          </p>
          {isUpcomingTab && isActive ? (
            <div className="flex flex-wrap gap-1.5 sm:justify-end">
              {canCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="border border-gray-200 text-gray-600"
                  onClick={() => setConfirmOpen(true)}
                  disabled={isCancelling}
                  isLoading={isCancelling}
                  loadingText="Cancelling..."
                >
                  Cancel
                </Button>
              )}
              <Button variant="primary" size="sm">Join</Button>
            </div>
          ) : isCompleted ? (
            <Button variant="gold" size="sm">Leave Review</Button>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="destructive"
        title="Cancel appointment?"
        description={`This will cancel your appointment with ${appointment.lawyer.firstName} ${appointment.lawyer.lastName}. This action cannot be undone.`}
        confirmLabel="Yes, cancel"
        isLoading={isCancelling}
        onConfirm={() => {
          onCancel(appointment.id);
          setConfirmOpen(false);
        }}
      />
    </>
  );
}
