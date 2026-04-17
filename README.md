# UserVault — MERN Stack User Management System

![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![React](https://img.shields.io/badge/React-18-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![License](https://img.shields.io/badge/License-MIT-yellow)

A full-stack **Role-Based User Management System** built with the MERN stack. It supports secure JWT authentication, role-based access control (RBAC), full user lifecycle management, audit tracking, and is deployed on Render (backend) and Vercel (frontend).

---

## 🔗 Live Demo

|                  | URL                                                  |
| ---------------- | ---------------------------------------------------- |
| **Frontend**     | https://user-management-system-iota-rouge.vercel.app |
| **Backend API**  | https://your-render-url.onrender.com                 |
| **Health Check** | https://your-render-url.onrender.com/api/health      |

### Test Credentials

| Role    | Email               | Password    |
| ------- | ------------------- | ----------- |
| Admin   | admin@example.com   | Admin@123   |
| Manager | manager@example.com | Manager@123 |
| User    | user@example.com    | User@123    |

---

## 📁 Project Structure

```
user-management-system/
├── client/                        # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with JWT interceptors + auto-refresh
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state (login, logout, user)
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx         # App shell with sidebar + mobile navbar
│   │   │   │   ├── Sidebar.jsx        # Navigation sidebar with role-aware links
│   │   │   │   └── MobileNavbar.jsx   # Hamburger menu for mobile
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx         # Reusable button with variants + loading state
│   │   │   │   ├── Input.jsx          # Form input with label, icon, error support
│   │   │   │   ├── Select.jsx         # Dropdown with disabled state support
│   │   │   │   ├── Badge.jsx          # Color-coded status/role badges
│   │   │   │   ├── Modal.jsx          # Accessible modal with keyboard + overlay dismiss
│   │   │   │   └── Spinner.jsx        # Loading spinner
│   │   │   └── users/
│   │   │       ├── UserTable.jsx      # Data table with action buttons + "You" badge
│   │   │       ├── UserForm.jsx       # Create/edit form with role-aware field visibility
│   │   │       └── UserFilters.jsx    # Search + role/status filter bar
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login page with test credentials hint
│   │   │   ├── Dashboard.jsx      # Stats overview + account info
│   │   │   ├── UserList.jsx       # Paginated user table with CRUD modals
│   │   │   ├── UserDetail.jsx     # Single user detail with audit information
│   │   │   └── Profile.jsx        # Self-profile edit page
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx # Auth + role guard for React Router
│   │   ├── hooks/
│   │   │   └── useAuth.js         # Hook to consume AuthContext
│   │   ├── utils/
│   │   │   └── helpers.js         # Date formatting, initials, color maps
│   │   ├── App.jsx                # Route definitions
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Design tokens, animations, responsive breakpoints
│   ├── .env                       # Local environment variables
│   ├── .env.production            # Production environment variables
│   └── vercel.json                # Vercel SPA rewrite rules
│
└── server/                        # Node.js + Express backend
    ├── config/
    │   └── db.js                  # MongoDB connection with error handling
    ├── controllers/
    │   ├── authController.js      # register, login, refresh, logout, getMe
    │   └── userController.js      # CRUD operations with role-based field control
    ├── middleware/
    │   ├── authMiddleware.js      # JWT verify (protect) + role check (authorize)
    │   └── errorMiddleware.js     # Global error handler (CastError, duplicate key, etc.)
    ├── models/
    │   └── User.js                # Mongoose schema with pre-save bcrypt hook
    ├── routes/
    │   ├── authRoutes.js          # /api/auth/*
    │   └── userRoutes.js          # /api/users/*
    ├── utils/
    │   ├── generateTokens.js      # Access + refresh JWT generators
    │   ├── adminGuard.js          # Prevents last-admin lockout
    │   └── seeder.js              # Seeds 3 default users (skips existing)
    ├── .env                       # Environment variables (never commit this)
    └── server.js                  # Express app entry point
```

---

## ⚙️ Features

### Authentication

- **JWT Access + Refresh Token flow** — Access tokens expire in 15 minutes. Refresh tokens last 7 days and are stored in MongoDB. Axios automatically uses the refresh token to get a new access token on 401 responses, so the user stays logged in without interruption.
- **bcrypt password hashing** — All passwords are hashed with a salt round of 12 via a Mongoose `pre('save')` hook. Passwords are never returned in API responses (`select: false`).
- **Inactive account blocking** — If an admin deactivates a user, that user cannot log in and receives a clear 403 error.

### Role-Based Access Control (RBAC)

Three roles with clearly separated permissions:

| Permission                 | Admin    | Manager         | User     |
| -------------------------- | -------- | --------------- | -------- |
| View all users             | ✅       | ✅ (no admins)  | ❌       |
| Create users               | ✅       | ❌              | ❌       |
| Edit any user's name/email | ✅       | ✅ (non-admins) | ❌       |
| Edit user password         | ✅       | ❌              | Own only |
| Change user role           | ✅ (any) | ❌              | ❌       |
| Change user status         | ✅       | ❌              | ❌       |
| Deactivate (delete) user   | ✅       | ❌              | ❌       |
| View own profile           | ✅       | ✅              | ✅       |
| Edit own profile           | ✅       | ✅              | ✅       |

**How RBAC is enforced:**

- On the **backend**, the `authorize(...roles)` middleware factory rejects requests from unauthorized roles with `403 Forbidden` before the controller even runs.
- On the **frontend**, navigation items are shown/hidden based on `user.role` from `AuthContext`. `ProtectedRoute` wraps route groups and redirects unauthorized users to `/dashboard`.
- **Both layers always enforce rules** — the frontend is UX, the backend is truth.

### Admin Lockout Prevention

Two-layer guard using `adminGuard.js` utility:

1. **Self-deletion blocked** — An admin cannot deactivate their own account.
2. **Last admin protection** — If only one active admin exists, any attempt to deactivate or demote them is blocked with a descriptive error message. This applies to both the `updateUser` and `deleteUser` routes.

### User Management

- **Paginated user list** with configurable page size
- **Search** by name or email using MongoDB `$regex` (case-insensitive)
- **Filter** by role and status
- **Create user** with name, email, password, role, status
- **Edit user** with role-aware field visibility (managers cannot see password or status fields)
- **Soft delete** — users are deactivated (`status: inactive`), never hard-deleted, preserving audit history
- **User detail view** showing full audit trail

### Audit Tracking

Every user document stores:

- `createdAt` / `updatedAt` — via Mongoose `timestamps: true`
- `createdBy` / `updatedBy` — user ID references, populated with name/email on read
- The user detail page shows who created/last updated the record and when.

### Frontend

- **Dark theme** with CSS custom properties (design tokens)
- **Mobile responsive** — sidebar becomes a slide-in drawer on screens < 768px
- **Form validation** using `react-hook-form` + `zod` schemas
- **Toast notifications** via `react-hot-toast`
- **Auto token refresh** — Axios interceptor silently refreshes expired tokens

---

## 🚀 Local Setup

### Prerequisites

- Node.js 18+
- npm 9+
- A free [MongoDB Atlas](https://mongodb.com/cloud/atlas) account

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/user-management-system.git
cd user-management-system
```

### 1.1 Install yarn

```bash
npm install -g yarn
```

### 2. Backend setup

```bash
cd server
yarn install
```

Create `server/.env`:

```env
PORT=5500
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/userdb?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_refresh_secret_change_this
JWT_REFRESH_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> **How to get MONGO_URI:** Log in to MongoDB Atlas → your cluster → Connect → Drivers → copy the connection string. Replace `<username>` and `<password>` with your Atlas credentials.

Seed the database (creates 3 default users):

```bash
yarn run seed
```

Start the backend:

```bash
yarn run dev
```

Server runs at: `http://localhost:5500`


### 3. Frontend setup 

```bash
cd ../client
yarn install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5500/api
```

Start the frontend:

```bash
yarn run dev
```

App runs at: `http://localhost:5173`

---

## 🗄️ Database Schema

### User Model (`server/models/User.js`)

```
User {
  _id:          ObjectId          — auto-generated primary key
  name:         String            — required, 2–50 chars, trimmed
  email:        String            — required, unique, lowercase
  password:     String            — bcrypt hashed, select:false (never returned)
  role:         Enum              — "admin" | "manager" | "user" (default: "user")
  status:       Enum              — "active" | "inactive" (default: "active")
  refreshToken: String            — current refresh token, select:false
  createdBy:    ObjectId (ref)    — User who created this record
  updatedBy:    ObjectId (ref)    — User who last updated this record
  createdAt:    Date              — auto by Mongoose timestamps
  updatedAt:    Date              — auto by Mongoose timestamps
}
```

**Indexes:** `email` is indexed as `unique: true` at the schema level.

**Pre-save hook:** Before saving, if `password` is modified, it is hashed with `bcrypt.genSalt(12)` and `bcrypt.hash()`. This fires on both `new User().save()` and when updating password via `.save()`.

---

## 📡 API Reference

**Base URL (local):** `http://localhost:5500/api`

**Authentication:** Include `Authorization: Bearer <accessToken>` header on all protected routes.

---

### Auth Routes `/api/auth`

#### POST `/api/auth/register`

Register a new user (always assigned `user` role).

**Request body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Test@123"
}
```

**Response `201`:**

```json
{
  "success": true,
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active"
  }
}
```

---

#### POST `/api/auth/login`

Login with email and password.

**Request body:**

```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

**Response `200`:** Same shape as register.

**Failure cases:**

- `401` — Wrong email or password
- `403` — Account is deactivated

---

#### POST `/api/auth/refresh`

Get a new access token using a refresh token.

**Request body:**

```json
{
  "refreshToken": "eyJ..."
}
```

**Response `200`:**

```json
{
  "success": true,
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

---

#### POST `/api/auth/logout` 🔒

Clears the refresh token from the database.

**Response `200`:**

```json
{ "success": true, "message": "Logged out successfully" }
```

---

#### GET `/api/auth/me` 🔒

Returns the currently authenticated user.

**Response `200`:**

```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "role": "admin",
    "status": "active"
  }
}
```

---

### User Routes `/api/users`

#### GET `/api/users` 🔒 Admin, Manager

Get paginated, filterable list of users.

**Query parameters:**

| Param    | Type   | Description                    |
| -------- | ------ | ------------------------------ |
| `page`   | number | Page number (default: 1)       |
| `limit`  | number | Results per page (default: 10) |
| `search` | string | Search name or email           |
| `role`   | string | Filter by role                 |
| `status` | string | Filter by status               |

**Response `200`:**

```json
{
  "success": true,
  "total": 25,
  "page": 1,
  "pages": 3,
  "users": [...]
}
```

> **Note:** Managers automatically cannot see admin users regardless of filters.

---

#### POST `/api/users` 🔒 Admin only

Create a new user.

**Request body:**

```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "Pass@123",
  "role": "user",
  "status": "active"
}
```

**Response `201`:**

```json
{ "success": true, "user": { ... } }
```

---

#### GET `/api/users/:id` 🔒 All roles (scoped)

Get a single user by ID.

- Admin/Manager: can view any user (managers cannot view admins)
- User: can only view their own profile

**Response `200`:**

```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "role": "...",
    "status": "...",
    "createdAt": "...",
    "updatedAt": "...",
    "createdBy": { "name": "Super Admin", "email": "admin@example.com" },
    "updatedBy": { "name": "Super Admin", "email": "admin@example.com" }
  }
}
```

---

#### PUT `/api/users/:id` 🔒 All roles (scoped)

Update a user. Fields accepted depend on the requester's role:

| Field    | Admin | Manager | User (own) |
| -------- | ----- | ------- | ---------- |
| name     | ✅    | ✅      | ✅         |
| email    | ✅    | ✅      | ❌         |
| password | ✅    | ✅(own) | ✅         |
| role     | ✅    | ❌      | ❌         |
| status   | ✅    | ❌      | ❌         |

**Response `200`:**

```json
{ "success": true, "user": { ... } }
```

---

#### DELETE `/api/users/:id` 🔒 Admin only

Soft-deletes a user (sets `status: inactive`). The user cannot log in after this.

**Guards:**

- Cannot deactivate yourself
- Cannot deactivate the last active admin

**Response `200`:**

```json
{ "success": true, "message": "User deactivated successfully" }
```

---

### Health Check

#### GET `/api/health`

No authentication required. Used by Render to monitor uptime.

**Response `200`:**

```json
{ "status": "OK", "timestamp": "2026-04-17T12:00:00.000Z" }
```

---

## 🧪 Testing All Endpoints

Use **Postman** or **Thunder Client** (VS Code extension).

### Step 1 — Login and copy token

```
POST /api/auth/login
{ "email": "admin@example.com", "password": "Admin@123" }
```

Copy the `accessToken` from the response.

### Step 2 — Set Authorization header

In Postman, go to the **Authorization** tab → Type: **Bearer Token** → paste the token.

### Step 3 — RBAC tests (these should FAIL with correct error codes)

| Request                   | Token         | Expected                  |
| ------------------------- | ------------- | ------------------------- |
| `GET /api/users`          | User token    | `403 Forbidden`           |
| `POST /api/users`         | Manager token | `403 Forbidden`           |
| `DELETE /api/users/:id`   | Manager token | `403 Forbidden`           |
| `GET /api/users`          | No token      | `401 Unauthorized`        |
| `PUT /api/users/:otherId` | User token    | `403 Forbidden`           |
| Login with inactive user  | —             | `403 Account deactivated` |
| Deactivate last admin     | Admin token   | `400 Bad Request`         |

---

## 🌐 Deployment

### Backend — Render

| Setting           | Value         |
| ----------------- | ------------- |
| Root Directory    | `server`      |
| Build Command     | `npm install` |
| Start Command     | `npm start`   |
| Health Check Path | `/api/health` |

**Environment variables on Render:**

```
MONGO_URI=<your Atlas URI>
JWT_SECRET=<random secret>
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=<another random secret>
JWT_REFRESH_EXPIRE=7d
NODE_ENV=production
CLIENT_URL=<your Vercel frontend URL>
```

After first deploy, open the Render **Shell** tab and run:(optional)

```bash
node utils/seeder.js
```

### Frontend — Vercel

| Setting          | Value           |
| ---------------- | --------------- |
| Root Directory   | `client`        |
| Framework        | Vite            |
| Build Command    | `npm run build` |
| Output Directory | `dist`          |

**Environment variable on Vercel:**

```
VITE_API_URL=https://user-management-api-agv5.onrender.com/api
```

**SPA routing fix** — `client/vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 🔒 Security Practices

