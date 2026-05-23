import type { DocumentType, LawyerDocumentResponse } from '@repo/shared';

export type ConsultationType = 'video' | 'phone' | 'in-person';
export type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type SlotDuration = '30 min' | '45 min' | '60 min' | '90 min';

export interface WizardData {
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly termsAccepted: boolean;
  readonly fullName: string;
  readonly phone: string;
  readonly experience: string;
  readonly bio: string;
  readonly barNumber: string;
  readonly yearAdmitted: string;
  readonly barCouncil: string;
  readonly documents: readonly File[];
  readonly documentTypes: readonly DocumentType[];
  readonly existingDocuments: readonly LawyerDocumentResponse[];
  readonly specializations: string[];
  readonly languages: string[];
  readonly city: string;
  readonly pricePerHour: number;
  readonly consultationTypes: ConsultationType[];
  readonly availability: Record<DayKey, boolean>;
  readonly startTime: string;
  readonly endTime: string;
  readonly slotDuration: SlotDuration;
  readonly syncCalendar: boolean;
}

export type UpdateFn = <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;

export interface StepProps {
  readonly data: WizardData;
  readonly update: UpdateFn;
  readonly errors?: Record<string, string>;
  readonly onDeleteExistingDoc?: (id: string) => Promise<void>;
  readonly deletingDocId?: string | null;
}
