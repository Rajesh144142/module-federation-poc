import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { seedCatalogData } from './seed.js';

export async function connectDatabase() {
  await mongoose.connect(env.mongoUri);
  console.log(`MongoDB connected: ${env.mongoUri}`);
  await seedCatalogData();
}
