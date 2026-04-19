import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { seedUserData } from '../db/seed.js';
import { UserModel } from '../models/User.js';
import type { AuthenticatedRequest } from '../types/auth.js';

function signToken(payload: { id: string; email: string }) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });
}

function toPublicUser(user: { _id: unknown; name: string; email: string }) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
  };
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const existing = await UserModel.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: 'Email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ name, email: email.toLowerCase(), passwordHash });
  await seedUserData(String(user._id));

  const token = signToken({ id: String(user._id), email: user.email });
  return res.status(201).json({ token, user: toPublicUser(user) });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  await seedUserData(String(user._id));

  const token = signToken({ id: String(user._id), email: user.email });
  return res.json({ token, user: toPublicUser(user) });
}

export async function me(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await UserModel.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.json({ user: toPublicUser(user) });
}
