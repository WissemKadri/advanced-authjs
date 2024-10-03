import { UserRole } from '@prisma/client';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().min(1, 'Email is required').email(),
  password: z.string().min(1, 'Password is required '),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email(),
  password: z.string().min(6, 'The password must be at least 6 characters'),
});

export const ResetSchema = z.object({
  email: z.string().min(1, 'Email is required').email(),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, 'The password must be at least 6 characters'),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email(),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  isTwoFactorEnabled: z.boolean(),
});

export const UpdatePasswordSchema = z
  .object({
    password: z.string().min(1, 'Password is required '),
    newPassword: z.string().min(6, 'The new password must be at least 6 characters'),
    newPasswordConfirmtion: z
      .string()
      .min(6, 'The new password confirmation must be at least 6 characters'),
  })
  .refine(data => data.newPassword === data.newPasswordConfirmtion, {
    message: "Passwords don't match",
    path: ['newPasswordConfirmtion'],
  });
