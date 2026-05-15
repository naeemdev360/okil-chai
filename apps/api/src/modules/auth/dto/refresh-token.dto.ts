import type { RefreshTokenRequest } from '@repo/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class RefreshTokenDto implements RefreshTokenRequest {
  @ApiProperty({ description: 'Refresh token (UUID) received at login or signup' })
  @IsString()
  @IsUUID(4)
  refreshToken!: string;
}
