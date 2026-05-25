import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { AiMatchResponse } from '@repo/shared';
import { Public } from '../../common/decorators/public.decorator';
import { AiMatchRequestDto } from './dto/ai-match-request.dto';
import { AI_MATCH_SERVICE, type IAiMatchService } from './interfaces/ai-match.interfaces';

@ApiTags('AI Match')
@Controller('ai-match')
@Public()
export class AiMatchController {
  constructor(@Inject(AI_MATCH_SERVICE) private readonly aiMatchService: IAiMatchService) {}

  @Post()
  @ApiOperation({ summary: 'Analyze a legal situation and return ranked lawyer matches' })
  @ApiResponse({ status: 201, description: 'Ranked lawyer matches with AI-generated reasoning' })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  match(@Body() body: AiMatchRequestDto): Promise<AiMatchResponse> {
    return this.aiMatchService.match(body);
  }
}
