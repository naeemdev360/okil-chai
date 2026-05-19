import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsISO8601, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ConsultationType } from '@repo/shared';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Lawyer profile UUID', format: 'uuid' })
  @IsUUID()
  lawyerId!: string;

  @ApiProperty({ enum: ConsultationType })
  @IsEnum(ConsultationType)
  consultationType!: ConsultationType;

  @ApiProperty({
    description: 'Start time — ISO 8601 with timezone offset',
    example: '2026-06-01T10:00:00+06:00',
  })
  @IsISO8601({ strict: true })
  startAt!: string;

  @ApiProperty({
    description: 'End time — ISO 8601 with timezone offset',
    example: '2026-06-01T11:00:00+06:00',
  })
  @IsISO8601({ strict: true })
  endAt!: string;

  @ApiPropertyOptional({ description: 'Optional notes for the lawyer', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  clientNotes?: string;
}
