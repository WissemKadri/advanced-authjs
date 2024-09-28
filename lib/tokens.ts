import { randomUUID as uuidv4 } from 'crypto';
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
