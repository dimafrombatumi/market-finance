// Простой тест для проверки подключения к Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mjnodvgpspxdvkdmfjfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbm9kdmdwc3B4ZHZrZG1mamZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTY3NTIsImV4cCI6MjA3NDM3Mjc1Mn0.VoZLZzKLhjwRUH6UpX51PwJ0rwH8PjJbS4cBT9Arci0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Тест подключения к таблице products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.error('Error fetching products:', productsError);
      return;
    }
    
    console.log('✅ Products table connection successful');
    console.log('Products found:', products.length);
    if (products.length > 0) {
      console.log('Sample product:', products[0]);
    }
    
    // Тест подключения к таблице transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .limit(5);
    
    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError);
      return;
    }
    
    console.log('✅ Transactions table connection successful');
    console.log('Transactions found:', transactions.length);
    if (transactions.length > 0) {
      console.log('Sample transaction:', transactions[0]);
    }
    
    // Тест подключения к таблице sales
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('*')
      .limit(5);
    
    if (salesError) {
      console.error('Error fetching sales:', salesError);
      return;
    }
    
    console.log('✅ Sales table connection successful');
    console.log('Sales found:', sales.length);
    if (sales.length > 0) {
      console.log('Sample sale:', sales[0]);
    }
    
    console.log('\n🎉 All database connections successful!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();
