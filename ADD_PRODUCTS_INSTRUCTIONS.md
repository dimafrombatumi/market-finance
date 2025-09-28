# Инструкция по добавлению продуктов в базу данных

## Проблема
В настоящее время RLS (Row Level Security) блокирует добавление данных в базу данных. Нужно отключить RLS или настроить политики.

## Решение

### Вариант 1: Отключить RLS (рекомендуется для разработки)

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

### Вариант 2: Добавить данные через веб-интерфейс

1. Откройте Supabase Dashboard: https://supabase.com/dashboard
2. Выберите ваш проект
3. Перейдите в раздел "Table Editor"
4. Выберите таблицу "products"
5. Нажмите "Insert" → "Insert row"
6. Добавьте следующие тестовые продукты:

**Продукт 1:**
- name: "Handmade Ceramic Mug"
- description: "Beautiful handcrafted ceramic mug with unique glaze"
- price: 25.99
- cost: 12.50
- category: "Kitchen & Dining"
- stock_quantity: 15
- min_stock_level: 5
- sku: "MUG-001"

**Продукт 2:**
- name: "Wooden Cutting Board"
- description: "Premium oak cutting board with natural finish"
- price: 45.00
- cost: 22.00
- category: "Kitchen & Dining"
- stock_quantity: 8
- min_stock_level: 3
- sku: "WB-002"

**Продукт 3:**
- name: "Handwoven Scarf"
- description: "Soft wool scarf in earth tones"
- price: 35.50
- cost: 18.00
- category: "Clothing"
- stock_quantity: 2
- min_stock_level: 5
- sku: "SC-003"

## После добавления данных

После добавления данных через любой из вариантов, приложение автоматически загрузит продукты из базы данных и отобразит их на странице Products.

## Проверка

Запустите тест для проверки:
```bash
node test-supabase.js
```

Должно показать количество добавленных продуктов.
