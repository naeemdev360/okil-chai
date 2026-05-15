import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@repo/shared';
import { IsEnum } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role!: Role;
}
