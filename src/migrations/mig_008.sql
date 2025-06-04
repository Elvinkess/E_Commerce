CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    total_price DECIMAL(10, 2) NOT NULL,
    status order_status DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT now()
    
);