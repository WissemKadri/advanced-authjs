import { User as UserModel, UserRole } from '@prisma/client';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends UserModel {}

  interface Session {
    user: {
      role: UserRole;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
    } & Pick<User, 'id' | 'name' | 'email' | 'image'>; // Using User instead of DefaultSession['user'] to avoid the transformation to unknown
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  }
}
