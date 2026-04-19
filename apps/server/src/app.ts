import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { authRouter } from './routes/authRoutes.js';
import { storeRouter } from './routes/storeRoutes.js';

export const app = express();

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());

app.get('/api/health', (_, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);
app.use('/api/store', storeRouter);
