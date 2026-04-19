import type { Offer, Product, StoreInsights } from './storeTypes.js';

export const defaultStoreInsights: StoreInsights = {
  heroMessage: 'Everything for your setup, delivered quickly with modular microfrontends.',
  featuredCategory: 'Home office essentials',
  freeShippingThreshold: 5000,
  shippingEta: '2-4 business days',
};

export const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Mechanical Keyboard',
    category: 'Desk Setup',
    price: 3499,
    description: 'Hot-swappable keyboard with tactile switches and compact layout.',
    badge: 'Best seller',
    stock: 16,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'prod-2',
    name: 'Ergonomic Mouse',
    category: 'Desk Setup',
    price: 1499,
    description: 'Comfort-focused mouse designed for long design and coding sessions.',
    badge: 'Popular',
    stock: 24,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'prod-3',
    name: 'Laptop Stand',
    category: 'Workspace',
    price: 1299,
    description: 'Aluminium stand that improves posture and frees desk space.',
    badge: 'New',
    stock: 32,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'prod-4',
    name: 'USB-C Dock',
    category: 'Accessories',
    price: 2999,
    description: 'Seven-port dock for monitors, storage, and fast charging.',
    badge: 'Limited stock',
    stock: 7,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
  },
];

export const defaultOffers: Offer[] = [
  {
    id: 'offer-1',
    title: 'Weekend Special',
    description: 'Get 10% off on all accessories this weekend.',
    discountPercent: 10,
    code: 'WEEKEND10',
  },
  {
    id: 'offer-2',
    title: 'New User Benefit',
    description: 'Flat 5% off your first order above Rs. 2000.',
    discountPercent: 5,
    code: 'HELLO5',
  },
];
