import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true },
);

export interface CartItemDocument {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export const CartItemModel = mongoose.model<CartItemDocument>('CartItem', cartItemSchema);
