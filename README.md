# AKA Ecommerce

A modern, full-featured e-commerce platform built with Next.js 15, React 19, and TypeScript. This application provides a complete storefront experience with an integrated admin dashboard, user authentication, product management, order processing, and affiliate program support.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Architecture](#architecture)
- [Key Directories](#key-directories)
- [State Management](#state-management)
- [API Structure](#api-structure)
- [Styling](#styling)
- [Scripts](#scripts)
- [Deployment](#deployment)

## 🎯 Overview

AKA Ecommerce is a comprehensive e-commerce solution featuring:

- **Storefront**: Customer-facing shopping experience with product browsing, cart management, and checkout
- **Admin Dashboard**: Complete backend management for products, orders, users, and analytics
- **User Accounts**: Profile management, order history, addresses, and wishlist
- **Affiliate Program**: Built-in affiliate marketing system with approval workflow
- **Content Management**: Prismic CMS integration for dynamic content
- **Analytics**: Google Analytics integration with custom dashboard

## 🛠 Tech Stack

### Core Framework
- **Next.js 15.3.2** - React framework with App Router
- **React 19.0.0** - UI library
- **TypeScript 5.7.2** - Type safety

### Authentication & Authorization
- **Clerk** - User authentication and session management
- **Middleware** - Route protection for admin and account pages

### State Management
- **Zustand** - Lightweight state management
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### UI Components
- **Radix UI** - Accessible component primitives
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **shadcn/ui** - Pre-built component library
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Data & Content
- **Prismic** - Headless CMS for content management
- **REST API** - Backend API integration
- **React Email** - Email templating

### Additional Libraries
- **Recharts** - Data visualization
- **TanStack Table** - Data tables
- **Kbar** - Command palette
- **Glider.js** - Carousel/slider
- **date-fns** - Date utilities
- **Web Vitals** - Performance monitoring

## ✨ Features

### Storefront Features
- 🛍️ Product catalog with categories and filters
- 🛒 Shopping cart with persistent storage
- 💳 Checkout process with address management
- 🔍 Product search with suggestions
- ⭐ Product reviews and ratings
- ❤️ Wishlist functionality
- 📱 Responsive design
- 🌓 Dark/light theme support
- 🎨 Customizable themes with scaling options

### Admin Features
- 📊 Analytics dashboard with Google Analytics integration
- 📦 Product management (CRUD operations)
- 📁 Category management with hierarchical structure
- 👥 User management
- 📋 Order management and tracking
- 🎓 Course management
- 🏆 Contest management
- ✂️ Hairstyle gallery
- 📝 Submission management
- 🔗 Affiliate link management
- ✅ Affiliate approval workflow
- ⭐ Product review moderation

### User Account Features
- 👤 Profile management
- 📍 Address management
- 📦 Order history and details
- 💰 Affiliate dashboard
- ❤️ Wishlist
- 📤 Submissions

### Additional Features
- 🔐 Secure authentication with Clerk
- 📧 Email notifications via Resend
- 🍪 Cookie consent management
- 📱 Mobile-responsive design
- ⚡ Performance optimizations
- 🔍 SEO-friendly structure
- 🌐 Internationalization ready

## 📁 Project Structure

```
aka-ecommerce/
├── public/                 # Static assets
│   └── assets/            # Images, icons, logos
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── account/       # User account pages
│   │   ├── admin/         # Admin dashboard pages
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   ├── cart/          # Shopping cart page
│   │   ├── checkout/      # Checkout flow
│   │   ├── products/      # Product listing and detail pages
│   │   └── ...
│   ├── components/        # React components
│   │   ├── auth/          # Authentication components
│   │   ├── cart/          # Cart components
│   │   ├── layout/        # Layout components
│   │   ├── product/       # Product-related components
│   │   ├── ui/            # Reusable UI components (shadcn/ui)
│   │   └── ...
│   ├── features/          # Feature-based modules
│   │   ├── storefront/    # Storefront feature components
│   │   ├── products/      # Product feature logic
│   │   ├── orders/        # Order feature logic
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   │   ├── api/           # API client and services
│   │   ├── email/         # Email templates
│   │   └── utils/         # Utility functions
│   ├── stores/            # Zustand state stores
│   ├── types/             # TypeScript type definitions
│   ├── slices/            # Prismic CMS slices
│   └── styles/            # Global styles
├── customtypes/           # Prismic custom types
├── scripts/               # Build and utility scripts
└── ...
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm/yarn
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aka-ecommerce
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example.txt .env.local
   ```
   Edit `.env.local` with your configuration (see [Environment Variables](#environment-variables))

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Prismic Setup (Optional)

If you're using Prismic CMS:

1. Create a Prismic repository
2. Update `PRISMIC_REPOSITORY_NAME` in `.env.local`
3. Run Slice Machine:
   ```bash
   pnpm slicemachine
   ```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory. See `env.example.txt` for all available variables.

### Required Variables

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://your-api-url/api/
NEXT_PUBLIC_BASE_URL=http://your-api-url

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
```

### Optional Variables

```env
# Prismic CMS
PRISMIC_REPOSITORY_NAME=your-repo-name
NEXT_PUBLIC_PRISMIC_URL=https://your-repo.prismic.io/

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
GA_CLIENT_EMAIL=your-service-account@...
GA_PROPERTY_ID=123456789

# Email (Resend)
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=AKA Ecommerce
```

## 💻 Development

### Development Server

```bash
# Standard development
pnpm dev

# Development with debug port
pnpm dev:debug

# Development on specific port
pnpm dev:port
```

### Code Quality

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Strict linting (no warnings)
pnpm lint:strict

# Format code
pnpm format

# Check formatting
pnpm format:check

# Type checking
pnpm type-check

# Watch mode type checking
pnpm type-check:watch
```

### Building

```bash
# Production build
pnpm build

# Build with bundle analysis
pnpm build:analyze

# Start production server
pnpm start
```

## 🏗 Architecture

### App Router Structure

The project uses Next.js 15 App Router with the following patterns:

- **Server Components** (default) - For data fetching and static content
- **Client Components** (`"use client"`) - For interactivity and state
- **Route Handlers** - API endpoints in `app/api/`
- **Middleware** - Authentication and route protection

### API Architecture

The API layer is organized into three service layers:

1. **Unified Services** (`lib/api/services/unified/`)
   - Single source of truth for API calls
   - Works in both client and server contexts
   - Handles authentication and error handling

2. **Storefront Services** (`lib/api/services/storefront/`)
   - Client-side optimized services
   - Includes extensions for contests, courses, hairstyles, etc.

3. **Server Services** (`lib/api/services/server/`)
   - Server-side only services
   - Direct API access without client-side exposure

### State Management

- **Zustand Stores** (`src/stores/`)
  - `cart-store.ts` - Shopping cart state
  - `auth-store.ts` - Authentication state
  - `wishlist-store.ts` - Wishlist state
  - `app-store.ts` - Global app state (categories, contests)

- **React Hook Form** - Form state management
- **URL State** - `nuqs` for search params and filters

### Component Organization

- **UI Components** (`components/ui/`) - Reusable, unstyled components
- **Feature Components** (`features/`) - Business logic components
- **Layout Components** (`components/layout/`) - Page structure components
- **Page Components** (`app/`) - Route-level components

## 📂 Key Directories

### `/src/app`
Next.js App Router pages and routes. Each subdirectory represents a route.

### `/src/components`
Reusable React components organized by feature/domain.

### `/src/features`
Feature-based modules containing related components, hooks, and logic.

### `/src/hooks`
Custom React hooks for reusable logic (cart, auth, debounce, etc.).

### `/src/lib/api`
API client configuration and service layer:
- `client/` - API client implementations (client/server)
- `services/` - Service layer (unified/storefront/server)
- `types.ts` - API type definitions

### `/src/stores`
Zustand state stores for global state management.

### `/src/types`
TypeScript type definitions organized by domain.

### `/src/slices`
Prismic CMS slice components for content management.

## 🔄 State Management

### Cart Store

```typescript
import { useCartStore } from '@/stores/cart-store';

// Add item to cart
await useCartStore.getState().addItem(product, quantity);

// Get cart items
const items = useCartStore((state) => state.items);

// Get total price
const total = useCartStore((state) => state.getTotal());
```

### Auth Store

```typescript
import { useAuthStore } from '@/stores/auth-store';

// Check authentication
const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
```

### App Store

```typescript
import { useAppStore } from '@/stores/app-store';

// Get categories
const categories = useAppStore((state) => state.categories);

// Initialize app data
await useAppStore.getState().initializeApp();
```

## 🌐 API Structure

### Service Pattern

Services follow a consistent pattern:

```typescript
// Unified service example
import { unifiedCartService } from '@/lib/api/services/unified/cart';

// Get cart
const cart = await unifiedCartService.getCart();

// Add to cart
const updatedCart = await unifiedCartService.createCart({
  productId: 123,
  quantity: 1
});
```

### API Client

The API client handles:
- Request/response transformation
- Error handling
- Authentication headers
- Caching strategies

### Service Layers

1. **Unified Services**: Use in both client and server components
2. **Storefront Services**: Optimized for client-side usage
3. **Server Services**: Server-side only, direct API access

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS 4.0 with:
- Custom theme configuration
- Component variants with `class-variance-authority`
- Responsive design utilities
- Dark mode support

### Theme System

- Multiple theme variants (light, dark, scaled)
- Theme persistence via cookies
- System preference detection
- Custom color schemes

### CSS Modules

Additional styles in `/src/styles/`:
- `globals.css` - Global styles
- `theme.css` - Theme variables
- `product-detail.css` - Product-specific styles
- `slider.css` - Carousel styles
- `wysiwyg.css` - Rich text editor styles

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint issues |
| `pnpm format` | Format code with Prettier |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm slicemachine` | Start Prismic Slice Machine |

## 🚢 Deployment

### Build for Production

```bash
pnpm build
pnpm start
```

### Environment Setup

Ensure all required environment variables are set in your deployment platform:

- Vercel: Add variables in project settings
- Other platforms: Set environment variables according to platform docs

### Prismic Deployment

1. Push slices to Prismic:
   ```bash
   pnpm slicemachine
   ```
2. Configure webhooks for content updates
3. Set up preview URLs

### Performance Optimization

The project includes:
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Bundle analysis (`pnpm build:analyze`)
- Compression enabled
- Console removal in production

## 🔧 Configuration Files

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - shadcn/ui configuration
- `slicemachine.config.json` - Prismic Slice Machine configuration

## 📝 Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **Lint-staged**: Run linters on staged files

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and type checking
4. Commit with descriptive messages
5. Push and create a pull request

## 📄 License

Private project - All rights reserved

## 👥 Author

**Tai Hoang**  
Organization: AE-BY

---

For more information or support, please contact the development team.

