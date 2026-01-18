import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { ProductFilters } from "@/components/products/ProductFilters";
import type { ProductWithDetails, Category } from "@shared/schema";

export default function Catalog() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialCategory = searchParams.get("category") || "";

  const [filters, setFilters] = useState({
    search: "",
    categoryId: initialCategory,
    materialType: "",
    sort: "newest",
  });

  const { data: products, isLoading: productsLoading } = useQuery<ProductWithDetails[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.titleAr.toLowerCase().includes(searchLower) ||
          p.descriptionAr?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.categoryId && filters.categoryId !== "all") {
      result = result.filter(
        (p) => p.categoryId === parseInt(filters.categoryId)
      );
    }

    // Material type filter
    if (filters.materialType && filters.materialType !== "all") {
      result = result.filter((p) => p.materialType === filters.materialType);
    }

    // Sorting
    switch (filters.sort) {
      case "price_low":
        result.sort((a, b) => {
          const priceA = a.pricePerMeter ? parseFloat(a.pricePerMeter) : Infinity;
          const priceB = b.pricePerMeter ? parseFloat(b.pricePerMeter) : Infinity;
          return priceA - priceB;
        });
        break;
      case "price_high":
        result.sort((a, b) => {
          const priceA = a.pricePerMeter ? parseFloat(a.pricePerMeter) : 0;
          const priceB = b.pricePerMeter ? parseFloat(b.pricePerMeter) : 0;
          return priceB - priceA;
        });
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return result;
  }, [products, filters]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
            منتجاتنا
          </h1>
          <p className="text-muted-foreground">
            تصفح مجموعتنا المتنوعة من المطابخ الفاخرة
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="lg:w-64 shrink-0">
            <ProductFilters
              categories={categories}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {filteredProducts.length} منتج
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">
                  لم يتم العثور على منتجات
                </p>
                <p className="text-sm text-muted-foreground">
                  حاول تغيير معايير البحث أو الفلاتر
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
