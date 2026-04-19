# Microfrontend Ecommerce Platform

This repo contains a modular ecommerce platform built with React + TypeScript microfrontends and a Node backend.

## Tech stack

- Host/remotes: Vite + Module Federation + React + Redux Toolkit + TanStack Query
- Backend: Node.js + Express + TypeScript + MongoDB (Mongoose) + JWT auth

## Apps

- `host`: multi-page storefront shell + auth module + API integration
- `customer`: customer account microfrontend (profile, address, account stats)
- `cart`: cart microfrontend (line items, quantity controls, order summary)
- `server`: Express API with auth and storefront endpoints

## Storefront routes

- `/auth` login/register page
- `/` home
- `/catalog`
- `/offers`
- `/checkout`
- `/account`

## API endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)
- `GET /api/store/insights`
- `GET /api/store/products`
- `GET /api/store/offers`
- `GET /api/store/cart` (Bearer token)
- `GET /api/store/profile` (Bearer token)
- `GET /api/store/orders` (Bearer token)

## APIs required per module

| Module | Required APIs |
| --- | --- |
| `host` (`apps/host`) | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (Bearer), `GET /api/store/profile` (Bearer), `GET /api/store/insights`, `GET /api/store/products`, `GET /api/store/offers`, `GET /api/store/cart` (Bearer), `GET /api/store/orders` (Bearer) |
| `customer` (`apps/customer`) | `GET /api/store/profile` (Bearer). Also accepts host-provided customer props as fallback. |
| `cart` (`apps/cart`) | `GET /api/store/cart` (Bearer). Also accepts host-provided cart items as fallback. |
| `server` (`apps/server`) | Exposes all backend endpoints under `/api`. |

Note: `apps/customer` and `apps/cart` now support direct read APIs with token, while still supporting host-driven props.

## Mongo collections

- `users`
- `products`
- `offers`
- `storeinsights`
- `cartitems`
- `customerprofiles`
- `orders`

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Configure backend env:

```bash
copy apps\\server\\.env.example apps\\server\\.env
```

3. Start all apps (server + remotes + host):

```bash
npm run dev:all
```

Ports:

- Server: `4000`
- Customer remote: `3001`
- Cart remote: `3002`
- Host: `3000`
