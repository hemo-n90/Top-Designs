# قمة التصاميم - Qimma Designs Kitchen E-commerce Platform

## Overview
Production-ready e-commerce platform for "قمة التصاميم" (Qimma Designs), a Saudi kitchen manufacturer. Features a purple-themed Arabic RTL interface with mobile-first design.

## Project State: Complete
- All public pages functional (Home, Catalog, ProductDetails, Cart, Checkout, Visit Request)
- All admin pages functional (Dashboard, Products, Categories, Orders, Visit Requests)
- Database seeded with 4 categories, 10 products, and admin user

## Admin Credentials
- Email: admin@qimma.sa
- Password: admin123

## Key Features
- Per-meter pricing model for kitchen products
- Custom pricing support for premium products
- Shopping cart with localStorage persistence
- Visit request forms for customer inquiries
- Complete admin dashboard with JWT authentication

## Tech Stack
- Frontend: React, TypeScript, TanStack Query, Wouter, Tailwind CSS
- Backend: Express.js, TypeScript
- Database: PostgreSQL with Drizzle ORM
- Authentication: JWT with bcrypt

## Material Types
- ألمنيوم (Aluminum)
- خشب (Wood)
- صاج (Steel)
- فورميكا (Formica)

## Project Architecture
```
client/src/
  ├── pages/          # React pages (Home, Catalog, Cart, Admin, etc.)
  ├── components/ui/  # Shadcn UI components
  ├── lib/            # Utilities (cart context, queryClient)
  └── hooks/          # Custom hooks
server/
  ├── routes.ts       # API endpoints
  ├── storage.ts      # Database operations
  ├── seed.ts         # Database seeding
  └── db.ts           # Database connection
shared/
  └── schema.ts       # Drizzle schema definitions
```

## API Routes
### Public
- GET /api/categories - List all categories
- GET /api/products - List products (with filters)
- GET /api/products/:id - Get product details
- POST /api/orders - Create order
- POST /api/visit-requests - Submit visit request

### Admin (requires JWT token)
- POST /api/admin/login - Admin login
- GET /api/admin/dashboard - Dashboard stats
- CRUD /api/admin/products - Product management
- CRUD /api/admin/categories - Category management
- GET/PATCH /api/admin/orders - Order management
- GET/PATCH /api/admin/visit-requests - Visit request management

## Recent Changes
- 2026-01-18: Initial build complete
  - Database schema with all tables
  - Full frontend with purple RTL Arabic theme
  - Complete admin dashboard
  - Database seeded with sample data

## User Preferences
- Arabic RTL layout
- Purple color theme (#8b5cf6)
- Mobile-first responsive design
- Cairo and Tajawal fonts for Arabic text
