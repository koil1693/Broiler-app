--
-- WARNING: This file is for development purposes ONLY.
-- Do NOT use in production. Default users should be created via a secure setup process.
-- Passwords for the users below are 'devpassword'.
--

-- Clear existing data to avoid duplicates on restart
DELETE FROM vendor;
DELETE FROM driver;
DELETE FROM admin;
DELETE FROM rate_settings;

INSERT INTO admin (username, password)
VALUES ('admin', '$2a$10$E.q363n3t3kS2s2i4o4O5.V0i8.U7f6E9e0p1q2r3s4t5u6v7w8x9'); -- pass: devpassword

INSERT INTO driver (name, username, password)
VALUES ('Ravi Kumar', 'ravi', '$2a$10$E.q363n3t3kS2s2i4o4O5.V0i8.U7f6E9e0p1q2r3s4t5u6v7w8x9'); -- pass: devpassword

-- Assuming a redesigned, more structured 'vendor' table
-- Example: CREATE TABLE vendor (id BIGSERIAL PRIMARY KEY, name VARCHAR(255), contact_person VARCHAR(255), phone_number VARCHAR(20), address_line1 VARCHAR(255), city VARCHAR(100), state VARCHAR(100), postal_code VARCHAR(20));
INSERT INTO vendor (name, contact_person, phone_number, address_line1, city, state, postal_code)
VALUES ('Fresh Farms', 'Meena', '9876543210', '123 Poultry Lane', 'Chennai', 'Tamil Nadu', '600001'),
       ('Green Poultry', 'Suresh', '9123456780', '456 Rooster Road', 'Bengaluru', 'Karnataka', '560001');

-- Assuming a redesigned 'rate_settings' table with typed values
-- Example: CREATE TABLE rate_settings (id BIGSERIAL PRIMARY KEY, base_rate DECIMAL(10, 2) NOT NULL);
INSERT INTO rate_settings (base_rate)
VALUES (120.00);
