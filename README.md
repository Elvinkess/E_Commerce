# 🛒 NodeCommerce

NodeCommerce is a modern backend for an online store, built using **Node.js**, **TypeScript**, **Express**, **TypeORM**, and **PostgreSQL**. It provides essential e-commerce features like user authentication, product listings, cart management, order processing, payment handling, and delivery tracking.

---

## 🚀 Tech Stack

- **Node.js**
- **TypeScript**
- **Express.js**
- **PostgreSQL**
- **TypeORM**
- **Redis** – Used to store and manage cart items efficiently
- **Axios** – For making HTTP requests (e.g., to third-party APIs)
- **Flutterwave API** – For payments
- **Shipbubble API** – For deliveries

---

## ✨ Features

- 🔐 User authentication & JWT-based authorization
- 👤 User roles (Admin & Customer)
- 📦 Product & Category management
- 📊 Inventory control
- 🛒 Cart system powered by Redis
- 🧾 Order creation, deletion, and status updates
- 💳 Payment via Flutterwave
- 🚚 Shipping integration via Shipbubble
- 🧱 Modular & scalable Clean Architecture

---

## 🔄 Application Flow

### 1. 👤 User Registration & Login
- Register and log in with email/password
- Authenticated via JWT
- Access cart and order endpoints after login

### 2. 🗂️ Category Management
- **All users** can view categories
- **Admins only** can create new categories
- Suggested categories for delivery include:
  - `"Hot food"`, `"Dry food and supplements"`, `"Electronics and gadgets"`, `"Groceries"`, `"Sensitive items"`, `"Light weight items"`, `"Machinery"`, `"Medical supplies"`, `"Health and beauty"`, `"Furniture and fittings"`, `"Fashion wears"`

### 3. 🛍️ Product Browsing
- All users can view and search products
- Admins can create products (must belong to a category)
- Product attributes: name, description, price, image, etc.

### 4. 🛒 Cart Management (via Redis)
- Authenticated users:
  - Add items to cart
  - Update item quantities
  - Remove items
- Cart is stored in Redis per user session

### 5. 💳 Checkout & Payment
- Users can review cart and place orders
- Shipping info is collected before placing orders
- Payment is processed using **Flutterwave**
- Webhook support for confirming transactions (`/confirmpayment?tx_ref=...`)

### 6. 📦 Order Management
- Orders are created from the cart
- Includes shipping address, items, and user info
- Order lifecycle: `Pending → Paid → shipped → Delivered`
- Users can delete only pending orders i.e orders not paid for
- Admins can view and manage all orders

### 7. 🚚 Delivery (Shipbubble API)
- Delivery is automatically generated once an order is paid for
- Orders are dispatched via Shipbubble
- API auto-generates tracking ID and delivery updates
- Webhooks update order status in real-time



---

## 📦 REST API Highlights

| Method | Endpoint                              | Description                      |
|--------|---------------------------------------|----------------------------------|
| GET    | `/product`                            | View all products                |
| POST   | `/cart/addItem`                       | Add item to cart                 |
| GET    | `/cart/removeItem`                    | Remove item from cart            |
| GET    | `/order/:userId`                      | View a user's order              |
| GET    | `order/order/:userId"`                | Create order from cart           |
| DELETE | `/order/remove/:orderId/user/:userId` | Delete an order                  |
| GET    | `order/payment/:orderId`              | Initialize payment               |
| GET    | `order/confirmpayment?tx_ref=...`     | Handle Flutterwave webhook       |
| DELETE |  `/cart/remove/:cartId`               | Delete a cart                    |
| POST   |  `/user`                              | User sign in                     |
| POST   | `/user/signin`                        | User sign In                     |
| POST   |  `/product/product-with-image`        | Creates a product with a picture |
| POST   |  `/product/search`                    | Search for a product             |
| POST   |   `/address/`                         | Create address                   |
| GET    |    `/categories`                      | Get all categories               |
| POST   |   `/categories/`                      | Create categories                |
| GET    |    `/cart/getcart/:userId`            | Get pending cart                 |
---

## 🔗 Live Demo

Visit:  
👉 [https://e-commerce-as1q.onrender.com/product](https://e-commerce-as1q.onrender.com/product)

⚠️ **Note**: The Render PostgreSQL instance may go inactive if unused. You may need to:
- Recreate a new DB instance on Render
- Or connect your own PostgreSQL DB

---

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/Elvinkess/E_Commerce.git

# Navigate to the project
cd E_COMMERCEAPP

# Install dependencies
npm install

# Copy env variables and configure
cp .env.example .env

# Run migrations
npm run typeorm migration:run

# Start the development server
npm run dev
