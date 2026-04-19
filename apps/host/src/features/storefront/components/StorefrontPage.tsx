import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useColorMode } from '../../../app/providers';
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
import { PanelLoader, StatCardsSkeleton } from '../../../shared/components/AppLoaders';

const CustomerPanel = lazy(() => import('customer/CustomerPanel'));
const MiniCart = lazy(() => import('cart/MiniCart'));

type StorefrontRoute = '/' | '/catalog' | '/offers' | '/checkout' | '/account' | '/auth';

interface NavItem {
  label: string;
  path: StorefrontRoute;
  requiresAuth?: boolean;
  glyph: string;
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/', requiresAuth: true, glyph: 'H' },
  { label: 'Catalog', path: '/catalog', requiresAuth: true, glyph: 'C' },
  { label: 'Offers', path: '/offers', requiresAuth: true, glyph: 'O' },
  { label: 'Checkout', path: '/checkout', requiresAuth: true, glyph: 'K' },
  { label: 'Account', path: '/account', requiresAuth: true, glyph: 'A' },
  { label: 'Auth', path: '/auth', glyph: 'U' },
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
  const theme = useTheme();
  const { mode, toggleMode } = useColorMode();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const customer = useAppSelector((state) => state.customer.currentCustomer);
  const cartItems = useAppSelector((state) => state.storefront.cartItems);
  const appliedCouponCode = useAppSelector((state) => state.storefront.appliedCouponCode);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
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
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
      const searchMatch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch);

      return categoryMatch && searchMatch;
    });
  }, [products, selectedCategory, searchTerm]);

  const activeOffer = offers.find((offer) => offer.code === appliedCouponCode) ?? null;
  const totalItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
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
    <Suspense fallback={<PanelLoader label="Loading customer account..." minHeight={220} />}>
      <CustomerPanel customer={customer} authToken={auth.token} />
    </Suspense>
  );

  const visibleNavItems = navItems.filter((item) =>
    isAuthenticated ? item.path !== '/auth' : item.path === '/auth',
  );

  const onNavigate = (path: StorefrontRoute) => {
    navigate(path);
    setIsMobileNavOpen(false);
  };

  const currentNavLabel = visibleNavItems.find((item) => item.path === currentRoute)?.label ?? 'Home';

  const sidebarNavigation = (
    <Box sx={{ width: '100%', boxSizing: 'border-box', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ px: 2, display: 'flex', alignItems: 'center', gap: 1, height: 72, flexShrink: 0, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 16 }}>
          Module Federation poc
        </Typography>
      </Box>

      <Typography sx={{ px: 2, pt: 1.5, pb: 1, color: 'text.secondary', fontSize: 12, letterSpacing: 0.6, flexShrink: 0 }}>
        MENU
      </Typography>

      <List sx={{ px: 1, py: 0, overflowY: 'auto', flex: 1, minHeight: 0 }}>
        {visibleNavItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={item.path === currentRoute}
            onClick={() => onNavigate(item.path)}
            sx={{
              mb: 0.6,
              borderRadius: 1.2,
              py: 1,
              '&.Mui-selected': {
                bgcolor: '#233d70',
                color: '#fff',
                '&:hover': { bgcolor: '#1c335e' },
              },
            }}
          >
            <Typography sx={{ mr: 1.2, opacity: 0.8, fontSize: 14 }}>{item.glyph}</Typography>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: 'auto', px: 2, pb: 2, flexShrink: 0 }}>
        <Divider sx={{ mb: 2 }} />
        {isAuthenticated ? (
          <Paper
            variant="outlined"
            sx={{ p: 1.1, borderRadius: 1.5, display: 'flex', alignItems: 'center', gap: 1.1, bgcolor: 'action.hover' }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
              {auth.user?.name?.[0]?.toUpperCase() ?? 'U'}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{auth.user?.name ?? 'User'}</Typography>
              <Typography variant="caption" color="text.secondary">
                {totalItemCount} items in cart
              </Typography>
            </Box>
          </Paper>
        ) : null}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Paper
        variant="outlined"
        sx={{
          width: '100%',
          minHeight: '100vh',
          borderRadius: 0,
          overflow: 'visible',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '280px minmax(0, 1fr)' },
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            borderRight: `1px solid ${theme.palette.divider}`,
            position: 'sticky',
            top: 0,
            maxHeight: '100vh',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {sidebarNavigation}
        </Box>

        <Box sx={{ minWidth: 0, display: 'grid', gridTemplateRows: '72px 1fr' }}>
          <Box
            sx={{
              px: { xs: 1.2, md: 2 },
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              height: 72,
              flexShrink: 0,
            }}
          >
            <IconButton
              onClick={() => setIsMobileNavOpen(true)}
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            >
              Menu
            </IconButton>
            <Typography sx={{ fontWeight: 700 }}>{currentNavLabel}</Typography>
            <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
              <Button variant="outlined" onClick={toggleMode} sx={{ borderRadius: 1.2 }}>
                {mode === 'light' ? 'Dark' : 'Light'}
              </Button>
              {isAuthenticated ? (
                <>
                  <Button variant="outlined" onClick={() => setIsCartOpen((open) => !open)} sx={{ borderRadius: 1.2 }}>
                    Cart ({totalItemCount})
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      dispatch(clearAuthSession());
                      navigate('/auth');
                    }}
                    sx={{ borderRadius: 1.2 }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="contained" onClick={() => onNavigate('/auth')} sx={{ borderRadius: 1.2 }}>
                  Sign in
                </Button>
              )}
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 1.2, md: 2.2 }, overflowY: 'auto', overflowX: 'hidden' }}>
            <header className="hero-banner">
              <div>
                <p className="eyebrow">NovaStore Commerce</p>
                <h1>Multi-page ecommerce storefront</h1>
                <p className="hero-copy">
                  Auth-enabled storefront with Node + Express + MongoDB backend APIs.
                </p>
              </div>

              {isAuthenticated && (isInsightsLoading || isCartLoading) ? (
                <StatCardsSkeleton />
              ) : (
                <div className="hero-stats">
                  <article className="summary-card">
                    <span>Featured category</span>
                    <strong>{isAuthenticated ? insights?.featuredCategory : 'Login required'}</strong>
                  </article>
                  <article className="summary-card">
                    <span>Customer</span>
                    <strong>{auth.user?.name ?? 'Guest user'}</strong>
                  </article>
                  <article className="summary-card">
                    <span>Order total</span>
                    <strong>{isAuthenticated ? `Rs. ${total}` : 'Login required'}</strong>
                  </article>
                </div>
              )}
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
          </Box>
        </Box>
      </Paper>

      <Drawer
        open={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 280 },
        }}
      >
        {sidebarNavigation}
      </Drawer>

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
    </Box>
  );
}
