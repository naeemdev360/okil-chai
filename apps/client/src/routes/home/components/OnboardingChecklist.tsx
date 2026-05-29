import { Calendar, Check, Search, ShieldCheck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { appUrls } from '../../../lib/app-urls';

const ONBOARDING_TOTAL_STEPS = 4;
const ONBOARDING_COMPLETED_STEPS = 1;

function goToSearch(): void {
  window.location.href = appUrls.search;
}

interface OnboardingStep {
  readonly done: boolean;
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly body: string;
  readonly cta?: string;
  readonly onClick?: () => void;
}

function OnboardingStepCard({ step }: { readonly step: OnboardingStep }) {
  return (
    <div
      className={`flex items-center gap-3.5 rounded-md p-4 ${
        step.done ? 'border border-success/20 bg-success-bg' : 'border border-gray-100 bg-cream'
      }`}
    >
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
          step.done ? 'bg-success text-white' : 'border-[1.5px] border-gray-200 bg-white text-gray-600'
        }`}
      >
        {step.done ? <Check size={18} strokeWidth={2.5} /> : step.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`font-sans text-sm font-semibold text-navy ${
            step.done ? 'line-through opacity-60' : ''
          }`}
        >
          {step.title}
        </p>
        <p className="mt-0.5 font-sans text-xs text-gray-600">{step.body}</p>
      </div>
      {!step.done && step.cta && (
        <button
          onClick={step.onClick}
          className="shrink-0 cursor-pointer rounded-md bg-navy px-3.5 py-[7px] font-sans text-xs font-semibold text-white transition-colors hover:bg-navy-light"
        >
          {step.cta}
        </button>
      )}
    </div>
  );
}

/** Progress checklist guiding new clients to their first consultation. */
export function OnboardingChecklist({ firstName }: { readonly firstName: string }) {
  const navigate = useNavigate();
  const progressPercent = (ONBOARDING_COMPLETED_STEPS / ONBOARDING_TOTAL_STEPS) * 100;

  const steps: readonly OnboardingStep[] = [
    { done: true,  icon: <User size={16} />,        title: 'Create your account',    body: `Welcome, ${firstName}!` },
    { done: false, icon: <ShieldCheck size={16} />, title: 'Verify your identity',   body: 'Unlocks in-person bookings',    cta: 'Verify now', onClick: () => navigate('/settings') },
    { done: false, icon: <Search size={16} />,      title: 'Find your first lawyer', body: 'Browse by practice area',       cta: 'Browse',     onClick: goToSearch },
    { done: false, icon: <Calendar size={16} />,    title: 'Book a consultation',    body: 'Pick a time that works for you', cta: 'Book',       onClick: goToSearch },
  ];

  return (
    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="mb-1 font-heading text-[22px] font-semibold text-navy">Get started</h2>
          <p className="font-sans text-sm text-gray-600">
            {ONBOARDING_TOTAL_STEPS} quick steps to your first consultation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-gold" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="font-heading text-sm font-semibold text-navy">
            {ONBOARDING_COMPLETED_STEPS} / {ONBOARDING_TOTAL_STEPS}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {steps.map((step) => (
          <OnboardingStepCard key={step.title} step={step} />
        ))}
      </div>
    </div>
  );
}
