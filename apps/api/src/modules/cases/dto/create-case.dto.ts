import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { CaseCategory } from '@repo/shared';

export class CreateCaseDto {
  @ApiProperty({ maxLength: 200 })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiProperty({ enum: CaseCategory })
  @IsEnum(CaseCategory)
  caseCategory!: CaseCategory;

  @ApiPropertyOptional({ format: 'uuid', description: 'Optionally invite a lawyer at creation time' })
  @IsOptional()
  @IsUUID()
  assignedLawyerId?: string;

  @ApiPropertyOptional({ format: 'uuid', description: 'Optionally link an existing appointment' })
  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description:
      'Required when a lawyer opens the case on behalf of an existing client. Resolve via GET /users/clients/lookup first.',
  })
  @IsOptional()
  @IsUUID()
  clientUserId?: string;
}
