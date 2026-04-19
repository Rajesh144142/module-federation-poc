import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/microfrontend_ecommerce',
  jwtSecret: process.env.JWT_SECRET ?? 'microfrontend_dev_secret',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:3000',
};
