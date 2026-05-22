import { z } from 'zod';
import { Role } from '../enums/role.enum.js';

// ── Request schemas (what clients send) ───────────────────────────────────────

export const SignUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(60, 'First name is too long'),
  lastName:  z.string().min(1, 'Last name is required').max(60, 'Last name is too long'),
  email:     z.string().email('Enter a valid email address'),
  password:  z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  role:      z.nativeEnum(Role),
});

export const LoginSchema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export const ResetPasswordSchema = z.object({
  token:       z.string().min(1, 'Token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
});

// ── Inferred types ────────────────────────────────────────────────────────────

export type SignUpRequest       = z.infer<typeof SignUpSchema>;
export type LoginRequest        = z.infer<typeof LoginSchema>;
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordRequest  = z.infer<typeof ResetPasswordSchema>;
