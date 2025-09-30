# Исправление проблемы с модальными окнами

## Проблема
После добавления мастер-класса модальное окно не закрывалось и открывалось новое окно добавления.

## Причина
В функции `handleSuccess` в модальных окнах не вызывался `onClose()`, поэтому окно оставалось открытым.

## Решение

### 1. Исправлено модальное окно мастер-класса (`WorkshopFormModal.tsx`):
- Добавлен вызов `onClose()` в функции `handleSuccess`
- Добавлены уведомления об успешном сохранении
- Исправлен импорт хука уведомлений

### 2. Исправлено модальное окно расписания (`WorkshopScheduleModal.tsx`):
- Добавлены уведомления об успешном сохранении
- Исправлен импорт хука уведомлений

### 3. Добавлены уведомления:
- При успешном сохранении мастер-класса показывается уведомление
- При успешном сохранении расписания показывается уведомление
- Уведомления автоматически исчезают через некоторое время

## Код изменений:

### WorkshopFormModal.tsx:
```javascript
const handleSuccess = () => {
  addNotification({
    type: 'success',
    title: t('common.success'),
    message: t('workshops.workshopSaved')
  });
  onClose(); // Close the modal after successful save
};
```

### WorkshopScheduleModal.tsx:
```javascript
const handleSuccess = () => {
  addNotification({
    type: 'success',
    title: t('common.success'),
    message: t('workshops.schedule.saved')
  });
  onClose();
};
```

## Результат:
- ✅ Модальные окна закрываются после успешного сохранения
- ✅ Показываются уведомления об успехе
- ✅ Не открываются новые окна после сохранения
- ✅ Пользователь видит результат своих действий

## Файлы изменены:
- `src/components/workshops/WorkshopFormModal.tsx`
- `src/components/workshops/WorkshopScheduleModal.tsx`

Теперь модальные окна работают корректно!
