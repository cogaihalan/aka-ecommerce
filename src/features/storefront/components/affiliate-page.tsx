import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Gift,
  TrendingUp,
  Headphones,
  DollarSign,
  BarChart3,
  Star,
  Megaphone,
  Sparkles,
} from "lucide-react";

export default function AffiliatePage() {
  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold">
            Chào mừng đến với
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold text-primary">
            AKA Affiliate
          </h2>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Bắt đầu kiếm tiền bằng việc giới thiệu chúng tôi đến với mạng lưới
          của bạn. Một sự hợp tác tuyệt vời chỉ một cú nhấp chuột. Hãy tham gia
          AKA Affiliate ngay bây giờ.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/auth/sign-up">Tham gia ngay</Link>
        </Button>
      </section>

      {/* Features Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Đặc điểm nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Gift className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Sản Phẩm Độc Quyền</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Đối tác của chúng tôi có cơ hội quảng bá những sản phẩm độc đáo
                và chất lượng cao, giúp tăng khả năng chuyển đổi và hài lòng
                khách hàng.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Hoa Hồng Hấp Dẫn</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Chúng tôi cam kết cung cấp hoa hồng cao và công bằng cho các đối
                tác của chúng tôi. Khi bạn thành công, chúng tôi cũng thành
                công.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Headphones className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Hỗ Trợ Tận Tâm</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Chúng tôi cam kết hỗ trợ mọi đối tác của mình. Bạn sẽ có sẵn tất
                cả các công cụ cần thiết để quảng bá sản phẩm một cách hiệu quả
                nhất.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-muted/50 rounded-lg p-8 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Vì sao lựa chọn chúng tôi</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Ở đây, chúng tôi hiểu rằng sự hợp tác là chìa khóa để thành công.
            Chương trình affiliate của chúng tôi không chỉ là một cơ hội kiếm
            lợi nhuận mà còn là một cơ hội để xây dựng mối quan hệ lâu dài và
            phát triển cùng nhau.
          </p>
        </div>
        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/auth/sign-up">Tham gia ngay</Link>
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Lợi ích cho đối tác</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Chương trình Affiliate của chúng tôi không chỉ là một cơ hội kiếm
            lợi nhuận, mà còn là một hành trình đưa bạn đến sự thành công. Hãy
            tham gia ngay để trải nghiệm những lợi ích này và xây dựng tương
            lai tài chính của bạn ngày hôm nay!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <DollarSign className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Kiếm Lợi Nhuận Không Giới Hạn</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Với mức hoa hồng hấp dẫn, bạn có thể kiếm lợi nhuận không giới
                hạn từ mỗi giao dịch thành công
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Hệ thống theo dõi hiệu quả</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Sử dụng hệ thống theo dõi tiên tiến để theo dõi mọi giao dịch
                của bạn. Điều này giúp bạn hiểu rõ hơn về hiệu suất của chiến
                lược tiếp thị và làm thế nào để tối ưu hóa nó.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Star className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Sản phẩm/Dịch vụ chất lượng</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Chúng tôi cam kết cung cấp sản phẩm/dịch vụ chất lượng cao, giúp
                tăng độ tin cậy và hỗ trợ của bạn từ đối tác và khách hàng.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Megaphone className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Quảng bá đặc quyền và khuyến mãi</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Được thông báo sớm về các chương trình khuyến mãi, quảng bá đặc
                quyền và sự kiện đặc biệt. Bạn sẽ có cơ hội đặc quyền để tham
                gia và tận hưởng những lợi ích độc đáo.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Revenue Sharing Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 space-y-6">
        <div className="text-center space-y-4">
          <Sparkles className="h-12 w-12 text-primary mx-auto" />
          <h2 className="text-3xl font-bold">
            Chia sẻ doanh thu - hoa hồng lên đến 30%
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Trong hệ thống chia sẻ doanh thu, bạn kiếm được phần trăm doanh thu
            được tạo ra bởi những người dùng mà bạn giới thiệu đến AKA
          </p>
        </div>
        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/auth/sign-up">Tham gia ngay</Link>
          </Button>
        </div>
      </section>

      {/* 5 Steps Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">
            Kiếm tiền trong 5 bước đơn giản
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-primary text-white w-12 h-12 flex items-center justify-center text-xl font-bold">
                  1
                </div>
              </div>
              <CardTitle className="text-lg">Tạo nội dung</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                FB, youtube, instagram. Tạo nội dung chia sẻ về sản phẩm
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-primary text-white w-12 h-12 flex items-center justify-center text-xl font-bold">
                  2
                </div>
              </div>
              <CardTitle className="text-lg">Đính kèm link</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Đính kèm link Affiliate trong nội dung bạn chia sẻ
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-primary text-white w-12 h-12 flex items-center justify-center text-xl font-bold">
                  3
                </div>
              </div>
              <CardTitle className="text-lg">Khách click</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Khách hàng click vào link Affiliate
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-primary text-white w-12 h-12 flex items-center justify-center text-xl font-bold">
                  4
                </div>
              </div>
              <CardTitle className="text-lg">Đặt hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Khách hàng đặt hàng thành công và hoàn thành thanh toán
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-primary text-white w-12 h-12 flex items-center justify-center text-xl font-bold">
                  5
                </div>
              </div>
              <CardTitle className="text-lg">Nhận hoa hồng</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Nhận hoa hồng và ăn mừng thôi
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Affiliate Policy Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">
            Chính sách Affiliate của chúng tôi
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Chính sách quảng cáo chung:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                1. Nghiêm cấm vi phạm SEM brandname
              </h3>
              <p className="text-muted-foreground">
                (Hành vi chạy từ khóa thương hiệu hoặc sử dụng từ khóa cố tình
                viết sai thương hiệu để gây nhầm lẫn)
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>
                  Quảng cáo "Brand Key" trên các công cụ tìm kiếm (Google
                  Adwords, Cốc Cốc…)
                </li>
                <li>
                  Hoặc sử dụng các dạng biến thể Brand hoặc các từ khóa có chứa
                  brand
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                2. Nghiêm cấm spam data người dùng, spam lead rác
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>
                  Nghiêm cấm các hành vi spam data rác, dữ liệu người dùng và
                  điền thông tin khi không được sự cho phép hoặc đồng ý từ người
                  dùng
                </li>
                <li>
                  Định nghĩa: Lead rác: sai số, sai thông tin, thuê bao, Khách
                  nói ngay là không có nhu cầu, không để lại thông tin
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                3. Nghiêm cấm cố tình gian lận làm giả thông tin người dùng
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>
                  Nghiêm cấm publisher tự đặt hàng rồi hoàn trả, mạo danh
                  Advertiser lừa đảo thông tin người dùng hoặc các hành vi gian
                  lận khác.
                </li>
                <li>
                  Nghiêm cấm các hành vi làm giả dữ liệu người dùng, tạo các dữ
                  liệu ảo và cấu kết với người dùng để thực hiện các hành vi vi
                  phạm.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                4. Nghiêm cấm quảng cáo trên các kênh của Nhà cung cấp, đối thủ
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>
                  Sử dụng link affiliate hoặc các thông tin của Nhà cung cấp
                  (advertiser) để thực hiện việc quảng cáo trên các diễn đàn,
                  group, cộng đồng, Facebook của các Nhà cung cấp đối thủ.
                </li>
                <li>
                  Sử dụng link affiliate, đăng thông tin website thông qua hình
                  thức bình luận, đánh giá trên các kênh chính thức của Nhà cung
                  cấp như bình luận bài viết, đánh giá ứng dụng/app hoặc các
                  kênh tương tự của đối thủ.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                5. Nghiêm cấm reseller
              </h3>
              <p className="text-muted-foreground">
                Là hoạt động đầu cơ tích trữ, mua đi bán lại các sản phẩm của
                nhà cung cấp nhằm thu lợi bất chính.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                6. Nghiêm cấm hành vi tạo ra lượng truy cập ảo
              </h3>
              <p className="text-muted-foreground">
                Nghiêm cấm hành vi tạo ra lượng truy cập (impression, click,
                data) ảo đối với các chương trình của nhà quảng cáo.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                7. Nghiêm cấm hành vi cố tình gây hiểu nhầm là nhà quảng cáo
              </h3>
              <p className="text-muted-foreground">
                (lập fanpage, website, group,... gây hiểu nhầm là nhà cung cấp)
              </p>
              <p className="text-sm text-muted-foreground">
                VD: Dùng tên thương hiệu, viết sai, viết tắt tên thương hiệu của
                nhà cung cấp, sử dụng logo của nhà cung cấp.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                8. Nghiêm cấm cung cấp các thông tin sai lệch
              </h3>
              <p className="text-muted-foreground">
                Cố tình viết thiếu, viết ấn dụ, nói quá các chương trình của nhà
                cung cấp nhằm thu hút khách hàng.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                9. Nghiêm cấm quảng cáo trên các trang có nội dung độc hại
              </h3>
              <p className="text-muted-foreground">
                Nghiêm cấm quảng cáo thông tin trên các trang có nội dung độc
                hại, vi phạm đạo đức và vi phạm pháp luật, group cấm gây thiệt
                hại đến nhà cung cấp
              </p>
              <p className="text-sm text-muted-foreground">
                VD: Quảng cáo trong các group bùng tiền của chiến dịch tài
                chính, quảng cáo trên các trang cấm.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                10. Nghiêm cấm Nhân viên/Cộng tác viên lợi dụng chiến dịch
              </h3>
              <p className="text-muted-foreground">
                Nghiêm cấm Nhân viên/Cộng tác viên đang làm tại Nhãn hàng hoặc
                các đối tác liên quan lợi dụng chiến dịch Affiliate của Nhãn
                hàng để trục lợi cá nhân, gây thiệt hại tới Nhãn hàng
              </p>
              <p className="text-sm text-muted-foreground">
                VD: Nhân viên/Cộng tác viên lấy đơn hàng từ khách xuất phát từ
                cửa hàng/web online của Nhãn Hàng, lên đơn hàng dưới nguồn
                Publisher để nhận tiền hoa hồng từ Nhãn hàng.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/auth/sign-up">Tham gia ngay</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

