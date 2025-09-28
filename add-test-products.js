// Скрипт для добавления тестовых продуктов после отключения RLS
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mjnodvgpspxdvkdmfjfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbm9kdmdwc3B4ZHZrZG1mamZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTY3NTIsImV4cCI6MjA3NDM3Mjc1Mn0.VoZLZzKLhjwRUH6UpX51PwJ0rwH8PjJbS4cBT9Arci0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTestProducts() {
  try {
    console.log('Adding test products...');
    
    const products = [
      {
        name: 'Handmade Ceramic Mug',
        description: 'Beautiful handcrafted ceramic mug with unique glaze',
        price: 25.99,
        cost: 12.50,
        category: 'Kitchen & Dining',
        stock_quantity: 15,
        min_stock_level: 5,
        sku: 'MUG-001'
      },
      {
        name: 'Wooden Cutting Board',
        description: 'Premium oak cutting board with natural finish',
        price: 45.00,
        cost: 22.00,
        category: 'Kitchen & Dining',
        stock_quantity: 8,
        min_stock_level: 3,
        sku: 'WB-002'
      },
      {
        name: 'Handwoven Scarf',
        description: 'Soft wool scarf in earth tones',
        price: 35.50,
        cost: 18.00,
        category: 'Clothing',
        stock_quantity: 2,
        min_stock_level: 5,
        sku: 'SC-003'
      },
      {
        name: 'Artisan Soap Set',
        description: 'Handmade soap with natural ingredients',
        price: 18.75,
        cost: 9.00,
        category: 'Personal Care',
        stock_quantity: 12,
        min_stock_level: 4,
        sku: 'SOAP-004'
      },
      {
        name: 'Leather Wallet',
        description: 'Genuine leather wallet with multiple card slots',
        price: 65.00,
        cost: 32.50,
        category: 'Accessories',
        stock_quantity: 6,
        min_stock_level: 2,
        sku: 'WALLET-005'
      }
    ];
    
    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select();
    
    if (error) {
      console.error('❌ Error inserting products:', error);
      console.log('\n💡 Возможные решения:');
      console.log('1. Отключите RLS в Supabase Dashboard (SQL Editor):');
      console.log('   ALTER TABLE products DISABLE ROW LEVEL SECURITY;');
      console.log('2. Или добавьте данные через веб-интерфейс Supabase');
      console.log('3. См. ADD_PRODUCTS_INSTRUCTIONS.md для подробных инструкций');
      return;
    }
    
    console.log('✅ Products inserted successfully!');
    console.log(`Added ${data.length} products:`);
    data.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price}`);
    });
    
    console.log('\n🎉 Теперь продукты должны отображаться на странице Products!');
    
  } catch (error) {
    console.error('❌ Failed to add products:', error);
  }
}

addTestProducts();
