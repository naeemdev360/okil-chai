export const INTAKE_QUESTIONS = [
  {
    q: 'What is the legal issue you need help with?',
    a: 'I was charged with a misdemeanor (M.G.L. c.90 §10) after a traffic stop last Saturday. The officer found an open container in the passenger footwell.',
  },
  {
    q: 'When did this happen?',
    a: 'April 22, 2026 — about 10:40 PM. Arraignment is set for Friday May 17.',
  },
  {
    q: 'Have you been charged or arrested before?',
    a: 'No prior charges or arrests. Clean record.',
  },
  {
    q: 'Are you currently represented by another attorney?',
    a: 'No.',
  },
  {
    q: 'Have you spoken with police or signed anything?',
    a: 'I answered some questions at the scene but did not sign anything besides the citation.',
  },
  {
    q: 'What is your goal for this consultation?',
    a: 'Understand whether to fight, plead, or seek a continuance without a finding. Want to keep this off my record if possible.',
  },
] as const;

export type ConflictType = 'pass' | 'warn';

export interface ConflictItem {
  readonly type: ConflictType;
  readonly label: string;
  readonly detail: string;
}

export const CONFLICT_ITEMS: readonly ConflictItem[] = [
  { type: 'pass', label: 'Client name',       detail: 'No match in client database' },
  { type: 'pass', label: 'Opposing parties',  detail: 'Commonwealth of MA — no prior representation' },
  { type: 'pass', label: 'Related entities',  detail: 'No matches' },
  { type: 'warn', label: 'Address proximity', detail: 'Client address is 0.4mi from past client R. Singh — review recommended' },
  { type: 'pass', label: 'Conflict screening',detail: 'Cleared by automated screen on Apr 24' },
];

export interface SessionDoc {
  readonly name: string;
  readonly size: string;
  readonly who: string;
  readonly when: string;
}

export const SESSION_DOCS: readonly SessionDoc[] = [
  { name: 'Citation_2026-04-22.pdf',       size: '142 KB', who: 'Client', when: 'Apr 23'   },
  { name: 'Police_report_DR-2618.pdf',      size: '1.1 MB', who: 'Client', when: 'Apr 24'   },
  { name: 'Drivers_license_scan.jpg',       size: '380 KB', who: 'Client', when: 'Apr 24'   },
  { name: 'Engagement_letter_DRAFT.docx',   size: '24 KB',  who: 'You',    when: '11:42 AM' },
];

export interface TimelineEvent {
  readonly t: string;
  readonly label: string;
  readonly mood: 'navy' | 'success' | 'gray';
}

export const TIMELINE_EVENTS: readonly TimelineEvent[] = [
  { t: '2:00 PM', label: 'Session started',         mood: 'navy'    },
  { t: '2:03 PM', label: 'Client joined',            mood: 'gray'    },
  { t: '2:09 PM', label: 'Intake reviewed',          mood: 'gray'    },
  { t: '2:14 PM', label: 'Conflict screen passed',   mood: 'success' },
];

export const QUICK_ACTIONS = [
  { icon: 'file',        label: 'Send intake form'        },
  { icon: 'credit-card', label: 'Send pre-payment'        },
  { icon: 'calendar',    label: 'Schedule follow-up'      },
  { icon: 'shield',      label: 'Send engagement letter'  },
] as const;

export const NOTE_SHORTCUTS = [
  'Add follow-up task',
  'Flag for review',
  'Insert template',
  'Tag client',
] as const;

export const INITIAL_NOTES =
  `• Client reviewed citation — confirmed misdemeanor charge under §90 (1)(a)\n` +
  `• Arraignment Fri May 17, Suffolk District Ct., Rm 4\n` +
  `• No prior record — eligible for CWOF if prosecution agrees\n` +
  `• Action: draft motion to dismiss by Wed; client to gather employment letter\n`;
