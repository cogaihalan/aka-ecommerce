"use client";

import Image from "next/image";
import { Modal } from "@/components/ui/modal";
import { BrandValueItem as BrandValueItemType } from "./types";

interface BrandValueModalProps {
  item: BrandValueItemType | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BrandValueModal({
  item,
  isOpen,
  onClose,
}: BrandValueModalProps) {
  if (!item) return null;

  return (
    <Modal
      title={item.title}
      description={item.shortContent}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="relative w-full aspect-video overflow-hidden rounded-lg">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {item.fullContent}
        </p>
      </div>
    </Modal>
  );
}
