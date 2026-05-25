import type { AiMatchRequest, AiMatchResponse } from '@repo/shared';

export const AI_MATCH_SERVICE = Symbol('AI_MATCH_SERVICE');

export interface IAiMatchService {
  match(request: AiMatchRequest): Promise<AiMatchResponse>;
}
