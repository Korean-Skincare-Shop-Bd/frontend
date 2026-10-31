import {
  getAllOrders,
  UpdateOrderStatusRequest,
  updateEnhancedOrderStatus,
  UpdatePaymentStatusRequest,
  updateEnhancedOrderPaymentStatus,
} from "@/lib/api/orders";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "./use-toast";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 500;

const EMPTY_PAGINATION = {
  total: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
  page: 1,
  limit: PAGE_SIZE,
};

export const useOrders = (isAuthenticated: boolean) => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  // searchFilter follows the input; appliedSearch is what the query uses (debounced).
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [appliedSearch, setAppliedSearch] = useState<string>('');
  const [dateFromFilter, setDateFromFilter] = useState<string>('');
  const [dateToFilter, setDateToFilter] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedSearch(searchFilter);
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchFilter]);

  const filters = {
    page: currentPage,
    orderStatus: orderStatusFilter === 'all' ? undefined : orderStatusFilter,
    paymentStatus: paymentStatusFilter === 'all' ? undefined : paymentStatusFilter,
    paymentMethod: paymentMethodFilter === 'all' ? undefined : paymentMethodFilter,
    search: appliedSearch || undefined,
    dateFrom: dateFromFilter || undefined,
    dateTo: dateToFilter || undefined,
  };

  const query = useQuery({
    queryKey: queryKeys.orders(filters),
    queryFn: () =>
      getAllOrders(
        filters.page,
        PAGE_SIZE,
        filters.orderStatus,
        filters.paymentStatus,
        filters.paymentMethod,
        filters.search,
        filters.dateFrom,
        filters.dateTo
      ),
    enabled: isAuthenticated,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (query.isError) {
      console.error('Error fetching orders:', query.error);
      toast({ variant: "destructive", title: "Failed to fetch orders" });
    }
  }, [query.isError, query.error]);

  const refreshOrders = () => queryClient.invalidateQueries({ queryKey: ["orders"] });

  const statusMutation = useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: UpdateOrderStatusRequest }) =>
      updateEnhancedOrderStatus(orderId, data),
    onSuccess: refreshOrders,
  });

  const paymentMutation = useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: UpdatePaymentStatusRequest }) =>
      updateEnhancedOrderPaymentStatus(orderId, data),
    onSuccess: refreshOrders,
  });

  const updateOrderStatus = async (orderId: string, status: string, notes?: string) => {
    if (!isAuthenticated) return false;

    try {
      await statusMutation.mutateAsync({
        orderId,
        data: { orderStatus: status as any, notes },
      });
      toast({ variant: "default", title: "Order status updated successfully" });
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({ variant: "destructive", title: "Failed to update order status" });
      return false;
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string, notes?: string) => {
    if (!isAuthenticated) return false;

    try {
      await paymentMutation.mutateAsync({
        orderId,
        data: { paymentStatus: paymentStatus as any, notes },
      });
      toast({ variant: "default", title: "Payment status updated successfully" });
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({ variant: "destructive", title: "Failed to update payment status" });
      return false;
    }
  };

  // Apply the current filters right away (skips the search debounce) and go back to page 1.
  const applyFilters = () => {
    const unchanged = appliedSearch === searchFilter && currentPage === 1;
    setAppliedSearch(searchFilter);
    setCurrentPage(1);
    if (unchanged) void query.refetch();
  };

  return {
    orders: query.data?.data.orders ?? [],
    // First load only: later fetches keep the previous rows on screen.
    loading: query.isLoading,
    currentPage,
    setCurrentPage,
    pagination: query.data?.data.pagination ?? EMPTY_PAGINATION,
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
    refreshOrders,
    updateOrderStatus,
    updatePaymentStatus,
    applyFilters,
  };
};
