import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false },
);

const customerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    tier: { type: String, default: 'Starter member' },
    location: { type: String, default: 'Not set' },
    phone: { type: String, default: 'Not set' },
    primaryAddress: { type: addressSchema, required: true },
    rewardsPoints: { type: Number, default: 0 },
    recentOrders: { type: Number, default: 0 },
    wishlistItems: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export interface CustomerProfileDocument {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  tier: string;
  location: string;
  phone: string;
  primaryAddress: {
    line1: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  rewardsPoints: number;
  recentOrders: number;
  wishlistItems: number;
}

export const CustomerProfileModel = mongoose.model<CustomerProfileDocument>('CustomerProfile', customerProfileSchema);
