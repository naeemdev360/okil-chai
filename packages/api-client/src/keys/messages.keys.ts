export const messagesKeys = {
  all: () => ['messages'] as const,
  conversations: () => [...messagesKeys.all(), 'conversations'] as const,
} as const;
