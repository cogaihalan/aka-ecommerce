"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Globe, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">About AKA Store</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We're passionate about providing premium products and exceptional
          service to our customers worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">10K+</h3>
            <p className="text-muted-foreground">Happy Customers</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Award className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">500+</h3>
            <p className="text-muted-foreground">Premium Products</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">50+</h3>
            <p className="text-muted-foreground">Countries Served</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">5+</h3>
            <p className="text-muted-foreground">Years Experience</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To provide our customers with the highest quality products and
              exceptional service, making premium shopping accessible to
              everyone.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Quality</Badge>
                <span className="text-sm">Premium products only</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Service</Badge>
                <span className="text-sm">Exceptional customer support</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Innovation</Badge>
                <span className="text-sm">Cutting-edge technology</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
