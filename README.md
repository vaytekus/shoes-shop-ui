# Shoes Shop UI

Customer-facing Next.js frontend for the Shoes Shop e-commerce platform. Educational project.

## Tech Stack

- **Next.js 15** — App Router
- **TypeScript**
- **Tailwind CSS** — utility-first styling
- **TanStack Query** — server state management
- **Zustand** — client state (auth token, customerId)
- **Axios** — HTTP client with auth interceptor (auto token refresh)
- **Keycloak** — authentication via OpenID Connect (Resource Owner Password flow)

## Features

- Product catalog with search, filters, and facets (brand, season, size, purpose, category)
- Section tabs on search page (Women / Men / Bags / Accessories)
- Product detail page with image gallery, size selection, reviews and ratings
- Shopping basket for authenticated users and guests
- Guest basket merge on login
- Guest checkout (no account required)
- Checkout with Nova Poshta city/warehouse selection (Branch and Postomat)
- Order history and order detail page with TTN tracking number
- Wishlist
- User profile with avatar upload (crop modal), name/email editing
- Purchased items section on profile page
- Sales page
- Login with redirect back to previous page

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_KEYCLOAK_URL=https://localhost:8080/realms/shoes-shop
NOVA_POSHTA_API_KEY=your_key_here
```

## API

Requests are proxied through Next.js rewrites to the backend services. See `next.config.ts`.

Backend repo: [shoes-shop](https://github.com/vaytekus/shoes-shop)

## Backlog

- **Mobile adaptation** — burger menu, filter drawer on mobile, touch-friendly cards
- **One-click order** — "Buy in 1 click" button, phone number modal, manager calls back
- **Product comparison** — compare up to 4 products in a table, stored in localStorage
- **Cookie banner** — required for EU compliance before production
- **Sales page filters** — gender + category filters on `/sales`
- **ModelName field** — `${brand} ${modelName}` as product title
- **CMS for static pages** — editable `/info/*` pages via admin panel
