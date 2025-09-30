# Исправление проблемы "Failed to add workshop"

## Проблема
При попытке добавить мастер-класс в базу данных возникала ошибка "Failed to add workshop".

## Причины проблемы:

### 1. Неправильное использование spread оператора
- В функциях `addWorkshop` и `updateWorkshop` использовался `...workshopData`
- Это передавало поля формы, которые не соответствуют структуре таблицы БД

### 2. Несоответствие полей категорий
- В форме использовались текстовые значения (art, crafts, cooking)
- В БД ожидается `category_id` (UUID) из таблицы `workshop_categories`

## Решение:

### 1. Исправлены функции в `workshopStore.ts`:

#### `addWorkshop()`:
- Убран spread оператор `...workshopData`
- Добавлено явное указание всех полей
- Добавлен запрос для получения `category_id` по имени категории
- Добавлено логирование ошибок

#### `updateWorkshop()`:
- Аналогичные исправления
- Правильное преобразование данных формы в поля БД

### 2. Обновлена форма `WorkshopForm.tsx`:
- Изменены значения категорий на те, что есть в БД:
  - "Искусство и творчество"
  - "Ремесла и рукоделие" 
  - "Кулинария"
  - "Музыка и танцы"
  - "Языки и образование"
  - "Технологии"

### 3. Добавлены переводы:
- Добавлен перевод для категории "education" в ru.json и en.json

## Технические детали:

### Маппинг полей формы → БД:
```javascript
// Форма → БД
title → title
description → description  
shortDescription → short_description
instructorId → instructor_id
category → category_id (через запрос к workshop_categories)
skillLevel → skill_level
duration → duration
maxParticipants → max_participants
price → price
materialsCost → materials_cost
imageUrl → image_url
requirements → requirements
materials → materials
isRecurring → is_recurring
recurringPattern → recurring_pattern
tags → tags
```

### Получение category_id:
```javascript
const { data: categoryData } = await supabase
  .from('workshop_categories')
  .select('id')
  .eq('name', workshopData.category)
  .single();
categoryId = categoryData?.id || null;
```

## Результат:
Теперь мастер-классы должны корректно сохраняться в базе данных Supabase без ошибок!

## Файлы изменены:
- `src/stores/workshopStore.ts` - исправлены функции addWorkshop и updateWorkshop
- `src/components/workshops/WorkshopForm.tsx` - обновлены значения категорий
- `src/i18n/locales/ru.json` - добавлен перевод для education
- `src/i18n/locales/en.json` - добавлен перевод для education
