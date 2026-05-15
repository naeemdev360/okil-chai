import { Lock, Paperclip, Send } from 'lucide-react';

const QUICK_REPLIES = [
  "Got it — I'll review and get back to you.",
  'Could you share more details on the timeline?',
  "Let's schedule a quick call to discuss.",
] as const;

interface MessageComposerProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onSend: () => void;
  readonly threadId: string;
}

export function MessageComposer({ value, onChange, onSend, threadId: _ }: MessageComposerProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-gray-100 px-5 pt-3 pb-4 bg-white">
      {/* Quick replies */}
      <div className="flex gap-1.5 mb-2.5 flex-wrap">
        {QUICK_REPLIES.map((r, i) => (
          <button
            key={i}
            onClick={() => onChange(r)}
            className="px-2.5 py-1 rounded-full bg-cream border border-gray-200 font-sans text-[12px] text-gray-800 hover:border-navy/30 transition-colors"
          >
            {r}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex gap-2 items-end">
        <button className="w-9 h-9 rounded-md bg-cream border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0">
          <Paperclip size={16} strokeWidth={1.5} className="text-gray-600" />
        </button>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a reply… (Enter to send · Shift+Enter for new line)"
          rows={1}
          className="flex-1 px-3.5 py-2.5 rounded-md border-[1.5px] border-gray-200 font-sans text-[14px] bg-white outline-none focus:border-navy transition-colors resize-none leading-relaxed"
        />
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className="inline-flex items-center gap-1.5 px-3.5 h-9 bg-navy text-white rounded-md font-sans text-[14px] font-medium disabled:opacity-40 hover:bg-navy-mid transition-colors shrink-0"
        >
          <Send size={14} strokeWidth={1.5} /> Send
        </button>
      </div>

      <div className="mt-2 inline-flex items-center gap-1 font-sans text-[10px] text-gray-400">
        <Lock size={10} strokeWidth={1.5} /> End-to-end encrypted · Attorney-client privileged
      </div>
    </div>
  );
}
