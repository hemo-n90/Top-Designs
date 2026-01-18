import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/cart";
import type { ProductWithDetails } from "@shared/schema";

interface ProductCardProps {
  product: ProductWithDetails;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.url || "/placeholder-kitchen.jpg";
  const pricePerMeter = product.pricePerMeter ? parseFloat(product.pricePerMeter) : null;

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="overflow-hidden card-hover cursor-pointer group h-full" data-testid={`card-product-${product.id}`}>
        <div className="aspect-[4/3] relative overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.titleAr}
            className="w-full h-full object-cover img-zoom"
            loading="lazy"
          />
          {product.isFeatured && (
            <Badge className="absolute top-3 right-3" variant="default">
              مميز
            </Badge>
          )}
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors" data-testid={`text-product-title-${product.id}`}>
              {product.titleAr}
            </h3>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {product.materialType}
            </Badge>
          </div>
          
          {product.descriptionAr && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.descriptionAr}
            </p>
          )}

          <div className="pt-2 border-t">
            {product.isCustomPrice ? (
              <span className="text-sm font-medium text-primary" data-testid={`text-price-${product.id}`}>
                حسب الطلب
              </span>
            ) : pricePerMeter ? (
              <div className="flex items-baseline gap-1" data-testid={`text-price-${product.id}`}>
                <span className="font-bold text-primary">
                  {formatPrice(pricePerMeter)}
                </span>
                <span className="text-xs text-muted-foreground">/متر</span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">السعر غير متوفر</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
