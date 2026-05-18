import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthProvider, AuthTokenType, Role } from '@repo/shared';
import * as crypto from 'crypto';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { DATABASE_TOKEN, type DatabaseInstance } from '../../database/database.module';
import {
  authTokens,
  lawyerProfiles,
  sessions,
  userIdentities,
  userRoles,
  users,
} from '../../database/schema';
import { BaseRepository, type Tx } from '../../common/utils/base.repository';
import { sha256 } from '../../common/utils/crypto.util';
import { PASSWORD_RESET_EXPIRES_MINUTES } from '../mailer/mail.constants';
import type {
  CreateLocalLawyerInput,
  CreateLocalUserInput,
  GoogleUserPayload,
  IAuthRepository,
  LocalIdentity,
  PasswordResetUserInfo,
  SessionRecord,
  UserEmailInfo,
  ValidatedUser,
} from './interfaces/auth.interfaces';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1_000;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1_000;

const EMAIL_CONFLICT = {
  message: 'Email already registered',
  errorCode: 'EMAIL_ALREADY_REGISTERED',
} as const;


@Injectable()
export class AuthRepository extends BaseRepository implements IAuthRepository {
  constructor(@Inject(DATABASE_TOKEN) db: DatabaseInstance) {
    super(db);
  }

  // Guards against OAuth-only identities that share the same email but have no password.
  async findLocalIdentity(email: string): Promise<LocalIdentity | null> {
    const [row] = await this.db
      .select({ userId: userIdentities.userId, passwordHash: userIdentities.passwordHash })
      .from(userIdentities)
      .where(
        and(
          eq(userIdentities.provider, AuthProvider.LOCAL),
          eq(userIdentities.providerUserId, email),
        ),
      )
      .limit(1);

    return row?.passwordHash ? { userId: row.userId, passwordHash: row.passwordHash } : null;
  }

  async getValidatedUser(userId: string): Promise<ValidatedUser> {
    const [userRow] = await this.db
      .select({ isVerified: users.isVerified })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userRow) throw new UnauthorizedException('User not found');

    const roleRows = await this.db
      .select({ role: userRoles.role })
      .from(userRoles)
      .where(eq(userRoles.userId, userId));

