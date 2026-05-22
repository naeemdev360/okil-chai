import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ description: 'UUID of the recipient user', format: 'uuid' })
  @IsUUID()
  receiverId!: string;

  @ApiProperty({ description: 'Message content', minLength: 1, maxLength: 5000 })
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  content!: string;

  @ApiPropertyOptional({ description: 'UUID of a related appointment', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  appointmentId?: string;
}
