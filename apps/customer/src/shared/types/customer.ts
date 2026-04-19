export interface Address {
  line1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Customer {
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

export interface CustomerPanelProps {
  customer?: Customer;
  authToken?: string | null;
  apiBaseUrl?: string;
}
