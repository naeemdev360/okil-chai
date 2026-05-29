import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { CaseCategory, CasesSortField, CaseStage, CaseStatus } from '@repo/shared';

export class ListCasesQueryDto {
  @ApiPropertyOptional({ enum: CaseStatus })
  @IsOptional()
  @IsEnum(CaseStatus)
  status?: CaseStatus;

  @ApiPropertyOptional({ enum: CaseStage })
  @IsOptional()
  @IsEnum(CaseStage)
  stage?: CaseStage;

  @ApiPropertyOptional({ enum: CaseCategory })
  @IsOptional()
  @IsEnum(CaseCategory)
  category?: CaseCategory;

  @ApiPropertyOptional({ description: 'Search by case title or counterparty name (client name for lawyers, lawyer name for clients)' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @ApiPropertyOptional({ enum: CasesSortField, default: CasesSortField.UPDATED_AT })
  @IsOptional()
  @IsEnum(CasesSortField)
  sortBy?: CasesSortField;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Filter: case opened on or after this date (ISO 8601)' })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value as string) : undefined))
  @IsDate()
  openedFrom?: Date;

  @ApiPropertyOptional({ description: 'Filter: case opened on or before this date (ISO 8601)' })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value as string) : undefined))
  @IsDate()
  openedTo?: Date;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
