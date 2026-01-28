import dynamic from "next/dynamic";
import BrandValueSection from "./homepage/brand/brand-value-section";

// Lazy load banner to improve initial page load
const FullWidthBanner = dynamic(
  () => import("@/components/full-width-banner"),
  {
    ssr: true,
    loading: () => (
      <div className="w-full h-[500px] sm:h-[600px] md:h-[700px] bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
    ),
  },
);

export default async function StorefrontHomePage() {
  return (
    <>
      {/* Hero Section - Full Width */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <FullWidthBanner />
      </div>
      <BrandValueSection />
    </>
  );
}
