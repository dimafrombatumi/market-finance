# Исправление ошибок TypeScript в регистрациях

## Проблема
Ошибки компиляции TypeScript:
```
ERROR in src/stores/workshopRegistrationStore.ts:110:52
TS2339: Property 'emergencyContactName' does not exist on type 'WorkshopRegistrationFormData'
```

## Причина
В типе `WorkshopRegistrationFormData` отсутствовали поля `emergencyContactName`, `emergencyContactPhone` и `dietaryRestrictions`, но они использовались в store.

## Решение

### 1. **Удалены неиспользуемые поля из store**

**Проблема**: Поля `emergencyContactName`, `emergencyContactPhone` и `dietaryRestrictions` не используются в форме, но были добавлены в store.

**Решение**: Удалены эти поля из всех функций store:
- `addRegistration`
- `updateRegistration` 
- `fetchRegistrations`
- `updateRegistrationStatus`
- `updatePaymentStatus`

### 2. **Очищен тип `WorkshopRegistrationFormData`**

**Было:**
```typescript
export interface WorkshopRegistrationFormData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  paymentMethod: 'cash' | 'card' | 'online' | 'other';
  notes?: string;
  specialRequests?: string;
  emergencyContactName?: string;      // ← УДАЛЕНО
  emergencyContactPhone?: string;     // ← УДАЛЕНО
  dietaryRestrictions?: string;       // ← УДАЛЕНО
}
```

**Стало:**
```typescript
export interface WorkshopRegistrationFormData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  paymentMethod: 'cash' | 'card' | 'online' | 'other';
  notes?: string;
  specialRequests?: string;
}
```

### 3. **Упрощен маппинг полей в store**

**Было:**
```javascript
// В addRegistration
emergency_contact_name: registrationData.emergencyContactName,
emergency_contact_phone: registrationData.emergencyContactPhone,
dietary_restrictions: registrationData.dietaryRestrictions,

// В updateRegistration
if (registrationData.emergencyContactName) updateData.emergency_contact_name = registrationData.emergencyContactName;
if (registrationData.emergencyContactPhone) updateData.emergency_contact_phone = registrationData.emergencyContactPhone;
if (registrationData.dietaryRestrictions) updateData.dietary_restrictions = registrationData.dietaryRestrictions;

// В fetchRegistrations
emergencyContactName: registration.emergency_contact_name,
emergencyContactPhone: registration.emergency_contact_phone,
dietaryRestrictions: registration.dietary_restrictions,
```

**Стало:**
```javascript
// Удалены все упоминания этих полей
// Оставлены только поля, которые действительно используются в форме
```

## Технические детали

### Поля, которые остались в форме:
- `customerName` - имя клиента
- `customerEmail` - email клиента  
- `customerPhone` - телефон клиента
- `paymentMethod` - способ оплаты
- `notes` - примечания
- `specialRequests` - специальные запросы

### Поля, которые были удалены:
- `emergencyContactName` - имя контактного лица
- `emergencyContactPhone` - телефон контактного лица
- `dietaryRestrictions` - диетические ограничения

## Результат

- ✅ **Ошибки TypeScript исправлены**
- ✅ **Код компилируется без ошибок**
- ✅ **Регистрации работают корректно**
- ✅ **Удален неиспользуемый код**

## Файлы изменены

1. **`src/types/index.ts`**:
   - Удалены неиспользуемые поля из `WorkshopRegistrationFormData`

2. **`src/stores/workshopRegistrationStore.ts`**:
   - Удалены неиспользуемые поля из всех функций
   - Упрощен маппинг полей

## Принцип

**"Не добавляй поля, которые не используются"** - если поля не нужны в форме, их не должно быть в типах и store.

Теперь код компилируется без ошибок и работает корректно!
