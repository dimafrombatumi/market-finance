// Скрипт для попытки добавления данных с аутентификацией
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mjnodvgpspxdvkdmfjfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbm9kdmdwc3B4ZHZrZG1mamZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTY3NTIsImV4cCI6MjA3NDM3Mjc1Mn0.VoZLZzKLhjwRUH6UpX51PwJ0rwH8PjJbS4cBT9Arci0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function tryInsertWithAuth() {
  try {
    console.log('Trying to insert data with authentication...');
    
    // Попробуем аутентифицироваться как анонимный пользователь
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    
    if (authError) {
      console.log('Auth error:', authError);
      console.log('Trying without auth...');
    } else {
      console.log('Auth successful:', authData);
    }
    
    // Попробуем добавить продукт
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
      
      // Попробуем добавить через upsert
      console.log('Trying upsert...');
      const { data: upsertData, error: upsertError } = await supabase
        .from('products')
        .upsert(product)
        .select();
      
      if (upsertError) {
        console.error('Upsert error:', upsertError);
      } else {
        console.log('✅ Upsert successful:', upsertData);
      }
    } else {
      console.log('✅ Product inserted successfully:', data);
    }
    
  } catch (error) {
    console.error('❌ Failed to insert data:', error);
  }
}

tryInsertWithAuth();
