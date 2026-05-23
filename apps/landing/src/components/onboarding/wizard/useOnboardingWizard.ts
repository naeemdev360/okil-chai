'use client';

import { isApiError } from '@repo/api-client';
import type { AvailabilityRuleResponse, LawyerProfileResponse } from '@repo/shared';
import { LAWYER_ONBOARDING_TOTAL_STEPS, Role } from '@repo/shared';
import { toast } from '@repo/ui';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../lib/api/client';
import {
  clearOnboardingStep,
  getOnboardingStep,
  saveOnboardingStep,
} from '../../../lib/onboarding-progress';
import { useAuthStore } from '../../../lib/store/auth.store';
import { AUTH_STEP_VALIDATORS, STEP_VALIDATORS } from './validation';
import type { StepErrors } from './validation';
import { INITIAL_DATA } from './constants';
import { AUTH_STEP_KEYS } from './steps-config';
import type { ConsultationType, DayKey, WizardData, UpdateFn } from './types';

const DAY_TO_NUMBER: Record<DayKey, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

const NUMBER_TO_DAY: Record<number, DayKey> = {
  0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat',
};

const API_TO_WIZARD_CONSULTATION: Record<string, ConsultationType> = {
  VIDEO: 'video', PHONE: 'phone', IN_PERSON: 'in-person',
};

function mapProfileToData(profile: LawyerProfileResponse): Partial<WizardData> {
  return {
    phone:             profile.phone ?? '',
    experience:        String(profile.yearsOfExperience ?? ''),
    bio:               profile.bio ?? '',
    barNumber:         profile.barNumber ?? '',
    yearAdmitted:      String(profile.yearAdmitted ?? ''),
    barCouncil:        profile.barCouncil ?? 'Bangladesh Bar Council',
    city:              profile.city ?? '',
    pricePerHour:      profile.pricePerHour ? Number(profile.pricePerHour) : 150,
    consultationTypes: profile.consultationTypes
      .map((ct) => API_TO_WIZARD_CONSULTATION[ct] ?? ct.toLowerCase() as ConsultationType)
      .filter(Boolean),
    specializations:   profile.specializations.map((s) => s.slug),
    languages:         profile.languages.length ? profile.languages : ['English', 'Bengali'],
    existingDocuments: profile.documents,
  };
}

function mapAvailabilityToData(rules: AvailabilityRuleResponse[]): Partial<WizardData> {
  const availability = { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false } as Record<DayKey, boolean>;
  for (const rule of rules) {
    const day = NUMBER_TO_DAY[rule.dayOfWeek];
    if (day) availability[day] = true;
  }
  const first = rules[0];
  return {
    availability,
    ...(first && { startTime: first.startTime, endTime: first.endTime }),
  };
}

function buildStepFormData(stepKey: string, data: WizardData, stepNumber: number): FormData {
  const fd = new FormData();
  fd.append('step', String(stepNumber));
  if (stepKey === 'personal') {
    if (data.phone) fd.append('phone', data.phone);
    fd.append('yearsOfExperience', String(parseInt(data.experience, 10) || 0));
    if (data.bio) fd.append('bio', data.bio);
  } else if (stepKey === 'credentials') {
    if (data.barNumber) fd.append('barNumber', data.barNumber);
    if (data.yearAdmitted) fd.append('yearAdmitted', data.yearAdmitted);
    if (data.barCouncil) fd.append('barCouncil', data.barCouncil);
    for (const file of data.documents) {
      fd.append('documents', file);
    }
    if (data.documentTypes.length > 0) {
      fd.append('documentTypes', JSON.stringify(data.documentTypes));
    }
  } else if (stepKey === 'specs') {
    if (data.specializations.length) fd.append('specializationSlugs', JSON.stringify(data.specializations));
    if (data.languages.length) fd.append('languages', JSON.stringify(data.languages));
    if (data.city) fd.append('city', data.city);
  } else if (stepKey === 'pricing') {
    if (data.pricePerHour) fd.append('pricePerHour', String(data.pricePerHour));
    if (data.consultationTypes.length) {
      fd.append('consultationTypes', JSON.stringify(data.consultationTypes.map((ct) => ct.replace('-', '_').toUpperCase())));
    }
  }
  return fd;
}

async function saveStepToApi(stepKey: string, stepNumber: number, data: WizardData): Promise<void> {
  if (stepKey === 'availability') {
    const rules = (Object.entries(data.availability) as [DayKey, boolean][])
      .filter(([, active]) => active)
      .map(([day]) => ({ dayOfWeek: DAY_TO_NUMBER[day], startTime: data.startTime, endTime: data.endTime }));
    if (rules.length > 0) {
      await api.lawyers.replaceAvailabilityRules(rules);
    }
    const fd = new FormData();
    fd.append('step', String(stepNumber));
    await api.lawyers.saveOnboardingData(fd);
    return;
  }
  await api.lawyers.saveOnboardingData(buildStepFormData(stepKey, data, stepNumber));
}

