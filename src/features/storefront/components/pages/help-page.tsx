"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  HelpCircle,
  Truck,
  CreditCard,
  RotateCcw,
  Shield,
} from "lucide-react";

const faqCategories = [
  {
    title: "Shipping & Delivery",
    icon: Truck,
    questions: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 3-5 business days.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes, on orders over 1,000,000 đ.",
      },
    ],
  },
  {
    title: "Payment",
    icon: CreditCard,
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards and PayPal.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes, we use industry-standard encryption.",
      },
    ],
  },
  {
    title: "Returns & Exchanges",
    icon: RotateCcw,
    questions: [
      {
        q: "What is your return policy?",
        a: "30-day return policy for unused items.",
      },
      {
        q: "How do I return an item?",
        a: "Contact our support team to initiate a return.",
      },
    ],
  },
  {
    title: "Account & Security",
    icon: Shield,
    questions: [
      {
        q: "How do I reset my password?",
        a: "Use the 'Forgot Password' link on the login page.",
      },
      {
        q: "How do I update my account information?",
        a: "Go to your account settings to update your profile.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Help Center</h1>
        <p className="text-muted-foreground">
          Find answers to common questions and get support
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search help articles..." className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.questions.map((faq, index) => (
                  <div key={index} className="space-y-1">
                    <p className="font-medium text-sm">{faq.q}</p>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Still need help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for? Our support team is here to
            help.
          </p>
          <div className="flex gap-2">
            <Button>Contact Support</Button>
            <Button variant="outline">Live Chat</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
