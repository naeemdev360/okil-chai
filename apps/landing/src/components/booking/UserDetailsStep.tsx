'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Lock } from 'lucide-react';
import { Input, Label, Textarea } from '@repo/ui';
import { CaseCategory } from '@repo/shared';
import { useAuthStore } from '../../lib/store/auth.store';
import type { BookingDetails } from './types';

const CASE_CATEGORY_LABELS: Record<CaseCategory, string> = {
  [CaseCategory.CRIMINAL]:              'Criminal',
  [CaseCategory.FAMILY]:                'Family',
  [CaseCategory.LAND_PROPERTY]:         'Land & Property',
  [CaseCategory.COMMERCIAL]:            'Commercial',
  [CaseCategory.CIVIL]:                 'Civil',
  [CaseCategory.LABOR]:                 'Labor',
  [CaseCategory.CONSTITUTIONAL]:        'Constitutional',
  [CaseCategory.INTELLECTUAL_PROPERTY]: 'Intellectual Property',
  [CaseCategory.IMMIGRATION]:           'Immigration',
  [CaseCategory.TAX]:                   'Tax',
  [CaseCategory.CONSUMER_RIGHTS]:       'Consumer Rights',
  [CaseCategory.OTHER]:                 'Other',
};

const schema = z.object({
  firstName:       z.string().min(1, 'First name is required'),
  lastName:        z.string().min(1, 'Last name is required'),
  email:           z.string().email('Enter a valid email'),
  phone:           z.string().min(7, 'Enter a valid phone number'),
  caseCategory: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.nativeEnum(CaseCategory, { required_error: 'Select a case type' }),
  ),
  caseDescription: z.string().max(1000).optional().default(''),
});

type FormValues = z.infer<typeof schema>;

export interface UserDetailsStepProps {
  readonly onBack:     () => void;
  readonly onContinue: (details: BookingDetails) => void;
}

const MAX_CHARS = 1000;

export function UserDetailsStep({ onBack, onContinue }: UserDetailsStepProps) {
  const user = useAuthStore((s) => s.user);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName:       user?.firstName ?? '',
      lastName:        user?.lastName  ?? '',
      email:           user?.email     ?? '',
      caseDescription: '',
    },
  });

  const caseDesc = watch('caseDescription') ?? '';

  function onSubmit(values: FormValues) {
    onContinue({
      firstName:       values.firstName,
      lastName:        values.lastName,
      email:           values.email,
      phone:           values.phone,
      caseDescription: values.caseDescription ?? '',
      caseCategory:    values.caseCategory,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-7">
        <h2 className="font-heading text-2xl font-semibold text-navy mb-1.5">Your Details</h2>
        <p className="font-sans text-sm text-gray-600 mb-7">
          We&apos;ll use this to send your confirmation and calendar invite.
        </p>

        {/* Name row */}
        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" type="text" placeholder="Rachel" aria-invalid={!!errors.firstName} {...register('firstName')} />
            {errors.firstName && <p className="font-sans text-xs text-error">{errors.firstName.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" type="text" placeholder="Morgan" aria-invalid={!!errors.lastName} {...register('lastName')} />
            {errors.lastName && <p className="font-sans text-xs text-error">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Contact row */}
        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="you@example.com" aria-invalid={!!errors.email} {...register('email')} />
            {errors.email && <p className="font-sans text-xs text-error">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+880 17 1234 5678" aria-invalid={!!errors.phone} {...register('phone')} />
            {errors.phone && <p className="font-sans text-xs text-error">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Case category */}
        <div className="flex flex-col gap-1.5 mb-3.5">
          <Label htmlFor="caseCategory">Nature of Your Legal Matter</Label>
          <select
            id="caseCategory"
            aria-invalid={!!errors.caseCategory}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 font-sans text-sm text-navy focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
            {...register('caseCategory')}
          >
            <option value="">Select category…</option>
            {Object.entries(CASE_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.caseCategory && <p className="font-sans text-xs text-error">{errors.caseCategory.message}</p>}
        </div>

        {/* Case description */}
        <div className="flex flex-col gap-1.5 mb-4">
          <Label htmlFor="caseDescription">Briefly describe your legal matter (optional)</Label>
          <Textarea
            id="caseDescription"
            rows={3}
            maxLength={MAX_CHARS}
            placeholder="What would you like to discuss? This helps the lawyer prepare."
            {...register('caseDescription')}
          />
          <p className="font-sans text-[11px] text-gray-400">
            This is only shared with your lawyer. {caseDesc.length} / {MAX_CHARS} characters.
          </p>
        </div>

        {/* Privilege notice */}
        <div className="flex items-start gap-2.5 p-3.5 bg-success-bg rounded-lg border border-success/20 mb-6">
          <Lock className="size-4 text-success mt-0.5 shrink-0" aria-hidden />
          <p className="font-sans text-xs text-gray-800 leading-relaxed">
            <strong className="text-success">Attorney-Client Privilege.</strong>{' '}
            Your case description is private and protected under attorney-client privilege from the moment you submit it.
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
            type="submit"
            className="flex-1 py-2.5 rounded-lg bg-gold text-navy font-sans text-sm font-semibold hover:bg-gold-light transition-colors duration-150"
          >
            Continue to Payment →
          </button>
        </div>
      </div>
    </form>
  );
}
