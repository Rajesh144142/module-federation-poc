export interface CartItem {
  id: string;
  productId?: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface MiniCartProps {
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
