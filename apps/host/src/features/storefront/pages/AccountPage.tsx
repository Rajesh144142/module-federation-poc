import { ReactNode } from 'react';
import type { OrderSummary } from '../../../shared/types/store';
import { ListSkeleton } from '../../../shared/components/AppLoaders';

interface AccountPageProps {
  customerCard: ReactNode;
  orders: OrderSummary[];
  isOrdersLoading: boolean;
}

export function AccountPage({ customerCard, orders, isOrdersLoading }: AccountPageProps) {
  return (
    <section className="page-stack">
      <section className="panel">
        <p className="section-label">Account</p>
        <h2>Customer profile and preferences</h2>
        <p>Your personal details, address, rewards, and order history summary are managed here.</p>
      </section>

      <section className="panel">
        <p className="section-label">Orders</p>
        <h2>Recent orders</h2>
        {isOrdersLoading ? (
          <ListSkeleton />
        ) : orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <article key={order.id} className="order-card">
                <h3>{order.orderNumber}</h3>
                <p>Status: {order.status}</p>
                <p>Total: Rs. {order.totalAmount}</p>
                <p>Placed: {new Date(order.placedAt).toLocaleDateString()}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {customerCard}
    </section>
  );
}
