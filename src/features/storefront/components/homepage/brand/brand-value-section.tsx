"use client";

import { useState } from "react";
import BrandValueItem from "./brand-value-item";
import BrandValueModal from "./brand-value-modal";
import { BrandValueItem as BrandValueItemType } from "./types";

interface BrandValueSectionProps {
  title?: string;
  items?: BrandValueItemType[];
}

export default function BrandValueSection({
  title = "Giới thiệu về AKA",
  items = [],
}: BrandValueSectionProps) {
  const [selectedItem, setSelectedItem] = useState<BrandValueItemType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (item: BrandValueItemType) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-8 md:py-12 lg:py-16">
      <h2 className="text-2xl lg:text-4xl font-bold mb-6 lg:mb-10 text-center">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {items.map((item) => (
          <BrandValueItem
            key={item.id}
            item={item}
            onReadMore={() => handleOpenModal(item)}
          />
        ))}
      </div>

      <BrandValueModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}
