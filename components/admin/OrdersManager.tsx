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

// Constants

// Utility functions








// Main component
export function OrdersManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const { token } = useAdmin();

  const {
    orders,
    loading,
    currentPage,
    setCurrentPage,
    pagination, // Changed from totalOrders
    statusFilter,
    setStatusFilter,
    fetchOrders,
    updateOrderStatus,
    updatePaymentStatus
  } = useOrders(token);

  useEffect(() => {
    console.log(statusFilter)
    fetchOrders(currentPage, statusFilter === 'all' ? undefined : statusFilter);
  }, [token, currentPage, statusFilter]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success && selectedOrder?.id === orderId) {
      // Update the selected order in the dialog
      const updatedOrder = orders.find(o => o.id === orderId);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  };

  const handlePaymentStatusUpdate = async (orderId: string, paymentStatus: string) => {
    const success = await updatePaymentStatus(orderId, paymentStatus);
    if (success && selectedOrder?.id === orderId) {
      // Update the selected order in the dialog
      const updatedOrder = orders.find(o => o.id === orderId);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  };

  const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()); // Changed from customerEmail

    return matchesSearch;
  }) : [];

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
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          totalOrders={pagination.total} // Use pagination.total
        />

        <CardContent className="p-0 sm:p-6">
          {/* Mobile Card View */}
          <div className="lg:hidden block">
            {filteredOrders.map((order) => (
              <MobileOrderCard
                key={order.id}
                order={order}
                onViewOrder={handleViewOrder}
                onUpdateStatus={handleStatusUpdate}
                onUpdatePaymentStatus={handlePaymentStatusUpdate} // Add this
              />
            ))}

            {filteredOrders.length === 0 && <EmptyOrdersState />}
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
                {filteredOrders.map((order) => (
                  <OrderTableRow
                    key={order.id}
                    order={order}
                    onViewOrder={handleViewOrder}
                    onUpdateStatus={handleStatusUpdate}
                    onUpdatePaymentStatus={handlePaymentStatusUpdate} // Add this
                  />
                ))}
              </TableBody>
            </Table>

            {filteredOrders.length === 0 && <EmptyOrdersState />}
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        order={selectedOrder}
        open={orderDetailOpen}
        onOpenChange={setOrderDetailOpen}
        onUpdateStatus={handleStatusUpdate}
        onUpdatePaymentStatus={handlePaymentStatusUpdate} // Add this
      />

      {/* Pagination could be added here */}
      {pagination.total > 20 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={!pagination.hasPrev}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}