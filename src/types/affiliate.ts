// Affiliate Approval
export enum AffiliateApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface AffiliateApproval {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  id: number;
  response: {
    id: number;
    username: string;
    clerkId: string;
    fullName: string;
  };
  status: AffiliateApprovalStatus;
  reason: string;
}

// Affiliate Links
export interface AffiliateLink {
    id: number;
    name: string;
    code: string;
    targetUrl: string;
    campaignName: string;
    activeByAffiliate: boolean;
    activeByAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}