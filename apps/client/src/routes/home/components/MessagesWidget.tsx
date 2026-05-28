import { useConversations } from '@repo/hooks';
import { Avatar } from '@repo/ui';
import { Link } from 'react-router-dom';

function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.floor(diffHours / 24)}d`;
}

export function MessagesWidget() {
  const { data: conversations = [] } = useConversations();
  const unreadTotal = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const preview = conversations.slice(0, 2);

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

      {preview.map((m, i) => {
        const firstName = m.otherUser.firstName;
        const lastName  = m.otherUser.lastName;
        const initials  = `${firstName[0]}${lastName[0]}`.toUpperCase();
        const sentAt    = new Date(m.lastMessage.createdAt);

        return (
          <Link
            key={m.otherUser.id}
            to="/messages"
            className={`flex items-center gap-2.5 px-5 py-3 hover:bg-gray-50 transition-colors${
              i === 0 ? ' border-b border-gray-100' : ''
            }`}
          >
            <Avatar initials={initials} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-navy font-sans">{firstName} {lastName}</p>
              <p className="text-[11px] text-gray-600 font-sans truncate">{m.lastMessage.content}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[10px] text-gray-400 font-sans">{timeAgo(sentAt)}</span>
              {m.unreadCount > 0 && (
                <span className="bg-gold text-navy text-[9px] font-bold font-sans px-1.5 py-0.5 rounded-full leading-none">
                  {m.unreadCount}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
