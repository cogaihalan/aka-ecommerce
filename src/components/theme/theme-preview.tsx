"use client";

import { SiteSettings } from "@/types/app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ThemePreviewProps {
  settings: SiteSettings;
}

export function ThemePreview({ settings }: ThemePreviewProps) {
  return (
    <Card className="border-2 border-dashed border-muted-foreground/25">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Eye className="h-4 w-4" />
          Theme Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Header Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Header Preview</h4>
          <div 
            className="p-3 rounded border"
            style={{ 
              backgroundColor: settings.theme.primaryColor,
              color: "white"
            }}
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold">{settings.siteName}</div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="text-xs">
                  Products
                </Button>
                <Button size="sm" variant="secondary" className="text-xs">
                  About
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Button Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Button Preview</h4>
          <div className="flex gap-2">
            <Button 
              size="sm"
              style={{ 
                backgroundColor: settings.theme.primaryColor,
                color: "white"
              }}
            >
              Primary Button
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              style={{ 
                borderColor: settings.theme.primaryColor,
                color: settings.theme.primaryColor
              }}
            >
              Secondary Button
            </Button>
          </div>
        </div>

        {/* Color Palette */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Color Palette</h4>
          <div className="flex gap-2">
            <div className="space-y-1">
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: settings.theme.primaryColor }}
              />
              <p className="text-xs text-muted-foreground">Primary</p>
            </div>
            <div className="space-y-1">
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: settings.theme.secondaryColor }}
              />
              <p className="text-xs text-muted-foreground">Secondary</p>
            </div>
          </div>
        </div>

        {/* Site Info Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Site Information</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span>{settings.siteName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Currency:</span>
              <span>{settings.currency} ({settings.currencySymbol})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Language:</span>
              <Badge variant="outline" className="text-xs">
                {settings.language.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}