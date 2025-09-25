# 🛒 NodeCommerce

NodeCommerce is a modern backend for an online store, built using **Node.js**, **TypeScript**, **Express**, **TypeORM**, and **PostgreSQL**. It provides essential e-commerce features like user authentication, product listings, cart management, order processing, payment handling, and delivery tracking. Now, **guest users can browse products and manage a temporary cart without signing up**, and admins can create categories on the fly while creating a product.

---

## 🚀 Tech Stack

* **Node.js**
* **TypeScript**
* **Express.js**
* **PostgreSQL**
* **TypeORM**
* **Redis** – Used to store and manage cart items efficiently (including guest sessions)
* **Axios** – For making HTTP requests (e.g., to third-party APIs)
* **Flutterwave API** – For payments
* **Shipbubble API** – For deliveries

---

## ✨ Features

* 🔐 User authentication & JWT-based authorization
* 👤 User roles (Admin & Customer)
* 🛒 **Guest user cart functionality**
* 📦 Product & Category management
* 📊 Inventory control
* 🧾 Order creation, deletion, and status updates
* 💳 Payment via Flutterwave
* 🚚 Shipping integration via Shipbubble
* 🧱 Modular & scalable Clean Architecture

---

## 🔄 Application Flow

### 1. 👤 User Registration & Login

* Register and log in with email/password
* Authenticated via JWT
* Access cart and order endpoints after login

### 2. 🧑‍💻 Guest User Flow

* Guests can browse products and categories without logging in
* Can add products to a **temporary cart** stored in Redis (session-based)
* Guest cart can be converted to a user cart upon registration or login
* Checkout for guests requires creating a temporary session and providing shipping info

### 3. 🗂️ Category Management

* **All users**, including guests, can view categories
* **Admins only** can create new categories
* **Admins can create a category on the fly while creating a product** if it doesn’t exist yet
* Suggested categories for delivery include:

  * `Hot food`, `Dry food and supplements`, `Electronics and gadgets`, `Groceries`, `Sensitive items`, `Light weight items`, `Machinery`, `Medical supplies`, `Health and beauty`, `Furniture and fittings`, `Fashion wears`

### 4. 🛍️ Product Browsing & Creation

* All users, including guests, can view and search products
* **Admins** can:

  * Create products (must belong to a category)
  * **Create a new category on the fly** while creating a product
* Product attributes: name, description, price, image, etc.

### 5. 🛒 Cart Management (via Redis)

* **Authenticated users**:

  * Add items to cart
  * Update item quantities
  * Remove items
* **Guest users**:

  * Add items to a temporary session-based cart
  * Update or remove items
  * Cart persists only for the session
* Cart is stored in Redis per user or guest session

### 6. 💳 Checkout & Payment

* Users and guests can review cart and place orders
* Shipping info is collected before placing orders
* Payment is processed using **Flutterwave**
* Webhook support for confirming transactions (`/confirmpayment?tx_ref=...`)

### 7. 📦 Order Management

* Orders are created from the cart
* Includes shipping address, items, and user info
* Order lifecycle: `Pending → Paid → Shipped → Delivered`
* Users can delete only pending orders (orders not paid for)
* Admins can view and manage all orders

### 8. 🚚 Delivery (Shipbubble API)

* Delivery is automatically generated once an order is paid for
* Orders are dispatched via Shipbubble
* API auto-generates tracking ID and delivery updates
* Webhooks update order status in real-time

---

## 📦 REST API Highlights

| Method | Endpoint                              | Description                        |
| ------ | ------------------------------------- | ---------------------------------- |
| GET    | `/product`                            | View all products (guests allowed) |
| POST   | `/cart/addItem`                       | Add item to cart (guests allowed)  |
| GET    | `/cart/removeItem`                    | Remove item from cart              |
| GET    | `/order/:userId`                      | View a user's order                |
| GET    | `order/order/:userId`                 | Create order from cart             |
| GET    | `/order/payment/:orderId`             | Initialize payment                 |
| GET    | `/order/confirmpayment?tx_ref=...`    | Handle Flutterwave webhook         |
| POST   | `/user`                               | User sign up                       |
| POST   | `/user/signin`                        | User sign in                       |
| POST   | `/product/product-with-image`         | Creates a product with a picture   |
| POST   | `/product/search`                     | Search for a product               |
| POST   | `/address/`                           | Create address                     |
| GET    | `/categories`                         | Get all categories                 |
| POST   | `/categories/`                        | Create categories                  |
| GET    | `/cart/getcart/:userId`               | Get pending cart (guests & users)  |
| PATCH  | `/guest/item/:productId`              | Update(guest) the quantity of a cart Item  |
| DELETE | `/cart/clear/guest`                   | Remove Cart for guest users        |
| DELETE | `/order/remove/:orderId/user/:userId` | Delete an order                    |
| DELETE | `/cart/remove/:cartId`                | Delete a cart                      |
| DELETE | `/cart/guest/item/:productId`         | Delete a guest cart item           |




---

## 🔗 Live Demo

Visit the demo:
https://ecommerce-frontend-blue-phi.vercel.app/

Important Notes:

The mobile version of the site is currently unavailable.

The Render PostgreSQL instance may become inactive or expire, which could cause temporary access issues. To resolve this, you may:

Create a new database instance on Render, or

Connect to your own PostgreSQL database.
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
```
