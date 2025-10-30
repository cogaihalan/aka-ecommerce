"use client";

import { UserProfile } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralProfileForm } from "./general-profile-form";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Cài đặt hồ sơ</h1>
        <p className="text-muted-foreground">
          Quản lý cài đặt tài khoản và thích ứng.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
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
