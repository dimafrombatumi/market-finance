-- Объединенный SQL скрипт для добавления 10 продуктов и 6 продаж
-- Market Finance Database

-- ==============================================
-- ДОБАВЛЕНИЕ 10 ПРОДУКТОВ
-- ==============================================

INSERT INTO products (name, description, price, cost, category, stock_quantity, min_stock_level, sku) VALUES
('iPhone 15 Pro', 'Новейший смартфон Apple с титановым корпусом и чипом A17 Pro', 999.99, 750.00, 'Электроника', 25, 5, 'IPH15PRO-001'),
('MacBook Air M3', 'Ультратонкий ноутбук с чипом M3 и 13-дюймовым дисплеем', 1299.99, 950.00, 'Электроника', 15, 3, 'MBA-M3-001'),
('Sony WH-1000XM5', 'Беспроводные наушники с активным шумоподавлением', 399.99, 280.00, 'Аудио', 30, 8, 'SONY-WH1000XM5'),
('Nike Air Max 270', 'Кроссовки с воздушной подушкой и современным дизайном', 150.00, 90.00, 'Обувь', 50, 10, 'NIKE-AM270-001'),
('Adidas Ultraboost 22', 'Беговые кроссовки с технологией Boost', 180.00, 110.00, 'Обувь', 40, 8, 'ADIDAS-UB22-001'),
('Samsung Galaxy S24', 'Флагманский Android смартфон с ИИ-функциями', 899.99, 650.00, 'Электроника', 20, 4, 'SAMSUNG-S24-001'),
('Apple Watch Series 9', 'Умные часы с датчиком здоровья и GPS', 399.99, 280.00, 'Носимые устройства', 35, 7, 'AW-S9-001'),
('Dyson V15 Detect', 'Беспроводной пылесос с лазерной технологией обнаружения пыли', 749.99, 520.00, 'Бытовая техника', 12, 3, 'DYSON-V15-001'),
('Nintendo Switch OLED', 'Игровая консоль с OLED-экраном', 349.99, 250.00, 'Игры', 18, 5, 'NINTENDO-SW-OLED'),
('Canon EOS R6 Mark II', 'Зеркальная камера для профессиональной фотографии', 2499.99, 1800.00, 'Фото и видео', 8, 2, 'CANON-R6M2-001');

-- ==============================================
-- ДОБАВЛЕНИЕ 6 ПРОДАЖ
-- ==============================================

-- Продажа 1: iPhone 15 Pro + Apple Watch Series 9
INSERT INTO sales (customer_name, customer_email, customer_phone, subtotal, tax_amount, discount_amount, total_amount, payment_method, status, notes) VALUES
('Иван Петров', 'ivan.petrov@email.com', '+7-999-123-45-67', 1399.98, 139.99, 0.00, 1539.97, 'card', 'completed', 'Покупка для подарка');

-- Добавляем товары к продаже 1
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

-- ==============================================
-- ПРОВЕРКА РЕЗУЛЬТАТОВ
-- ==============================================

-- Показать добавленные продукты
SELECT 'PRODUCTS' as table_name, COUNT(*) as count FROM products;

-- Показать добавленные продажи
SELECT 'SALES' as table_name, COUNT(*) as count FROM sales;

-- Показать добавленные позиции продаж
SELECT 'SALE_ITEMS' as table_name, COUNT(*) as count FROM sale_items;

-- Показать общую статистику
SELECT 
    'SUMMARY' as info,
    (SELECT COUNT(*) FROM products) as products_count,
    (SELECT COUNT(*) FROM sales) as sales_count,
    (SELECT COUNT(*) FROM sale_items) as sale_items_count,
    (SELECT SUM(total_amount) FROM sales) as total_revenue;
