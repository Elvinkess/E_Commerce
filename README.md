# NodeCommerce

NodeCommerce, as the name implies, is a modern online store backend built with Node.js, TypeScript, TypeORM, PostgreSQL, and Express. It provides a solid foundation for handling products, categories, inventory, users, carts, orders, and deliveries.



## 🚀 Tech Stack

- **Nodejs**
- **TypeScript**
- **Expressjs**
- **PostgreSQL**
- **TypeORM**
- **Axios HTTP**

## ✨ Features

- User authentication and Authorization (JWT-based)
- User roles (Admin and User:customer)
- Product listing and management
- Inventory management
- Shopping cart functionality
- Order processing
- Payment Service with flutterwave API
- Delivery Service with Shipbubble API
- Object relational Mapping with TypeORM
- Database integration with PostgreSQL
- Scalable and modular project structure (Clean Architecture)

    ## 🔄 Application Flow

### 1. 👤 User Registration & Login
- Users can register using their email and password.
- Authentication is handled via JWT tokens.
- Logged-in users can access cart and order functionalities.
- Each user has a unique ID


### 2. 🛍️ Product categories
- All users can view categories.
- Only Admin  can create a  category.  Since shipping is handled by an API service(please create product under these  category to make life easy for the delivery company: "Hot food","Dry food and supplements","Electronics and gadgets","Groceries","Sensitive items (ATM cards, documents)","Light weight items","Machinery","Medical supplies","Health and beauty","Furniture and fittings","Fashion wears")
- Each category has a unique ID that is needed to create a product,hence you cannot create a product without an existing category.

### 3. 🛍️ Product Browsing
- All users can view products.
- Only Admin can  create a  product, every product must have a  category,hence a category ID is mandatoryto create a product.
- Supports product search and filtering.
- Each product displays details like name, description, price, and image.

### 4. 🛒 Cart Management
- Authenticated users can add, update, or remove items from their cart.
- Cart data is persisted in the database for each user.

### 5. 💳 Checkout
- Users can review cart contents and proceed to checkout.
- Shipping information is collected before order placement.
- Optional integration with payment gateways.

### 6. 📦 Order Placement
- Orders are created and stored in the database.
- Includes product items, user info, and shipping address.
- Order status starts as "Pending".

### 7. 🚚 Shipping & Delivery
- Orders are dispatched via  Shipbubble API.
- Shipping info and tracking ID are updated in the order.
- Order status is updated in real-time as delivery progresses via web hookes.

### 8. 🛠️ Admin Panel *(Optional)*
- Admins can:
  - Add, update, and delete products
  - Manage all user orders
  - Monitor delivery statuses

## Live Demo

Check out the live version of this project on [Render](https://e-commerce-as1q.onrender.com/product).
This endpoint returns all products from the store.




## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/Elvinkess/E_Commerce.git

# Navigate to the project directory
cd E_COMMERCEAPP

# Install dependencies
npm install

# Setup environment variables (see `.env.example`)
cp .env.example .env

# Run migrations (if applicable)
npm run typeorm migration:run

# Start the server
npm run dev
