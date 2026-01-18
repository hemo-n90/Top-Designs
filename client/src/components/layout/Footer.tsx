import { Link } from "wouter";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-lg">
                ق
              </div>
              <span className="text-lg font-bold" data-testid="text-footer-brand">قمة التصاميم</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              مصنع وصالة عرض متخصصة في تصميم وتنفيذ المطابخ الفاخرة بأعلى معايير الجودة في المملكة العربية السعودية.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground">روابط سريعة</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                الرئيسية
              </Link>
              <Link href="/catalog" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                المنتجات
              </Link>
              <Link href="/visit-request" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                طلب معاينة
              </Link>
              <Link href="/cart" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                السلة
              </Link>
            </nav>
          </div>

          {/* Materials */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground">أنواع المطابخ</h3>
            <nav className="flex flex-col gap-2">
              <span className="text-muted-foreground text-sm">مطابخ ألمنيوم</span>
              <span className="text-muted-foreground text-sm">مطابخ خشب</span>
              <span className="text-muted-foreground text-sm">مطابخ صاج</span>
              <span className="text-muted-foreground text-sm">مطابخ فورميكا</span>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">الرياض، المملكة العربية السعودية</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+966500000000" className="text-muted-foreground hover:text-primary transition-colors">
                  +966 50 000 0000
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:info@qimma.sa" className="text-muted-foreground hover:text-primary transition-colors">
                  info@qimma.sa
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-muted-foreground">
                  <p>السبت - الخميس</p>
                  <p>9:00 ص - 9:00 م</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} قمة التصاميم. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
