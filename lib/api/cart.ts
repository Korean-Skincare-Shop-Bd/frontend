'use client';

// import { useToast } from '@/hooks/use-toast';
import { setSessionIdCookie, getSessionIdCookie, removeSessionIdCookie } from '../cookies/session';
// import { Description } from '@radix-ui/react-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Type Definitions ---
export interface CartItem {
  productId: string;
  quantity: number;
  totalPrice: number;
  variantId: string;
  addedAt: string;
  productData: {
    name: string;
    price: number;
    imageUrl: string;
    variantName: string;
  };
}

export interface EnhancedCart {
  sessionId: string;
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface EnhancedCartResponse {
  message?: string;
  data: {
    cart: EnhancedCart;
    sessionId: string;
    isNewCart: boolean;
    reservation: any;
    enhanced: boolean;
  };
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  variantId: string;
  sessionId?: string;
}

// --- API Functions ---
export const addToEnhancedCart = async (
  cartData: Omit<AddToCartRequest, 'sessionId'>
): Promise<EnhancedCartResponse> => {
  const existingSessionId = await getSessionIdCookie();
  // const toast = useToast()
  const body = existingSessionId
    ? { ...cartData, sessionId: existingSessionId }
    : cartData;
  console.log(body)
  try {
    const response = await fetch(`${API_BASE_URL}/enhanced-cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      // credentials: 'include',
      next: { tags: ['cart'] } // For revalidation
    });

    const data = await response.json();
    console.log(data)
    // toast.toast({ description: data.message })

    if (!response.ok) {
      throw new Error(data?.message || 'Failed to add item to cart');
    }

    if (data?.data?.sessionId) {
      await setSessionIdCookie(data.data.sessionId, false);
    }

    return data;
  } catch (error) {
    console.error('Cart API Error:', error);
    throw error;
  }
};

export const getEnhancedCart = async (): Promise<EnhancedCartResponse> => {
  const sessionId = await getSessionIdCookie();
  if (!sessionId) throw new Error('No cart session found');

  try {
    const response = await fetch(`${API_BASE_URL}/enhanced-cart/${sessionId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // credentials: 'include',
      next: { tags: ['cart'] } // For revalidation
    });

    if (!response.ok) {
      throw new Error('Failed to fetch enhanced cart');
    }
    console.log(response.body)

    return response.json();
  } catch (error) {
    console.error('Cart API Error:', error);
    throw error;
  }
};

// Server Action for cart operations
export async function updateCartItem(
  token: string,
  itemId: string,
  updateData: { quantity: number }
) {
  try {
    const response = await fetch(`${API_BASE_URL}/enhanced-cart/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
      credentials: 'include',
      next: { tags: ['cart'] }
    });

    if (!response.ok) {
      throw new Error('Failed to update cart item');
    }
  } catch (error) {
    console.error('Cart API Error:', error);
    throw error;
  }
}

// Server Action for cart operations
export async function removeCartItem(token: string, itemId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/enhanced-cart/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      next: { tags: ['cart'] }
    });

    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }
  } catch (error) {
    console.error('Cart API Error:', error);
    throw error;
  }
}

export const prepareCheckout = async (): Promise<any> => {
  const sessionId = await getSessionIdCookie();
  if (!sessionId) throw new Error('No cart session found');

  try {
    const response = await fetch(`${API_BASE_URL}/enhanced-cart/${sessionId}/prepare-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // credentials: 'include',
      next: { tags: ['cart'] }
    });

    if (!response.ok) {
      throw new Error('Failed to prepare cart for checkout');
    }

    const data = response.json();

    await setSessionIdCookie(sessionId, true);

    return data;
  } catch (error) {
    console.error('Checkout Preparation Error:', error);
    throw error;
  }
};