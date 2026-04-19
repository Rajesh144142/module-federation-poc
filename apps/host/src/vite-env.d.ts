/// <reference types="vite/client" />

declare module 'customer/CustomerPanel' {
  import { ComponentType } from 'react';

  interface Address {
    line1: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }

  interface Customer {
    id: string;
    name: string;
    email: string;
    tier: string;
    location: string;
    phone: string;
    primaryAddress: Address;
    rewardsPoints: number;
    recentOrders: number;
    wishlistItems: number;
  }

  interface CustomerPanelProps {
    customer?: Customer;
    authToken?: string | null;
    apiBaseUrl?: string;
  }

  const CustomerPanel: ComponentType<CustomerPanelProps>;
  export default CustomerPanel;
}

declare module 'cart/MiniCart' {
  import { ComponentType } from 'react';

  interface CartItem {
    id: string;
    productName: string;
    quantity: number;
    price: number;
  }

  interface MiniCartProps {
    customerName: string;
    items: CartItem[];
    isLoading: boolean;
    authToken?: string | null;
    apiBaseUrl?: string;
    couponCode: string | null;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    isOpen: boolean;
    onClose: () => void;
    onContinueShopping: () => void;
    onRemoveItem: (itemId: string) => void;
    onUpdateQuantity: (itemId: string, quantity: number) => void;
    onClearCoupon: () => void;
  }

  const MiniCart: ComponentType<MiniCartProps>;
  export default MiniCart;
}
