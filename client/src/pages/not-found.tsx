import { Link } from "wouter";
import { Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl font-bold text-primary/20">404</div>
        <h1 className="text-2xl font-bold text-foreground">
          الصفحة غير موجودة
        </h1>
        <p className="text-muted-foreground">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild data-testid="button-go-home">
            <Link href="/">
              <Home className="h-4 w-4 ml-2" />
              الصفحة الرئيسية
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/catalog">
              تصفح المنتجات
              <ArrowRight className="h-4 w-4 mr-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
