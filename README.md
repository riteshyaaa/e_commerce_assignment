# NOVA — Modern Essentials E-Commerce Platform

A production-grade, full-stack e-commerce application designed with a Scandinavian minimalist aesthetic, tactile ergonomic details, a high-performance REST API, and an administrative back-office console.

Built for the **HAXCAMP / Tesseract Global Technologies Technical Assessment**.

---

## 🚀 Tech Stack

### Frontend Client
- **Framework:** React 18 (TypeScript) + Vite 6
- **Routing:** React Router DOM v7 (with scroll restoration & query synchronization)
- **Styling:** Tailwind CSS + Lucide Icons + Custom Modern Dark/Light Design Tokens
- **State & Data Fetching:** TanStack React Query v5 (caching, optimistic UI, mutation handlers) + React Context (Cart & Auth)
- **Forms & Validation:** React Hook Form + Zod Resolvers
- **Analytics & Visuals:** Recharts (Revenue, category distribution, sales trends)

### Backend API
- **Runtime:** Node.js (TypeScript) + Express 4
- **ORM & Database:** Prisma 6 + PostgreSQL 15+
- **Authentication & Security:** JWT (JSON Web Tokens), Bcrypt.js (salted hashing), Helmet, CORS
- **Validation:** Zod Schema Middleware (Request Body, Query Parameters, UUID/Slug params)
- **API Documentation:** Interactive Swagger UI (`/docs`)
- **Logging:** Morgan HTTP request logger

---

## 📦 Key Features

### 🛍️ Storefront & Customer Experience
- **Dynamic Hero Spotlight:** Visual showcase with direct slug resolution, real-time pricing, stock status indicators, and responsive CTA banners.
- **Comprehensive Product Catalog:**
  - Full-text search with instant URL synchronization.
  - Multi-attribute filtering (Category, price range, stock availability, featured flags).
  - Sorting by Price (Low to High / High to Low), Popularity, Customer Rating, and Newest arrivals.
  - Paginated grids with responsive column breaks (Mobile, Tablet, Desktop).
- **Interactive Product Detail Pages:**
  - Multi-image gallery with active thumbnail selector and high-resolution zoom preview.
  - Live stock scarcity counter (e.g. *"Only 3 items remaining"* with real-time badges).
  - Discount calculation badges (`-29% OFF`, compare-at pricing).
  - Related products carousel based on category matching.
- **Cart & Simulated Checkout:**
  - Slide-over drawer and dedicated `/cart` page.
  - Real-time order summary calculation (Subtotal, Shipping threshold calculation, GST/Tax, Promo codes).
  - Interactive multi-step checkout modal generating trackable order numbers (`NOV-XXXXXX`).
- **Live Order Milestone Tracking (`/track-order`):**
  - Instant order lookup by Order ID or Carrier AWB tracking number.
  - Direct integration from checkout confirmation (`/track-order?orderId=NOV-XXXXXX`).
  - Visual shipment milestone timeline (Payment verified, Central FC packing, In Transit, Out for Delivery, Delivered).
- **Newsletter Subscription:** Instant email registration with deduplication handling.
- **Scroll Restoration:** `<ScrollToTop />` component ensures navigation across catalog items resets scroll position to `(0, 0)`.

### 🛡️ Admin Management Console (`/admin`)
- **Secure Authentication:** JWT token-based authentication with expiration protection and session recovery.
- **Executive Dashboard:**
  - High-level KPIs: Total Revenue, Total Orders, Active Catalog Items, Low Stock alerts.
  - Interactive Recharts visualizers for weekly revenue graphs and category inventory allocation.
- **Product Inventory Management (Full CRUD):**
  - Create, view, edit, and delete products.
  - Custom image gallery URL management.
  - Status switches: `ACTIVE`, `DRAFT`, `OUT_OF_STOCK`, `ARCHIVED`.
  - One-click *Featured* product toggle.
  - Real-time stock adjustment and SKU validation.
- **Category Management:**
  - Create, edit, and delete store categories with automatic URL slug generation.
  - Product association counters.

---

## 🏛️ System Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                       CLIENT (React + Vite)                    │
│   Storefront Pages  │  Admin Console  │  Cart Context / Query   │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTP / REST / JSON
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                  │
│                                                                 │
│  [Middleware]: Helmet, CORS, Morgan, ErrorHandler               │
│  [Auth Guard]: JWT Bearer Token Verification                    │
│  [Validation]: Zod Schema Request Interceptors                  │
│                                                                 │
│  Controllers ──► Services ──► Repositories (Prisma Client)      │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Prisma Connection Pool
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE (PostgreSQL)                         │
│   Admins │ Categories │ Products │ ProductImages │ Newsletters  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema (Prisma)

