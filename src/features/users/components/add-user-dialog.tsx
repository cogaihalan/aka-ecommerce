"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { UserRole, CreateUserPayload } from "@/types/auth";
import { toast } from "sonner";
import { unifiedUserService } from "@/lib/api/services/unified";

export function AddUserDialog() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [createForm, setCreateForm] = useState<CreateUserPayload>({
    email: "",
    firstName: "",
    lastName: "",
    role: UserRole.USER,
  });

  const handleCreateUser = async () => {
    try {
      setActionLoading(true);
      const user = await unifiedUserService.createUser(createForm);

      toast.success("User created successfully");
      setIsCreateDialogOpen(false);
      setCreateForm({
        email: "",
        firstName: "",
        lastName: "",
        role: UserRole.USER,
      });
      // Refresh the page to show the new user
      window.location.reload();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system with appropriate role and permissions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="create-email">Email *</Label>
            <Input
              id="create-email"
              type="email"
              placeholder="user@example.com"
              value={createForm.email}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="create-firstName">First Name</Label>
              <Input
                id="create-firstName"
                placeholder="John"
                value={createForm.firstName}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="create-lastName">Last Name</Label>
              <Input
                id="create-lastName"
                placeholder="Doe"
                value={createForm.lastName}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="create-role">Role *</Label>
            <Select
              value={createForm.role}
              onValueChange={(value) =>
                setCreateForm((prev) => ({ ...prev, role: value as UserRole }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.USER}>User</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full"
            onClick={handleCreateUser}
            disabled={!createForm.email || !createForm.role || actionLoading}
          >
            {actionLoading ? "Creating..." : "Create User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
