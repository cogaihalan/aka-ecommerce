"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AffiliateApproval, AffiliateApprovalStatus } from "@/types";
import { CheckCircle, MoreVertical, XCircle } from "lucide-react";
import { useState } from "react";
import { unifiedAffiliateApprovalService } from "@/lib/api/services/unified";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { sendAffiliateApprovalEmail } from "@/lib/email/helpers";
import { RejectModal } from "./reject-modal";

interface CellActionProps {
  data: AffiliateApproval;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleApprove = async () => {
    if (data.status === AffiliateApprovalStatus.APPROVED) {
      toast.info("Yêu cầu affiliate đã được duyệt trước đó");
      return;
    }

    setIsLoading(true);
    try {
      await unifiedAffiliateApprovalService.approveAffiliateApproval({
        id: data.id
      });
      await sendAffiliateApprovalEmail(data, AffiliateApprovalStatus.APPROVED);
      
      toast.success("Đã duyệt yêu cầu affiliate");
      router.refresh();
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
      console.error("Error updating affiliate approval:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (data.status === AffiliateApprovalStatus.REJECTED) {
      toast.info("Yêu cầu affiliate đã bị từ chối trước đó");
      return;
    }

    setIsLoading(true);
    try {
      await unifiedAffiliateApprovalService.rejectAffiliateApproval({
        id: data.id,
        reason: reason
      });
      await sendAffiliateApprovalEmail(data, AffiliateApprovalStatus.REJECTED, reason);
      
      toast.success("Đã từ chối yêu cầu affiliate");
      router.refresh();
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
      console.error("Error rejecting affiliate approval:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
            <span className="sr-only">Mở menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
              disabled={data.status !== AffiliateApprovalStatus.PENDING}
              onClick={() => handleApprove()}
              className="cursor-pointer"
          >
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Duyệt
          </DropdownMenuItem>
          <DropdownMenuItem
              disabled={data.status !== AffiliateApprovalStatus.PENDING}
              onClick={() => setIsRejectModalOpen(true)}
              className="cursor-pointer"
          >
              <XCircle className="mr-2 h-4 w-4 text-red-600" />
              Từ chối
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleReject}
        isLoading={isLoading}
      />
    </>
  );
};

