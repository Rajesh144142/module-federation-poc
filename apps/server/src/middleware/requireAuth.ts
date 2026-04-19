import type { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthenticatedRequest } from '../types/auth.js';

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { id: string; email: string };
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
