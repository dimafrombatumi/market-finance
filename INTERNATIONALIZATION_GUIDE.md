# 🌍 Руководство по интернационализации

## ✅ Система переводов успешно добавлена!

Ваше приложение теперь поддерживает два языка:
- 🇺🇸 **Английский** (по умолчанию)
- 🇷🇺 **Русский**

## 🚀 Как это работает:

### 1. **Переключатель языка**
- Находится в правом верхнем углу в Header
- Показывает текущий язык с флагом
- Сохраняет выбор в localStorage

### 2. **Автоматическое определение языка**
- При первом заходе определяет язык браузера
- Если русский - переключается на русский
- Иначе остается английский

### 3. **Переведенные компоненты:**
- ✅ **Header** - навигация, поиск, кнопки
- ✅ **Sidebar** - меню навигации
- ✅ **LoginPage** - страница входа
- ✅ **LoginForm** - форма авторизации
- ✅ **ProductsPage** - страница товаров
- ✅ **LanguageSwitcher** - переключатель языка

## 📁 Структура файлов:

```
src/
├── i18n/
│   ├── index.ts              # Конфигурация i18next
│   └── locales/
│       ├── en.json           # Английские переводы
│       └── ru.json           # Русские переводы
├── contexts/
│   └── LanguageContext.tsx   # Контекст для управления языком
└── components/
    └── common/
        └── LanguageSwitcher.tsx # Компонент переключателя
```

## 🔧 Как добавить новые переводы:

### 1. **Добавьте ключ в файлы переводов:**

**src/i18n/locales/en.json:**
```json
{
  "newSection": {
    "title": "New Section",
    "description": "This is a new section"
  }
}
```

**src/i18n/locales/ru.json:**
```json
{
  "newSection": {
    "title": "Новый раздел",
    "description": "Это новый раздел"
  }
}
```

### 2. **Используйте в компоненте:**

```tsx
import { useLanguage } from '../contexts/LanguageContext';

const MyComponent = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('newSection.title')}</h1>
      <p>{t('newSection.description')}</p>
    </div>
  );
};
```

## 🎯 Доступные ключи переводов:

### **Общие (common):**
- `add`, `edit`, `delete`, `save`, `cancel`, `confirm`
- `loading`, `search`, `name`, `description`, `price`, `cost`
- `category`, `quantity`, `total`, `date`, `notes`, `status`

### **Навигация (navigation):**
- `dashboard`, `products`, `sales`, `expenses`, `reports`

### **Авторизация (auth):**
- `login`, `register`, `logout`, `welcomeBack`
- `email`, `password`, `forgotPassword`

### **Товары (products):**
- `title`, `addProduct`, `editProduct`, `deleteProduct`
- `productName`, `productDescription`, `stockQuantity`
- `lowStock`, `inStock`, `noProducts`

### **Продажи (sales):**
- `title`, `addSale`, `customerInfo`, `customerName`
- `paymentMethod`, `subtotal`, `taxAmount`

### **Транзакции (transactions):**
- `title`, `addTransaction`, `income`, `expense`
- `amount`, `transactionDescription`

## 🔄 Как переключать язык программно:

```tsx
import { useLanguage } from '../contexts/LanguageContext';

const MyComponent = () => {
  const { changeLanguage, currentLanguage } = useLanguage();
  
  const switchToRussian = () => {
    changeLanguage('ru');
  };
  
  const switchToEnglish = () => {
    changeLanguage('en');
  };
  
  return (
    <div>
      <p>Current language: {currentLanguage}</p>
      <button onClick={switchToRussian}>Русский</button>
      <button onClick={switchToEnglish}>English</button>
    </div>
  );
};
```

## 🌟 Особенности:

### **Интерполяция переменных:**
```json
{
  "welcome": "Welcome, {{name}}!"
}
```

```tsx
t('welcome', { name: 'John' }) // "Welcome, John!"
```

### **Множественные формы:**
```json
{
  "items": "{{count}} item",
  "items_plural": "{{count}} items"
}
```

### **Вложенные ключи:**
```json
{
  "user": {
    "profile": {
      "name": "Name",
      "email": "Email"
    }
  }
}
```

```tsx
t('user.profile.name') // "Name"
```

## 🎉 Готово к использованию!

Система переводов полностью интегрирована и готова к работе. Пользователи могут переключаться между языками, и их выбор будет сохранен для следующих посещений.

**Для добавления переводов в другие компоненты просто импортируйте `useLanguage` и используйте функцию `t()`!**
