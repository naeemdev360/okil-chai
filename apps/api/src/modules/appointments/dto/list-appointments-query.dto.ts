import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from '@repo/shared';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class ListAppointmentsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: AppointmentStatus, description: 'Filter by appointment status' })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional({ description: 'When true, returns only future appointments (startAt >= now) sorted soonest-first' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  upcoming?: boolean;

  @ApiPropertyOptional({ description: 'When true, returns only concluded appointments (completed, cancelled, no-show, refunded, disputed)' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  past?: boolean;
}
