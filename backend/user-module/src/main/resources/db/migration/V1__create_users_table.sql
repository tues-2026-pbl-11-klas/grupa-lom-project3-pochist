CREATE TABLE users (
                       uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       role VARCHAR(50) NOT NULL DEFAULT 'USER',
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       username VARCHAR(100) NOT NULL,
                       points INT NOT NULL DEFAULT 0,
                       streak INT NOT NULL DEFAULT 0,
                       bonus_multiplier FLOAT,
                       verified_since TIMESTAMP,
                       admin_level INT,
                       created_at TIMESTAMP NOT NULL,
                       updated_at TIMESTAMP NOT NULL
);