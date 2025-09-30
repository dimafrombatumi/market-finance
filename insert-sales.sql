-- SQL скрипт для добавления 6 продаж
-- Market Finance Database

-- Сначала получаем ID продуктов для использования в продажах
-- Предполагаем, что продукты уже добавлены в базу данных

-- Продажа 1: iPhone 15 Pro + Apple Watch Series 9
INSERT INTO sales (customer_name, customer_email, customer_phone, subtotal, tax_amount, discount_amount, total_amount, payment_method, status, notes) VALUES
('Иван Петров', 'ivan.petrov@email.com', '+7-999-123-45-67', 1399.98, 139.99, 0.00, 1539.97, 'card', 'completed', 'Покупка для подарка');

-- Получаем ID только что созданной продажи и добавляем товары
INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    s.id,
    p.id,
    p.name,
    1,
    p.price,
    p.price
FROM sales s, products p
WHERE s.customer_name = 'Иван Петров' 
AND p.name = 'iPhone 15 Pro'
AND s.created_at = (SELECT MAX(created_at) FROM sales WHERE customer_name = 'Иван Петров');

INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    s.id,
    p.id,
    p.name,
    1,
    p.price,
    p.price
FROM sales s, products p
WHERE s.customer_name = 'Иван Петров' 
AND p.name = 'Apple Watch Series 9'
AND s.created_at = (SELECT MAX(created_at) FROM sales WHERE customer_name = 'Иван Петров');

-- Продажа 2: MacBook Air M3
INSERT INTO sales (customer_name, customer_email, customer_phone, subtotal, tax_amount, discount_amount, total_amount, payment_method, status, notes) VALUES
('Мария Сидорова', 'maria.sidorova@email.com', '+7-999-234-56-78', 1299.99, 130.00, 50.00, 1379.99, 'online', 'completed', 'Студенческая скидка');

INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    s.id,
    p.id,
    p.name,
    1,
    p.price,
    p.price
FROM sales s, products p
WHERE s.customer_name = 'Мария Сидорова' 
AND p.name = 'MacBook Air M3'
AND s.created_at = (SELECT MAX(created_at) FROM sales WHERE customer_name = 'Мария Сидорова');

-- Продажа 3: Nike Air Max 270 + Adidas Ultraboost 22
INSERT INTO sales (customer_name, customer_email, customer_phone, subtotal, tax_amount, discount_amount, total_amount, payment_method, status, notes) VALUES
('Алексей Козлов', 'alexey.kozlov@email.com', '+7-999-345-67-89', 330.00, 33.00, 0.00, 363.00, 'cash', 'completed', 'Покупка для спорта');

INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    s.id,
    p.id,
    p.name,
    1,
    p.price,
    p.price
FROM sales s, products p
WHERE s.customer_name = 'Алексей Козлов' 
AND p.name = 'Nike Air Max 270'
AND s.created_at = (SELECT MAX(created_at) FROM sales WHERE customer_name = 'Алексей Козлов');

INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    s.id,
    p.id,
    p.name,
    1,
    p.price,
    p.price
FROM sales s, products p
WHERE s.customer_name = 'Алексей Козлов' 
AND p.name = 'Adidas Ultraboost 22'
AND s.created_at = (SELECT MAX(created_at) FROM sales WHERE customer_name = 'Алексей Козлов');

-- Продажа 4: Samsung Galaxy S24 + Sony WH-1000XM5
INSERT INTO sales (customer_name, customer_email, customer_phone, subtotal, tax_amount, discount_amount, total_amount, payment_method, status, notes) VALUES
('Елена Волкова', 'elena.volkova@email.com', '+7-999-456-78-90', 1299.98, 130.00, 100.00, 1329.98, 'card', 'completed', 'Комплект для работы');

INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    s.id,
    p.id,
    p.name,
    1,
    p.price,
    p.price
FROM sales s, products p
WHERE s.customer_name = 'Елена Волкова' 
AND p.name = 'Samsung Galaxy S24'
AND s.created_at = (SELECT MAX(created_at) FROM sales WHERE customer_name = 'Елена Волкова');

INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    s.id,
    p.id,
    p.name,
    1,
    p.price,
    p.price
FROM sales s, products p
WHERE s.customer_name = 'Елена Волкова' 
AND p.name = 'Sony WH-1000XM5'
AND s.created_at = (SELECT MAX(created_at) FROM sales WHERE customer_name = 'Елена Волкова');

-- Продажа 5: Nintendo Switch OLED
INSERT INTO sales (customer_name, customer_email, customer_phone, subtotal, tax_amount, discount_amount, total_amount, payment_method, status, notes) VALUES
('Дмитрий Новиков', 'dmitry.novikov@email.com', '+7-999-567-89-01', 349.99, 35.00, 0.00, 384.99, 'online', 'completed', 'Подарок ребенку');

INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    s.id,
    p.id,
    p.name,
    1,
    p.price,
    p.price
FROM sales s, products p
WHERE s.customer_name = 'Дмитрий Новиков' 
AND p.name = 'Nintendo Switch OLED'
AND s.created_at = (SELECT MAX(created_at) FROM sales WHERE customer_name = 'Дмитрий Новиков');

-- Продажа 6: Dyson V15 Detect + Canon EOS R6 Mark II
INSERT INTO sales (customer_name, customer_email, customer_phone, subtotal, tax_amount, discount_amount, total_amount, payment_method, status, notes) VALUES
('Анна Смирнова', 'anna.smirnova@email.com', '+7-999-678-90-12', 3249.98, 325.00, 200.00, 3374.98, 'card', 'completed', 'Покупка для дома и хобби');

INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    s.id,
    p.id,
    p.name,
    1,
    p.price,
    p.price
FROM sales s, products p
WHERE s.customer_name = 'Анна Смирнова' 
AND p.name = 'Dyson V15 Detect'
AND s.created_at = (SELECT MAX(created_at) FROM sales WHERE customer_name = 'Анна Смирнова');

INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    s.id,
    p.id,
    p.name,
    1,
    p.price,
    p.price
FROM sales s, products p
WHERE s.customer_name = 'Анна Смирнова' 
AND p.name = 'Canon EOS R6 Mark II'
AND s.created_at = (SELECT MAX(created_at) FROM sales WHERE customer_name = 'Анна Смирнова');
