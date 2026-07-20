/**
 * Authentication schemas — shared across the admin portal, mobile app, and
 * Supabase Edge Functions so every surface enforces identical auth contracts.
 */
import { z } from 'zod';

/** Minimum password policy. Kept in one place so all flows agree. */
export const PASSWORD_MIN_LENGTH = 8;

const email = z
  .string({ required_error: 'Email is required.' })
  .trim()
  .min(1, 'Email is required.')
  .email('Enter a valid email address.')
  .max(254, 'Email is too long.');

const password = z
  .string({ required_error: 'Password is required.' })
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
  .max(72, 'Password must be 72 characters or fewer.') // bcrypt hard limit
  .regex(/[0-9]/, 'Password must include at least one number.');

/** Sign in with email + password. */
export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required.'),
});
export type SignInInput = z.infer<typeof signInSchema>;

/** Create a new account (owner sign-up / free trial). */
export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.').max(80),
  lastName: z.string().trim().min(1, 'Last name is required.').max(80),
  company: z.string().trim().min(1, 'Company name is required.').max(120),
  email,
  password,
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms and Privacy Policy.' }),
  }),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

/** Request a password-reset email. */
export const resetPasswordRequestSchema = z.object({ email });
export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;

/** Set a new password after following a recovery link. */
export const updatePasswordSchema = z
  .object({
    password,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
