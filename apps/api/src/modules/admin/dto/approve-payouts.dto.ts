import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class ApprovePayoutsDto {
  @ApiProperty({ type: [String], description: 'Payment IDs to mark as paid out' })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  paymentIds!: string[];
}
