import { useState } from 'react';
import { Clock, X, Mail } from 'lucide-react';

const STORAGE_KEY = 'okilchai_lawyer_pending';
const SESSION_DISMISSED_KEY = 'okilchai_lawyer_pending_dismissed';

export function PendingVerificationBanner() {
  const isPending = localStorage.getItem(STORAGE_KEY) === 'true';
  const [dismissed, setDismissed] = useState(
    sessionStorage.getItem(SESSION_DISMISSED_KEY) === 'true',
  );

  if (!isPending || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_DISMISSED_KEY, 'true');
    setDismissed(true);
  };

  return (
    <div className="w-full bg-warning-bg border-b border-warning/30">
      <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-start gap-3">
        <div className="shrink-0 mt-0.5 size-5 rounded-full bg-warning flex items-center justify-center">
          <Clock className="size-3 text-white" strokeWidth={2.5} aria-hidden="true" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm font-semibold text-navy">
            Your profile is under review
          </p>
          <p className="font-sans text-xs text-gray-600 mt-0.5 leading-relaxed">
            Our team is verifying your credentials. You'll receive an email within{' '}
            <strong>24–48 hours</strong> once approved. Some features are limited until verification is complete.
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Mail className="size-3 text-warning" aria-hidden="true" />
            <span className="font-sans text-xs text-gray-600">
              Check your inbox for a confirmation email from OkilChai.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss verification notice"
          className="shrink-0 text-gray-400 hover:text-navy transition-colors"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
