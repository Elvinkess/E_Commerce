CREATE TABLE cart_item (
    id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL,
	product_id INTEGER NOT NULL,
    purchased_price INT NOT NULL,
    quantity INT NOT NULL
);