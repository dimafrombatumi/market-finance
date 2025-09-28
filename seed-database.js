// Скрипт для добавления тестовых данных в Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mjnodvgpspxdvkdmfjfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbm9kdmdwc3B4ZHZrZG1mamZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTY3NTIsImV4cCI6MjA3NDM3Mjc1Mn0.VoZLZzKLhjwRUH6UpX51PwJ0rwH8PjJbS4cBT9Arci0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  try {
    console.log('Seeding database with test data...');
    
    // Добавляем тестовые продукты
    const products = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
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
        id: '550e8400-e29b-41d4-a716-446655440002',
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
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Handwoven Scarf',
        description: 'Soft wool scarf in earth tones',
        price: 35.50,
        cost: 18.00,
        category: 'Clothing',
        stock_quantity: 2,
        min_stock_level: 5,
        sku: 'SC-003'
      }
    ];
    
    const { error: productsError } = await supabase
      .from('products')
      .insert(products);
    
    if (productsError) {
      console.error('Error inserting products:', productsError);
      return;
    }
    
    console.log('✅ Products inserted successfully');
    
    // Добавляем тестовые транзакции
    const transactions = [
      {
        id: '550e8400-e29b-41d4-a716-446655440101',
        type: 'expense',
        category: 'Materials & Supplies',
        description: 'Clay and glaze materials',
        amount: 150.00,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Bulk order for ceramic production'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440102',
        type: 'expense',
        category: 'Rent & Utilities',
        description: 'Studio rent',
        amount: 800.00,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: ''
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440103',
        type: 'income',
        category: 'Other Income',
        description: 'Workshop teaching fee',
        amount: 200.00,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        notes: ''
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440104',
        type: 'income',
        category: 'Sales Revenue',
        description: 'Sale of ceramic mugs',
        amount: 77.97,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Sold 3 ceramic mugs'
      }
    ];
    
    const { error: transactionsError } = await supabase
      .from('transactions')
      .insert(transactions);
    
    if (transactionsError) {
      console.error('Error inserting transactions:', transactionsError);
      return;
    }
    
    console.log('✅ Transactions inserted successfully');
    
    // Добавляем тестовую продажу
    const sale = {
      id: '550e8400-e29b-41d4-a716-446655440201',
      sale_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      customer_phone: '+1234567890',
      subtotal: 77.97,
      tax_amount: 6.24,
      discount_amount: 0.00,
      total_amount: 84.21,
      payment_method: 'card',
      notes: 'Customer was very satisfied',
      status: 'completed'
    };
    
    const { error: saleError } = await supabase
      .from('sales')
      .insert(sale);
    
    if (saleError) {
      console.error('Error inserting sale:', saleError);
      return;
    }
    
    console.log('✅ Sale inserted successfully');
    
    // Добавляем элементы продажи
    const saleItems = [
      {
        sale_id: '550e8400-e29b-41d4-a716-446655440201',
        product_id: '550e8400-e29b-41d4-a716-446655440001',
        product_name: 'Handmade Ceramic Mug',
        quantity: 3,
        unit_price: 25.99,
        total_price: 77.97
      }
    ];
    
    const { error: saleItemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);
    
    if (saleItemsError) {
      console.error('Error inserting sale items:', saleItemsError);
      return;
    }
    
    console.log('✅ Sale items inserted successfully');
    
    console.log('\n🎉 Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedDatabase();
