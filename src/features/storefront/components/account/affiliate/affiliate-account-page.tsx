"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Plus } from "lucide-react";
import { AffiliateApprovalStatus } from "@/types";
import { storefrontAffiliateApprovalService } from "@/lib/api/services/storefront/extensions/affiliate/client/affiliate-approval-client";
import { toast } from "sonner";
import { AffiliateLinkForm } from "./affiliate-link-form";
import type { AffiliateApproval, AffiliateLink } from "@/types";
import { CreateAffiliateLinkRequest } from "@/lib/api/types";
import { storefrontAffiliateLinkService } from "@/lib/api/services/storefront/extensions/affiliate/client/affiliate-link-client";
import AffiliateLinksTable from "./affiliate-links-table";
import { useRouter } from "next/navigation";

export default function AffiliateAccountPage({approval, links}: {approval: AffiliateApproval, links: AffiliateLink[]}) {
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<AffiliateLink | null>(null);
  const router = useRouter();
  const getStatusConfig = (status: AffiliateApprovalStatus) => {
    switch (status) {
      case AffiliateApprovalStatus.APPROVED:
        return {
          label: "Đã duyệt",
          variant: "default" as const,
          icon: CheckCircle,
          description: "Bạn đã được duyệt làm affiliate. Bạn có thể tạo và quản lý affiliate links.",
        };
      case AffiliateApprovalStatus.PENDING:
        return {
          label: "Chờ duyệt",
          variant: "secondary" as const,
          icon: Clock,
          description: "Yêu cầu của bạn đang được xem xét. Vui lòng chờ phản hồi từ quản trị viên.",
        };
      case AffiliateApprovalStatus.REJECTED:
        return {
          label: "Từ chối",
          variant: "destructive" as const,
          icon: XCircle,
          description: "Yêu cầu của bạn đã bị từ chối. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.",
        };
      default:
        return {
          label: "Chưa đăng ký",
          variant: "outline" as const,
          icon: Clock,
          description: "Bạn chưa đăng ký làm affiliate. Vui lòng đăng ký để bắt đầu.",
        };
    }
  };

  const statusConfig = approval ? getStatusConfig(approval.status) : getStatusConfig(null as any);
  const Icon = statusConfig.icon;
  const canManageLinks = approval?.status === AffiliateApprovalStatus.APPROVED;

  const handleCreateAffiliateApproval = async () => {
    try {
      await storefrontAffiliateApprovalService.createAffiliateApproval();
      toast.success("Yêu cầu đăng ký affiliate đã được gửi. Vui lòng chờ phản hồi từ quản trị viên.");
    } catch (error) {
      toast.error("Yêu cầu đăng ký affiliate thất bại");
      console.error("Error creating affiliate approval:", error);
    }
  };  

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Affiliate</h1>
        <p className="text-muted-foreground">
          Quản lý tài khoản affiliate của bạn
        </p>
      </div>

      {/* Approval Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái duyệt</CardTitle>
          <CardDescription>Thông tin về trạng thái đăng ký affiliate của bạn</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                  <Icon className="h-3 w-3" />
                  {statusConfig.label}
                </Badge>
                {approval && (
                  <span className="text-sm text-muted-foreground">
                    Ngày tạo: {new Date(approval.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{statusConfig.description}</p>
              {approval?.reason && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-1">Lý do:</p>
                  <p className="text-sm text-muted-foreground">{approval.reason}</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Affiliate Links Section */}
      {canManageLinks && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Affiliate Links</CardTitle>
                <CardDescription>
                  Tạo và quản lý các affiliate links của bạn
                </CardDescription>
              </div>
              {!showForm && (
                <Button onClick={() => {
                  setEditingLink(null);
                  setShowForm(true);
                }}>
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
                    {editingLink ? "Chỉnh sửa affiliate link" : "Tạo affiliate link mới"}
                  </h3>
                  <Button variant="outline" onClick={() => {
                    setShowForm(false);
                    setEditingLink(null);
                  }}>
                    Quay lại
                  </Button>
                </div>
                <AffiliateLinkForm
                  link={editingLink || undefined}
                  onSubmit={async (data: CreateAffiliateLinkRequest) => {
                    try {
                      if (editingLink) {
                        await storefrontAffiliateLinkService.updateAffiliateLink(editingLink.id, data);
                        toast.success("Cập nhật affiliate link thành công");
                      } else {
                        await storefrontAffiliateLinkService.createAffiliateLink(data);
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
                links={links}
                onEdit={(link) => {
                  setEditingLink(link);
                  setShowForm(true);
                }}
              />
            )}
          </CardContent>
        </Card>
      )}

      {!canManageLinks && approval?.status === AffiliateApprovalStatus.PENDING && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Vui lòng chờ quản trị viên duyệt yêu cầu của bạn để có thể tạo affiliate links.
            </p>
          </CardContent>
        </Card>
      )}

      {!approval && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Hãy đăng ký để bắt đầu kiếm hoa hồng.
              </p>
              <Button variant="default" onClick={handleCreateAffiliateApproval}>
                <Plus className="mr-2 h-4 w-4" />
                Đăng ký ngay
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

