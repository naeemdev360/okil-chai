import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import type { IAiProvider } from '../interfaces/ai-provider.interface';

@Injectable()
export class AnthropicProvider implements IAiProvider {
  private readonly client: Anthropic;
  private readonly model:  string;

  constructor(private readonly config: ConfigService) {
    this.client = new Anthropic({ apiKey: config.getOrThrow<string>('ai.anthropicApiKey') });
    this.model  = config.get<string>('ai.model', 'claude-haiku-4-5-20251001');
  }

  async complete(prompt: string): Promise<string> {
    const response = await this.client.messages.create({
      model:      this.model,
      max_tokens: 512,
      messages:   [{ role: 'user', content: prompt }],
    });
    const block = response.content[0];
    return block?.type === 'text' ? block.text : '';
  }
}
