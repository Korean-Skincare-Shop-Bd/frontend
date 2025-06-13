"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { getOrders, Order } from '@/lib/api/orders';
import { useAdmin } from '@/contexts/AdminContext';

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const { token } = useAdmin();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await getOrders(token, currentPage, 10);
        setOrders(response.data);
        setTotalOrders(response.total);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, currentPage]);

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

  const filteredOrders = Array.isArray(orders)
    ? orders.filter(order =>
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                <div className="bg-gray-200 rounded-full w-10 h-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="bg-gray-200 rounded w-3/4 h-4"></div>
                  <div className="bg-gray-200 rounded w-1/2 h-3"></div>
                </div>
                <div className="bg-gray-200 rounded w-20 h-4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recent Orders</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-8 h-8 font-medium text-white text-sm">
                      {order.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-muted-foreground text-sm">{order.customerEmail}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{order.orderNumber}</TableCell>
                <TableCell className="font-medium">${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 w-4 h-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Order</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Cancel Order
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
            No orders found matching your search.
          </div>
        )}
      </CardContent>
    </Card>
  );
}