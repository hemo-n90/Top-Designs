import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle, CalendarDays, Ruler } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layout } from "@/components/layout/Layout";
import { visitRequestFormSchema, type VisitRequestFormData, MATERIAL_TYPES } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

export default function VisitRequest() {
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<VisitRequestFormData>({
    resolver: zodResolver(visitRequestFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      city: "",
      district: "",
      address: "",
      materialType: "",
      approxMeters: "",
      notes: "",
      preferredDatetime: "",
    },
  });

  const createVisitMutation = useMutation({
    mutationFn: async (data: VisitRequestFormData) => {
      const response = await apiRequest("POST", "/api/visit-requests", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSuccess(true);
      form.reset();
    },
  });

  if (isSuccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-visit-success">
              تم استلام طلبك بنجاح!
            </h1>
            <p className="text-muted-foreground">
              شكراً لتواصلك معنا. سيقوم فريقنا بالتواصل معك قريباً لتحديد موعد المعاينة.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/">العودة للرئيسية</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/catalog">تصفح المنتجات</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const onSubmit = (data: VisitRequestFormData) => {
    createVisitMutation.mutate(data);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3" data-testid="text-page-title">
              طلب معاينة مجانية
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              احجز موعد معاينة مجاني وسيقوم فريقنا بزيارتك لأخذ المقاسات وتقديم أفضل التصاميم المناسبة لمساحتك.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Ruler className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">قياسات دقيقة</p>
                <p className="text-xs text-muted-foreground">نأخذ المقاسات بدقة عالية</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CalendarDays className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">موعد مرن</p>
                <p className="text-xs text-muted-foreground">نختار الموعد المناسب لك</p>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات الزيارة</CardTitle>
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
                    name="materialType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع الخامة المطلوبة</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-material">
                              <SelectValue placeholder="اختر نوع الخامة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MATERIAL_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="approxMeters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عدد الأمتار التقريبي (اختياري)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="مثال: 5"
                            min="0"
                            step="0.5"
                            {...field}
                            data-testid="input-meters"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredDatetime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الموعد المفضل (اختياري)</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            dir="ltr"
                            {...field}
                            data-testid="input-datetime"
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
                            placeholder="أي ملاحظات تريد إضافتها"
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
                    disabled={createVisitMutation.isPending}
                    data-testid="button-submit-visit"
                  >
                    {createVisitMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      "إرسال طلب المعاينة"
                    )}
                  </Button>

                  {createVisitMutation.isError && (
                    <p className="text-destructive text-sm text-center">
                      حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.
                    </p>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
