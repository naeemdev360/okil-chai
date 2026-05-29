import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignLawyerDto {
  @ApiProperty({ format: 'uuid', description: 'Lawyer profile UUID to invite' })
  @IsUUID()
  lawyerId!: string;
}
