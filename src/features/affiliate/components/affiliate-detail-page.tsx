import { AffiliateAccount } from "@/types";
import AffiliateTransaction from "./affiliate-detail/affiliate-transaction";
import AffiliateWithdrawal from "./affiliate-detail/affiliate-withdrawal";

export default function AffiliateDetailPage({ affiliate }: { affiliate: AffiliateAccount }) {
    return (
        <div>
            <h1>Đại lý/CTV #{affiliate.id}</h1>
            <p>Số dư: {affiliate.balance}</p>
            <p>Người dùng: {affiliate.affiliate.fullName}</p>
            <AffiliateTransaction affiliateId={affiliate.id} />
            <AffiliateWithdrawal affiliateId={affiliate.id} />
        </div>
    )
}