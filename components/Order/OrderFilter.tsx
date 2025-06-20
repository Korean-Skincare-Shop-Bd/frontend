import { Search, Filter, X } from "lucide-react";
import { Input } from "../ui/input";
import { CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface OrderFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  orderStatusFilter: string;
  setOrderStatusFilter: (status: string) => void;
  paymentStatusFilter: string;
  setPaymentStatusFilter: (status: string) => void;
  paymentMethodFilter: string;
  setPaymentMethodFilter: (method: string) => void;
  dateFromFilter: string;
  setDateFromFilter: (date: string) => void;
  dateToFilter: string;
  setDateToFilter: (date: string) => void;
  totalOrders: number;
  onApplyFilters: () => void;
}

export const OrderFilters = ({
  searchQuery,
  setSearchQuery,
  orderStatusFilter,
  setOrderStatusFilter,
  paymentStatusFilter,
  setPaymentStatusFilter,
  paymentMethodFilter,
  setPaymentMethodFilter,
  dateFromFilter,
  setDateFromFilter,
  dateToFilter,
  setDateToFilter,
  totalOrders,
  onApplyFilters
}: OrderFiltersProps) => {
  const clearAllFilters = () => {
    setSearchQuery('');
    setOrderStatusFilter('all');
    setPaymentStatusFilter('all');
    setPaymentMethodFilter('all');
    setDateFromFilter('');
    setDateToFilter('');
    onApplyFilters();
  };

  const hasActiveFilters = 
    searchQuery || 
    orderStatusFilter !== 'all' || 
    paymentStatusFilter !== 'all' || 
    paymentMethodFilter !== 'all' || 
    dateFromFilter || 
    dateToFilter;

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (orderStatusFilter !== 'all') count++;
    if (paymentStatusFilter !== 'all') count++;
    if (paymentMethodFilter !== 'all') count++;
    if (dateFromFilter) count++;
    if (dateToFilter) count++;
    return count;
  };

  return (
    <CardHeader>
      <div className="flex lg:flex-row flex-col lg:justify-between lg:items-start gap-4">
        <div className="flex items-center gap-3">
          <CardTitle className="text-lg sm:text-xl">All Orders ({totalOrders})</CardTitle>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} active
            </Badge>
          )}
        </div>
        
        <div className="flex flex-col gap-3 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 lg:flex-none">
            <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder="Search by order number, customer name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full lg:w-80"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex sm:flex-row flex-col gap-2 w-full lg:w-auto">
            {/* Order Status Filter */}
            <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="RETURNED">Returned</SelectItem>
              </SelectContent>
            </Select>

            {/* Payment Status Filter */}
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>

            {/* Payment Method Filter */}
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="CASH_ON_DELIVERY">Cash on Delivery</SelectItem>
                <SelectItem value="BKASH">bKash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filters */}
          <div className="flex sm:flex-row flex-col gap-2 w-full lg:w-auto">
            <div className="flex sm:flex-row flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-xs">From Date</label>
                <Input
                  type="date"
                  value={dateFromFilter}
                  onChange={(e) => setDateFromFilter(e.target.value)}
                  className="w-full sm:w-40"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-xs">To Date</label>
                <Input
                  type="date"
                  value={dateToFilter}
                  onChange={(e) => setDateToFilter(e.target.value)}
                  className="w-full sm:w-40"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex self-end gap-2">
              <Button 
                onClick={onApplyFilters} 
                variant="default" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Apply Filters
              </Button>
              
              {hasActiveFilters && (
                <Button 
                  onClick={clearAllFilters} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-3 border-t">
          <span className="text-muted-foreground text-sm">Active filters:</span>
          
          {searchQuery && (
            <Badge variant="secondary" className="text-xs">
              Search: "{searchQuery}"
              <button 
                onClick={() => setSearchQuery('')}
                className="hover:bg-secondary-foreground/20 ml-1 p-0.5 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {orderStatusFilter !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Order: {orderStatusFilter}
              <button 
                onClick={() => setOrderStatusFilter('all')}
                className="hover:bg-secondary-foreground/20 ml-1 p-0.5 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {paymentStatusFilter !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Payment: {paymentStatusFilter}
              <button 
                onClick={() => setPaymentStatusFilter('all')}
                className="hover:bg-secondary-foreground/20 ml-1 p-0.5 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {paymentMethodFilter !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Method: {paymentMethodFilter === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : 'bKash'}
              <button 
                onClick={() => setPaymentMethodFilter('all')}
                className="hover:bg-secondary-foreground/20 ml-1 p-0.5 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {dateFromFilter && (
            <Badge variant="secondary" className="text-xs">
              From: {new Date(dateFromFilter).toLocaleDateString()}
              <button 
                onClick={() => setDateFromFilter('')}
                className="hover:bg-secondary-foreground/20 ml-1 p-0.5 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {dateToFilter && (
            <Badge variant="secondary" className="text-xs">
              To: {new Date(dateToFilter).toLocaleDateString()}
              <button 
                onClick={() => setDateToFilter('')}
                className="hover:bg-secondary-foreground/20 ml-1 p-0.5 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </CardHeader>
  );
};