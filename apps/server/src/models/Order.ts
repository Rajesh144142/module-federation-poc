import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderNumber: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    items: { type: [orderItemSchema], default: [] },
    placedAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export interface OrderDocument {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderNumber: string;
  status: string;
  totalAmount: number;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  placedAt: Date;
}

export const OrderModel = mongoose.model<OrderDocument>('Order', orderSchema);
