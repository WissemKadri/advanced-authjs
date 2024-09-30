import { randomInt, randomUUID as uuidv4 } from 'crypto';
import { db } from './db';

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  await db.verificationToken.deleteMany({
    where: {
      email,
    },
  });

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  await db.passwordResetToken.deleteMany({
    where: {
      email,
    },
  });

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};

export const generateTwoFactorToken = async (email: string) => {
  const token = randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 900 * 1000);

  await db.twoFactorToken.deleteMany({
    where: {
      email,
    },
  });

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};
