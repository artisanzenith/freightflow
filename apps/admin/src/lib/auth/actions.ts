'use server';

import { redirect } from 'next/navigation';
import {
  resetPasswordRequestSchema,
  signInSchema,
  signUpSchema,
  updatePasswordSchema,
} from '@freightflow/validation';

import { createClient } from '@/lib/supabase/server';
import { siteUrl } from '@/lib/env';

/**
 * Shape returned by every auth action for use with React's `useActionState`.
 * `fieldErrors` maps a form field name to its first validation message;
 * `formError` is a top-level error (e.g. bad credentials); `message` is a
 * success/info note (e.g. "check your email").
 */
export interface AuthFormState {
  ok: boolean;
  formError?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
}

/** Collapse a ZodError's issues into a flat field → message map. */
function toFieldErrors(issues: { path: (string | number)[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

/** Only allow same-origin relative paths as post-login redirect targets. */
function safeRedirectTarget(value: FormDataEntryValue | null): string {
  if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) {
    return value;
  }
  return '/app';
}

// --- Sign up ----------------------------------------------------------------

export async function signUp(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    company: formData.get('company'),
    email: formData.get('email'),
    password: formData.get('password'),
    acceptTerms: formData.get('acceptTerms') === 'on' || formData.get('acceptTerms') === 'true',
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error.issues) };
  }

  const { firstName, lastName, company, email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/app`,
      data: {
        full_name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        company_name: company,
        role: 'owner',
      },
    },
  });

  if (error) {
    return { ok: false, formError: error.message };
  }

  // When email confirmation is enabled, no session is returned and the user
  // must verify. When it's disabled, a session exists and we can proceed.
  if (data.session) {
    redirect('/app');
  }

  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

// --- Sign in ----------------------------------------------------------------

export async function signIn(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error.issues) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    // Avoid leaking which factor was wrong.
    return { ok: false, formError: 'Invalid email or password.' };
  }

  redirect(safeRedirectTarget(formData.get('redirectTo')));
}

// --- Sign out ---------------------------------------------------------------

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

// --- Request password reset -------------------------------------------------

export async function requestPasswordReset(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = resetPasswordRequestSchema.safeParse({
    email: formData.get('email'),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error.issues) };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/update-password`,
  });

  // Always report success to avoid disclosing whether an account exists.
  return {
    ok: true,
    message: 'If an account exists for that email, a reset link is on its way.',
  };
}

// --- Update password (after recovery link) ----------------------------------

export async function updatePassword(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error.issues) };
  }

  const supabase = await createClient();

  // The recovery session must already be established (via /auth/callback).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      formError: 'Your reset link has expired. Please request a new one.',
    };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { ok: false, formError: error.message };
  }

  redirect('/app');
}
