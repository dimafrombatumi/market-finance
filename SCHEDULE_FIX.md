# Исправление проблемы с добавлением расписаний

## Проблема
Расписания не добавлялись в базу данных и не отображались в интерфейсе.

## Причины и решения

### 1. **Проблема с маппингом полей БД ↔ Код**

**Проблема**: В базе данных поле называется `workshop_id`, но в коде использовалось `workshopId`.

**Решение**: Добавлен правильный маппинг во всех функциях:
```javascript
// В fetchSchedules, addSchedule, updateSchedule
const schedules = data?.map(schedule => ({
  ...schedule,
  workshopId: schedule.workshop_id, // ← ДОБАВЛЕНО
  startDate: new Date(schedule.start_date),
  endDate: new Date(schedule.end_date),
}))
```

### 2. **Улучшена валидация формы**

**Проблема**: Не было валидации обязательных полей перед отправкой.

**Решение**: Добавлена валидация в `WorkshopScheduleForm.tsx`:
```javascript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Валидация обязательных полей
  if (!formData.location.trim()) {
    alert(t('workshops.schedule.locationRequired'));
    return;
  }
  
  if (!formData.startTime || !formData.endTime) {
    alert(t('workshops.schedule.timeRequired'));
    return;
  }
  
  // ... остальная логика
};
```

### 3. **Улучшена обработка ошибок**

**Проблема**: Ошибки не отображались пользователю.

**Решение**: Добавлено отображение ошибок:
```javascript
} catch (error) {
  console.error('Error saving schedule:', error);
  alert(`Ошибка при сохранении расписания: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
}
```

### 4. **Добавлены переводы для валидации**

**Проблема**: Сообщения валидации не были переведены.

**Решение**: Добавлены переводы в `ru.json` и `en.json`:
```json
{
  "schedule": {
    "locationRequired": "Поле 'Место проведения' обязательно для заполнения",
    "timeRequired": "Поля 'Время начала' и 'Время окончания' обязательны для заполнения"
  }
}
```

## Технические детали

### Маппинг полей БД → Код:
- `workshop_id` → `workshopId` (добавлено)
- `start_date` → `startDate` (уже было)
- `end_date` → `endDate` (уже было)
- `start_time` → `startTime` (уже было)
- `end_time` → `endTime` (уже было)

### Обязательные поля в БД:
- `location` (VARCHAR(255) NOT NULL)
- `start_time` (TIME NOT NULL)
- `end_time` (TIME NOT NULL)
- `max_participants` (INTEGER NOT NULL)

## Результат

- ✅ **Расписания добавляются** в базу данных
- ✅ **Расписания отображаются** в карточках мастер-классов
- ✅ **Валидация работает** - показываются ошибки для пустых полей
- ✅ **Ошибки отображаются** пользователю
- ✅ **Переводы работают** для всех сообщений

## Файлы изменены

1. **`src/stores/workshopStore.ts`**:
   - Добавлен маппинг `workshopId: schedule.workshop_id` во всех функциях
   - Исправлены `fetchSchedules`, `addSchedule`, `updateSchedule`

2. **`src/components/workshops/WorkshopScheduleForm.tsx`**:
   - Добавлена валидация обязательных полей
   - Улучшена обработка ошибок

3. **`src/i18n/locales/ru.json` и `en.json`**:
   - Добавлены переводы для сообщений валидации

## Как проверить

1. Откройте страницу мастер-классов
2. Нажмите кнопку "Календарь" (📅) на любом мастер-классе
3. Заполните форму расписания:
   - ✅ **Место проведения** - обязательно
   - ✅ **Время начала/окончания** - обязательно
   - ✅ **Максимум участников** - обязательно
4. Нажмите "Сохранить"
5. Увидите расписание в карточке мастер-класса

Теперь добавление расписаний работает полностью корректно!
