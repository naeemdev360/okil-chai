import type { VerificationStatus } from '../types/admin.types';

export const adminKeys = {
  all: () => ['admin'] as const,

  verifications: () => [...adminKeys.all(), 'verifications'] as const,
  verificationsByStatus: (status: VerificationStatus) =>
    [...adminKeys.verifications(), status] as const,
} as const;
