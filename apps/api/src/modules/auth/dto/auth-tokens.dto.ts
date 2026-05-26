import { ApiProperty } from '@nestjs/swagger';

/** The refresh token is delivered as an httpOnly cookie, so only the access token is in the body. */
export class AccessTokenDto {
  @ApiProperty()
  accessToken!: string;
}
