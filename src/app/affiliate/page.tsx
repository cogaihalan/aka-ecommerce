import { Metadata } from "next";
import AffiliatePage from "@/features/storefront/components/affiliate-page";

export const metadata: Metadata = {
  title: "Chương trình Affiliate - AKA Store",
  description:
    "Tham gia chương trình Affiliate của AKA Store và kiếm hoa hồng lên đến 30%. Giới thiệu sản phẩm chất lượng cao đến mạng lưới của bạn và bắt đầu kiếm tiền ngay hôm nay.",
};

export default function AffiliatePageRoute() {
  return <AffiliatePage />;
}

