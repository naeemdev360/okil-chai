import {
  useCase,
  useDeleteCaseDocument,
  usePortalAuth,
  useUploadCaseDocument,
} from '@repo/hooks';
import { CaseAssignmentStatus, CaseStatus } from '@repo/shared';
import {
  Avatar,
  Badge,
  PageLoader,
  Reveal,
  RevealGroup,
  SectionHeader,
  SurfaceCard,
  toast,
} from '@repo/ui';
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Gavel,
  Hash,
  UserCheck,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AssignLawyerPanel } from './components/AssignLawyerPanel';
import { AssignmentHistory } from './components/AssignmentHistory';
import { DocumentList } from './components/DocumentList';
import { HearingList } from './components/HearingList';
import { StageTimeline } from './components/StageTimeline';
import {
  ASSIGNMENT_STATUS_LABELS,
  CASE_CATEGORY_LABELS,
  CASE_STAGE_LABELS,
  CASE_STATUS_LABELS,
  formatDate,
  formatDateTime,
} from './utils/cases.utils';

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = usePortalAuth();
  const { data: caseDetail, isLoading, isError } = useCase(id);
  const upload = useUploadCaseDocument(id ?? '');
  const remove = useDeleteCaseDocument(id ?? '');
  const [showAssignPanel, setShowAssignPanel] = useState(false);

  if (isLoading) return <PageLoader />;
  if (isError || !caseDetail) {
    return <p className="text-sm text-error font-sans">Could not load this case.</p>;
  }

  const lawyer = caseDetail.assignedLawyer;
  const isClient = user?.id === caseDetail.client.id;
  const isClosed = caseDetail.status === CaseStatus.CLOSED;
  const canManageAssignment = isClient && !isClosed;

  return (
    <RevealGroup>
      <Reveal>
        <button
          onClick={() => navigate('/cases')}
          className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-600 hover:text-navy font-sans mb-4 transition-colors duration-base"
        >
          <ArrowLeft
            size={14}
            className="transition-transform duration-base group-hover:-translate-x-0.5"
          />
          Back to cases
        </button>

        {/* Navy hero — premium, brand-anchored header that frames the whole case */}
        <SurfaceCard
          elevation="lg"
          className="relative mb-5 overflow-hidden border-0 bg-gradient-to-br from-navy via-navy to-navy-mid p-6 sm:p-8"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-gold/15 blur-3xl"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-navy-light/40 blur-3xl"
          />

          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-light font-sans">
              <Gavel size={12} />
              {CASE_CATEGORY_LABELS[caseDetail.caseCategory]}
            </span>
            <div className="mt-2.5 flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-[24px] font-semibold leading-tight text-white sm:text-[30px]">
                {caseDetail.title}
              </h1>
              <Badge variant={isClosed ? 'cancelled' : 'available'}>
                {CASE_STATUS_LABELS[caseDetail.status]}
              </Badge>
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-white/65 font-sans">
              {caseDetail.referenceNumber && (
                <span className="inline-flex items-center gap-1">
                  <Hash size={13} className="text-gold-light/70" />
                  {caseDetail.referenceNumber}
                </span>
              )}
              {caseDetail.referenceNumber && <span className="text-white/25">·</span>}
              <span className="inline-flex items-center gap-1">
                <Clock size={13} className="text-gold-light/70" />
                Opened {formatDate(caseDetail.openedAt)}
              </span>
            </p>
          </div>

          {caseDetail.description && (
            <p className="mt-5 max-w-[680px] whitespace-pre-wrap border-t border-white/10 pt-4 text-[13.5px] leading-relaxed text-white/75 font-sans">
              {caseDetail.description}
            </p>
          )}
        </SurfaceCard>

        {/* Key dates / stage at a glance */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryStat
            icon={<Gavel size={16} />}
            label="Current stage"
            value={CASE_STAGE_LABELS[caseDetail.currentStage]}
          />
          <SummaryStat
            icon={<Calendar size={16} />}
            label="Next hearing"
            value={formatDate(caseDetail.nextHearingAt)}
          />
          <SummaryStat
            icon={<Clock size={16} />}
            label="Estimated completion"
            value={formatDate(caseDetail.estimatedCompletionAt)}
          />
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <SurfaceCard className="p-5 sm:p-6 mb-5">
            <SectionHeader
              icon={<Gavel size={16} />}
              title="Stage history"
              subtitle="Every step this case has moved through"
            />
            <StageTimeline history={caseDetail.stageHistory} />
          </SurfaceCard>

          <SurfaceCard className="p-5 sm:p-6 mb-5">
            <SectionHeader
              icon={<Calendar size={16} />}
              title="Hearings"
              subtitle="Scheduled and past court dates"
            />
            <HearingList hearings={caseDetail.hearings} />
          </SurfaceCard>

          <SurfaceCard className="p-5 sm:p-6">
            <SectionHeader
              icon={<FileText size={16} />}
              title="Documents"
              subtitle="Filings, contracts and case files"
            />
            <DocumentList
              documents={caseDetail.documents}
              currentUserId={user?.id ?? null}
              canUpload={!isClosed}
              onUpload={(file) =>
                upload.mutate(file, {
                  onSuccess: () => toast.success('Document uploaded'),
                  onError: () => toast.error('Upload failed'),
                })
              }
              onDelete={(docId) =>
                remove.mutate(docId, {
                  onSuccess: () => toast.success('Document removed'),
                  onError: () => toast.error('Could not remove document'),
                })
              }
              isUploading={upload.isPending}
              isDeleting={remove.isPending}
            />
          </SurfaceCard>
        </Reveal>

        <Reveal>
          <SurfaceCard className="p-5 sm:p-6 mb-5">
            <SectionHeader icon={<UserCheck size={16} />} title="Assigned lawyer" />
            {lawyer ? (
              <div className="flex items-center gap-3.5 mb-3">
                <Avatar
                  initials={`${lawyer.firstName[0]}${lawyer.lastName[0]}`}
                  src={lawyer.photoUrl}
                  size="xl"
                />
                <div className="min-w-0">
                  <p className="font-heading text-[16px] font-semibold text-navy truncate">
                    {lawyer.firstName} {lawyer.lastName}
                  </p>
                  <p className="text-[12px] text-gray-500 font-sans">
                    {ASSIGNMENT_STATUS_LABELS[caseDetail.assignmentStatus]}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-gray-600 font-sans mb-3">
                {ASSIGNMENT_STATUS_LABELS[caseDetail.assignmentStatus]}
              </p>
            )}

            {canManageAssignment && (
              <>
                <button
                  className="text-[13px] font-semibold text-navy hover:underline font-sans"
                  onClick={() => setShowAssignPanel((v) => !v)}
                >
                  {showAssignPanel
                    ? 'Hide search'
                    : caseDetail.assignmentStatus === CaseAssignmentStatus.ACCEPTED
                      ? 'Reassign to a different lawyer'
                      : 'Invite a lawyer'}
                </button>
                {showAssignPanel && (
                  <div className="mt-3">
                    <AssignLawyerPanel
                      caseId={caseDetail.id}
                      currentLawyerId={caseDetail.assignedLawyer?.id ?? null}
                      onAssigned={() => setShowAssignPanel(false)}
                    />
                  </div>
                )}
              </>
            )}
          </SurfaceCard>

          <SurfaceCard className="p-5 sm:p-6 mb-5">
            <SectionHeader icon={<Calendar size={16} />} title="Linked bookings" />
            {caseDetail.linkedAppointments.length === 0 ? (
              <p className="text-[13px] text-gray-500 font-sans">No bookings linked yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {caseDetail.linkedAppointments.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2"
                  >
                    <span className="inline-flex items-center gap-2 text-[13px] text-gray-700 font-sans">
                      <Calendar size={14} className="text-gray-400" />
                      {formatDateTime(a.startAt)}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 font-sans">
                      {a.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </SurfaceCard>

          <SurfaceCard className="p-5 sm:p-6">
            <SectionHeader icon={<Users size={16} />} title="Assignment history" />
            <AssignmentHistory history={caseDetail.assignmentHistory} />
          </SurfaceCard>
        </Reveal>
      </div>
    </RevealGroup>
  );
}

function SummaryStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-medium hover:shadow-md">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold-pale text-gold">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 font-sans">
          {label}
        </p>
        <p className="mt-0.5 truncate font-heading text-[15px] font-semibold text-navy">{value}</p>
      </div>
    </div>
  );
}
