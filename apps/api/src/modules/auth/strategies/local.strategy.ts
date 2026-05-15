import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import { AUTH_REPOSITORY } from '../interfaces/auth.interfaces';
import type { IAuthRepository, ValidatedUser } from '../interfaces/auth.interfaces';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(@Inject(AUTH_REPOSITORY) private readonly repo: IAuthRepository) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<ValidatedUser> {
    const identity = await this.repo.findLocalIdentity(email.toLowerCase());
    if (!identity) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, identity.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return this.repo.getValidatedUser(identity.userId);
  }
}
