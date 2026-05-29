import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';
import { CreateHearingDto } from './create-hearing.dto';

export class UpdateHearingDto extends PartialType(CreateHearingDto) {
  @ApiPropertyOptional({ maxLength: 2000, nullable: true, description: 'Hearing outcome (lawyer captures after the fact)' })
  @ValidateIf((_, v) => v !== null)
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  outcome?: string | null;
}
