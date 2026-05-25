import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { IAiProvider } from '../interfaces/ai-provider.interface';

@Injectable()
export class OpenAiProvider implements IAiProvider {
  private readonly client: OpenAI;
  private readonly model:  string;

  constructor(private readonly config: ConfigService) {
    this.client = new OpenAI({ apiKey: config.getOrThrow<string>('ai.openaiApiKey') });
    this.model  = config.get<string>('ai.model', 'gpt-4o-mini');
  }

  async complete(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model:       this.model,
      messages:    [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });
    return response.choices[0]?.message?.content ?? '';
  }
}
