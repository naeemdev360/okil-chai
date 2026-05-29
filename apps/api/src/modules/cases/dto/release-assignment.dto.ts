import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ReleaseAssignmentDto {
  @ApiPropertyOptional({ maxLength: 2000, description: 'Free-text reason shown to the client' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string;
}
