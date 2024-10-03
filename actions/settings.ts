'use server';

import bcrypt from 'bcryptjs';
import { getUserByEmail, getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { UpdatePasswordSchema, UpdateProfileSchema } from '@/schemas';
import { z } from 'zod';

export const updateProfile = async (values: z.infer<typeof UpdateProfileSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const existingUser = await getUserById(user.id!);

  if (!existingUser) {
    return { error: 'Unauthorized' };
  }

  const validatedFields = UpdateProfileSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { name, email, role, isTwoFactorEnabled } = validatedFields.data;

  if (!user.isOAuth && email !== existingUser.email) {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: 'Email is already in use!' };
    }

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: 'Verification email sent!' };
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      name,
      role,
      ...(!user.isOAuth && {
        isTwoFactorEnabled,
      }),
    },
  });

  // Does not update client
  /*
  update({
    user: {
      name,
      role,
      isTwoFactorEnabled,
    },
  });
  */

  return { success: 'Profile updated!' };
};

export const updatePassword = async (values: z.infer<typeof UpdatePasswordSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  if (user.isOAuth) {
    return { error: 'Bad request!' };
  }

  const existingUser = await getUserById(user.id!);

  if (!existingUser) {
    return { error: 'Unauthorized' };
  }

  const validatedFields = UpdatePasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { password, newPassword, newPasswordConfirmtion } = validatedFields.data;

  const passwordsMatch = await bcrypt.compare(password, existingUser.password!);

  if (!passwordsMatch) {
    return { error: 'Incorrect password!' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return { success: 'Password updated!' };
};
