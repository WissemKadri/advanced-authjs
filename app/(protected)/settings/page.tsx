'use client'

import UpdatePasswordForm from '@/components/auth/update-password-form'
import UpdateProfileForm from '@/components/auth/update-profile-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCurrentUser } from '@/hooks/use-current-user'

export default function SettingsPage() {
  const user = useCurrentUser()

  return (
    <Tabs defaultValue="profile" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="password" disabled={user?.isOAuth}>
          Password
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <UpdateProfileForm />
      </TabsContent>
      <TabsContent value="password">
        <UpdatePasswordForm />
      </TabsContent>
    </Tabs>
  )
}
