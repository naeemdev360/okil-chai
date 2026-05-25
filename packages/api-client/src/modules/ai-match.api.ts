import type { AiMatchRequest, AiMatchResponse } from '@repo/shared';
import type { Http } from '../core/http';

export function createAiMatchApi(http: Http) {
  return {
    match: (body: AiMatchRequest) =>
      http.post<AiMatchResponse>('/ai-match', body),
  } as const;
}
