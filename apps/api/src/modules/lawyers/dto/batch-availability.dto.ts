import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateAvailabilityRuleDto } from './create-availability-rule.dto';

export class BatchAvailabilityDto {
  @ApiProperty({
    type: [CreateAvailabilityRuleDto],
    description: 'Replaces all existing recurring availability rules for the lawyer',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAvailabilityRuleDto)
  rules!: CreateAvailabilityRuleDto[];
}
