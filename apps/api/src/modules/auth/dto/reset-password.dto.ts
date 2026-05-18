import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'One-time password-reset token from the email link' })
  @IsString()
  token!: string;

  @ApiProperty({ example: 'NewStr0ng!Pass', minLength: 8, maxLength: 100 })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword!: string;
}
