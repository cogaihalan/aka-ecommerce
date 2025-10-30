"use client";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import Logo from "@/components/logo";
import Newsletter from "@/components/newsletter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const footerLinks = {
  shop: [
    { key: "Sản phẩm", href: "/products" },
    { key: "Danh mục", href: "/categories" },
    { key: "Kiểu tóc", href: "/hairstyles" },
    { key: "Khoá học", href: "/courses" },
    { key: "Cuộc thi", href: "/contests" },
    { key: "Bài dự thi", href: "/submissions" },
    { key: "Hàng mới về", href: "/products?filter=new" },
    { key: "Bán chạy", href: "/products?filter=bestsellers" },
  ],
  support: [
    { key: "Trung tâm trợ giúp", href: "/help" },
    { key: "Liên hệ", href: "/contact" },
    { key: "Thông tin vận chuyển", href: "/help/shipping" },
    { key: "Đổi trả", href: "/help/returns" },
  ],
  company: [
    { key: "Về chúng tôi", href: "/about" },
    { key: "Tuyển dụng", href: "/about/careers" },
    { key: "Báo chí", href: "/about/press" },
    { key: "Phát triển bền vững", href: "/about/sustainability" },
  ],
  legal: [
    { key: "Chính sách bảo mật", href: "/legal/privacy" },
    { key: "Điều khoản dịch vụ", href: "/legal/terms" },
    { key: "Chính sách cookie", href: "/legal/cookies" },
    { key: "Khả năng tiếp cận", href: "/legal/accessibility" },
  ],
};

export default function StorefrontFooter() {
  return (
    <>
      <Newsletter />
      <footer className="bg-muted/50 border-t">
        <div className="px-4 py-12">
          <div className="mb-8">
            <Logo size="lg" href="/" />
            <p className="text-sm text-muted-foreground mb-4">
              Trải nghiệm mua sắm cao cấp với sản phẩm chất lượng và dịch vụ
              xuất sắc.
            </p>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@akastore.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+84 555 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 Đường Thương Mại, Thành phố, Tỉnh 12345</span>
              </div>
            </div>
          </div>

          <Accordion
            type="multiple"
            className="w-full grid grid-cols-1 md:grid-cols-4 md:gap-8"
            defaultValue={["shop", "support", "company", "legal"]}
          >
            <AccordionItem value="shop" className="md:border-0">
              <AccordionTrigger className="text-left md:pointer-events-none md:cursor-default md:[&>svg]:hidden">
                <span className="font-semibold">Mua sắm</span>
              </AccordionTrigger>
              <AccordionContent className="md:pb-0">
                <ul className="space-y-2">
                  {footerLinks.shop.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.key}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="support" className="md:border-0">
              <AccordionTrigger className="text-left md:pointer-events-none md:cursor-default md:[&>svg]:hidden">
                <span className="font-semibold">Hỗ trợ</span>
              </AccordionTrigger>
              <AccordionContent className="md:pb-0">
                <ul className="space-y-2">
                  {footerLinks.support.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.key}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="company" className="md:border-0">
              <AccordionTrigger className="text-left md:pointer-events-none md:cursor-default md:[&>svg]:hidden">
                <span className="font-semibold">Công ty</span>
              </AccordionTrigger>
              <AccordionContent className="md:pb-0">
                <ul className="space-y-2">
                  {footerLinks.company.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.key}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="legal" className="md:border-0">
              <AccordionTrigger className="text-left md:pointer-events-none md:cursor-default md:[&>svg]:hidden">
                <span className="font-semibold">Pháp lý</span>
              </AccordionTrigger>
              <AccordionContent className="md:pb-0">
                <ul className="space-y-2">
                  {footerLinks.legal.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.key}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {`© ${new Date().getFullYear()} AKA Store. Bảo lưu mọi quyền.`}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
