'use client';

import { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { Input, Label, Textarea } from '@repo/ui';

export interface UserDetailsStepProps {
  readonly onBack: () => void;
  readonly onContinue: () => void;
}

const MAX_CHARS = 500;

export function UserDetailsStep({ onBack, onContinue }: UserDetailsStepProps) {
  const [caseDesc, setCaseDesc] = useState('');

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-7">
        <h2 className="font-heading text-2xl font-semibold text-navy mb-1.5">Your Details</h2>
        <p className="font-sans text-sm text-gray-600 mb-7">
          We&apos;ll use this to send your confirmation and calendar invite.
        </p>

        {/* Name row */}
        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" type="text" placeholder="Rachel" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" type="text" placeholder="Morgan" />
          </div>
        </div>

        {/* Contact row */}
        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+880 17 1234 5678" />
          </div>
        </div>

        {/* Case description */}
        <div className="flex flex-col gap-1.5 mb-4">
          <Label htmlFor="caseDesc">Briefly describe your legal matter</Label>
          <Textarea
            id="caseDesc"
            rows={3}
            maxLength={MAX_CHARS}
            value={caseDesc}
            onChange={(e) => setCaseDesc(e.target.value)}
            placeholder="What would you like to discuss? This helps the lawyer prepare."
          />
          <p className="font-sans text-[11px] text-gray-400">
            This is only shared with your lawyer. {caseDesc.length} / {MAX_CHARS} characters.
          </p>
        </div>

        {/* Attorney-client privilege notice */}
        <div className="flex items-start gap-2.5 p-3.5 bg-success-bg rounded-lg border border-success/20 mb-6">
          <Lock className="size-4 text-success mt-0.5 shrink-0" aria-hidden />
          <p className="font-sans text-xs text-gray-800 leading-relaxed">
            <strong className="text-success">Attorney-Client Privilege.</strong> Your case
            description is private and protected under attorney-client privilege from the moment
            you submit it.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-200 font-sans text-sm text-gray-600 bg-white hover:text-navy hover:border-navy transition-colors duration-150"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="flex-1 py-2.5 rounded-lg bg-gold text-navy font-sans text-sm font-semibold hover:bg-gold-light transition-colors duration-150"
          >
            Continue to Payment →
          </button>
        </div>
      </div>
    </div>
  );
}
