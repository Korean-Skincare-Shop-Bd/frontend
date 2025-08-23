"use client";

// import { useToast } from '@/hooks/use-toast';
import {
  setSessionIdCookie,
  getSessionIdCookie,
  removeSessionIdCookie,
} from "../cookies/session";
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
  cartData: Omit<AddToCartRequest, "sessionId">
): Promise<EnhancedCartResponse> => {
  const existingSessionId = await getSessionIdCookie();
  const body = existingSessionId
    ? { ...cartData, sessionId: existingSessionId }
    : cartData;
  console.log(body);
  try {
    const response = await fetch(`${API_BASE_URL}/enhanced-cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // credentials: 'include',
      next: { tags: ["cart"] }, // For revalidation
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(data?.message || "Failed to add item to cart");
    }

    if (data?.data?.sessionId) {
      await setSessionIdCookie(data.data.sessionId, false);
    }

    // Dispatch cart update event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    }

    return data;
  } catch (error) {
    console.error("Cart API Error:", error);
    throw error;
  }
};

export const getEnhancedCart = async (): Promise<EnhancedCartResponse> => {
  const sessionId = await getSessionIdCookie();
  if (!sessionId) {
    return {
      message: "No session found",
      data: {
        cart: {
          sessionId: "",
          items: [],
          itemCount: 0,
          totalPrice: 0,
          createdAt: "",
          updatedAt: "",
          expiresAt: "",
        },
        sessionId: "",
        isNewCart: false,
        reservation: null,
        enhanced: false,
      },
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/enhanced-cart/${sessionId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // credentials: 'include',
      next: { tags: ["cart"] }, // For revalidation
    });

    if (!response.ok) {
      throw new Error("Failed to fetch enhanced cart");
    }
    console.log(response.body);

    return response.json();
  } catch (error) {
    console.error("Cart API Error:", error);
    throw error;
  }
};

// Server Action for cart operations
export async function updateCartItemQuantity(
  variationId: string,
  quantity: number
) {
  console.log(variationId);
  const sessionId = await getSessionIdCookie();
  if (!sessionId) {
    throw new Error("No cart session found. Please create a cart first.");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/enhanced-cart/variation/${variationId}/quantity?variationId=${variationId}&enhanced_cart_session_id=${sessionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity, sessionId }),
        next: { tags: ["cart"] },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Attach error details if available
      const errorMsg = data?.message || "Failed to update cart item quantity";
      const errorDetails = data?.details
        ? ` Details: ${JSON.stringify(data.details)}`
        : "";
      throw new Error(`${errorMsg}${errorDetails}`);
    }

    // Dispatch cart update event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    }

    return data;
  } catch (error) {
    console.error("Cart API Error:", error);
    throw error;
  }
}

// Option 2: Bulk update stock for multiple variations
export async function updateCartItemsStockBulk(
  token: string,
  stockUpdates: Array<{ variationId: string; stockQuantity: number }>
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/enhanced-cart/stock/bulk-update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stockUpdates }),
        credentials: "include",
        next: { tags: ["cart"] },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to bulk update stock: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Cart API Error:", error);
    throw error;
  }
}

// Server Action for cart operations
export async function removeCartItem(productId: string, variantId: string) {
  try {
    const requestBody: {
      productId: string;
      variantId: string;
      sessionId?: string;
    } = {
      productId,
      variantId,
    };

    // Add sessionId to body if provided (Method 2 - Explicit)
    const sessionId = await getSessionIdCookie();
    if (sessionId) {
      requestBody.sessionId = sessionId;
    } else {
      console.error("No session ID found. Please refresh the page or try again.");
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/enhanced-cart/remove?enhanced_cart_session_id=${sessionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        next: { tags: ["cart"] },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to remove item from cart: ${errorText}`);
    }

    // Dispatch cart update event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    }

    return await response.json();
  } catch (error) {
    console.error("Cart API Error:", error);
    throw error;
  }
}
export const prepareCheckout = async (): Promise<any> => {
  const sessionId = await getSessionIdCookie();
  if (!sessionId) throw new Error("No cart session found");

  try {
    const response = await fetch(
      `${API_BASE_URL}/enhanced-cart/${sessionId}/prepare-checkout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // credentials: 'include',
        next: { tags: ["cart"] },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to prepare cart for checkout");
    }

    const data = response.json();

    await setSessionIdCookie(sessionId, true);

    return data;
  } catch (error) {
    console.error("Checkout Preparation Error:", error);
    throw error;
  }
};

// Clear cart after successful order
export const clearCart = async (): Promise<void> => {
  await removeSessionIdCookie();
  // Dispatch cart update event
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  }
};
