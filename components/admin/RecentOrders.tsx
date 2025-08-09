"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  CheckCircle,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useOrders } from "@/hooks/use-orders";
import { Order } from "@/lib/api/orders";
import { useAdmin } from "@/contexts/AdminContext";
import { EmptyOrdersState } from "../Order/EmptyOrderState";
import { OrdersLoading } from "../Order/Loading";
import { OrderDetailDialog } from "../Order/OrderDetailDialog";
import { OrderActions } from "../Order/OrderAction";
import { CheckCircle2, Clock, RotateCcw } from "lucide-react";

const ORDER_STATUSES = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  RETURNED: "RETURNED",
} as const;

const PAYMENT_STATUSES = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

const getPaymentStatusColor = (paymentStatus: string) => {
  const paymentColors = {
    [PAYMENT_STATUSES.PAID]: "bg-green-100 text-green-800 border-green-200",
    [PAYMENT_STATUSES.PENDING]:
      "bg-yellow-100 text-yellow-800 border-yellow-200",
    [PAYMENT_STATUSES.FAILED]: "bg-red-100 text-red-800 border-red-200",
    [PAYMENT_STATUSES.REFUNDED]:
      "bg-orange-100 text-orange-800 border-orange-200",
  };
  return (
    paymentColors[paymentStatus as keyof typeof paymentColors] ||
    "bg-gray-100 text-gray-800 border-gray-200"
  );
};

const getStatusColor = (status: string) => {
  const statusColors = {
    [ORDER_STATUSES.DELIVERED]: "bg-green-100 text-green-800",
    [ORDER_STATUSES.CONFIRMED]: "bg-blue-100 text-blue-800",
    [ORDER_STATUSES.SHIPPED]: "bg-purple-100 text-purple-800",
    [ORDER_STATUSES.PENDING]: "bg-yellow-100 text-yellow-800",
    [ORDER_STATUSES.CANCELLED]: "bg-red-100 text-red-800",
    [ORDER_STATUSES.RETURNED]: "bg-orange-100 text-orange-800",
  };
  return (
    statusColors[status as keyof typeof statusColors] ||
    "bg-gray-100 text-gray-800"
  );
};

const getStatusIcon = (status: string) => {
  const statusIcons = {
    [ORDER_STATUSES.DELIVERED]: <CheckCircle className="w-4 h-4" />,
    [ORDER_STATUSES.CONFIRMED]: <Package className="w-4 h-4" />,
    [ORDER_STATUSES.SHIPPED]: <Truck className="w-4 h-4" />,
    [ORDER_STATUSES.CANCELLED]: <XCircle className="w-4 h-4" />,
    [ORDER_STATUSES.RETURNED]: <XCircle className="w-4 h-4" />,
    [ORDER_STATUSES.PENDING]: <Package className="w-4 h-4" />,
  };
  return (
    statusIcons[status as keyof typeof statusIcons] || (
      <Package className="w-4 h-4" />
    )
  );
};

// Payment status icons

const getPaymentStatusIcon = (paymentStatus: string) => {
  const paymentIcons = {
    [PAYMENT_STATUSES.PAID]: (
      <CheckCircle2 className="w-4 h-4 text-green-600" />
    ),
    [PAYMENT_STATUSES.PENDING]: <Clock className="w-4 h-4 text-yellow-600" />,
    [PAYMENT_STATUSES.FAILED]: <XCircle className="w-4 h-4 text-red-600" />,
    [PAYMENT_STATUSES.REFUNDED]: (
      <RotateCcw className="w-4 h-4 text-orange-600" />
    ),
  };
  return (
    paymentIcons[paymentStatus as keyof typeof paymentIcons] || (
      <Clock className="w-4 h-4 text-gray-600" />
    )
  );
};

// Main component
export function RecentOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const { token } = useAdmin();

  const {
    orders,
    loading,
    pagination,
    searchFilter,
    setSearchFilter,
    fetchOrders,
    updateOrderStatus,
    updatePaymentStatus,
    applyFilters,
  } = useOrders(token);

  useEffect(() => {
    // Fetch recent orders (first page, no filters, show recent orders)
    fetchOrders(1);
  }, [token]);

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchFilter]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: string,
    notes?: string
  ) => {
    const success = await updateOrderStatus(orderId, newStatus, notes);
    if (success && selectedOrder?.id === orderId) {
      // Update the selected order in the dialog
      const updatedOrder = orders.find((o) => o.id === orderId);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  };

  const handlePaymentStatusUpdate = async (
    orderId: string,
    paymentStatus: string,
    notes?: string
  ) => {
    const success = await updatePaymentStatus(orderId, paymentStatus, notes);
    if (success && selectedOrder?.id === orderId) {
      // Update the selected order in the dialog
      const updatedOrder = orders.find((o) => o.id === orderId);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  };

  if (loading) {
    return <OrdersLoading />;
  }

  return (
    <div className="mx-auto px-4 py-8 container">
      <div className="flex md:flex-row flex-col md:justify-between md:items-start gap-4 mb-8">
        <div className="flex-1">
          <h1 className="mb-2 font-bold text-2xl sm:text-3xl">Recent Orders</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            View latest customer orders
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle>Recent Orders ({pagination.total})</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  placeholder="Search by order number, customer name, or email..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 sm:p-6">
          {/* Desktop Table View */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Order</TableHead>
                  <TableHead className="min-w-[200px]">Customer</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-muted-foreground text-sm">
                          {order.itemCount} items
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-shrink-0 justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-8 h-8 font-medium text-white text-sm">
                          {order.customerName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">
                            {order.customerName}
                          </div>
                          <div className="text-muted-foreground text-sm truncate">
                            {order.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ৳{order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.orderStatus)}
                          <Badge className={getStatusColor(order.orderStatus)}>
                            {order.orderStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {getPaymentStatusIcon(order.paymentStatus)}
                          <Badge
                            variant="outline"
                            className={`text-xs w-fit ${getPaymentStatusColor(
                              order.paymentStatus
                            )}`}>
                            {order.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <OrderActions
                        order={order}
                        onViewOrder={handleViewOrder}
                        onUpdateStatus={handleStatusUpdate}
                        onUpdatePaymentStatus={handlePaymentStatusUpdate}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {orders.length === 0 && <EmptyOrdersState />}
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        order={selectedOrder}
        open={orderDetailOpen}
        onOpenChange={setOrderDetailOpen}
        onUpdateStatus={handleStatusUpdate}
        onUpdatePaymentStatus={handlePaymentStatusUpdate}
      />
    </div>
  );
}
