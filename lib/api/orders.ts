import { getSessionIdCookie } from "../cookies/session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  billingAddress: string;
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  paymentMethod: 'CASH_ON_DELIVERY' | 'CARD' | 'MOBILE_BANKING';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  creationMethod: 'CUSTOMER' | 'ADMIN';
  invoiceUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdByAdminId?: string | null;
  cartSessionId: string;
  createdByAdmin?: any | null;
  items:OrderItem[]
  _count: {
    items: number;
  };
  itemCount: number;
}
export interface OrderItem {
  id: string;
  orderId: string;
  productVariationId: string;
  quantity: number;
  priceAtPurchase: string;
  originalPrice: string | null;
  discountAmount: string | null;
  discountPercentage: string | null;
  productName: string;
  variationName: string;
  createdAt: string;
  productVariation: {
    id: string;
    productId: string;
    name: string;
    price: string;
    salePrice: string;
    discount: string | null;
    volume: string;
    stockQuantity: number;
    imageUrl: string | null;
    attributes: Record<string, any>;
    tags: string[];
    weightGrams: string;
    createdAt: string;
    updatedAt: string;
    product: {
      id: string;
      name: string;
      baseImageUrl: string;
    };
  };
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variationId: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export const getOrders = async (token: string, page = 1, limit = 20): Promise<{ data: Order[]; total: number }> => {
  const response = await fetch(`${API_BASE_URL}/admins/orders/history?page=${page}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json();
};

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CheckoutRequest {
  sessionId: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: 'CASH_ON_DELIVERY' | 'CARD' | 'MOBILE_BANKING';
  notes?: string;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    reservationIds: string[];
    checkoutMethod: string;
    calculatedTotal: number;
    subtotal: number;
    totalDiscount: number;
    shippingFee: number;
  };
}

export interface CheckoutError {
  success: false;
  message: string;
  errors: string[];
}

export interface CheckoutReadinessResponse {
  ready: boolean;
  issues: string[];
  summary: {
    itemCount: number;
    totalAmount: number;
    estimatedCheckoutTime: number;
  };
}

export const processCheckout = async (checkoutData: CheckoutRequest): Promise<CheckoutResponse> => {
  const response = await fetch(`${API_BASE_URL}/orders/enhanced/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(checkoutData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    
    if (response.status === 400 || response.status === 422) {
      throw new Error(errorData?.message || 'Checkout validation failed');
    }
    
    if (response.status === 404) {
      throw new Error('Cart session not found');
    }
    
    throw new Error(errorData?.message || 'Failed to process checkout');
  }

  return response.json();
};

export const checkCheckoutReadiness = async (): Promise<CheckoutReadinessResponse> => {
    const sessionId = await getSessionIdCookie();
  const response = await fetch(`${API_BASE_URL}/orders/enhanced/checkout-readiness/${sessionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    
    if (response.status === 400) {
      throw new Error('Invalid session ID');
    }
    
    if (response.status === 404) {
      throw new Error('Cart session not found');
    }
    
    throw new Error(errorData?.message || 'Failed to check checkout readiness');
  }

  return response.json();
};
// Add these new interfaces
export interface UpdateOrderStatusRequest {
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  notes?: string;
}

export interface UpdatePaymentStatusRequest {
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  notes?: string;
}

export interface EnhancedOrderResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    orderNumber: string;
    orderStatus?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    customerName: string;
    totalAmount: number;
    updatedAt: string;
  };
}

export interface OrdersListResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

// Add these new API functions
export const getAllOrders = async (
  token: string, 
  page = 1, 
  limit = 10, 
  status?: string
): Promise<OrdersListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (status) {
    params.append('status', status);
  }

  const response = await fetch(`${API_BASE_URL}/orders?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json();
};

export const updateEnhancedOrderStatus = async (
  token: string,
  orderId: string,
  statusData: UpdateOrderStatusRequest
): Promise<EnhancedOrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/orders/enhanced/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(statusData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    
    if (response.status === 400) {
      throw new Error(errorData?.error || 'Invalid request data');
    }
    
    if (response.status === 401) {
      throw new Error('Unauthorized access');
    }
    
    if (response.status === 404) {
      throw new Error('Order not found');
    }
    
    throw new Error(errorData?.message || 'Failed to update order status');
  }

  return response.json();
};

export const updateEnhancedOrderPaymentStatus = async (
  token: string,
  orderId: string,
  paymentData: UpdatePaymentStatusRequest
): Promise<EnhancedOrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/orders/enhanced/${orderId}/payment-status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    
    if (response.status === 400) {
      throw new Error(errorData?.error || 'Invalid payment status transition');
    }
    
    if (response.status === 401) {
      throw new Error('Unauthorized access');
    }
    
    if (response.status === 404) {
      throw new Error('Order not found');
    }
    
    throw new Error(errorData?.message || 'Failed to update payment status');
  }

  return response.json();
};