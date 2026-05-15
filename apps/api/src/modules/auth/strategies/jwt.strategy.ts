import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload, RequestUser } from '../interfaces/auth.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('auth.jwtSecret'),
      ignoreExpiration: false,
    });
  }

  // Passport already verified signature + expiry — just transform the payload.
  validate(payload: JwtPayload): RequestUser {
    return { userId: payload.sub, roles: payload.roles, isVerified: payload.isVerified };
  }
}
