import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ConsultationType } from '@repo/shared';

export class SearchLawyersDto {
  @ApiPropertyOptional({ description: 'Free-text search across lawyer name, city, and specialization' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ description: 'Filter by specialization slug, e.g. "criminal-law"' })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiPropertyOptional({ description: 'Filter by city name (case-insensitive partial match)' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Filter by language name, e.g. "Bengali"' })
  @IsOptional()
  @IsString()
  lang?: string;

  @ApiPropertyOptional({ description: 'Minimum price per hour' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price per hour' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Minimum average rating (1–5)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ enum: ConsultationType, description: 'Filter by consultation type' })
  @IsOptional()
  @IsEnum(ConsultationType)
  consultationType?: ConsultationType;

  @ApiPropertyOptional({ description: 'Filter by instant booking availability' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isInstantBooking?: boolean;

  @ApiPropertyOptional({ default: 1, description: 'Page number (1-based)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, description: 'Results per page (max 50)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 20;
}
