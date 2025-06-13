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