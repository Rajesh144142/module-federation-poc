import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Customer } from '../../shared/types/store';

interface CustomerState {
  currentCustomer: Customer;
}

const initialState: CustomerState = {
  currentCustomer: {
    id: 'customer-101',
    name: 'Ava Johnson',
    email: 'ava.johnson@example.com',
    tier: 'Gold member',
    location: 'Bengaluru',
    phone: '+91 98765 43210',
    primaryAddress: {
      line1: '28 Tech Park Avenue',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India',
    },
    rewardsPoints: 1420,
    recentOrders: 6,
    wishlistItems: 14,
  },
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomer(state, action: PayloadAction<Customer>) {
      state.currentCustomer = action.payload;
    },
  },
});

export const { setCustomer } = customerSlice.actions;
export const customerReducer = customerSlice.reducer;
