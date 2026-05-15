import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reveal, RevealGroup } from '@repo/ui';
import { ConsultSessionBar } from '../../components/features/consult/ConsultSessionBar';
import { VideoStage } from '../../components/features/consult/VideoStage';
import { SessionNotesPad } from '../../components/features/consult/SessionNotesPad';
import { ConsultContextPanel } from '../../components/features/consult/ConsultContextPanel';
import { QuickActionsCard } from '../../components/features/consult/QuickActionsCard';
import { INITIAL_NOTES } from './consult.constants';
import type { MockData } from '../../types/lawyer.types';

interface ConsultPageProps {
  readonly data: MockData;
}

export function ConsultPage({ data }: ConsultPageProps) {
  const navigate = useNavigate();
  const session = data.bookings.find(b => b.status === 'confirmed') ?? data.bookings[0]!;

  const [elapsed, setElapsed] = useState(847);
  const [running, setRunning] = useState(true);
  const [notes, setNotes]     = useState(INITIAL_NOTES);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const handleEndSession = () => {
    setRunning(false);
    window.alert('Session ended. Invoice draft created.');
  };

  return (
    <RevealGroup className="flex flex-col gap-4">
      <Reveal>
        <ConsultSessionBar
          session={session}
          elapsed={elapsed}
          running={running}
          onToggleTimer={() => setRunning(v => !v)}
          onBack={() => navigate('/bookings')}
          onEndSession={handleEndSession}
        />
      </Reveal>

      <Reveal>
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] gap-4 items-start">
        {/* Left — video + notes */}
        <div className="flex flex-col gap-4">
          <VideoStage session={session} />
          <SessionNotesPad value={notes} onChange={setNotes} />
        </div>

        {/* Right — context + quick actions */}
        <div className="flex flex-col gap-4">
          <ConsultContextPanel />
          <QuickActionsCard />
        </div>
      </div>
      </Reveal>
    </RevealGroup>
  );
}
