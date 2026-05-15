import { X } from 'lucide-react';
import { NOTIF_TYPE_META } from './notif-type-meta';
import type { NotifItem } from '../../../routes/notifications/notifications.types';

interface NotifRowProps {
  readonly item: NotifItem;
  readonly divider?: boolean;
  readonly onAction: () => void;
  readonly onDismiss: () => void;
}

export function NotifRow({ item: n, divider, onAction, onDismiss }: NotifRowProps) {
  const meta = NOTIF_TYPE_META[n.type];
  const { Icon } = meta;

  return (
    <div
      className={[
        'px-5 py-4 grid grid-cols-[40px_1fr_auto] gap-3.5 items-start relative',
        divider ? 'border-t border-gray-100' : '',
        n.unread ? 'bg-gold/4' : 'bg-white',
      ].join(' ')}
    >
      {n.unread && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-gold" />}

      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${meta.bgClass}`}>
        <Icon size={18} strokeWidth={1.5} className={meta.colorClass} />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`font-sans text-[14px] text-navy ${n.unread ? 'font-semibold' : 'font-medium'}`}>
            {n.title}
          </span>
          <span className="px-1.5 py-0.5 rounded-sm font-sans text-[10px] font-medium bg-navy/8 text-navy">
            {meta.label}
          </span>
        </div>
        <p className="font-sans text-[13px] text-gray-800 leading-[1.55] mb-2">{n.body}</p>
        {n.actions.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {n.actions.map((a, ai) => (
              <button
                key={a}
                onClick={onAction}
                className={[
                  'px-2.5 py-1 rounded font-sans text-[12px] font-medium transition-colors',
                  ai === 0
                    ? 'bg-navy text-white hover:bg-navy-mid'
                    : 'border border-gray-200 text-navy hover:bg-gray-50',
                ].join(' ')}
              >
                {a}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="font-sans text-[11px] text-gray-400 whitespace-nowrap">{n.time}</span>
        <button
          onClick={onDismiss}
          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors opacity-60 hover:opacity-100"
        >
          <X size={13} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
