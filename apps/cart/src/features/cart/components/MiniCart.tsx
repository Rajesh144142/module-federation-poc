import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Skeleton,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { CartLineItem } from './CartLineItem';
import { CartSummary } from './CartSummary';
import type { MiniCartProps } from '../../../shared/types/cart';
import { getCartItems } from '../api/cartApi';

function MiniCart({
  customerName,
  items,
  isLoading,
  authToken,
  apiBaseUrl,
  couponCode,
  discount,
  shipping,
  tax,
  total,
  isOpen,
  onClose,
  onContinueShopping,
  onRemoveItem,
  onUpdateQuantity,
  onClearCoupon,
}: MiniCartProps) {
  const [notice, setNotice] = useState<string | null>(null);
  const [remoteItems, setRemoteItems] = useState(items);
  const [isRemoteLoading, setIsRemoteLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const shouldUseRemoteItems = items.length === 0 && remoteItems.length > 0;
  const effectiveItems = shouldUseRemoteItems ? remoteItems : items;
  const effectiveLoading = isLoading || isRemoteLoading;
  const subtotal = effectiveItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  useEffect(() => {
    if (items.length > 0) {
      setRemoteItems(items);
    }
  }, [items]);

  useEffect(() => {
    if (!authToken) {
      return;
    }

    let active = true;
    setIsRemoteLoading(true);
    getCartItems(authToken, apiBaseUrl)
      .then((fetchedItems) => {
        if (active) {
          setRemoteItems(fetchedItems);
        }
      })
      .catch(() => {
        // Keep the current cart list if remote fetch fails.
      })
      .finally(() => {
        if (active) {
          setIsRemoteLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [authToken, apiBaseUrl]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        hideBackdrop={!isMobile}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: {
              width: { xs: '100%', md: 430 },
              height: '100%',
              mr: { xs: 0, md: 0 },
              borderRadius: { xs: 0, md: 0 },
              p: 2.5,
              border: '1px solid #d7e0ea',
              backgroundColor: '#ffffff',
              position: 'fixed',
              top: 0,
              right: 0,
            },
          },
        }}
      >
        <Box sx={{ display: 'grid', gap: 2, height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="overline" color="warning.dark" sx={{ fontWeight: 700 }}>
                Cart module
              </Typography>
              <Typography variant="h6">{customerName}&apos;s cart</Typography>
            </Box>
            <IconButton
              onClick={onClose}
              aria-label="Close cart"
              sx={{ border: '1px solid #d7e0ea', borderRadius: 999, width: 32, height: 32 }}
            >
              x
            </IconButton>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Cart rendering, quantity actions, and totals UI are owned by the cart microfrontend.
          </Typography>

          {couponCode ? (
            <Alert
              severity="success"
              action={
                <Button
                  size="small"
                  onClick={() => {
                    onClearCoupon();
                    setNotice('Coupon removed');
                  }}
                >
                  Remove
                </Button>
              }
            >
              Coupon applied: {couponCode}
            </Alert>
          ) : null}

          <Divider />

          {effectiveLoading ? (
            <Box sx={{ display: 'grid', gap: 1.2 }}>
              {Array.from({ length: 3 }, (_, index) => (
                <Box
                  key={`mini-cart-skeleton-${index}`}
                  sx={{
                    border: '1px solid #d7e0ea',
                    borderRadius: 2,
                    p: 1.2,
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <Skeleton width="50%" />
                  <Skeleton width="34%" />
                  <Skeleton width="70%" />
                </Box>
              ))}
            </Box>
          ) : effectiveItems.length === 0 ? (
            <Alert severity="warning">Your cart is empty. Add products from the catalog.</Alert>
          ) : (
            <Box sx={{ display: 'grid', gap: 1.2, overflowY: 'auto', pr: 0.5, flex: 1 }}>
              {effectiveItems.map((item) => (
                <CartLineItem
                  key={item.id}
                  item={item}
                  onRemoveItem={onRemoveItem}
                  onUpdateQuantity={onUpdateQuantity}
                />
              ))}

              <CartSummary
                subtotal={subtotal}
                discount={discount}
                shipping={shipping}
                tax={tax}
                total={total}
              />
            </Box>
          )}

          <Box sx={{ display: 'grid', gap: 1, mt: 'auto' }}>
            <Button
              variant="outlined"
              onClick={onContinueShopping}
              sx={{
                borderColor: '#c3d3e2',
                color: '#174a78',
                borderRadius: '999px',
                '&:hover': { borderColor: '#9fb6cc', backgroundColor: '#f4f8fc' },
              }}
            >
              Continue shopping
            </Button>
            <Button
              variant="contained"
              disabled={effectiveItems.length === 0 || effectiveLoading}
              onClick={() => setNotice('Checkout flow will be connected next.')}
              sx={{
                backgroundColor: '#174a78',
                borderRadius: '999px',
                '&:hover': { backgroundColor: '#123a60' },
              }}
            >
              Proceed to checkout
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={2200}
        onClose={() => setNotice(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setNotice(null)} variant="filled">
          {notice}
        </Alert>
      </Snackbar>
    </>
  );
}

export default MiniCart;
