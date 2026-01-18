import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Ruler, Palette, Award, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import type { ProductWithDetails, Category } from "@shared/schema";

const features = [
  {
    icon: Ruler,
    title: "معاينة مجانية",
    description: "نقوم بزيارتك لأخذ المقاسات الدقيقة",
  },
  {
    icon: Palette,
    title: "تصاميم مخصصة",
    description: "تصميم يناسب ذوقك ومساحتك",
  },
  {
    icon: Award,
    title: "جودة عالية",
    description: "خامات ممتازة وتشطيبات فاخرة",
  },
  {
    icon: Truck,
    title: "توصيل وتركيب",
    description: "خدمة شاملة حتى باب منزلك",
  },
];

const testimonials = [
  {
    name: "أحمد محمد",
    city: "الرياض",
    text: "تجربة ممتازة من البداية للنهاية. المطبخ تجاوز توقعاتي والتركيب كان احترافي.",
  },
  {
    name: "سارة العتيبي",
    city: "جدة",
    text: "أنصح الجميع بالتعامل معهم. خدمة راقية وأسعار منافسة وجودة عالية.",
  },
  {
    name: "فهد الشمري",
    city: "الدمام",
    text: "مطبخ ألمنيوم فخم جداً. شكراً لفريق قمة التصاميم على الإبداع.",
  },
];

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = useQuery<ProductWithDetails[]>({
    queryKey: ["/api/products", { featured: true }],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-bl from-primary/10 via-background to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight" data-testid="text-hero-title">
              مطابخ فاخرة بجودة
              <span className="text-primary"> استثنائية</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              نصمم ونصنع مطابخ عصرية تجمع بين الأناقة والعملية. خبرة سنوات في صناعة المطابخ بأفضل الخامات.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" asChild data-testid="button-browse-catalog">
                <Link href="/catalog">
                  تصفح الأعمال
                  <ArrowLeft className="h-5 w-5 mr-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-request-visit">
                <Link href="/visit-request">اطلب معاينة</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center space-y-3 p-4"
                data-testid={`feature-${index}`}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                تصنيفات المطابخ
              </h2>
              <p className="text-muted-foreground">اختر التصنيف المناسب لاحتياجاتك</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/catalog?category=${category.id}`}>
                  <Card className="card-hover cursor-pointer h-full" data-testid={`card-category-${category.id}`}>
                    <CardContent className="p-6 text-center">
                      <h3 className="font-bold text-foreground hover:text-primary transition-colors">
                        {category.nameAr}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                أعمال مميزة
              </h2>
              <p className="text-muted-foreground">أحدث تصاميمنا وأفضل أعمالنا</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex" data-testid="button-view-all">
              <Link href="/catalog">
                عرض الكل
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                لا توجد منتجات مميزة حالياً
              </div>
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/catalog">
                عرض الكل
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              آراء عملائنا
            </h2>
            <p className="text-muted-foreground">ما يقوله عملاؤنا عن تجربتهم معنا</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full" data-testid={`testimonial-${index}`}>
                <CardContent className="p-6 space-y-4">
                  <p className="text-foreground leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.city}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            جاهز لتصميم مطبخ أحلامك؟
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            احجز موعد معاينة مجاني الآن وسيقوم فريقنا بزيارتك لأخذ المقاسات وتقديم أفضل التصاميم المناسبة لمساحتك.
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-cta-visit">
            <Link href="/visit-request">احجز معاينة مجانية</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
