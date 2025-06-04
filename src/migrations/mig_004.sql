CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
	cart_item_ids INTEGER[] NOT NULL,
    user_status user_status NOT NULL
);