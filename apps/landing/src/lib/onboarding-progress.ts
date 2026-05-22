import { LAWYER_ONBOARDING_TOTAL_STEPS } from '@repo/shared';
import { brand } from './brand';

const STEP_KEY = `${brand.storagePrefix}_onboarding_step`;

export const WIZARD_TOTAL_STEPS = LAWYER_ONBOARDING_TOTAL_STEPS;

export function getOnboardingStep(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(window.localStorage.getItem(STEP_KEY) ?? '0', 10) || 0;
}

export function saveOnboardingStep(step: number): void {
  window.localStorage.setItem(STEP_KEY, String(step));
}

export function clearOnboardingStep(): void {
  window.localStorage.removeItem(STEP_KEY);
}

export function getOnboardingProgress(): number {
  const step = getOnboardingStep();
  return Math.min(Math.round((step / WIZARD_TOTAL_STEPS) * 100), 100);
}
