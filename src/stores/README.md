# Zustand Stores

Этот проект использует Zustand для управления состоянием. Все stores находятся в папке `src/stores/`.

## Структура Stores

### 1. ProductStore (`productStore.ts`)
Управляет продуктами магазина.

**Состояние:**
- `products: Product[]` - список всех продуктов
- `loading: boolean` - состояние загрузки
- `error: string | null` - ошибки

**Основные методы:**
- `fetchProducts()` - загрузка продуктов
- `addProduct(productData)` - добавление продукта
- `updateProduct(id, productData)` - обновление продукта
- `deleteProduct(id)` - удаление продукта
- `searchProducts(query)` - поиск продуктов
- `getLowStockProducts()` - получение продуктов с низким запасом

**Пример использования:**
```tsx
import { useProductStore } from '../stores';

function ProductList() {
  const { products, searchProducts, deleteProduct } = useProductStore();
  
  const handleSearch = (query: string) => {
    const results = searchProducts(query);
    // Обработка результатов
  };
  
  const handleDelete = (id: string) => {
    deleteProduct(id);
  };
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          {product.name}
          <button onClick={() => handleDelete(product.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### 2. SalesStore (`salesStore.ts`)
Управляет продажами.

**Состояние:**
- `sales: Sale[]` - список всех продаж
- `loading: boolean` - состояние загрузки
- `error: string | null` - ошибки

**Основные методы:**
- `fetchSales()` - загрузка продаж
- `addSale(saleData)` - добавление продажи
- `updateSale(id, saleData)` - обновление продажи
- `deleteSale(id)` - удаление продажи
- `getTotalRevenue()` - получение общей выручки
- `getSalesByDateRange(start, end)` - продажи за период

### 3. TransactionStore (`transactionStore.ts`)
Управляет транзакциями (доходы и расходы).

**Состояние:**
- `transactions: Transaction[]` - список всех транзакций
- `loading: boolean` - состояние загрузки
- `error: string | null` - ошибки

**Основные методы:**
- `fetchTransactions()` - загрузка транзакций
- `addTransaction(transactionData)` - добавление транзакции
- `getTransactionsByType(type)` - получение транзакций по типу
- `getTotalIncome()` - получение общего дохода
- `getTotalExpenses()` - получение общих расходов
- `getNetProfit()` - получение чистой прибыли

### 4. DashboardStore (`dashboardStore.ts`)
Объединяет данные из других stores для дашборда.

**Основные методы:**
- `getDashboardData()` - получение всех данных дашборда
- `getTotalRevenue()` - общая выручка
- `getTotalExpenses()` - общие расходы
- `getNetProfit()` - чистая прибыль
- `getLowStockItems()` - товары с низким запасом
- `getRecentTransactions()` - последние транзакции

## Преимущества Zustand

1. **Простота** - минимальный boilerplate код
2. **TypeScript поддержка** - полная типизация
3. **DevTools** - интеграция с Redux DevTools
4. **Производительность** - оптимизированные ре-рендеры
5. **Гибкость** - можно использовать как глобальное состояние или локальное

## Паттерны использования

### Подписка на изменения
```tsx
function Component() {
  const products = useProductStore(state => state.products);
  // Компонент будет перерендериваться только при изменении products
}
```

### Селекторы
```tsx
function Component() {
  const lowStockProducts = useProductStore(state => 
    state.products.filter(p => p.stockQuantity <= p.minStockLevel)
  );
}
```

### Действия
```tsx
function Component() {
  const addProduct = useProductStore(state => state.addProduct);
  
  const handleAdd = () => {
    addProduct({
      name: 'New Product',
      price: 100,
      // ... другие поля
    });
  };
}
```

## Миграция с других решений

Если вы мигрируете с Redux или Context API:

1. **Redux** → Zustand: Actions становятся методами store
2. **Context API** → Zustand: useState/useReducer заменяются на store методы
3. **Local State** → Zustand: Локальное состояние выносится в store при необходимости

## Лучшие практики

1. **Разделение ответственности** - каждый store отвечает за свою область
2. **Иммутабельность** - всегда создавайте новые объекты при обновлении
3. **Селекторы** - используйте селекторы для оптимизации производительности
4. **Обработка ошибок** - всегда обрабатывайте ошибки в store методах
5. **Типизация** - используйте TypeScript для безопасности типов
