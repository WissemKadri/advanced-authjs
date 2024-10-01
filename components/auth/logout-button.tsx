'use client';

import { signOut } from 'next-auth/react';

type LogoutButtonProps = {
  children?: React.ReactNode;
};

const LogoutButton = ({ children }: LogoutButtonProps) => {
  return (
    <span onClick={() => signOut()} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LogoutButton;
