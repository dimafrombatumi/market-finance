# Инструкция по настройке авторизации

## Что было добавлено

### 1. Компоненты авторизации
- **`src/contexts/AuthContext.tsx`** - контекст для управления состоянием авторизации
- **`src/components/auth/LoginForm.tsx`** - форма входа/регистрации
- **`src/pages/LoginPage.tsx`** - страница авторизации
- **`src/components/common/LoadingScreen.tsx`** - экран загрузки

### 2. Обновленные компоненты
- **`src/App.tsx`** - добавлена маршрутизация и защита маршрутов
- **`src/components/layout/Header.tsx`** - кнопки входа/выхода
- **`src/components/layout/Layout.tsx`** - убран Router (перенесен в App)
- **`src/index.css`** - добавлены CSS анимации

## Функциональность

### ✅ Реализовано:
1. **Авторизация через email/пароль** с помощью Supabase Auth
2. **Регистрация новых пользователей**
3. **Восстановление пароля** через email
4. **Защита маршрутов** - неавторизованные пользователи перенаправляются на /login
5. **Автоматическое перенаправление** после успешного входа
6. **Красивый UI** с анимациями и валидацией
7. **Состояние загрузки** во время проверки авторизации

### 🔧 Как использовать:

1. **Запустите приложение:**
   ```bash
   npm start
   ```

2. **Откройте http://localhost:3000** - вас перенаправит на страницу входа

3. **Создайте аккаунт:**
   - Нажмите "Don't have an account? Sign up"
   - Введите email и пароль
   - Проверьте email для подтверждения

4. **Войдите в систему:**
   - Введите email и пароль
   - Нажмите "Sign In"

5. **Восстановление пароля:**
   - На странице входа нажмите "Forgot your password?"
   - Введите email
   - Проверьте email для сброса пароля

## Настройка Supabase

### 1. Включите Email Auth в Supabase Dashboard:
1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. Перейдите в Authentication → Settings
4. Включите "Enable email confirmations"

### 2. Настройте URL для подтверждения:
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/**`

### 3. Настройте RLS (если нужно):
```sql
-- Отключить RLS для разработки
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
```

## Безопасность

- Все маршруты защищены авторизацией
- Пароли хешируются Supabase
- Сессии автоматически обновляются
- Автоматический выход при истечении сессии

## Следующие шаги

1. Настройте email провайдера в Supabase для отправки писем
2. Добавьте роли пользователей (admin, manager, etc.)
3. Настройте RLS политики для разных ролей
4. Добавьте двухфакторную аутентификацию (опционально)
