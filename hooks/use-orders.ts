import { Order, getAllOrders, UpdateOrderStatusRequest, updateEnhancedOrderStatus, UpdatePaymentStatusRequest, updateEnhancedOrderPaymentStatus } from "@/lib/api/orders";
import { useState } from "react";
import { toast } from "./use-toast";

export const useOrders = (token: string | null) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
    page: 1,
    limit: 20
  });
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [dateFromFilter, setDateFromFilter] = useState<string>('');
  const [dateToFilter, setDateToFilter] = useState<string>('');

  const fetchOrders = async (
    page = 1, 
    orderStatus?: string,
    paymentStatus?: string,
    paymentMethod?: string,
    search?: string,
    dateFrom?: string,
    dateTo?: string
  ) => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await getAllOrders(
        token, 
        page, 
        20, 
        orderStatus === 'all' ? undefined : orderStatus,
        paymentStatus === 'all' ? undefined : paymentStatus,
        paymentMethod === 'all' ? undefined : paymentMethod,
        search || undefined,
        dateFrom || undefined,
        dateTo || undefined
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
      await fetchOrders(
        currentPage, 
        orderStatusFilter === 'all' ? undefined : orderStatusFilter,
        paymentStatusFilter === 'all' ? undefined : paymentStatusFilter,
        paymentMethodFilter === 'all' ? undefined : paymentMethodFilter,
        searchFilter,
        dateFromFilter,
        dateToFilter
      );
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
      await fetchOrders(
        currentPage, 
        orderStatusFilter === 'all' ? undefined : orderStatusFilter,
        paymentStatusFilter === 'all' ? undefined : paymentStatusFilter,
        paymentMethodFilter === 'all' ? undefined : paymentMethodFilter,
        searchFilter,
        dateFromFilter,
        dateToFilter
      );
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({ variant: "destructive", title: "Failed to update payment status" });
      return false;
    }
  };

  // Helper function to apply all current filters
  const applyFilters = () => {
    fetchOrders(
      1, // Reset to first page when applying filters
      orderStatusFilter === 'all' ? undefined : orderStatusFilter,
      paymentStatusFilter === 'all' ? undefined : paymentStatusFilter,
      paymentMethodFilter === 'all' ? undefined : paymentMethodFilter,
      searchFilter,
      dateFromFilter,
      dateToFilter
    );
    setCurrentPage(1);
  };

  return {
    orders,
    loading,
    currentPage,
    setCurrentPage,
    pagination,
    orderStatusFilter,
    setOrderStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    paymentMethodFilter,
    setPaymentMethodFilter,
    searchFilter,
    setSearchFilter,
    dateFromFilter,
    setDateFromFilter,
    dateToFilter,
    setDateToFilter,
    fetchOrders,
    updateOrderStatus,
    updatePaymentStatus,
    applyFilters
  };
};