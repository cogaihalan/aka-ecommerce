import { Metadata } from "next";
import AddressBookPage from "@/features/storefront/components/account/addresses/address-book-page";

export const metadata: Metadata = {
  title: "Address Book - AKA Store",
  description: "Manage your shipping and billing addresses.",
};

export default function AddressBookPageRoute() {
  return <AddressBookPage />;
}
