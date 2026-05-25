import { z } from 'zod';
import { LawyerPublicProfileSchema } from './lawyer.schemas.js';

export const UrgencySchema  = z.enum(['today', 'thisWeek', 'noRush']);
export const BudgetSchema   = z.enum(['low', 'mid', 'any']);

export const AiMatchRequestSchema = z.object({
  description: z.string().min(20).max(2000),
  urgency:     UrgencySchema,
  budget:      BudgetSchema,
});

export type AiMatchRequest = z.infer<typeof AiMatchRequestSchema>;

export const AiMatchedLawyerSchema = z.object({
  lawyer:     LawyerPublicProfileSchema,
  matchScore: z.number().int().min(0).max(100),
  reasoning:  z.string(),
});

export type AiMatchedLawyerResponse = z.infer<typeof AiMatchedLawyerSchema>;

export const AiMatchResponseSchema = z.object({
  practiceArea: z.string(),
  summary:      z.string(),
  matches:      z.array(AiMatchedLawyerSchema),
});

export type AiMatchResponse = z.infer<typeof AiMatchResponseSchema>;
