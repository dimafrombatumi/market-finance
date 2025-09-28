// Скрипт для добавления тестовых продаж в Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mjnodvgpspxdvkdmfjfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbm9kdmdwc3B4ZHZrZG1mamZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTY3NTIsImV4cCI6MjA3NDM3Mjc1Mn0.VoZLZzKLhjwRUH6UpX51PwJ0rwH8PjJbS4cBT9Arci0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTestSales() {
  try {
    console.log('🛒 Adding test sales...');
    
    // Сначала проверим, есть ли продукты
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }
    
    if (!products || products.length === 0) {
      console.log('⚠️ No products found. Please add products first.');
      console.log('Run: node setup-products-db.js');
      return;
    }
    
    console.log(`✅ Found ${products.length} products`);
    
    // Создаем тестовые продажи
    const sales = [
      {
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
        notes: 'Customer was very satisfied with the quality',
        status: 'completed'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440202',
        sale_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        customer_name: 'Jane Smith',
        customer_email: 'jane@example.com',
        customer_phone: '+1234567891',
        subtotal: 90.00,
        tax_amount: 7.20,
        discount_amount: 5.00,
        total_amount: 92.20,
        payment_method: 'cash',
        notes: 'Regular customer, gave 5% discount',
        status: 'completed'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440203',
        sale_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        customer_name: 'Mike Johnson',
        customer_email: 'mike@example.com',
        customer_phone: '+1234567892',
        subtotal: 35.50,
        tax_amount: 2.84,
        discount_amount: 0.00,
        total_amount: 38.34,
        payment_method: 'online',
        notes: 'Online order, shipped next day',
        status: 'completed'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440204',
        sale_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        customer_name: 'Sarah Wilson',
        customer_email: 'sarah@example.com',
        customer_phone: '+1234567893',
        subtotal: 150.00,
        tax_amount: 12.00,
        discount_amount: 10.00,
        total_amount: 152.00,
        payment_method: 'card',
        notes: 'Bulk order for wedding gifts',
        status: 'completed'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440205',
        sale_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        customer_name: 'David Brown',
        customer_email: 'david@example.com',
        customer_phone: '+1234567894',
        subtotal: 65.00,
        tax_amount: 5.20,
        discount_amount: 0.00,
        total_amount: 70.20,
        payment_method: 'cash',
        notes: 'Walk-in customer, very interested in leather goods',
        status: 'completed'
      }
    ];
    
    // Добавляем продажи
    const { data: salesData, error: salesError } = await supabase
      .from('sales')
      .insert(sales)
      .select();
    
    if (salesError) {
      console.error('❌ Error inserting sales:', salesError);
      console.log('\n🔧 RLS is blocking insertions. Please:');
      console.log('1. Go to Supabase Dashboard → SQL Editor');
      console.log('2. Run: ALTER TABLE sales DISABLE ROW LEVEL SECURITY;');
      console.log('3. Run: ALTER TABLE sale_items DISABLE ROW LEVEL SECURITY;');
      console.log('4. Run this script again');
      return;
    }
    
    console.log('✅ Sales inserted successfully!');
    
    // Теперь добавляем элементы продаж
    const saleItems = [
      // Sale 1: John Doe - 3 ceramic mugs
      {
        sale_id: '550e8400-e29b-41d4-a716-446655440201',
        product_id: products[0].id,
        product_name: products[0].name,
        quantity: 3,
        unit_price: 25.99,
        total_price: 77.97
      },
      // Sale 2: Jane Smith - 2 cutting boards
      {
        sale_id: '550e8400-e29b-41d4-a716-446655440202',
        product_id: products[1].id,
        product_name: products[1].name,
        quantity: 2,
        unit_price: 45.00,
        total_price: 90.00
      },
      // Sale 3: Mike Johnson - 1 scarf
      {
        sale_id: '550e8400-e29b-41d4-a716-446655440203',
        product_id: products[2].id,
        product_name: products[2].name,
        quantity: 1,
        unit_price: 35.50,
        total_price: 35.50
      },
      // Sale 4: Sarah Wilson - 4 soap sets
      {
        sale_id: '550e8400-e29b-41d4-a716-446655440204',
        product_id: products[3].id,
        product_name: products[3].name,
        quantity: 8,
        unit_price: 18.75,
        total_price: 150.00
      },
      // Sale 5: David Brown - 1 wallet
      {
        sale_id: '550e8400-e29b-41d4-a716-446655440205',
        product_id: products[4].id,
        product_name: products[4].name,
        quantity: 1,
        unit_price: 65.00,
        total_price: 65.00
      }
    ];
    
    const { data: itemsData, error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems)
      .select();
    
    if (itemsError) {
      console.error('❌ Error inserting sale items:', itemsError);
      return;
    }
    
    console.log('✅ Sale items inserted successfully!');
    console.log(`Added ${salesData.length} sales with ${itemsData.length} items:`);
    
    salesData.forEach((sale, index) => {
      console.log(`${index + 1}. ${sale.customer_name} - $${sale.total_amount} (${sale.payment_method})`);
    });
    
    // Рассчитываем общую статистику
    const totalRevenue = salesData.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
    const totalItems = itemsData.reduce((sum, item) => sum + item.quantity, 0);
    
    console.log(`\n📊 Sales Summary:`);
    console.log(`Total Revenue: $${totalRevenue.toFixed(2)}`);
    console.log(`Total Items Sold: ${totalItems}`);
    console.log(`Average Sale: $${(totalRevenue / salesData.length).toFixed(2)}`);
    
    // Проверим, что продажи добавились
    console.log('\n🔍 Verifying sales...');
    const { data: allSales, error: fetchError } = await supabase
      .from('sales')
      .select('*')
      .order('sale_date', { ascending: false });
    
    if (fetchError) {
      console.error('❌ Error fetching sales:', fetchError);
      return;
    }
    
    console.log(`✅ Found ${allSales.length} sales in database`);
    
    console.log('\n🎉 Sales setup complete!');
    console.log('Now you can add sales through the web interface.');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

addTestSales();
