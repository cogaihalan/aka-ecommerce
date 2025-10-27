"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Address } from "@/types";

interface UseUserAddressesReturn {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  addAddress: (address: Omit<Address, "id">) => Promise<void>;
  updateAddress: (
    id: number,
    address: Partial<Omit<Address, "id">>
  ) => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
  setDefaultAddress: (id: number) => Promise<void>;
}

export function useUserAddresses(): UseUserAddressesReturn {
  const { user, isLoaded } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load addresses from user metadata
  useEffect(() => {
    if (!isLoaded) return;

    try {
      const userAddresses =
        (user?.unsafeMetadata?.addresses as Address[]) || [];
      setAddresses(userAddresses);
      setError(null);
    } catch (err) {
      setError("Failed to load addresses");
      console.error("Error loading addresses:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoaded]);

  const updateUserMetadata = async (newAddresses: Address[]) => {
    if (!user) throw new Error("User not found");

    try {
      // Use unsafeMetadata for storing addresses since publicMetadata is not directly updatable
      const currentMetadata = user.unsafeMetadata || {};
      await user.update({
        unsafeMetadata: {
          ...currentMetadata,
          addresses: newAddresses,
        },
      });
    } catch (err) {
      console.error("Error updating user metadata:", err);
      throw new Error("Failed to update addresses");
    }
  };

  const addAddress = async (address: Omit<Address, "id">): Promise<void> => {
    try {
      setError(null);
      // Ensure isDefault is explicitly false if not provided or undefined
      const newAddress: Address = {
        ...address,
        id: Date.now(), // Simple ID generation
        isDefault: !!address.isDefault, // Convert to boolean
      };

      const updatedAddresses = [...addresses, newAddress];
      await updateUserMetadata(updatedAddresses);
      setAddresses(updatedAddresses);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add address";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateAddress = async (
    id: number,
    address: Partial<Omit<Address, "id">>
  ): Promise<void> => {
    try {
      setError(null);
      const updatedAddresses = addresses.map((addr) =>
        addr.id === id ? { ...addr, ...address } : addr
      );
      await updateUserMetadata(updatedAddresses);
      setAddresses(updatedAddresses);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update address";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteAddress = async (id: number): Promise<void> => {
    try {
      setError(null);
      const updatedAddresses = addresses.filter((addr) => addr.id !== id);
      await updateUserMetadata(updatedAddresses);
      setAddresses(updatedAddresses);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete address";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const setDefaultAddress = async (id: number): Promise<void> => {
    try {
      setError(null);

      // Find the address being set as default to get its type
      const targetAddress = addresses.find((addr) => addr.id === id);
      if (!targetAddress) {
        throw new Error("Address not found");
      }

      // Update addresses: set the target as default for its type, and remove default from others of the same type
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }));

      await updateUserMetadata(updatedAddresses);
      setAddresses(updatedAddresses);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to set default address";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    addresses,
    isLoading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
}
