import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    badge: { type: String, required: true },
    stock: { type: Number, required: true },
    rating: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

export interface ProductDocument {
  _id: mongoose.Types.ObjectId;
  productId: string;
  name: string;
  category: string;
  price: number;
  description: string;
  badge: string;
  stock: number;
  rating: number;
  image: string;
}

export const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);
