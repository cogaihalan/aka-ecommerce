"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AffiliateLinkForm } from "./affiliate-link-form";
import type { AffiliateApproval, AffiliateLink } from "@/types";
import { CreateAffiliateLinkRequest } from "@/lib/api/types";
import { storefrontAffiliateLinkService } from "@/lib/api/services/storefront/extensions/affiliate/client/affiliate-link-client";
import AffiliateLinksTable from "./affiliate-links-table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AffiliateLinksPageProps {
  approval: AffiliateApproval | undefined;
  initialLinks: AffiliateLink[];
  initialTotalItems: number;
  canManageLinks: boolean;
}

export default function AffiliateLinksPage({
  approval,
  initialLinks,
  initialTotalItems,
  canManageLinks,
}: AffiliateLinksPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<AffiliateLink | null>(null);
  const router = useRouter();

  if (!canManageLinks) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Liên kết Affiliate</h1>
          <p className="text-muted-foreground">
            Quản lý các liên kết affiliate của bạn
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              {approval?.status === "PENDING"
                ? "Vui lòng chờ quản trị viên duyệt yêu cầu của bạn để có thể tạo affiliate links."
                : "Bạn cần được duyệt làm affiliate để có thể tạo và quản lý affiliate links."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Liên kết Affiliate</h1>
        <p className="text-muted-foreground">
          Tạo và quản lý các liên kết affiliate của bạn
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liên kết Affiliate</CardTitle>
              <CardDescription>
                Tạo và quản lý các liên kết affiliate của bạn
              </CardDescription>
            </div>
            {!showForm && (
              <Button
                onClick={() => {
                  setEditingLink(null);
                  setShowForm(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tạo link mới
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">
                  {editingLink
                    ? "Chỉnh sửa affiliate link"
                    : "Tạo affiliate link mới"}
                </h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingLink(null);
                  }}
                >
                  Quay lại
                </Button>
              </div>
              <AffiliateLinkForm
                link={editingLink || undefined}
                onSubmit={async (data: CreateAffiliateLinkRequest) => {
                  try {
                    if (editingLink) {
                      await storefrontAffiliateLinkService.updateAffiliateLink(
                        editingLink.id,
                        data
                      );
                      toast.success("Cập nhật affiliate link thành công");
                    } else {
                      await storefrontAffiliateLinkService.createAffiliateLink(
                        data
                      );
                      toast.success("Tạo affiliate link thành công");
                    }
                    setShowForm(false);
                    setEditingLink(null);
                    router.refresh();
                  } catch (error) {
                    toast.error("Lưu affiliate link thất bại");
                    console.error("Error saving affiliate link:", error);
                  }
                }}
                onCancel={() => {
                  setShowForm(false);
                  setEditingLink(null);
                }}
              />
            </div>
          ) : (
            <AffiliateLinksTable
              links={initialLinks}
              totalItems={initialTotalItems}
              onEdit={(link) => {
                setEditingLink(link);
                setShowForm(true);
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
