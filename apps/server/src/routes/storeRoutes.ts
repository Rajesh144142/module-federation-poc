import { Router } from 'express';
import {
  getCart,
  getCustomerProfile,
  getInsights,
  getOffers,
  getOrders,
  getProducts,
} from '../controllers/storeController.js';
import { requireAuth } from '../middleware/requireAuth.js';

export const storeRouter = Router();

storeRouter.get('/insights', getInsights);
storeRouter.get('/products', getProducts);
storeRouter.get('/offers', getOffers);
storeRouter.get('/cart', requireAuth, getCart);
storeRouter.get('/profile', requireAuth, getCustomerProfile);
storeRouter.get('/orders', requireAuth, getOrders);
