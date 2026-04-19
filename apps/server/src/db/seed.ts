import mongoose from 'mongoose';
import { defaultOffers, defaultProducts, defaultStoreInsights } from '../data/storeData.js';
import { CartItemModel } from '../models/CartItem.js';
import { CustomerProfileModel } from '../models/CustomerProfile.js';
import { OfferModel } from '../models/Offer.js';
import { OrderModel } from '../models/Order.js';
import { ProductModel } from '../models/Product.js';
import { StoreInsightModel } from '../models/StoreInsight.js';
import { UserModel } from '../models/User.js';

export async function seedCatalogData() {
  const [productCount, offerCount, insightCount] = await Promise.all([
    ProductModel.countDocuments(),
    OfferModel.countDocuments(),
    StoreInsightModel.countDocuments(),
  ]);

  if (productCount === 0) {
    await ProductModel.insertMany(
      defaultProducts.map((product) => ({
        productId: product.id,
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

  if (offerCount === 0) {
    await OfferModel.insertMany(
      defaultOffers.map((offer) => ({
        offerId: offer.id,
        title: offer.title,
        description: offer.description,
        discountPercent: offer.discountPercent,
        code: offer.code,
        isActive: true,
      })),
    );
  }

  if (insightCount === 0) {
    await StoreInsightModel.create({
      key: 'default',
      heroMessage: defaultStoreInsights.heroMessage,
      featuredCategory: defaultStoreInsights.featuredCategory,
      freeShippingThreshold: defaultStoreInsights.freeShippingThreshold,
      shippingEta: defaultStoreInsights.shippingEta,
    });
  }
}

export async function seedUserData(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) {
    return;
  }

  const objectId = new mongoose.Types.ObjectId(userId);

  const existingProfile = await CustomerProfileModel.findOne({ userId: objectId });
  if (!existingProfile) {
    await CustomerProfileModel.create({
      userId: objectId,
      tier: 'Starter member',
      location: 'Bengaluru',
      phone: '+91 90000 00000',
      primaryAddress: {
        line1: 'Add your primary address',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560001',
        country: 'India',
      },
      rewardsPoints: 120,
      recentOrders: 1,
      wishlistItems: 3,
    });
  }

  const existingCartItems = await CartItemModel.countDocuments({ userId: objectId });
  if (existingCartItems === 0) {
    const productList = await ProductModel.find().limit(2);
    if (productList.length > 0) {
      await CartItemModel.insertMany(
        productList.map((product) => ({
          userId: objectId,
          productId: product.productId,
          productName: product.name,
          quantity: 1,
          price: product.price,
        })),
      );
    }
  }

  const existingOrders = await OrderModel.countDocuments({ userId: objectId });
  if (existingOrders === 0) {
    await OrderModel.create({
      userId: objectId,
      orderNumber: `ORD-${Date.now()}`,
      status: 'Delivered',
      totalAmount: 3499,
      items: [
        {
          productId: 'prod-1',
          productName: 'Mechanical Keyboard',
          quantity: 1,
          price: 3499,
        },
      ],
      placedAt: new Date(),
    });
  }
}
