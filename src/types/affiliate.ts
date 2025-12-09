// Affiliate Approval
export enum AffiliateApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum AffiliateTransactionType {
  COMMISSION = "COMMISSION",
  WITHDRAWAL = "WITHDRAWAL",
  ADJUSTMENT = "ADJUSTMENT",
}

// Affiliate User Account
export interface AffiliateUserAccount {
  id: number;
  code: string;
  commissionRate: number;
  userId: number;
  clerkId: string;
  email: string;
  fullName: string;
  userName: string;
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

// Affiliate Payout Method
export interface AffiliatePayoutMethod {
  id: number;
  affiliate: AffiliateUserAccount;
  type: "BANK";
  displayName: string;
  identifier: string;
  bankName: string;
  accountHolder: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
  }

// Affiliate Withdrawal
export interface AffiliateWithdrawal {
  id: number;
  affiliate: AffiliateUserAccount;
  amount: number;
  status: AffiliateApprovalStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Affiliate Account
export interface AffiliateAccount {
  id: number;
  affiliateId: number;
  balance: number;
  affiliate: AffiliateUserAccount;
}

// Affiliate Transaction
export interface AffiliateTransaction {
  id: number;
  affiliate: AffiliateUserAccount;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  type: AffiliateTransactionType;
  orderId: number;
  withdrawalRequestId: number;
  createdAt: Date;
}