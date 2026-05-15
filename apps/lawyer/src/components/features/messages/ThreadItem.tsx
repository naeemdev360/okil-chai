import { Avatar } from '@repo/ui';
import type { MessageThread } from '../../../types/lawyer.types';

interface ThreadItemProps {
  readonly thread: MessageThread;
  readonly isSelected: boolean;
  readonly onClick: () => void;
}

export function ThreadItem({ thread: t, isSelected, onClick }: ThreadItemProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'block w-full text-left px-4 py-3.5 border-b border-gray-100 border-l-[3px] transition-colors',
        isSelected ? 'bg-gold-pale border-l-gold' : 'bg-white border-l-transparent hover:bg-gray-50',
      ].join(' ')}
    >
      <div className="flex gap-2.5 items-start">
        <Avatar initials={t.initials} size="md" isOnline={t.online} />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center gap-2 mb-0.5">
            <span className={`font-sans text-[14px] truncate flex-1 min-w-0 ${t.unread ? 'font-bold text-navy' : 'font-medium text-navy'}`}>
              {t.name}
            </span>
            <span className="font-sans text-[11px] text-gray-400 shrink-0">{t.lastTime}</span>
          </div>
          <div className={`font-sans text-[12px] truncate ${t.unread ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
            {t.preview}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-navy/8 text-navy font-sans text-[10px] font-medium">
              {t.area}
            </span>
            {t.unread > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gold text-navy font-sans text-[10px] font-bold rounded-full">
                {t.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
