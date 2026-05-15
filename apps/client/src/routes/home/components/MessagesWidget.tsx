import { Avatar } from '@repo/ui';
import { Link } from 'react-router-dom';
import { CONVERSATIONS } from '../../../lib/mock-data';

export function MessagesWidget() {
  const unreadTotal = CONVERSATIONS.reduce((acc, c) => acc + c.unread, 0);
  const preview = CONVERSATIONS.slice(0, 2);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-heading text-[15px] font-semibold text-navy">Messages</span>
          {unreadTotal > 0 && (
            <span className="bg-gold text-navy text-[10px] font-bold font-sans px-1.5 py-0.5 rounded-full leading-none">
              {unreadTotal}
            </span>
          )}
        </div>
        <Link
          to="/messages"
          className="text-xs font-semibold text-gold font-sans hover:opacity-75 transition-opacity"
        >
          Open
        </Link>
      </div>

      {preview.map((m, i) => (
        <Link
          key={m.id}
          to="/messages"
          className={`flex items-center gap-2.5 px-5 py-3 hover:bg-gray-50 transition-colors${
            i === 0 ? ' border-b border-gray-100' : ''
          }`}
        >
          <Avatar initials={m.initials} size="md" isOnline={m.online} />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-navy font-sans">{m.name}</p>
            <p className="text-[11px] text-gray-600 font-sans truncate">{m.last}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[10px] text-gray-400 font-sans">{m.time}</span>
            {m.unread > 0 && (
              <span className="bg-gold text-navy text-[9px] font-bold font-sans px-1.5 py-0.5 rounded-full leading-none">
                {m.unread}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
