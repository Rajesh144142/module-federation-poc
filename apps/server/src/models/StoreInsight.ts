import mongoose from 'mongoose';

const storeInsightSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    heroMessage: { type: String, required: true },
    featuredCategory: { type: String, required: true },
    freeShippingThreshold: { type: Number, required: true },
    shippingEta: { type: String, required: true },
  },
  { timestamps: true },
);

export interface StoreInsightDocument {
  _id: mongoose.Types.ObjectId;
  key: string;
  heroMessage: string;
  featuredCategory: string;
  freeShippingThreshold: number;
  shippingEta: string;
}

export const StoreInsightModel = mongoose.model<StoreInsightDocument>('StoreInsight', storeInsightSchema);
