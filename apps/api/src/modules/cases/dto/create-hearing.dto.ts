import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';
import { CaseHearingType } from '@repo/shared';

export class CreateHearingDto {
  @ApiProperty({ description: 'ISO 8601 with offset' })
  @IsISO8601({ strict: true })
  scheduledAt!: string;

  @ApiProperty({ maxLength: 300 })
  @IsString()
  @MaxLength(300)
  @IsOptional()
  venue?: string;

  @ApiProperty({ enum: CaseHearingType })
  @IsEnum(CaseHearingType)
  hearingType!: CaseHearingType;

  @ApiPropertyOptional({ maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}