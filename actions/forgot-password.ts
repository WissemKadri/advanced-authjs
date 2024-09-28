'use server';

import { getUserByEmail } from '@/data/user';
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';
import { ResetSchema } from '@/schemas';
import { z } from 'zod';

export const forgotPassword = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid email!' };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: 'Email not found!' };
  }

  // TODO: Generate token and send email
  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

  return { success: 'Reset email sent!' };
};
