import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';
import { CreateCaseDto } from './create-case.dto';

// Inherit title/description from Create as optional; drop fields that don't apply to updates.
class CaseEditableFieldsDto extends PartialType(
  OmitType(CreateCaseDto, ['caseCategory', 'assignedLawyerId', 'appointmentId'] as const),
) {}

export class UpdateCaseDto extends CaseEditableFieldsDto {
  @ApiPropertyOptional({ maxLength: 100, nullable: true })
  @ValidateIf((_, v) => v !== null)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  referenceNumber?: string | null;

  @ApiPropertyOptional({ nullable: true, description: 'ISO 8601 with offset' })
  @ValidateIf((_, v) => v !== null)
  @IsOptional()
  @IsISO8601({ strict: true })
  estimatedCompletionAt?: string | null;
}
