import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  AlertCircle,
  Package,
} from "lucide-react";
import { OrderHistory } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { getStatusText, getStatusBadgeVariant, getOrderActionText } from "@/lib/utils";

interface OrderTimelineProps {
  histories: OrderHistory[];
}

const getActionIcon = (action: string) => {
  switch (action.toUpperCase()) {
    case "CREATED":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "CONFIRMED":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "PAYMENT":
    case "PAYMENT_SUCCESS":
      return <CreditCard className="h-4 w-4 text-green-500" />;
    case "PAYMENT_FAILED":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "SHIPPING":
      return <Truck className="h-4 w-4 text-blue-500" />;
    case "DELIVERED":
      return <Package className="h-4 w-4 text-green-500" />;
    case "CANCELLED":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};


export default function OrderTimeline({ histories }: OrderTimelineProps) {
  if (histories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Lịch sử đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Không có sự kiện trong mốc thời gian
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Lịch sử đơn hàng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {histories.map((history, index) => (
            <div key={history.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                  {getActionIcon(history.action)}
                </div>
                {index < histories.length - 1 && (
                  <div className="w-px h-8 bg-border mt-2" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {getOrderActionText(history.action)}
                  </span>
                  <Badge
                    variant={getStatusBadgeVariant(history.orderStatus)}
                  >
                    {getStatusText(history.orderStatus)}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(history.createdAt), { addSuffix: true })}
                </div>
                {history.note && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {history.note}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  bởi {history.actorName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}