# Исправление проблемы с отображением Description и Instructor

## Проблема
При редактировании мастер-класса не отображались поля Description и Instructor в форме.

## Причина
В функциях маппинга данных из базы в store не добавлялись поля `instructorId` и `shortDescription`, которые нужны для формы редактирования.

## Решение

### 1. Обновлена функция `fetchWorkshops`:
Добавлены недостающие поля в маппинг:
```javascript
const workshops = data?.map(workshop => ({
  ...workshop,
  skillLevel: workshop.skill_level || 'beginner',
  shortDescription: workshop.short_description || '', // ← ДОБАВЛЕНО
  instructorId: workshop.instructor_id || '',        // ← ДОБАВЛЕНО
  category: workshop.category?.name || '',
  // ... остальные поля
}))
```

### 2. Обновлена функция `addWorkshop`:
Добавлены те же поля в возвращаемые данные:
```javascript
const newWorkshop = {
  ...data,
  skillLevel: data.skill_level || 'beginner',
  shortDescription: data.short_description || '', // ← ДОБАВЛЕНО
  instructorId: data.instructor_id || '',        // ← ДОБАВЛЕНО
  category: data.category?.name || '',
  // ... остальные поля
};
```

### 3. Обновлена функция `updateWorkshop`:
Добавлены те же поля в возвращаемые данные:
```javascript
const updatedWorkshop = {
  ...data,
  skillLevel: data.skill_level || 'beginner',
  shortDescription: data.short_description || '', // ← ДОБАВЛЕНО
  instructorId: data.instructor_id || '',        // ← ДОБАВЛЕНО
  category: data.category?.name || '',
  // ... остальные поля
};
```

## Технические детали:

### Маппинг полей БД → Форма:
- `description` → `description` (уже было)
- `short_description` → `shortDescription` (добавлено)
- `instructor_id` → `instructorId` (добавлено)
- `instructor` → `instructor` (объект инструктора, уже было)

### Почему это важно:
- Форма редактирования ожидает поля `instructorId` для выбора инструктора
- Форма ожидает поле `shortDescription` для краткого описания
- Без этих полей форма не может правильно заполниться при редактировании

## Результат:
- ✅ Поле Description отображается при редактировании
- ✅ Поле Instructor отображается и можно выбрать другого инструктора
- ✅ Поле Short Description отображается при редактировании
- ✅ Все остальные поля работают корректно

## Файлы изменены:
- `src/stores/workshopStore.ts` - добавлены недостающие поля в маппинг

Теперь редактирование мастер-классов работает полностью корректно!
