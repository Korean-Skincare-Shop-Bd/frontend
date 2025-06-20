import { Order } from "@/lib/api/orders";
import { Badge } from "../ui/badge";
import { OrderActions } from "./OrderAction";
import { CheckCircle, Package, Truck, XCircle } from "lucide-react";
const ORDER_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
} as const;
const PAYMENT_STATUSES = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
} as const;
const getPaymentStatusColor = (paymentStatus: string) => {
  const paymentColors = {
    [PAYMENT_STATUSES.PAID]: 'bg-green-100 text-green-800 border-green-200',
    [PAYMENT_STATUSES.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [PAYMENT_STATUSES.FAILED]: 'bg-red-100 text-red-800 border-red-200',
    [PAYMENT_STATUSES.REFUNDED]: 'bg-orange-100 text-orange-800 border-orange-200',
  };
  return paymentColors[paymentStatus as keyof typeof paymentColors] || 'bg-gray-100 text-gray-800 border-gray-200';
};


const getStatusColor = (status: string) => {
  const statusColors = {
    [ORDER_STATUSES.DELIVERED]: 'bg-green-100 text-green-800',
    [ORDER_STATUSES.PROCESSING]: 'bg-blue-100 text-blue-800',
    [ORDER_STATUSES.SHIPPED]: 'bg-purple-100 text-purple-800',
    [ORDER_STATUSES.PENDING]: 'bg-yellow-100 text-yellow-800',
    [ORDER_STATUSES.CONFIRMED]: 'bg-cyan-100 text-cyan-800',
    [ORDER_STATUSES.CANCELLED]: 'bg-red-100 text-red-800',
    // Legacy status support
    delivered: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
};

const getStatusIcon = (status: string) => {
  const statusIcons = {
    [ORDER_STATUSES.DELIVERED]: <CheckCircle className="w-4 h-4" />,
    [ORDER_STATUSES.PROCESSING]: <Package className="w-4 h-4" />,
    [ORDER_STATUSES.SHIPPED]: <Truck className="w-4 h-4" />,
    [ORDER_STATUSES.CANCELLED]: <XCircle className="w-4 h-4" />,
    // Legacy status support
    delivered: <CheckCircle className="w-4 h-4" />,
    processing: <Package className="w-4 h-4" />,
    shipped: <Truck className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
  };
  return statusIcons[status as keyof typeof statusIcons] || <Package className="w-4 h-4" />;
};


interface MobileOrderCardProps {
  order: Order;
  onViewOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  onUpdatePaymentStatus: (orderId: string, paymentStatus: string) => void; // Add this
}

export const MobileOrderCard = ({ order, onViewOrder, onUpdateStatus, onUpdatePaymentStatus }: MobileOrderCardProps) => (
  <div className="p-4 border-b last:border-b-0">
    <div className="flex justify-between items-start gap-3 mb-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="font-medium text-sm">{order.orderNumber}</div>
          <div className="flex items-center gap-1">
            {getStatusIcon(order.orderStatus)}
            <Badge className={`text-xs ${getStatusColor(order.orderStatus)}`}>
              {order.orderStatus}
            </Badge>
          </div>
        </div>
        <div className="text-muted-foreground text-xs">
          {order.itemCount} items • {new Date(order.createdAt).toLocaleDateString()}
        </div>
      </div>
      <OrderActions
        order={order}
        onViewOrder={onViewOrder}
        onUpdateStatus={onUpdateStatus}
        onUpdatePaymentStatus={onUpdatePaymentStatus} // Add this
      />
    </div>

    <div className="flex items-center gap-3 mb-3">
      <div className="flex flex-shrink-0 justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-8 h-8 font-medium text-white text-sm">
        {order.customerName.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{order.customerName}</div>
        <div className="text-muted-foreground text-xs truncate">{order.email}</div>
      </div>
      <div className="font-semibold text-lg">
        ৳{order.totalAmount.toFixed(2)}
      </div>
    </div>

    {/* Payment Status */}
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs">Payment:</span>
        <Badge variant="outline" className={`text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
          {order.paymentStatus}
        </Badge>
      </div>
      <div className="text-muted-foreground text-xs">
        {order.paymentMethod.replace('_', ' ')}
      </div>
    </div>
  </div>
);
