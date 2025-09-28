// Скрипт для добавления одного продукта в Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mjnodvgpspxdvkdmfjfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbm9kdmdwc3B4ZHZrZG1mamZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTY3NTIsImV4cCI6MjA3NDM3Mjc1Mn0.VoZLZzKLhjwRUH6UpX51PwJ0rwH8PjJbS4cBT9Arci0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addSingleProduct() {
  try {
    console.log('Adding single product...');
    
    const product = {
      name: 'Test Product',
      description: 'A test product for development',
      price: 19.99,
      cost: 10.00,
      category: 'Test',
      stock_quantity: 10,
      min_stock_level: 2
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select();
    
    if (error) {
      console.error('Error inserting product:', error);
      console.log('Error details:', JSON.stringify(error, null, 2));
      return;
    }
    
    console.log('✅ Product inserted successfully:', data);
    
  } catch (error) {
    console.error('❌ Failed to add product:', error);
  }
}

addSingleProduct();
