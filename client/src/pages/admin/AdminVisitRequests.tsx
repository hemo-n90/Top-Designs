import { useQuery, useMutation } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminLayout } from "./AdminLayout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { VISIT_STATUSES, type VisitRequest } from "@shared/schema";

const statusLabels: Record<string, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  scheduled: "تم الجدولة",
  done: "مكتمل",
  cancelled: "ملغي",
};

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-purple-100 text-purple-800",
  scheduled: "bg-yellow-100 text-yellow-800",
  done: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminVisitRequests() {
  const [selectedRequest, setSelectedRequest] = useState<VisitRequest | null>(null);
  const { toast } = useToast();

  const { data: requests, isLoading } = useQuery<VisitRequest[]>({
    queryKey: ["/api/admin/visit-requests"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/visit-requests/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/visit-requests"] });
      toast({ title: "تم تحديث حالة الطلب" });
    },
    onError: () => {
      toast({ title: "حدث خطأ", variant: "destructive" });
    },
  });

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">طلبات المعاينة</h1>
          <p className="text-muted-foreground">إدارة طلبات المعاينة المنزلية</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : requests && requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} data-testid={`admin-visit-${request.id}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-foreground">#{request.id}</span>
                        <Badge className={statusColors[request.status] || ""}>
                          {statusLabels[request.status] || request.status}
                        </Badge>
                        <Badge variant="outline">{request.materialType}</Badge>
                      </div>
                      <p className="text-sm text-foreground">{request.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.city} - {request.district}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={request.status}
                        onValueChange={(value) =>
                          updateStatusMutation.mutate({ id: request.id, status: value })
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VISIT_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {statusLabels[status]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              لا توجد طلبات معاينة حالياً
            </CardContent>
          </Card>
        )}

        {/* Request Details Dialog */}
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>تفاصيل طلب المعاينة #{selectedRequest?.id}</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">الاسم</p>
                    <p className="font-medium">{selectedRequest.fullName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">الجوال</p>
                    <p className="font-medium">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">المدينة</p>
                    <p className="font-medium">{selectedRequest.city}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">الحي</p>
                    <p className="font-medium">{selectedRequest.district}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">العنوان</p>
                    <p className="font-medium">{selectedRequest.address}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">الخامة المطلوبة</p>
                    <p className="font-medium">{selectedRequest.materialType}</p>
                  </div>
                  {selectedRequest.approxMeters && (
                    <div>
                      <p className="text-muted-foreground">الأمتار التقريبية</p>
                      <p className="font-medium">{selectedRequest.approxMeters} متر</p>
                    </div>
                  )}
                  {selectedRequest.preferredDatetime && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">الموعد المفضل</p>
                      <p className="font-medium">{selectedRequest.preferredDatetime}</p>
                    </div>
                  )}
                  {selectedRequest.notes && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">ملاحظات</p>
                      <p className="font-medium">{selectedRequest.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
