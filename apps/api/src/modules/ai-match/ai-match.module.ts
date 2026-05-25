import { Module }          from '@nestjs/common';
import { LawyersModule }   from '../lawyers/lawyers.module';
import { AiMatchController } from './ai-match.controller';
import { AiMatchService }    from './ai-match.service';
import { AI_MATCH_SERVICE }  from './interfaces/ai-match.interfaces';

@Module({
  imports:     [LawyersModule],
  controllers: [AiMatchController],
  providers:   [{ provide: AI_MATCH_SERVICE, useClass: AiMatchService }],
})
export class AiMatchModule {}
