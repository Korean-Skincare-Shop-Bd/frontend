"use client";

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useOrders } from '@/hooks/use-orders';
import {
  Order,
} from '@/lib/api/orders';
import { useAdmin } from '@/contexts/AdminContext';
import { OrderFilters } from '../Order/OrderFilter';
import { EmptyOrdersState } from '../Order/EmptyOrderState';
import { OrdersLoading } from '../Order/Loading';
import { OrderDetailDialog } from '../Order/OrderDetailDialog';
import { OrderTableRow } from '../Order/OrderTableRows';
import { MobileOrderCard } from '../Order/MobileOrderCard';

// Main component
export function OrdersManager() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const { token } = useAdmin();

  const {
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
  } = useOrders(token);

  // Initial load and when filters change (except search - search is debounced)
  useEffect(() => {
    fetchOrders(
      currentPage,
      orderStatusFilter === 'all' ? undefined : orderStatusFilter,
      paymentStatusFilter === 'all' ? undefined : paymentStatusFilter,
      paymentMethodFilter === 'all' ? undefined : paymentMethodFilter,
      searchFilter || undefined,
      dateFromFilter || undefined,
      dateToFilter || undefined
    );
  }, [
    token, 
    currentPage, 
    orderStatusFilter, 
    paymentStatusFilter, 
    paymentMethodFilter,
    dateFromFilter,
    dateToFilter
  ]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        // If already on page 1, just apply filters
        applyFilters();
      } else {
        // If not on page 1, reset to page 1 and apply filters
        setCurrentPage(1);
        // The above useEffect will handle the API call
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchFilter]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string, notes?: string) => {
    const success = await updateOrderStatus(orderId, newStatus, notes);
    if (success && selectedOrder?.id === orderId) {
      // Update the selected order in the dialog
      const updatedOrder = orders.find(o => o.id === orderId);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  };

  const handlePaymentStatusUpdate = async (orderId: string, paymentStatus: string, notes?: string) => {
    const success = await updatePaymentStatus(orderId, paymentStatus, notes);
    if (success && selectedOrder?.id === orderId) {
      // Update the selected order in the dialog
      const updatedOrder = orders.find(o => o.id === orderId);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  };

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <OrdersLoading />;
  }

  return (
    <div className="mx-auto px-4 py-8 container">
      <div className="flex md:flex-row flex-col md:justify-between md:items-start gap-4 mb-8">
        <div className="flex-1">
          <h1 className="mb-2 font-bold text-2xl sm:text-3xl">Orders Management</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage customer orders and fulfillment
          </p>
        </div>
      </div>

      <Card>
        <OrderFilters
          searchQuery={searchFilter}
          setSearchQuery={setSearchFilter}
          orderStatusFilter={orderStatusFilter}
          setOrderStatusFilter={setOrderStatusFilter}
          paymentStatusFilter={paymentStatusFilter}
          setPaymentStatusFilter={setPaymentStatusFilter}
          paymentMethodFilter={paymentMethodFilter}
          setPaymentMethodFilter={setPaymentMethodFilter}
          dateFromFilter={dateFromFilter}
          setDateFromFilter={setDateFromFilter}
          dateToFilter={dateToFilter}
          setDateToFilter={setDateToFilter}
          totalOrders={pagination.total}
          onApplyFilters={applyFilters}
        />

        <CardContent className="p-0 sm:p-6">
          {/* Mobile Card View */}
          <div className="lg:hidden block">
            {orders.map((order) => (
              <MobileOrderCard
                key={order.id}
                order={order}
                onViewOrder={handleViewOrder}
                onUpdateStatus={handleStatusUpdate}
                onUpdatePaymentStatus={handlePaymentStatusUpdate}
              />
            ))}

            {orders.length === 0 && <EmptyOrdersState />}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
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
                  <OrderTableRow
                    key={order.id}
                    order={order}
                    onViewOrder={handleViewOrder}
                    onUpdateStatus={handleStatusUpdate}
                    onUpdatePaymentStatus={handlePaymentStatusUpdate}
                  />
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

      {/* Enhanced Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex sm:flex-row flex-col justify-between items-center gap-4 mt-6">
          <div className="text-muted-foreground text-sm">
            Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} orders
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={!pagination.hasPrev}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrev}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {/* Show page numbers around current page */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum=1;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="p-0 w-8 h-8"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={!pagination.hasNext}
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}