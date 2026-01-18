import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowRight, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/layout/Layout";
import { MetersInput } from "@/components/products/MetersInput";
import { ProductCard } from "@/components/products/ProductCard";
import { useCart, formatPrice } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import type { ProductWithDetails } from "@shared/schema";

export default function ProductDetails() {
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id || "0");
  const [meters, setMeters] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<ProductWithDetails>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const { data: relatedProducts } = useQuery<ProductWithDetails[]>({
    queryKey: ["/api/products"],
    select: (products) =>
      products
        .filter(
          (p) =>
            p.id !== productId &&
            (p.categoryId === product?.categoryId ||
              p.materialType === product?.materialType)
        )
        .slice(0, 4),
    enabled: !!product,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            المنتج غير موجود
          </h1>
          <Button asChild>
            <Link href="/catalog">العودة للمنتجات</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const pricePerMeter = product.pricePerMeter
    ? parseFloat(product.pricePerMeter)
    : null;
  const totalPrice = pricePerMeter ? pricePerMeter * meters : null;
  const images = product.images?.length
    ? product.images
    : [{ id: 0, productId: product.id, url: "/placeholder-kitchen.jpg" }];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      titleAr: product.titleAr,
      materialType: product.materialType,
      pricePerMeter,
      isCustomPrice: product.isCustomPrice,
      meters,
      imageUrl: images[0].url,
    });
    toast({
      title: "تمت الإضافة للسلة",
      description: `${product.titleAr} - ${meters} متر`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            الرئيسية
          </Link>
          <ArrowRight className="h-4 w-4" />
          <Link href="/catalog" className="hover:text-primary transition-colors">
            المنتجات
          </Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-foreground">{product.titleAr}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={images[selectedImageIndex].url}
                alt={product.titleAr}
                className="w-full h-full object-cover"
                data-testid="img-product-main"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                      index === selectedImageIndex
                        ? "border-primary"
                        : "border-transparent hover:border-primary/50"
                    }`}
                    data-testid={`button-thumbnail-${index}`}
                  >
                    <img
                      src={image.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-product-title">
                  {product.titleAr}
                </h1>
                {product.isFeatured && (
                  <Badge variant="default">مميز</Badge>
                )}
              </div>
              <Badge variant="secondary" className="text-sm">
                {product.materialType}
              </Badge>
            </div>

            {product.descriptionAr && (
              <p className="text-muted-foreground leading-relaxed" data-testid="text-product-description">
                {product.descriptionAr}
              </p>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">الألوان المتاحة:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Badge key={color.id} variant="outline">
                      {color.colorNameAr}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Category */}
            {product.category && (
              <div className="text-sm">
                <span className="text-muted-foreground">التصنيف: </span>
                <span className="text-foreground">{product.category.nameAr}</span>
              </div>
            )}

            {/* Price Section */}
            <Card>
              <CardContent className="p-6 space-y-4">
                {product.isCustomPrice ? (
                  <div className="space-y-4">
                    <p className="text-lg font-bold text-primary" data-testid="text-price-custom">
                      حسب الطلب
                    </p>
                    <p className="text-sm text-muted-foreground">
                      هذا المنتج يتطلب عرض سعر خاص. تواصل معنا للحصول على التفاصيل.
                    </p>
                    <Button className="w-full" asChild>
                      <Link href="/visit-request">طلب عرض سعر</Link>
                    </Button>
                  </div>
                ) : pricePerMeter ? (
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2" data-testid="text-price-per-meter">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(pricePerMeter)}
                      </span>
                      <span className="text-muted-foreground">/متر</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        عدد الأمتار:
                      </label>
                      <MetersInput value={meters} onChange={setMeters} />
                    </div>

                    {totalPrice && (
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">الإجمالي:</span>
                          <span className="text-xl font-bold text-primary" data-testid="text-total-price">
                            {formatPrice(totalPrice)}
                          </span>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleAddToCart}
                      data-testid="button-add-to-cart"
                    >
                      <ShoppingCart className="h-5 w-5 ml-2" />
                      إضافة للسلة
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">السعر غير متوفر</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
              منتجات مشابهة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
