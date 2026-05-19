import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from '@repo/shared';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class ListAppointmentsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: AppointmentStatus, description: 'Filter by appointment status' })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
