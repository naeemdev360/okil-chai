import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class LinkAppointmentDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  appointmentId!: string;
}
