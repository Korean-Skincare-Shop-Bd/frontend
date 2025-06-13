"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Mail, MoreHorizontal, UserCheck, UserX } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

// Mock customer interface - replace with actual API interface
interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
}

export function CustomersManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerDetailOpen, setCustomerDetailOpen] = useState(false);
  const { token } = useAdmin();

  // Mock data - replace with actual API calls
  useEffect(() => {
    fetchCustomers();
  }, [token]);

  const fetchCustomers = async () => {
    // Mock implementation - replace with actual API call
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCustomers: Customer[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '+1234567890',
          isActive: true,
          totalOrders: 12,
          totalSpent: 1250.00,
          lastOrderDate: '2024-01-15',
          createdAt: '2023-06-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Emily Chen',
          email: 'emily@example.com',
          isActive: true,
          totalOrders: 8,
          totalSpent: 890.50,
          lastOrderDate: '2024-01-10',
          createdAt: '2023-08-20T14:20:00Z'
        },
        {
          id: '3',
          name: 'Maria Rodriguez',
          email: 'maria@example.com',
          phone: '+1987654321',
          isActive: false,
          totalOrders: 3,
          totalSpent: 245.75,
          lastOrderDate: '2023-12-05',
          createdAt: '2023-11-10T09:15:00Z'
        }
      ];
      
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerDetailOpen(true);
  };

  const handleToggleCustomerStatus = async (customerId: string, isActive: boolean) => {
    try {
      // Add API call to toggle customer status when available
      toast.success(`Customer ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer status:', error);
      toast.error('Failed to update customer status');
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex md:flex-row flex-col md:justify-between md:items-center mb-8">
        <div>
          <h1 className="mb-2 font-bold text-3xl">Customers Management</h1>
          <p className="text-muted-foreground">
            Manage your customer database
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Customers ({customers.length})</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  placeholder="Search customers..."
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
                <TableHead>Orders</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-10 h-10 font-medium text-white">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-muted-foreground text-sm">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {customer.totalOrders} orders
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${customer.totalSpent.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.isActive ? "default" : "destructive"}>
                      {customer.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                          <Eye className="mr-2 w-4 h-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 w-4 h-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleToggleCustomerStatus(customer.id, !customer.isActive)}
                        >
                          {customer.isActive ? (
                            <>
                              <UserX className="mr-2 w-4 h-4" />
                              Deactivate Account
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 w-4 h-4" />
                              Activate Account
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredCustomers.length === 0 && (
            <div className="py-8 text-muted-foreground text-center">
              No customers found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={customerDetailOpen} onOpenChange={setCustomerDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-16 h-16 font-medium text-white text-xl">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-xl">{selectedCustomer.name}</h3>
                  <div className="text-muted-foreground">{selectedCustomer.email}</div>
                  {selectedCustomer.phone && (
                    <div className="text-muted-foreground">{selectedCustomer.phone}</div>
                  )}
                </div>
              </div>

              <div className="gap-4 grid grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <div className="mb-1 text-muted-foreground text-sm">Total Orders</div>
                  <div className="font-semibold text-2xl">{selectedCustomer.totalOrders}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="mb-1 text-muted-foreground text-sm">Total Spent</div>
                  <div className="font-semibold text-2xl">${selectedCustomer.totalSpent.toFixed(2)}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="mb-1 text-muted-foreground text-sm">Status</div>
                  <Badge variant={selectedCustomer.isActive ? "default" : "destructive"}>
                    {selectedCustomer.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="mb-1 text-muted-foreground text-sm">Customer Since</div>
                  <div className="font-medium">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {selectedCustomer.lastOrderDate && (
                <div>
                  <h4 className="mb-2 font-semibold">Last Order</h4>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between">
                      <span>Date</span>
                      <span>{new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button>View Orders</Button>
                <Button variant="outline">Send Email</Button>
                <Button 
                  variant={selectedCustomer.isActive ? "destructive" : "default"}
                  onClick={() => handleToggleCustomerStatus(selectedCustomer.id, !selectedCustomer.isActive)}
                >
                  {selectedCustomer.isActive ? 'Deactivate Account' : 'Activate Account'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}