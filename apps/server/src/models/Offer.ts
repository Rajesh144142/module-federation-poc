import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    offerId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    discountPercent: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export interface OfferDocument {
  _id: mongoose.Types.ObjectId;
  offerId: string;
  title: string;
  description: string;
  discountPercent: number;
  code: string;
  isActive: boolean;
}

export const OfferModel = mongoose.model<OfferDocument>('Offer', offerSchema);
