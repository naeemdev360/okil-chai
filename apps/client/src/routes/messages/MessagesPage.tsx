import {
  Avatar,
  Button,
  Input,
  SelectableStackedList,
  SelectableStackedListItem,
  cn,
} from '@okil-chai/ui';
import { ChevronLeft, Video } from 'lucide-react';
import { useState } from 'react';
import { CHAT_MESSAGES, CONVERSATIONS } from '../../lib/mock-data';

export function MessagesPage() {
  const [activeChatIdx, setActiveChatIdx] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [mobileShowThread, setMobileShowThread] = useState(false);

  const activeConv = CONVERSATIONS[activeChatIdx];
  if (!activeConv) return null;

  function selectConversation(index: number) {
    setActiveChatIdx(index);
    setMobileShowThread(true);
  }

  return (
    <div>
      <h1 className="font-heading text-[22px] font-semibold text-navy sm:text-[26px] mb-4 sm:mb-6">
        Messages
      </h1>

      <div
        className={cn(
          'bg-white rounded-xl border border-gray-100 overflow-hidden',
          'flex flex-col md:grid md:grid-cols-[minmax(0,300px)_1fr]',
          'h-[min(560px,calc(100dvh-9rem))] md:h-[560px]',
        )}
      >
        {/* Conversation list */}
        <SelectableStackedList
          className={cn(
            'border-gray-100 md:border-r min-h-0 overflow-y-auto',
            'max-h-[min(380px,48dvh)] md:max-h-none',
            mobileShowThread ? 'hidden md:block' : 'block',
          )}
        >
          {CONVERSATIONS.map((c, i) => (
            <SelectableStackedListItem
              key={c.id}
              isSelected={i === activeChatIdx}
              onClick={() => selectConversation(i)}
              leading={<Avatar initials={c.initials} size="lg" isOnline={c.online} />}
              headline={c.name}
              meta={c.time}
              subtitle={c.last}
              trailing={
                c.unread > 0 ? (
                  <span className="min-w-[18px] shrink-0 rounded-full bg-gold px-1.5 py-0.5 text-center text-[11px] font-bold text-navy font-sans">
                    {c.unread}
                  </span>
                ) : undefined
              }
            />
          ))}
        </SelectableStackedList>

        {/* Chat area */}
        <div
          className={cn(
            'flex min-h-0 flex-col md:h-full',
            mobileShowThread ? 'flex-1' : 'hidden md:flex',
          )}
        >
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 border-b border-gray-100 shrink-0">
            <button
              type="button"
              onClick={() => setMobileShowThread(false)}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-navy hover:bg-gray-50 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Back to conversations"
            >
              <ChevronLeft size={22} strokeWidth={1.75} aria-hidden />
            </button>
            <Avatar initials={activeConv.initials} size="md" isOnline={activeConv.online} />
            <div className="flex-1 min-w-[140px]">
              <p className="text-sm font-semibold text-navy font-sans">{activeConv.name}</p>
              <p className={`text-[11px] font-sans ${activeConv.online ? 'text-success' : 'text-gray-400'}`}>
                {activeConv.online ? '● Online now' : 'Offline'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="border border-gray-200 sm:ml-auto max-sm:w-full max-sm:justify-center"
            >
              <Video size={14} /> <span className="max-sm:sr-only">Video Call</span>
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-cream px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-2.5">
            <div className="text-center text-[11px] text-gray-400 py-2 font-sans">Today</div>
            {CHAT_MESSAGES.map((m) => {
              const isMe = m.from === 'me';
              return (
                <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] px-3.5 py-2.5 font-sans text-[13px] leading-relaxed ${
                      isMe
                        ? 'bg-navy text-white rounded-[14px_14px_2px_14px]'
                        : 'bg-white text-gray-800 shadow-sm rounded-[14px_14px_14px_2px]'
                    }`}
                  >
                    {m.text}
                    <div className={`text-[10px] mt-1 ${isMe ? 'text-white/50' : 'text-gray-400'}`}>
                      {m.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="flex gap-2.5 px-4 py-3.5 border-t border-gray-100 shrink-0">
            <Input
              type="text"
              placeholder="Type a message…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 min-w-0"
            />
            <Button variant="primary">Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
