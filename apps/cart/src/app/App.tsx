import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Box from '@mui/material/Box';
import MiniCart from '../features/cart/components/MiniCart';

const previewItems = [
  { id: 'preview-1', productName: 'Laptop Stand', quantity: 1, price: 1299 },
  { id: 'preview-2', productName: 'Monitor Light', quantity: 1, price: 2199 },
];

const theme = createTheme({
  typography: {
    fontFamily: "Manrope, 'Segoe UI', Tahoma, sans-serif",
  },
  palette: {
    primary: { main: '#174a78' },
    background: { default: '#f3f5f8' },
  },
});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', p: 4 }}>
        <MiniCart
          customerName="Preview Shopper"
          items={previewItems}
          isLoading={false}
          couponCode="WEEKEND10"
          discount={350}
          shipping={0}
          tax={252}
          total={3400}
          isOpen={true}
          onClose={() => undefined}
          onContinueShopping={() => undefined}
          onRemoveItem={() => undefined}
          onUpdateQuantity={() => undefined}
          onClearCoupon={() => undefined}
        />
      </Box>
    </ThemeProvider>
  );
}
