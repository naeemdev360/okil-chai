import { useEffect, useRef, useState } from 'react';
import { Phone, Search, Video } from 'lucide-react';
import { Reveal, RevealGroup } from '@repo/ui';
import { Avatar } from '@repo/ui';
import { ThreadItem } from '../../components/features/messages/ThreadItem';
import { ChatBubble } from '../../components/features/messages/ChatBubble';
import { MessageComposer } from '../../components/features/messages/MessageComposer';
import { ClientInfoPanel } from '../../components/features/messages/ClientInfoPanel';
import type { Message, MockData } from '../../types/lawyer.types';

const THREAD_FILTERS = ['All', 'Unread', 'Active cases', 'Archived'] as const;

interface MessagesPageProps {
  readonly data: MockData;
}

export function MessagesPage({ data }: MessagesPageProps) {
  const [selectedId, setSelectedId] = useState(data.threads[0]?.id ?? '');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [threadMessages, setThreadMessages] = useState<Record<string, Message[]>>(() =>
    Object.fromEntries(data.threads.map(t => [t.id, [...t.messages]]))
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const selected = data.threads.find(t => t.id === selectedId) ?? data.threads[0];
  const messages  = threadMessages[selectedId] ?? [];
  const draft     = drafts[selectedId] ?? '';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedId, messages.length]);

  const handleSend = () => {
    if (!draft.trim()) return;
    const newMsg: Message = { from: 'me', text: draft.trim(), time: 'Now' };
    setThreadMessages(prev => ({ ...prev, [selectedId]: [...(prev[selectedId] ?? []), newMsg] }));
    setDrafts(prev => ({ ...prev, [selectedId]: '' }));

    setTimeout(() => {
      setThreadMessages(prev => ({ ...prev, [selectedId]: [...(prev[selectedId] ?? []), { from: 'them', typing: true }] }));
      setTimeout(() => {
        setThreadMessages(prev => {
          const list = (prev[selectedId] ?? []).filter(m => !m.typing);
          return { ...prev, [selectedId]: [...list, { from: 'them', text: 'Thanks for the quick reply — that works.', time: 'Just now' }] };
        });
      }, 1600);
    }, 700);
  };

  return (
    <RevealGroup>
      <Reveal>
        <div
          className="bg-white rounded-xl border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-[320px_1fr_280px]"
          style={{ height: 'calc(100vh - 140px)', minHeight: 540 }}
        >
      {/* Thread list */}
      <div className="border-r border-gray-100 flex flex-col min-w-0">
        <div className="px-4 py-3 border-b border-gray-100 space-y-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={1.5} />
            <input
              placeholder="Search messages"
              className="w-full pl-8 pr-3 py-2 rounded-md border border-gray-200 font-sans text-[13px] bg-cream outline-none focus:border-navy transition-colors"
            />
          </div>
          <div className="flex gap-1">
            {THREAD_FILTERS.map((f, i) => (
              <button
                key={f}
                className={`flex-1 py-1 text-[11px] rounded-full font-sans font-medium border transition-colors ${i === 0 ? 'bg-navy text-white border-navy' : 'text-gray-600 border-gray-200 hover:border-navy/30'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {data.threads.map(t => (
            <ThreadItem
              key={t.id}
              thread={t}
              isSelected={t.id === selectedId}
              onClick={() => setSelectedId(t.id)}
            />
          ))}
        </div>
      </div>

      {/* Conversation pane */}
      {selected && (
        <div className="flex flex-col min-w-0">
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
            <Avatar initials={selected.initials} size="md" isOnline={selected.online} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[15px] font-semibold text-navy">{selected.name}</span>
                {selected.online && (
                  <span className="text-[11px] text-success font-medium font-sans">● Online</span>
                )}
              </div>
              <div className="font-sans text-[12px] text-gray-600">{selected.area} · {selected.caseRef}</div>
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md font-sans text-[13px] text-navy font-medium hover:bg-gray-50 transition-colors">
              <Video size={13} strokeWidth={1.5} /> Video
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md font-sans text-[13px] text-navy font-medium hover:bg-gray-50 transition-colors">
              <Phone size={13} strokeWidth={1.5} /> Call
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 bg-cream flex flex-col gap-3">
            {messages.map((m, i) => <ChatBubble key={i} message={m} />)}
          </div>

          {/* Composer */}
          <MessageComposer
            value={draft}
            onChange={value => setDrafts(prev => ({ ...prev, [selectedId]: value }))}
            onSend={handleSend}
            threadId={selectedId}
          />
        </div>
      )}

      {/* Client info */}
      {selected && <ClientInfoPanel thread={selected} />}
        </div>
      </Reveal>
    </RevealGroup>
  );
}
