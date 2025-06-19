import { getSessionIdCookie } from "../cookies/session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
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