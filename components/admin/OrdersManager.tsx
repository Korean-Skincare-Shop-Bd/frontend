"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, FileText, MoreHorizontal, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getOrders, Order } from '@/lib/api/orders';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const { token } = useAdmin();

  useEffect(() => {
    fetchOrders();
  }, [token, currentPage]);

  const fetchOrders = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await getOrders(token, currentPage, 20);
      setOrders(response.data);
      setTotalOrders(response.total);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
            setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      // Add API call to update order status when available
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  if (loading) {
    return (
      <div className="mx-auto px-4 py-8 container">
        <div className="space-y-4 animate-pulse">
          <div className="bg-gray-200 rounded w-1/4 h-8"></div>
          <div className="bg-gray-200 rounded h-10"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded h-16"></div>
            ))}
          </div>
        </div>
      </div>
    );
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
    <CardHeader>
      <div className="flex lg:flex-row flex-col lg:justify-between lg:items-center gap-4">
        <CardTitle className="text-lg sm:text-xl">All Orders ({totalOrders})</CardTitle>
        <div className="flex sm:flex-row flex-col gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-0 sm:p-6">
      {/* Mobile Card View */}
      <div className="lg:hidden block">
        {filteredOrders.map((order) => (
          <div key={order.id} className="p-4 border-b last:border-b-0">
            <div className="flex justify-between items-start gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-medium text-sm">{order.orderNumber}</div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-muted-foreground text-xs">
                  {order.items?.length || 0} items • {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                    <Eye className="mr-2 w-4 h-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'processing')}>
                    <Package className="mr-2 w-4 h-4" />
                    Mark Processing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'shipped')}>
                    <Truck className="mr-2 w-4 h-4" />
                    Mark Shipped
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'delivered')}>
                    <CheckCircle className="mr-2 w-4 h-4" />
                    Mark Delivered
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 w-4 h-4" />
                    Generate Invoice
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="flex flex-shrink-0 justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-8 h-8 font-medium text-white text-sm">
                {order.customerName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{order.customerName}</div>
                <div className="text-muted-foreground text-xs truncate">{order.customerEmail}</div>
              </div>
              <div className="font-semibold text-lg">
                ${order.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
        
        {filteredOrders.length === 0 && (
          <div className="py-8 text-muted-foreground text-center">
            No orders found matching your criteria.
          </div>
        )}
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
              <TableRow key={order.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.orderNumber}</div>
                    <div className="text-muted-foreground text-sm">
                      {order.items?.length || 0} items
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-shrink-0 justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-8 h-8 font-medium text-white text-sm">
                      {order.customerName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{order.customerName}</div>
                      <div className="text-muted-foreground text-sm truncate">{order.customerEmail}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  ${order.totalAmount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                        <Eye className="mr-2 w-4 h-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'processing')}>
                        <Package className="mr-2 w-4 h-4" />
                        Mark Processing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'shipped')}>
                        <Truck className="mr-2 w-4 h-4" />
                        Mark Shipped
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'delivered')}>
                        <CheckCircle className="mr-2 w-4 h-4" />
                        Mark Delivered
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="mr-2 w-4 h-4" />
                        Generate Invoice
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredOrders.length === 0 && (
          <div className="py-8 text-muted-foreground text-center">
            No orders found matching your criteria.
          </div>
        )}
      </div>
    </CardContent>
  </Card>

  {/* Order Detail Dialog */}
  <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
    <DialogContent className="mx-4 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-lg sm:text-xl">
          Order Details - {selectedOrder?.orderNumber}
        </DialogTitle>
      </DialogHeader>
      {selectedOrder && (
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold text-sm sm:text-base">Customer Information</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                <p><strong>Email:</strong> <span className="break-all">{selectedOrder.customerEmail}</span></p>
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-sm sm:text-base">Order Information</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                <p className="flex items-center gap-2"><strong>Status:</strong> 
                  <Badge className={`text-xs ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </Badge>
                </p>
                <p><strong>Total:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="mb-3 font-semibold text-sm sm:text-base">Order Items</h3>
            
            {/* Mobile Items View */}
            <div className="sm:hidden block space-y-3">
              {selectedOrder.items?.map((item) => (
                <div key={item.id} className="p-3 border rounded-lg">
                  <div className="mb-1 font-medium text-sm">{item.productName}</div>
                  <div className="flex justify-between items-center text-muted-foreground text-sm">
                    <span>Qty: {item.quantity}</span>
                    <span>${item.price.toFixed(2)} each</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">Total:</span>
                    <span className="font-semibold">${item.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Items Table */}
            <div className="hidden sm:block border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder.items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.productName}</div>
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell className="font-medium text-right">${item.totalPrice.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex sm:flex-row flex-col gap-2">
            <Button 
              onClick={() => handleStatusUpdate(selectedOrder.id, 'processing')}
              className="flex-1 sm:flex-none"
              size="sm"
            >
              Mark Processing
            </Button>
            <Button 
              onClick={() => handleStatusUpdate(selectedOrder.id, 'shipped')}
              className="flex-1 sm:flex-none"
              size="sm"
            >
              Mark Shipped
            </Button>
            <Button 
              onClick={() => handleStatusUpdate(selectedOrder.id, 'delivered')}
              className="flex-1 sm:flex-none"
              size="sm"
            >
              Mark Delivered
            </Button>
            <Button 
              variant="outline"
              className="flex-1 sm:flex-none"
              size="sm"
            >
              Generate Invoice
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
</div>
  );
}