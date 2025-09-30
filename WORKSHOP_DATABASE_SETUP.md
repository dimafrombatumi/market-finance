# Настройка базы данных для мастер-классов

## Обзор

Вся функциональность мастер-классов уже интегрирована с базой данных Supabase. Этот документ описывает, как настроить и использовать систему.

## Предварительные требования

1. **Supabase проект** - создайте проект на [supabase.com](https://supabase.com)
2. **Переменные окружения** - настройте подключение к базе данных

## Настройка

### 1. Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Дождитесь завершения инициализации

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

Получите эти значения в Supabase Dashboard:
- **URL**: Settings → API → Project URL
- **Anon Key**: Settings → API → Project API keys → anon public

### 3. Применение схемы базы данных

#### Вариант 1: Автоматическая настройка (рекомендуется)

```bash
node setup-workshop-database.js
```

Этот скрипт:
- Проверит подключение к базе данных
- Применит схему (если возможно)
- Добавит тестовые данные
- Проверит работоспособность

#### Вариант 2: Ручное применение схемы

1. Откройте Supabase Dashboard
2. Перейдите в SQL Editor
3. Скопируйте содержимое файла `workshop-schema.sql`
4. Выполните SQL запросы

### 4. Добавление тестовых данных

```bash
node add-test-workshops.js
```

## Структура базы данных

### Таблицы

1. **instructors** - преподаватели
2. **workshops** - мастер-классы
3. **workshop_schedules** - расписание мастер-классов
4. **workshop_registrations** - записи на мастер-классы

### Связи

- `workshops.instructor_id` → `instructors.id`
- `workshop_schedules.workshop_id` → `workshops.id`
- `workshop_registrations.workshop_id` → `workshops.id`
- `workshop_registrations.schedule_id` → `workshop_schedules.id`

### Автоматические функции

1. **Обновление timestamps** - автоматическое обновление `updated_at`
2. **Счетчик участников** - автоматическое обновление `current_participants`

## RLS (Row Level Security) политики

### Доступ к данным

- **Чтение**: все таблицы доступны для чтения всем пользователям
- **Запись**: только аутентифицированные пользователи могут создавать/изменять данные
- **Записи на мастер-классы**: могут создавать все пользователи (включая неаутентифицированных)

### Политики безопасности

```sql
-- Преподаватели
- SELECT: все пользователи
- INSERT/UPDATE/DELETE: только аутентифицированные

-- Мастер-классы
- SELECT: все пользователи
- INSERT/UPDATE/DELETE: только аутентифицированные

-- Расписание
- SELECT: все пользователи
- INSERT/UPDATE/DELETE: только аутентифицированные

-- Записи
- SELECT: все пользователи
- INSERT: все пользователи
- UPDATE/DELETE: только аутентифицированные
```

## Интеграция с приложением

### Store

Все store уже настроены для работы с базой данных:

- `instructorStore.ts` - управление преподавателями
- `workshopStore.ts` - управление мастер-классами и расписанием
- `workshopRegistrationStore.ts` - управление записями

### Компоненты

Все компоненты используют store для работы с данными:

- `InstructorsPage.tsx` - страница преподавателей
- `WorkshopsPage.tsx` - страница мастер-классов
- `WorkshopRegistrationsPage.tsx` - страница записей

## Тестирование

### Проверка подключения

1. Запустите приложение: `npm start`
2. Перейдите на страницу мастер-классов
3. Убедитесь, что данные загружаются

### Проверка функциональности

1. **Создание записи**:
   - Откройте мастер-класс
   - Нажмите "Записаться"
   - Заполните форму
   - Проверьте, что запись появилась в списке

2. **Управление записями**:
   - Перейдите на страницу записей
   - Проверьте фильтрацию и поиск
   - Измените статус записи

## Устранение неполадок

### Ошибки подключения

```
Error: Invalid API key
```
**Решение**: Проверьте переменные окружения в `.env.local`

### Ошибки RLS

```
Error: new row violates row-level security policy
```
**Решение**: Убедитесь, что пользователь аутентифицирован

### Пустые данные

```
No data returned
```
**Решение**: 
1. Проверьте, что схема применена
2. Добавьте тестовые данные
3. Проверьте RLS политики

## Мониторинг

### Supabase Dashboard

Используйте Supabase Dashboard для:
- Просмотра данных в таблицах
- Мониторинга производительности
- Просмотра логов

### Логи приложения

Проверьте консоль браузера на наличие ошибок:
- Ошибки API запросов
- Проблемы с аутентификацией
- Ошибки валидации

## Резервное копирование

### Экспорт данных

```sql
-- Экспорт всех данных
COPY instructors TO '/tmp/instructors.csv' WITH CSV HEADER;
COPY workshops TO '/tmp/workshops.csv' WITH CSV HEADER;
COPY workshop_schedules TO '/tmp/workshop_schedules.csv' WITH CSV HEADER;
COPY workshop_registrations TO '/tmp/workshop_registrations.csv' WITH CSV HEADER;
```

### Импорт данных

```sql
-- Импорт данных
COPY instructors FROM '/tmp/instructors.csv' WITH CSV HEADER;
COPY workshops FROM '/tmp/workshops.csv' WITH CSV HEADER;
COPY workshop_schedules FROM '/tmp/workshop_schedules.csv' WITH CSV HEADER;
COPY workshop_registrations FROM '/tmp/workshop_registrations.csv' WITH CSV HEADER;
```

## Обновления

При обновлении схемы:

1. Создайте резервную копию данных
2. Примените новую схему
3. Проверьте работоспособность
4. Восстановите данные при необходимости
