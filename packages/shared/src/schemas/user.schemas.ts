import { z } from 'zod';
import { Role } from '../enums/role.enum.js';

// ── Shared fragments ──────────────────────────────────────────────────────────

const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// ── Response schemas (what clients receive) ───────────────────────────────────

/** Full profile — returned by GET /users/me */
export const UserProfileSchema = BaseEntitySchema.extend({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().url().nullable(),
  phone: z.string().nullable(),
  preferredLanguage: z.string(),
  isVerified: z.boolean(),
  isActive: z.boolean(),
  roles: z.array(z.nativeEnum(Role)),
});

/** Lightweight row — used in admin list views */
export const UserListItemSchema = BaseEntitySchema.extend({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().url().nullable(),
  isVerified: z.boolean(),
  isActive: z.boolean(),
  roles: z.array(z.nativeEnum(Role)),
});

// ── Request schemas (what clients send) ───────────────────────────────────────

/** PATCH /users/me — update own profile fields */
export const UpdateUserProfileSchema = z.object({
  firstName: z.string().min(1).max(60).optional(),
  lastName: z.string().min(1).max(60).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  phone: z.string().min(7).max(20).nullable().optional(),
  preferredLanguage: z.enum(['en', 'bn']).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

/** PATCH /users/me/email — change own email (requires password confirmation) */
export const UpdateUserEmailSchema = z.object({
  newEmail: z.string().email(),
  currentPassword: z.string().min(1),
});

/** DELETE /admin/users/:id — soft-delete a user account */
export const DeactivateUserSchema = z.object({
  reason: z.string().min(1).max(500).optional(),
});

// ── Inferred types ────────────────────────────────────────────────────────────

export type UserProfileResponse = z.infer<typeof UserProfileSchema>;
export type UserListItemResponse = z.infer<typeof UserListItemSchema>;
export type UpdateUserProfileRequest = z.infer<typeof UpdateUserProfileSchema>;
export type UpdateUserEmailRequest = z.infer<typeof UpdateUserEmailSchema>;
export type DeactivateUserRequest = z.infer<typeof DeactivateUserSchema>;
