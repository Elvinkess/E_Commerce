CREATE TABLE delivery (
    id SERIAL PRIMARY KEY,
    orderId INTEGER,
    userId INTEGER,
    addressId TEXT,
    trackingUrl TEXT,
    status delivery_status NOT NULL DEFAULT 'pending',
    date TIMESTAMPTZ DEFAULT NOW()
);