```prisma
enum ProductStatus {
  ACTIVE
  DRAFT
  OUT_OF_STOCK
  ARCHIVED
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  imageUrl    String?
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("categories")
}

model Product {
  id             String         @id @default(cuid())
  name           String
  slug           String         @unique
  description    String
  price          Float
  compareAtPrice Float?
  stock          Int            @default(0)
  sku            String         @unique
  imageUrl       String
  status         ProductStatus  @default(ACTIVE)
  featured       Boolean        @default(false)
  rating         Float          @default(4.8)
  reviewCount    Int            @default(14)
  categoryId     String
  category       Category       @relation(fields: [categoryId], references: [id])
  images         ProductImage[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  @@map("products")
}

model ProductImage {
  id        String   @id @default(cuid())
  url       String
  sortOrder Int      @default(0)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@map("product_images")
}

model Admin {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         String   @default("ADMIN")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("admins")
}

model Newsletter {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())

  @@map("newsletter_subscribers")
}
```

---

## 📡 API Endpoints & Documentation

Interactive API Swagger documentation is available at `/docs` when the backend is running.

### 1. Health Check
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service uptime and connectivity health | Public |

### 2. Authentication
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate admin & return JWT token | Public |
| `GET` | `/api/auth/me` | Return currently authenticated admin user | Admin (JWT) |

### 3. Products
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Get paginated products with filters & search | Public |
| `GET` | `/api/products/:idOrSlug` | Retrieve product details by ID or Slug | Public |
| `POST` | `/api/products` | Create a new product | Admin (JWT) |
| `PATCH` | `/api/products/:id` | Update product details & images | Admin (JWT) |
| `DELETE` | `/api/products/:id` | Permanently remove a product | Admin (JWT) |
| `PATCH` | `/api/products/:id/toggle-featured`| Toggle featured storefront badge | Admin (JWT) |
| `PATCH` | `/api/products/:id/status` | Update product status (`ACTIVE`, `DRAFT`, etc.) | Admin (JWT) |

### 4. Categories
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Retrieve all categories with product counts | Public |
| `GET` | `/api/categories/:idOrSlug` | Get single category by ID or slug | Public |
| `POST` | `/api/categories` | Create a new category | Admin (JWT) |
| `PATCH` | `/api/categories/:id` | Update category details | Admin (JWT) |
| `DELETE` | `/api/categories/:id` | Remove a category | Admin (JWT) |

### 5. Dashboard & Analytics
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | KPI aggregate metrics (Revenue, stock alerts) | Admin (JWT) |
| `GET` | `/api/dashboard/analytics`| Revenue timeline & category distribution data | Admin (JWT) |

### 6. Newsletter
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/newsletter/subscribe` | Register an email subscriber | Public |

---

## 🛠️ Local Setup & Installation

### Prerequisites
- **Node.js** v18.0+ or v20.0+
- **npm** v9+
- **PostgreSQL Database** running locally or a free cloud instance (e.g. Neon.tech / Supabase)

---

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/e_commerce_assignment.git
cd e_commerce_assignment
```

---

### 2. Backend Setup (`/server`)

1. Navigate to the server folder and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create `.env` file in `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nova_ecommerce?schema=public"
   JWT_SECRET="nova_jwt_secret_dev_key_2026_super_secure"
   JWT_EXPIRES_IN="7d"
   CLIENT_URL="http://localhost:5173"
   ADMIN_EMAIL="admin@nova-store.com"
   ADMIN_PASSWORD="AdminPassword123!"
   ADMIN_NAME="NOVA Administrator"
   ```

3. Generate Prisma client, push database schema, and seed dummy data (29 products + admin user):
   ```bash
   npx prisma generate
   npx prisma db push
   npm run prisma:seed
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Server will run at `http://localhost:5000` (Swagger docs at `http://localhost:5000/docs`).*

---

### 3. Frontend Client Setup (`/client`)

1. Open a new terminal, navigate to `client` and install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Create `.env` file in `client/.env`:
   ```env
   VITE_API_URL="http://localhost:5000/api"
   ```

3. Start the Vite frontend development server:
   ```bash
   npm run dev
   ```
   *Storefront will run at `http://localhost:5173`.*

---

## 🔑 Default Admin Credentials

| Credential | Value |
| :--- | :--- |
| **Admin Portal URL** | `http://localhost:5173/admin/login` |
| **Email** | `admin@nova-store.com` |
| **Password** | `AdminPassword123!` |

---

## 🚢 Production Deployment

### 1. Database (Neon / Supabase)
1. Provision a free PostgreSQL instance on [Neon.tech](https://neon.tech).
2. Copy the pooled connection string (`DATABASE_URL`).

### 2. Backend API (Render / Railway)
1. Create a **New Web Service** connected to your repository.
2. Set **Root Directory** to `server`.
3. Set **Build Command** to:
   ```bash
   npm install && npx prisma generate && npm run build
   ```
4. Set **Start Command** to:
   ```bash
   npm start
   ```
5. Add Environment Variables: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL`.
6. Run database push & seed via Render Shell:
   ```bash
   npx prisma db push && npm run prisma:seed
   ```

### 3. Frontend Client (Vercel / Netlify)
1. Import repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Set Environment Variable:
   - `VITE_API_URL`: `https://your-backend-api.onrender.com/api`
4. Deploy!

---

## 🧪 Build & Test Verification

Run build checks to verify zero TypeScript compilation issues across both workspaces:

```bash
# Verify Frontend build
npm --prefix client run build

# Verify Backend build
npm --prefix server run build
```

---

## 📄 License
This project was developed for technical evaluation and assessment purposes. All rights reserved.
