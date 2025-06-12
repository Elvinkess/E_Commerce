CREATE TABLE myusers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(320) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    role VARCHAR(320) NOT NULL DEFAULT 'user'
);

