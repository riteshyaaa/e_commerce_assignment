# NOVA — Modern Essentials E-Commerce Platform

A production-grade full-stack e-commerce application featuring a minimalist storefront, real-time order tracking, and a comprehensive admin management dashboard.

---

## 🚀 Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, TanStack React Query, React Router v7, Recharts, Lucide Icons.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL.
- **Security & Validation:** JWT Authentication, Bcrypt.js, Zod Schema Validation, Helmet, CORS.
- **API Docs:** Interactive Swagger UI (`/docs`).

---

## ✨ Key Features

- **Storefront & Catalog:** Dynamic hero banner, multi-attribute filtering (category, price, stock), full-text search, and sorting.
- **Product Details:** Multi-image gallery with zoom, stock availability badges, discount tags, and related products.
- **Cart & Checkout:** Responsive slide-over cart, dynamic tax/shipping calculation, and interactive checkout simulation.
- **Order Tracking (`/track-order`):** Live shipment milestone timeline with courier (Bluedart AWB) and status updates.
- **Admin Dashboard (`/admin`):** JWT-secured portal with revenue analytics charts, stock alerts, and full CRUD for products and categories.

---

## 📡 API Endpoints

Interactive Swagger documentation is available at `http://localhost:5000/docs`.

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health & status | Public |
| `POST` | `/api/auth/login` | Admin login & JWT generation | Public |
| `GET` | `/api/auth/me` | Current admin profile | Admin |
| `GET` | `/api/products` | Get products (search, filter, paginate) | Public |
| `GET` | `/api/products/:id` | Get single product by ID or slug | Public |
| `POST` | `/api/products` | Create new product | Admin |
| `PATCH` | `/api/products/:id` | Update product details | Admin |
| `DELETE`| `/api/products/:id` | Delete product | Admin |
| `PATCH` | `/api/products/:id/toggle-featured` | Toggle featured storefront status | Admin |
| `GET` | `/api/categories` | Get categories with product count | Public |
| `POST` | `/api/categories` | Create category | Admin |
| `PATCH` | `/api/categories/:id` | Update category | Admin |
| `DELETE`| `/api/categories/:id` | Delete category | Admin |
| `GET` | `/api/dashboard/stats` | KPI aggregate metrics | Admin |
| `GET` | `/api/dashboard/analytics` | Sales trends & revenue chart data | Admin |
| `POST` | `/api/newsletter/subscribe` | Email newsletter subscription | Public |

---

## 🛠️ Quick Setup & Installation

### 1. Prerequisites
- Node.js (v18+) & npm
- PostgreSQL database running locally or on the cloud (e.g. Neon.tech / Supabase)

---

### 2. Backend Setup (`/server`)

```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nova_ecommerce?schema=public"
JWT_SECRET="nova_jwt_secret_dev_key_2026_super_secure"
JWT_EXPIRES_IN="7d"
CLIENT_URL="http://localhost:5173"
ADMIN_EMAIL="admin@nova-store.com"
ADMIN_PASSWORD="AdminPassword123!"
```

Initialize database & seed 29 catalog products + admin:
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

Start backend:
```bash
npm run dev
# Running at http://localhost:5000 (Swagger: http://localhost:5000/docs)
```

---

### 3. Frontend Setup (`/client`)

In a new terminal:
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL="http://localhost:5000/api"
```

Start frontend:
```bash
npm run dev
# Running at http://localhost:5173
```

---

## 🔑 Default Admin Credentials

- **Admin Login:** `http://localhost:5173/admin/login`
- **Email:** `admin@nova-store.com`
- **Password:** `AdminPassword123!`

---

## 🚢 Production Deployment Summary

1. **Database:** Create a free PostgreSQL instance on [Neon.tech](https://neon.tech) and get `DATABASE_URL`.
2. **Backend (Render):**
   - Root: `server` | Build: `npm install && npx prisma generate && npm run build` | Start: `npm start`
   - Env Vars: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL`.
   - Seed via shell: `npx prisma db push && npm run prisma:seed`.
3. **Frontend (Vercel):**
   - Root: `client` | Build: `npm run build` | Output: `dist`
   - Env Var: `VITE_API_URL="https://your-backend.onrender.com/api"`.
