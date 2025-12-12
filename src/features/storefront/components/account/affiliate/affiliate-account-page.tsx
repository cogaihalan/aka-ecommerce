"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { AffiliateApprovalStatus, AffiliateAccount } from "@/types";
import type { AffiliateApproval } from "@/types";
import { Price } from "@/components/ui/price";

export default function AffiliateAccountPage({
  approval,
  account,
}: {
  approval: AffiliateApproval;
  account: AffiliateAccount;
}) {
  const getStatusConfig = (status: AffiliateApprovalStatus) => {
    switch (status) {
      case AffiliateApprovalStatus.APPROVED:
        return {
          label: "Đã duyệt",
          variant: "default" as const,
          icon: CheckCircle,
          description:
            "Bạn đã được duyệt làm affiliate. Bạn có thể tạo và quản lý affiliate links.",
        };
      case AffiliateApprovalStatus.PENDING:
        return {
          label: "Chờ duyệt",
          variant: "secondary" as const,
          icon: Clock,
          description:
            "Yêu cầu của bạn đang được xem xét. Vui lòng chờ phản hồi từ quản trị viên.",
        };
      case AffiliateApprovalStatus.REJECTED:
        return {
          label: "Từ chối",
          variant: "destructive" as const,
          icon: XCircle,
          description:
            "Yêu cầu của bạn đã bị từ chối. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.",
        };
      default:
        return {
          label: "Chưa đăng ký",
          variant: "outline" as const,
          icon: Clock,
          description:
            "Bạn chưa đăng ký làm affiliate. Vui lòng đăng ký để bắt đầu.",
        };
    }
  };

  const statusConfig = approval
    ? getStatusConfig(approval.status)
    : getStatusConfig(null as any);
  const Icon = statusConfig.icon;

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
          <CardDescription>
            Thông tin về trạng thái đăng ký affiliate của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge
                variant={statusConfig.variant}
                className="flex items-center gap-1"
              >
                <Icon className="h-3 w-3" />
                {statusConfig.label}
              </Badge>
              {approval && (
                <span className="text-sm text-muted-foreground">
                  Ngày tạo:{" "}
                  {new Date(approval.createdAt).toLocaleDateString("vi-VN")}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {statusConfig.description}
            </p>
            {approval?.reason && (
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium mb-1">Lý do:</p>
                <p className="text-sm text-muted-foreground">
                  {approval.reason}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

       {account && (
        <Card>
          <CardHeader>
            <CardTitle>Tài khoản Affiliate</CardTitle>
            <CardDescription>
              Thông tin về tài khoản affiliate của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3 flex-col">
                <span className="text-sm text-muted-foreground">
                  Người dùng: {account.affiliate.fullName || account.affiliate.userName}
                </span>
                <span className="text-sm text-muted-foreground">
                  Email: {account.affiliate.email}
                </span>
                <span className="text-sm text-muted-foreground">
                  Mã affiliate: {account.affiliate.code}
                </span>
                <span className="text-sm text-muted-foreground">
                  Tỷ lệ hoa hồng: <Price
                    price={account.affiliate.commissionRate}
                    size="base"
                    weight="semibold"
                    showCurrency={true}
                    currency="%"
                    color="primary"
                  />
                </span>
                <span className="text-sm text-muted-foreground">
                  Số dư: <Price
                    price={account.balance}
                    size="base"
                    weight="semibold"
                    showCurrency={true}
                    currency="đ"
                    color="primary"
                  />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
       )}     
    </div>
  );
}
