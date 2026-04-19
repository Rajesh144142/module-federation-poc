interface OrderSnapshotProps {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  freeShippingThreshold?: number;
  shippingEta?: string;
}

export function OrderSnapshot({
  itemCount,
  subtotal,
  discount,
  shipping,
  tax,
  total,
  freeShippingThreshold,
  shippingEta,
}: OrderSnapshotProps) {
  const remainingForFreeShipping = Math.max((freeShippingThreshold ?? 0) - subtotal, 0);

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="section-label">Checkout module</p>
          <h2>Order snapshot</h2>
        </div>
      </div>

      <dl className="details-list">
        <div>
          <dt>Items in cart</dt>
          <dd>{itemCount}</dd>
        </div>
        <div>
          <dt>Subtotal</dt>
          <dd>Rs. {subtotal}</dd>
        </div>
        <div>
          <dt>Discount</dt>
          <dd>- Rs. {discount}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd>{shipping === 0 ? 'Free' : `Rs. ${shipping}`}</dd>
        </div>
        <div>
          <dt>Tax (8%)</dt>
          <dd>Rs. {tax}</dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd>Rs. {total}</dd>
        </div>
        <div>
          <dt>Delivery ETA</dt>
          <dd>{shippingEta ?? 'Calculated at checkout'}</dd>
        </div>
        <div>
          <dt>Shipping progress</dt>
          <dd>
            {remainingForFreeShipping === 0
              ? 'Free shipping unlocked'
              : `Add Rs. ${remainingForFreeShipping} for free shipping`}
          </dd>
        </div>
      </dl>
    </section>
  );
}
