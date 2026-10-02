# Shoes Shop UI

Frontend for the Shoes Shop e-commerce platform — a footwear store with product catalog, shopping basket, and order management.

## Tech Stack

- **Next.js 15** — App Router, SSR for SEO
- **TypeScript**
- **Tailwind CSS** — utility-first styling
- **TanStack Query** — server state management
- **Zustand** — client state (auth token)
- **Axios** — HTTP client with auth interceptor
- **Keycloak** — authentication via OpenID Connect (Resource Owner Password flow)

## Features

- Authentication (login via Keycloak)
- Product catalog with pagination and category filtering
- Product detail page
- Shopping basket
- Orders history

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create `.env.local` in the root:

```
NEXT_PUBLIC_KEYCLOAK_URL=https://localhost:8080/realms/shoes-shop
```

## Backend

API requests are proxied through Next.js rewrites to the API Gateway (`https://localhost:7015`). See `next.config.ts`.

Backend repo: [shoes-shop](https://github.com/vaytekus/shoes-shop)
