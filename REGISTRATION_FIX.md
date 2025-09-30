# Исправление проблемы с сохранением регистраций на мастер-классы

## Проблема
Регистрации на мастер-классы не сохранялись в базу данных.

## Причина
Основная проблема была в неправильном маппинге полей между формой (camelCase) и базой данных (snake_case). Использование spread operator `...registrationData` не работало, так как поля имели разные названия.

## Решение

### 1. **Исправлен маппинг полей в функции `addRegistration`**

**Было:**
```javascript
const { data, error } = await supabase
  .from('workshop_registrations')
  .insert([{
    ...registrationData,  // ← Проблема: неправильный маппинг
    total_amount: totalAmount,
    registration_date: new Date().toISOString(),
  }])
```

**Стало:**
```javascript
const { data, error } = await supabase
  .from('workshop_registrations')
  .insert([{
    workshop_id: registrationData.workshopId,
    schedule_id: registrationData.scheduleId,
    customer_name: registrationData.customerName,
    customer_email: registrationData.customerEmail,
    customer_phone: registrationData.customerPhone,
    payment_method: registrationData.paymentMethod,
    total_amount: totalAmount,
    registration_date: new Date().toISOString(),
    notes: registrationData.notes,
    special_requests: registrationData.specialRequests,
    emergency_contact_name: registrationData.emergencyContactName,
    emergency_contact_phone: registrationData.emergencyContactPhone,
    dietary_restrictions: registrationData.dietaryRestrictions,
  }])
```

### 2. **Исправлен маппинг в функции `updateRegistration`**

**Было:**
```javascript
const { data, error } = await supabase
  .from('workshop_registrations')
  .update(registrationData)  // ← Проблема: неправильный маппинг
```

**Стало:**
```javascript
// Map form data to database fields
const updateData: any = {};
if (registrationData.customerName) updateData.customer_name = registrationData.customerName;
if (registrationData.customerEmail) updateData.customer_email = registrationData.customerEmail;
// ... и так далее для всех полей

const { data, error } = await supabase
  .from('workshop_registrations')
  .update(updateData)
```

### 3. **Исправлен маппинг в функции `fetchRegistrations`**

**Было:**
```javascript
const registrations = data?.map(registration => ({
  ...registration,
  registrationDate: new Date(registration.registration_date),
}))
```

**Стало:**
```javascript
const registrations = data?.map(registration => ({
  ...registration,
  workshopId: registration.workshop_id,
  scheduleId: registration.schedule_id,
  customerName: registration.customer_name,
  customerEmail: registration.customer_email,
  customerPhone: registration.customer_phone,
  paymentMethod: registration.payment_method,
  totalAmount: registration.total_amount,
  paidAmount: registration.paid_amount,
  refundAmount: registration.refund_amount,
  specialRequests: registration.special_requests,
  emergencyContactName: registration.emergency_contact_name,
  emergencyContactPhone: registration.emergency_contact_phone,
  dietaryRestrictions: registration.dietary_restrictions,
  registrationDate: new Date(registration.registration_date),
}))
```

### 4. **Исправлены все функции обновления**

Аналогичные исправления применены к:
- `updateRegistrationStatus`
- `updatePaymentStatus`

## Технические детали

### Маппинг полей БД ↔ Код:
- `workshop_id` ↔ `workshopId`
- `schedule_id` ↔ `scheduleId`
- `customer_name` ↔ `customerName`
- `customer_email` ↔ `customerEmail`
- `customer_phone` ↔ `customerPhone`
- `payment_method` ↔ `paymentMethod`
- `total_amount` ↔ `totalAmount`
- `paid_amount` ↔ `paidAmount`
- `refund_amount` ↔ `refundAmount`
- `special_requests` ↔ `specialRequests`
- `emergency_contact_name` ↔ `emergencyContactName`
- `emergency_contact_phone` ↔ `emergencyContactPhone`
- `dietary_restrictions` ↔ `dietaryRestrictions`
- `registration_date` ↔ `registrationDate`

### Обязательные поля в БД:
- `customer_name` (VARCHAR(255) NOT NULL)
- `customer_email` (VARCHAR(255) NOT NULL)
- `payment_method` (VARCHAR(20) NOT NULL)
- `total_amount` (DECIMAL(10,2) NOT NULL)

## Результат

- ✅ **Регистрации сохраняются** в базу данных
- ✅ **Регистрации отображаются** в списке
- ✅ **Обновление регистраций** работает корректно
- ✅ **Изменение статусов** работает корректно
- ✅ **Все поля** правильно маппятся между формой и БД

## Файлы изменены

**`src/stores/workshopRegistrationStore.ts`**:
- Исправлен маппинг в `addRegistration`
- Исправлен маппинг в `updateRegistration`
- Исправлен маппинг в `fetchRegistrations`
- Исправлен маппинг в `updateRegistrationStatus`
- Исправлен маппинг в `updatePaymentStatus`

## Как проверить

1. Откройте страницу мастер-классов
2. Нажмите кнопку "Записаться" на любом мастер-классе
3. Заполните форму регистрации:
   - ✅ **Имя клиента** - обязательно
   - ✅ **Email клиента** - обязательно
   - ✅ **Способ оплаты** - обязательно
4. Нажмите "Записаться"
5. Увидите регистрацию в списке записей

Теперь регистрации на мастер-классы работают полностью корректно!
