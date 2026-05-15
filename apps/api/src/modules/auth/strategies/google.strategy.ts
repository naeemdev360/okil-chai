import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Role } from '@repo/shared';
import type { Request } from 'express';
import { Profile, Strategy } from 'passport-google-oauth20';
import type { IAuthRepository, ValidatedUser } from '../interfaces/auth.interfaces';
import { AUTH_REPOSITORY } from '../interfaces/auth.interfaces';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    @Inject(AUTH_REPOSITORY) private readonly repo: IAuthRepository,
  ) {
    super({
      clientID: configService.getOrThrow<string>('auth.googleClientId'),
      clientSecret: configService.getOrThrow<string>('auth.googleClientSecret'),
      callbackURL: configService.getOrThrow<string>('auth.googleCallbackUrl'),
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<ValidatedUser> {
    // role intent is carried through the OAuth state parameter (set by GoogleAuthGuard)
    const intentRole = req.query['state'] === Role.LAWYER ? Role.LAWYER : Role.CLIENT;
    const email = profile.emails?.[0]?.value ?? '';
    const parts = (profile.displayName ?? '').trim().split(/\s+/);
    const firstName = profile.name?.givenName ?? parts[0] ?? '';
    const lastName = profile.name?.familyName ?? parts.slice(1).join(' ') ?? '';
    const avatarUrl = profile.photos?.[0]?.value ?? null;

    return this.repo.findOrCreateGoogleUser({
      googleSub: profile.id,
      email,
      firstName,
      lastName,
      avatarUrl,
      intentRole,
    });
  }
}
