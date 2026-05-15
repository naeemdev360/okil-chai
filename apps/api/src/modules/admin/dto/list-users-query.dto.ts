import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@repo/shared';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { SearchQueryDto } from '../../../common/dto/search-query.dto';

export class ListUsersQueryDto extends SearchQueryDto {
  @ApiPropertyOptional({ enum: Role, description: 'Filter by role' })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ description: 'Filter by active/suspended status' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: unknown }) => value === 'true' || value === true)
  isActive?: boolean;
}
