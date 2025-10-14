"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "@/lib/api/types";
import { adminCategoryService } from "@/lib/api";

interface CategorySelectorProps {
  selectedCategories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
  placeholder?: string;
  maxSelections?: number;
  className?: string;
}

export function CategorySelector({
  selectedCategories,
  onCategoriesChange,
  placeholder = "Select categories...",
  maxSelections,
  className,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const response = await adminCategoryService.getCategories({
          limit: 1000,
        });
        const categories = Array.isArray(response) ? response : response.categories;
        setCategories(categories);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSelect = (category: Category) => {
    const isSelected = selectedCategories.some((cat) => cat.id === category.id);

    if (isSelected) {
      // Remove category
      onCategoriesChange(
        selectedCategories.filter((cat) => cat.id !== category.id)
      );
    } else {
      // Add category (check max selections)
      if (!maxSelections || selectedCategories.length < maxSelections) {
        onCategoriesChange([...selectedCategories, category]);
      }
    }
  };

  const handleRemove = (categoryId: number) => {
    onCategoriesChange(
      selectedCategories.filter((cat) => cat.id !== categoryId)
    );
  };

  const availableCategories = categories.filter(
    (cat) => !selectedCategories.some((selected) => selected.id === cat.id)
  );

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={isLoading}
          >
            {isLoading
              ? "Loading categories..."
              : selectedCategories.length === 0
                ? placeholder
                : `${selectedCategories.length} categor${selectedCategories.length === 1 ? "y" : "ies"} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                {availableCategories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => handleSelect(category)}
                    className="flex items-center space-x-2"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedCategories.some((cat) => cat.id === category.id)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span
                          style={{ marginLeft: `${category.level * 16}px` }}
                        >
                          {category.name}
                        </span>
                        {!category.isActive && (
                          <Badge variant="secondary" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {category.slug}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected Categories:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {category.name}
                <button
                  type="button"
                  onClick={() => handleRemove(category.id)}
                  className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
