"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CategoryTree } from "@/lib/api/types";
import {
  ChevronRight,
  ChevronDown,
  Package,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface CategoryTreeNodeProps {
  category: CategoryTree;
  level?: number;
  onSelect?: (category: CategoryTree) => void;
  onEdit?: (category: CategoryTree) => void;
  onDelete?: (category: CategoryTree) => void;
  selectedCategories?: number[];
  showActions?: boolean;
  showProductCount?: boolean;
}

export function CategoryTreeNode({
  category,
  level = 0,
  onSelect,
  onEdit,
  onDelete,
  selectedCategories = [],
  showActions = true,
  showProductCount = true,
}: CategoryTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(category.isExpanded || false);
  const isSelected = selectedCategories.includes(category.id);
  const indent = level * 24; // 24px per level

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    onSelect?.(category);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(category);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(category);
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center space-x-2 py-2 px-3 hover:bg-muted/50 rounded-md cursor-pointer group"
        style={{ marginLeft: `${indent}px` }}
        onClick={handleSelect}
      >
        {/* Expand/Collapse Button */}
        {category.children.length > 0 && (
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle();
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        )}

        {/* Category Image */}
        {category.image && (
          <img
            src={category.image.url}
            alt={category.name}
            className="h-6 w-6 rounded object-cover flex-shrink-0"
          />
        )}

        {/* Category Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm truncate">
              {category.name}
            </span>
            {!category.isActive && (
              <Badge variant="secondary" className="text-xs">
                Inactive
              </Badge>
            )}
            {!category.includeInMenu && (
              <Badge variant="outline" className="text-xs">
                Hidden
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {category.slug}
          </div>
        </div>

        {/* Product Count */}
        {showProductCount && (
          <Badge variant="secondary" className="text-xs font-mono">
            {category.productCount}
          </Badge>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
              <Link href={`/admin/categories/${category.id}`}>
                <Eye className="h-3 w-3" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
              <Link href={`/admin/categories/${category.id}/edit`}>
                <Edit className="h-3 w-3" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Children */}
      {category.children.length > 0 && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent>
            <div className="space-y-1">
              {category.children.map((child) => (
                <CategoryTreeNode
                  key={child.id}
                  category={child}
                  level={level + 1}
                  onSelect={onSelect}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  selectedCategories={selectedCategories}
                  showActions={showActions}
                  showProductCount={showProductCount}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

interface CategoryTreeProps {
  categories: CategoryTree[];
  onSelect?: (category: CategoryTree) => void;
  onEdit?: (category: CategoryTree) => void;
  onDelete?: (category: CategoryTree) => void;
  selectedCategories?: number[];
  showActions?: boolean;
  showProductCount?: boolean;
  className?: string;
}

export function CategoryTreeView({
  categories,
  onSelect,
  onEdit,
  onDelete,
  selectedCategories = [],
  showActions = true,
  showProductCount = true,
  className = "",
}: CategoryTreeProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {categories.map((category) => (
        <CategoryTreeNode
          key={category.id}
          category={category}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          selectedCategories={selectedCategories}
          showActions={showActions}
          showProductCount={showProductCount}
        />
      ))}
    </div>
  );
}
