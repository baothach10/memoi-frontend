# MEMOÍ Frontend

Next.js storefront for [MEMOÍ](https://www.memoiofficial.com) — an affordable luxury fashion house for the modern woman. This app powers browsing, shopping, checkout, accounts, and membership experiences.

## Features

- Shop by collection and category, product detail pages, and product search
- Cart, promo / discount codes, membership discounts, and Stripe checkout
- Supabase auth (sign-in / register), account dashboard, orders, and membership tiers
- AI size suggestions (Gemini), exchange requests, and help flows
- Brand storytelling: Explore, About Us, Commitments, The MEMOÍ House
- Responsive UI with GSAP motion, Swiper carousels, and Three.js accents
- Multi-currency display via `CurrencyContext`
- Google Analytics

## Tech stack

| Area | Tools |
|------|--------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Data | TanStack Query, Supabase Auth |
| Payments | Stripe |
| UI / motion | GSAP, Swiper, Three.js, MUI icons, Lucide |
| Forms | React Hook Form, Zod |
| AI | Vercel AI SDK + Google Gemini |

## Pages & routes

### Commerce

| Route | Description |
|-------|-------------|
| `/` | Home — hero, featured collections, shop entry points |
| `/shop` | Shop hub — entry to all products, categories, and collections |
| `/shop/all-products` | Full product catalog (paginated) |
| `/shop/category` | Category index |
| `/shop/category/[categoryId]` | Products by category (dresses, tops, pants, shorts, etc.) |
| `/shop/collection/[collectionId]` | Shop a named collection (e.g. “The Becoming”) |
| `/collection` | Editorial collections overview |
| `/collection/[collectionId]` | Collection story / lookbook experience |
| `/product/[productId]` | Product detail — gallery, variants, size suggestion, add to cart |
| `/search` | Product search results |

### Cart & checkout

| Route | Description |
|-------|-------------|
| `/cart` | Cart review — quantity, stock warnings, remove items |
| `/checkout` | Checkout — shipping / billing, promo codes, Stripe payment |
| `/checkout/success` | Order confirmation after successful payment |

### Account & auth

| Route | Description |
|-------|-------------|
| `/sign-in` | Sign in |
| `/register` | Create account |
| `/account` | Account dashboard — profile, membership tier, address, settings |
| `/account/orders/[id]` | Order detail — items, totals, delivery progress |

### Brand & support

| Route | Description |
|-------|-------------|
| `/explore` | Explore hub — story, house, commitments, contact |
| `/explore/about-us` | Brand story and philosophy |
| `/explore/commitments` | Ethical craftsmanship & conscious elegance |
| `/explore/contact-us` | Contact channels |
| `/the-memoi-house` | Membership program and privileges |
| `/help` | Help center |
| `/exchange-request` | One-time size exchange request (within policy window) |
| `/exchange-success` | Exchange request confirmation |
| `/privacy-policy` | Privacy policy |
| `/terms-and-conditions` | Terms & conditions |

## API routes (`app/api`)

Server routes used as a BFF layer in front of the MEMOÍ backend and third parties:

- **Catalog** — products (paginated / by category / by collection), details, suggestions, search, categories, collections
- **Cart & user** — get/update cart, profile, address, personal info, create/delete user, membership
- **Orders & discounts** — orders list/detail/count, promo codes, membership discounts
- **Payments** — Stripe payment intent creation
- **Other** — size suggestion (Gemini), exchange requests, asset proxy for allowed CDNs

Client data fetching is wrapped in TanStack Query hooks under `queries/`.

## Component architecture

UI lives under `components/ui/` in a layered pattern:

```
atoms/        # Buttons, logos, small primitives
molecules/    # Cart/order cards, checkout summary, quantity selector, etc.
organisms/    # Header, footer, overlays, Stripe payment, search
pages/        # Page-level sections (home, shop, product, account, explore, …)
```

Shared state and helpers:

- `context/` — currency, menu, Three.js model
- `hooks/` — viewport, header theme, video prefetch
- `providers/` — React Query provider
- `utils/` — cart helpers, Supabase clients, sign-up utilities

## Getting started

### Prerequisites

- Node.js 20+
- Access to the MEMOÍ API, Supabase project, and Stripe keys

### Install

```bash
npm install
```

### Environment

Copy your secrets into `.env.local` (never commit this file):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN=

# Backend API
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_FRONTEND_DOMAIN=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Optional
NEXT_PUBLIC_GEMINI_API=
GEMINI_API=
NEXT_PUBLIC_ASSET_DOMAINS=
NEXT_PUBLIC_GA_ID=
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # serve production build
npm run lint    # ESLint
```

## Project structure

```
app/                 # App Router pages, layouts, and API routes
  (routes)/          # User-facing pages grouped by feature
  api/               # BFF / server API handlers
components/ui/       # atoms → molecules → organisms → pages
context/             # React context providers
hooks/               # Shared React hooks
lib/                 # Server helpers
providers/           # App-level providers (React Query)
queries/             # TanStack Query hooks
utils/               # Cart, Supabase, and misc helpers
public/              # Static assets (images, models, etc.)
```

## License

Private — all rights reserved.
