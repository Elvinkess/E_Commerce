CREATE TABLE address(
     id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(320) UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    address_code INT NOT NULL,
    user_id INT NOT NULL,
    address TEXT NOT NULL
)