- Passwords hashed with **bcrypt** (salt rounds: 12) — never stored or returned as plain text
- **JWT access tokens** expire in 15 minutes, minimizing exposure from token theft
- **Refresh token rotation** — a new refresh token is issued on every refresh, old one is invalidated
- **Helmet.js** sets secure HTTP headers (XSS protection, content type sniffing prevention, etc.)
- **CORS** configured to only allow requests from the known frontend origin
- **Rate limiting** — 100 requests per 15 minutes per IP on all `/api` routes
- **Input validation** at the controller level prevents malformed data
- **MongoDB injection** prevented by using Mongoose's typed schema and query builders
- **Environment variables** used for all secrets — never hardcoded
- `select: false` on `password` and `refreshToken` fields — never accidentally exposed in responses

---

## 🛠️ Tech Stack

| Layer         | Technology                 | Why                                    |
| ------------- | -------------------------- | -------------------------------------- |
| Frontend      | React 18 + Vite            | Fast HMR, modern hooks                 |
| Routing       | React Router v6            | Nested routes, outlet pattern          |
| Forms         | React Hook Form + Zod      | Performant, schema-based validation    |
| HTTP Client   | Axios                      | Interceptors for auto token refresh    |
| State         | React Context API          | Lightweight, sufficient for auth state |
| Notifications | React Hot Toast            | Minimal, clean toasts                  |
| Icons         | Lucide React               | Consistent, tree-shakeable icons       |
| Backend       | Node.js + Express          | Minimal, flexible REST API             |
| Database      | MongoDB + Mongoose         | Flexible schema, rich query API        |
| Auth          | JWT (jsonwebtoken)         | Stateless, scalable                    |
| Password      | bcryptjs                   | Industry-standard hashing              |
| Security      | Helmet + CORS + Rate Limit | Defense in depth                       |
| Deployment    | Render + Vercel            | Free tier, auto-deploy from GitHub     |

---

## 📝 Scripts

### Backend (`/server`)

```bash
yarn run dev      # Start with nodemon (hot reload)
yarn start        # Start for production (Also Checks Seed)
yarn run seed     # Seed database with 3 default users
```

### Frontend (`/client`)

```bash
yarn run dev      # Start Vite dev server
yarn run build    # Build for production
yarn run preview  # Preview production build locally
```

---

## 🤝 Git Commit Convention

This project follows conventional commits:

```
feat:     New feature
fix:      Bug fix
refactor: Code restructure without behavior change
chore:    Config, dependencies, tooling
docs:     Documentation only
```

---

## 📄 License

MIT — free to use for educational purposes.
