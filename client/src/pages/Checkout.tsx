import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Layout } from "@/components/layout/Layout";
import { useCart, formatPrice } from "@/lib/cart";
import { checkoutFormSchema, type CheckoutFormData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, getTotal, clearCart } = useCart();
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      city: "",
      district: "",
      address: "",
      notes: "",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormData) => {
      const orderData = {
        ...data,
        items: items.map((item) => ({
          productId: item.productId,
          meters: item.meters,
          pricePerMeter: item.pricePerMeter,
          lineTotal: item.pricePerMeter ? item.pricePerMeter * item.meters : null,
          titleSnapshotAr: item.titleAr,
          materialSnapshot: item.materialType,
        })),
        subtotalAmount: getTotal(),
      };
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (data) => {
      setOrderNumber(data.id);
      clearCart();
    },
  });

  if (items.length === 0 && !orderNumber) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            السلة فارغة
          </h1>
          <Button asChild>
            <Link href="/catalog">تصفح المنتجات</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (orderNumber) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-order-success">
              تم استلام طلبك بنجاح!
            </h1>
            <p className="text-muted-foreground">
              شكراً لك. سيتم التواصل معك قريباً لتأكيد الطلب.
            </p>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">رقم الطلب:</p>
                <p className="text-2xl font-bold text-primary" data-testid="text-order-number">
                  #{orderNumber}
                </p>
              </CardContent>
            </Card>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/">العودة للرئيسية</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/catalog">تصفح المزيد</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const total = getTotal();

  const onSubmit = (data: CheckoutFormData) => {
    createOrderMutation.mutate(data);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/cart" className="hover:text-primary transition-colors">
            السلة
          </Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-foreground">إتمام الطلب</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8" data-testid="text-page-title">
          إتمام الطلب
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>معلومات التوصيل</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم الكامل</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="أدخل اسمك الكامل"
                              {...field}
                              data-testid="input-fullname"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الجوال</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="05XXXXXXXX"
                              dir="ltr"
                              className="text-left"
                              {...field}
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المدينة</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="مثال: الرياض"
                                {...field}
                                data-testid="input-city"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الحي</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="مثال: النخيل"
                                {...field}
                                data-testid="input-district"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العنوان التفصيلي</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="أدخل تفاصيل العنوان (الشارع، رقم المبنى، إلخ)"
                              {...field}
                              data-testid="input-address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ملاحظات إضافية (اختياري)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="أي ملاحظات تريد إضافتها للطلب"
                              {...field}
                              data-testid="input-notes"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={createOrderMutation.isPending}
                      data-testid="button-submit-order"
                    >
                      {createOrderMutation.isPending ? (
                        <>
                          <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        "تأكيد الطلب"
                      )}
                    </Button>

                    {createOrderMutation.isError && (
                      <p className="text-destructive text-sm text-center">
                        حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.
                      </p>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.titleAr}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground line-clamp-1">
                          {item.titleAr}
                        </p>
                        <p className="text-muted-foreground">
                          {item.meters} متر
                        </p>
                      </div>
                      {item.pricePerMeter && (
                        <p className="font-medium text-foreground shrink-0">
                          {formatPrice(item.pricePerMeter * item.meters)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">الإجمالي:</span>
                    <span className="text-primary" data-testid="text-checkout-total">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
