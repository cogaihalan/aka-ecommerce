"use client";

import { useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuthStore } from "@/stores/auth-store";
import type { User as AppUser, Role } from "@/types/user";

function mapClerkToAppUser(clerkUser: any): AppUser {
  const roleFromMetadata = (clerkUser?.publicMetadata?.role ?? "USER")
    .toString()
    .toUpperCase();

  const role: Role = {
    id: 0,
    code: roleFromMetadata,
    name: roleFromMetadata,
    permissions: [],
  };

  const primaryEmail =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress ??
    "";

  return {
    id: 0,
    clerkId: clerkUser?.id ?? "",
    username: clerkUser?.username ?? clerkUser?.id ?? "",
    email: primaryEmail,
    fullName:
      clerkUser?.fullName ??
      `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim(),
    phoneNumber: clerkUser?.phoneNumbers?.[0]?.phoneNumber ?? "",
    avatarUrl: clerkUser?.imageUrl ?? "",
    enabled: true,
    roles: [role],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "clerk",
    updatedBy: "clerk",
  };
}

export function useAuthSync() {
  const { isSignedIn, user } = useUser();
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  const mapped = useMemo(() => (user ? mapClerkToAppUser(user) : null), [user]);

  useEffect(() => {
    if (isSignedIn && mapped) {
      setUser(mapped);
    } else {
      clearUser();
    }
  }, [isSignedIn, mapped, setUser, clearUser]);

  return { isSignedIn: !!isSignedIn, user: mapped };
}


