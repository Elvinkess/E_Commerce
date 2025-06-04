CREATE TABLE inventory(
	id SERIAL PRIMARY KEY,
	quantity_available INTEGER,
	quantity_sold INTEGER,
	product_id INTEGER
);

