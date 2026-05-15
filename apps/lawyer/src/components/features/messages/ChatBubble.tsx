import type { Message } from '../../../types/lawyer.types';

interface ChatBubbleProps {
  readonly message: Message;
}

export function ChatBubble({ message: m }: ChatBubbleProps) {
  if (m.system) {
    return (
      <div className="text-center font-sans text-[11px] text-gray-400 py-1">— {m.text} —</div>
    );
  }

  if (m.typing) {
    return (
      <div className="self-start bg-white rounded-[14px_14px_14px_4px] px-3.5 py-2.5 border border-gray-100 shadow-sm inline-flex gap-1.5">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );
  }

  const isMe = m.from === 'me';
  return (
    <div className={`max-w-[72%] flex flex-col ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
      <div
        className={[
          'px-3.5 py-2.5 font-sans text-[14px] leading-relaxed',
          isMe
            ? 'bg-navy text-white rounded-[14px_14px_4px_14px]'
            : 'bg-white text-gray-800 rounded-[14px_14px_14px_4px] border border-gray-100 shadow-sm',
        ].join(' ')}
      >
        {m.text}
      </div>
      <div className="font-sans text-[10px] mt-1 text-gray-400">{m.time}</div>
    </div>
  );
}
