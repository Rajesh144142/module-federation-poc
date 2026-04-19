import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth/store/authSlice';
import { customerReducer } from '../features/customer/customerSlice';
import { storefrontReducer } from '../features/storefront/store/storefrontSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    storefront: storefrontReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
