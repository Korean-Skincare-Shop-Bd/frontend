import { Order } from "@/lib/api/orders";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { CheckCircle, Eye, FileText, MoreHorizontal, Package, Truck, XCircle } from "lucide-react";
import { Button } from "../ui/button";

const ORDER_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
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

interface OrderActionsProps {
  order: Order;
  onViewOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  onUpdatePaymentStatus: (orderId: string, paymentStatus: string) => void; // Add this
}

export const OrderActions = ({ order, onViewOrder, onUpdateStatus, onUpdatePaymentStatus }: OrderActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => onViewOrder(order)}>
        <Eye className="mr-2 w-4 h-4" />
        View Details
      </DropdownMenuItem>

      {/* Order Status Updates */}
      <DropdownMenuItem onClick={() => onUpdateStatus(order.id, ORDER_STATUSES.CONFIRMED)}>
        <CheckCircle className="mr-2 w-4 h-4" />
        Mark Confirmed
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={() => onUpdateStatus(order.id, ORDER_STATUSES.SHIPPED)}>
        <Truck className="mr-2 w-4 h-4" />
        Mark Shipped
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onUpdateStatus(order.id, ORDER_STATUSES.DELIVERED)}>
        <CheckCircle className="mr-2 w-4 h-4" />
        Mark Delivered
      </DropdownMenuItem>

      {/* Separator */}
      <div className="my-1 bg-border h-px" />

      {/* Payment Status Updates */}
      <DropdownMenuItem onClick={() => onUpdatePaymentStatus(order.id, PAYMENT_STATUSES.PAID)}>
        <CheckCircle className="mr-2 w-4 h-4 text-green-600" />
        Mark Payment Paid
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onUpdatePaymentStatus(order.id, PAYMENT_STATUSES.FAILED)}>
        <XCircle className="mr-2 w-4 h-4 text-red-600" />
        Mark Payment Failed
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onUpdatePaymentStatus(order.id, PAYMENT_STATUSES.REFUNDED)}>
        <XCircle className="mr-2 w-4 h-4 text-orange-600" />
        Mark Payment Refunded
      </DropdownMenuItem>

      <div className="my-1 bg-border h-px" />

      <DropdownMenuItem>
        <FileText className="mr-2 w-4 h-4" />
        Generate Invoice
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);