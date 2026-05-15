import { Video } from 'lucide-react';
import { Avatar, Badge } from '@repo/ui';
import { SectionLabel } from '../../ui/SectionLabel';
import type { MessageThread } from '../../../types/lawyer.types';

interface ClientInfoPanelProps {
  readonly thread: MessageThread;
}

export function ClientInfoPanel({ thread: t }: ClientInfoPanelProps) {
  return (
    <div className="border-l border-gray-100 px-5 py-5 overflow-y-auto bg-cream hidden lg:block">
      <div className="text-center mb-5">
        <div className="flex justify-center mb-2.5">
          <Avatar initials={t.initials} size="xl" />
        </div>
        <div className="font-heading text-[17px] font-semibold text-navy">{t.name}</div>
        <div className="font-sans text-[12px] text-gray-600">Client · since {t.memberSince}</div>
      </div>

      <SectionLabel>Active case</SectionLabel>
      <div className="bg-white rounded-md p-3.5 border border-gray-100 mb-4">
        <div className="font-sans text-[13px] font-semibold text-navy mb-1">{t.caseTitle}</div>
        <div className="font-sans text-[11px] text-gray-400 mb-2">Ref: {t.caseRef}</div>
        <Badge variant="available">{t.caseStatus}</Badge>
      </div>

      <SectionLabel>Next consultation</SectionLabel>
      <div className="bg-white rounded-md p-3.5 border border-gray-100 mb-4">
        <div className="font-sans text-[13px] font-semibold text-navy mb-1">{t.nextConsult}</div>
        <div className="font-sans text-[11px] text-gray-600 inline-flex items-center gap-1">
          <Video size={11} strokeWidth={1.5} /> Video · 60 min
        </div>
      </div>

      <SectionLabel>Shared files</SectionLabel>
      <div className="flex flex-col gap-1.5">
        {t.files.length === 0 ? (
          <p className="font-sans text-[12px] text-gray-400">No shared files yet.</p>
        ) : (
          t.files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-2.5 py-2 bg-white rounded border border-gray-100">
              <span className="font-sans text-[10px] font-bold text-navy/60 uppercase shrink-0">
                {f.name.split('.').pop()}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-sans text-[12px] text-navy font-medium truncate">{f.name}</div>
                <div className="font-sans text-[10px] text-gray-400">{f.size}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
