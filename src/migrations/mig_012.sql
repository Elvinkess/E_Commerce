CREATE TABLE order_payment(
id SERIAL PRIMARY KEY,
 amount  INT NOT NULL,
 status VARCHAR(320) NOT NULL DEFAULT 'pending',
 orderId INT NOT NULL,
 userEmail VARCHAR(320) NOT NULL,
 date TIMESTAMPTZ DEFAULT NOW(),
 remarks TEXT,
 processorReference TEXT,
 transactionReference TEXT,
 deliveryAmount  INT NOT NULL
);
