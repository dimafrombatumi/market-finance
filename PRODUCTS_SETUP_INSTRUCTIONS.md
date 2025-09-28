# Инструкция по настройке добавления продуктов

## Проблема
RLS (Row Level Security) блокирует добавление продуктов в базу данных.

## Решение

### Вариант 1: Отключить RLS (рекомендуется для разработки)

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
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

### Вариант 2: Добавить тестовые данные через веб-интерфейс

1. Откройте Supabase Dashboard
2. Перейдите в раздел "Table Editor"
3. Выберите таблицу "products"
4. Нажмите "Insert" → "Insert row"
5. Добавьте тестовые продукты:

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

## После настройки

1. **Запустите приложение:**
   ```bash
   npm start
   ```

2. **Войдите в систему** (если не авторизованы)

3. **Перейдите на страницу Products**

4. **Нажмите "Add Product"** для добавления нового продукта

5. **Заполните форму** и нажмите "Add Product"

## Функционал добавления продуктов

### ✅ Что уже работает:
- **Форма добавления продукта** с валидацией
- **Store для управления продуктами** (Zustand)
- **Интеграция с Supabase** для сохранения данных
- **Автоматическое обновление списка** после добавления
- **Редактирование существующих продуктов**
- **Удаление продуктов**
- **Поиск по продуктам**

### 🔧 Компоненты:
- `src/components/products/ProductForm.tsx` - форма продукта
- `src/stores/productStore.ts` - store для управления состоянием
- `src/lib/supabaseUtils.ts` - утилиты для работы с БД
- `src/pages/ProductsPage.tsx` - страница со списком продуктов

### 📝 Поля формы:
- **Название продукта** (обязательно)
- **Описание** (обязательно)
- **Цена** (обязательно, > 0)
- **Себестоимость** (>= 0)
- **Категория** (обязательно, выбор из списка)
- **SKU** (опционально, уникальный)
- **Количество на складе** (>= 0)
- **Минимальный уровень запаса** (>= 0)
- **URL изображения** (опционально)

## Проверка работы

После настройки RLS запустите:
```bash
node setup-products-db.js
```

Должно показать успешное добавление продуктов.
