import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class AiMatchRequestDto {
  @ApiProperty({ description: 'Description of the legal situation (20–2000 chars)' })
  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  description!: string;

  @ApiProperty({ enum: ['today', 'thisWeek', 'noRush'], description: 'How urgently the user needs help' })
  @IsEnum(['today', 'thisWeek', 'noRush'])
  urgency!: 'today' | 'thisWeek' | 'noRush';

  @ApiProperty({ enum: ['low', 'mid', 'any'], description: 'Budget preference' })
  @IsEnum(['low', 'mid', 'any'])
  budget!: 'low' | 'mid' | 'any';
}
