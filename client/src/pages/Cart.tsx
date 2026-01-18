import { Link } from "wouter";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { MetersInput } from "@/components/products/MetersInput";
import { useCart, formatPrice } from "@/lib/cart";

export default function Cart() {
  const { items, removeItem, updateMeters, getTotal, hasCustomPriceItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-empty-cart">
              السلة فارغة
            </h1>
            <p className="text-muted-foreground">
              لم تقم بإضافة أي منتجات للسلة بعد
            </p>
            <Button asChild data-testid="button-browse-products">
              <Link href="/catalog">
                تصفح المنتجات
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const total = getTotal();
  const hasCustomItems = hasCustomPriceItems();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-page-title">
            سلة التسوق
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-destructive hover:text-destructive"
            data-testid="button-clear-cart"
          >
            <Trash2 className="h-4 w-4 ml-2" />
            إفراغ السلة
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const lineTotal = item.pricePerMeter && !item.isCustomPrice
                ? item.pricePerMeter * item.meters
                : null;

              return (
                <Card key={item.productId} data-testid={`cart-item-${item.productId}`}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-24 h-24 rounded-md overflow-hidden bg-muted shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.titleAr}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/product/${item.productId}`}
                              className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                            >
                              {item.titleAr}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {item.materialType}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.productId)}
                            data-testid={`button-remove-${item.productId}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          {/* Meters */}
                          <MetersInput
                            value={item.meters}
                            onChange={(m) => updateMeters(item.productId, m)}
                            size="sm"
                          />

                          {/* Price */}
                          <div className="text-left">
                            {item.isCustomPrice ? (
                              <span className="text-sm font-medium text-primary">
                                حسب الطلب
                              </span>
                            ) : lineTotal ? (
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  {formatPrice(item.pricePerMeter!)} × {item.meters} متر
                                </p>
                                <p className="font-bold text-primary">
                                  {formatPrice(lineTotal)}
                                </p>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">عدد المنتجات:</span>
                    <span className="text-foreground">{items.length}</span>
                  </div>
                  {!hasCustomItems && (
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span className="text-foreground">الإجمالي:</span>
                      <span className="text-primary" data-testid="text-cart-total">
                        {formatPrice(total)}
                      </span>
                    </div>
                  )}
                </div>

                {hasCustomItems ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      سلتك تحتوي على منتجات بأسعار خاصة. يرجى طلب عرض سعر.
                    </p>
                    <Button className="w-full" asChild data-testid="button-request-quote">
                      <Link href="/visit-request">طلب عرض سعر</Link>
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full" size="lg" asChild data-testid="button-checkout">
                    <Link href="/checkout">إتمام الطلب</Link>
                  </Button>
                )}

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/catalog">متابعة التسوق</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
