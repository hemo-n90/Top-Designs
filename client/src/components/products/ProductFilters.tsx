import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { MATERIAL_TYPES, type Category } from "@shared/schema";

interface FiltersState {
  search: string;
  categoryId: string;
  materialType: string;
  sort: string;
}

interface ProductFiltersProps {
  categories: Category[];
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
}

export function ProductFilters({
  categories,
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FiltersState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      categoryId: "",
      materialType: "",
      sort: "newest",
    });
  };

  const hasActiveFilters =
    filters.categoryId || filters.materialType || filters.search;

  const FilterControls = () => (
    <div className="space-y-4">
      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">التصنيف</label>
        <Select
          value={filters.categoryId}
          onValueChange={(value) => updateFilter("categoryId", value)}
        >
          <SelectTrigger data-testid="select-category">
            <SelectValue placeholder="جميع التصنيفات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع التصنيفات</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.nameAr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Material Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">الخامة</label>
        <Select
          value={filters.materialType}
          onValueChange={(value) => updateFilter("materialType", value)}
        >
          <SelectTrigger data-testid="select-material">
            <SelectValue placeholder="جميع الخامات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الخامات</SelectItem>
            {MATERIAL_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">الترتيب</label>
        <Select
          value={filters.sort}
          onValueChange={(value) => updateFilter("sort", value)}
        >
          <SelectTrigger data-testid="select-sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">الأحدث</SelectItem>
            <SelectItem value="price_low">السعر: من الأقل</SelectItem>
            <SelectItem value="price_high">السعر: من الأعلى</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
          data-testid="button-clear-filters"
        >
          <X className="h-4 w-4 ml-2" />
          مسح الفلاتر
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search + Mobile Filter Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="ابحث عن منتج..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pr-10"
            data-testid="input-search"
          />
        </div>
        {/* Mobile Filter Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" data-testid="button-mobile-filters">
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle>الفلاتر</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterControls />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FilterControls />
      </div>
    </div>
  );
}
