import type { WizardData } from './types';

export type StepErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CURRENT_YEAR = new Date().getFullYear();

function validateAccount(data: WizardData): StepErrors {
  const errors: StepErrors = {};
  if (!data.email.trim()) errors['email'] = 'required';
  else if (!EMAIL_RE.test(data.email)) errors['email'] = 'emailInvalid';
  if (!data.password || data.password.length < 8) errors['password'] = 'passwordTooShort';
  if (data.confirmPassword !== data.password) errors['confirmPassword'] = 'passwordMismatch';
  if (!data.termsAccepted) errors['termsAccepted'] = 'termsRequired';
  return errors;
}

function validatePersonal(data: WizardData): StepErrors {
  const errors: StepErrors = {};
  if (!data.fullName.trim()) errors['fullName'] = 'required';
  if (!data.phone.trim()) errors['phone'] = 'required';
  if (!data.experience.trim()) {
    errors['experience'] = 'required';
  } else {
    const years = parseInt(data.experience, 10);
    if (isNaN(years) || years < 0 || years > 70) errors['experience'] = 'experienceInvalid';
  }
  if (!data.bio.trim()) {
    errors['bio'] = 'required';
  } else if (data.bio.trim().length < 50) {
    errors['bio'] = 'bioTooShort';
  }
  return errors;
}

function validateCredentials(data: WizardData): StepErrors {
  const errors: StepErrors = {};
  if (!data.barNumber.trim()) errors['barNumber'] = 'required';
  if (!data.yearAdmitted.trim()) {
    errors['yearAdmitted'] = 'required';
  } else {
    const year = parseInt(data.yearAdmitted, 10);
    if (isNaN(year) || year < 1950 || year > CURRENT_YEAR) {
      errors['yearAdmitted'] = 'yearAdmittedInvalid';
    }
  }
  if (data.documents.length === 0 && data.existingDocuments.length === 0) errors['documents'] = 'documentsRequired';
  return errors;
}

function validateSpecs(data: WizardData): StepErrors {
  const errors: StepErrors = {};
  if (data.specializations.length === 0) errors['specializations'] = 'specializations';
  if (data.languages.length === 0) errors['languages'] = 'languages';
  return errors;
}

function validatePricing(data: WizardData): StepErrors {
  const errors: StepErrors = {};
  if (data.pricePerHour <= 0) errors['pricePerHour'] = 'pricePerHour';
  if (data.consultationTypes.length === 0) errors['consultationTypes'] = 'consultationTypes';
  return errors;
}

function validateAvailability(data: WizardData): StepErrors {
  const errors: StepErrors = {};
  const hasDay = Object.values(data.availability).some(Boolean);
  if (!hasDay) errors['availability'] = 'availability';
  return errors;
}

// Order matches ALL_STEPS in the wizard (account first)
export const STEP_VALIDATORS: ReadonlyArray<(d: WizardData) => StepErrors> = [
  validateAccount,
  validatePersonal,
  validateCredentials,
  validateSpecs,
  validatePricing,
  validateAvailability,
  () => ({}), // photo — optional
];

// Slice used when the user is already authenticated (account step skipped)
export const AUTH_STEP_VALIDATORS: ReadonlyArray<(d: WizardData) => StepErrors> =
  STEP_VALIDATORS.slice(1);
