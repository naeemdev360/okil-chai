import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ConsultationType, DocumentType } from '@repo/shared';

function parseJsonArray(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  try { return JSON.parse(value); } catch { return value; }
}

export class CompleteOnboardingDto {
  @ApiPropertyOptional({ example: '+8801700000000' })
  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(70)
  @Transform(({ value }: { value: unknown }) => (value !== undefined ? Number(value) : undefined))
  yearsOfExperience?: number;

  @ApiPropertyOptional({ example: 'Experienced family law attorney...' })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  bio?: string;

  @ApiPropertyOptional({ example: 'BD/12345/2016' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  barNumber?: string;

  @ApiPropertyOptional({ example: 2016 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  @Transform(({ value }: { value: unknown }) => (value !== undefined ? Number(value) : undefined))
  yearAdmitted?: number;

  @ApiPropertyOptional({ example: 'Bangladesh Bar Council' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  barCouncil?: string;

  @ApiPropertyOptional({ example: 'Dhaka' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ example: 'BD', default: 'BD' })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  country?: string;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (value !== undefined ? Number(value) : undefined))
  @Min(0)
  @Max(10_000)
  pricePerHour?: number;

  @ApiPropertyOptional({ enum: ConsultationType, isArray: true, example: ['VIDEO', 'PHONE'] })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => parseJsonArray(value))
  @IsArray()
  @IsEnum(ConsultationType, { each: true })
  consultationTypes?: ConsultationType[];

  @ApiPropertyOptional({ isArray: true, example: ['criminal-law', 'family-law'] })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => parseJsonArray(value))
  @IsArray()
  @IsString({ each: true })
  specializationSlugs?: string[];

  @ApiPropertyOptional({ isArray: true, example: ['English', 'Bengali'] })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => parseJsonArray(value))
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiProperty({
    enum: DocumentType,
    isArray: true,
    description: 'Document type for each uploaded file — must be parallel to the documents[] files',
    example: ['BAR_CERTIFICATE', 'LAW_DEGREE'],
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => parseJsonArray(value))
  @IsArray()
  @IsEnum(DocumentType, { each: true })
  documentTypes?: DocumentType[];
}
