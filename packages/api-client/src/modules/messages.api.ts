import type { ConversationSummary } from '@repo/shared';
import type { Http } from '../core/http';

export function createMessagesApi(http: Http) {
  return {
    getConversations: () =>
      http.get<ConversationSummary[]>('/messages/conversations'),
  } as const;
}
