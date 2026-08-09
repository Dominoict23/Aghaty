# 🛍️ Aghaty - Multi-Vendor E-Commerce & Service Marketplace API

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18-blue?style=for-the-badge&logo=express)
![Sequelize](https://img.shields.io/badge/Sequelize-ORM-52B0E7?style=for-the-badge&logo=sequelize)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Authenticated-black?style=for-the-badge&logo=json-web-tokens)
![License](https://img.shields.io/badge/License-ISC-yellow?style=for-the-badge)

**Aghaty** is a production-grade, highly scalable RESTful API engine designed for a comprehensive multi-vendor e-commerce and on-demand services platform. Built with **Node.js**, **Express.js**, **Sequelize ORM**, and **MySQL**, it powers an ecosystem supporting 5 distinct user roles: **Customers (Users)**, **Product Sellers**, **Service Sellers**, **Delivery Agents**, and **Platform Administrators**.

---

## 🚀 Key Features & System Capabilities

### 🔐 1. Multi-Role Authentication & Access Control (RBAC)
- Custom JWT-based authentication middleware (`verifyToken` & `checkUserAuth`).
- Dedicated authorization flows for `admin`, `user`, `productSeller`, `serviceSeller`, and `delivery`.
- Password hashing using `bcrypt` and secure password reset workflow (`forgetPassword`).

### 📦 2. E-Commerce Core & Inventory Management
- Multi-tier product categorizations: **Categories** ➡️ **SubCategories** ➡️ **Products**.
- Interactive shopping cart management (Add, Update Quantity, Remove, Clear).
- Order processing & checkout with discount promo codes (`DiscountCode`).
- Product rating, review system, and image asset attachments.

### 🛠️ 3. On-Demand Services Engine
- Service provider registration and listing management.
- Dynamic service categories, sub-services, and direct user booking workflows (`ServiceOrder`).

### 🚚 4. Logistics & Delivery System
- Automated and admin-assigned order delivery routing.
- Delivery sub-categories (e.g. standard delivery, express, taxi logistics).
- Delivery partner earnings and financial transaction history.

### 💰 5. Financial Ledger & Auditing
- Automated seller & delivery financial records (`FinancialRecord`).
- Platform commission and payout tracking for admins.

### 📱 6. Social Feed & Engagement
- In-app social engagement features: **Posts**, **Stories**, **Likes**, **Comments**, and **Banners**.
- Firebase Integration for real-time notifications and messaging.

### 📁 7. File & Media Management
- File & video upload handling via `Multer` with extension filtering (`.png`, `.jpg`, `.mp4`, `.mov`, `.webp`).
- Compression middleware for response optimization.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technologies / Libraries |
| :--- | :--- |
| **Runtime & Framework** | Node.js, Express.js |
| **Database & ORM** | MySQL, Sequelize ORM, `mysql2` |
| **Authentication & Security** | JSON Web Tokens (`jsonwebtoken`), `bcrypt`, `cors`, `dotenv` |
| **Validation & Error Handling**| `yup` object schema validation, Custom HTTP Error Catcher |
| **Media & Storage** | `multer`, `fluent-ffmpeg` |
| **Performance** | `compression` |
| **Push Notifications** | `firebase-admin` |

---

## 🗄️ Database Architecture (31 Models)

The relational schema is managed declaratively via Sequelize ORM models:

```
                  ┌─────────────────┐
                  │      User       │
                  └────────┬────────┘
                           │ 1:N
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
       ┌──────────┐  ┌──────────┐  ┌──────────┐
       │   Cart   │  │  Order   │  │   Post   │
       └──────────┘  └────┬─────┘  └──────────┘
                          │ 1:N
                          ▼
                   ┌──────────────┐
                   │ OrderDelivery│
                   └──────┬───────┘
                          │ N:1
                          ▼
                   ┌──────────────┐
                   │   Delivery   │
                   └──────────────┘
```

**Core Data Models:**
`Admin`, `User`, `Seller`, `Delivery`, `Product`, `Category`, `SubCategory`, `Service`, `ServiceOrder`, `Order`, `OrderProduct`, `OrderDelivery`, `OrderPackage`, `Cart`, `CartProduct`, `DiscountCode`, `FinancialRecord`, `Post`, `Story`, `Comment`, `Like`, `Rate`, `Feedback`, `Banner`, `Location`, `UserLocation`, `SocialMedia`, `Message`, `Image`, `Video`, `Live`.

---

## 🗺️ API Endpoints Summary

All API routes are prefixed under `/api/v1`:

### 🔑 Authentication & Common
- `POST /api/v1/login` - Unified login endpoint for users, sellers, and delivery staff.

### 🛡️ Admin Management (`/api/v1/admin`)
- `POST /login` - Admin login
- `POST /addSeller` | `PATCH /editSeller` | `DELETE /deleteSeller` | `GET /allSellers` - Vendor management
- `POST /addCategory` | `PATCH /editCategory` | `DELETE /deleteCategory` | `GET /allCategory` - Global categories
- `POST /addDelivery` | `PATCH /editDelivery` | `DELETE /deleteDelivery` | `GET /allDeliveries` - Logistics fleet
- `GET /FinancialRecords/seller/:SellerId` | `GET /FinancialRecords/delivery/:DeliveryId` - Financial ledgers

### 👤 Customer Endpoints (`/api/v1/user`)
- `POST /signup` - User registration
- `GET /products` | `GET /product/:id` - Browse catalog
- `POST /addToCart` | `GET /cart` | `DELETE /cart/:id` - Shopping cart
- `POST /createOrder` | `GET /myOrders` - Checkout & order history
- `POST /addRating` | `POST /addComment` - User engagement

### 🏬 Product Seller Endpoints (`/api/v1/productSeller`)
- `POST /addProduct` | `PATCH /editProduct` | `DELETE /deleteProduct` - Product management
- `GET /myProducts` | `GET /myOrders` - Store operations

### 🔧 Service Seller Endpoints (`/api/v1/serviceSeller`)
- `POST /addService` | `PATCH /editService` | `DELETE /deleteService` - Service catalog
- `GET /myServices` | `GET /myOrders` - Service bookings

### 🚚 Delivery Agent Endpoints (`/api/v1/delivery`)
- `GET /availableOrders` | `PATCH /acceptOrder` | `PATCH /updateOrderStatus` - Logistics execution

---

## 📂 Project Structure

```
Aghaty/
├── app.js                 # Express application configuration & middleware setup
├── index.js               # Server bootstrap & Sequelize DB synchronization
├── firebaseConfig.js      # Firebase Admin SDK initialization
├── controllers/           # Request handlers for admin, user, sellers, delivery
├── routes/                # Modular Express routers
├── models/                # 31 Sequelize ORM model definitions & associations
├── middleware/            # JWT verification, RBAC auth, error catchers, file uploads
├── validation/            # Yup validation schemas
├── utils/                 # Helper functions & utilities
├── db/                    # DB connection & seeder scripts
├── uploads/               # Uploaded media assets storage
└── .env.example           # Environment template
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js** (v16+ recommended)
- **MySQL Server** (v8.0+)

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Dominoict23/Aghaty.git
   cd Aghaty
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy `.env.example` to `.env` and fill in your local MySQL credentials:
   ```bash
   cp .env.example .env
   ```

4. **Database Migration & Seeding (Optional)**
   ```bash
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3500`.

---

## 📜 License

This project is licensed under the **ISC License**.