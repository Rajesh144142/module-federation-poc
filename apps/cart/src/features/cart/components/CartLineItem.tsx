import { Box, IconButton, Paper, Typography } from '@mui/material';
import type { CartItem } from '../../../shared/types/cart';

interface CartLineItemProps {
  item: CartItem;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

export function CartLineItem({ item, onRemoveItem, onUpdateQuantity }: CartLineItemProps) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Box sx={{ display: 'grid', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {item.productName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rs. {item.price} each
            </Typography>
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Rs. {item.quantity * item.price}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              aria-label="Decrease quantity"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            >
              -
            </IconButton>
            <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
              {item.quantity}
            </Typography>
            <IconButton
              size="small"
              aria-label="Increase quantity"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              +
            </IconButton>
          </Box>

          <Typography
            component="button"
            type="button"
            onClick={() => onRemoveItem(item.id)}
            sx={{
              border: 'none',
              background: 'transparent',
              color: 'primary.main',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Remove
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
