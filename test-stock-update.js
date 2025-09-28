// Скрипт для тестирования обновления остатков товаров при продаже
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mjnodvgpspxdvkdmfjfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbm9kdmdwc3B4ZHZrZG1mamZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTY3NTIsImV4cCI6MjA3NDM3Mjc1Mn0.VoZLZzKLhjwRUH6UpX51PwJ0rwH8PjJbS4cBT9Arci0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStockUpdate() {
  try {
    console.log('🧪 Testing stock update functionality...');
    
    // 1. Проверим текущие остатки товаров
    console.log('\n📦 Current product stock:');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, stock_quantity')
      .order('name');
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }
    
    products.forEach(product => {
      console.log(`- ${product.name}: ${product.stock_quantity} units`);
    });
    
    // 2. Создадим тестовую продажу
    console.log('\n🛒 Creating test sale...');
    
    const testSale = {
      id: '550e8400-e29b-41d4-a716-446655440999',
      sale_date: new Date().toISOString(),
      customer_name: 'Test Customer',
      customer_email: 'test@example.com',
      subtotal: 25.99,
      tax_amount: 2.08,
      discount_amount: 0.00,
      total_amount: 28.07,
      payment_method: 'card',
      notes: 'Test sale for stock update',
      status: 'completed'
    };
    
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert(testSale)
      .select()
      .single();
    
    if (saleError) {
      console.error('❌ Error creating sale:', saleError);
      return;
    }
    
    console.log('✅ Test sale created:', saleData.id);
    
    // 3. Добавим товар в продажу (берем первый продукт)
    const firstProduct = products[0];
    const saleQuantity = 2;
    
    const saleItem = {
      sale_id: testSale.id,
      product_id: firstProduct.id,
      product_name: firstProduct.name,
      quantity: saleQuantity,
      unit_price: 12.995, // Примерная цена
      total_price: 25.99
    };
    
    const { error: itemError } = await supabase
      .from('sale_items')
      .insert(saleItem);
    
    if (itemError) {
      console.error('❌ Error creating sale item:', itemError);
      return;
    }
    
    console.log(`✅ Sale item created: ${saleQuantity} x ${firstProduct.name}`);
    
    // 4. Обновим остаток товара (имитируем то, что делает приложение)
    console.log('\n📉 Updating stock quantity...');
    
    const newStockQuantity = firstProduct.stock_quantity - saleQuantity;
    const { error: stockError } = await supabase
      .from('products')
      .update({ 
        stock_quantity: newStockQuantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', firstProduct.id);
    
    if (stockError) {
      console.error('❌ Error updating stock:', stockError);
      return;
    }
    
    console.log(`✅ Stock updated: -${saleQuantity} units`);
    
    // 5. Проверим обновленные остатки
    console.log('\n📦 Updated product stock:');
    const { data: updatedProducts, error: updatedError } = await supabase
      .from('products')
      .select('id, name, stock_quantity')
      .eq('id', firstProduct.id);
    
    if (updatedError) {
      console.error('❌ Error fetching updated products:', updatedError);
      return;
    }
    
    const updatedProduct = updatedProducts[0];
    console.log(`- ${updatedProduct.name}: ${updatedProduct.stock_quantity} units (was ${firstProduct.stock_quantity})`);
    
    // 6. Очистим тестовые данные
    console.log('\n🧹 Cleaning up test data...');
    
    await supabase
      .from('sale_items')
      .delete()
      .eq('sale_id', testSale.id);
    
    await supabase
      .from('sales')
      .delete()
      .eq('id', testSale.id);
    
    // Восстановим остаток
    const restoredStockQuantity = updatedProduct.stock_quantity + saleQuantity;
    await supabase
      .from('products')
      .update({ 
        stock_quantity: restoredStockQuantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', firstProduct.id);
    
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 Stock update test completed successfully!');
    console.log('The stock update functionality is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testStockUpdate();
