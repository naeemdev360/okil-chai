import { useState } from 'react';
import type { Booking } from '../../../types/lawyer.types';

interface VideoStageProps {
  readonly session: Booking;
}

type CallIconName = 'mic' | 'mic-off' | 'video' | 'video-off' | 'screen-share' | 'chat' | 'dots';

function CallIcon({ name, color }: { name: CallIconName; color: string }) {
  const props = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'mic':         return <svg {...props}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><line x1="12" y1="18" x2="12" y2="22"/></svg>;
    case 'mic-off':     return <svg {...props}><line x1="2" y1="2" x2="22" y2="22"/><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 11.9 4.95"/><line x1="12" y1="18" x2="12" y2="22"/></svg>;
    case 'video':       return <svg {...props}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>;
    case 'video-off':   return <svg {...props}><line x1="2" y1="2" x2="22" y2="22"/><path d="M23 7l-7 5 7 5V7z"/><path d="M16 17H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/></svg>;
    case 'screen-share':return <svg {...props}><rect x="2" y="4" width="20" height="13" rx="2"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="12" y1="17" x2="12" y2="20"/><polyline points="9 11 12 8 15 11"/><line x1="12" y1="8" x2="12" y2="14"/></svg>;
    case 'chat':        return <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case 'dots':        return <svg {...props}><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></svg>;
  }
}

function CallBtn({
  icon, title, onClick, danger, gold, active,
}: {
  icon: CallIconName; title: string;
  onClick: () => void;
  danger?: boolean; gold?: boolean; active?: boolean;
}) {
  const bg = danger ? 'rgba(224,57,43,0.9)' : gold ? '#C8A84B' : 'rgba(255,255,255,0.10)';
  const iconColor = danger || !active ? 'white' : gold ? '#0F1F3D' : 'white';
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-11 h-11 rounded-full flex items-center justify-center border border-white/10 transition-opacity hover:opacity-90"
      style={{ background: bg }}
    >
      <CallIcon name={icon} color={iconColor} />
    </button>
  );
}

export function VideoStage({ session }: VideoStageProps) {
  const [muted, setMuted]       = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [sharing, setSharing]   = useState(false);

  return (
    <div className="relative bg-[#0A0F1A] rounded-xl overflow-hidden border border-gray-100" style={{ aspectRatio: '16 / 9' }}>
      {/* Main feed — client */}
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ background: 'radial-gradient(circle at 30% 35%, #2B3A5C 0%, #141C2E 60%, #0A0F1A 100%)' }}>
        <div aria-hidden className="absolute inset-0 opacity-50"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '3px 3px' }} />
        <div className="relative text-center">
          <div className="w-[120px] h-[120px] rounded-full mx-auto flex items-center justify-center font-heading text-[44px] font-bold text-white"
            style={{ background: 'linear-gradient(140deg, #4A5B7E, #2A3553)', boxShadow: '0 0 0 6px rgba(255,255,255,0.04), 0 0 80px rgba(200,168,75,0.25)' }}>
            {session.initials}
          </div>
          <div className="mt-3.5 font-sans text-[14px] text-white/85 font-medium">{session.client}</div>
          <div className="mt-1 font-sans text-[11px] text-white/45">Camera enabled · HD</div>
        </div>
      </div>

      {/* Status labels */}
      <div className="absolute top-3.5 left-3.5 flex gap-2">
        <span className="inline-flex items-center gap-1.5 bg-black/55 text-white px-2.5 py-1.5 rounded font-sans text-[11px] font-semibold tracking-[0.06em] uppercase backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5252]" />
          Recording
        </span>
        <span className="bg-black/55 text-white/85 px-2.5 py-1.5 rounded font-sans text-[11px] backdrop-blur-md">
          End-to-end encrypted
        </span>
      </div>

      {/* Self PiP */}
      <div className="absolute bottom-[76px] right-3.5 w-40 h-[100px] rounded-lg border-2 border-white/18 overflow-hidden flex items-center justify-center"
        style={{ background: 'linear-gradient(140deg, #3D2F1F, #1F1A14)' }}>
        {cameraOff ? (
          <div className="text-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.6"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
            <div className="font-sans text-[10px] text-white/50 mt-1">Camera off</div>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-heading text-[20px] font-bold text-white"
              style={{ background: 'linear-gradient(140deg, #7A6541, #4A3D26)' }}>
              JM
            </div>
            <span className="absolute bottom-1.5 left-2 font-sans text-[10px] text-white font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
              You
            </span>
          </>
        )}
      </div>

      {/* Controls bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-1.5 py-1.5 rounded-full border border-white/10 backdrop-blur-xl"
        style={{ background: 'rgba(10,15,25,0.78)' }}>
        <CallBtn icon={muted ? 'mic-off' : 'mic'}         title={muted ? 'Unmute' : 'Mute'}             danger={muted}    active={!muted}    onClick={() => setMuted(v => !v)} />
        <CallBtn icon={cameraOff ? 'video-off' : 'video'} title={cameraOff ? 'Start video' : 'Stop video'} danger={cameraOff} active={!cameraOff} onClick={() => setCameraOff(v => !v)} />
        <CallBtn icon="screen-share"                       title="Share screen"                          gold={sharing}    active={sharing}   onClick={() => setSharing(v => !v)} />
        <CallBtn icon="chat"                               title="Chat"                                   active            onClick={() => {}} />
        <CallBtn icon="dots"                               title="More"                                   active            onClick={() => {}} />
        {/* End call */}
        <button
          title="End call"
          className="w-11 h-11 rounded-full flex items-center justify-center ml-1.5"
          style={{ background: '#E0392B' }}
          onClick={() => window.alert('End session?')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 11a16 16 0 0 1 18 0v3l-4 1-1-4a8 8 0 0 0-8 0l-1 4-4-1z" transform="rotate(135 12 12)" />
          </svg>
        </button>
      </div>
    </div>
  );
}
