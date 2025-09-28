# Ручное добавление данных в Supabase

## Проблема
RLS (Row Level Security) блокирует все операции записи в базу данных. Нужно либо отключить RLS, либо создать правильные политики.

## Решение 1: Отключить RLS через Supabase Dashboard

1. Откройте Supabase Dashboard: https://supabase.com/dashboard
2. Выберите ваш проект
3. Перейдите в раздел "SQL Editor"
4. Выполните следующий SQL скрипт:

```sql
-- Отключаем RLS для всех таблиц
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
```

## Решение 2: Создать политики для анонимных пользователей

Если вы хотите оставить RLS включенным, выполните следующий SQL скрипт:

```sql
-- Удаляем старые политики
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON products;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON sales;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON sale_items;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON transactions;

-- Создаем новые политики для анонимных пользователей
CREATE POLICY "Allow all operations for anonymous users" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations for anonymous users" ON sales FOR ALL USING (true);
CREATE POLICY "Allow all operations for anonymous users" ON sale_items FOR ALL USING (true);
CREATE POLICY "Allow all operations for anonymous users" ON transactions FOR ALL USING (true);
```

## Решение 3: Добавить данные вручную через Supabase Dashboard

1. Откройте Supabase Dashboard: https://supabase.com/dashboard
2. Выберите ваш проект
3. Перейдите в раздел "Table Editor"
4. Выберите таблицу "products"
5. Нажмите "Insert" → "Insert row"
6. Добавьте следующие данные:

### Продукты:
- name: "Handmade Ceramic Mug"
- description: "Beautiful handcrafted ceramic mug with unique glaze"
- price: 25.99
- cost: 12.50
- category: "Kitchen & Dining"
- stock_quantity: 15
- min_stock_level: 5
- sku: "MUG-001"

- name: "Wooden Cutting Board"
- description: "Premium oak cutting board with natural finish"
- price: 45.00
- cost: 22.00
- category: "Kitchen & Dining"
- stock_quantity: 8
- min_stock_level: 3
- sku: "WB-002"

- name: "Handwoven Scarf"
- description: "Soft wool scarf in earth tones"
- price: 35.50
- cost: 18.00
- category: "Clothing"
- stock_quantity: 2
- min_stock_level: 5
- sku: "SC-003"

### Транзакции:
- type: "expense"
- category: "Materials & Supplies"
- description: "Clay and glaze materials"
- amount: 150.00
- date: (2 дня назад)
- notes: "Bulk order for ceramic production"

- type: "expense"
- category: "Rent & Utilities"
- description: "Studio rent"
- amount: 800.00
- date: (3 дня назад)

- type: "income"
- category: "Other Income"
- description: "Workshop teaching fee"
- amount: 200.00
- date: (4 дня назад)

- type: "income"
- category: "Sales Revenue"
- description: "Sale of ceramic mugs"
- amount: 77.97
- date: (1 день назад)
- notes: "Sold 3 ceramic mugs"

## После добавления данных

После добавления данных, проверьте, что они загружаются в приложении:

1. Откройте приложение в браузере: http://localhost:3000
2. Перейдите на страницу "Products" - должны отображаться добавленные продукты
3. Перейдите на страницу "Expenses" - должны отображаться добавленные транзакции
4. Перейдите на страницу "Dashboard" - должны отображаться статистики

## Проверка через скрипт

Запустите скрипт для проверки данных:

```bash
node test-supabase.js
```
