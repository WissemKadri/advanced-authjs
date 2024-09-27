import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().min(1, 'Email is required').email(),
  password: z.string().min(1, 'Password is required '),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email(),
  password: z.string().min(6, 'The password must be at least 6 characters'),
});
