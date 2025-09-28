# Исправление RLS в Supabase

## Проблема
При попытке добавить данные в базу данных возникает ошибка:
```
new row violates row-level security policy for table "products"
```

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

### Вариант 2: Создать политики для анонимных пользователей

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

## После исправления

После выполнения одного из вариантов, запустите скрипт для добавления тестовых данных:

```bash
node seed-database.js
```

## Проверка

Проверьте, что данные добавились:

```bash
node test-supabase.js
```
