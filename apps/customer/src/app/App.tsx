import CustomerPanel from '../features/customer/components/CustomerPanel';
import type { Customer } from '../shared/types/customer';

const previewCustomer: Customer = {
  id: 'customer-preview',
  name: 'Preview Shopper',
  email: 'preview@example.com',
  tier: 'Silver member',
  location: 'Hyderabad',
  phone: '+91 90000 12345',
  primaryAddress: {
    line1: '44 Residency Road',
    city: 'Hyderabad',
    state: 'Telangana',
    zipCode: '500081',
    country: 'India',
  },
  rewardsPoints: 460,
  recentOrders: 2,
  wishlistItems: 5,
};

export function App() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '32px',
        background:
          'radial-gradient(circle at 10% 0%, rgba(23, 74, 120, 0.14), transparent 30%), #f3f5f8',
      }}
    >
      <CustomerPanel customer={previewCustomer} />
    </main>
  );
}
