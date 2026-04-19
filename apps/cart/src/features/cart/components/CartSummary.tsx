import { Box, Divider, Paper, Typography } from '@mui/material';

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  );
}

export function CartSummary({ subtotal, discount, shipping, tax, total }: CartSummaryProps) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Box sx={{ display: 'grid', gap: 1.2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Price details
        </Typography>
        <SummaryRow label="Subtotal" value={`Rs. ${subtotal}`} />
        <SummaryRow label="Discount" value={`- Rs. ${discount}`} />
        <SummaryRow label="Shipping" value={shipping === 0 ? 'Free' : `Rs. ${shipping}`} />
        <SummaryRow label="Tax" value={`Rs. ${tax}`} />
        <Divider />
        <SummaryRow label="Total" value={`Rs. ${total}`} />
      </Box>
    </Paper>
  );
}