export function useOnboardingWizard() {
  const t      = useTranslations('onboarding.lawyer');
  const locale = useLocale();
  const router = useRouter();

  const { user, isLoading: isAuthLoading, isAuthenticated, initialize } = useAuthStore();

  const [stepIdx, setStepIdx]           = useState(0);
  const [data, setData]                 = useState<WizardData>(INITIAL_DATA);
  const [stepErrors, setStepErrors]     = useState<Record<string, string>>({});
  const [submitError, setSubmitError]   = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [dataInitialized, setDataInitialized] = useState(false);
  const [stepRestored, setStepRestored]       = useState(false);
  const [profileLoaded, setProfileLoaded]     = useState(false);

  // ── Auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      router.replace(`/${locale}/auth/signup?role=lawyer`);
      return;
    }
    if (user && !user.roles.includes(Role.LAWYER)) {
      router.replace(`/${locale}/`);
    }
  }, [isAuthLoading, isAuthenticated, user, router, locale]);

  // ── Pre-fill from auth store ───────────────────────────────────────────────
  useEffect(() => {
    if (!user || dataInitialized) return;
    setData((prev) => ({
      ...prev,
      email:    user.email,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
    }));
    setDataInitialized(true);
  }, [user, dataInitialized]);

  // ── Load saved profile from DB and pre-fill wizard fields ────────────────────
  useEffect(() => {
    if (!user?.isVerified || profileLoaded) return;
    setProfileLoaded(true);
    void (async () => {
      try {
        const [profile, rules] = await Promise.all([
          api.lawyers.getMyProfile(),
          api.lawyers.getMyAvailabilityRules(),
        ]);
        setData((prev) => ({
          ...prev,
          ...mapProfileToData(profile),
          ...mapAvailabilityToData(rules),
        }));
      } catch {
        // leave INITIAL_DATA defaults if the profile fetch fails
      }
    })();
  }, [user, profileLoaded]);

  // ── Restore step — DB is source of truth; localStorage fills in-session gaps ─
  useEffect(() => {
    if (!user?.isVerified || stepRestored) return;
    const dbStep    = user.onboardingStep ?? 0;
    const localStep = getOnboardingStep();
    const resumed   = Math.max(dbStep, localStep);
    if (resumed > 0) setStepIdx(Math.min(resumed, AUTH_STEP_KEYS.length - 1));
    setStepRestored(true);
  }, [user, stepRestored]);

  const activeValidators = isAuthenticated ? AUTH_STEP_VALIDATORS : STEP_VALIDATORS;
  const currentStepKey   = AUTH_STEP_KEYS[stepIdx] ?? 'personal';

  const resolveErrors = useCallback(
    (raw: StepErrors): Record<string, string> =>
      Object.fromEntries(Object.entries(raw).map(([field, key]) => [field, t(`errors.${key}`)])),
    [t],
  );

  const update: UpdateFn = useCallback(
    (key, value) => setData((prev) => ({ ...prev, [key]: value })),
    [],
  );

  // Clear field-level step errors as the user fills in values
  useEffect(() => {
    if (!data.photo) return;
    setStepErrors((prev) => {
      if (!prev['photo']) return prev;
      const { photo: _, ...rest } = prev;
      return rest;
    });
  }, [data.photo]);

  const handleContinue = useCallback(async () => {
    const validator = activeValidators[stepIdx];
    if (validator) {
      const raw = validator(data);
      if (Object.keys(raw).length > 0) {
        setStepErrors(resolveErrors(raw));
        return;
      }
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await saveStepToApi(currentStepKey, stepIdx + 1, data);
      const next = stepIdx + 1;
      setStepErrors({});
      setStepIdx(next);
      saveOnboardingStep(next);
      if (currentStepKey === 'credentials') {
        const refreshed = await api.lawyers.getMyProfile();
        setData((prev) => ({
          ...prev,
          documents: [],
          documentTypes: [],
          existingDocuments: refreshed.documents,
        }));
      }
    } catch (error) {
      const message = isApiError(error) && error.statusCode === 401
        ? t('errors.submitUnauthorized')
        : t('errors.submitGeneric');
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [activeValidators, stepIdx, data, currentStepKey, resolveErrors, t]);

  const deleteExistingDoc = useCallback(async (documentId: string) => {
    setDeletingDocId(documentId);
    try {
      await api.lawyers.deleteDocument(documentId);
      // Only remove from local state after confirmed server deletion
      setData((prev) => ({
        ...prev,
        existingDocuments: prev.existingDocuments.filter((d) => d.id !== documentId),
      }));
    } catch (error) {
      const message = isApiError(error) && error.statusCode === 404
        ? t('errors.deleteDocNotFound')
        : t('errors.deleteDocGeneric');
      toast.error(message);
    } finally {
      setDeletingDocId(null);
    }
  }, [t]);

  const handleBack = useCallback(() => {
    setStepErrors({});
    if (stepIdx === 0) {
      router.push(`/${locale}/auth`);
    } else {
      setStepIdx((i) => i - 1);
    }
  }, [stepIdx, router, locale]);

  const handleSubmit = useCallback(async () => {
    const lastValidator = activeValidators[activeValidators.length - 1];
    if (lastValidator) {
      const raw = lastValidator(data);
      if (Object.keys(raw).length > 0) {
        setStepErrors(resolveErrors(raw));
        return;
      }
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const fd = new FormData();
      fd.append('step', String(LAWYER_ONBOARDING_TOTAL_STEPS));
      if (data.photo) fd.append('profilePhoto', data.photo);
      await api.lawyers.saveOnboardingData(fd);
      clearOnboardingStep();
      await initialize();
      toast.success(t('submitSuccess'));
      const portalUrl = process.env.NEXT_PUBLIC_LAWYER_PORTAL_URL;
      if (portalUrl) {
        window.location.href = `${portalUrl}/dashboard`;
      } else {
        router.push(`/${locale}/`);
      }
    } catch (error) {
      const message = isApiError(error) && error.statusCode === 401
        ? t('errors.submitUnauthorized')
        : t('errors.submitGeneric');
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [activeValidators, data, resolveErrors, initialize, router, locale, t]);

  return {
    user,
    isAuthLoading,
    isAuthenticated,
    stepIdx,
    data,
    stepErrors,
    submitError,
    isSubmitting,
    deletingDocId,
    currentStepKey,
    totalSteps: AUTH_STEP_KEYS.length,
    update,
    deleteExistingDoc,
    handleContinue,
    handleBack,
    handleSubmit,
  };
}
