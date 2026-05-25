import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  provider: (process.env['AI_PROVIDER'] ?? 'openai') as 'openai' | 'anthropic',
  openaiApiKey: process.env['OPENAI_API_KEY'],
  anthropicApiKey: process.env['ANTHROPIC_API_KEY'],
  model: process.env['AI_MODEL'] ?? 'gpt-4o-mini',
}));
