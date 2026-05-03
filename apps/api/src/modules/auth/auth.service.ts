import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '@okil-chai/shared';
import type { AuthTokensDto } from './dto/auth-tokens.dto';
import type { LoginDto } from './dto/login.dto';
import type { UserProfileDto } from './dto/user-profile.dto';

const LAWYER_KEYWORD = 'lawyer' as const;

interface MockTokenPayload {
  readonly email: string;
  readonly role: Role;
}

function deriveRole(email: string): Role {
  return email.toLowerCase().includes(LAWYER_KEYWORD) ? Role.LAWYER : Role.CLIENT;
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function namePartsFromEmail(email: string): { firstName: string; lastName: string } {
  const localPart = email.split('@')[0] ?? 'user';
  const parts = localPart.split(/[.\-_]/);
  return {
    firstName: capitalize(parts[0] ?? 'Test'),
    lastName: capitalize(parts[1] ?? 'User'),
  };
}

function encodeToken(payload: MockTokenPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function decodeToken(token: string): MockTokenPayload {
  try {
    const json = Buffer.from(token, 'base64').toString('utf-8');
    return JSON.parse(json) as MockTokenPayload;
  } catch {
    throw new UnauthorizedException('Invalid token');
  }
}

@Injectable()
export class AuthService {
  login(dto: LoginDto): AuthTokensDto {
    const role = deriveRole(dto.email);
    const token = encodeToken({ email: dto.email, role });
    console.log('token', token);
    return { accessToken: token, refreshToken: `${token}.refresh` };
  }

  getMe(bearerToken: string): UserProfileDto {
    const payload = decodeToken(bearerToken);
    const { firstName, lastName } = namePartsFromEmail(payload.email);
    const idHex = Buffer.from(payload.email).toString('hex').slice(0, 12);
    return {
      id: `mock-${idHex}`,
      email: payload.email,
      firstName,
      lastName,
      role: payload.role,
      avatarUrl: null,
    };
  }

  logout(): void {
    // no-op for mock
  }
}
