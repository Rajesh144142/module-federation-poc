import mongoose from 'mongoose';
import type { Response } from 'express';
import { CartItemModel } from '../models/CartItem.js';
import { CustomerProfileModel } from '../models/CustomerProfile.js';
import { OfferModel } from '../models/Offer.js';
import { OrderModel } from '../models/Order.js';
import { ProductModel } from '../models/Product.js';
import { StoreInsightModel } from '../models/StoreInsight.js';
import { UserModel } from '../models/User.js';
import type { AuthenticatedRequest } from '../types/auth.js';

export async function getInsights(_: AuthenticatedRequest, res: Response) {
  const insight = await StoreInsightModel.findOne({ key: 'default' }).lean();
  if (!insight) {
    return res.status(404).json({ message: 'Store insights not found.' });
  }

  return res.json({
    heroMessage: insight.heroMessage,
    featuredCategory: insight.featuredCategory,
    freeShippingThreshold: insight.freeShippingThreshold,
    shippingEta: insight.shippingEta,
  });
}

export async function getProducts(_: AuthenticatedRequest, res: Response) {
  const products = await ProductModel.find().lean();
  return res.json(
    products.map((product) => ({
      id: product.productId,
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      badge: product.badge,
      stock: product.stock,
      rating: product.rating,
      image: product.image,
    })),
  );
}

export async function getOffers(_: AuthenticatedRequest, res: Response) {
  const offers = await OfferModel.find({ isActive: true }).lean();
  return res.json(
    offers.map((offer) => ({
      id: offer.offerId,
      title: offer.title,
      description: offer.description,
      discountPercent: offer.discountPercent,
      code: offer.code,
    })),
  );
}

export async function getCart(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userObjectId = new mongoose.Types.ObjectId(req.user.id);
  const cartItems = await CartItemModel.find({ userId: userObjectId }).lean();

  return res.json(
    cartItems.map((item) => ({
      id: String(item._id),
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
    })),
  );
}

export async function getCustomerProfile(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await UserModel.findById(req.user.id).lean();
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const userObjectId = new mongoose.Types.ObjectId(req.user.id);
  const profile = await CustomerProfileModel.findOne({ userId: userObjectId }).lean();
  if (!profile) {
    return res.status(404).json({ message: 'Customer profile not found.' });
  }
  const orderCount = await OrderModel.countDocuments({ userId: userObjectId });

  return res.json({
    profile: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      tier: profile.tier,
      location: profile.location,
      phone: profile.phone,
      primaryAddress: profile.primaryAddress,
      rewardsPoints: profile.rewardsPoints,
      recentOrders: orderCount,
      wishlistItems: profile.wishlistItems,
    },
  });
}

export async function getOrders(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userObjectId = new mongoose.Types.ObjectId(req.user.id);
  const orders = await OrderModel.find({ userId: userObjectId }).sort({ placedAt: -1 }).lean();

  return res.json(
    orders.map((order) => ({
      id: String(order._id),
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      placedAt: order.placedAt,
      items: order.items,
    })),
  );
}
