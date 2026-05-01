import type { ConsultationType, DayKey, SlotDuration, WizardData } from './types';

export const INITIAL_DATA: WizardData = {
  email: '', password: '', confirmPassword: '', termsAccepted: false,
  fullName: '', phone: '', experience: '', bio: '',
  barNumber: '', yearAdmitted: '', barCouncil: 'Bangladesh Bar Council',
  specializations: [], languages: ['English', 'Bengali'],
  city: '',
  pricePerHour: 150,
  consultationTypes: ['video'],
  availability: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false },
  startTime: '09:00', endTime: '18:00', slotDuration: '60 min',
  syncCalendar: true,
};

export const SPECIALIZATION_OPTIONS = [
  'Criminal Law', 'Family Law', 'Corporate Law', 'Immigration',
  'Real Estate', 'Employment', 'Intellectual Property', 'Tax Law',
  'Personal Injury', 'Civil Litigation',
] as const;

export const LANGUAGE_OPTIONS = [
  'English', 'Bengali', 'Hindi', 'Urdu', 'Arabic', 'French', 'Spanish', 'Mandarin',
] as const;

export const BAR_COUNCILS = [
  'Bangladesh Bar Council', 'New York State Bar',
  'California State Bar', 'Bar Council of India',
] as const;

export const SLOT_DURATIONS: SlotDuration[] = ['30 min', '45 min', '60 min', '90 min'];

export const DAYS: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const CONSULTATION_TYPES: Array<{
  readonly key: ConsultationType;
  readonly labelKey: string;
  readonly descKey: string;
}> = [
  { key: 'video',     labelKey: 'video.label',    descKey: 'video.desc'    },
  { key: 'phone',     labelKey: 'phone.label',    descKey: 'phone.desc'    },
  { key: 'in-person', labelKey: 'inPerson.label', descKey: 'inPerson.desc' },
];
