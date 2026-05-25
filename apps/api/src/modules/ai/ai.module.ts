import { Global, Module }  from '@nestjs/common';
import { ConfigService }   from '@nestjs/config';
import { OpenAiProvider }  from './providers/openai.provider';
import { AnthropicProvider } from './providers/anthropic.provider';
import { AI_PROVIDER }     from './interfaces/ai-provider.interface';

@Global()
@Module({
  providers: [
    {
      provide:    AI_PROVIDER,
      inject:     [ConfigService],
      useFactory: (config: ConfigService) => {
        const provider = config.get<string>('ai.provider', 'openai');
        return provider === 'anthropic'
          ? new AnthropicProvider(config)
          : new OpenAiProvider(config);
      },
    },
  ],
  exports: [AI_PROVIDER],
})
export class AiModule {}
