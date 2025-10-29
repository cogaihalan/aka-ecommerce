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
    { name: "All Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Hairstyles", href: "/hairstyles" },
    { name: "Courses", href: "/courses" },
    { name: "New Arrivals", href: "/products?filter=new" },
    { name: "Best Sellers", href: "/products?filter=bestsellers" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "Shipping Info", href: "/help/shipping" },
    { name: "Returns", href: "/help/returns" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/about/careers" },
    { name: "Press", href: "/about/press" },
    { name: "Sustainability", href: "/about/sustainability" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/legal/privacy" },
    { name: "Terms of Service", href: "/legal/terms" },
    { name: "Cookie Policy", href: "/legal/cookies" },
    { name: "Accessibility", href: "/legal/accessibility" },
  ],
};

export default function StorefrontFooter() {
  return (
    <>
      <Newsletter />
      <footer className="bg-muted/50 border-t">
        <div className="px-4 py-12">
          {/* Brand Section - Always visible */}
          <div className="mb-8">
            <Logo size="lg" href="/" />
            <p className="text-sm text-muted-foreground mb-4">
              Premium ecommerce experience with quality products and exceptional
              service.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@akastore.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 Commerce St, City, State 12345</span>
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
                <span className="font-semibold">Shop</span>
              </AccordionTrigger>
              <AccordionContent className="md:pb-0">
                <ul className="space-y-2">
                  {footerLinks.shop.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="support" className="md:border-0">
              <AccordionTrigger className="text-left md:pointer-events-none md:cursor-default md:[&>svg]:hidden">
                <span className="font-semibold">Support</span>
              </AccordionTrigger>
              <AccordionContent className="md:pb-0">
                <ul className="space-y-2">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="company" className="md:border-0">
              <AccordionTrigger className="text-left md:pointer-events-none md:cursor-default md:[&>svg]:hidden">
                <span className="font-semibold">Company</span>
              </AccordionTrigger>
              <AccordionContent className="md:pb-0">
                <ul className="space-y-2">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="legal" className="md:border-0">
              <AccordionTrigger className="text-left md:pointer-events-none md:cursor-default md:[&>svg]:hidden">
                <span className="font-semibold">Legal</span>
              </AccordionTrigger>
              <AccordionContent className="md:pb-0">
                <ul className="space-y-2">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
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
              © {new Date().getFullYear()} AKA Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
