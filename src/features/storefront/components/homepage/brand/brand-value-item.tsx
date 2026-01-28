"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrandValueItem as BrandValueItemType } from "./types";
import { cn } from "@/lib/utils";

interface BrandValueItemProps {
  item: BrandValueItemType;
  className?: string;
  onReadMore?: () => void;
}

export default function BrandValueItem({
  item,
  className,
  onReadMore,
}: BrandValueItemProps) {
  return (
    <Card
      disableBlockPadding
      className={cn(
        "h-full flex flex-col hover:shadow-lg transition-shadow duration-300",
        className
      )}
    >
      <CardHeader className="p-0">
        <div className="relative w-full aspect-square overflow-hidden rounded-t-lg bg-muted">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col px-6 pb-6">
        <h3 className="text-lg font-semibold mb-3 text-foreground">
          {item.title}
        </h3>
        <div className="flex-1 flex flex-col">
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            {item.shortContent}
          </p>
          {onReadMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReadMore}
              className="h-auto p-0 text-xs text-primary hover:text-primary/80 mt-3 w-fit"
            >
              Xem thêm
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
