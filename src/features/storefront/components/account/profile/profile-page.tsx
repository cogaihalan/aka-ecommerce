"use client";

import { UserProfile } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralProfileForm } from "./general-profile-form";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <GeneralProfileForm />
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <UserProfile
            appearance={{
              elements: {
                rootBox: "!w-full",
                cardBox: "!w-full",
                card: "shadow-lg",
              },
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
