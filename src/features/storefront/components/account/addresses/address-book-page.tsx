"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { useUserAddresses } from "@/hooks/use-user-addresses";
import { AddressForm } from "@/features/storefront/components/account/addresses/address-form";
import { Address } from "@/types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AddressBookPage() {
  const {
    addresses,
    isLoading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useUserAddresses();

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDeleteAddress = (address: Address) => {
    setDeletingAddress(address);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, data);
        toast.success("Address updated successfully");
      } else {
        await addAddress(data);
        toast.success("Address added successfully");
      }
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      toast.error("Failed to save address");
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAddress) return;

    try {
      await deleteAddress(deletingAddress.id);
      toast.success("Address deleted successfully");
      setDeletingAddress(null);
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (address: Address) => {
    try {
      await setDefaultAddress(address.id);
      toast.success(`Default address updated`);
    } catch (error) {
      toast.error("Failed to set default address");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Address Book</h1>
            <p className="text-muted-foreground">
              Manage your shipping addresses
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Address Book</h1>
            <p className="text-muted-foreground">
              Manage your shipping addresses
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Error loading addresses: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Address Book</h1>
          <p className="text-muted-foreground">
            Manage your shipping addresses
          </p>
        </div>
        <Button onClick={handleAddAddress}>
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {showForm ? (
        <AddressForm
          address={editingAddress || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No addresses yet
          </h3>
          <p className="text-gray-500 mb-4">
            Add your first address to get started with faster checkout.
          </p>
          <Button onClick={handleAddAddress}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  {address.isDefault && (
                    <Badge variant="default">Default</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{address.recipientName}</p>
                  <p>{address.recipientAddress}</p>
                  <p className="text-gray-600">{address.recipientPhone}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditAddress(address)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDeleteAddress(address)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!deletingAddress}
        onOpenChange={() => setDeletingAddress(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
