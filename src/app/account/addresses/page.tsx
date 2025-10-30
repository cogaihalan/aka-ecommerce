import { Metadata } from "next";
import AddressBookPage from "@/features/storefront/components/account/addresses/address-book-page";

export const metadata: Metadata = {
  title: "Sổ địa chỉ - AKA Store",
  description: "Quản lý địa chỉ giao hàng và thanh toán của bạn.",
};

export default function AddressBookPageRoute() {
  return <AddressBookPage />;
}
