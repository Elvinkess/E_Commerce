CREATE TABLE myusers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(320) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    role userRole NOT NULL DEFAULT 'user'
);

