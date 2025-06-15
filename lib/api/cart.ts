const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Types/Interfaces
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface EnhancedCart {
  id: string;
  items: CartItem[];
  totalAmount: number;
}

export interface EnhancedCartResponse {
  success: boolean;
  data: EnhancedCart;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  variationId?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// API Functions

// GET /enhanced-cart - Get enhanced cart
export const getEnhancedCart = async (): Promise<EnhancedCartResponse> => {
  const response = await fetch(`${API_BASE_URL}/enhanced-cart`);

  if (!response.ok) {
    throw new Error('Failed to fetch enhanced cart');
  }

  return response.json();
};

// POST /enhanced-cart - Add item to enhanced cart
export const addToEnhancedCart = async (
  token: string, 
  cartData: AddToCartRequest
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/enhanced-cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(cartData),
  });

  if (!response.ok) {
    throw new Error('Failed to add item to cart');
  }
};

// PUT /enhanced-cart/items/{itemId} - Update cart item
export const updateCartItem = async (
  token: string,
  itemId: string,
  updateData: UpdateCartItemRequest
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/enhanced-cart/items/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error('Failed to update cart item');
  }
};

// DELETE /enhanced-cart/items/{itemId} - Remove item from cart
export const removeCartItem = async (
  token: string,
  itemId: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/enhanced-cart/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to remove item from cart');
  }
};