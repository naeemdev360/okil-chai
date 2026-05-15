import { ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '@repo/shared';
import { IsEnum, IsOptional } from 'class-validator';
import { SearchQueryDto } from '../../../common/dto/search-query.dto';

export class ListLawyersQueryDto extends SearchQueryDto {
  @ApiPropertyOptional({ enum: VerificationStatus, description: 'Filter by verification status' })
  @IsOptional()
  @IsEnum(VerificationStatus)
  verificationStatus?: VerificationStatus;
}
