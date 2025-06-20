import { Order, getAllOrders, UpdateOrderStatusRequest, updateEnhancedOrderStatus, UpdatePaymentStatusRequest, updateEnhancedOrderPaymentStatus } from "@/lib/api/orders";
import { useState } from "react";
import { toast } from "./use-toast";

// Update the useOrders hook
export const useOrders = (token: string | null) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
    page:1
  });
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchOrders = async (page = 1, status?: string) => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await getAllOrders(
        token, 
        page, 
        20, 
        status === 'all' ? undefined : status
      );
      
      setOrders(response.data.orders);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({ variant: "destructive", title: "Failed to fetch orders" });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, notes?: string) => {
    if (!token) return false;

    try {
      const statusData: UpdateOrderStatusRequest = {
        orderStatus: status as any,
        notes
      };
      
      await updateEnhancedOrderStatus(token, orderId, statusData);
      toast({ variant: "default", title: "Order status updated successfully" });
      await fetchOrders(currentPage, statusFilter === 'all' ? undefined : statusFilter);
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({ variant: "destructive", title: "Failed to update order status" });
      return false;
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string, notes?: string) => {
    if (!token) return false;

    try {
      const paymentData: UpdatePaymentStatusRequest = {
        paymentStatus: paymentStatus as any,
        notes
      };
      
      await updateEnhancedOrderPaymentStatus(token, orderId, paymentData);
      toast({ variant: "default", title: "Payment status updated successfully" });
      await fetchOrders(currentPage, statusFilter === 'all' ? undefined : statusFilter);
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({ variant: "destructive", title: "Failed to update payment status" });
      return false;
    }
  };

  return {
    orders,
    loading,
    currentPage,
    setCurrentPage,
    pagination,
    statusFilter,
    setStatusFilter,
    fetchOrders,
    updateOrderStatus,
    updatePaymentStatus
  };
};