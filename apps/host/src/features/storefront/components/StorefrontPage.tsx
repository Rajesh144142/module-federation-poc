import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getCustomerProfile, getMe, loginUser, registerUser } from '../../auth/api/authApi';
import { AuthPage } from '../../auth/pages/AuthPage';
import { clearAuthSession, setAuthSession, setAuthUser } from '../../auth/store/authSlice';
import { setCustomer } from '../../customer/customerSlice';
import {
  getActiveOffers,
  getFeaturedProducts,
  getInitialCartItems,
  getMyOrders,
  getStoreInsights,
} from '../api/mockStoreApi';
import {
  addToCart,
  applyCoupon,
  hydrateCart,
  removeFromCart,
  updateCartQuantity,
} from '../store/storefrontSlice';
import type { Product } from '../../../shared/types/store';
import { AccountPage } from '../pages/AccountPage';
import { CatalogPage } from '../pages/CatalogPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { HomePage } from '../pages/HomePage';
import { OffersPage } from '../pages/OffersPage';

const CustomerPanel = lazy(() => import('customer/CustomerPanel'));
const MiniCart = lazy(() => import('cart/MiniCart'));

type StorefrontRoute = '/' | '/catalog' | '/offers' | '/checkout' | '/account' | '/auth';

interface NavItem {
  label: string;
  path: StorefrontRoute;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/', requiresAuth: true },
  { label: 'Catalog', path: '/catalog', requiresAuth: true },
  { label: 'Offers', path: '/offers', requiresAuth: true },
  { label: 'Checkout', path: '/checkout', requiresAuth: true },
  { label: 'Account', path: '/account', requiresAuth: true },
  { label: 'Auth', path: '/auth' },
];

function normalizeRoute(pathname: string): StorefrontRoute {
  const cleaned = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
  if (
    cleaned === '/catalog' ||
    cleaned === '/offers' ||
    cleaned === '/checkout' ||
    cleaned === '/account' ||
    cleaned === '/auth'
  ) {
    return cleaned;
  }

  return '/';
}

