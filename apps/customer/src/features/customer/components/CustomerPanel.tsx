import { useEffect, useState } from 'react';
import { AccountStats } from './AccountStats';
import { AddressCard } from './AddressCard';
import type { CustomerPanelProps } from '../../../shared/types/customer';
import { getCustomerProfile } from '../api/customerApi';
import '../styles/customer.css';

function CustomerPanel({ customer, authToken, apiBaseUrl }: CustomerPanelProps) {
  const [remoteCustomer, setRemoteCustomer] = useState(customer ?? null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setRemoteCustomer(customer ?? null);
  }, [customer]);

  useEffect(() => {
    if (!authToken) {
      return;
    }

    let active = true;
    setIsFetching(true);
    getCustomerProfile(authToken, apiBaseUrl)
      .then((profile) => {
        if (active) {
          setRemoteCustomer(profile);
        }
      })
      .catch(() => {
        // Keep existing fallback customer data if remote fetch fails.
      })
      .finally(() => {
        if (active) {
          setIsFetching(false);
        }
      });

    return () => {
      active = false;
    };
  }, [authToken, apiBaseUrl]);

  if (isFetching && !remoteCustomer) {
    return (
      <article className="customer-card">
        <p className="customer-label">Customer module</p>
        <div className="customer-skeleton customer-skeleton-title" />
        <div className="customer-skeleton customer-skeleton-line" />
        <div className="customer-skeleton customer-skeleton-line short" />
        <div className="customer-skeleton customer-skeleton-card" />
        <div className="customer-skeleton customer-skeleton-card" />
      </article>
    );
  }

  if (!remoteCustomer) {
    return (
      <article className="customer-card">
        <p className="customer-label">Customer module</p>
        <h2>Customer details unavailable</h2>
      </article>
    );
  }

  return (
    <article className="customer-card">
      <p className="customer-label">Customer module</p>
      <h2>{remoteCustomer.name}</h2>
      <p className="customer-tier">{remoteCustomer.tier}</p>

      <div className="customer-meta">
        <div>
          <span>Email</span>
          <strong>{remoteCustomer.email}</strong>
        </div>
        <div>
          <span>Phone</span>
          <strong>{remoteCustomer.phone}</strong>
        </div>
        <div>
          <span>Member ID</span>
          <strong>{remoteCustomer.id}</strong>
        </div>
      </div>

      <AddressCard address={remoteCustomer.primaryAddress} />
      <AccountStats
        rewardsPoints={remoteCustomer.rewardsPoints}
        recentOrders={remoteCustomer.recentOrders}
        wishlistItems={remoteCustomer.wishlistItems}
      />
    </article>
  );
}

export default CustomerPanel;
