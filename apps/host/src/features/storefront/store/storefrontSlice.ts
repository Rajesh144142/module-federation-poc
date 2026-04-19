import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '../../../shared/types/store';

interface StorefrontState {
  cartItems: CartItem[];
  appliedCouponCode: string | null;
}

interface AddToCartPayload {
  product: Product;
}

interface UpdateQuantityPayload {
  itemId: string;
  quantity: number;
}

const initialState: StorefrontState = {
  cartItems: [],
  appliedCouponCode: null,
};

const storefrontSlice = createSlice({
  name: 'storefront',
  initialState,
  reducers: {
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.cartItems = action.payload;
    },
    addToCart(state, action: PayloadAction<AddToCartPayload>) {
      const { product } = action.payload;
      const existing = state.cartItems.find((item) => item.productId === product.id);

      if (existing) {
        existing.quantity += 1;
        return;
      }

      state.cartItems.push({
        id: `cart-${product.id}`,
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
      });
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
    },
    updateCartQuantity(state, action: PayloadAction<UpdateQuantityPayload>) {
      const line = state.cartItems.find((item) => item.id === action.payload.itemId);
      if (!line) {
        return;
      }

      if (action.payload.quantity <= 0) {
        state.cartItems = state.cartItems.filter((item) => item.id !== action.payload.itemId);
        return;
      }

      line.quantity = action.payload.quantity;
    },
    applyCoupon(state, action: PayloadAction<string | null>) {
      state.appliedCouponCode = action.payload;
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  applyCoupon,
} = storefrontSlice.actions;

export const storefrontReducer = storefrontSlice.reducer;
