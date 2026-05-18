import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class GetAvailabilityDto {
  @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD). Defaults to today.', example: '2026-05-19' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: 'End date (YYYY-MM-DD). Defaults to 14 days from today.', example: '2026-06-02' })
  @IsOptional()
  @IsDateString()
  to?: string;
}
