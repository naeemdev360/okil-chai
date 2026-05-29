import { useAssignLawyer } from '@repo/hooks';
import { useLawyerSearch } from '@repo/hooks';
import { Avatar, Button, Input, toast } from '@repo/ui';
import { useState } from 'react';

interface AssignLawyerPanelProps {
  readonly caseId: string;
  readonly currentLawyerId: string | null;
  readonly onAssigned?: () => void;
}

export function AssignLawyerPanel({ caseId, currentLawyerId, onAssigned }: AssignLawyerPanelProps) {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useLawyerSearch({ q: query.trim() || undefined, page: 1, limit: 5 });
  const { mutate: assign, isPending } = useAssignLawyer(caseId);

  function handleAssign(lawyerId: string) {
    assign(
      { lawyerId },
      {
        onSuccess: () => {
          toast.success('Invitation sent to the lawyer');
          onAssigned?.();
        },
        onError: () => toast.error('Could not invite this lawyer. Please try again.'),
      },
    );
  }

  return (
    <div>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search lawyers by name, specialization, city…"
        className="mb-3"
      />

      {isLoading ? (
        <p className="text-[13px] text-gray-500 font-sans">Searching…</p>
      ) : (data?.lawyers ?? []).length === 0 ? (
        <p className="text-[13px] text-gray-500 font-sans">No lawyers match your search.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {data!.lawyers.map((lawyer) => {
            const isCurrent = currentLawyerId === lawyer.id;
            return (
              <li
                key={lawyer.id}
                className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"
              >
                <Avatar
                  initials={`${lawyer.firstName[0] ?? ''}${lawyer.lastName[0] ?? ''}`}
                  src={lawyer.photoUrl}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-[14px] font-semibold text-navy truncate">
                    {lawyer.firstName} {lawyer.lastName}
                  </p>
                  <p className="text-[12px] text-gray-500 font-sans truncate">
                    {lawyer.city ?? '—'} · {lawyer.specializations.map((s) => s.name).join(', ') || 'No specializations'}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={isCurrent ? 'ghost' : 'primary'}
                  disabled={isCurrent || isPending}
                  onClick={() => handleAssign(lawyer.id)}
                >
                  {isCurrent ? 'Current' : 'Invite'}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