    return {
      userId,
      roles: roleRows.map((r) => r.role as Role),
      isVerified: userRow.isVerified,
    };
  }

  async createLocalUser(input: CreateLocalUserInput): Promise<ValidatedUser> {
    return this.transactionGuarded(async (tx) => {
      const userId = await this.insertUser(tx, {
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
      });
      await this.insertLocalIdentity(tx, userId, input.email, input.passwordHash);
      await tx.insert(userRoles).values({ userId, role: Role.CLIENT });
      return { userId, roles: [Role.CLIENT] as const, isVerified: false };
    }, EMAIL_CONFLICT);
  }

  async createLocalLawyer(input: CreateLocalLawyerInput): Promise<ValidatedUser> {
    return this.transactionGuarded(async (tx) => {
      const userId = await this.insertUser(tx, { email: input.email, firstName: input.firstName, lastName: input.lastName });
      await this.insertLocalIdentity(tx, userId, input.email, input.passwordHash);
      await tx.insert(userRoles).values({ userId, role: Role.LAWYER });
      await tx.insert(lawyerProfiles).values({
        userId,
        firstName: input.firstName,
        lastName: input.lastName,
      });
      return { userId, roles: [Role.LAWYER] as const, isVerified: false };
    }, EMAIL_CONFLICT);
  }

  async findOrCreateGoogleUser(payload: GoogleUserPayload): Promise<ValidatedUser> {
    const userId = await this.transaction(async (tx) => {
      const existingUserId = await this.findGoogleIdentity(tx, payload.googleSub);
      if (existingUserId) return existingUserId;
      return this.resolveOrCreateUser(tx, payload);
    });
    return this.getValidatedUser(userId);
  }

  async createSession(userId: string, refreshTokenHash: string): Promise<void> {
    const expiresAt = new Date(Date.now() + SEVEN_DAYS_MS);
    await this.db.insert(sessions).values({ userId, refreshTokenHash, expiresAt });
  }

  async findActiveSession(refreshTokenHash: string): Promise<SessionRecord | null> {
    const [session] = await this.db
      .select({
        id: sessions.id,
        userId: sessions.userId,
        expiresAt: sessions.expiresAt,
        revokedAt: sessions.revokedAt,
      })
      .from(sessions)
      .where(
        and(
          eq(sessions.refreshTokenHash, refreshTokenHash),
          isNull(sessions.revokedAt),
          gt(sessions.expiresAt, new Date()),
        ),
      )
      .limit(1);

    return session ?? null;
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.id, sessionId));
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(and(eq(sessions.userId, userId), isNull(sessions.revokedAt)));
  }

  async createVerificationToken(userId: string): Promise<string> {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = sha256(rawToken);
    const expiresAt = new Date(Date.now() + TWENTY_FOUR_HOURS_MS);

    await this.db.insert(authTokens).values({
      userId,
      type: AuthTokenType.EMAIL_VERIFICATION,
      tokenHash,
      expiresAt,
    });

    return rawToken;
  }

  async consumeVerificationToken(rawToken: string): Promise<string | null> {
    const tokenHash = sha256(rawToken);
    const now = new Date();

    const [token] = await this.db
      .select({ id: authTokens.id, userId: authTokens.userId })
      .from(authTokens)
      .where(
        and(
          eq(authTokens.tokenHash, tokenHash),
          eq(authTokens.type, AuthTokenType.EMAIL_VERIFICATION),
          isNull(authTokens.usedAt),
          gt(authTokens.expiresAt, now),
        ),
      )
      .limit(1);

    if (!token) return null;

    await this.db
      .update(authTokens)
      .set({ usedAt: now })
      .where(eq(authTokens.id, token.id));

    return token.userId;
  }

  async markUserVerified(userId: string): Promise<void> {
    await this.db.update(users).set({ isVerified: true }).where(eq(users.id, userId));
  }

  async getUserEmailInfo(userId: string): Promise<UserEmailInfo | null> {
    const [user] = await this.db
      .select({ email: users.email, firstName: users.firstName, isVerified: users.isVerified })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) return null;

    const roleRows = await this.db
      .select({ role: userRoles.role })
      .from(userRoles)
      .where(eq(userRoles.userId, userId));

    return {
      email: user.email,
      firstName: user.firstName,
      isVerified: user.isVerified,
      roles: roleRows.map((r) => r.role as Role),
    };
  }

  async findUserForPasswordReset(email: string): Promise<PasswordResetUserInfo | null> {
    const [row] = await this.db
      .select({ userId: users.id, firstName: users.firstName })
      .from(users)
      .innerJoin(
        userIdentities,
        and(
          eq(userIdentities.userId, users.id),
          eq(userIdentities.provider, AuthProvider.LOCAL),
        ),
      )
      .where(eq(users.email, email))
      .limit(1);

    if (!row) return null;

    const roleRows = await this.db
      .select({ role: userRoles.role })
      .from(userRoles)
      .where(eq(userRoles.userId, row.userId));

    return {
      userId: row.userId,
      firstName: row.firstName,
      roles: roleRows.map((r) => r.role as Role),
    };
  }

  async createPasswordResetToken(userId: string): Promise<string> {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = sha256(rawToken);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRES_MINUTES * 60 * 1_000);

    await this.db.insert(authTokens).values({
      userId,
      type: AuthTokenType.PASSWORD_RESET,
      tokenHash,
      expiresAt,
    });

    return rawToken;
  }

  async consumePasswordResetToken(rawToken: string): Promise<string | null> {
    const tokenHash = sha256(rawToken);
    const now = new Date();

    const [token] = await this.db
      .select({ id: authTokens.id, userId: authTokens.userId })
      .from(authTokens)
      .where(
        and(
          eq(authTokens.tokenHash, tokenHash),
          eq(authTokens.type, AuthTokenType.PASSWORD_RESET),
          isNull(authTokens.usedAt),
          gt(authTokens.expiresAt, now),
        ),
      )
      .limit(1);

    if (!token) return null;

    await this.db
      .update(authTokens)
      .set({ usedAt: now })
      .where(eq(authTokens.id, token.id));

    return token.userId;
  }

  async updatePasswordHash(userId: string, passwordHash: string): Promise<void> {
    await this.db
      .update(userIdentities)
      .set({ passwordHash })
      .where(
        and(
          eq(userIdentities.userId, userId),
          eq(userIdentities.provider, AuthProvider.LOCAL),
        ),
      );
  }

  async invalidateVerificationTokens(userId: string): Promise<void> {
    const now = new Date();
    await this.db
      .update(authTokens)
      .set({ usedAt: now })
      .where(
        and(
          eq(authTokens.userId, userId),
          eq(authTokens.type, AuthTokenType.EMAIL_VERIFICATION),
          isNull(authTokens.usedAt),
          gt(authTokens.expiresAt, now),
        ),
      );
  }

  // ── Private transaction helpers ────────────────────────────────────────────

  private async insertUser(
    tx: Tx,
    data: { email: string; firstName: string; lastName: string; avatarUrl?: string | null; isVerified?: boolean },
  ): Promise<string> {
    const [user] = await tx.insert(users).values(data).returning({ id: users.id });
    return user!.id;
  }

  private async insertLocalIdentity(
    tx: Tx,
    userId: string,
    email: string,
    passwordHash: string,
  ): Promise<void> {
    await tx.insert(userIdentities).values({
      userId,
      provider: AuthProvider.LOCAL,
      providerUserId: email,
      passwordHash,
    });
  }

  private async findGoogleIdentity(tx: Tx, googleSub: string): Promise<string | null> {
    const [row] = await tx
      .select({ userId: userIdentities.userId })
      .from(userIdentities)
      .where(
        and(
          eq(userIdentities.provider, AuthProvider.GOOGLE),
          eq(userIdentities.providerUserId, googleSub),
        ),
      )
      .limit(1);
    return row?.userId ?? null;
  }

  private async resolveOrCreateUser(tx: Tx, payload: GoogleUserPayload): Promise<string> {
    const [existing] = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);

    if (existing) {
      await tx.insert(userIdentities).values({
        userId: existing.id,
        provider: AuthProvider.GOOGLE,
        providerUserId: payload.googleSub,
      });
      return existing.id;
    }

    const userId = await this.insertUser(tx, {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      avatarUrl: payload.avatarUrl,
      isVerified: true,
    });

    await tx.insert(userIdentities).values({
      userId,
      provider: AuthProvider.GOOGLE,
      providerUserId: payload.googleSub,
    });
    await tx.insert(userRoles).values({ userId, role: payload.intentRole });

    if (payload.intentRole === Role.LAWYER) {
      await tx.insert(lawyerProfiles).values({
        userId,
        firstName: payload.firstName,
        lastName: payload.lastName,
      });
    }

    return userId;
  }
}
