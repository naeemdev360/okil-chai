import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RespondToReviewDto {
  @ApiProperty({ description: 'Lawyer public response to the review', minLength: 1, maxLength: 2000 })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  text!: string;
}
