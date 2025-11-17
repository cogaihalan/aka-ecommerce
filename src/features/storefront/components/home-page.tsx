import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Truck, Shield, RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";

// Lazy load banner to improve initial page load
const FullWidthBanner = dynamic(
  () => import("@/components/full-width-banner"),
  { 
    ssr: true,
    loading: () => (
      <div className="w-full h-[500px] sm:h-[600px] md:h-[700px] bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
    )
  }
);

export default async function StorefrontHomePage() {
  return (
    <>
      {/* Hero Section - Full Width */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <FullWidthBanner />
      </div>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 lg:py-16">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Truck className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg"> Miễn phí vận chuyển</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Miễn phí vận chuyển trên đơn hàng trên 1,000,000 đ. Giao hàng nhanh chóng và đáng tin cậy
              đến cửa nhà bạn.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg">Thanh toán an toàn</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Thông tin thanh toán của bạn được bảo mật với quá trình thanh toán mã hóa
              để đảm bảo an toàn và bảo mật.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <RotateCcw className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg">Trả hàng dễ dàng</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              30 ngày trả hàng. Không hài lòng? Trả lại để được hoàn trả đầy đủ.
            </CardDescription>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
