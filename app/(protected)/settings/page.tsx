'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export default function SettingsPage() {
  return (
    <div className="bg-white p-10 rounded-xl">
      <Button type="submit" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
}
