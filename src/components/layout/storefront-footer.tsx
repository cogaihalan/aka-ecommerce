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
import { useI18n } from "@/components/providers/i18n-provider";

const footerLinks = {
  shop: [
    { key: "footer.links.allProducts", href: "/products" },
    { key: "footer.links.categories", href: "/categories" },
    { key: "footer.links.hairstyles", href: "/hairstyles" },
    { key: "footer.links.courses", href: "/courses" },
    { key: "footer.links.contests", href: "/contests" },
    { key: "footer.links.submissions", href: "/submissions" },
    { key: "footer.links.newArrivals", href: "/products?filter=new" },
    { key: "footer.links.bestSellers", href: "/products?filter=bestsellers" },
  ],
  support: [
    { key: "footer.links.helpCenter", href: "/help" },
    { key: "footer.links.contactUs", href: "/contact" },
    { key: "footer.links.shippingInfo", href: "/help/shipping" },
    { key: "footer.links.returns", href: "/help/returns" },
  ],
  company: [
    { key: "footer.links.aboutUs", href: "/about" },
    { key: "footer.links.careers", href: "/about/careers" },
    { key: "footer.links.press", href: "/about/press" },
    { key: "footer.links.sustainability", href: "/about/sustainability" },
  ],
  legal: [
    { key: "footer.links.privacyPolicy", href: "/legal/privacy" },
    { key: "footer.links.termsOfService", href: "/legal/terms" },
    { key: "footer.links.cookiePolicy", href: "/legal/cookies" },
    { key: "footer.links.accessibility", href: "/legal/accessibility" },
  ],
};

export default function StorefrontFooter() {
  const { t } = useI18n();
  return (
    <>
      <Newsletter />
      <footer className="bg-muted/50 border-t">
        <div className="px-4 py-12">
          {/* Brand Section - Always visible */}
          <div className="mb-8">
            <Logo size="lg" href="/" />
            <p className="text-sm text-muted-foreground mb-4">
              {t("common.brandTagline")}
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{t("common.supportEmail")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{t("common.supportPhone")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{t("common.supportAddress")}</span>
              </div>
            </div>
          </div>

          {/* Unified Responsive Accordion Layout */}
          <Accordion
            type="multiple"
            className="w-full grid grid-cols-1 md:grid-cols-4 md:gap-8"
            defaultValue={["shop", "support", "company", "legal"]}
          >
            <AccordionItem value="shop" className="md:border-0">
              <AccordionTrigger className="text-left md:pointer-events-none md:cursor-default md:[&>svg]:hidden">
                <span className="font-semibold">{t("footer.sections.shop")}</span>
              </AccordionTrigger>
              <AccordionContent className="md:pb-0">
                <ul className="space-y-2">
                  {footerLinks.shop.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {t(link.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="support" className="md:border-0">
              <AccordionTrigger className="text-left md:pointer-events-none md:cursor-default md:[&>svg]:hidden">
                <span className="font-semibold">{t("footer.sections.support")}</span>
              </AccordionTrigger>
              <AccordionContent className="md:pb-0">
                <ul className="space-y-2">
                  {footerLinks.support.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {t(link.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="company" className="md:border-0">
              <AccordionTrigger className="text-left md:pointer-events-none md:cursor-default md:[&>svg]:hidden">
                <span className="font-semibold">{t("footer.sections.company")}</span>
              </AccordionTrigger>
              <AccordionContent className="md:pb-0">
                <ul className="space-y-2">
                  {footerLinks.company.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {t(link.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="legal" className="md:border-0">
              <AccordionTrigger className="text-left md:pointer-events-none md:cursor-default md:[&>svg]:hidden">
                <span className="font-semibold">{t("footer.sections.legal")}</span>
              </AccordionTrigger>
              <AccordionContent className="md:pb-0">
                <ul className="space-y-2">
                  {footerLinks.legal.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {t(link.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Copyright */}
          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t("common.copyright", { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
