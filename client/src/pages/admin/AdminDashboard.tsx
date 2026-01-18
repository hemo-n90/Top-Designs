import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingBag, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminLayout } from "./AdminLayout";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalVisitRequests: number;
  newRequestsThisWeek: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/admin/stats"],
  });

  const statCards = [
    {
      title: "إجمالي المنتجات",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "إجمالي الطلبات",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "طلبات المعاينة",
      value: stats?.totalVisitRequests || 0,
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "طلبات هذا الأسبوع",
      value: stats?.newRequestsThisWeek || 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-admin-title">
            مرحباً بك في لوحة التحكم
          </h1>
          <p className="text-muted-foreground">
            نظرة عامة على إحصائيات المتجر
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index} data-testid={`card-stat-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <p className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    )}
                  </div>
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-full`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>بيانات المشرف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>البريد الإلكتروني: admin@qimma.sa</p>
              <p>كلمة المرور: admin123</p>
              <p className="text-xs mt-4">(هذه بيانات افتراضية للتجربة)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