export function StorefrontPage() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const customer = useAppSelector((state) => state.customer.currentCustomer);
  const cartItems = useAppSelector((state) => state.storefront.cartItems);
  const appliedCouponCode = useAppSelector((state) => state.storefront.appliedCouponCode);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<StorefrontRoute>(() =>
    normalizeRoute(window.location.pathname),
  );

  const isAuthenticated = Boolean(auth.token);

  useEffect(() => {
    if (!isAuthenticated && currentRoute !== '/auth') {
      window.history.pushState({}, '', '/auth');
      setCurrentRoute('/auth');
    }
  }, [isAuthenticated, currentRoute]);

  const { data: insights, isLoading: isInsightsLoading } = useQuery({
    queryKey: ['store-insights'],
    queryFn: getStoreInsights,
    enabled: isAuthenticated,
  });

  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: getFeaturedProducts,
    enabled: isAuthenticated,
  });

  const { data: offers = [], isLoading: isOffersLoading } = useQuery({
    queryKey: ['offers'],
    queryFn: getActiveOffers,
    enabled: isAuthenticated,
  });

  const { data: initialCartItems = [], isLoading: isCartLoading } = useQuery({
    queryKey: ['initial-cart-items', auth.token],
    queryFn: () => getInitialCartItems(auth.token ?? ''),
    enabled: isAuthenticated,
  });

  const { data: myOrders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ['my-orders', auth.token],
    queryFn: () => getMyOrders(auth.token ?? ''),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (initialCartItems.length > 0) {
      dispatch(hydrateCart(initialCartItems));
    }
  }, [dispatch, initialCartItems]);

  useEffect(() => {
    if (!auth.token || auth.user) {
      return;
    }
    const token = auth.token;

    getMe(token)
      .then(async (user) => {
        dispatch(setAuthUser(user));
        const profile = await getCustomerProfile(token);
        dispatch(setCustomer(profile));
      })
      .catch(() => {
        dispatch(clearAuthSession());
      });
  }, [auth.token, auth.user, dispatch]);

  useEffect(() => {
    const handlePopState = () => setCurrentRoute(normalizeRoute(window.location.pathname));

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: StorefrontRoute) => {
    if (!isAuthenticated && path !== '/auth') {
      path = '/auth';
    }

    if (path === currentRoute) {
      return;
    }

    window.history.pushState({}, '', path);
    setCurrentRoute(path);
  };

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return products.filter((product) => {
      const categoryMatch =
        selectedCategory === 'All' || product.category === selectedCategory;
      const searchMatch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch);

      return categoryMatch && searchMatch;
    });
  }, [products, selectedCategory, searchTerm]);

  const activeOffer = offers.find((offer) => offer.code === appliedCouponCode) ?? null;
  const totalItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
  const discount = activeOffer ? Math.round((subtotal * activeOffer.discountPercent) / 100) : 0;
  const discountedSubtotal = Math.max(subtotal - discount, 0);
  const shipping =
    discountedSubtotal >= (insights?.freeShippingThreshold ?? Number.MAX_SAFE_INTEGER)
      ? 0
      : cartItems.length > 0
        ? 199
        : 0;
  const tax = Math.round(discountedSubtotal * 0.08);
  const total = discountedSubtotal + shipping + tax;

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product }));
    setIsCartOpen(true);
  };

  const handleLogin = async (input: { email: string; password: string }) => {
    const payload = await loginUser(input);
    dispatch(setAuthSession(payload));
    const profile = await getCustomerProfile(payload.token);
    dispatch(setCustomer(profile));
    navigate('/');
  };

  const handleRegister = async (input: { name: string; email: string; password: string }) => {
    const payload = await registerUser(input);
    dispatch(setAuthSession(payload));
    const profile = await getCustomerProfile(payload.token);
    dispatch(setCustomer(profile));
    navigate('/');
  };

  const customerCard = (
    <Suspense fallback={<div className="panel">Loading customer account...</div>}>
      <CustomerPanel customer={customer} authToken={auth.token} />
    </Suspense>
  );

  const visibleNavItems = navItems.filter((item) => (isAuthenticated ? item.path !== '/auth' : item.path === '/auth'));

  return (
    <main className="storefront-shell">
      <header className="hero-banner">
        <div>
          <p className="eyebrow">NovaStore Commerce</p>
          <h1>Multi-page ecommerce storefront</h1>
          <p className="hero-copy">
            Auth-enabled storefront with Node + Express + MongoDB backend APIs.
          </p>
        </div>

        <div className="hero-stats">
          <article className="summary-card">
            <span>Featured category</span>
            <strong>{isAuthenticated ? (isInsightsLoading ? 'Loading...' : insights?.featuredCategory) : 'Login required'}</strong>
          </article>
          <article className="summary-card">
            <span>Customer</span>
            <strong>{auth.user?.name ?? 'Guest user'}</strong>
          </article>
          <article className="summary-card">
            <span>Order total</span>
            <strong>{isAuthenticated ? (isCartLoading ? 'Loading...' : `Rs. ${total}`) : 'Login required'}</strong>
          </article>
        </div>

        <nav className="storefront-nav" aria-label="Storefront pages">
          {visibleNavItems.map((item) => (
            <button
              key={item.path}
              type="button"
              className={item.path === currentRoute ? 'nav-link active' : 'nav-link'}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hero-actions">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                className="cart-toggle-button"
                onClick={() => setIsCartOpen((current) => !current)}
              >
                {isCartOpen ? 'Hide cart' : `Open cart (${totalItemCount})`}
              </button>
              <button
                type="button"
                className="logout-button"
                onClick={() => {
                  dispatch(clearAuthSession());
                  navigate('/auth');
                }}
              >
                Logout
              </button>
            </>
          ) : null}
        </div>
      </header>

      {currentRoute === '/auth' ? <AuthPage onLogin={handleLogin} onRegister={handleRegister} /> : null}

      {isAuthenticated && currentRoute === '/' ? (
        <HomePage
          customerName={customer.name}
          featuredCategory={insights?.featuredCategory}
          heroMessage={insights?.heroMessage}
          orderTotal={total}
          isLoading={isInsightsLoading}
          onGoToCatalog={() => navigate('/catalog')}
        />
      ) : null}

      {isAuthenticated && currentRoute === '/catalog' ? (
        <CatalogPage
          products={filteredProducts}
          isLoading={isProductsLoading}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          categories={categories}
          onCategoryChange={setSelectedCategory}
          onSearchTermChange={setSearchTerm}
          onAddToCart={handleAddToCart}
        />
      ) : null}

      {isAuthenticated && currentRoute === '/offers' ? (
        <OffersPage
          offers={offers}
          isLoading={isOffersLoading}
          activeCouponCode={appliedCouponCode}
          onApplyCoupon={(couponCode) => dispatch(applyCoupon(couponCode))}
        />
      ) : null}

      {isAuthenticated && currentRoute === '/checkout' ? (
        <CheckoutPage
          itemCount={totalItemCount}
          subtotal={subtotal}
          discount={discount}
          shipping={shipping}
          tax={tax}
          total={total}
          freeShippingThreshold={insights?.freeShippingThreshold}
          shippingEta={insights?.shippingEta}
          onOpenCart={() => setIsCartOpen(true)}
          customerCard={customerCard}
        />
      ) : null}

      {isAuthenticated && currentRoute === '/account' ? (
        <AccountPage customerCard={customerCard} orders={myOrders} isOrdersLoading={isOrdersLoading} />
      ) : null}

      {isAuthenticated ? (
        <button
          type="button"
          className="cart-fab"
          onClick={() => setIsCartOpen((current) => !current)}
        >
          {isCartOpen ? 'Close cart' : `Cart${totalItemCount > 0 ? ` (${totalItemCount})` : ''}`}
        </button>
      ) : null}

      {isAuthenticated ? (
        <Suspense fallback={null}>
          <MiniCart
            customerName={customer.name}
            items={cartItems}
            isLoading={isCartLoading}
            authToken={auth.token}
            couponCode={appliedCouponCode}
            discount={discount}
            shipping={shipping}
            tax={tax}
            total={total}
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onContinueShopping={() => setIsCartOpen(false)}
            onRemoveItem={(itemId: string) => dispatch(removeFromCart(itemId))}
            onUpdateQuantity={(itemId: string, quantity: number) =>
              dispatch(updateCartQuantity({ itemId, quantity }))
            }
            onClearCoupon={() => dispatch(applyCoupon(null))}
          />
        </Suspense>
      ) : null}
    </main>
  );
}
