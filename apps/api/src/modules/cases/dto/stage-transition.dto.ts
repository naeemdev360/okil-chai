import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { CaseStage } from '@repo/shared';

export class StageTransitionDto {
  @ApiProperty({ enum: CaseStage })
  @IsEnum(CaseStage)
  toStage!: CaseStage;

  @ApiPropertyOptional({ maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}
