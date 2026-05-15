'use client';

import { useState } from 'react';
import { Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { cn, Input, Label, Checkbox } from '@repo/ui';
import { LawyerAvatar } from '../shared/LawyerAvatar';
import { CONSULT_META, WEEK_DAYS } from './constants';
import { consultFee, computeFees } from './utils';
import type { Lawyer } from '../../lib/search/mock-lawyers';
import type { ConsultType } from './types';

export interface ReviewStepProps {
  readonly lawyer: Lawyer;
  readonly consultType: ConsultType;
  readonly selectedDay: string;
  readonly selectedTime: string;
  readonly onBack: () => void;
  readonly onSuccess: () => void;
}

type PayMethod = 'card' | 'apple' | 'google';

interface CardForm {
  readonly number: string;
  readonly expiry: string;
  readonly cvc: string;
  readonly name: string;
}

const PAY_METHODS: ReadonlyArray<{ key: PayMethod; label: string }> = [
  { key: 'card',   label: '💳 Card'      },
  { key: 'apple',  label: ' Apple Pay' },
  { key: 'google', label: ' Google Pay' },
];

function ProcessingOverlay() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="size-14 border-4 border-gray-100 border-t-gold rounded-full mx-auto mb-5 animate-spin" />
        <h2 className="font-heading text-xl font-semibold text-navy mb-1.5">
          Processing your payment…
        </h2>
        <p className="font-sans text-sm text-gray-600">
          Please don&apos;t refresh. This takes a few seconds.
        </p>
      </div>
    </div>
  );
}

function FeeRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: 'success' | 'navy';
}) {
  return (
    <div
      className={cn(
        'flex justify-between font-sans text-[13px]',
        highlight === 'success' && 'text-success',
        highlight === 'navy'    && 'text-navy font-semibold',
        !highlight              && 'text-gray-600',
      )}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function ReviewStep({
  lawyer,
  consultType,
  selectedDay,
  selectedTime,
  onBack,
  onSuccess,
}: ReviewStepProps) {
  const [payMethod, setPayMethod] = useState<PayMethod>('card');
  const [card, setCard] = useState<CardForm>({ number: '', expiry: '', cvc: '', name: '' });
  const [saveCard, setSaveCard] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [processing, setProcessing] = useState(false);

  const base = consultFee(lawyer, consultType);
  const fees = computeFees(base, promoApplied);
  const dayMeta = WEEK_DAYS.find((d) => d.date === selectedDay);
  const { label: consultLabel } = CONSULT_META[consultType];
  const platformPct = Math.round((fees.platform / fees.base) * 100);

  function handlePay() {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); onSuccess(); }, 1600);
  }

  function applyPromo() {
    setPromoApplied(promoCode.trim().toUpperCase() === 'FIRST20');
  }

  if (processing) return <ProcessingOverlay />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-7">
      {/* ── LEFT: payment form ── */}
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-sans text-sm text-gray-600 hover:text-navy transition-colors w-fit"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </button>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-heading text-[22px] font-semibold text-navy mb-1">Secure Payment</h2>
          <p className="font-sans text-[13px] text-gray-600 inline-flex items-center gap-1.5 mb-5">
            <Lock className="size-3.5 text-success" aria-hidden />
            256-bit SSL · Powered by Stripe
          </p>

          {/* Payment method tabs */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {PAY_METHODS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setPayMethod(key)}
                className={cn(
                  'py-2.5 rounded-lg font-sans text-[13px] font-medium border-[1.5px] transition-all duration-150',
                  payMethod === key
                    ? 'bg-gold-pale border-gold text-navy'
                    : 'bg-white border-gray-200 text-navy hover:border-navy/40',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Card fields */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  type="text"
                  value={card.number}
                  onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                  placeholder="1234 5678 9012 3456"
                  className="font-mono tracking-wider pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-navy text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded pointer-events-none">
                  VISA
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="expiry">Expiry</Label>
                <Input
                  id="expiry"
                  type="text"
                  value={card.expiry}
                  onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
                  placeholder="MM/YY"
                  className="font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  type="text"
                  value={card.cvc}
                  onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value }))}
                  placeholder="123"
                  className="font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                type="text"
                value={card.name}
                onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                placeholder="Full name on card"
              />
            </div>
          </div>

          {/* Save card */}
          <div className="flex items-center gap-2.5 mt-3.5">
            <Checkbox
              id="saveCard"
              variant="gold"
              checked={saveCard}
              onCheckedChange={(v) => setSaveCard(v === true)}
            />
            <Label htmlFor="saveCard" className="cursor-pointer font-normal text-[13px]">
              Save card for future bookings
            </Label>
          </div>
        </div>

        {/* Promo code */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <Input
            type="text"
            placeholder="Promo code (try FIRST20)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
            className="flex-1"
          />
          <button
            type="button"
            onClick={applyPromo}
            className="px-4 py-2.5 rounded-lg font-sans text-sm font-semibold bg-navy text-white hover:bg-navy-mid transition-colors shrink-0"
          >
            Apply
          </button>
        </div>

        {promoApplied && (
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-success-bg rounded-lg font-sans text-xs text-success">
            <CheckCircle className="size-3.5 shrink-0" aria-hidden />
            FIRST20 applied — $20 off your first consultation!
          </div>
        )}
      </div>

      {/* ── RIGHT: order summary ── */}
      <div className="sticky top-[88px] self-start flex flex-col gap-3.5">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-400 mb-4">
            Order Summary
          </p>

          <div className="flex items-start gap-3 pb-3.5 border-b border-gray-100 mb-3.5">
            <LawyerAvatar initials={lawyer.initials} verified={lawyer.verified} size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-heading text-sm font-semibold text-navy truncate">{lawyer.name}</p>
              <p className="font-sans text-xs text-gray-600">{lawyer.specialization}</p>
              <p className="font-sans text-[11px] text-gray-400 mt-1">
                {dayMeta?.label}, {selectedDay} · {selectedTime} · 60 min
              </p>
              <p className="font-sans text-[11px] text-gray-400">{consultLabel}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <FeeRow label="Consultation fee"             value={`$${fees.base}.00`}     />
            <FeeRow label={`Platform fee (${platformPct}%)`} value={`$${fees.platform}.00`} />
            <FeeRow label="Tax"                          value={`$${fees.tax}.00`}      />
            {promoApplied && (
              <FeeRow label="Promo (FIRST20)" value={`−$${fees.discount}.00`} highlight="success" />
            )}
          </div>

          <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-baseline">
            <span className="font-sans text-sm font-semibold text-navy">Total</span>
            <span className="font-heading text-2xl font-bold text-navy">${fees.total}.00</span>
          </div>

          <button
            type="button"
            onClick={handlePay}
            className="w-full mt-4 py-3.5 rounded-lg bg-gold text-navy font-sans text-[15px] font-semibold inline-flex items-center justify-center gap-2 hover:bg-gold-light transition-colors duration-150"
          >
            <Lock className="size-3.5" aria-hidden />
            Pay ${fees.total}.00
          </button>

          <p className="mt-3 p-2.5 bg-cream rounded-lg font-sans text-[11px] text-gray-600 leading-relaxed">
            <strong className="text-navy">Free cancellation</strong> up to 24 hours before. Full
            refund guaranteed for no-shows.
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {['VISA', 'MC', 'AMEX', 'STRIPE'].map((b) => (
            <span
              key={b}
              className="font-mono text-[9px] px-2 py-1 bg-white rounded border border-gray-200 text-gray-500 font-bold"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
