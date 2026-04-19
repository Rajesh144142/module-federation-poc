import { ReactNode } from 'react';
import { OrderSnapshot } from '../components/OrderSnapshot';

interface CheckoutPageProps {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  freeShippingThreshold?: number;
  shippingEta?: string;
  onOpenCart: () => void;
  customerCard: ReactNode;
}

export function CheckoutPage({
  itemCount,
  subtotal,
  discount,
  shipping,
  tax,
  total,
  freeShippingThreshold,
  shippingEta,
  onOpenCart,
  customerCard,
}: CheckoutPageProps) {
  return (
    <section className="checkout-layout">
      <OrderSnapshot
        itemCount={itemCount}
        subtotal={subtotal}
        discount={discount}
        shipping={shipping}
        tax={tax}
        total={total}
        freeShippingThreshold={freeShippingThreshold}
        shippingEta={shippingEta}
      />

      <section className="panel checkout-actions-panel">
        <p className="section-label">Final step</p>
        <h2>Review your cart before payment</h2>
        <p>Use the cart panel to update quantity or remove items, then proceed to checkout.</p>
        <button type="button" className="primary-inline" onClick={onOpenCart}>
          Open cart summary
        </button>
      </section>

      {customerCard}
    </section>
  );
}
